import { inspect } from "./inspect";
import { assertUnreachable, log } from "./utils";

export enum MenuItemKind {
  Normal,
  Muted,
  Separator,
  Submenu,
}

interface NormalItem {
  kind: MenuItemKind.Normal;
  name: string;
  checked?: boolean;
}

interface MutedItem {
  kind: MenuItemKind.Muted;
  name: string;
  checked?: boolean;
}

interface SeparatorItem {
  kind: MenuItemKind.Separator;
}

interface SubMenu {
  kind: MenuItemKind.Submenu;
  name: string;
  checked?: boolean;
  children: MenuItem[];
}

export type MenuItem = NormalItem | MutedItem | SeparatorItem | SubMenu;
type FlattenedMenuItem = NormalItem | MutedItem;

// These characters cannot appear at the start of an item name
const MODIFIER_CHARS = ["#", "!", ">", "<", "|"];

/** Given a name, get the length of the starting modifier characters, if any */
function modifierPrefixLength(name: string) {
  for (let i = 0; i < name.length; i++) {
    const char = name.charAt(i);
    if (!MODIFIER_CHARS.includes(char)) return i;
  }
  return name.length;
}

/** Replace all modifier characters with unicode lookalikes */
function replaceModifierCharacters(name: string): string {
  const [result] = string.gsub(name, "%S+", {
    "#": "＃",
    "!": "ǃ",
    ">": "＞",
    "<": "＜",
    "|": "ǀ",
  });
  return result;
}

/** Given a name, replace any prefix chars with unicode lookalikes */
function sanitizeItemName(name: string): string {
  const prefixLength = modifierPrefixLength(name);
  if (prefixLength === 0) return name;

  const prefix = name.slice(0, prefixLength);
  const suffix = name.slice(prefixLength, name.length);
  return replaceModifierCharacters(prefix) + suffix;
}

function parseSameLevelItems(revLines: string[]) {
  // if list is empty, return immediately
  if (revLines.length === 0) return [];

  // use indent level from the next (last) item
  const expectedIndentLevel = string.match(
    revLines[revLines.length - 1],
    "^ *",
  )[0].length;

  // export type MenuItem = NormalItem | MutedItem | SeparatorItem | SubMenu;
  type NormalCommandItem = NormalItem & { cmd: number };
  type CommandMenuItem =
    | NormalCommandItem
    | MutedItem
    | SeparatorItem
    | SubMenu;
  const result: CommandMenuItem[] = [];

  while (true) {
    let line = revLines.pop();
    if (line === undefined) return result;

    const indentLevel = string.match(line, "^ *")[0].length;
    if (indentLevel !== expectedIndentLevel) {
      // new indent level, push the line back into the list
      revLines.push(line);
      if (indentLevel < expectedIndentLevel) {
        // we reached end of current indent level
        return result;
      } else {
        // parsing further-indented level
        // last result must be a submenu
        const prevMenuItem = result[result.length - 1];
        if (prevMenuItem === undefined)
          throw new Error(
            `indented item must be preceded by a submenu item: ${line}`,
          );
        if (prevMenuItem.kind !== MenuItemKind.Submenu)
          throw new Error(
            `indented item must be preceded by a submenu item: ${line}`,
          );
        const childItems = parseSameLevelItems(revLines);
        prevMenuItem.children = childItems;
        continue;
      }
    }

    // line has the same indent level

    // match leading pound sign, e.g. '# hello', '   #  hello   '
    const commentPrefix = string.match(line, "^ *# *");
    if (commentPrefix.length > 0) {
      // is a comment (muted items)
      const name = line.slice(commentPrefix[0].length, line.length).trim();
      log(inspect(line), inspect(commentPrefix), inspect(name));
      result.push({ kind: MenuItemKind.Muted, name });
      continue;
    }

    // match ending colon, e.g. 'hello:', '   hello  : '
    const submenuSuffix = string.match(line, " *: *$");
    if (submenuSuffix.length > 0) {
      // is the beginning of a submenu
      const name = line.slice(0, line.length - submenuSuffix[0].length).trim();
      result.push({ kind: MenuItemKind.Submenu, name, children: [] });
      continue;
    }

    // match single string of hyphens, e.g. '---', '', '  --- '
    const hyphensOnly = string.match(line, "^ *-* *$");
    if (hyphensOnly.length > 0) {
      // is a separator
      result.push({ kind: MenuItemKind.Separator });
      continue;
    }

    // is a regular item
    // match ending square brackets, e.g. 'hello [12345]', '  hello  [ 12 adjk wqe ] '
    const commandSuffixMatch = string.match(line, "( *%[([^%[%]]*)%] *)$");
    if (commandSuffixMatch.length === 0) {
      throw new Error(`menu item is missing a command ID: ${line}`);
    }

    let commandSuffix: string;
    let commandId: number;
    let commandState: boolean | null;
    {
      const [suffix, id] = commandSuffixMatch;

      // suffix
      commandSuffix = suffix;

      // command id
      const numericId = tonumber(id);
      if (numericId !== undefined) {
        // is numeric command
        commandId = numericId;
      } else {
        // is a named command
        commandId = reaper.NamedCommandLookup(id);
        if (commandId === 0) {
          throw new Error(`command not found: ${id}`);
        }
      }

      // command state
      // TODO: Should I use `GetToggleCommandState` or `GetToggleCommandStateEx`?
      const state = reaper.GetToggleCommandState(commandId);
      if (state === 1) {
        commandState = true;
      } else if (state === 0) {
        commandState = false;
      } else {
        commandState = null;
      }
    }

    const name = line.slice(0, line.length - commandSuffix.length).trim();

    result.push({
      kind: MenuItemKind.Normal,
      name,
      cmd: commandId,
      checked: commandState === true,
    });
  }
}

