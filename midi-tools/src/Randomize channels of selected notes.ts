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

function randomize(
  minChannel: number,
  maxChannel: number,
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

    randomizeTake(take, minChannel, maxChannel, selectedOnly);

    i += 1;
  }

  // random code to make reaper create an undo point
  // https://forum.cockos.com/showthread.php?t=185118
  {
    const take = new Take(reaper.MIDIEditor_GetTake(hwnd));
    const item = take.getItem();
    const wasSelected = reaper.IsMediaItemSelected(item.obj);
    reaper.SetMediaItemSelected(item.obj, !wasSelected);
    reaper.SetMediaItemSelected(item.obj, wasSelected);
  }
}

function randomizeTake(
  take: MediaItem_Take,
  minChannel: number,
  maxChannel: number,
  selectedOnly: boolean,
) {
  let i = 0;
  while (true) {
    let [rv, selected, muted, startppqpos, endppqpos, chan, pitch, vel] =
      reaper.MIDI_GetNote(take, i);
    if (!rv) break;

    if ((selectedOnly && selected) || !selectedOnly) {
      // channels are indexed from 0
      chan = randInt(minChannel, maxChannel) - 1;
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
  let minChannel = 1;
  let maxChannel = 16;

  // gui code
  const ctx = createContext();
  gfx.init("Randomize note channels", 200, 150);
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
      ctx.text(
        "Randomize the MIDI channel of notes in the active MIDI editor.",
      );

      // channel range sliders
      {
        ctx.layoutRow([90, -1], 0);

        ctx.label("Min. channel");
        minChannel = ctx.slider("minChannel", minChannel, 1, 16, 1, "%d");
        ctx.label("Max. channel");
        maxChannel = ctx.slider("maxChannel", maxChannel, 1, 16, 1, "%d");

        minChannel = Math.max(1, Math.min(minChannel, maxChannel));
        maxChannel = Math.max(minChannel, Math.min(maxChannel, 16));
      }

      ctx.layoutRow([-1], 0);

      selectedNotesOnly = ctx.checkbox(
        "Selected notes only",
        selectedNotesOnly,
      );

      if (ctx.button("Randomize!")) {
        undoBlock(() => {
          randomize(minChannel, maxChannel, selectedNotesOnly);
          return { desc: SCRIPT_NAME, flags: -1 };
        }, SCRIPT_NAME);
      }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
