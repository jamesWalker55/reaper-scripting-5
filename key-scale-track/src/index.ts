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
import { createContext, microUILoop, Option } from "microui";
import { parseKey } from "./key";

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
  process: (stop: () => void) => string | null,
  onExit: () => void,
) {
  gfx.init(SCRIPT_NAME, 200, 80);
  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

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

        ctx.layoutRow([-1], 0);

        ctx.label("Monitoring label track...");
        ctx.label("Close this window to stop processing");

        const msg = process(stop);
        if (msg) {
          ctx.label(msg);
        }

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
    (stop) => {
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
      labels.sort((a, b) => a.position - b.position);

      // parse labels
      // const a = labels[0];
      // log(labels);
      clearConsole();
      i += 1;
      log(i);
      for (const item of labels) {
        const notes = item.notes;
        const parsed = parseKey(notes);
        log(`${notes} -> ${JSON.encode(parsed)}`);
      }

      return null;
    },
    () => {},
  );
}

errorHandler(main);
