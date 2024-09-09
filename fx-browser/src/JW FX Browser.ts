AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import {
  FX,
  getLastTouchedFx,
  parseTakeContainerFxidx,
  parseTrackContainerFxidx,
} from "reaper-api/fx";
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

const FXCHAIN_WINDOW_TITLE_PREFIX = reaper.LocalizeString("FX: ", "fx", 0);

/**
 * Very hacky function to detect the FX Chain window being focused (if any).
 *
 * This returns the same type as `CF_GetFocusedFXChain`.
 *
 * Note: `identifier`, `HWND`, `FxChain` are all interchangable, they are just hwnds
 */
function getFocusedFxChain(): identifier | null {
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
    if (title.startsWith(FXCHAIN_WINDOW_TITLE_PREFIX)) {
      return hwnd;
    }
  }

  return null;
}

function getFXTarget() {
  const focusedFxChain = getFocusedFxChain();
  if (focusedFxChain) {
    // we are currently focused on an fx chain, try to use `GetTouchedOrFocusedFX`

    // NOTE: `GetTouchedOrFocusedFX` will not detect the focused FX chain if the FX chain is empty, so you can't add FX to an empty fx chain
    const listview = reaper.JS_Window_FindChildByID(focusedFxChain, 1076);
    if (!listview)
      throw new Error("failed to find listview object in FX Chain window");

    const fxCount = reaper.JS_ListView_GetItemCount(listview);
    const fxChainIsEmpty = fxCount === 0;
    // TODO: Handle something when fxchain is empty, GetTouchedOrFocusedFX is not to be trusted

    const [ok, trackidx, itemidx, takeidx, fxidx, parm] =
      reaper.GetTouchedOrFocusedFX(1);

    const track = reaper.GetTrack(0, trackidx);
    if (!track) throw new Error(`failed to get track ${trackidx}`);

    if (itemidx === -1) {
      // target the parent of the fx
      // can be an empty list (represents root fxchain)
      const fxpath = parseTrackContainerFxidx(track, fxidx);
      fxpath.pop();

      return {
        target: "track",
        trackidx,
        track,
        fxpath,
      };
    } else {
      const item = reaper.GetTrackMediaItem(track, itemidx);
      if (!item)
        throw new Error(`failed to get item ${itemidx} on track ${trackidx}`);

      const take = reaper.GetTake(item, takeidx);
      if (!take)
        throw new Error(
          `failed to get take ${takeidx} from item ${itemidx} on track ${trackidx}`,
        );

      // target the parent of the fx
      // can be an empty list (represents root fxchain)
      const fxpath = parseTakeContainerFxidx(take, fxidx);
      fxpath.pop();

      return {
        target: "take",
        trackidx,
        track,
        itemidx,
        item,
        takeidx,
        take,
        fxpath,
      };
    }
  }

  // no focused FX chain, determine if adding to track or take
  // reaper.selitem

  return "temp";
  // reaper.GetLastTouchedTrack();

  // const x = Math.random();
  // if (x === 1) {
  //   return { target: "track", trackIdx: 87, fxidx: 0x2000000 + 2 };
  // } else if (x === 2) {
  //   return { target: "item", trackIdx: 87, itemIdx: 12 };
  // }

  // return null;
}

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
        const hwnds: any[] = [];
        for (
          let hwnd: identifier | null = reaper.JS_Window_GetFocus();
          hwnd !== null;
          hwnd = reaper.JS_Window_GetParent(hwnd)
        ) {
          // reaper.JS_Window_GetLongPtr(hwnd)
          // reaper.JS_Window_AddressFromHandle
          // reaper.JS_Window_GetLongPtr("USERDATA");
          // reaper.JS_Window_GetLongPtr("WNDPROC");
          // reaper.JS_Window_GetLongPtr("DLGPROC");
          // reaper.JS_Window_GetLongPtr("ID");
          // reaper.JS_Window_GetLongPtr("EXSTYLE");
          // reaper.JS_Window_GetLongPtr("STYLE");
          // reaper.JS_Window_GetLong(hwnd)
          reaper.CF_GetFocusedFXChain;
          const title = reaper.JS_Window_GetTitle(hwnd);
          const classname = reaper.JS_Window_GetClassName(hwnd);
          const hwndstring = reaper.JS_Window_AddressFromHandle(hwnd);
          const idInfo = {
            title,
            classname,
            hwndstring,
          };
          hwnds.push(idInfo);
        }

        const focusedfxchain = reaper.CF_GetFocusedFXChain();
        const focusedfxchainstring = reaper.JS_Window_AddressFromHandle(
          focusedfxchain as any,
        );
        // const focusedfxchainstring = reaper.JS_Window_AddressFromHandle(focusedfxchain as any);

        const [retval, trackidx, itemidx, takeidx, fxidx, parm] =
          reaper.GetTouchedOrFocusedFX(1);

        const track = reaper.GetLastTouchedTrack();
        const trackIdx = track ? new Track(track).getIdx() : "no track";

        data = inspect({
          hwnds,
          fxchainFocused: getFocusedFxChain() !== null,
          focusedfxchainstring,
          trackIdx,
          getFXTarget: getFXTarget(),
          focusedFx: retval
            ? (() => {
                const track = Track.getByIdx(trackidx);
                if (itemidx === -1) {
                  // target is track
                  const parsedFxidx = parseTrackContainerFxidx(
                    track.obj,
                    fxidx,
                  );
                  return `track ${trackidx} - fx ${parsedFxidx.join(" > ")}`;
                } else {
                  // target is item
                  return `item ${itemidx} take ${takeidx} (on track ${trackidx}) - fx ${fxidx}`;
                }
              })()
            : "null",
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
