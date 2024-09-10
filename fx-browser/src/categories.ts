import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";

const FOLDER_NAME_FAVOURITES = "Favourites";
const DEFAULT_CATEGORY = "Default";

export type FxInfo = { ident: string; type: number };

export function serialiseFx(fx: FxInfo): string {
  return `${fx.type}\n${fx.ident}`;
}

export function deserialiseFx(text: string): FxInfo {
  const nlIndex = text.indexOf("\n");
  if (nlIndex === -1)
    throw new Error(`failed to deserialise fx: ${inspect(text)}`);

  const type = tonumber(text.slice(0, nlIndex));
  if (type === undefined)
    throw new Error(`failed to deserialise fx: ${inspect(text)}`);

  return {
    type,
    ident: text.slice(nlIndex + 1, text.length),
  };
}

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
  // record of category name to folders, names split into category/stem
  const categoriesMap: Record<string, { id: string; name: string }[]> = {};
  // map from folder ID to FX set (serialised)
  const folderFx: Record<string, LuaSet<string>> = {};
  // a set of favourited FX (serialised)
  const favouriteFx: LuaSet<string> = new LuaSet();
  for (const folder of fxfolders) {
    if (
      folder.items.length === 1 &&
      folder.items[0].type === FXFolderItemType.Smart
    ) {
      continue;
    }

    if (folder.name === FOLDER_NAME_FAVOURITES) {
      for (const fx of folder.items) {
        favouriteFx.add(serialiseFx(fx));
      }
      continue;
    }

    const splitPos = folder.name.indexOf("/");

    let category = folder.name.substring(0, splitPos);
    const stem = folder.name.substring(splitPos + 1, folder.name.length);

    if (category.length === 0) category = DEFAULT_CATEGORY;

    categoriesMap[category] ||= [];
    categoriesMap[category].push({ id: folder.id, name: stem });

    folderFx[folder.id] ||= new LuaSet();
    for (const fx of folder.items) {
      folderFx[folder.id].add(serialiseFx(fx));
    }
  }

  const categories = Object.entries(categoriesMap)
    .sort(([a, _], [b, _2]) => {
      // always sort the default category last
      if (a === DEFAULT_CATEGORY && b !== DEFAULT_CATEGORY) {
        return 1;
      } else if (a !== DEFAULT_CATEGORY && b === DEFAULT_CATEGORY) {
        return -1;
      } else if (a === DEFAULT_CATEGORY && b === DEFAULT_CATEGORY) {
        return 0;
      }

      // sort alphabetically
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    })
    .map(([category, folders]) => ({
      category,
      folders,
    }));

  return {
    categories,
    folderFx,
    favouriteFx,
    fxNames,
  };
}
