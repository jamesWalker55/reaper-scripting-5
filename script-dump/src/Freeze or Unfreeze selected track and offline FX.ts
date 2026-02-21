AddCwdToImportPaths();

import { getProjectRoutingInfo, Item, Take, Track } from "reaper-api/track";
import {
  confirmBox,
  errorHandler,
  log,
  msgBox,
  runMainAction,
  undoBlock,
} from "reaper-api/utils";
import * as Chunk from "reaper-api/chunk";
import { copy } from "reaper-api/clipboard";
import { inspect } from "reaper-api/inspect";

const UNDO_MSG_FREEZE = "Freeze selected track and set all children FX offline";
const UNDO_MSG_UNFREEZE =
  "Unfreeze selected track and set all children FX online";

const ACTION_FREEZE_TO_STEREO = 41223;
const ACTION_UNFREEZE = 41644;
const ACTION_UNSELECT_ALL_TRACKS = 40297;
const ACTION_SELECT_TRACK_CHILDREN = "_SWS_SELCHILDREN2";
const ACTION_TRACK_FX_OFFLINE = 40535;
const ACTION_TRACK_FX_ONLINE = 40536;

function isFrozen(track: MediaTrack) {
  const [rv, chunk] = reaper.GetTrackStateChunk(track, "", false);
  if (!rv) throw new Error("Failed to get track state chunk");

  return Chunk.findElement(chunk, "FREEZE") !== null;
}

