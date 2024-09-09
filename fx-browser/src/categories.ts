import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";

const FOLDER_NAME_FAVOURITES = "Favourites";
const DEFAULT_CATEGORY = "Default";

type FolderInfo = { id: string; category: string; stem: string };

type FxInfo = { ident: string; type: number };

function serialiseFx(fx: FxInfo): string {
  return `${fx.type}\n${fx.ident}`;
}

function deserialiseFx(text: string): FxInfo {
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
  const fxfolders = loadFXFolders();

  const folders: Record<string, FolderInfo> = {};
  const folderFx: Record<string, LuaSet<string>> = {};
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

    folders[folder.id] = {
      id: folder.id,
      stem,
      category,
    };

    folderFx[folder.id] ||= new LuaSet();
    for (const fx of folder.items) {
      folderFx[folder.id].add(serialiseFx(fx));
    }
  }

  const fxNames: Record<string, string | undefined> = {};
  for (const fx of loadInstalledFX()) {
    fxNames[fx.ident] = fx.displayName;
  }

  return {
    folders,
    folderFx,
    favouriteFx,
    fxNames,
  };
}
