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

function setToArray<T extends AnyNotNil>(set: LuaSet<T>): T[] {
  const result: T[] = [];
  for (const x of set) {
    result.push(x);
  }
  return result;
}

/**
 * Class for filtering out children tracks that meet certain criteria
 */
class ChildrenSet {
  private readonly trackIdx: number;
  private sends: LuaTable<number, number[]>;
  private receives: LuaTable<number, number[]>;

  /** All children for the given track */
  private tree: LuaSet<number>;
  /** The filtered resulting tracks */
  private result: LuaSet<number>;

  constructor(trackIdx: number) {
    this.trackIdx = trackIdx;

    const { sends, receives } = getProjectRoutingInfo();
    this.sends = sends;
    this.receives = receives;

    this.tree = this.getTree(trackIdx);
    this.result = cloneSet(this.tree);
  }

  /** Return all children idx for the given track, including the track itself */
  private getTree(idx: number) {
    const result: LuaSet<number> = new LuaSet();

    result.add(idx);
    const toCheck: number[] = [idx];

    while (toCheck.length > 0) {
      const idx = toCheck.pop()!;
      for (const child of this.receives.get(idx) || []) {
        if (result.has(child)) continue; // should not happen unless tracks are somehow routed in a loop

        result.add(child);
        toCheck.push(child);
      }
    }

    return result;
  }

  getMut() {
    return this.result;
  }

  updateReaperSelection() {
    runMainAction(ACTION_UNSELECT_ALL_TRACKS);
    for (const idx of this.result) {
      const track = reaper.GetTrack(0, idx)!;
      reaper.SetTrackSelected(track, true);
    }
  }

  /**
   * Find frozen tracks within our children.
   *
   * Those tracks and their descendents are removed.
   */
  filterFrozenTracks(): boolean {
    const toCheck = cloneSet(this.result);

    // ignore main selected track
    toCheck.delete(this.trackIdx);

    let hasFrozenTracks = false;

    while (!isEmptySet(toCheck)) {
      const idx = popSet(toCheck)!;

      if (!isFrozen(reaper.GetTrack(0, idx)!)) continue;

      hasFrozenTracks = true;

      // track is frozen, ignore this track and its children
      const subtree = this.getTree(idx);
      subtractSetMut(this.result, subtree);
      subtractSetMut(toCheck, subtree);
    }

    return hasFrozenTracks;
  }

  /**
   * Find tracks that send audio/midi to tracks which aren't our children.
   *
   * Filter them out, and also remove all tracks that send to them.
   */
  filterExternalSends(): boolean {
    const toCheck = cloneSet(this.result);

    // ignore main selected track
    toCheck.delete(this.trackIdx);

    let hasExternalSends = false;

    // check every track idx in the current result
    while (!isEmptySet(toCheck)) {
      const idx = popSet(toCheck)!;
      const sends = this.sends.get(idx) || [];

      // check if this track sends outside our tree
      const sendsOutsideTree = sends.some((target) => !this.tree.has(target));
      if (!sendsOutsideTree) continue;

      // this track sends audio/midi outside our tree, handle it
      hasExternalSends = true;

      // since this track sends outside the tree, all its dependencies need to be untouched as well
      const subtree = this.getTree(idx);
      subtractSetMut(this.result, subtree);
      subtractSetMut(toCheck, subtree);
    }

    return hasExternalSends;
  }
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

  if (isFrozen(track.obj)) {
    // unfreeze and online all fx

    // TODO: check if there are any already-online fx first, and warn

    undoBlock(UNDO_MSG_UNFREEZE, -1, () => {
      runMainAction(ACTION_UNFREEZE);
      if (track.name.startsWith(`[FROZEN] `)) {
        track.name = track.name.slice(`[FROZEN] `.length);
      }

      // unfreezing restores routing for this track, so we check children track now
      const set = new ChildrenSet(trackIdx);
      if (set.filterFrozenTracks()) {
        msgBox(
          "Warning",
          "Selected track contains other frozen tracks.\nThese tracks will be kept as-is.",
        );
      }
      log(`Set these tracks FX online`);
      for (const idx of set.getMut()) {
        log(`  ${idx + 1} ${inspect(Track.getByIdx(idx).name)}`);
      }
      set.updateReaperSelection();
      runMainAction(ACTION_TRACK_FX_ONLINE);
      // reselect track
      runMainAction(ACTION_UNSELECT_ALL_TRACKS);
      reaper.SetTrackSelected(track.obj, true);
    });
  } else {
    // freeze and offline all fx

    const set = new ChildrenSet(trackIdx);
    // filter frozen tracks BEFORE external sends.
    // this avoids useless warnings when an external-send track is filtered-out later by frozen filter
    const hasFrozenTracks = set.filterFrozenTracks();

    const externalSends = cloneSet(set.getMut());
    if (set.filterExternalSends()) {
      subtractSetMut(externalSends, set.getMut());
      const tracksMsg = setToArray(externalSends)
        .sort()
        .map((idx) => `- Track ${idx + 1} ${inspect(Track.getByIdx(idx).name)}`)
        .join("\n");
      const choice = confirmBox(
        "Warning",
        `Some tracks in the selection send audio/MIDI to tracks outside the hierarchy:\n\n${tracksMsg}\n\nThese tracks will be left online. Proceed?`,
      );
      if (!choice) return;
    }
    if (hasFrozenTracks) {
      msgBox(
        "Warning",
        "Selected track contains other frozen tracks.\nThese tracks will be kept as-is.",
      );
    }

    log(`Set these tracks FX offline`);
    for (const idx of set.getMut()) {
      log(`  ${idx + 1} ${inspect(Track.getByIdx(idx).name)}`);
    }

    // TODO: check if there are any already-offline fx first, and warn

    undoBlock(UNDO_MSG_FREEZE, -1, () => {
      runMainAction(ACTION_FREEZE_TO_STEREO);
      track.name = `[FROZEN] ${track.name}`;
      set.updateReaperSelection();
      runMainAction(ACTION_TRACK_FX_OFFLINE);
      // reselect track
      runMainAction(ACTION_UNSELECT_ALL_TRACKS);
      reaper.SetTrackSelected(track.obj, true);
    });
  }
}

errorHandler(main);
