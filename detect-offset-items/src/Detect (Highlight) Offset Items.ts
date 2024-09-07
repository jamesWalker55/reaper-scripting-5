AddCwdToImportPaths();

import * as path from "reaper-api/path/path";
import { Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";
import { createContext, microUILoop, Option } from "reaper-microui";

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

const HIGHLIGHT_COLOR: Color = { r: 255, g: 0, b: 0 };

function colorsEqual(a: Color, b: Color) {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}

function main() {
  // UI setup
  gfx.init(getScriptName(), 360, 150);
  gfx.setfont(1, "Arial", 14);
  const ctx = createContext();

  // Logic
  const originalItemColors: LuaTable<MediaItem, Color | null> = new LuaTable();
  const THRESHOLD_MIN = 0.0;
  const THRESHOLD_MAX = 1000.0;
  let thresholdLow = 0.0;
  let thresholdHigh = 20.0;
  let thresholdInclusive = false;

  microUILoop(
    ctx,
    () => {
      // logic
      let anyItemColorChanged = false;
      for (const track of Track.iterAll()) {
        for (const item of track.iterItems()) {
          const itemPos = item.getPosition();
          const gridPos = reaper.BR_GetClosestGridDivision(itemPos);
          const posDiff = Math.abs(itemPos - gridPos);

          const color = item.getColor();

          const inThreshold = thresholdInclusive
            ? thresholdLow * 1000000 <= posDiff &&
              posDiff <= thresholdHigh * 1000000
            : thresholdLow * 1000000 < posDiff &&
              posDiff < thresholdHigh * 1000000;

          if (inThreshold) {
            // if position is within threshold...

            // and if color isn't currently HIGHLIGHT_COLOR...
            if (color === null || !colorsEqual(color, HIGHLIGHT_COLOR)) {
              // store color to database
              originalItemColors.set(item.obj, color);
              // set color to HIGHLIGHT_COLOR
              item.setColor(HIGHLIGHT_COLOR);
              anyItemColorChanged = true;
            }
          } else {
            // not in threshold
            // revert color to original if is HIGHLIGHT_COLOR
            if (color && colorsEqual(color, HIGHLIGHT_COLOR)) {
              const originalColor = originalItemColors.get(item.obj);
              item.setColor(originalColor);
              anyItemColorChanged = true;
            }
          }
        }
      }
      if (anyItemColorChanged) {
        reaper.UpdateArrange();
      }

      // draw frame
      ctx.begin();

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
          "Highlight items that are NOT on gridlines. The threshold controls how far the item should be from a gridline. (Unit is in microseconds)",
        );
        ctx.label("Threshold range:");

        ctx.layoutRow([54, -1], 0);
        ctx.label("Low:");
        thresholdLow = ctx.slider(
          "thresholdLow",
          thresholdLow,
          THRESHOLD_MIN,
          thresholdHigh,
          undefined,
          "%.2f μs",
        );
        ctx.label("High:");
        thresholdHigh = ctx.slider(
          "thresholdHigh",
          thresholdHigh,
          thresholdLow,
          THRESHOLD_MAX,
          undefined,
          "%.2f μs",
        );

        ctx.layoutRow([-1], 0);
        thresholdInclusive = ctx.checkbox(
          "Inclusive range",
          thresholdInclusive,
        );

        ctx.endWindow();
      }

      ctx.end();
    },
    () => {
      // code to run on exit

      // revert all colors that are currently using the HIGHLIGHT_COLOR
      for (const track of Track.iterAll()) {
        for (const item of track.iterItems()) {
          const currentColor = item.getColor();
          if (currentColor && colorsEqual(currentColor, HIGHLIGHT_COLOR)) {
            const oldColor = originalItemColors.get(item.obj);
            item.setColor(oldColor);
          }
        }
      }
      reaper.UpdateArrange();
    },
  );
}

errorHandler(main);
