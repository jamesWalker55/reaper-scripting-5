AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { FX, getLastTouchedFx } from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { loadFXFolders, loadInstalledFX } from "reaper-api/installedFx";
import { getSelectedFx } from "reaper-api/selectedFx";
import { Track } from "reaper-api/track";
import { errorHandler, log } from "reaper-api/utils";
import {
  Color,
  ColorId,
  Context,
  createContext,
  demoSimple,
  Font,
  IconId,
  microUILoop,
  MouseButton,
  Option,
  Rect,
  rect,
  Response,
  rgba,
} from "reaper-microui";

const OS = reaper.GetOS();

function assertWindowsOnly() {
  const isWindows = OS.toLowerCase().startsWith("win");
  if (!isWindows) throw new Error("Only Windows is supported");
}

function wrappedButtons<T extends { name: string }>(
  ctx: Context,
  buttons: T[],
): T | null {
  // "peek" the next layout
  const r = ctx.layoutNext();
  ctx.layoutSetNext(r, false);

  // calculate available space for buttons
  const availableWidth = r.w + ctx.style.spacing;

  // storage to determine which button is clicked
  let clickedBtn: T | null = null;

  ctx.layoutBeginColumn();
  {
    let remainingWidth = availableWidth;

    // split the names into rows, based on the width of each button
    let rows: { btn: T; width: number }[][] = [[]];
    for (const btn of buttons) {
      const buttonWidth =
        ctx.textWidth(ctx.style.font, btn.name) + ctx.style.padding * 2;

      if (remainingWidth < buttonWidth + ctx.style.spacing) {
        remainingWidth = availableWidth;
        rows.push([]);
      }
      remainingWidth -= buttonWidth + ctx.style.spacing;

      const currentRow = rows[rows.length - 1];
      currentRow.push({ btn, width: buttonWidth });
    }

    // layout each row
    for (const row of rows) {
      if (row.length === 0) continue;

      ctx.layoutRow(
        row.map((x) => x.width),
        0,
      );
      for (const btn of row) {
        if (ctx.button(btn.btn.name)) {
          clickedBtn = btn.btn;
        }
      }
    }
  }
  ctx.layoutEndColumn();

  return clickedBtn;
}

function fxChainIsFocused() {
  // the JS_Window classname and title functions only work correctly on Windows, see:
  // https://forum.cockos.com/showthread.php?t=213189
  assertWindowsOnly();

  for (
    let hwnd: identifier | null = reaper.JS_Window_GetFocus();
    hwnd !== null;
    hwnd = reaper.JS_Window_GetParent(hwnd)
  ) {
    const classname = reaper.JS_Window_GetClassName(hwnd);

    // // inputboxes have classname == "Edit", and their title is the content of the inputbox
    // // i.e. try renaming an item to have the name "FX:" and the `title` variable will be what you typed
    // if (classname === "Edit") continue;

    // '#32770' is a generic classname for dialog boxes
    // FX chains also happen to use this classname
    if (classname !== "#32770") continue;

    const title = reaper.JS_Window_GetTitle(hwnd);
    // very hacky implementation:
    // just check if any of the parent window titles start with "FX:"
    // only works with English locale but fuck it
    if (title.startsWith("FX:")) return true;
  }

  return false;
}

// function getFXTarget() {
//   // trackIdxOut will be track index (-1 is master track, 0 is first track).
//   // itemidxOut will be 0-based item index if an item, or -1 if not an item.
//   // takeidxOut will be 0-based take index.
//   // fxidxOut will be FX index, potentially with 0x2000000 set to signify container-addressing, or with 0x1000000 set to signify record-input FX.

//   const x = Math.random();
//   if (x === 1) {
//     return { target: "track", trackIdx: 87, fxidx: 0x2000000 + 2 };
//   } else if (x === 2) {
//     return { target: "item", trackIdx: 87, itemIdx: 12 };
//   }
// }

function main() {
  const fxfolders = loadFXFolders();
  const installedfx: Record<string, string | undefined> = {};
  for (const fx of loadInstalledFX()) {
    installedfx[fx.ident] = fx.displayName;
  }

  gfx.init("My Window", 260, 450);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();

  let processCooldown = 0;
  let data: string = "null";

  microUILoop(ctx, () => {
    if (processCooldown < 0) {
      // do logic
      processCooldown = 5;

      {
        const result: any[] = [];
        for (
          let hwnd: identifier | null = reaper.JS_Window_GetFocus();
          hwnd !== null;
          hwnd = reaper.JS_Window_GetParent(hwnd)
        ) {
          const rect = reaper.JS_Window_GetRect(hwnd);
          const title = reaper.JS_Window_GetTitle(hwnd);
          const classname = reaper.JS_Window_GetClassName(hwnd);
          const hwndstring = reaper.BR_Win32_HwndToString(hwnd);
          const idInfo = {
            hwnd,
            rect,
            title,
            classname,
            hwndstring,
          };
          result.push(idInfo);
        }
        // let id: identifier | null = reaper.JS_Window_GetFocus();
        // while (id !== null) {
        //   const rect = reaper.JS_Window_GetRect(id);
        //   const title = reaper.JS_Window_GetTitle(id);
        //   const classname = reaper.JS_Window_GetClassName(id);
        //   const hwndstring = reaper.BR_Win32_HwndToString(id);
        //   const idInfo = {
        //     id,
        //     rect,
        //     title,
        //     classname,
        //     hwndstring,
        //   };
        //   result.push(idInfo);

        //   id = reaper.JS_Window_GetParent(id);
        // }

        const [retval, trackidx, itemidx, takeidx, fxidx, parm] =
          reaper.GetTouchedOrFocusedFX(1);

        const track = reaper.GetLastTouchedTrack();
        const trackIdx = track ? new Track(track).getIdx() : "no track";

        data = inspect({
          hwnds: result,
          trackIdx,
          focusedFx: {
            retval,
            trackidx,
            itemidx,
            takeidx,
            fxidx,
            parm,
          },
        });
      }
    } else {
      // do nothing
      processCooldown -= 1;
    }

    if (
      ctx.beginWindow(
        "Demo Window",
        { x: 0, y: 0, w: 0, h: 0 },
        Option.NoResize | Option.NoTitle | Option.NoClose,
      )
    ) {
      // resize window to gfx bounds
      {
        const win = ctx.getCurrentContainer();
        win.rect.w = gfx.w;
        win.rect.h = gfx.h;
      }

      ctx.layoutRow([-1], 0);
      ctx.text(data);

      // {
      //   const origSpacing = ctx.style.spacing;
      //   ctx.style.spacing = -3;

      //   for (const folder of fxfolders) {
      //     ctx.layoutRow([-1], 0);
      //     ctx.label(`${folder.id}. ${folder.name}`);
      //     ctx.layoutRow([10, 20, 150, -1], 0);
      //     for (const item of folder.items) {
      //       const displayName = installedfx[item.name];
      //       ctx.label("");
      //       ctx.label(item.type.toString());
      //       ctx.label(displayName || "");
      //       ctx.label(item.name);
      //     }
      //   }

      //   ctx.style.spacing = origSpacing;
      // }

      processCooldown;

      ctx.endWindow();
    }
  });
}

errorHandler(main);
