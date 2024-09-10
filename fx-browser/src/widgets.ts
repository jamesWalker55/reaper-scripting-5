import { FXFolderItemType } from "reaper-api/installedFx";
import {
  ColorId,
  ReaperContext as Context,
  MouseButton,
  rect,
  rgba,
  vec2,
} from "reaper-microui";

const COLOR_NORMAL = rgba(25, 25, 25, 255);
const COLOR_HOVER = rgba(45, 45, 45, 255);
const COLOR_FOCUS = rgba(115, 115, 115, 255);

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
    ctx.style.colors[ColorId.Button] = COLOR_NORMAL;
    ctx.style.colors[ColorId.ButtonHover] = COLOR_HOVER;
    ctx.style.colors[ColorId.ButtonFocus] = COLOR_FOCUS;
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

export function fxRow(
  ctx: Context,
  uid: string,
  name: string,
  type: number,
  instrument: boolean,
  favourite: boolean,
) {
  // mouse interaction logic
  const id = ctx.getId(uid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // draw the background
  {
    if (ctx.focus === id) {
      // focused
      ctx.drawRect(r, ctx.style.colors[ColorId.BaseFocus]);
    } else if (ctx.hover === id) {
      // hovered
      ctx.drawRect(r, ctx.style.colors[ColorId.BaseHover]);
    } else {
      // normal
      ctx.drawRect(r, ctx.style.colors[ColorId.Base]);
    }
  }

  // draw text
  const textY = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  // draw the favourite icon
  const favouriteX = r.x + ctx.style.padding;
  const favouriteWidth = ctx.textWidth(ctx.style.font, "★");

  if (favourite) {
    ctx.drawText(
      ctx.style.font,
      "★",
      null,
      vec2(favouriteX, textY),
      ctx.style.colors[ColorId.Text],
    );
  }

  // generate text for the FX type
  let typeName =
    type in FXFolderItemType ? FXFolderItemType[type] : type.toString();
  if (instrument) {
    typeName = `${typeName}i`;
  }
  const typeWidth = ctx.textWidth(ctx.style.font, typeName);
  const typeX = r.x + r.w - ctx.style.padding - typeWidth;

  // draw the fx type
  {
    ctx.drawText(
      ctx.style.font,
      typeName,
      null,
      vec2(typeX, textY),
      ctx.style.colors[ColorId.Text],
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
      name,
      null,
      vec2(x, textY),
      ctx.style.colors[ColorId.Text],
    );
    ctx.popClipRect();
  }
}
