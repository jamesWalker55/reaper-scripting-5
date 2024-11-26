import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import {
  deferAsync,
  deferLoop,
  errorHandler,
  getActionContext,
  log,
} from "reaper-api/utils";
import { setCommandState } from "./utils";
import * as imgui from "./imgui";
import { Track } from "reaper-api/track";

function main() {
  const ctx = reaper.ImGui_CreateContext(
    "FX Devices TS",
    reaper.ImGui_ConfigFlags_DockingEnable(),
  );

  setCommandState(true);

  // persistent local state
  let currentTrack: Track | null = null;
  let mods: number = 0;

  deferLoop(
    (stop) => {
      // start base window
      {
        const [visible, open] = reaper.ImGui_Begin(
          ctx,
          "My window",
          true,
          imgui.WindowFlags.NoScrollWithMouse |
            imgui.WindowFlags.NoScrollbar |
            imgui.WindowFlags.MenuBar |
            imgui.WindowFlags.NoCollapse |
            imgui.WindowFlags.NoNav,
        );
        if (!open) {
          if (visible) reaper.ImGui_End(ctx);
          return stop();
        }
        if (!visible) return;
      }

      // update local state
      currentTrack = Track.getLastTouched();
      mods = reaper.ImGui_GetKeyMods(ctx);

      // handle no active track
      if (currentTrack === null) {
        reaper.ImGui_Text(ctx, "Select a track to start");
        reaper.ImGui_End(ctx);
        return;
      }

      reaper.gmem_attach

      reaper.ImGui_Text(ctx, "Hello World!");
      if (reaper.ImGui_Button(ctx, "cool button")) {
        log("Cool button pressed!");
      }

      // end base window
      reaper.ImGui_End(ctx);
    },
    () => {
      // on exit
      setCommandState(false);
    },
  );

  // while (true) {
  //   const [visible, open] = reaper.ImGui_Begin(ctx, "My window", true);
  //   if (!open) {
  //     break;
  //   }

  //   if (visible) {
  //     reaper.ImGui_Text(ctx, "Hello World!");
  //     if (reaper.ImGui_Button(ctx, "cool button")) {
  //       log("Cool button pressed!");
  //     }

  //     reaper.ImGui_End(ctx);
  //   }

  //   await deferAsync();
  // }

  // setCommandState(false);
}

errorHandler(main);
