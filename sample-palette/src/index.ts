AddCwdToImportPaths();

import * as Path from "reaper-api/path/path";
import { Item, MidiTake, Source, Take, Track } from "reaper-api/track";
import {
  assertUnreachable,
  errorHandler,
  log,
  undoBlock,
} from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";

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

function getSamplesSmart() {
  Track.getSelected()[0]
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

// function sequenceSelectedItems(
//   samples: Sample[],
//   track: Track,
//   options: {
//     pitch: SamplePitchStyle;
//     extend: SampleExtendStyle;
//   },
// ) {
//   const notes = [];
//   for (const note of take.iterNotes()) {
//     if (!note.selected) continue;
//     if (note.muted) continue;
//     if (note.vel === 0) continue;

//     const startTime = take.tickToProjectTime(note.startTick);
//     const endTime = take.tickToProjectTime(note.endTick);

//     notes.push({ ...note, startTime, endTime });
//   }
//   if (notes.length === 0) return;

//   // TODO: Clear out area in target track

//   return createSampleSequence(notes, samples, track, options);
// }

// function createSampleSequences(
//   take: MidiTake,
//   samples: Sample[],
//   options: {
//     selectedNotesOnly: boolean;
//     pitch: SamplePitchStyle;
//     extend: SampleExtendStyle;
//   },
// ) {
//   const notes = take.allNotes().filter(x => !options.selectedNotesOnly || x.selected);

//   // sequence the items
//   for (const [trackObj, itemNotes] of trackItemNotes) {
//     const track = new Track(trackObj);

//     // create a new track for sequencing
//     const sequencingTrackIdx = track.getIdx() + 1;
//     reaper.InsertTrackInProject(0, sequencingTrackIdx, 0);
//     const sequencingTrack = Track.getByIdx(sequencingTrackIdx);

//     for (const itemNote of itemNotes) {
//       createSampleSequence(itemNote.notes, samples, sequencingTrack, options);
//     }
//   }
// }

function main() {
  // parameters
  let sampleImportPitch: number = 60; // C4
  let samplePitchStyle: SamplePitchStyle = SamplePitchStyle.KeepRate;
  let sampleExtendStyle: SampleExtendStyle = SampleExtendStyle.Stretch;
  let samples: Sample[] = [];

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
        ctx.layoutRow([90, -42, -1], 0);

        ctx.label("Sample pitch");
        sampleImportPitch = ctx.slider(
          "sampleImportPitch",
          sampleImportPitch,
          0,
          127,
          1,
          "%d",
        );
        ctx.label(getNoteName(sampleImportPitch));

        ctx.layoutRow([90, -1], 0);

        ctx.layoutNext();
        if (ctx.button("Load samples from selection")) {
          samples = getSamples(sampleImportPitch);
        }

        // ctx.label("Samples loaded:");
        // ctx.label(string.format("%d", samples.length));
      }

      // add some space
      ctx.layoutRow([-1], 8);
      ctx.layoutNext();

      // settings section
      {
        ctx.layoutRow([90, -1], 0);

        ctx.label("Pitching mode:");
        ctx.label(SamplePitchStyle[samplePitchStyle]);
        ctx.layoutNext();
        if (ctx.button("Keep rate")) {
          samplePitchStyle = SamplePitchStyle.KeepRate;
        }
        ctx.layoutNext();
        if (ctx.button("No stretching")) {
          samplePitchStyle = SamplePitchStyle.NoStretching;
        }

        ctx.label("Extend mode:");
        ctx.label(SampleExtendStyle[sampleExtendStyle]);
        ctx.layoutNext();
        if (ctx.button("Stretch")) {
          sampleExtendStyle = SampleExtendStyle.Stretch;
        }
        ctx.layoutNext();
        if (ctx.button("Truncate")) {
          sampleExtendStyle = SampleExtendStyle.Truncate;
        }
      }

      // add some space
      ctx.layoutRow([-1], 8);
      ctx.layoutNext();

      // sequencing section
      {
        ctx.layoutRow([-1], 0);

        if (samples.length === 0) {
          ctx.text(
            "No samples loaded. Please load some samples before running this button!",
          );
        } else {
          ctx.text(
            string.format("Loaded %d samples, all good!", samples.length),
          );
        }

        if (ctx.button("Sequence selected MIDI items") && samples.length > 0) {
          undoBlock(SCRIPT_NAME, -1, () => {
            const itemNotes = getItemNotes();
            if (itemNotes.length === 0) return;

            createSampleSequences(itemNotes, samples, {
              pitch: samplePitchStyle,
              extend: sampleExtendStyle,
            });
          });
        }
      }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
