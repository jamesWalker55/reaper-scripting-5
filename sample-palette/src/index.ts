AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as Path from "reaper-api/path/path";
import { Item, MidiTake, Source, Take, Track } from "reaper-api/track";
import {
  assertUnreachable,
  errorHandler,
  log,
  msgBox,
  runMainAction,
  undoBlock,
} from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";
import { wrappedEnum } from "./widgets";

// constants for finding tracks
const SAMPLE_TRACK_NAME = "Samples";
const PITCH_TRACK_NAME = "Samples Pitch";
const SEQUENCE_TRACK_NAME_PREFIX = "SP: ";

type Result<T, E> = { ok: true; val: T } | { ok: false; err: E };

const SCRIPT_NAME = (() => {
  const filename = reaper.get_action_context()[1];
  return Path.splitext(Path.split(filename)[1])[0];
})();

/** Random integer in range `min..=max` (inclusive) */
function randInt(min: number, max: number) {
  const rangeRand = math.min(
    math.max(0, math.floor(math.random() * (max - min + 1))),
    max - min,
  );
  return rangeRand + min;
}

function getNotesInTrack(pitchTrack: Track) {
  const notes = [];

  for (const item of pitchTrack.iterItems()) {
    if (item.muted) continue;

    const take = item.activeTake()?.asTypedTake();
    if (!take) continue;
    if (take.TYPE !== "MIDI") continue;

    for (const note of take.iterNotes()) {
      if (note.muted) continue;
      if (note.vel === 0) continue;

      const startTime = take.tickToProjectTime(note.startTick);
      const endTime = take.tickToProjectTime(note.endTick);

      notes.push({ ...note, startTime, endTime });
    }
  }

  // // sort by start time
  // notes.sort((a, b) => a.startTime - b.startTime);

  return notes;
}

type Note = ReturnType<typeof getNotesInTrack>[number];

function mainNoteInTimeRange(
  notes: Note[],
  start: number,
  end: number,
): Result<Note, "MULTIPLE_NOTES" | "NO_NOTES"> {
  // filter overlapping notes with time range
  notes = notes.filter(
    (x) =>
      (start <= x.startTime && x.startTime < end) ||
      (start < x.endTime && x.endTime <= end) ||
      (x.startTime <= start && end <= x.endTime),
  );

  // how long the note needs to be (in relation to time range)
  const THRESHOLD = 0.75;

  const rangeLength = end - start;
  const minNoteLength = rangeLength * THRESHOLD;
  notes = notes.filter((x) => x.endTime - x.startTime >= minNoteLength);

  if (notes.length > 1) return { ok: false, err: "MULTIPLE_NOTES" };
  if (notes.length === 0) return { ok: false, err: "NO_NOTES" };

  return { ok: true, val: notes[0] };
}

type Sample = {
  source: Source;
  name: string;
  volume: number;
  pan: number;
  playrate: number;
  startOffset: number;
  endOffset: number;
  fadeInLength: number;
  fadeOutLength: number;
  pitch: number;
};

function getSamples(
  sampleTrack: Track,
  pitchTrack: Track,
): Result<Sample[], { item: Item; err: "MULTIPLE_NOTES" }> {
  const notes = getNotesInTrack(pitchTrack);

  const result: Sample[] = [];

  for (const item of sampleTrack.iterItems()) {
    if (item.muted) continue;

    const take = item.activeTake()?.asTypedTake();
    if (!take) continue;
    if (take.TYPE !== "AUDIO") continue;

    const source = take.getSource();

    const name = take.name;
    const volume = take.volume * item.volume;
    const pan = take.pan;
    const playrate = take.playrate;
    const startOffset = take.sourceStartOffset;
    const endOffset = startOffset + item.length * take.playrate;

    // length in source sample seconds (assuming playrate === 1.0)
    const fadeInLength = item.fadeInLength * playrate;
    const fadeOutLength = item.fadeOutLength * playrate;

    // absolute pitch, in MIDI terms (i.e. from 0.0 -- 127.0)
    let pitch: number;
    {
      // pitch that is ADDED to the sample by stretching/pitching
      const pitchOffset =
        take.pitch + (take.preservePitch ? 0 : Math.log2(take.playrate) * 12);

      // find the MIDI note that represents the pitch for this item
      const noteResult = mainNoteInTimeRange(
        notes,
        item.position,
        item.position + item.length,
      );
      if (!noteResult.ok) {
        switch (noteResult.err) {
          case "MULTIPLE_NOTES":
            return { ok: false, err: { item, err: "MULTIPLE_NOTES" } };
          case "NO_NOTES":
            log(`No notes found for sample at ${item.position}s, ignoring...`);
            continue;
          default:
            assertUnreachable(noteResult.err);
        }
      }
      const note = noteResult.val;

      pitch = note.pitch - pitchOffset;
    }

    result.push({
      source,
      name,
      volume,
      pan,
      playrate,
      startOffset,
      endOffset,
      fadeInLength,
      fadeOutLength,
      pitch,
    });
  }

  return { ok: true, val: result };
}

