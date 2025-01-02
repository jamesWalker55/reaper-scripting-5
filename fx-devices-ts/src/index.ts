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
import { im, WindowFlags } from "./imgui";
import { Track } from "reaper-api/track";

function main() {
  const ctx = im.CreateContext("FX Devices TS", im.ConfigFlags_DockingEnable);

  setCommandState(true);

  // persistent local state
  let currentTrack: Track | null = null;
  let mods: number = 0;

  deferLoop(
    (stop) => {
      // start base window
      {
        const [visible, open] = im.Begin(
          ctx,
          "My window",
          true,
          WindowFlags.NoScrollWithMouse |
            WindowFlags.NoScrollbar |
            WindowFlags.MenuBar |
            WindowFlags.NoCollapse |
            WindowFlags.NoNav,
        );
        if (!open) {
          if (visible) im.End(ctx);
          return stop();
        }
        if (!visible) return;
      }

      // update local state
      currentTrack = Track.getLastTouched();
      mods = im.GetKeyMods(ctx);

      // handle no active track
      if (currentTrack === null) {
        im.Text(ctx, "Select a track to start");
        im.End(ctx);
        return;
      }

      reaper.gmem_attach;

      im.Text(ctx, "Hello World!");
      if (im.Button(ctx, "cool button")) {
        log("Cool button pressed!");
      }

      // end base window
      im.End(ctx);
    },
    () => {
      // on exit
      setCommandState(false);
    },
  );

  // while (true) {
  //   const [visible, open] = im.Begin(ctx, "My window", true);
  //   if (!open) {
  //     break;
  //   }

  //   if (visible) {
  //     im.Text(ctx, "Hello World!");
  //     if (im.Button(ctx, "cool button")) {
  //       log("Cool button pressed!");
  //     }

  //     im.End(ctx);
  //   }

  //   await deferAsync();
  // }

  // setCommandState(false);
}

errorHandler(main);
