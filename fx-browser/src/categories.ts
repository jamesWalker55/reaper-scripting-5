import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import { SETTINGS } from "./settings";
import { Category, FxEntry } from "./categoryTypes";
import { buildInstalledFxIndex } from "./installedFxIndex";
import { splitFolderName } from "./folderCategory";
import { registerFxItem } from "./fxRegistry";

export * from "./categoryTypes";

export function getCategories() {
  const FOLDER_NAMES_IGNORED = SETTINGS.get("fxfolders_ignored_folders");
  const FOLDER_NAME_FAVOURITES = SETTINGS.get("fxfolders_favourite_folder");
  const DEFAULT_CATEGORY = SETTINGS.get("fxfolders_default_category");
  const CATEGORY_SEPARATOR = SETTINGS.get("fxfolders_separator");

  const installedFxIndex = buildInstalledFxIndex(loadInstalledFX());

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

  // there can only be 1 favourites folder - only the first folder named
  // FOLDER_NAME_FAVOURITES is treated as favourites, all later ones with the
  // same name are treated as regular (generic-category) folders instead
  let favouriteFolderId: string | null = null;

  for (const folder of loadFXFolders()) {
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
    if (
      folder.name === FOLDER_NAME_FAVOURITES &&
      favouriteFolderId === null
    ) {
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
      const { categoryName, stem } = splitFolderName(
        folder.name,
        CATEGORY_SEPARATOR,
        DEFAULT_CATEGORY,
      );

      const category = getCategory(categoryName);
      category.folders.push({ id: folder.id, name: stem });

      folderFx[folder.id] ||= new LuaSet();
      targetSet = folderFx[folder.id];
    }

    for (const fx of folder.items) {
      registerFxItem(fx, installedFxIndex, fxMap, targetSet);
    }
  }

  return {
    categories,
    folderFx,
    favouriteFx,
    fxMap,
  };
}
