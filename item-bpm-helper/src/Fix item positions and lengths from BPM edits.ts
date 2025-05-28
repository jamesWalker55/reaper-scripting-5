AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as path from "reaper-api/path/path";
import { errorHandler } from "reaper-api/utils";
import {
  createContext,
  microUILoop,
  MouseButton,
  Option,
  ReaperContext,
} from "reaper-microui";
import { applyNewBpmToSelectedItems, config } from "./common";

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

function clearOnClicked(ctx: ReaperContext, identifier: string, buf: string) {
  if (
    ctx.mousePressed === MouseButton.Left &&
    ctx.focus === ctx.getId(identifier)
  ) {
    // just clicked, clear it
    return "";
  } else {
    // not clicked, return prev value
    return buf;
  }
}

function startUI() {
  const [currentBpm, currentBpi] = reaper.GetProjectTimeSignature2(0);

  // UI setup
  gfx.init(
    getScriptName(),
    config.windowW || 150,
    config.windowH || 130,
    config.windowDock || 0,
    config.windowX || 100,
    config.windowY || 50,
  );
  const ctx = createContext();
  ctx.style.font = ["Arial", 14];

  // Params
  let inputOldBpm = string.format("%d", currentBpm);
  let inputNewBpm = string.format("%d", currentBpm);
  let inputItemsReversed = false;
  let inputSubmit = false;

  microUILoop(
    ctx,
    (stop) => {
      if (
        ctx.beginWindow(
          "Items BPM Updater",
          { x: 0, y: 0, w: 0, h: 0 },
          Option.NoResize | Option.NoTitle | Option.NoClose,
        )
      ) {
        // resize container to the window size
        const win = ctx.getCurrentContainer();
        win.rect.w = gfx.w;
        win.rect.h = gfx.h;

        // BPM input
        ctx.layoutRow([80, -1], 0);
        ctx.label("Old BPM");
        inputOldBpm = ctx.textbox("inputOldBpm", inputOldBpm);
        inputOldBpm = clearOnClicked(ctx, "inputOldBpm", inputOldBpm);
        ctx.label("New BPM");
        inputNewBpm = ctx.textbox("inputNewBpm", inputNewBpm);
        inputNewBpm = clearOnClicked(ctx, "inputNewBpm", inputNewBpm);

        // Should reverse or not
        ctx.layoutRow([-1], 0);
        inputItemsReversed = ctx.checkbox(
          "Items are reversed",
          inputItemsReversed,
        );

        // submit button
        if (ctx.button("Apply to selected")) {
          inputSubmit = true;
          stop();
        }

        ctx.endWindow();
      }
    },
    () => {
      // code to run on exit

      // save window position and dock state
      {
        const wnd = getWindowInfo();

        config.windowDock = wnd.dock;
        config.windowX = wnd.x;
        config.windowY = wnd.y;
        config.windowW = wnd.w;
        config.windowH = wnd.h;
      }

      // if submit button pressed...
      if (inputSubmit) {
        // input validation
        const sourceBpm = parseInt(inputOldBpm);
        const targetBpm = parseInt(inputNewBpm);
        if (isNaN(sourceBpm))
          throw new Error(`Invalid source BPM: ${inspect(inputOldBpm)}`);
        if (isNaN(targetBpm))
          throw new Error(`Invalid target BPM: ${inspect(inputNewBpm)}`);

        config.sourceBpm = sourceBpm;
        config.targetBpm = targetBpm;

        applyNewBpmToSelectedItems(sourceBpm, targetBpm, inputItemsReversed);
      }
    },
  );
}

errorHandler(startUI);
