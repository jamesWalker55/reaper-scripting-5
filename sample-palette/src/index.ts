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
import { wrappedButtons, wrappedEnum } from "./widgets";

// constants for finding tracks
const SAMPLE_TRACK_NAME = "Samples";
const PITCH_TRACK_NAME = "Samples Pitch";
const SAMPLE_TRACK_PREFIX = "[S]";
const PITCH_TRACK_PREFIX = "[MIDI]";
const SEQUENCE_TRACK_NAME_PREFIX = "[SP] ";

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

/**
 * Account for item looping and get all notes (within bounds).
 *
 * Also account for item pitch
 */
function getItemNotes(take: MidiTake) {
  const item = take.getItem();
  const itemLoop = item.loop;
  const itemStart = item.position;
  const itemEnd = itemStart + item.length;

  const takePPQLength = reaper.BR_GetMidiSourceLenPPQ(take.obj);
  if (takePPQLength === -1) throw new Error("take is not MIDI");

  // ALL notes in the item
  const unloopedNotes = Array.from(take.iterNotes());

  // filter notes, and also account for item loop
  const notes = [];

  let loopPPQOffset = 0.0;
  let anyNotePastRightSide = false;

  while (true) {
    for (const note of unloopedNotes) {
      let noteStart = take.tickToProjectTime(note.startTick + loopPPQOffset);
      let noteEnd = take.tickToProjectTime(note.endTick + loopPPQOffset);

      // check if note is within item bounds

      // note is past left side
      if (noteEnd <= itemStart) {
        continue;
      }
      // note is past right side
      if (itemEnd <= noteStart) {
        anyNotePastRightSide = true;
        continue;
      }

      // note is inside/clipping the item

      // trim the note

      if (noteStart < itemStart) {
        noteStart = itemStart;
      }
      if (noteEnd >= itemEnd) {
        noteEnd = itemEnd;
      }

      notes.push({
        ...note,
        startTime: noteStart,
        endTime: noteEnd,
        startTick: note.startTick + loopPPQOffset,
        endTick: note.endTick + loopPPQOffset,
        pitch: note.pitch + Math.round(take.pitch),
      });
    }
    if (!itemLoop || anyNotePastRightSide) break;

    loopPPQOffset += takePPQLength;
  }

  return notes;
}

type Note = ReturnType<typeof getItemNotes>[number];

function getNotesInTrack(pitchTrack: Track) {
  const notes = [];

  for (const item of pitchTrack.iterItems()) {
    if (item.muted) continue;

    const take = item.activeTake()?.asTypedTake();
    if (!take) continue;
    if (take.TYPE !== "MIDI") continue;

    for (const note of getItemNotes(take)) {
      if (note.muted) continue;
      if (note.vel === 0) continue;

      notes.push(note);
    }
  }

  // // sort by start time
  // notes.sort((a, b) => a.startTime - b.startTime);

  return notes;
}

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

function getSamples(): Result<
  {
    name: string;
    samples: Sample[];
  }[],
  { item: Item; err: "MULTIPLE_NOTES" }
