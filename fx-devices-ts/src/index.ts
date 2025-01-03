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
import {
  Color,
  im,
  Mod,
  MouseButton,
  StyleVar,
  WindowFlags,
  withStyle,
} from "./imgui";
import { Track } from "reaper-api/track";

function main() {
  const ctx = im.CreateContext("FX Devices TS", im.ConfigFlags_DockingEnable);

  setCommandState(true);

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

      // local state
      const track: Track | null = Track.getLastTouched();
      if (track === null) {
        // handle no active track
        im.Text(ctx, "Select a track to start");
        im.End(ctx);
        return;
      }
      const fxCount = track.getFxCount();
      const allFx = track.getAllFx();
      const mods: Mod = im.GetKeyMods(ctx);

      // menu bar
      {
        im.BeginMenuBar(ctx);

        im.Text(ctx, track.name);

        im.EndMenuBar(ctx);
      }

      const [maxX, maxY] = im.GetContentRegionMax(ctx);
      const framepadding = im.StyleVar_FramePadding;
      const BorderSize = im.StyleVar_FrameBorderSize;
      const FrameRounding = im.StyleVar_FrameRounding;
      const BtnTxtAlign = im.StyleVar_ButtonTextAlign;
      const payload = (() => {
        const [active, type, payload, isPreview, isDelivery] =
          im.GetDragDropPayload(ctx);
        return { active, type, payload, isPreview, isDelivery };
      })();

      withStyle(
        ctx,
        [
          // Child Frame for all FX Devices
          { var: StyleVar.FramePadding, a: 0, b: 3 },
          // Child Border size
          { var: StyleVar.ChildBorderSize, a: 0 },
          // todo: custom colors
          // { color: Color.ChildBg, rgba: customColors.Window_BG || 0x000000ff },
        ],
        () => {
          im.BeginChild(
            ctx,
            "fx devices",
            maxX,
            260,
            undefined,
            WindowFlags.HorizontalScrollbar,
          );

          for (let i = 0; i < 2; i++) {
            im.Spacing(ctx);
          }

          // "cursor" refers to imgui's output position, NOT the mouse!
          const cursorStartX = im.GetCursorStartPos(ctx)[0];
          const [winL, winT] = im.GetCursorScreenPos(ctx)
          const height = 220;
          const winB = winT + height;

          const asd = im.GetWindowDrawList(ctx);
          // im.GetScrollX(ctx)

          im.EndChild(ctx);
        },
      );
      im.PushStyleVar(ctx, framepadding, 0, 3); // StyleVar#1 (Child Frame for all FX Devices)
      im.PopStyleVar(ctx);

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
