import { FXFolderItemType } from "reaper-api/installedFx";
import { log } from "reaper-api/utils";
import {
  ColorId,
  ReaperContext as Context,
  MouseButton,
  rect,
  rgba,
  vec2,
} from "reaper-microui";

const TOGGLE_BUTTON_COLOR_NORMAL = rgba(25, 25, 25, 1.0);
const TOGGLE_BUTTON_COLOR_HOVER = rgba(45, 45, 45, 1.0);
const TOGGLE_BUTTON_COLOR_FOCUS = rgba(115, 115, 115, 1.0);

export function toggleButton(
  ctx: Context,
  label: string,
  state: boolean,
): boolean {
  const id = ctx.getId(label);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
    state = !state;
  }

  // draw
  if (state) {
    const originalButton = ctx.style.colors[ColorId.Button];
    const originalButtonHover = ctx.style.colors[ColorId.ButtonHover];
    const originalButtonFocus = ctx.style.colors[ColorId.ButtonFocus];
    ctx.style.colors[ColorId.Button] = TOGGLE_BUTTON_COLOR_NORMAL;
    ctx.style.colors[ColorId.ButtonHover] = TOGGLE_BUTTON_COLOR_HOVER;
    ctx.style.colors[ColorId.ButtonFocus] = TOGGLE_BUTTON_COLOR_FOCUS;
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

const FX_ROW_COLOR_NORMAL = rgba(0, 0, 0, 0.0);
const FX_ROW_COLOR_HOVER = rgba(70, 70, 70, 1.0);
const FX_ROW_COLOR_FOCUS = rgba(90, 90, 90, 1.0);

const FX_ROW_TYPE_NAME_COLOR = rgba(140, 140, 140, 1.0);

const FX_ROW_H_WIDTH = 300;

/**
 * Used for vertical list layout
 */
export function fxBrowserH(
  ctx: Context,
  fxs: { uid: string; name: string; type: string; favourite: boolean }[],
) {
  ctx.beginPanel("fxlistv");

  if (fxs.length === 0) {
    ctx.endPanel();
    return null;
  }

  const origSpacing = ctx.style.spacing;
  ctx.style.spacing = 0;

  const r = ctx.getCurrentContainer().rect;

  // each row is `size.y + padding * 2` tall, with `spacing` between each one
  // also account for panel's border padding (`padding`)
  let maxRows =
    (r.h - ctx.style.padding * 2) /
    (ctx.style.size.y + ctx.style.padding * 2 + ctx.style.spacing);
  maxRows = Math.max(maxRows, 1.0);
  maxRows = Math.floor(maxRows);

  const cols = Math.ceil(fxs.length / maxRows);

  let clickedUid: string | null = null;

  {
    const widths = [];
    for (let i = 0; i < cols; i++) {
      widths.push(FX_ROW_H_WIDTH);
    }
    ctx.layoutRow(widths, 0);

    // iterate though fx and rows at the same time
    let i = 0;
    while (i < fxs.length) {
      ctx.layoutBeginColumn();
      ctx.layoutRow([-1], 0);
      for (let row = 0; row < maxRows && i < fxs.length; row++) {
        const fx = fxs[i];

        if (fxBrowserHRow(ctx, fx)) {
          clickedUid = fx.uid;
        }

        i += 1;
      }
      ctx.layoutEndColumn();
    }
  }

  ctx.style.spacing = origSpacing;

  ctx.endPanel();

  return clickedUid;
}

/**
 * Used for horizontal list layout
 */
function fxBrowserHRow(
  ctx: Context,
  fx: { uid: string; name: string; type: string; favourite: boolean },
) {
  // mouse interaction logic
  const id = ctx.getId(fx.uid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  const clicked = ctx.mousePressed === MouseButton.Left && ctx.focus === id;

  // draw the background
  {
    if (ctx.focus === id) {
      // focused
      ctx.drawRect(r, FX_ROW_COLOR_FOCUS);
    } else if (ctx.hover === id) {
      // hovered
      ctx.drawRect(r, FX_ROW_COLOR_HOVER);
    } else {
      // normal
      ctx.drawRect(r, FX_ROW_COLOR_NORMAL);
    }
  }

  // draw text
  const textY = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  // draw the favourite icon
  const favouriteX = r.x + ctx.style.padding;
  const favouriteWidth = ctx.textWidth(ctx.style.font, "★");

  if (fx.favourite) {
    ctx.drawText(
      ctx.style.font,
      "★",
      null,
      vec2(favouriteX, textY),
      ctx.style.colors[ColorId.Text],
    );
  }

  // generate text for the FX type
  const typeWidth = ctx.textWidth(ctx.style.font, fx.type);

  const nameX = favouriteX + favouriteWidth + ctx.style.padding;
  let nameWidth: number;
  // draw the fx name text, but leave space for the type at the end
  {
    const maxWidth =
      r.w -
      ctx.style.padding -
      favouriteWidth -
      ctx.style.padding -
      ctx.style.padding -
      typeWidth -
      ctx.style.padding;

    nameWidth = ctx.textWidth(ctx.style.font, fx.name);
    nameWidth = Math.min(nameWidth, maxWidth);

    ctx.pushClipRect(rect(nameX, r.y, nameWidth, r.h));
    ctx.drawText(
      ctx.style.font,
      fx.name,
      null,
      vec2(nameX, textY),
      ctx.style.colors[ColorId.Text],
    );
    ctx.popClipRect();
  }

  // draw the fx type
  {
    const typeX = nameX + nameWidth + ctx.style.padding;
    ctx.drawText(
      ctx.style.font,
      fx.type,
      null,
      vec2(typeX, textY),
      FX_ROW_TYPE_NAME_COLOR,
    );
  }

  return clicked;
}

/**
 * Used for vertical list layout
 */
export function fxBrowserV(
  ctx: Context,
  fxs: { uid: string; name: string; type: string; favourite: boolean }[],
) {
  ctx.beginPanel("fxlistv");

  ctx.layoutRow([-1], 0);

  const origSpacing = ctx.style.spacing;
  ctx.style.spacing = 0;

  let clickedUid: string | null = null;

  for (const fx of fxs) {
    if (fxBrowserVRow(ctx, fx)) {
      clickedUid = fx.uid;
    }
  }

  ctx.style.spacing = origSpacing;

  ctx.endPanel();

  return clickedUid;
}

/**
 * Used for vertical list layout
 */
export function fxBrowserVRow(
  ctx: Context,
  fx: { uid: string; name: string; type: string; favourite: boolean },
) {
  // mouse interaction logic
  const id = ctx.getId(fx.uid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  const clicked = ctx.mousePressed === MouseButton.Left && ctx.focus === id;

  // draw the background
  {
    if (ctx.focus === id) {
      // focused
      ctx.drawRect(r, FX_ROW_COLOR_FOCUS);
    } else if (ctx.hover === id) {
      // hovered
      ctx.drawRect(r, FX_ROW_COLOR_HOVER);
    } else {
      // normal
      ctx.drawRect(r, FX_ROW_COLOR_NORMAL);
    }
  }

  // draw text
  const textY = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  // draw the favourite icon
  const favouriteX = r.x + ctx.style.padding;
  const favouriteWidth = ctx.textWidth(ctx.style.font, "★");

  if (fx.favourite) {
    ctx.drawText(
      ctx.style.font,
      "★",
      null,
      vec2(favouriteX, textY),
      ctx.style.colors[ColorId.Text],
    );
  }

  // generate text for the FX type
  const typeWidth = ctx.textWidth(ctx.style.font, fx.type);
  const typeX = r.x + r.w - ctx.style.padding - typeWidth;

  // draw the fx type
  {
    ctx.drawText(
      ctx.style.font,
      fx.type,
      null,
      vec2(typeX, textY),
      FX_ROW_TYPE_NAME_COLOR,
    );
  }

  // draw the fx name text
  {
    const x = favouriteX + favouriteWidth + ctx.style.padding;
    const width =
      r.w -
      ctx.style.padding -
      favouriteWidth -
      ctx.style.padding -
      ctx.style.padding -
      typeWidth -
      ctx.style.padding;
    ctx.pushClipRect(rect(x, r.y, width, r.h));
    ctx.drawText(
      ctx.style.font,
      fx.name,
      null,
      vec2(x, textY),
      ctx.style.colors[ColorId.Text],
    );
    ctx.popClipRect();
  }

  return clicked;
}
