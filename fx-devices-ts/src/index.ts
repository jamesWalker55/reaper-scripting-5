import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import {
  clearConsole,
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
  r,
  StyleVar,
  WindowFlags,
  withStyle,
} from "./imgui";
import { Track } from "reaper-api/track";
import { HEIGHT as FX_LAYOUT_HEIGHT } from "./layout";
import { inspect } from "reaper-api/inspect";

enum DragDropType {
  DeviceHeader = "DeviceHeader",
}

function getDragDropPayload(ctx: ImGui_Context) {
  const [active, type, payload, isPreview, isDelivery] =
    im.GetDragDropPayload(ctx);

  if (!active) return null;

  if (!(type in DragDropType))
    throw new Error("Unknown drag-drop payload type");

  return { type: type as DragDropType, payload, isPreview, isDelivery };
}

const DEFAULT_COLORS = {
  mainBg: 0x818181ff,
  deviceBg: 0xa5a5a5ff,
  deviceEmptyBg: 0xa5a5a5ff,
};
type ColorScheme = typeof DEFAULT_COLORS;

function main() {
  const ctx = im.CreateContext("FX Devices TS", im.ConfigFlags_DockingEnable);

  // setCommandState(true);

  let x = 0;
  let wasDraggingLastFrame = false;

  deferLoop(
    (stop) => {
      // start base window
      {
        im.PushStyleColor(ctx, Color.WindowBg, DEFAULT_COLORS.mainBg);
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
        if (!open && visible) {
          im.PopStyleColor(ctx);
          im.End(ctx);
          return stop();
        }

        if (!open) return stop();
        if (!visible) return;

        im.PopStyleColor(ctx);
      }

      // local state
      const track: Track | null = Track.getLastTouched();
      if (track === null) {
        // handle no active track
        im.Text(ctx, "Select a track to start");
        im.End(ctx);
        return;
      }
      const allFx = track.getAllFx();
      const mods: Mod = im.GetKeyMods(ctx);

      // menu bar
      if (im.BeginMenuBar(ctx)) {
        im.Text(ctx, track.name);

        im.EndMenuBar(ctx);
      }

      const temp = [];

      im.PushStyleColor(ctx, Color.ChildBg, 0xff00ffff);

      if (
        im.BeginChild(
          ctx,
          "fx devices",
          undefined,
          FX_LAYOUT_HEIGHT + im.GetStyleVar(ctx, StyleVar.ScrollbarSize)[0],
          undefined,
          WindowFlags.HorizontalScrollbar,
        )
      ) {
        for (const fx of allFx) {
          im.PushID(ctx, fx.fxidx.toString());

          temp.push(im.GetCursorPos(ctx));

          if (
            im.BeginChild(
              ctx,
              "device",
              200,
              FX_LAYOUT_HEIGHT,
              undefined,
              WindowFlags.NoScrollbar,
            )
          ) {
            im.Text(ctx, "asdgaasjkdbjashdjkashdsk");
            im.Text(ctx, "123easd");

            im.Button(ctx, fx.getName());

            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");
            im.Text(ctx, "123easd");

            im.EndChild(ctx);
          }

          // make draggable
          if (im.BeginDragDropSource(ctx)) {
            log("im.BeginDragDropSource", r.time_precise());
            im.SetDragDropPayload(
              ctx,
              DragDropType.DeviceHeader,
              fx.fxidx.toString(),
            );
            im.EndDragDropSource(ctx);
          }

          // make drag target
          if (im.BeginDragDropTarget(ctx)) {
            const [ok, payload] = im.AcceptDragDropPayload(
              ctx,
              DragDropType.DeviceHeader,
              "",
            );
            if (ok) {
              log(`payload ${inspect(payload)} accepted by FX ${fx.fxidx}`);
            }
            im.EndDragDropTarget(ctx);
          }

          im.PopID(ctx);

          im.SameLine(ctx);
        }

        if (
          // delay destroying the button by 1 frame; this allows the "accept payload"
          // section to actually execute
          (wasDraggingLastFrame || im.IsMouseDragging(ctx, MouseButton.Left)) &&
          getDragDropPayload(ctx)?.type === DragDropType.DeviceHeader
        ) {
          im.SetCursorPos(ctx, 0, 0);
          im.Button(ctx, "Floating thing");

          // hide the drag drop border
          im.PushStyleColor(
            ctx,
            Color.DragDropTarget,
            im.ColorConvertDouble4ToU32(1.0, 0.0, 0.0, 1.0),
          );
          {
            // make drag target
            if (im.BeginDragDropTarget(ctx)) {
              const [ok, payload] = im.AcceptDragDropPayload(
                ctx,
                DragDropType.DeviceHeader,
                "",
              );
              if (ok) {
                log(`payload ${inspect(payload)} accepted by floating thing`);
              }
              im.EndDragDropTarget(ctx);
            }
          }
          im.PopStyleColor(ctx);
        }

        im.EndChild(ctx);
      }

      im.Text(ctx, inspect(temp));
      im.Text(ctx, inspect(getDragDropPayload(ctx)));

      im.PopStyleColor(ctx);

      // end base window
      im.End(ctx);

      // update persistent vars
      wasDraggingLastFrame = im.IsMouseDragging(ctx, MouseButton.Left);
    },
    () => {
      // on exit
      // setCommandState(false);
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
