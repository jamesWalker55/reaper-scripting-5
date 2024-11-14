AddCwdToImportPaths();

import * as Path from "reaper-api/path/path";
import { Take } from "reaper-api/track";
import { errorHandler, msgBox, undoBlock } from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";

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

function getPitchRangeFromSelection() {
  const hwnd = reaper.MIDIEditor_GetActive();
  if (hwnd === null) {
    msgBox("Error", "No active MIDI editor!");
    return null;
  }

  let minPitch: number | null = null;
  let maxPitch: number | null = null;

  let takeIdx = 0;
  while (true) {
    const take = reaper.MIDIEditor_EnumTakes(hwnd, takeIdx, true);
    if (take === null) break;

    let noteIdx = 0;
    while (true) {
      let [rv, selected, muted, startppqpos, endppqpos, chan, pitch, vel] =
        reaper.MIDI_GetNote(take, noteIdx);
      if (!rv) break;

      if (selected) {
        if (minPitch === null) {
          minPitch = pitch;
        } else {
          minPitch = Math.min(minPitch, pitch);
        }
        if (maxPitch === null) {
          maxPitch = pitch;
        } else {
          maxPitch = Math.max(maxPitch, pitch);
        }
      }

      noteIdx += 1;
    }

    takeIdx += 1;
  }

  if (minPitch === null || maxPitch === null) {
    return null;
  } else {
    return {
      min: minPitch,
      max: maxPitch,
    };
  }
}

function randomizePitch(
  minPitch: number,
  maxPitch: number,
  selectedOnly: boolean,
) {
  const hwnd = reaper.MIDIEditor_GetActive();
  if (hwnd === null) {
    msgBox("Error", "No active MIDI editor!");
    return;
  }

  let i = 0;
  while (true) {
    const take = reaper.MIDIEditor_EnumTakes(hwnd, i, true);
    if (take === null) break;

    randomizeTakePitch(take, minPitch, maxPitch, selectedOnly);

    i += 1;
  }

  // random code to make reaper create an undo point
  {
    const take = new Take(reaper.MIDIEditor_GetTake(hwnd));
    const item = take.getItem();
    const wasSelected = reaper.IsMediaItemSelected(item.obj);
    reaper.SetMediaItemSelected(item.obj, !wasSelected);
    reaper.SetMediaItemSelected(item.obj, wasSelected);
  }
}

function randomizeTakePitch(
  take: MediaItem_Take,
  minPitch: number,
  maxPitch: number,
  selectedOnly: boolean,
) {
  let i = 0;
  while (true) {
    let [rv, selected, muted, startppqpos, endppqpos, chan, pitch, vel] =
      reaper.MIDI_GetNote(take, i);
    if (!rv) break;

    if ((selectedOnly && selected) || !selectedOnly) {
      pitch = randInt(minPitch, maxPitch);
    }

    reaper.MIDI_SetNote(
      take,
      i,
      selected,
      muted,
      startppqpos,
      endppqpos,
      chan,
      pitch,
      vel,
      true,
    );

    i += 1;
  }

  reaper.MIDI_Sort(take);
}

function main() {
  // parameters
  let selectedNotesOnly = true;
  let minPitch = 0;
  let maxPitch = 127;

  // gui code
  const ctx = createContext();
  gfx.init("Randomize note pitch", 400, 170);
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

      ctx.layoutRow([-1], 0);
      ctx.text("Randomize the pitch of notes in the active MIDI editor.");

      // channel range sliders
      {
        ctx.layoutRow([60, -1], 0);

        ctx.label("Min. pitch");
        minPitch = ctx.slider("minPitch", minPitch, 0, 127, 1, "%d");
        ctx.label("Max. pitch");
        maxPitch = ctx.slider("maxPitch", maxPitch, 0, 127, 1, "%d");

        ctx.layoutNext();

        if (ctx.button("Get pitch range from selected notes")) {
          const selection = getPitchRangeFromSelection();
          if (selection !== null) {
            minPitch = selection.min;
            maxPitch = selection.max;
          }
        }

        minPitch = Math.max(1, Math.min(minPitch, maxPitch));
        maxPitch = Math.max(minPitch, Math.min(maxPitch, 127));
      }

      ctx.layoutRow([-1], 0);

      selectedNotesOnly = ctx.checkbox(
        "Selected notes only",
        selectedNotesOnly,
      );

      if (ctx.button("Randomize!")) {
        undoBlock(() => {
          randomizePitch(minPitch, maxPitch, selectedNotesOnly);
          return { desc: SCRIPT_NAME, flags: -1 };
        }, SCRIPT_NAME);
      }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
