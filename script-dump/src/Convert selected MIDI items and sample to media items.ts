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
        // ignore muted items only for MIDI
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

  // collect notes to be processed
  const notes = (() => {
    // collect and sort all notes
    const allNotes = midiItems
      .flatMap(({ take }) => {
        const notes = [];

        let i = -1;
        while (true) {
          i += 1;
          const note = getMidiNote(take.obj, i);
          if (note === null) break;

          // ignore muted notes
          if (note.muted) continue;

          // convert PPQ to seconds
          const startsec = reaper.MIDI_GetProjTimeFromPPQPos(
            take.obj,
            note.startppq,
          );
          const stopsec = reaper.MIDI_GetProjTimeFromPPQPos(
            take.obj,
            note.stopppq,
          );

          notes.push({
            ...note,
            startsec,
            stopsec,
          });
        }

        return notes;
      })
      .sort((a, b) => a.startsec - b.startsec);

    // handle any duplicate notes or note intervals too short
    const filteredNotes = [];

    for (const note of allNotes) {
      if (filteredNotes.length === 0) {
        filteredNotes.push(note);
        continue;
      }

      const prevNote = filteredNotes[filteredNotes.length - 1];
      const prevNoteDuration = note.startsec - prevNote.startsec;

      // arbitrary 10ms limit, to avoid duplicate notes causing issues
      if (prevNoteDuration < 0.01) continue;

      filteredNotes.push(note);
    }

    return filteredNotes;
  })();

  if (notes.length === 0) {
    msgBox(
      "Convert selected MIDI items and sample to media items",
      "No notes to process, exiting",
    );
    return;
  }

  undoBlock(
    "Convert selected MIDI items and sample to media items",
    1 | 4,
    () => {
      const track = Track.createAtIdx(topmostTrackIdx);

      const audioLength = audio.item.length;
      const audioFadeInLength = audio.item.fadeInLength;
      const audioFadeOutLength = audio.item.fadeOutLength;
      const audioNoFadeLength =
        audioLength - audioFadeInLength - audioFadeOutLength;

      notes.forEach((note, i) => {
        const nextNotePos =
          i + 1 < notes.length
            ? notes[i + 1]!.startsec
            : notes[notes.length - 1]!.startsec + 9999;
        const noteLength = nextNotePos - note.startsec;

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
        item.loop = audio.item.loop;
        item.snapOffset = audio.item.snapOffset;
        item.volume = audio.item.volume * (note.velocity / DEFAULT_VELOCITY);

        // handle if item needs to be trimmed
        item.position = note.startsec;
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
      });
    },
  );
}

errorHandler(main);
