AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { inspect } from "reaper-api/inspect";
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
  gfx.init("My Window", 260, 450);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();

  let x = 300;
  let y = 300;
  let w = 40;
  let h = 40;
  let relative = true;

  microUILoop(ctx, () => {
    ctx.begin();

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
      ctx.label("Controls:");

      ctx.layoutBeginColumn();
      {
        ctx.layoutRow([50, -1], 0);
        ctx.label("x");
        x = ctx.slider("x", x, 0, 500);
        ctx.label("y");
        y = ctx.slider("y", y, 0, 500);
        ctx.label("w");
        w = ctx.slider("w", w, 0, 500);
        ctx.label("h");
        h = ctx.slider("h", h, 0, 500);
      }
      ctx.layoutEndColumn();

      relative = ctx.checkbox("relative", relative);

      ctx.layoutBeginColumn();
      {
        const names: { name: string }[] = [];
        for (let i = 0; i < 20; i++) {
          const name = i.toString().repeat(i);
          names.push({ name });
        }

        ctx.layoutRow([-1], 0);
        const clickedBtn = wrappedButtons(ctx, names);
        if (clickedBtn) {
          log(clickedBtn);
        }
      }
      ctx.layoutEndColumn();

      // ctx.layoutRow([-1], -1);
      ctx.layoutBeginColumn();
      {
        // set layout of the next element
        ctx.layoutSetNext(rect(x, y, w, h), relative);

        ctx.button("X", Option.AlignCenter);

        ctx.button("another button");

        // "peek" the next layout
        {
          const r = ctx.layoutNext();
          ctx.layoutSetNext(r, false);
          ctx.drawRect(r, rgba(255, 0, 0, 255));
        }
        ctx.text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        );
      }
      ctx.layoutEndColumn();

      ctx.endWindow();
    }

    ctx.end();
  });
}

errorHandler(main);
