import { encode } from "json";
import { Section } from "reaper-api/extstate";
import {
  AddFxParams,
  generateTakeContainerFxidx,
  generateTrackContainerFxidx,
} from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { FXFolderItemType } from "reaper-api/installedFx";
import { Take, Track } from "reaper-api/track";
import {
  assertUnreachable,
  ensureAPI,
  errorHandler,
  log,
} from "reaper-api/utils";
import { createContext, microUILoop, Option, Response } from "reaper-microui";

const windowConfig = (() => {
  const section = Section("80gray-theme-adjuster");

  function getConfigNumber(name: string): number | null {
    const str = section.get(name);
    if (str === null) return null;

    const num = parseInt(str);
    if (isNaN(num)) return null;

    return num;
  }

  class WindowConfig {
    get windowX(): number | null {
      return getConfigNumber("windowX");
    }
    set windowX(val: number | number) {
      section.set("windowX", val !== null ? val.toString() : val);
    }
    get windowY(): number | null {
      return getConfigNumber("windowY");
    }
    set windowY(val: number | number) {
      section.set("windowY", val !== null ? val.toString() : val);
    }
    get windowW(): number | null {
      return getConfigNumber("windowW");
    }
    set windowW(val: number | number) {
      section.set("windowW", val !== null ? val.toString() : val);
    }
    get windowH(): number | null {
      return getConfigNumber("windowH");
    }
    set windowH(val: number | number) {
      section.set("windowH", val !== null ? val.toString() : val);
    }
    get windowDock(): number | null {
      return getConfigNumber("windowDock");
    }
    set windowDock(val: number | number) {
      section.set("windowDock", val !== null ? val.toString() : val);
    }
  }

  return new WindowConfig();
})();

function getWindowInfo() {
  const [dock, x, y, w, h] = gfx.dock(-1, 0, 0, 0, 0);
  return { dock, x, y, w, h };
}

