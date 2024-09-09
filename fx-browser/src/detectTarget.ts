import {
  parseTakeContainerFxidx,
  parseTrackContainerFxidx,
} from "reaper-api/fx";
import { Item } from "reaper-api/item";

const OS = reaper.GetOS();

function isWindows() {
  return OS.toLowerCase().startsWith("win");
}

function assertWindowsOnly() {
  if (!isWindows()) throw new Error("Only Windows is supported");
}

const FXCHAIN_WINDOW_TITLE_PREFIX = reaper.LocalizeString("FX: ", "fx", 0);

/**
 * Very hacky function to detect the FX Chain window being focused (if any).
 *
 * This returns the same type as `CF_GetFocusedFXChain`.
 *
 * Note: `identifier`, `HWND`, `FxChain` are all interchangable, they are just hwnds
 */
function getFocusedFxChainWin(): identifier | null {
  // the JS_Window classname and title functions only work correctly on Windows, see:
  // https://forum.cockos.com/showthread.php?t=213189
  assertWindowsOnly();

  for (
    let hwnd: identifier | null = reaper.JS_Window_GetFocus();
    hwnd !== null;
    hwnd = reaper.JS_Window_GetParent(hwnd)
  ) {
    const classname = reaper.JS_Window_GetClassName(hwnd);

    // // inputboxes have classname == "Edit", and their title is the content of the inputbox
    // // i.e. try renaming an item to have the name "FX:" and the `title` variable will be what you typed
    // if (classname === "Edit") continue;

    // '#32770' is a generic classname for dialog boxes
    // FX chains also happen to use this classname
    if (classname !== "#32770") continue;

    const title = reaper.JS_Window_GetTitle(hwnd);
    // very hacky implementation:
    // just check if any of the parent window titles start with "FX:"
    // only works with English locale but fuck it
    if (title.startsWith(FXCHAIN_WINDOW_TITLE_PREFIX)) {
      return hwnd;
    }
  }

  return null;
}

function arrangementIsFocusedWin(): boolean {
  // the JS_Window classname and title functions only work correctly on Windows, see:
  // https://forum.cockos.com/showthread.php?t=213189
  assertWindowsOnly();

  for (
    let hwnd: identifier | null = reaper.JS_Window_GetFocus();
    hwnd !== null;
    hwnd = reaper.JS_Window_GetParent(hwnd)
  ) {
    const classname = reaper.JS_Window_GetClassName(hwnd);

    if (classname === "REAPERTrackListWindow") return true;
  }

  return false;
}

export type FXTarget =
  | { target: "track"; track: MediaTrack; fxpath: number[] }
  | {
      target: "take";
      track: MediaTrack;
      item: MediaItem;
      take: MediaItem_Take;
      fxpath: number[];
    };

function getFXTargetWin(): FXTarget | null {
  // the JS_Window classname and title functions only work correctly on Windows, see:
  // https://forum.cockos.com/showthread.php?t=213189
  assertWindowsOnly();

  const focusedFxChain = getFocusedFxChainWin();
  if (focusedFxChain) {
    // we are currently focused on an fx chain, try to use `GetTouchedOrFocusedFX`

    // NOTE: `GetTouchedOrFocusedFX` will not detect the focused FX chain if the FX chain is empty, so you can't add FX to an empty fx chain
    const listview = reaper.JS_Window_FindChildByID(focusedFxChain, 1076);
    if (!listview)
      throw new Error("failed to find listview object in FX Chain window");

    const fxCount = reaper.JS_ListView_GetItemCount(listview);
    const fxChainIsEmpty = fxCount === 0;
    // TODO: Handle something when fxchain is empty, GetTouchedOrFocusedFX is not to be trusted

    const [ok, trackidx, itemidx, takeidx, fxidx, parm] =
      reaper.GetTouchedOrFocusedFX(1);
    if (!ok) throw new Error("failed to get last touched/focused FX");

    const track = reaper.GetTrack(0, trackidx);
    if (!track) throw new Error(`failed to get track ${trackidx}`);

    if (itemidx === -1) {
      // target the parent of the fx
      // can be an empty list (represents root fxchain)
      const fxpath = parseTrackContainerFxidx(track, fxidx);
      fxpath.pop();

      return {
        target: "track",
        // trackidx,
        track,
        fxpath,
      };
    } else {
      const item = reaper.GetTrackMediaItem(track, itemidx);
      if (!item)
        throw new Error(`failed to get item ${itemidx} on track ${trackidx}`);

      const take = reaper.GetTake(item, takeidx);
      if (!take)
        throw new Error(
          `failed to get take ${takeidx} from item ${itemidx} on track ${trackidx}`,
        );

      // target the parent of the fx
      // can be an empty list (represents root fxchain)
      const fxpath = parseTakeContainerFxidx(take, fxidx);
      fxpath.pop();

      return {
        target: "take",
        track,
        item,
        take,
        fxpath,
      };
    }
  }

  // no focused FX chain, determine if adding to track or take

  // if focus on arrange view, and only 1 item selected...
  // ...target that item
  if (arrangementIsFocusedWin()) {
    const selectedCount = reaper.CountSelectedMediaItems(0);
    if (selectedCount === 1) {
      const item = Item.getSelected()[0];
      const take = item.activeTake();
      if (take) {
        const track = reaper.GetMediaItemTrack(item.obj);

        return {
          target: "take",
          track: track,
          item: item.obj,
          take: take.obj,
          fxpath: [],
        };
      }
    }
  }

  // otherwise, target the last touched track
  const track = reaper.GetLastTouchedTrack();
  if (!track) return null;

  return {
    target: "track",
    track,
    fxpath: [],
  };
}

export function getFXTarget(): FXTarget | null {
  if (isWindows()) {
    return getFXTargetWin();
  }

  // fallback implementation
  // just insert to the last focused track
  const track = reaper.GetLastTouchedTrack();
  if (!track) return null;

  return {
    target: "track",
    track,
    fxpath: [],
  };
}
