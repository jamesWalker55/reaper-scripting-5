import { FXFolderItemType } from "reaper-api/installedFx";
import { assertUnreachable } from "reaper-api/utils";
import { createContext, Response } from "reaper-microui";
import { FxTarget } from "./fxAddTarget";
import { createManager, FxManager } from "./fxManager";
import { SETTINGS } from "./settings";
import { VirtualKeyboard } from "./virtualKeyboard";
import {
  addFxText,
  divider,
  fxBrowserH,
  fxBrowserV,
  toggleButton,
  wrappedToggleButtons,
} from "./widgets";

type Ctx = ReturnType<typeof createContext>;

// top title bar
export function renderTitleBar(
  ctx: Ctx,
  fxTarget: FxTarget,
  manager: FxManager,
  query: string,
  optionsEnabled: boolean,
): { manager: FxManager; optionsEnabled: boolean } {
  const refreshWidth =
    ctx.textWidth(ctx.style.font, "Refresh") +
    ctx.style.padding * 2 +
    ctx.style.spacing;
  const optionsWidth =
    ctx.textWidth(ctx.style.font, "Options") +
    ctx.style.padding * 2 +
    ctx.style.spacing;

  ctx.layoutRow([-refreshWidth - optionsWidth, -optionsWidth, -1], 0);

  addFxText(ctx, fxTarget.getDisplayName());

  if (ctx.button("Refresh")) {
    const oldActiveIds = manager.getActiveIdsMut();
    manager = createManager();
    manager.setActiveIds(oldActiveIds);
    manager.setQuery(query);
  }

  optionsEnabled = toggleButton(ctx, "Options", optionsEnabled)[0];

  return { manager, optionsEnabled };
}

export function renderOptionsPanel(ctx: Ctx, optionsEnabled: boolean) {
  if (!optionsEnabled) return;

  ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
  divider(ctx);

  // ctx.layoutRow([-1], 0);
  // verticalLayout = ctx.checkbox("Vertical layout", verticalLayout);

  ctx.layoutRow([200], 0);
  ctx.textbox(
    "fxfolders_favourite_folder",
    SETTINGS.get("fxfolders_favourite_folder"),
    undefined,
    (res, buf) => {},
  );

  ctx.layoutRow([200], 0);
  ctx.label(`Window size: ${gfx.w} x ${gfx.h}`);
  if (ctx.button("Set current size as default")) {
    SETTINGS.set("window_width", gfx.w);
    SETTINGS.set("window_height", gfx.h);
  }

  ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
  divider(ctx);
}

export type SearchBarState = {
  query: string;
  queryIsFocused: boolean;
  initialSendToVKB: boolean;
  firstLoop: boolean;
};

// search bar
export function renderSearchBar(
  ctx: Ctx,
  manager: FxManager,
  state: SearchBarState,
): { query: string; queryIsFocused: boolean; initialSendToVKB: boolean } {
  let { query, queryIsFocused, initialSendToVKB } = state;

  const id = ctx.getId("query");
  if (state.firstLoop) {
    ctx.setFocus(id);
  }

  ctx.layoutRow([-1], 0);
  ctx.textbox("query", query, undefined, (res, buf) => {
    query = buf;
    if (res === Response.Change) {
      manager.setQuery(query);
    }
  });

  // virtual keyboard shit
  const oldQueryIsFocused = queryIsFocused;
  queryIsFocused = ctx.focus === id;
  if (oldQueryIsFocused !== queryIsFocused) {
    if (queryIsFocused) {
      // inputbox has been focused
      // turn off vkb send if it is on
      initialSendToVKB = VirtualKeyboard.isSendToVKB();
      if (initialSendToVKB) {
        VirtualKeyboard.toggleSendToVKB();
      }
    } else {
      // inputbox has been unfocused
      // turn on vkb send if it was on initially
      if (initialSendToVKB && !VirtualKeyboard.isSendToVKB()) {
        VirtualKeyboard.toggleSendToVKB();
      }
    }
  }

  return { query, queryIsFocused, initialSendToVKB };
}

// filters
export function renderFilters(ctx: Ctx, manager: FxManager) {
  ctx.layoutRow([-1], 0);

  const categories = manager.getCategories();
  const activeIds = manager.getActiveIdsMut();
  for (const { category, folders } of categories) {
    let res: ReturnType<typeof wrappedToggleButtons>;
    if (categories.length === 1) {
      // just 1 category, hide the label
      res = wrappedToggleButtons(ctx, null, folders, activeIds);
    } else {
      // show the category label
      res = wrappedToggleButtons(ctx, category, folders, activeIds);
    }

    if (res) {
      switch (res.type) {
        case "enable":
          activeIds.add(res.id);
          break;
        case "disable":
          activeIds.delete(res.id);
          break;
        case "solo":
          const newActiveIds: LuaSet<string> = new LuaSet();
          newActiveIds.add(res.id);
          manager.setActiveIds(newActiveIds);
          break;
        default:
          assertUnreachable(res.type);
      }

      // if filter has changed, regenerate the fx list
      manager.regenerateFxList();
    }
  }
}

// fx browser
export function renderFxBrowser(
  ctx: Ctx,
  manager: FxManager,
  fxTarget: FxTarget,
  verticalLayout: boolean,
  stop: () => void,
) {
  ctx.layoutRow([-1], -1);

  const toFxItem = (uid: string) => {
    const favourite = manager.inFavourites(uid);
    const fxInfo = manager.getFxInfo(uid);
    return {
      uid,
      name: fxInfo.displayName,
      type: fxInfo.prefix || FXFolderItemType[fxInfo.type] || "?",
      favourite,
    };
  };

  const uid = verticalLayout
    ? fxBrowserV(ctx, manager.getFxlist().map(toFxItem))
    : fxBrowserH(ctx, manager.getFxlist().map(toFxItem));

  if (uid) {
    const fx = manager.getFxInfo(uid);
    switch (fx.type) {
      case FXFolderItemType.VST: {
        fxTarget.addFx({ vst: fx.ident });
        break;
      }
      case FXFolderItemType.CLAP: {
        fxTarget.addFx({ clap: fx.ident });
        break;
      }
      case FXFolderItemType.JS: {
        fxTarget.addFx({ js: fx.ident });
        break;
      }
      case FXFolderItemType.FXChain: {
        fxTarget.addFx({ fxchain: fx.ident });
        break;
      }
      default: {
        fxTarget.addFx(fx.ident);
        break;
      }
    }
    // exit after adding fx
    stop();
  }
}
