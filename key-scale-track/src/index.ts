AddCwdToImportPaths();

import { Track } from "reaper-api/track";
import {
  clearConsole,
  errorHandler,
  log,
  msgBox,
  undoBlock,
} from "reaper-api/utils";
import * as JSON from "reaper-api/json";
import { createContext, microUILoop, Option, ReaperContext } from "microui";
import { stringifyKey, parseKey, Key } from "./key";
import { parseKeyOrTranspose } from "./key/parse";
import { inspect } from "reaper-api/inspect";
import * as midibuf from "reaper-api/midibuf";
import { assertSorted } from "./utils";
import { parseKeySections } from "./keysections";

const LABEL_TRACK_NAME = "KEY";
const MIDI_TRACK_NAME = "SCALE";

const SCRIPT_NAME = "Key-Scale Track";
const HELP_TEXT = `
Usage:

Create a top-level track, named "${LABEL_TRACK_NAME}". It should contain only empty items, write the names of your keys here.
`.slice(1, -1);

function errorMsgBox(msg: string) {
  msgBox(SCRIPT_NAME, `${msg}\n\n${HELP_TEXT}`);
}

function createDeferredWindow(
  process: (ctx: ReaperContext, stop: () => void) => void,
  onExit: () => void,
) {
  gfx.init(SCRIPT_NAME, 400, 200);
  const ctx = createContext();
  ctx.style.font = ["Arial", 14];

  microUILoop(
    ctx,
    (stop) => {
      if (
        ctx.beginWindow(
          "Demo Window",
          { x: 0, y: 0, w: 0, h: 0 },
          Option.NoResize | Option.NoTitle | Option.NoClose,
        )
      ) {
        const win = ctx.getCurrentContainer();
        win.rect.w = gfx.w;
        win.rect.h = gfx.h;

        process(ctx, stop);

        ctx.endWindow();
      }
    },
    onExit,
  );
}

function getOrCreateTracks(): { label: Track; midi: Track } | null {
  let currentDepth = 0;
  for (let i = 0; i < Track.count(); i++) {
    const track = Track.getByIdx(i);

    // only check top-level tracks
    if (currentDepth !== 0) {
      currentDepth += track.getRawFolderDepth();
      continue;
    }
    currentDepth += track.getRawFolderDepth();

    if (track.name === LABEL_TRACK_NAME) {
      // the next track MUST be the midi track.
      // if it doesn't exist, create one now
      let midi: Track;
      try {
        midi = Track.getByIdx(i + 1);
        if (midi.name !== MIDI_TRACK_NAME) {
          undoBlock(`${SCRIPT_NAME}: Create scale track`, -1, () => {
            midi = Track.createAtIdx(i + 1);
            midi.name = MIDI_TRACK_NAME;
          });
        }
      } catch (e) {
        // track does not exist, e.g. end of track list
        // create new track
        undoBlock(`${SCRIPT_NAME}: Create scale track`, -1, () => {
          midi = Track.createAtLastPosition();
          midi.name = MIDI_TRACK_NAME;
        });
      }
      return { label: track, midi: midi! };
    }
  }
  return null;
}

function trackIsValid(proj: ReaProject, x: Track) {
  return reaper.ValidatePtr2(proj, x.obj as any, "MediaTrack*");
}

function main() {
  const proj = reaper.EnumProjects(-1)[0];
  const tracks = getOrCreateTracks();
  if (tracks === null) {
    errorMsgBox("Failed to find key track!");
    return;
  }

  let i = 0;

  createDeferredWindow(
    (ctx, stop) => {
      ctx.layoutRow([-1], 0);

      ctx.label("Monitoring label track...");
      ctx.label("Close this window to stop processing");

      // check that the tracks still exist
      if (
        !trackIsValid(proj, tracks.label) ||
        !trackIsValid(proj, tracks.midi)
      ) {
        stop();
        return null;
      }

      // collect label keys
      const labels = [];
      for (const item of tracks.label.iterItems()) {
        if (!item.isEmpty()) continue;
        if (item.muted) continue;

        labels.push(item);
      }
      assertSorted(labels, (item) => item.position);
      // labels.sort((a, b) => a.position - b.position);

      clearConsole();
      // parse labels
      // i += 1;
      // log(i);
      // let prevKey: Key | null = null;
      // for (const item of labels) {
      //   const notes = item.notes;
      //   const parsed: { ok: Key } | { err: string } =
      //     prevKey === null
      //       ? parseKey(notes)
      //       : parseKeyOrTranspose(notes, prevKey);
      //   if ("ok" in parsed) {
      //     log(`${JSON.encode(notes)} -> ${stringifyKey(parsed.ok)}`);
      //     prevKey = parsed.ok;
      //   } else {
      //     log(`${JSON.encode(notes)} -> err: ${parsed.err}`);
      //   }
      // }

      // print midi events on all midi items
      // for (const item of tracks.midi.iterItems()) {
      //   const take = item.activeTake()?.asTypedTake() || null;
      //   if (take === null) continue;
      //   if (take.TYPE !== "MIDI") continue;

      //   const buf = take.midibuf;
      //   ctx.text(inspect(buf));

      //   const parsed = midibuf.parseBuf(buf);
      //   parsed.forEach((evt, i) => {
      //     ctx.text(`${i}. ${JSON.encode(evt)}`);
      //   });
      // }

      // print parsed sections
      const { sections, errors } = parseKeySections(
        labels.map((x) => ({ text: x.notes, pos: x.position })),
      );
      ctx.text(`Errors: (${errors.length})`);
      for (const err of errors) {
        const msg = string.format(`%.2f %s`, err.pos, err.msg);
        ctx.text(msg);
      }
      for (const x of sections) {
        const msg = string.format(`%.2f %s`, x.pos, stringifyKey(x.key));
        log(msg);
      }

      return null;
    },
    () => {},
  );
}

errorHandler(main);
