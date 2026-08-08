import { errorHandler } from "reaper-api/utils";
import { createContext, Option } from "reaper-microui";
import { getScreenViewport } from "./utils";
import { SETTINGS } from "./settings";
import { microUILoop } from "./widgets";
import { resolveFxAddTarget } from "./fxAddTarget";
import { createManager } from "./fxManager";
import { VirtualKeyboard } from "./virtualKeyboard";
import {
  renderFilters,
  renderFxBrowser,
  renderOptionsPanel,
  renderSearchBar,
  renderTitleBar,
} from "./ui";

function main() {
  const fxTarget = resolveFxAddTarget();

  let manager = createManager();
  let query = "";
  let firstLoop = true;
  let optionsEnabled = false;
  let verticalLayout = false;
  let queryIsFocused = false;
  let initialSendToVKB = VirtualKeyboard.isSendToVKB();

  {
    const windowWidth = SETTINGS.get("window_width");
    const windowHeight = SETTINGS.get("window_height");
    const viewport = getScreenViewport();
    const windowPos = {
      x: (viewport.left + viewport.right) / 2 - windowWidth / 2,
      y: (viewport.top + viewport.bottom) / 2 - windowHeight / 2,
    };
    gfx.init(
      "FX Browser",
      windowWidth,
      windowHeight,
      undefined,
      windowPos.x,
      windowPos.y,
    );
  }

  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

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

        // {
        //   ctx.layoutRow([50, -1], 0);
        //   ctx.label("indent");
        //   ctx.style.indent = ctx.slider("ctx.style.indent", ctx.style.indent, 0, 50);
        //   ctx.label("padding");
        //   ctx.style.padding = ctx.slider("ctx.style.padding", ctx.style.padding, 0, 50);
        //   ctx.label("scrollbarSize");
        //   ctx.style.scrollbarSize = ctx.slider("ctx.style.scrollbarSize", ctx.style.scrollbarSize, 0, 50);
        //   ctx.label("thumbSize");
        //   ctx.style.thumbSize = ctx.slider("ctx.style.thumbSize", ctx.style.thumbSize, 0, 50);
        //   ctx.label("spacing");
        //   ctx.style.spacing = ctx.slider("ctx.style.spacing", ctx.style.spacing, 0, 50);
        //   ctx.label("size.x");
        //   ctx.style.size.x = ctx.slider("ctx.style.size.x", ctx.style.size.x, 0, 50);
        //   ctx.label("size.y");
        //   ctx.style.size.y = ctx.slider("ctx.style.size.y", ctx.style.size.y, 0, 50);
        // }

        ({ manager, optionsEnabled } = renderTitleBar(
          ctx,
          fxTarget,
          manager,
          query,
          optionsEnabled,
        ));

        renderOptionsPanel(ctx, optionsEnabled);

        ({ query, queryIsFocused, initialSendToVKB } = renderSearchBar(
          ctx,
          manager,
          { query, queryIsFocused, initialSendToVKB, firstLoop },
        ));

        // add some space
        ctx.layoutRow([-1], 1);
        ctx.layoutNext();

        renderFilters(ctx, manager);

        renderFxBrowser(ctx, manager, fxTarget, verticalLayout, stop);

        ctx.endWindow();
      }

      if (firstLoop) firstLoop = false;
    },
    () => {
      // on exit, ensure vkb send is reverted
      if (initialSendToVKB && !VirtualKeyboard.isSendToVKB()) {
        VirtualKeyboard.toggleSendToVKB();
      }
    },
  );
}

errorHandler(main);
