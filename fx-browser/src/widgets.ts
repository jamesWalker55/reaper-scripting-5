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

const COLOR_NORMAL = rgba(255, 0, 0, 255);
const COLOR_HOVER = rgba(255, 255, 0, 255);
const COLOR_FOCUS = rgba(0, 255, 255, 255);

export function toggleButton(
  ctx: Context,
  label: string,
  state: boolean,
): boolean {
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