function main() {
  // initialize gfx
  {
    const WINDOW_DEFAULT_WIDTH = 600;
    const WINDOW_DEFAULT_HEIGHT = 702;
    const WINDOW_DEFAULT_DOCK = 0;
    const WINDOW_DEFAULT_X = 100;
    const WINDOW_DEFAULT_Y = 50;

    gfx.init(
      "80gray Theme Adjuster",
      windowConfig.windowW || WINDOW_DEFAULT_WIDTH,
      windowConfig.windowH || WINDOW_DEFAULT_HEIGHT,
      windowConfig.windowDock || WINDOW_DEFAULT_DOCK,
      windowConfig.windowX || WINDOW_DEFAULT_X,
      windowConfig.windowY || WINDOW_DEFAULT_Y,
    );
    gfx.setfont(1, "Arial", 12);
  }

  // create microui context
  const ctx = createContext();
  ctx.style.font = 1;

  // GUI loop
  microUILoop(
    ctx,
    (stop) => {
      if (
        ctx.beginWindow(
          "Demo Window",
          { x: 0, y: 0, w: 0, h: 0 },
          Option.NoResize | Option.NoTitle | Option.NoClose,
        )
      ) {
        // resize window to gfx bounds
        {
          const win = ctx.getCurrentContainer();
          win.rect.w = gfx.w;
          win.rect.h = gfx.h;
        }

        // // top title bar
        // {
        //   const refreshWidth =
        //     ctx.textWidth(ctx.style.font, "Refresh") +
        //     ctx.style.padding * 2 +
        //     ctx.style.spacing;
        //   const optionsWidth =
        //     ctx.textWidth(ctx.style.font, "Options") +
        //     ctx.style.padding * 2 +
        //     ctx.style.spacing;

        //   ctx.layoutRow([-refreshWidth - optionsWidth, -optionsWidth, -1], 0);

        //   addFxText(ctx, fxTarget.getDisplayName());

        //   if (ctx.button("Refresh")) {
        //     const oldActiveIds = manager.getActiveIdsMut();
        //     manager = Manager();
        //     manager.setActiveIds(oldActiveIds);
        //     manager.setQuery(query);
        //   }

        //   optionsEnabled = toggleButton(ctx, "Options", optionsEnabled)[0];
        // }

        // if (optionsEnabled) {
        //   ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
        //   divider(ctx);

        //   ctx.layoutRow([-1], 0);
        //   verticalLayout = ctx.checkbox("Vertical layout", verticalLayout);

        //   ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
        //   divider(ctx);
        // }

        // // search bar
        // {
        //   const id = ctx.getId("query");
        //   if (firstLoop) {
        //     ctx.setFocus(id);
        //   }

        //   ctx.layoutRow([-1], 0);
        //   const [rv, newQuery] = ctx.textbox("query", query);
        //   query = newQuery;
        //   if (rv === Response.Change) {
        //     manager.setQuery(query);
        //   }

        //   // virtual keyboard shit
        //   const oldQueryIsFocused = queryIsFocused;
        //   queryIsFocused = ctx.focus === id;
        //   if (oldQueryIsFocused !== queryIsFocused) {
        //     if (queryIsFocused) {
        //       // inputbox has been focused
        //       // turn off vkb send if it is on
        //       initialSendToVKB = VirtualKeyboard.isSendToVKB();
        //       if (initialSendToVKB) {
        //         VirtualKeyboard.toggleSendToVKB();
        //       }
        //     } else {
        //       // inputbox has been unfocused
        //       // turn on vkb send if it was on initially
        //       if (initialSendToVKB && !VirtualKeyboard.isSendToVKB()) {
        //         VirtualKeyboard.toggleSendToVKB();
        //       }
        //     }
        //   }
        // }

        // // add some space
        // ctx.layoutRow([-1], 1);
        // ctx.layoutNext();

        // // filters
        // ctx.layoutRow([-1], 0);

        // {
        //   const categories = manager.getCategories();
        //   const activeIds = manager.getActiveIdsMut();
        //   for (const { category, folders } of categories) {
        //     let res: ReturnType<typeof wrappedToggleButtons>;
        //     if (categories.length === 1) {
        //       // just 1 category, hide the label
        //       res = wrappedToggleButtons(ctx, null, folders, activeIds);
        //     } else {
        //       // show the category label
        //       res = wrappedToggleButtons(ctx, category, folders, activeIds);
        //     }

        //     if (res) {
        //       switch (res.type) {
        //         case "enable":
        //           activeIds.add(res.id);
        //           break;
        //         case "disable":
        //           activeIds.delete(res.id);
        //           break;
        //         case "solo":
        //           const newActiveIds: LuaSet<string> = new LuaSet();
        //           newActiveIds.add(res.id);
        //           manager.setActiveIds(newActiveIds);
        //           break;
        //         default:
        //           assertUnreachable(res.type);
        //       }

        //       // if filter has changed, regenerate the fx list
        //       manager.regenerateFxList();
        //     }
        //   }
        // }

        // // fx browser
        // ctx.layoutRow([-1], -1);

        // const uid = verticalLayout
        //   ? fxBrowserV(
        //       ctx,
        //       manager.getFxlist().map((uid) => {
        //         const favourite = manager.inFavourites(uid);
        //         const fxInfo = manager.getFxInfo(uid);
        //         return {
        //           uid,
        //           name: fxInfo.name,
        //           type: fxInfo.prefix || FXFolderItemType[fxInfo.type] || "?",
        //           favourite,
        //         };
        //       }),
        //     )
        //   : fxBrowserH(
        //       ctx,
        //       manager.getFxlist().map((uid) => {
        //         const favourite = manager.inFavourites(uid);
        //         const fxInfo = manager.getFxInfo(uid);
        //         return {
        //           uid,
        //           name: fxInfo.name,
        //           type: fxInfo.prefix || FXFolderItemType[fxInfo.type] || "?",
        //           favourite,
        //         };
        //       }),
        //     );
        // if (uid) {
        //   const fx = manager.getFxInfo(uid);
        //   switch (fx.type) {
        //     case FXFolderItemType.VST: {
        //       fxTarget.addFx({ vst: fx.ident });
        //       break;
        //     }
        //     case FXFolderItemType.CLAP: {
        //       fxTarget.addFx({ clap: fx.ident });
        //       break;
        //     }
        //     case FXFolderItemType.JS: {
        //       fxTarget.addFx({ js: fx.ident });
        //       break;
        //     }
        //     case FXFolderItemType.FXChain: {
        //       fxTarget.addFx({ fxchain: fx.ident });
        //       break;
        //     }
        //     default: {
        //       fxTarget.addFx(fx.ident);
        //       break;
        //     }
        //   }
        //   // exit after adding fx
        //   stop();
        // }

        ctx.endWindow();
      }
    },
    () => {
      // on exit, save window position and dock state
      const wnd = getWindowInfo();

      windowConfig.windowDock = wnd.dock;
      windowConfig.windowX = wnd.x;
      windowConfig.windowY = wnd.y;
      windowConfig.windowW = wnd.w;
      windowConfig.windowH = wnd.h;
    },
  );
}

errorHandler(main);
