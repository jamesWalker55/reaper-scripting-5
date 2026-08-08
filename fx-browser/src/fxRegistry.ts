import { FXFolderItemType } from "reaper-api/installedFx";
import * as path from "reaper-api/path/path";
import {
  FxEntry,
  FxInfo,
  fxUid,
  InstalledFxNameInfo,
} from "./categoryTypes";

/**
 * Resolves one FX folder item (as found in fxfolders.ini) against the
 * installed-FX index, and registers it into `fxMap` + `targetSet` if valid.
 * FXChains are handled specially since they aren't reported by loadInstalledFX().
 */
export function registerFxItem(
  fx: FxInfo,
  installedFxIndex: Record<string, InstalledFxNameInfo | undefined>,
  fxMap: Record<string, FxEntry>,
  targetSet: LuaSet<string>,
) {
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
    return;
  }

  // check if the ident is found in Reaper
  const installed = installedFxIndex[fx.ident];
  if (!installed) return;

  // parse FX and add to FX map
  targetSet.add(uid);
  fxMap[uid] = {
    uid,
    ident: fx.ident,
    name: installed.name,
    type: fx.type,
    prefix: installed.prefix,
    isInstrument: installed.prefix?.endsWith("i") ?? null,
  };
}
