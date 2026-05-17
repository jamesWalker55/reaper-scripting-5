import { OSType } from "reaper-api/ffi";
import { encode } from "reaper-api/json";
import { errorHandler, log } from "reaper-api/utils";
import { createContext, microUILoop, Option, ReaperContext } from "microui";
import { baseWindow } from "./widgets";
import { Item } from "reaper-api/track";
import * as MB from "reaper-api/midibuf";
import * as json from "reaper-api/json";
import { getDefault, getTimeMarkers } from "./timesections";
import { timeToBeats } from "./timemap";
import { inspect } from "reaper-api/inspect";

function setWindowTitle(title: string) {
  gfx.init(title);
}

function main() {
  gfx.init("MIDI Editor", 600, 450);

  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

  microUILoop(ctx, () => {
    baseWindow(ctx, () => {
      ctx.layoutRow([-1], 0);

      ctx.label(`timeToBeats(0, reaper.GetCursorPositionEx(0))`);
      ctx.text(inspect(timeToBeats(0, reaper.GetCursorPositionEx(0))));

      const info = getDefault(0);
      ctx.label(json.encode(info));
      const markers = getTimeMarkers(0);
      for (const x of markers) {
        ctx.label(json.encode(x));
      }

      // const items = Item.getSelected()
      //   .map((item) => {
      //     const take = item.activeTake()?.asTypedTake() || null;
      //     if (take === null) return null;

      //     return { item, take };
      //   })
      //   .filter((x) => x !== null);

      // for (const { item, take } of items) {
      //   switch (take.TYPE) {
      //     case "AUDIO": {
      //       ctx.label(
      //         `Audio: ${take.getSource().findRootParent().getFilename()}`,
      //       );
      //       break;
      //     }
      //     case "MIDI": {
      //       const evts = MB.parseBuf(take.midibuf);
      //       ctx.label(`Midi: ${evts.length} events`);
      //       break;
      //     }
      //     default:
      //       take satisfies never;
      //   }
      // }
    });
  });
}

errorHandler(main);
