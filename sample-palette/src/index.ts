AddCwdToImportPaths();

import * as Path from "reaper-api/path/path";
import { Item, Take, Track } from "reaper-api/track";
import { assertUnreachable, errorHandler, undoBlock } from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";

const SCRIPT_NAME = (() => {
  const filename = reaper.get_action_context()[1];
  return Path.splitext(Path.split(filename)[1])[0];
})();

function getNoteName(val: number) {
  const NOTE_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // pitch in range 0 <= x < 12
  const pitch = val % 12;
  // octave in range -1 <= x <= 9
  const octave = Math.floor(val / 12) - 1;

  return `${NOTE_NAMES[pitch]}${string.format("%d", octave)}`;
}

/** Random integer in range `min..=max` (inclusive) */
function randInt(min: number, max: number) {
  const rangeRand = math.min(
    math.max(0, math.floor(math.random() * (max - min + 1))),
    max - min,
  );
  return rangeRand + min;
}

/** Get the palette of samples from the selection */
function getSamples(samplePitch: number) {
  const result = [];

  for (const item of Item.getSelected()) {
    const take = item.activeTake();
    if (!take) continue;
    if (take.isMidi()) continue;

    const source = take.getSource();

    const volume = take.volume * item.volume;
    const pan = take.pan;
    const playrate = take.playrate;
    const startOffset = take.sourceStartOffset;
    const endOffset = startOffset + item.length * take.playrate;
    // length in source sample seconds
    const fadeInLength = item.fadeInLength * playrate;
    const fadeOutLength = item.fadeOutLength * playrate;
    // assume all samples have the same pitch as given by `samplePitch`
    // absolute pitch, in MIDI terms (i.e. from 0.0 -- 127.0)
    const pitch =
      samplePitch -
      (take.pitch + (take.preservePitch ? 0 : Math.log2(take.playrate) * 12));

    result.push({
      source,
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

  return result;
}

type Sample = ReturnType<typeof getSamples>[number];

function getItemNotes() {
  const result = [];

  for (const item of Item.getSelected()) {
    const take = item.activeTake();
    if (!take) continue;
    if (!take.isMidi()) continue;

    const notes = [];

    let i = 0;
    while (true) {
      let [rv, selected, muted, startTick, endTick, chan, pitch, vel] =
        reaper.MIDI_GetNote(take.obj, i);
      if (!rv) break;

      if (!muted && vel > 0) {
        const startTime = reaper.MIDI_GetProjTimeFromPPQPos(
          take.obj,
          startTick,
        );
        const endTime = reaper.MIDI_GetProjTimeFromPPQPos(take.obj, endTick);

        notes.push({
          startTime,
          endTime,
          pitch,
        });
      }

      i += 1;
    }

    result.push({
      item,
      take,
      notes,
    });
  }

  return result;
}

type ItemNotes = ReturnType<typeof getItemNotes>[number];
type Note = ReturnType<typeof getItemNotes>[number]["notes"][number];

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

function createSampleSequences(
  allItemNotes: ItemNotes[],
  samples: Sample[],
  options: {
    pitch: SamplePitchStyle;
    extend: SampleExtendStyle;
  },
) {
  // group itemnotes by track
  const trackItemNotes: LuaTable<MediaTrack, ItemNotes[]> = new LuaTable();
  for (const itemNote of allItemNotes) {
    const track = itemNote.item.getTrack();

    if (trackItemNotes.get(track.obj) === null)
      trackItemNotes.set(track.obj, []);
    const x = trackItemNotes.get(track.obj);

    x.push(itemNote);
  }

  // sequence the items
  for (const [trackObj, itemNotes] of trackItemNotes) {
    const track = new Track(trackObj);

    // create a new track for sequencing
    const sequencingTrackIdx = track.getIdx() + 1;
    reaper.InsertTrackInProject(0, sequencingTrackIdx, 0);
    const sequencingTrack = Track.getByIdx(sequencingTrackIdx);

    for (const itemNote of itemNotes) {
      createSampleSequence(itemNote.notes, samples, sequencingTrack, options);
    }
  }
}

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