function main() {
  // get the selected track
  const track = (() => {
    const selected = Track.getSelected();
    if (selected.length !== 1) {
      msgBox("Usage", "Select exactly one track!");
      return null;
    }

    return selected[0]!;
  })();
  if (track === null) return;

  const trackIdx = track.getIdx();
  if (trackIdx === -1) {
    msgBox("Error", "Cannot freeze master track!");
    return;
  }

  // FREEZE:
  // not all children tracks should be offlined, because they may route to
  // other tracks
  //
  // UNFREEZE:
  // not all children tracks should be onlined, because frozen track may
  // contain nested frozen tracks
  //
  // find all children tracks this script should process and handle
  //
  // also, this will do some basic validation and show user-facing errors
  const tracksToToggleOnline = (() => {
    const { sends, receives } = getProjectRoutingInfo();

    /** Return all children idx for the given track, including the track itself */
    function getTree(idx: number) {
      const result: LuaSet<number> = new LuaSet();

      result.add(trackIdx);
      const toCheck: number[] = [trackIdx];

      while (toCheck.length > 0) {
        const idx = toCheck.pop()!;
        for (const child of receives.get(idx) || []) {
          if (result.has(child)) continue; // should not happen unless tracks are somehow routed in a loop

          result.add(child);
          toCheck.push(child);
        }
      }

      return result;
    }

    function cloneSet<T extends AnyNotNil>(set: LuaSet<T>): LuaSet<T> {
      const result: LuaSet<T> = new LuaSet();
      for (const x of set) {
        result.add(x);
      }
      return result;
    }

    /** Get an element from the set, and also remove it from the set */
    function popSet<T extends AnyNotNil>(set: LuaSet<T>): T | null {
      let result: T | null = null;
      for (const x of set) {
        result = x;
        break;
      }
      if (result !== null) set.delete(result);
      return result;
    }

    /**
     * Set operation: `a - b`
     *
     * This mutates `a`.
     */
    function subtractSetMut<T extends AnyNotNil>(
      a: LuaSet<T>,
      b: LuaSet<T>,
    ): LuaSet<T> {
      for (const x of b) {
        a.delete(x);
      }
      return a;
    }

    /**
     * Check if a set is empty.
     *
     * https://stackoverflow.com/questions/1252539/most-efficient-way-to-determine-if-a-lua-table-is-empty-contains-no-entries
     */
    function isEmptySet<T extends AnyNotNil>(set: LuaSet<T>): boolean {
      const [idx, val] = next(set);
      return idx === null;
    }

    // first, gather ALL track IDs that send to this track, recursively.
    // i'm visualizing this as a tree of tracks, hence the name:
    const tree: LuaSet<number> = getTree(trackIdx);

    // now that we have ALL children track IDs, we can determine if any
    // children tracks route OUTSIDE our tree
    //
    // those children cannot be simply offlined, so need to show a user warning
    let warnedSendOutside = false;

    /** tracks that indeed should be toggled */
    const result: LuaSet<number> = cloneSet(tree);

    // check for tracks that send OUTSIDE our tree.
    // if found, subtract that track's TREE from our own TREE
    // and show warning
    //
    // if we proceed anyway, we will skip this track and don't offline it
    {
      const toCheck = cloneSet(result);
      while (!isEmptySet(toCheck)) {
        const idx = popSet(toCheck)!;

        // ignore main selected track
        if (idx === trackIdx) continue;

        // check if this track sends outside our tree
        const sendsOutsideTree = (sends.get(idx) || []).some(
          (target) => !tree.has(target),
        );
        if (!sendsOutsideTree) continue;

        log(
          `Track ${idx + 1} ${inspect(Track.getByIdx(idx).name)} sends outside the selected track.`,
        );

        // show warning, return early if aborting
        if (!warnedSendOutside) {
          warnedSendOutside = true;
          const choice = confirmBox(
            "Warning",
            "Some children tracks have routing that sends outside your selected track.\nContinue anyway?",
          );
          if (!choice) return null;
        }

        // didn't abort, handle this track anyway
        // since this track sends outside the tree, all its dependencies need to be untouched as well
        const subtree = getTree(idx);
        subtractSetMut(result, subtree);
        subtractSetMut(toCheck, subtree);
        continue;
      }
    }

    // check for nested frozen tracks
    // these are simply ignored
    {
      const toCheck = cloneSet(result);
      while (!isEmptySet(toCheck)) {
        const idx = popSet(toCheck)!;

        // ignore main selected track
        if (idx === trackIdx) continue;

        if (!isFrozen(reaper.GetTrack(0, idx)!)) continue;

        // track is frozen, ignore this track and its children
        const subtree = getTree(idx);
        subtractSetMut(result, subtree);
        subtractSetMut(toCheck, subtree);
        continue;
      }
    }

    return result;
  })();
  if (tracksToToggleOnline === null) return;

  log(`To toggle these tracks online/offline`);
  for (const idx of tracksToToggleOnline) {
    log(`  ${idx + 1} ${inspect(Track.getByIdx(idx).name)}`);
  }

  copy(Chunk.track(track.obj))

  // TODO: Logic almost complete, except:
  // after freezing, all receives are disabled on reaper, so this logic does nothing
  //
  // you need to run this logic AFTER unfreezing
  if (true as any) return;

  if (isFrozen(track.obj)) {
    // unfreeze and online all fx

    // TODO: check if there are any already-online fx first, and warn

    undoBlock(UNDO_MSG_UNFREEZE, -1, () => {
      runMainAction(ACTION_UNFREEZE);
      runMainAction(ACTION_SELECT_TRACK_CHILDREN);
      runMainAction(ACTION_TRACK_FX_ONLINE);
      if (track.name.startsWith(`[FROZEN] `)) {
        track.name = track.name.slice(`[FROZEN] `.length);
      }
      // reselect track
      runMainAction(ACTION_UNSELECT_ALL_TRACKS);
      reaper.SetTrackSelected(track.obj, true);
    });
  } else {
    // freeze and offline all fx

    // TODO: check if there are any already-offline fx first, and warn

    undoBlock(UNDO_MSG_FREEZE, -1, () => {
      runMainAction(ACTION_FREEZE_TO_STEREO);
      runMainAction(ACTION_SELECT_TRACK_CHILDREN);
      runMainAction(ACTION_TRACK_FX_OFFLINE);
      track.name = `[FROZEN] ${track.name}`;
      // reselect track
      runMainAction(ACTION_UNSELECT_ALL_TRACKS);
      reaper.SetTrackSelected(track.obj, true);
    });
  }
}

errorHandler(main);
