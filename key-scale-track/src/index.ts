AddCwdToImportPaths();

import { Item, Track } from "reaper-api/track";
import {
  clearConsole,
  errorHandler,
  log,
  msgBox,
  undoBlock,
} from "reaper-api/utils";
import * as JSON from "reaper-api/json";
import {
  ColorId,
  createContext,
  microUILoop,
  Option,
  ReaperContext,
} from "microui";
import { stringifyKey, parseKey, Key } from "./key";
import { parseKeyOrTranspose } from "./key/parse";
import { inspect } from "reaper-api/inspect";
import * as midibuf from "reaper-api/midibuf";
import { assertSorted } from "./utils";
import {
  hashKeySections,
  keyToMidiEvents,
  parseKeySections,
} from "./keysections";
import { interactiveLabel } from "./widgets";
import { circleSteps } from "./key/circle";
import { stringifyCircleStep } from "./key/stringify";

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

  ctx.style.colors[ColorId.PanelBG].a = 64;

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

  const ticker = (() => {
    const mem: Record<string, number> = {};

    return (name: string, ticks: number) => {
      ticks = math.max(1, Math.round(ticks));
      const cur = mem[name] || 0;
      mem[name] = cur === 0 ? ticks - 1 : cur - 1;
      return cur;
    };
  })();

  let prevSectionHash = "temp";
  let paused = false;

  createDeferredWindow(
    (ctx, stop) => {
      // check that the tracks still exist
      if (
        !trackIsValid(proj, tracks.label) ||
        !trackIsValid(proj, tracks.midi)
      ) {
        stop();
        return;
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

      // find the length of the key track
      const endPos = labels
        .map((item) => item.position + item.length)
        .reduce((acc, endPos) => (acc > endPos ? acc : endPos), 0);

      // parse sections
      const { sections, errors } = parseKeySections(
        labels.map((x) => ({ text: x.notes, pos: x.position })),
      );
      const sectionHash = hashKeySections(sections) + endPos;
      if (
        !paused &&
        ticker("sectionupdate", 10) === 0 &&
        sectionHash !== prevSectionHash
      ) {
        // only update when sections have changed
        for (const item of tracks.midi.allItems()) {
          item.delete();
        }

        if (sections.length > 0) {
          for (let i = 0; i < sections.length; i++) {
            const prev = sections[i - 1];
            const first = sections[i]!;
            const second = sections[i + 1];

            const firstEnd = second ? second.pos : endPos;
            const circleStep = prev ? circleSteps(prev.key, first.key) : null;

            const item = new Item(
              reaper.CreateNewMIDIItemInProj(
                tracks.midi.obj,
                first.pos,
                firstEnd,
                false,
              ),
            );
            const take = item.activeTake();
            if (take === null) throw new Error("failed to get midi item take");
            const endPPQ = reaper.MIDI_GetPPQPosFromProjTime(
              take.obj,
              firstEnd,
            );
            const evts = keyToMidiEvents(first.key, endPPQ);
            take.midibuf = midibuf.serialiseBuf(evts, true);
            take.name = circleStep
              ? `${stringifyKey(first.key)} (${stringifyCircleStep(circleStep)})`
              : `${stringifyKey(first.key)}`;
          }
        }

        prevSectionHash = sectionHash;
      }

      ctx.layoutRow([-85, -40, -1], 0);
      ctx.label(
        paused
          ? `Updates paused.`
          : `Monitoring label track${".".repeat(3 - math.floor(ticker("dots", 40) / (40 / 3)))}`,
      );
      if (ctx.button(paused ? `Start` : `Pause`)) {
        paused = !paused;
      }
      if (ctx.button(`Exit`)) {
        stop();
      }

      ctx.label(`Errors: (${errors.length})`);

      ctx.layoutRow([-1], -25);
      ctx.beginPanel("Error Panel");
      {
        ctx.layoutRow([-1], 18);
        errors.forEach((err, i) => {
          const id = `err${i}`;
          const msg = string.format(`%.2f %s`, err.pos, err.msg);
          if (interactiveLabel(ctx, id, msg)) {
            const curr = reaper.GetCursorPositionEx(proj);
            const diff = err.pos - curr;
            reaper.MoveEditCursor(diff, false);
          }
        });
      }
      ctx.endPanel();

      ctx.layoutRow([-1], 0);
      ctx.label(`(Click on an error to scroll to it)`);

      // /* output text panel */
      // ctx.layoutRow([-1], -25);
      // ctx.beginPanel("Log Output");
      // ctx.layoutRow([-1], -1);
      // ctx.text(logWindowLog);
      // ctx.endPanel();

      // /* input textbox + submit button */
      // let submitted = false;
      // ctx.layoutRow([-70, -1], 0);
      // logWindowTextboxInput = ctx.textbox(
      //   "textbox",
      //   logWindowTextboxInput,
      //   Option.None,
      //   (res) => {
      //     if (res && (res & Response.Submit) !== 0) {
      //       ctx.setFocus(ctx.lastId);
      //       submitted = true;
      //     }
      //   },
      // );
      // if (ctx.button("Submit")) {
      //   submitted = true;
      // }
      // if (submitted) {
      //   writeLog(logWindowTextboxInput);
      //   logWindowTextboxInput = "";
      // }
    },
    () => {},
  );
}

errorHandler(main);
