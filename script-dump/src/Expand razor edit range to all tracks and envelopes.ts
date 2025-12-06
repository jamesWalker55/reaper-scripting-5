AddCwdToImportPaths();

import { FolderCompact, RazorEdit, Track } from "reaper-api/track";
import { errorHandler, log, runMainAction, undoBlock } from "reaper-api/utils";

const CMD_RAZOR_EDIT_CLEAR_ALL_AREAS = 42406;

/** Iterate through all razor edits, and find the most common start/end times */
function getRange() {
  const startCounts: LuaMap<number, number> = new LuaMap();
  const endCounts: LuaMap<number, number> = new LuaMap();

  for (const track of Track.iterAll()) {
    for (const edit of track.getRazorEdits()) {
      startCounts.set(edit.start, (startCounts.get(edit.start) || 0) + 1);
      endCounts.set(edit.end, (endCounts.get(edit.end) || 0) + 1);
    }
  }

  let commonStart = { pos: 0, count: 0 };
  for (const [pos, count] of startCounts) {
    if (count > commonStart.count) commonStart = { pos, count };
  }

  let commonEnd = { pos: 0, count: 0 };
  for (const [pos, count] of endCounts) {
    if (count > commonEnd.count) commonEnd = { pos, count };
  }

  if (commonStart.count === 0 || commonEnd.count === 0) return null;

  return { start: commonStart.pos, end: commonEnd.pos };
}

function timeToBeats(time: number) {
  const [rv, measures, timesigNum, beats, timesigDenom] =
    reaper.TimeMap2_timeToBeats(0, time);
  return beats;
}

function main() {
  const range = getRange();
  if (range === null) return;

  // reaper removes razor edits in collapsed track envelopes
  // expand parent tracks recursively
  const tracksToExpand: LuaSet<number> = new LuaSet();
  for (const track of Track.iterAll()) {
    const envCount = reaper.CountTrackEnvelopes(track.obj);
    if (envCount === 0) continue;

    let parent = track.getParent();
    while (parent !== null) {
      const parentIdx = parent.getIdx();
      if (tracksToExpand.has(parentIdx)) break;

      tracksToExpand.add(parentIdx);
      parent = parent.getParent();
    }
  }
  tracksToExpand.delete(-1); // delete master track

  undoBlock("Expand all tracks containing envelopes", 1 | 4, () => {
    // expand all tracks recursively containing envelopes
    // because reaper doesn't let you create razor areas in collapsed envelopes
    for (const idx of tracksToExpand) {
      Track.getByIdx(idx).folderCompact = FolderCompact.Normal;
    }
  });

  // for some reason IMMEDIATELY adding razor edits to collapsed envelopes will not work
  // we need to defer adding razor edits
  reaper.defer(() => {
    undoBlock(
      "Expand razor edit range to all tracks and envelopes",
      1 | 4,
      () => {
        // clear all razor edits
        runMainAction(CMD_RAZOR_EDIT_CLEAR_ALL_AREAS);

        for (const track of Track.iterAll()) {
          const edits: RazorEdit[] = [];

          edits.push({ start: range.start, end: range.end });

          // reaper.env;
          for (let i = 0; i < reaper.CountTrackEnvelopes(track.obj); i++) {
            const env = reaper.GetTrackEnvelope(track.obj, i);
            const [ok, guid] = reaper.GetSetEnvelopeInfo_String(
              env,
              "GUID",
              "",
              false,
            );
            if (!ok) {
              log("failed to get envelope GUID");
              continue;
            }

            edits.push({ envGUID: guid, start: range.start, end: range.end });
          }

          track.setRazorEdits(edits);
        }
      },
    );
  });
}

errorHandler(main);
