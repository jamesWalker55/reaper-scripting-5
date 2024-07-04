import { ensureAPI } from "reaper-api/utils";

ensureAPI("js_ReaScriptAPI", "JS_ListView_ListAllSelItems");
ensureAPI("js_ReaScriptAPI", "JS_Window_Find");
ensureAPI("js_ReaScriptAPI", "JS_Window_FindChildByID");

/**
 * Search a window for selected items. Intended for the FX chain window to find selected FXs.
 *
 * @param windowTitle The title of the window to search for selected items
 * @returns List of item indexes
 */
function getSelectedIndexesInWindow(windowTitle: string) {
  const FX_win = reaper.JS_Window_Find(windowTitle, true);
  if (FX_win === null) return null;

  const list = reaper.JS_Window_FindChildByID(FX_win, 1076);
  if (list === null) return null;

  const [selectedCount, fxCsv] = reaper.JS_ListView_ListAllSelItems(list);
  if (selectedCount === 0) return [];

  return fxCsv.split(",").map((x) => tonumber(x)) as number[];
}

/**
 * Find the GUID of all selected FX in the focused FX chain window.
 *
 * Issues:
 * - Relies on English title of FX chain windows
 * - If you have multiple FX chain windows of untitled items, this cannot differentiate between them
 * @returns
 */
export function getSelectedFx() {
  const [retval, trackidx, itemidx, takeidx, fxidx, parm] =
    reaper.GetTouchedOrFocusedFX(1);
  if (!retval) return null;

  const isMaster = trackidx === -1;
  const track = isMaster
    ? reaper.GetMasterTrack(0)
    : reaper.GetTrack(0, trackidx);

  if (itemidx === -1) {
    // track FX
    let windowTitle: string;
    if (isMaster) {
      windowTitle = "FX: Master Track";
    } else {
      const [_, trackName] = reaper.GetSetMediaTrackInfo_String(
        track,
        "P_NAME",
        "",
        false,
      );
      windowTitle =
        trackName === ""
          ? `FX: Track ${trackidx + 1}`
          : `FX: Track ${trackidx + 1} "${trackName}"`;
    }
    const indexes = getSelectedIndexesInWindow(windowTitle);
    if (indexes === null) return null;

    const guids = indexes.map((idx) => reaper.TrackFX_GetFXGUID(track, idx));
    return {
      type: "take" as const,
      obj: track,
      guids: guids,
    };
  } else {
    // item FX
    const item = reaper.GetTrackMediaItem(track, itemidx);
    const take = reaper.GetTake(item, takeidx);
    const takeName = reaper.GetTakeName(take);
    if (takeName === null) return null;

    const windowTitle = takeName === "" ? "FX: Item" : `FX: Item "${takeName}"`;
    const indexes = getSelectedIndexesInWindow(windowTitle);
    if (indexes === null) return null;

    const guids = indexes.map((idx) => reaper.TakeFX_GetFXGUID(take, idx));
    return {
      type: "take" as const,
      obj: take,
      guids: guids,
    };
  }
}
