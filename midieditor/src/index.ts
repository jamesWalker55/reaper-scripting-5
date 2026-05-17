import { OSType } from "reaper-api/ffi";
import { encode } from "reaper-api/json";
import { errorHandler, log } from "reaper-api/utils";
import { createContext, microUILoop, Option, ReaperContext } from "microui";
import { baseWindow } from "./widgets";
import { Item } from "reaper-api/track";
import * as MB from "reaper-api/midibuf";

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

      const items = Item.getSelected()
        .map((item) => {
          const take = item.activeTake()?.asTypedTake() || null;
          if (take === null) return null;

          return { item, take };
        })
        .filter((x) => x !== null);

      for (const { item, take } of items) {
        switch (take.TYPE) {
          case "AUDIO": {
            ctx.label(
              `Audio: ${take.getSource().findRootParent().getFilename()}`,
            );
            break;
          }
          case "MIDI": {
            const evts = MB.parseBuf(take.midibuf);
            ctx.label(`Midi: ${evts.length} events`);
            break;
          }
          default:
            take satisfies never;
        }
      }
    });
  });
}

errorHandler(main);
