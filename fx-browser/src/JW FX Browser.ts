AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import { loadFXFolders, loadInstalledFX } from "reaper-api/installedFx";
import { errorHandler } from "reaper-api/utils";
import {
  ColorId,
  Context,
  createContext,
  microUILoop,
  MouseButton,
  Option,
  rgba,
} from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import { getCategories } from "./categories";

function toggleButton(ctx: Context, label: string, state: boolean): boolean {
  const id = ctx.getId(label);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, Option.AlignCenter);

  // handle click
  if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
    state = !state;
  }

  // draw
  if (state) {
    const originalButton = ctx.style.colors[ColorId.Button];
    const originalButtonHover = ctx.style.colors[ColorId.ButtonHover];
    const originalButtonFocus = ctx.style.colors[ColorId.ButtonFocus];
    ctx.style.colors[ColorId.Button] = rgba(255, 0, 0, 255);
    ctx.style.colors[ColorId.ButtonHover] = rgba(255, 255, 0, 255);
    ctx.style.colors[ColorId.ButtonFocus] = rgba(0, 255, 255, 255);
    ctx.drawControlFrame(id, r, ColorId.Button, 0);
    ctx.style.colors[ColorId.Button] = originalButton;
    ctx.style.colors[ColorId.ButtonHover] = originalButtonHover;
    ctx.style.colors[ColorId.ButtonFocus] = originalButtonFocus;
  } else {
    ctx.drawControlFrame(id, r, ColorId.Button, 0);
  }
  ctx.drawControlText(label, r, ColorId.Text, 0);

  return state;
}

function wrappedButtons<T extends { name: string; state: boolean }>(
  ctx: Context,
  buttons: T[],
): T[] {
  // "peek" the next layout
  const r = ctx.layoutNext();
  ctx.layoutSetNext(r, false);

  // calculate available space for buttons
  const availableWidth = r.w + ctx.style.spacing;

  // storage to determine which button is clicked
  let activeBtns: T[] = [];

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
        btn.btn.state = toggleButton(ctx, btn.btn.name, btn.btn.state);
        if (btn.btn.state) {
          activeBtns.push(btn.btn);
        }
      }
    }
  }
  ctx.layoutEndColumn();

  return activeBtns;
}

function main() {
  const fxfolders = loadFXFolders();
  const installedfx: Record<string, string | undefined> = {};
  for (const fx of loadInstalledFX()) {
    installedfx[fx.ident] = fx.displayName;
  }
  const categories = getCategories();
  const temp = Object.values(categories.folders).map((x) => ({
    ...x,
    name: x.stem,
    state: false,
  }));

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

      const activeButtons = wrappedButtons(ctx, temp);

      ctx.text(inspect(activeButtons));

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
