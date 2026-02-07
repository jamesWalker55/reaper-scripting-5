AddCwdToImportPaths();

import { Item, Track } from "reaper-api/track";
import { errorHandler, undoBlock } from "reaper-api/utils";

// assume 100 maps to +0dB
const DEFAULT_VELOCITY = 100;

function min(nums: number[]): number {
  if (nums.length === 0) throw new Error("can't find min of empty array");

  let rv = nums[0];

  for (const x of nums) {
    if (x < rv) {
      rv = x;
    }
  }

  return rv;
}

function main() {
  const items = Item.getSelected().filter((x) => !x.muted);
  if (items.length === 0) return;

  const positions = items.map((x) => ({
    start: x.position,
    stop: x.position + x.length,
    volume: x.volume,
  }));
  positions.sort((a, b) => a.start - b.start);

  // find the topmost track of all the items
  const topmostTrackIdx = min(items.map((x) => x.getTrack().getIdx()));
  if (topmostTrackIdx === null) return;

  undoBlock("Convert selected items to MIDI notes", 1 | 4, () => {
    const track = Track.createAtIdx(topmostTrackIdx);

    // insert notes
    for (const { start, stop, volume } of positions) {
      // create midi item for each note
      const item = new Item(
        reaper.CreateNewMIDIItemInProj(track.obj, start, stop, false),
      );
      const take = item.activeTake()!;

      reaper.MIDI_InsertNote(
        take.obj,
        false,
        false,
        reaper.MIDI_GetPPQPosFromProjTime(take.obj, start),
        reaper.MIDI_GetPPQPosFromProjTime(take.obj, stop),
        0,
        60,
        Math.round(math.max(0, math.min(DEFAULT_VELOCITY * volume, 127))),
        false,
      );
    }

    reaper.UpdateArrange();
  });
}

errorHandler(main);
