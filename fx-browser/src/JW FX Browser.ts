AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import { loadFXFolders, loadInstalledFX } from "reaper-api/installedFx";
import { errorHandler } from "reaper-api/utils";
import { Context, createContext, microUILoop, Option } from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import { getCategories } from "./categories";

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
  const categories = inspect(getCategories());

  gfx.init("My Window", 260, 450);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();

  microUILoop(ctx, () => {
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
      ctx.text(categories);

      // {
      //   const origSpacing = ctx.style.spacing;
      //   ctx.style.spacing = -3;

      //   for (const folder of fxfolders) {
      //     ctx.layoutRow([-1], 0);
      //     ctx.label(`${folder.id}. ${folder.name}`);
      //     ctx.layoutRow([10, 20, 150, -1], 0);
      //     for (const item of folder.items) {
      //       const displayName = installedfx[item.ident];
      //       ctx.label("");
      //       ctx.label(item.type.toString());
      //       ctx.label(displayName || "");
      //       ctx.label(item.ident);
      //     }
      //   }

      //   ctx.style.spacing = origSpacing;
      // }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
