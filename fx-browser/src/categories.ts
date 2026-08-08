import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import * as path from "reaper-api/path/path";
import { SETTINGS } from "./settings";

type FxInfo = { ident: string; type: number };

function fxUid(fx: FxInfo): string {
  return `${fx.type}\n${fx.ident}`;
}

type InstalledFxNameInfo = { prefix: string | null; name: string };

type FolderRef = { id: string; name: string };

type Category = { category: string; folders: FolderRef[] };

type FxEntry = {
  uid: string;
  ident: string;
  displayName: string;
  type: number;
  prefix: string | null;
  isInstrument: boolean | null;
};

/**
 * Load the raw data from installed FX and parse it into a map from ident to info.
 *
 * The plugin display name may be renamed by the user
 */
function parseInstalledFx() {
  const installedFx = loadInstalledFX();

  const index: Record<string, InstalledFxNameInfo | undefined> = {};

  for (const fx of installedFx) {
    const colonIndex = fx.displayName.indexOf(": ");
    if (colonIndex === -1) {
      index[fx.ident] = {
        name: fx.displayName,
        prefix: null,
      };
    } else {
      index[fx.ident] = {
        name: fx.displayName.slice(colonIndex + 2, fx.displayName.length),
        prefix: fx.displayName.slice(0, colonIndex),
      };
    }
  }

  return index;
}

export function getCategories() {
  const FOLDER_NAMES_IGNORED = SETTINGS.get("fxfolders_ignored_folders");
  const FOLDER_NAME_FAVOURITES = SETTINGS.get("fxfolders_favourite_folder");
  const DEFAULT_CATEGORY = SETTINGS.get("fxfolders_default_category");
  const CATEGORY_SEPARATOR = SETTINGS.get("fxfolders_separator");

  const installedFxIndex = parseInstalledFx();
  const folders = loadFXFolders();

  // variables to be returned:

  /**
   * map from category name to folders (folder name is split into category/stem)
   * (actually a list to preserve insertion order)
   */
  const categories: Category[] = [];
  function getCategory(name: string): Category {
    const existing = categories.find((x) => x.category === name);
    if (existing) return existing;

    const result: Category = { category: name, folders: [] };
    categories.push(result);
    return result;
  }
  /** map from folder ID to FX UID set */
  const folderFx: Record<string, LuaSet<string>> = {};
  /** set of fx UIDs */
  const favouriteFx: LuaSet<string> = new LuaSet();
  /** map from fx UID to info */
  const fxMap: Record<string, FxEntry> = {};

  // there can only be 1 favourites folder
  // only handle the first "Favourites" folder, ignore all others
  let favouriteFolderId: string | null = null;

  for (const folder of folders) {
    // skip ignored folders
    if (FOLDER_NAMES_IGNORED.includes(folder.name)) continue;
    // skip empty folders
    if (folder.items.length === 0) continue;
    // skip smart folders
    if (
      folder.items.length === 1 &&
      folder.items[0].type === FXFolderItemType.Smart
    ) {
      continue;
    }

    // determine what category is this folder?
    let targetSet: LuaSet<string>;
    if (folder.name === FOLDER_NAME_FAVOURITES && favouriteFolderId === null) {
      // 1. Favourites
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
          displayName: path.split(fx.ident)[1],
          type: fx.type,
          prefix: "FXChain",
          isInstrument: false,
        };
        continue;
      }

      // check if the ident is found in Reaper
      const installed = installedFxIndex[fx.ident];
      if (!installed) continue;

      // parse FX and add to FX map
      targetSet.add(uid);
      fxMap[uid] = {
        uid,
        ident: fx.ident,
        displayName: installed.name,
        type: fx.type,
        prefix: installed.prefix,
        isInstrument: installed.prefix?.endsWith("i") ?? null,
      };
    }
  }

  return {
    /** list of categories and its folder IDs */
    categories,
    /** map from folder name to FX list */
    folderFx,
    /** set of all favourited FX */
    favouriteFx,
    /** map from fx UID to combined info from fx folders + installed fx */
    fxInfo: fxMap,
  };
}
