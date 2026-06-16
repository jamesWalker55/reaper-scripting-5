AddCwdToImportPaths();

import { Item, MidiTake, Track } from "reaper-api/track";
import * as Path from "reaper-api/path/path";
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
  Error,
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

function getCurrentProject(): { proj: ReaProject; path: string | null } {
  const [proj, path] = reaper.EnumProjects(-1);
  if (path === "") {
    // project is not saved yet
    return { proj, path: null };
  } else {
    return { proj, path };
  }
}

function trackIsValid(proj: ReaProject, x: Track) {
  return reaper.ValidatePtr2(proj, x.obj as any, "MediaTrack*");
}

function main() {
  const stateGetter = (() => {
    const SCAN_TRACKS_INTERVAL = 4; // defer calls
    let scanTracksCountdown = 0;

    let tracks: { label: Track; midi: Track } | null = null;

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

    return {
      get(): {
        label: Track;
        midi: Track;
        proj: ReaProject;
        projName: string | null;
      } | null {
        const { proj, path: projPath } = getCurrentProject();

        let projName: string | null = null;
        if (projPath !== null) projName = Path.split(projPath)[1];

        if (tracks !== null) {
          // known key/midi tracks, check they still exist in current project, or else rescan
          if (
            trackIsValid(proj, tracks.label) &&
            trackIsValid(proj, tracks.midi)
          ) {
            return { proj, projName, ...tracks };
          }

          // tracks are no longer valid
          tracks = null;
          scanTracksCountdown = 0;
        }

        if (scanTracksCountdown <= 0) {
          scanTracksCountdown = SCAN_TRACKS_INTERVAL;
          // need to find the key/midi tracks
          tracks = getOrCreateTracks();
        }
        scanTracksCountdown -= 1;

        return null;
      },
    };
  })();

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

  createDeferredWindow(
    (ctx, stop) => {
      const state = stateGetter.get();

      // Logic
      let errors: Error[] = [];
      if (state !== null) {
        // collect label keys
        const labels = [];
        for (const item of state.label.iterItems()) {
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
        const { sections, errors: e } = parseKeySections(
          labels
            .map((x) => {
              if (x.notes.trim() === "") return null;
              return { text: x.notes, pos: x.position };
            })
            .filter((x) => x !== null),
        );
        errors = e;
        const sectionHash = hashKeySections(sections) + endPos;
        // only update when sections have changed
        if (sectionHash !== prevSectionHash) {
          // create/delete items to match section count
          const midiItems: {
            item: Item;
            take: MidiTake;
          }[] = state.midi
            .allItems()
            .map((item) => {
              const take = item.activeTake()?.asTypedTake() || null;
              if (take?.TYPE === "MIDI") {
                return { item, take };
              } else {
                return null;
              }
            })
            .filter((x) => x !== null);
          while (midiItems.length > sections.length)
            midiItems.pop()?.item.delete();
          while (midiItems.length < sections.length) {
            const last = midiItems[midiItems.length - 1];
            const start = last ? last.item.position + last.item.length : 0;
            const item = new Item(
              reaper.CreateNewMIDIItemInProj(
                state.midi.obj,
                start,
                start + 1,
                false,
              ),
            );
            const take = item.activeTake()?.asTypedTake() || null;
            if (take === null || take.TYPE !== "MIDI")
              throw new Error("failed to get midi item take");
            midiItems.push({ item, take });
          }

          if (sections.length > 0) {
            for (let i = 0; i < sections.length; i++) {
              const prev = sections[i - 1];
              const first = sections[i]!;
              const second = sections[i + 1];
              const { item, take } = midiItems[i]!;

              const firstEnd = second ? second.pos : endPos;
              const circleStep = prev ? circleSteps(prev.key, first.key) : null;

              item.position = first.pos;
              item.length = firstEnd - first.pos;
              take.name = circleStep
                ? `${stringifyKey(first.key)} (${stringifyCircleStep(circleStep)})`
                : `${stringifyKey(first.key)}`;

              const endPPQ = reaper.MIDI_GetPPQPosFromProjTime(
                take.obj,
                firstEnd,
              );
              const evts = keyToMidiEvents(first.key, endPPQ);
              take.midibuf = midibuf.serialiseBuf(evts, true);
            }

            // make the midi editor update after scale change
            for (const { take } of midiItems) {
              reaper.MIDI_RefreshEditors(take.obj);
            }
          }

          prevSectionHash = sectionHash;
        }
      }

      // UI
      {
        ctx.layoutRow([-1], 0);
        {
          let msg: string[] = [];
          if (state === null) {
            msg.push(`Searching for label track "${LABEL_TRACK_NAME}"`);
          } else {
            msg.push(
              `Monitoring track ${state.label.getIdx() + 1} "${state.label.name}" in "${state.projName || "[Unsaved]"}"`,
            );
          }
          msg.push(".".repeat(3 - math.floor(ticker("dots", 40) / (40 / 3))));
          ctx.label(msg.join(""));
        }

        ctx.label(`Errors: (${errors.length})`);

        ctx.layoutRow([-1], -25);
        ctx.beginPanel("Error Panel");
        {
          ctx.layoutRow([-1], 18);
          errors.forEach((err, i) => {
            const id = `err${i}`;
            const msg = string.format(`[%.2fs] %s`, err.pos, err.msg);
            if (interactiveLabel(ctx, id, msg) && state !== null) {
              const curr = reaper.GetCursorPositionEx(state.proj);
              const diff = err.pos - curr;
              reaper.MoveEditCursor(diff, false);
            }
          });
        }
        ctx.endPanel();

        ctx.layoutRow([-1], 0);
        ctx.label(`(Click on an error to scroll to it)`);
      }
    },
    () => {},
  );
}

errorHandler(main);
