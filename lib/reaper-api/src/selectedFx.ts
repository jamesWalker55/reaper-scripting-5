import { FX, getLastTouchedFx, TakeFX, TrackFX } from "./fx";
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
  switch (fx.type) {
    case "take": {
      chain = reaper.CF_GetTakeFXChain(fx.take);
      break;
    }
    case "track": {
      // 0x1000000 indicates either:
      // 1. record input FX (normal tracks)
      // 2. hardware output FX (master track)
      isInputChain = (fx.fxidx & 0x1000000) !== 0;
      chain = reaper.CF_GetTrackFXChainEx(0, fx.track, isInputChain);
      break;
    }
    default:
      assertUnreachable(fx);
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
    switch (fx.type) {
      case "take": {
        return new TakeFX(fx.take, idx);
      }
      case "track": {
        if (isInputChain) {
          return new TrackFX(fx.track, idx + 0x1000000);
        } else {
          return new TrackFX(fx.track, idx);
        }
      }
      default:
        assertUnreachable(fx);
    }
  });
}
