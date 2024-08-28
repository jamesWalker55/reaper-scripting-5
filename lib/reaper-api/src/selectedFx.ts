import { FX, getLastTouchedFx } from "./fx";
import { assertUnreachable, ensureAPI } from "./utils";

ensureAPI("SWS Extensions", "CF_GetTakeFXChain");
ensureAPI("SWS Extensions", "CF_GetTrackFXChainEx");
ensureAPI("SWS Extensions", "CF_EnumSelectedFX");

/**
 * Uses getLastTouchedFx to find the last-touched FX, then the selected FX in that window.
 *
 * This doesn't support indexing inside containers. If a container is selected, this will
 * simply return the container itself.
 */
export function getSelectedFx(): FX[] {
  const fx = getLastTouchedFx();
  if (!fx) return [];

  let chain: FxChain;
  let isInputChain = false;
  switch (fx.obj.type) {
    case "take": {
      chain = reaper.CF_GetTakeFXChain(fx.obj.take);
      break;
    }
    case "track": {
      // 0x1000000 indicates either:
      // 1. record input FX (normal tracks)
      // 2. hardware output FX (master track)
      isInputChain = (fx.fxidx & 0x1000000) !== 0;
      chain = reaper.CF_GetTrackFXChainEx(0, fx.obj.track, isInputChain);
      break;
    }
    default:
      assertUnreachable(fx.obj);
  }

  let idx = -1;
  // these idx don't have special offsets, i.e. no 0x1000000
  const selectedIdx = [];
  while (true) {
    idx = reaper.CF_EnumSelectedFX(chain, idx);
    if (idx === -1) break;

    selectedIdx.push(idx);
  }

  return selectedIdx.map((idx) => {
    switch (fx.obj.type) {
      case "take": {
        return new FX({ take: fx.obj.take }, idx);
      }
      case "track": {
        if (isInputChain) {
          return new FX({ track: fx.obj.track }, idx + 0x1000000);
        } else {
          return new FX({ track: fx.obj.track }, idx);
        }
      }
      default:
        assertUnreachable(fx.obj);
    }
  });
}