function parsePlainTextMenu(lines: string[]) {
  lines.reverse();
  return parseSameLevelItems(lines);
}

function buildMenu<T extends MenuItem>(items: T[]) {
  // list of items that will be indexed using `gfx.showmenu`'s return value
  const flatItems: T[] = [];
  // list of strings to be joined with '|'
  const flatNames: string[] = [];

  for (const item of items) {
    switch (item.kind) {
      case MenuItemKind.Normal: {
        flatItems.push(item);
        if (item.checked) {
          flatNames.push(`!${sanitizeItemName(item.name)}`);
        } else {
          flatNames.push(`${sanitizeItemName(item.name)}`);
        }
        break;
      }
      case MenuItemKind.Muted: {
        flatItems.push(item);
        if (item.checked) {
          flatNames.push(`#!${sanitizeItemName(item.name)}`);
        } else {
          flatNames.push(`#${sanitizeItemName(item.name)}`);
        }
        break;
      }
      case MenuItemKind.Separator: {
        flatNames.push("");
        break;
      }
      case MenuItemKind.Submenu: {
        if (item.checked) {
          flatNames.push(`>!${sanitizeItemName(item.name)}`);
        } else {
          flatNames.push(`>${sanitizeItemName(item.name)}`);
        }
        const rv = buildMenu(item.children);
        {
          // edit the last name to start with a '<'
          let lastSubname = rv.names[rv.names.length - 1];
          lastSubname = `<${lastSubname}`;
          rv.names[rv.names.length - 1] = lastSubname;
        }
        flatItems.push(...(rv.items as any));
        flatNames.push(...rv.names);
        break;
      }
      default:
        assertUnreachable(item);
    }
  }

  return {
    items: flatItems,
    names: flatNames,
  };
}

export function showMenu<T extends MenuItem>(items: T[]): T | null {
  const menu = buildMenu(items);
  const menustring = menu.names.join("|");

  gfx.init("", 0, 0);
  gfx.x = gfx.mouse_x;
  gfx.y = gfx.mouse_y;

  const selectedIdx = gfx.showmenu(menustring) - 1;

  gfx.quit();

  if (selectedIdx === -1) return null;
  if (selectedIdx >= menu.items.length)
    throw new Error("selected index exceeds item count");

  return menu.items[selectedIdx];
}

enum SectionId {
  // main
  Main = 0,
  MainAlt1 = 1,
  MainAlt2 = 2,
  MainAlt3 = 3,
  MainAlt4 = 4,
  MainAlt5 = 5,
  MainAlt6 = 6,
  MainAlt7 = 7,
  MainAlt8 = 8,
  MainAlt9 = 9,
  MainAlt10 = 10,
  MainAlt11 = 11,
  MainAlt12 = 12,
  MainAlt13 = 13,
  MainAlt14 = 14,
  MainAlt15 = 15,
  MainAlt16 = 16,
  MainAltRecording = 100,
  // midi editors
  MIDIEditor = 32060,
  MIDIEventListEditor = 32061,
  MIDIInlineEditor = 32062,
  // media explorer
  MediaExplorer = 32063,
}

// generic section identifiers, not the Reaper section_id enums
enum SectionGroup {
  Main,
  MIDIEditor,
  MediaExplorer,
}

function classifySection(sectionId: number): SectionGroup {
  if (sectionId < 32060) {
    return SectionGroup.Main;
  } else if (sectionId === 32063) {
    return SectionGroup.MediaExplorer;
  } else {
    return SectionGroup.MIDIEditor;
  }
}

/**
 * NOTE: This consumes the `lines` object
 */
export function showPlainTextMenu(sectionId: number, lines: string[]) {
  const items = parsePlainTextMenu(lines);
  const selectedItem = showMenu(items);
  if (selectedItem !== null && selectedItem.kind === MenuItemKind.Normal) {
    const sectionGroup = classifySection(sectionId);
    switch (sectionGroup) {
      case SectionGroup.Main: {
        reaper.Main_OnCommandEx(selectedItem.cmd, 0, 0);
        break;
      }
      case SectionGroup.MIDIEditor: {
        reaper.MIDIEditor_LastFocused_OnCommand(selectedItem.cmd, false);
        break;
      }
      case SectionGroup.MediaExplorer: {
        const identifier = reaper.OpenMediaExplorer("", false);
        reaper.JS_Window_OnCommand(identifier as any, selectedItem.cmd);
        break;
      }
      default:
        assertUnreachable(sectionGroup);
    }
  }
}
