import { getLastTouchedFx } from "reaper-api/fx";
import { Take, Track } from "reaper-api/track";
import { assertUnreachable, msgBox } from "reaper-api/utils";

export const LAST_TOUCHED_FX = (() => {
  const fx = getLastTouchedFx();
  if (!fx) {
    msgBox("No FX selected", "Failed to get last touched FX");
    throw new Error("Failed to get last touched FX");
  }
  return fx;
})();

export const lookupParamIdentifier = (() => {
  type ReturnType = {
    name: string;
    ident: string;
    preferIdent: boolean;
  };

  const allFx = (() => {
    switch (LAST_TOUCHED_FX.obj.type) {
      case "track": {
        const track = new Track(LAST_TOUCHED_FX.obj.track);
        return track.getAllFx();
      }
      case "take": {
        const take = new Take(LAST_TOUCHED_FX.obj.take);
        return take.getAllFx();
      }
      default:
        assertUnreachable(LAST_TOUCHED_FX.obj);
    }
  })();

  const cache: (ReturnType[] | null)[] = [];
  for (let i = 0; i < allFx.length; i++) {
    cache.push(null);
  }

  return (fxidx: number, param: number) => {
    if (fxidx < 0 || fxidx >= allFx.length) {
      throw new Error("fxidx out of bounds");
    }
    const fx = allFx[fxidx];

    if (cache[fxidx] === null) {
      // get all params and write to cache
      const paramInfo = fx
        .getParameters()
        .map((x) => ({ name: x.getName(), ident: x.getIdent() }));

      const seenNames = new Set();
      const duplicateNames = new Set();
      for (const param of paramInfo) {
        if (seenNames.has(param.name)) {
          duplicateNames.add(param.name);
        } else {
          seenNames.add(param.name);
        }
      }

      const fxIdents = paramInfo.map((x) => ({
        name: x.name,
        ident: x.ident,
        preferIdent: duplicateNames.has(x.name),
      }));
      cache[fxidx] = fxIdents;
    }
    const cacheEntry = cache[fxidx];
    if (param < 0 || param >= cacheEntry.length) {
      throw new Error("param out of bounds");
    }

    return cacheEntry[param];
    // return 0 as any as ReturnType;
  };
})();
