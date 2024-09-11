import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import * as path from "reaper-api/path/path";

const FOLDER_NAME_FAVOURITES = "Favourites";
const DEFAULT_CATEGORY = "Default";

export type FxInfo = { ident: string; type: number };

export function fxUid(fx: FxInfo): string {
  return `${fx.type}\n${fx.ident}`;
}

const CATEGORY_SEPARATOR = "\\";

export function getCategories() {
  // get initial data
  const fxfolders = loadFXFolders();

  const fxNames: Record<
    string,
    { prefix: string | null; name: string } | undefined
  > = {};
  for (const fx of loadInstalledFX()) {
    const colonIndex = fx.displayName.indexOf(": ");
    if (colonIndex === -1) {
      fxNames[fx.ident] = {
        name: fx.displayName,
        prefix: null,
      };
    } else {
      fxNames[fx.ident] = {
        name: fx.displayName.slice(colonIndex + 2, fx.displayName.length),
        prefix: fx.displayName.slice(0, colonIndex),
      };
    }
  }

  // processing to group data
  // =======
  // record of category name to folders, names split into category/stem
  const categories: {
    category: string;
    folders: { id: string; name: string }[];
  }[] = [];
  function getCategory(name: string) {
    const existing = categories.find((x) => x.category === name);
    if (existing) return existing;

    const result = { category: name, folders: [] };
    categories.push(result);
    return result;
  }
  // map from folder ID to FX set (serialised)
  const folderFx: Record<string, LuaSet<string>> = {};
  // a set of favourited FX (serialised)
  const favouriteFx: LuaSet<string> = new LuaSet();
  // map from stringified FX to its info
  const fxMap: Record<
    string,
    {
      uid: string;
      ident: string;
      name: string;
      type: number;
      prefix: string | null;
      isInstrument: boolean | null;
    }
  > = {};
  // =======
  for (const folder of fxfolders) {
    // skip empty folders
    if (folder.items.length === 0) continue;

    // skip smart folders
    if (
      folder.items.length === 1 &&
      folder.items[0].type === FXFolderItemType.Smart
    ) {
      continue;
    }

    // categorise the current folder
    let targetSet: LuaSet<string>;
    let favouriteFolderId: string | null = null;

    if (folder.name === FOLDER_NAME_FAVOURITES && favouriteFolderId === null) {
      // 1. Favourites
      // only handle the first "Favourites" folder, ignore all others
      favouriteFolderId = folder.id;
      const category = getCategory(DEFAULT_CATEGORY);
      category.folders.push({
        id: folder.id,
        name: FOLDER_NAME_FAVOURITES,
      });

      folderFx[folder.id] = favouriteFx;
      targetSet = favouriteFx;
    } else {
      // 2. Generic category
      const splitPos = folder.name.indexOf(CATEGORY_SEPARATOR);

      let categoryName = folder.name.substring(0, splitPos).trim();
      const stem = folder.name
        .substring(splitPos + 1, folder.name.length)
        .trim();

      if (categoryName.length === 0) categoryName = DEFAULT_CATEGORY;

      const category = getCategory(categoryName);
      category.folders.push({ id: folder.id, name: stem });

      folderFx[folder.id] ||= new LuaSet();
      targetSet = folderFx[folder.id];
    }

    for (const fx of folder.items) {
      const uid = fxUid(fx);

      if (fx.type === FXFolderItemType.FXChain) {
        // FXChain aren't listed in loadInstalledFX()
        // manually create a fake entry
        targetSet.add(uid);
        fxMap[uid] = {
          uid,
          ident: fx.ident,
          name: path.split(fx.ident)[1],
          type: fx.type,
          prefix: "FXChain",
          isInstrument: false,
        };
        continue;
      }

      // check if the ident is found in Reaper
      const display = fxNames[fx.ident];
      if (!display) continue;

      // parse FX and add to FX map
      targetSet.add(uid);
      fxMap[uid] = {
        uid,
        ident: fx.ident,
        name: display.name,
        type: fx.type,
        prefix: display.prefix,
        isInstrument: display.prefix?.endsWith("i") ?? null,
      };
    }
  }

  return {
    categories,
    folderFx,
    favouriteFx,
    fxMap,
  };
}
