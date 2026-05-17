import { OSType } from "reaper-api/ffi";
import { encode } from "reaper-api/json";
import { errorHandler, log } from "reaper-api/utils";
import { createContext, microUILoop, Option, ReaperContext } from "microui";

export function baseWindow(ctx: ReaperContext, inner: () => void) {
  if (
    ctx.beginWindow(
      "Base Window",
      { x: 0, y: 0, w: 0, h: 0 },
      Option.NoResize | Option.NoTitle | Option.NoClose,
    )
  ) {
    const win = ctx.getCurrentContainer();
    win.rect.w = gfx.w;
    win.rect.h = gfx.h;

    inner();

    ctx.endWindow();
  }
}
