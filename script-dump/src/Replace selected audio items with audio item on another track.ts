AddCwdToImportPaths();

import { Item, Take } from "reaper-api/track";
import { errorHandler, msgBox, undoBlock } from "reaper-api/utils";

// assume 100 maps to +0dB
const DEFAULT_VELOCITY = 100;

// for items that need to get trimmed, add a minimum fadeout of 24ms
const MIN_FADE_LENGTH = 15 / 1000;

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

function getMidiNote(take: MediaItem_Take, idx: number) {
  const [rv, selected, muted, startppq, stopppq, channel, pitch, velocity] =
    reaper.MIDI_GetNote(take, idx);
  if (!rv) return null;

  return { selected, muted, startppq, stopppq, channel, pitch, velocity };
}

const USAGE_MSG =
  "Please select items from exactly 2 tracks:\nOne track has only 1 item selected - the replacement sample.\nOne track has multiple items selected - the items to get replaced.";

function main() {
  // determine which selected item is the sample, and which are the targets
  const { sample, targets } = (() => {
    const items = Item.getSelected().filter((x) => !x.muted);

    // group items by track
    const itemsByTrack: Record<number, Item[]> = {};
    for (const item of items) {
      const idx = item.getTrack().getIdx();
      const arr = itemsByTrack[idx] || [];
      arr.push(item);
      itemsByTrack[idx] = arr;
    }
    const groupedItems = Object.entries(itemsByTrack)
      .map(([idx, items]) => [parseInt(idx), items] as const)
      // sort by track idx
      .sort((a, b) => a[0] - b[0])
      // just get the item list
      .map((x) => x[1]);
    if (groupedItems.length !== 2) {
      msgBox("Error", USAGE_MSG);
      return { sample: null, targets: null };
    }

    // whichever track has exactly 1 item is the sample
    const [a, b] = groupedItems;
    if (a.length > 1 || b.length === 1) {
      return { sample: b[0], targets: a };
    } else if (a.length === 1 || b.length > 1) {
      return { sample: a[0], targets: b };
    } else if (a.length === 1 || b.length === 1) {
      // assume the top track is the sample track
      return { sample: a[0], targets: b };
    } else {
      msgBox("Error", USAGE_MSG);
      return { sample: null, targets: null };
    }
  })();
  if (sample === null) return;

  const track = targets[0].getTrack();

  const sampleTake = sample.activeTake()?.asTypedTake();
  if (sampleTake === undefined) {
    msgBox("Error", "Selected sample item does not contain a take");
    return;
  }
  if (sampleTake.TYPE !== "AUDIO") {
    msgBox("Error", "Selected sample item is not an audio item");
    return;
  }

  const audioSource = sampleTake.getSource().findRootParent();

  undoBlock(
    "Replace selected audio items with audio item on another track",
    1 | 4,
    () => {
      const audioLength = sample.length;
      const audioFadeInLength = sample.fadeInLength;
      const audioFadeOutLength = sample.fadeOutLength;

      targets.forEach((target, i) => {
        const nextNotePos =
          i + 1 < targets.length
            ? targets[i + 1]!.position
            : targets[targets.length - 1]!.position + 9999;
        const noteLength = nextNotePos - target.position;

        // create item for each note
        const item = new Item(reaper.AddMediaItemToTrack(track.obj));
        const take = new Take(reaper.AddTakeToMediaItem(item.obj));
        reaper.SetMediaItemTake_Source(take.obj, audioSource.obj);

        take.name = sampleTake.name;
        take.pan = sampleTake.pan;
        take.pitch = sampleTake.pitch;
        take.playrate = sampleTake.playrate;
        take.preservePitch = sampleTake.preservePitch;
        take.sourceStartOffset = sampleTake.sourceStartOffset;
        take.volume = sampleTake.volume;

        item.color = sample.color;
        item.loop = sample.loop;
        item.snapOffset = sample.snapOffset;
        item.volume = sample.volume * target.volume;
        item.fadeInCurve = sample.fadeInCurve;
        item.fadeOutCurve = sample.fadeOutCurve;

        // handle if item needs to be trimmed
        item.position = target.position;
        if (noteLength >= audioLength) {
          // enough space for item to be placed
          item.length = audioLength;
          item.fadeInLength = audioFadeInLength;
          item.fadeOutLength = audioFadeOutLength;
        } else if (noteLength >= audioFadeInLength + MIN_FADE_LENGTH) {
          // enough space if you shorten the fadeout
          const minAudioLength = audioFadeInLength + MIN_FADE_LENGTH;

          item.length = noteLength;
          item.fadeInLength = audioFadeInLength;

          const lerpStart = MIN_FADE_LENGTH;
          const lerpEnd = Math.max(audioFadeOutLength, MIN_FADE_LENGTH);
          const lerpValue =
            (noteLength - minAudioLength) / (audioLength - minAudioLength);
          const lerpResult = lerpStart + lerpValue * (lerpEnd - lerpStart);

          item.fadeOutLength = lerpResult;
        } else {
          // at this point, the note is extremely short, there is no room left for non-fade areas
          //
          // fadeout is reduced to minimum of MIN_FADE_LENGTH
          // fadein MIGHT be reducable, or it might not be (it might be 0)
          //
          // if fadein is less than MIN_FADE (like 0), then we scale both fadein+fadeout proportionally.
          // otherwise fadein is larger than MIN_FADE, we attempt reduce it to MIN_FADE first.
          // if that still fails, then we scale both fadein+fadeout (both MIN_FADE) proportionally.
          if (audioFadeInLength <= MIN_FADE_LENGTH) {
            // fadein is too small, just scale proportionally
            item.length = noteLength;
            const ratio = noteLength / (audioFadeInLength + MIN_FADE_LENGTH);
            item.fadeInLength = audioFadeInLength * ratio;
            item.fadeOutLength = MIN_FADE_LENGTH * ratio;
          } else if (noteLength >= MIN_FADE_LENGTH * 2) {
            // fadein is large, we can reduce fadein further
            item.length = noteLength;
            item.fadeInLength = noteLength - MIN_FADE_LENGTH;
            item.fadeOutLength = MIN_FADE_LENGTH;
          } else {
            // fadein is large, but note is too short for 2 x MIN_FADE
            // just scale proportionally (both MIN_FADE_LENGTH)
            item.length = noteLength;
            const ratio = noteLength / (MIN_FADE_LENGTH + MIN_FADE_LENGTH);
            item.fadeInLength = MIN_FADE_LENGTH * ratio;
            item.fadeOutLength = MIN_FADE_LENGTH * ratio;
          }
        }

        // delete the target item
        target.delete();
      });
    },
  );
}

errorHandler(main);
