AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as Path from "reaper-api/path/path";
import {
  AudioTake,
  Item,
  MidiTake,
  Take,
  Track,
  TrackRouting,
  TrackRoutingCategory,
} from "reaper-api/track";
import {
  confirmBox,
  errorHandler,
  log,
  msgBox,
  undoBlock,
} from "reaper-api/utils";

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

function max(nums: number[]): number {
  if (nums.length === 0) throw new Error("can't find max of empty array");

  let rv = nums[0];

  for (const x of nums) {
    if (x > rv) {
      rv = x;
    }
  }

  return rv;
}

// positions must already be sorted
//
// returns null if there are only 0 or 1 numbers in the list
function minDistanceBetweenPos(pos: number[]): number | null {
  if (pos.length < 2) return null;

  let rv = pos[1] - pos[0];

  for (let i = 0; i < pos.length - 1; i++) {
    const diff = pos[i + 1] - pos[i];
    if (diff < 0)
      throw new Error("minDistanceBetweenPos(): positions are not sorted");

    if (diff < rv) {
      rv = diff;
    }
  }

  return rv;
}

function getMidiNote(take: MediaItem_Take, idx: number) {
  const [rv, selected, muted, startppq, endppq, channel, pitch, velocity] =
    reaper.MIDI_GetNote(take, idx);
  if (!rv) return null;

  return { selected, muted, startppq, endppq, channel, pitch, velocity };
}

function main() {
  const items = Item.getSelected();

  // find necessary items
  let audio: { item: Item; take: AudioTake } | null = null;
  const midiItems: { item: Item; take: MidiTake }[] = [];
  for (const item of items) {
    const take = item.activeTake()?.asTypedTake();
    if (take === undefined) continue;

    if (take.TYPE === "MIDI") {
      if (!item.muted) {
        midiItems.push({ item, take });
      }
    } else {
      // sanity check
      take.TYPE satisfies "AUDIO";

      if (audio !== null) {
        msgBox("Error", "Please only select exactly one audio clip!");
        return;
      }
      audio = { item, take };
    }
  }
  if (audio === null) {
    msgBox("Error", "Please select exactly one audio clip!");
    return;
  }
  if (midiItems.length === 0) {
    msgBox("Error", "Please select at least 1 MIDI item!");
    return;
  }

  // necessary info for script
  const audioSource = audio.take.getSource().findRootParent();

  // find the topmost track of all the MIDI items
  const topmostTrackIdx = min(midiItems.map((x) => x.item.getTrack().getIdx()));

  undoBlock(
    "Convert selected MIDI items and sample to media items",
    1 | 4,
    () => {
      const track = Track.createAtIdx(topmostTrackIdx);

      for (const midi of midiItems) {
        let i = -1;
        while (true) {
          i += 1;
          const note = getMidiNote(midi.take.obj, i);
          if (note === null) break;
          if (note.muted) continue;

          // create item for each note
          const item = new Item(reaper.AddMediaItemToTrack(track.obj));
          const take = new Take(reaper.AddTakeToMediaItem(item.obj));
          reaper.SetMediaItemTake_Source(take.obj, audioSource.obj);

          take.name = audio.take.name;
          take.pan = audio.take.pan;
          take.pitch = audio.take.pitch;
          take.playrate = audio.take.playrate;
          take.preservePitch = audio.take.preservePitch;
          take.sourceStartOffset = audio.take.sourceStartOffset;
          take.volume = audio.take.volume;

          item.color = audio.item.color;
          item.fadeInLength = audio.item.fadeInLength;
          item.fadeOutLength = audio.item.fadeOutLength;
          item.loop = audio.item.loop;
          item.snapOffset = audio.item.snapOffset;
          item.volume = audio.item.volume * (note.velocity / DEFAULT_VELOCITY);

          const midiStart = reaper.MIDI_GetProjTimeFromPPQPos(
            midi.take.obj,
            note.startppq,
          );
          const midiStop = reaper.MIDI_GetProjTimeFromPPQPos(
            midi.take.obj,
            note.endppq,
          );
          item.position = midiStart;
          item.length = midiStop - midiStart;
        }
      }
    },
  );
}

errorHandler(main);
