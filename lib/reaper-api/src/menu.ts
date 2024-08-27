import { assertUnreachable } from "./utils";

export enum MenuItemKind {
  Normal,
  Muted,
  Separator,
  Submenu,
}

type NormalItem = {
  kind: MenuItemKind.Normal;
  name: string;
  checked?: boolean;
};

type MutedItem = {
  kind: MenuItemKind.Muted;
  name: string;
  checked?: boolean;
};

type SeparatorItem = {
  kind: MenuItemKind.Separator;
};

type SubMenu = {
  kind: MenuItemKind.Submenu;
  name: string;
  checked?: boolean;
  children: MenuItem[];
};

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

function buildMenu(items: MenuItem[]) {
  // list of items that will be indexed using `gfx.showmenu`'s return value
  const flatItems: FlattenedMenuItem[] = [];
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
        flatItems.push(...rv.items);
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

export function showMenu(items: MenuItem[]) {
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
