import { TypedSection } from "reaper-api/extstate";
import * as path from "reaper-api/path/path";
import { Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";

const config = TypedSection("detect-offset-items", {
  windowX: "number",
  windowY: "number",
  windowW: "number",
  windowH: "number",
  windowDock: "number",
});

function getWindowInfo() {
  const [dock, x, y, w, h] = gfx.dock(-1, 0, 0, 0, 0);
  return { dock, x, y, w, h };
}

function getScriptName() {
  const [
    is_new_value,
    fullpath,
    sectionID,
    cmdID,
    mode,
    resolution,
    val,
    contextstr,
  ] = reaper.get_action_context();

  const [parent, filename] = path.split(fullpath);
  const [stem, ext] = path.splitext(filename);

  return stem;
}

type Color = { r: number; g: number; b: number };

const HIGHLIGHT_COLOR: Color = { r: 254, g: 1, b: 2 };

function colorsEqual(a: Color, b: Color) {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}

// process every 5 defer loops to reduce CPU usage
const FRAMESKIP = 5;

const NUMBER_FORMAT = "%.12f s";

function main() {
  // UI setup
  gfx.init(
    getScriptName(),
    config.windowW || 360,
    config.windowH || 210,
    config.windowDock || 0,
    config.windowX || 100,
    config.windowY || 50,
  );
  const ctx = createContext();
  ctx.style.font = ["Arial", 14];

  // Logic
  let frameskipLeft = FRAMESKIP;
  let posDiffs: number[] = [];
  const originalItemColors: LuaTable<MediaItem, Color | null> = new LuaTable();
  const LOW_THRESHOLD_MIN = 0;
  const LOW_THRESHOLD_MAX = 1e-9;
  const HIGH_THRESHOLD_MIN = LOW_THRESHOLD_MAX;
  const HIGH_THRESHOLD_MAX = 1e-2;
  let thresholdLow = 4.5e-10;
  let thresholdHigh = HIGH_THRESHOLD_MAX;
  let thresholdInclusive = false;
  let checkItemEnds = false;
  let checkItemSnapOffset = true;

  microUILoop(
    ctx,
    () => {
      if (frameskipLeft > 0) {
        frameskipLeft -= 1;
        // don't do logic
      } else {
        frameskipLeft = FRAMESKIP;

        // do logic
        {
          posDiffs = [];
          let anyItemColorChanged = false;
          for (const track of Track.iterAll()) {
            for (const item of track.iterItems()) {
              const itemPos = checkItemEnds
                ? item.position + item.length
                : checkItemSnapOffset
                ? item.position + item.snapOffset
                : item.position;
              const gridPos = reaper.BR_GetClosestGridDivision(itemPos);
              const posDiff = Math.abs(itemPos - gridPos);

              const color = item.color;

              const inThreshold = thresholdInclusive
                ? thresholdLow <= posDiff && posDiff <= thresholdHigh
                : thresholdLow < posDiff && posDiff < thresholdHigh;

              if (inThreshold) {
                // if position is within threshold...
                posDiffs.push(posDiff);

                // and if color isn't currently HIGHLIGHT_COLOR...
                if (color === null || !colorsEqual(color, HIGHLIGHT_COLOR)) {
                  // store color to database
                  originalItemColors.set(item.obj, color);
                  // set color to HIGHLIGHT_COLOR
                  item.color = HIGHLIGHT_COLOR;
                  anyItemColorChanged = true;
                }
              } else {
                // not in threshold
                // revert color to original if is HIGHLIGHT_COLOR
                if (color && colorsEqual(color, HIGHLIGHT_COLOR)) {
                  const originalColor = originalItemColors.get(item.obj);
                  item.color = originalColor;
                  anyItemColorChanged = true;
                }
              }
            }
          }
          if (anyItemColorChanged) {
            reaper.UpdateArrange();
          }
        }
      }

      if (
        ctx.beginWindow(
          "Demo Window",
          { x: 0, y: 0, w: 0, h: 0 },
          Option.NoResize | Option.NoTitle | Option.NoClose,
        )
      ) {
        // resize container to the window size
        const win = ctx.getCurrentContainer();
        win.rect.w = gfx.w;
        win.rect.h = gfx.h;

        // create sliders for the threshold
        ctx.layoutRow([-1], 0);
        ctx.text(
          "Highlight items that are NOT on gridlines. The threshold controls how far the item should be from a gridline.",
        );
        ctx.label("Threshold range:");

        ctx.layoutRow([54, -1], 0);
        ctx.label("Low:");
        thresholdLow = ctx.slider(
          "thresholdLow",
          thresholdLow,
          LOW_THRESHOLD_MIN,
          LOW_THRESHOLD_MAX,
          undefined,
          NUMBER_FORMAT,
        );
        ctx.label("High:");
        thresholdHigh = ctx.slider(
          "thresholdHigh",
          thresholdHigh,
          HIGH_THRESHOLD_MIN,
          HIGH_THRESHOLD_MAX,
          undefined,
          NUMBER_FORMAT,
        );

        ctx.layoutRow([-1], 0);
        thresholdInclusive = ctx.checkbox(
          "Inclusive range",
          thresholdInclusive,
        );
        checkItemEnds = ctx.checkbox("Check item ends", checkItemEnds);
        if (!checkItemEnds) {
          checkItemSnapOffset = ctx.checkbox(
            "Account for item snap offset",
            checkItemSnapOffset,
          );
        }

        if (ctx.header("Detected offset positions")) {
          for (const x of posDiffs) {
            ctx.text(string.format(NUMBER_FORMAT, x));
          }
        }

        ctx.endWindow();
      }
    },
    () => {
      // code to run on exit

      // revert all colors that are currently using the HIGHLIGHT_COLOR
      for (const track of Track.iterAll()) {
        for (const item of track.iterItems()) {
          const currentColor = item.color;
          if (currentColor && colorsEqual(currentColor, HIGHLIGHT_COLOR)) {
            const oldColor = originalItemColors.get(item.obj);
            item.color = oldColor;
          }
        }
      }
      reaper.UpdateArrange();

      // save window position and dock state
      {
        const wnd = getWindowInfo();

        config.windowDock = wnd.dock;
        config.windowX = wnd.x;
        config.windowY = wnd.y;
        config.windowW = wnd.w;
        config.windowH = wnd.h;
      }
    },
  );
}

errorHandler(main);
