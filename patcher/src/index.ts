import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import {
  FX,
  getLastTouchedFx,
  parseTakeContainerFxidx,
  parseTrackContainerFxidx,
  parseFxidx,
  generateFxidx,
} from "reaper-api/fx";
import { Track } from "reaper-api/track";
import { deferAsync, errorHandler, log } from "reaper-api/utils";

/**
 * From the currently-focused FX, return what container we should be working on.
 *
 * If `location` is null, then that indicates root of track/item (i.e. no container)
 */
function getWorkingLocation() {
  const fx = getLastTouchedFx();
  if (fx === null) return null;

  if (fx.isContainer()) {
    return { location: fx, focus: null };
  }

  const parent = fx.parentContainer();
  if (parent === null) {
    return { location: null, focus: fx };
  }

  return { location: parent, focus: fx };
}

function getFxPaths(
  fx: FX,
  fxpath: number[],
): { fxidx: number; fxpath: number[]; name: string }[] {
  const rv = [{ fxidx: fx.fxidx, fxpath: fxpath, name: fx.getName() }];

  const children = fx.childrenFX();
  if (!children) return rv;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childpaths = getFxPaths(child, [...fxpath, i]);
    rv.push(...childpaths);
  }

  return rv;
}

async function main() {
  while (true) {
    await deferAsync();
    log("==============================");

    // const loc = getWorkingLocation();
    // if (loc) {
    //   loc.focus = loc?.focus?.fxidx as any
    //   loc.location = loc?.location?.fxidx as any
    // }
    // log("loc", loc);

    // const fx = getLastTouchedFx();
    // if (!fx) {
    //   log("no fx");
    //   continue;
    // }

    const track = Track.getLastTouched();
    if (!track) {
      log("no track");
      continue;
    }

    function agshdas(paths: ReturnType<typeof getFxPaths>) {
      // fxidx to path obj
      const pathmap = Object.fromEntries(
        paths.map((x) => [x.fxidx & 0x0ffffff, x]),
      );
      const maxIdx = Math.max(0, ...paths.map((x) => x.fxidx & 0x0ffffff));
      for (let i = 0; i <= maxIdx; i++) {
        const pathobj = pathmap[i];
        if (!pathobj) {
          // log(i);
          continue;
        }

        const { fxidx, fxpath, name } = pathobj;
        const parsed = parseFxidx({ track: track!.obj, fxidx });
        const regen = generateFxidx({
          track: track!.obj,
          path: parsed.path,
          flags: parsed.flags,
        });
        log(
          i,
          fxpath,
          parseFxidx({ track: track!.obj, fxidx }).path,
          fxidx & 0x0ffffff,
          regen & 0x0ffffff,
          // (fxidx & 0xf000000).toString(2),
        );
      }
    }
    {
      log("= FX");
      const paths = track.getAllFx().flatMap((fx, i) => getFxPaths(fx, [i]));
      agshdas(paths);
      // paths.sort((a, b) => a.fxidx - b.fxidx);
      // for (const { fxidx, fxpath, name } of paths) {
      //   log(fxpath, fxidx & 0x0ffffff, name);
      // }
    }
    {
      log("= Rec FX");
      const paths = track.getAllRecFx().flatMap((fx, i) => getFxPaths(fx, [i]));
      agshdas(paths);
      // paths.sort((a, b) => a.fxidx - b.fxidx);
      // for (const { fxidx, fxpath, name } of paths) {
      //   log(fxpath, fxidx & 0x0ffffff, name);
      // }
    }
  }
}

errorHandler(main);