function findSampleTrack(): {
  sample: Track;
  pitch: Track;
} | null {
  function locateSampleTrackPair(
    track: Track,
  ): { sample: Track; pitch: Track } | null {
    log(`locateSampleTrackPair: track ${track.getIdx() + 1}`);

    if (track.name === SAMPLE_TRACK_NAME) {
      // assume this is the sample track
      // search for pitch track nearby

      const prevTrack = Track.getByIdx(track.getIdx() - 1);
      if (prevTrack.name === PITCH_TRACK_NAME) {
        return { sample: track, pitch: prevTrack };
      }

      const nextTrackDepth = track.getRawFolderDepth();
      if (nextTrackDepth >= 0) {
        const nextTrack = Track.getByIdx(track.getIdx() + 1);
        if (nextTrack.name === PITCH_TRACK_NAME) {
          return { sample: track, pitch: nextTrack };
        }
      }
    }
    // } else if (track.name === PITCH_TRACK_NAME) {
    //   // assume this is the pitch track
    //   // search for sample track nearby

    //   const prevTrack = Track.getByIdx(track.getIdx() - 1);
    //   if (prevTrack.name === SAMPLE_TRACK_NAME) {
    //     return { pitch: track, sample: prevTrack };
    //   }

    //   const nextTrackDepth = track.getRawFolderDepth();
    //   if (nextTrackDepth >= 0) {
    //     const nextTrack = Track.getByIdx(track.getIdx() + 1);
    //     if (nextTrack.name === SAMPLE_TRACK_NAME) {
    //       return { pitch: track, sample: nextTrack };
    //     }
    //   }
    // }

    return null;
  }

  const checkedTracks: LuaSet<MediaTrack> = new LuaSet();

  for (const track of Track.getSelected()) {
    if (checkedTracks.has(track.obj)) continue;

    // check if current track is sample track
    checkedTracks.add(track.obj);
    const pair = locateSampleTrackPair(track);
    if (pair !== null) return pair;

    // check children for sample tracks
    for (const child of track.getChildren()) {
      if (checkedTracks.has(child.obj)) continue;

      checkedTracks.add(child.obj);
      const pair = locateSampleTrackPair(child);
      if (pair !== null) return pair;
    }

    // check siblings for sample tracks
    const parent = track.getParent();
    if (!parent) continue;

    for (const sibling of parent.getChildren()) {
      if (checkedTracks.has(sibling.obj)) continue;

      checkedTracks.add(sibling.obj);
      const pair = locateSampleTrackPair(sibling);
      if (pair !== null) return pair;
    }
  }

  return null;
}

/** What to do about the playrate when pitching up/down */
enum SamplePitchStyle {
  KeepRate, // use the same playrate we originally captured
  NoStretching, // adjust the playrate to follow the pitch (ignore the captured rate)
}

/** What to do when the sample is shorter than the note */
enum SampleExtendStyle {
  Stretch, // stretch the sample until it is as long as the note
  Truncate, // allow the sample be shorter than the note
}

function createSampleSequence(
  notes: Note[],
  samples: Sample[],
  track: Track,
  options: {
    pitch: SamplePitchStyle;
    extend: SampleExtendStyle;
  },
) {
  if (samples.length === 0)
    throw new Error("cannot create sequence with no samples");

  for (const note of notes) {
    // get a random sample, equal distribution for now
    const sample = samples[randInt(0, samples.length - 1)];

    // create item with sample loaded
    const item = new Item(reaper.AddMediaItemToTrack(track.obj));
    const take = new Take(reaper.AddTakeToMediaItem(item.obj));
    reaper.SetMediaItemTake_Source(take.obj, sample.source.obj);

    // move item to under the note
    item.position = note.startTime;

    // sample basic properties, offset etc
    take.volume = sample.volume;
    take.pan = sample.pan;
    take.sourceStartOffset = sample.startOffset;

    // optionated: adjust pitch and rate
    take.preservePitch = true;
    let playrate: number;
    let length: number;
    let pitch: number;
    {
      // default length to note length
      length = note.endTime - note.startTime;

      // how much to pitch the item by
      const toPitch = note.pitch - sample.pitch;
      pitch = toPitch;

      // the playrate if the sample is long enough
      switch (options.pitch) {
        case SamplePitchStyle.KeepRate:
          playrate = sample.playrate;
          break;
        case SamplePitchStyle.NoStretching:
          playrate = Math.pow(2, toPitch / 12);
          break;
        default:
          assertUnreachable(options.pitch);
      }

      // if the sample isn't long enough, do something about it
      if ((sample.endOffset - sample.startOffset) / playrate < length) {
        switch (options.extend) {
          case SampleExtendStyle.Stretch:
            playrate =
              (sample.endOffset - sample.startOffset) /
              (note.endTime - note.startTime);
            break;
          case SampleExtendStyle.Truncate:
            length = (sample.endOffset - sample.startOffset) / playrate;
            break;
          default:
            assertUnreachable(options.extend);
        }
      }
    }
    item.length = length;
    take.playrate = playrate;
    take.pitch = pitch;

    // adjust fades depending on playrate
    item.fadeInLength = sample.fadeInLength / playrate;
    item.fadeOutLength = sample.fadeOutLength / playrate;
  }
}

