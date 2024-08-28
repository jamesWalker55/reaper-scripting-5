AddCwdToImportPaths();

import { MenuItem, MenuItemKind, showMenu } from "reaper-api/menu";
import * as path from "reaper-api/path/path";
import {
  assertUnreachable,
  errorHandler,
  log,
  readFile,
} from "reaper-api/utils";
import { splitlines } from "reaper-api/utilsLua";

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
  // for future reaper versions
  Unknown,
}

function classifySection(sectionId: number): SectionGroup {
  if (sectionId < 32060) {
    return SectionGroup.Main;
  } else if (sectionId < 32063) {
    return SectionGroup.MIDIEditor;
  } else if (sectionId === 32063) {
    return SectionGroup.MediaExplorer;
  } else {
    return SectionGroup.Unknown;
  }
}

function parseSameLevelItems(revLines: string[]): MenuItem<{ cmd: number }>[] {
  // if list is empty, return immediately
  if (revLines.length === 0) return [];

  // use indent level from the next (last) item
  const expectedIndentLevel = string.match(
    revLines[revLines.length - 1],
    "^ *",
  )[0].length;

  const result: MenuItem<{ cmd: number }>[] = [];

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
      result.push({ kind: MenuItemKind.Muted, name, cmd: -1 });
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
      case SectionGroup.Unknown: {
        // assume it's main for now
        reaper.Main_OnCommandEx(selectedItem.cmd, 0, 0);
        break;
      }
      default:
        assertUnreachable(sectionGroup);
    }
  }
}

function main() {
  const [
    is_new_value,
    filename,
    sectionID,
    cmdID,
    mode,
    resolution,
    val,
    contextstr,
  ] = reaper.get_action_context();

  const menuPath = path.splitext(filename)[0] + ".txt";
  if (!reaper.file_exists(menuPath)) {
    throw new Error(
      `Menu definition file cannot be found, please create a file at: ${menuPath}`,
    );
  }

  const menuText = readFile(menuPath);

  showPlainTextMenu(sectionID, splitlines(menuText));
}

errorHandler(main);