> {
  const trackNotesMap: Record<number, ReturnType<typeof getNotesInTrack>> = {};

  const sampleGroups: Record<string, Sample[]> = {};
  const groupOrder: string[] = [];

  for (const item of Item.getSelected()) {
    const take = item.activeTake()?.asTypedTake();
    if (!take) continue;
    if (take.TYPE !== "AUDIO") continue;

    const track = item.getTrack();

    const notes = (() => {
      const pitchTrackIdx = track.getIdx() + 1;
      if (pitchTrackIdx in trackNotesMap) {
        return trackNotesMap[pitchTrackIdx];
      } else {
        const pitchTrack = Track.getByIdx(pitchTrackIdx);
        const notes = getNotesInTrack(pitchTrack);
        trackNotesMap[pitchTrackIdx] = notes;
        return notes;
      }
    })();

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

    // use the track name as the group name
    const groupName = `${track.getIdx()}: ${track.name}`;
    if (!(groupName in sampleGroups)) {
      sampleGroups[groupName] = [];
      groupOrder.push(groupName);
    }

    sampleGroups[groupName].push({
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

  return {
    ok: true,
    val: groupOrder.map((groupName) => ({
      name: groupName,
      samples: sampleGroups[groupName],
    })),
  };
}

function velocityToGain(vel: number) {
  // reasamplomatic
  // 127 => +0.0 => 1
  // 117 => -0.7 => 0.9225714271547631
  // 107 => -1.5 => 0.841395141645195
  // 97 => -2.3 => 0.767361489361819
  // 87 => -3.3 => 0.6839116472814294
  // 77 => -4.4 => 0.6025595860743577
  // 67 => -5.6 => 0.5248074602497727
  // 57 => -7.0 => 0.44668359215096315
  // 47 => -8.7 => 0.36728230049808475
  // 37 => -10.9 => 0.2851018267503909
  // 27 => -13.7 => 0.20653801558105297
  // 17 => -17.9 => 0.1273503081016662
  // 7 => -26.4 => 0.04786300923226385
  // 3 => -36.0 => 0.015848931924611134

  // phaseplant (modulating oscillator level)
  // 127 => +0.0 => 1
  // 117 => -0.8 => 0.9120108393559098
  // 97 => -2.4 => 0.7585775750291838
  // 87 => -3.3 => 0.6839116472814294
  // 77 => -4.4 => 0.6025595860743577
  // 67 => -5.6 => 0.5248074602497727
  // 47 => -8.7 => 0.36728230049808475
  // 37 => -10.8 => 0.28840315031266056
  // 27 => -13.5 => 0.21134890398366465
  // 17 => -17.5 => 0.1333521432163324
  // 7 => -25.2 => 0.054954087385762455

  // both are just linear multiplication, i.e. 0..127 == 0.0..1.0
  return vel / 127.0;
}

/** What to do about the playrate when pitching up/down */
enum SamplePitchStyle {
  KeepRate, // use the same playrate we originally captured
  NoStretching, // adjust the playrate to follow the pitch (ignore the captured rate)
  Fit, // adjust the playrate to follow the pitch (ignore the captured rate)
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

  const result = [];

  for (const note of notes) {
    // get a random sample, equal distribution for now
    const sample = samples[randInt(0, samples.length - 1)];

    // create item with sample loaded
    const item = new Item(reaper.AddMediaItemToTrack(track.obj));
    const take = new Take(reaper.AddTakeToMediaItem(item.obj));
    reaper.SetMediaItemTake_Source(take.obj, sample.source.obj);

    // return the item later
    result.push({ item, take, sample });

    // move item to under the note
    item.position = note.startTime;

    // sample basic properties, offset etc
    take.volume = sample.volume * velocityToGain(note.vel);
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
        case SamplePitchStyle.Fit:
          playrate =
            (sample.endOffset - sample.startOffset) /
            (note.endTime - note.startTime);
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

  return result;
}

function clearTrackTimeRange(track: Track, start: number, end: number) {
  // log(`clearTrackTimeRange(<Track ${track.getIdx()}>, ${start}, ${end})`);

  // const MIN_ITEM_LENGTH = 0.0005;
  const FLOAT_ERROR = 0.0000000001;

  for (const item of track.allItems()) {
    const itemStart = item.position;
    const itemEnd = item.position + item.length;

    // log(`  @ ${itemStart}..${itemEnd}`);
    const itemCompletelyInsideRange =
      start - FLOAT_ERROR <= itemStart && itemEnd <= end + FLOAT_ERROR;
    const itemHitsRangeStart =
      itemStart + FLOAT_ERROR < start && start < itemEnd - FLOAT_ERROR;
    const itemHitsRangeEnd =
      itemStart + FLOAT_ERROR < end && end < itemEnd - FLOAT_ERROR;
    // log(`    itemStart = ${itemStart}`);
    // log(`    itemEnd = ${itemEnd}`);
    // log(`    start = ${start}`);
    // log(`    end = ${end}`);
    // log(`    itemStart - start = ${itemStart - start}`);
    // log(`    itemEnd - end = ${itemEnd - end}`);
    // log(`    itemCompletelyInsideRange = ${itemCompletelyInsideRange}`);
    // log(`    itemHitsRangeStart = ${itemHitsRangeStart}`);
    // log(`    itemHitsRangeEnd = ${itemHitsRangeEnd}`);

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
      // if (left.length < MIN_ITEM_LENGTH) left.delete();
      // if (right.length < MIN_ITEM_LENGTH) right.delete();
    } else if (itemHitsRangeStart) {
      const right = item.split(start);
      const left = item;
      right.delete();
      // if (left.length < MIN_ITEM_LENGTH) left.delete();
    } else if (itemHitsRangeEnd) {
      const right = item.split(end);
      const left = item;
      left.delete();
      // if (right.length < MIN_ITEM_LENGTH) right.delete();
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
  for (const note of getItemNotes(take)) {
    if (options.selectedNotesOnly && !note.selected) continue;
    if (note.muted) continue;
    if (note.vel === 0) continue;

    notes.push(note);
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
    } else {
      // no existing sequencing track found, create a new one
      seqTrack = Track.createAtIdx(targetTrackIdx);
      seqTrack.name = targetTrackName;
    }
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

function getMidiMappedSamples() {
  const trackNotesMap: Record<number, ReturnType<typeof getNotesInTrack>> = {};

  const result = [];

  for (const item of Item.getSelected()) {
    const take = item.activeTake()?.asTypedTake();
    if (!take) continue;
    if (take.TYPE !== "AUDIO") continue;

    const track = item.getTrack();
    if (!track.name.startsWith(SEQUENCE_TRACK_NAME_PREFIX)) continue;

    const pitchTrackIdx = track.getIdx() - 1;
    if (pitchTrackIdx < 0) continue; // invalid sample track

    // get MIDI notes in the corresponding pitch track
    const pitchTrack = Track.getByIdx(pitchTrackIdx);
    getNotesInTrack(pitchTrack);
    const notes = (() => {
      if (pitchTrackIdx in trackNotesMap) {
        return trackNotesMap[pitchTrackIdx];
      } else {
        const pitchTrack = Track.getByIdx(pitchTrackIdx);
        const notes = getNotesInTrack(pitchTrack);
        trackNotesMap[pitchTrackIdx] = notes;
        return notes;
      }
    })();

    // find the note that is closest to the selected sample
    const note = (() => {
      const SIMILAR_THRESHOLD = 0.001; // seconds
      const matchingNotes = notes.filter((note) => {
        const closeEnough =
          Math.abs(item.position - note.startTime) <= SIMILAR_THRESHOLD;

        return closeEnough;
      });
      if (matchingNotes.length === 0) {
        // no matching notes found
        // skip this sample
        log(
          `WARN: No notes found for sample at ${item.position}: ${take.name}`,
        );
        return null;
      }

      // at least 1 match found
      // find the note with the closest duration
      return matchingNotes.sort((a, b) => {
        const aLength = a.endTime - a.startTime;
        const bLength = b.endTime - b.startTime;
        const aDiff = Math.abs(aLength - item.length);
        const bDiff = Math.abs(bLength - item.length);
        return aDiff - bDiff;
      })[0];
    })();
    if (note === null) continue;

    result.push({ item, note, track });
  }

  return result;
}

function main() {
  enum SequenceTarget {
    SelectedMIDIItems,
    SelectedAudioSamples,
  }

  // parameters
  let sequenceTarget: SequenceTarget = SequenceTarget.SelectedMIDIItems;
  let samplePitchStyle: SamplePitchStyle = SamplePitchStyle.NoStretching;
  let sampleExtendStyle: SampleExtendStyle = SampleExtendStyle.Stretch;
  let samples: Sample[] = [];
  let sampleGroups: { name: string; samples: Sample[] }[] = [];
  let firstLoop = true;

  // gui code
  const ctx = createContext();
  gfx.init("Sample Palette", 460, 280);
  ctx.style.font = ["Arial", 14];

  microUILoop(ctx, (stop) => {
    if (firstLoop) {
      // attach pin to window
      if (
        reaper.APIExists("JS_Window_Find") &&
        reaper.APIExists("JS_Window_AttachTopmostPin")
      ) {
        const hwnd = reaper.JS_Window_Find("Sample Palette", true);
        if (hwnd) {
          reaper.JS_Window_AttachTopmostPin(hwnd);
        }
      }
    }

    // hack: if space pressed, play/stop transport
    {
      const spacePressed = ctx._inputText.includes(" ");
      if (spacePressed) {
        runMainAction(40044); // Transport: Play/stop
      }
    }

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
        if (ctx.header("Instructions")) {
          const parts = [
            `To use this script, there are 2 steps involved.`,
            `1. Sample collection: You cut and slice samples to be used by this script, these samples will be added to an internal "palette" used by the script.`,
            `For each sample you want to collect, create a MIDI item containing the sample's pitch as a MIDI note. Place that item on the track below the sample. Finally select the samples and click on "Collect samples"`,
            `2. Creating slice sequences: You write a MIDI melody, then use this script to automatically place samples at each MIDI note.`,
            `This depends on the "Target" mode you selected below. For "Selected items in arrange", select a MIDI item then click on a sample button. For "Selected samples", you need to have an existing sample sequence; select samples in the sequence and press a sample button to update the selected samples.`,
          ];
          for (const x of parts) {
            // text
            ctx.layoutRow([-1], 0);
            ctx.text(x);

            // add some space
            ctx.layoutRow([-1], 8);
            ctx.layoutNext();
          }
        }

        ctx.layoutRow([-1], 0);
        if (ctx.button("Collect samples")) {
          const res = getSamples();
          if (!res.ok) {
            const err = res.err;

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
            sampleGroups = res.val;
          }
        }
      }

      // add some space
      ctx.layoutRow([-1], 8);
      ctx.layoutNext();

      // settings section
      {
        ctx.layoutRow([90, -1], 0);

        ctx.label("Playrate:");
        samplePitchStyle = wrappedEnum(
          ctx,
          "samplePitchStyle",
          [
            { id: SamplePitchStyle.KeepRate, name: "Keep collected rate" },
            { id: SamplePitchStyle.NoStretching, name: "Avoid stretching" },
            { id: SamplePitchStyle.Fit, name: "Stretch entire sample to note" },
          ],
          samplePitchStyle,
        );

        ctx.label("Sample too short:");
        sampleExtendStyle = wrappedEnum(
          ctx,
          "sampleExtendStyle",
          [
            { id: SampleExtendStyle.Stretch, name: "Stretch sample to note" },
            { id: SampleExtendStyle.Truncate, name: "Truncate note" },
          ],
          sampleExtendStyle,
        );

        ctx.label("Target:");
        sequenceTarget = wrappedEnum(
          ctx,
          "sequenceTarget",
          [
            {
              id: SequenceTarget.SelectedMIDIItems,
              name: "Selected items in arrange",
            },
            {
              id: SequenceTarget.SelectedAudioSamples,
              name: "Selected samples",
            },
          ],
          sequenceTarget,
        );
      }

      // add some space
      ctx.layoutRow([-1], 8);
      ctx.layoutNext();

      // sequencing section
      {
        ctx.layoutRow([-1], 0);

        if (samples.length === 0) {
          ctx.text("No samples loaded yet...");
        } else {
          ctx.text(
            string.format("Loaded %d samples, all good!", samples.length),
          );
        }

        function sequenceUsingSamples(samples: Sample[]) {
          switch (sequenceTarget) {
            case SequenceTarget.SelectedAudioSamples: {
              const mappedSamples = getMidiMappedSamples();
              if (mappedSamples.length === 0) break;

              undoBlock(
                "Sample Palette: Update sources for selected samples",
                -1,
                () => {
                  // delete the selected samples
                  for (const { item, note, track } of mappedSamples) {
                    item.delete();

                    const sequence = createSampleSequence(
                      [note],
                      samples,
                      track,
                      {
                        pitch: samplePitchStyle,
                        extend: sampleExtendStyle,
                      },
                    );
                    // re-select the items
                    for (const { item } of sequence) {
                      item.selected = true;
                    }
                  }
                },
              );

              break;
            }
            case SequenceTarget.SelectedMIDIItems: {
              undoBlock(
                "Sample Palette: Sequence selected MIDI items",
                -1,
                () => {
                  sequenceSelectedItems(samples, {
                    pitch: samplePitchStyle,
                    extend: sampleExtendStyle,
                  });
                },
              );
              break;
            }
            default:
              assertUnreachable(sequenceTarget);
          }
        }

        // group the samples
        sampleGroups.forEach((group, i) => {
          // list all samples in a list
          const choices = group.samples.map((s) => ({
            name: s.name,
            callback() {
              if (group.samples.length === 0) return;

              sequenceUsingSamples([s]);
            },
          }));
          choices.push({
            name: "Random!",
            callback() {
              if (group.samples.length === 0) return;

              sequenceUsingSamples(group.samples);
            },
          });
          wrappedButtons(ctx, `samples-group${i}`, group.name, choices);
        });

        if (samples.length > 0) {
          if (ctx.button("Random!")) {
            sequenceUsingSamples(samples);
          }
        }
      }

      ctx.endWindow();
    }

    firstLoop = false;
  });
}

errorHandler(main);