function clearTrackTimeRange(track: Track, start: number, end: number) {
  const MIN_ITEM_LENGTH = 0.0005;

  for (const item of track.allItems()) {
    const itemStart = item.position;
    const itemEnd = item.position + item.length;

    const itemCompletelyInsideRange = start <= itemStart && itemEnd <= end;
    const itemHitsRangeStart = itemStart <= start && start < itemEnd;
    const itemHitsRangeEnd = itemStart < end && end <= itemEnd;

    const itemOverlapsRange =
      itemCompletelyInsideRange || itemHitsRangeStart || itemHitsRangeEnd;
    if (!itemOverlapsRange) continue;

    if (itemCompletelyInsideRange) {
      item.delete();
    } else if (itemHitsRangeStart && itemHitsRangeEnd) {
      const right = item.split(end);
      const mid = item.split(start);
      const left = item;
      mid.delete();
      if (left.length < MIN_ITEM_LENGTH) left.delete();
      if (right.length < MIN_ITEM_LENGTH) right.delete();
    } else if (itemHitsRangeStart) {
      const right = item.split(start);
      const left = item;
      right.delete();
      if (left.length < MIN_ITEM_LENGTH) left.delete();
    } else if (itemHitsRangeEnd) {
      const right = item.split(end);
      const left = item;
      left.delete();
      if (right.length < MIN_ITEM_LENGTH) right.delete();
    } else {
      throw new Error("unreachable");
    }
  }
}

function sequenceTake(
  take: MidiTake,
  samples: Sample[],
  options: {
    selectedNotesOnly: boolean;
    pitch: SamplePitchStyle;
    extend: SampleExtendStyle;
  },
) {
  const notes = [];
  for (const note of take.iterNotes()) {
    if (options.selectedNotesOnly && !note.selected) continue;
    if (note.muted) continue;
    if (note.vel === 0) continue;

    const startTime = take.tickToProjectTime(note.startTick);
    const endTime = take.tickToProjectTime(note.endTick);

    notes.push({ ...note, startTime, endTime });
  }
  if (notes.length === 0) return;

  const midiItem = take.getItem();
  const midiTrack = midiItem.getTrack();

  let seqTrack;
  {
    const targetTrackName = SEQUENCE_TRACK_NAME_PREFIX + midiTrack.name;
    const targetTrackIdx = midiTrack.getIdx() + 1;

    // try to find existing sequence track, found by the name prefix
    const nextTrack = Track.getByIdx(targetTrackIdx);
    if (nextTrack.name === targetTrackName) {
      seqTrack = nextTrack;
    }

    // no existing sequencing track found, create a new one
    seqTrack = Track.createAtIdx(targetTrackIdx);
  }

  if (options.selectedNotesOnly) {
    // clear each note individually
    for (const note of notes) {
      clearTrackTimeRange(seqTrack, note.startTime, note.endTime);
    }
  } else {
    // clear entire time range
    const itemStart = midiItem.position;
    const itemEnd = itemStart + midiItem.length;
    clearTrackTimeRange(seqTrack, itemStart, itemEnd);
  }

  createSampleSequence(notes, samples, seqTrack, options);
}

function sequenceSelectedItems(
  samples: Sample[],
  options: {
    pitch: SamplePitchStyle;
    extend: SampleExtendStyle;
  },
) {
  for (const item of Item.getSelected()) {
    const take = item.activeTake()?.asTypedTake();
    if (take === undefined) continue;
    if (take.TYPE !== "MIDI") continue;

    sequenceTake(take, samples, { ...options, selectedNotesOnly: false });
  }
}

