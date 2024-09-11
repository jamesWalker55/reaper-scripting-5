AddCwdToImportPaths();

import { encode } from "json";
import { copy } from "reaper-api/clipboard";
import { OSType } from "reaper-api/ffi";
import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import { deferAsync, errorHandler, log } from "reaper-api/utils";

enum LimitedFXType {
  JS,
  VST,
  CLAP,
  FXChain,
  ReWire,
  BuiltIn,
}

function createUid(ident: string, type: LimitedFXType) {
  return `${type}\n${ident}`;
}

async function main() {
  while (true) {
    // set of all fx in folders
    const folderUids: Record<
      string,
      ReturnType<typeof loadFXFolders>[number]["items"][number]
    > = {};
    const fxfolders = loadFXFolders();
    {
      const TYPE_MAP: Record<number, LimitedFXType> = {
        [FXFolderItemType.JS]: LimitedFXType.JS,
        [FXFolderItemType.VST]: LimitedFXType.VST,
        [FXFolderItemType.CLAP]: LimitedFXType.CLAP,
        [FXFolderItemType.FXChain]: LimitedFXType.FXChain,
        [FXFolderItemType.ReWire]: LimitedFXType.ReWire,
        [FXFolderItemType.VideoProcessor]: LimitedFXType.BuiltIn,
        [FXFolderItemType.Container]: LimitedFXType.BuiltIn,
      };
      for (const folder of fxfolders) {
        for (const item of folder.items) {
          // skip smart folders
          if (
            folder.items.length === 1 &&
            folder.items[0].type === FXFolderItemType.Smart
          ) {
            continue;
          }

          if (!(item.type in TYPE_MAP))
            throw new Error(
              `unknown folder item type ${item.type}: ${inspect(item)}`,
            );

          const uid = createUid(item.ident, TYPE_MAP[item.type]);
          folderUids[uid] = item;
        }
      }
    }

    // set of all installed uid
    const installedFx = loadInstalledFX();
    const installedUid: Record<
      string,
      ReturnType<typeof loadInstalledFX>[number]
    > = {};
    {
      const BUILTIN_FX = {
        ["Video processor"]: true,
        Container: true,
      } as const;
      for (const fx of installedFx) {
        let type: LimitedFXType;

        if (fx.displayName in BUILTIN_FX) {
          type = LimitedFXType.BuiltIn;
        } else {
          const colonIndex = fx.displayName.indexOf(": ");
          if (colonIndex === -1) {
            // throw new Error(`FX has no prefix: ${inspect(fx)}`);
            log(`FX has no prefix: ${inspect(fx)}`);
            continue;
          }

          // const name = fx.displayName.slice(colonIndex + 2, fx.displayName.length);
          const prefix = fx.displayName.slice(0, colonIndex);

          if (prefix.startsWith("VST")) {
            type = LimitedFXType.VST;
          } else if (prefix === "JS") {
            type = LimitedFXType.JS;
          } else if (prefix.startsWith("CLAP")) {
            type = LimitedFXType.CLAP;
          } else if (prefix === "ReWire") {
            type = LimitedFXType.ReWire;
            // ident is also prefixed with colon for some reason, remove it
            if (fx.ident.startsWith("ReWire: ")) {
              fx.ident = fx.ident.slice("ReWire: ".length, fx.ident.length);
            }
          } else {
            // throw new Error(`Not implemented type ${inspect(prefix)}`);
            log(`Not implemented type ${inspect(prefix)}`);
            continue;
          }
        }

        const uid = createUid(fx.ident, type);
        installedUid[uid] = fx;
      }
    }

    // find fx not in any folder
    const uncategorizedFxNames = [];
    for (const [uid, fx] of Object.entries(installedUid)) {
      if (uid in folderUids) continue;

      // log(fx.displayName)
      uncategorizedFxNames.push(fx.displayName);
    }
    uncategorizedFxNames.sort((a, b) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });

    // // find FXChains in folders
    // const fxchains = [];
    // for (const [uid, fx] of Object.entries(folderUids)) {
    //   if (fx.type !== FXFolderItemType.FXChain) continue;
    //   if (uid in installedUid) continue;

    //   fxchains.push(fx.ident);
    // }
    // fxchains.sort((a, b) => {
    //   a = a.toLowerCase();
    //   b = b.toLowerCase();
    //   if (a > b) {
    //     return 1;
    //   } else if (a < b) {
    //     return -1;
    //   } else {
    //     return 0;
    //   }
    // });

    // clear console
    reaper.ShowConsoleMsg("");
    if (uncategorizedFxNames.length === 0) {
      log("All FX have been categorized! :)");
      return;
    } else {
      for (const name of uncategorizedFxNames) {
        log(name);
      }
    }
    // log("\nFX chains:");
    // for (const name of fxchains) {
    //   log(name);
    // }

    for (let i = 0; i < 10; i++) {
      await deferAsync();
    }
  }
}

errorHandler(main);
