AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import { loadFXFolders, loadInstalledFX } from "reaper-api/installedFx";
import { errorHandler } from "reaper-api/utils";
import { Context, createContext, microUILoop, Option } from "reaper-microui";
import { getFXTarget } from "./detectTarget";

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

      data = inspect({
        hwnds: (() => {
          const hwnds: any[] = [];
          for (
            let hwnd: identifier | null = reaper.JS_Window_GetFocus();
            hwnd !== null;
            hwnd = reaper.JS_Window_GetParent(hwnd)
          ) {
            const id = reaper.JS_Window_GetLong(hwnd, "ID");
            const title = reaper.JS_Window_GetTitle(hwnd);
            const classname = reaper.JS_Window_GetClassName(hwnd);
            const hwndstring = reaper.JS_Window_AddressFromHandle(hwnd);
            hwnds.push({
              title,
              classname,
              hwndstring,
              id,
            });
          }
          return hwnds;
        })(),
        getFXTarget: getFXTarget(),
      });
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