function main() {
  // parameters
  // let sampleImportPitch: number = 60; // C4
  let samplePitchStyle: SamplePitchStyle = SamplePitchStyle.KeepRate;
  let sampleExtendStyle: SampleExtendStyle = SampleExtendStyle.Stretch;
  let samples: Sample[] = [];
  let samplesTrackIdx: number | null = null;

  // gui code
  const ctx = createContext();
  gfx.init("Sample Palette", 460, 280);
  gfx.setfont(1, "Arial", 14);
  ctx.style.font = 1;

  microUILoop(ctx, (stop) => {
    if (
      ctx.beginWindow(
        "Demo Window",
        { x: 0, y: 0, w: 0, h: 0 },
        Option.NoResize | Option.NoTitle | Option.NoClose,
      )
    ) {
      // resize inner window to base window
      {
        const win = ctx.getCurrentContainer();
        win.rect.w = gfx.w;
        win.rect.h = gfx.h;
      }

      // sample collecting section
      {
        ctx.layoutRow([-1], 0);

        ctx.text(
          `This script depends on having 2 adjacent tracks with very specific names.`,
        );
        ctx.text(
          `* ${inspect(
            SAMPLE_TRACK_NAME,
          )}: Track containing sliced audio samples.`,
        );
        ctx.text(
          `* ${inspect(
            PITCH_TRACK_NAME,
          )}: Track containing MIDI notes at the same location as each audio sample. The note represents the pitch of that sample.`,
        );
        ctx.text(
          `Create these 2 tracks then hit the button below to collect the samples to memory.`,
        );

        if (ctx.button("Collect samples")) {
          const tracks = findSampleTrack();
          if (tracks === null) {
            msgBox(
              "Can't find samples!",
              "Failed to find the sample track. Please try selecting the sample track before clicking on this button.",
            );
          } else {
            const samplesResult = getSamples(tracks.sample, tracks.pitch);
            if (!samplesResult.ok) {
              const err = samplesResult.err;

              switch (err.err) {
                case "MULTIPLE_NOTES": {
                  msgBox(
                    "Can't determine pitch of sample",
                    `Multiple notes found for the sample at ${
                      err.item.position
                    }s on track ${
                      err.item.getTrack().getIdx() + 1
                    }.\nPlease ensure only 1 note is placed at the location of the sample`,
                  );
                  undoBlock(
                    "Sample Palette: Focus on sample with errors",
                    -1,
                    () => {
                      runMainAction(40289); // unselect all items
                      reaper.SetMediaItemSelected(err.item.obj, true); // select item
                      runMainAction("_S&M_SCROLL_ITEM"); // scroll to item
                    },
                  );
                  break;
                }
                default:
                  assertUnreachable(err.err);
              }
            } else {
              samples = samplesResult.val;
              samplesTrackIdx = tracks.sample.getIdx();
            }
          }
        }
      }

      // add some space
      ctx.layoutRow([-1], 8);
      ctx.layoutNext();

      // settings section
      {
        ctx.layoutRow([90, -1], 0);

        ctx.label("Pitching mode:");
        samplePitchStyle = wrappedEnum(
          ctx,
          [
            { id: SamplePitchStyle.KeepRate, name: "Keep rate" },
            { id: SamplePitchStyle.NoStretching, name: "No stretching" },
          ],
          samplePitchStyle,
        );

        ctx.label("Extend mode:");
        sampleExtendStyle = wrappedEnum(
          ctx,
          [
            { id: SampleExtendStyle.Stretch, name: "Stretch" },
            { id: SampleExtendStyle.Truncate, name: "Truncate" },
          ],
          sampleExtendStyle,
        );
      }

      // // add some space
      // ctx.layoutRow([-1], 8);
      // ctx.layoutNext();

      // // sequencing section
      // {
      //   ctx.layoutRow([-1], 0);

      //   if (samples.length === 0) {
      //     ctx.text(
      //       "No samples loaded. Please load some samples before running this button!",
      //     );
      //   } else {
      //     ctx.text(
      //       string.format("Loaded %d samples, all good!", samples.length),
      //     );
      //   }

      //   if (ctx.button("Sequence selected MIDI items") && samples.length > 0) {
      //     undoBlock(SCRIPT_NAME, -1, () => {
      //       const itemNotes = getItemNotes();
      //       if (itemNotes.length === 0) return;

      //       createSampleSequences(itemNotes, samples, {
      //         pitch: samplePitchStyle,
      //         extend: sampleExtendStyle,
      //       });
      //     });
      //   }
      // }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
