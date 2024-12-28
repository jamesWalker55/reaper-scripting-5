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
import {
  createContext,
  microUILoop,
  Option,
  Response,
  ReaperContext as Context,
  MouseButton,
  ColorId,
  rgba,
  Rect,
  Color,
  expandRect,
  rect,
} from "reaper-microui";

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

function drawActiveTabFrame(ctx: Context, r: Rect, color: Color) {
  ctx.drawRect({ x: r.x + 1, y: r.y, w: r.w - 2, h: 1 }, color);
  // ctx.drawRect({ x: r.x + 1, y: r.y + r.h - 1, w: r.w - 2, h: 1 }, color);
  ctx.drawRect({ x: r.x, y: r.y, w: 1, h: r.h }, color);
  ctx.drawRect({ x: r.x + r.w - 1, y: r.y, w: 1, h: r.h }, color);
}

function drawInactiveTabFrame(ctx: Context, r: Rect, color: Color) {
  // ctx.drawRect({ x: r.x + 1, y: r.y, w: r.w - 2, h: 1 }, color);
  ctx.drawRect({ x: r.x, y: r.y + r.h - 1, w: r.w, h: 1 }, color);
  // ctx.drawRect({ x: r.x, y: r.y, w: 1, h: r.h }, color);
  // ctx.drawRect({ x: r.x + r.w - 1, y: r.y, w: 1, h: r.h }, color);
}

function tabsWidget<T extends string>(
  ctx: Context,
  identifier: string,
  tabs: T[],
  activeTab: T,
): T {
  ctx.pushId(identifier);
  {
    const allTabsRect = ctx.layoutNext();
    const availableSpace = allTabsRect.w + ctx.style.spacing;
    const tabWidth = availableSpace / tabs.length;

    tabs.forEach((tab, i) => {
      const id = ctx.getId(tab);
      const r = rect(tabWidth * i, allTabsRect.y, tabWidth, allTabsRect.h);
      ctx.updateControl(id, r, 0);

      // handle left click
      if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
        activeTab = tab;
      }

      // draw
      if (tab === activeTab) {
        // draw fill
        const color: Color | null =
          ctx.focus === id
            ? rgba(115, 115, 115, 1.0)
            : ctx.hover === id
            ? rgba(75, 75, 75, 1.0)
            : null;

        if (color !== null) ctx.drawRect(r, color);

        // draw border
        if (ctx.style.colors[ColorId.Border].a > 0) {
          drawActiveTabFrame(ctx, r, ctx.style.colors[ColorId.Border]);
        }

        // draw text
        ctx.drawControlText(tab, r, ColorId.Text, 0);
      } else {
        // draw fill
        const color: Color | null =
          ctx.focus === id
            ? rgba(80, 80, 80, 1.0)
            : ctx.hover === id
            ? rgba(60, 60, 60, 1.0)
            : rgba(30, 30, 30, 1.0);

        if (color !== null) {
          ctx.drawRect(r, color);
        }

        // draw border
        if (ctx.style.colors[ColorId.Border].a > 0) {
          drawInactiveTabFrame(ctx, r, ctx.style.colors[ColorId.Border]);
        }

        // draw text
        ctx.drawControlText(tab, r, ColorId.Text, 0);
      }
    });
  }
  ctx.popId();

  return activeTab;
}

const themeHasChanged = (() => {
  let prevTheme = "";

  return () => {
    const newTheme = reaper.GetLastColorThemeFile();
    if (newTheme !== prevTheme) {
      prevTheme = newTheme;
      return true;
    } else {
      return false;
    }
  };
})();

type Parameter = {
  id: number;
  description: string;
  currentValue: number;
  defaultValue: number;
  minValue: number;
  maxValue: number;
};

function getThemeParameters() {
  const result: Record<string, Parameter | undefined> = {};

  let i = 0;
  while (true) {
    const [name, description, currentValue, defaultValue, minValue, maxValue] =
      reaper.ThemeLayout_GetParameter(i);

    if (name === null) return result;

    result[name] = {
      id: i,
      description,
      currentValue,
      defaultValue,
      minValue,
      maxValue,
    };

    i += 1;
  }
}

/** Known params for the 80gray theme */
enum P {
  SCALE_UI = "p_scale_ui",
  SCALE_FONT = "p_scale_font",
  TCP_TINT = "p_tcp_tint",
  TCP_METER_WIDTH = "p_tcp_meter_width",
  TCP_METER_TEXT_IN_BG = "p_tcp_meter_text_in_bg",
  TCP_METER_TEXT_IN_FG = "p_tcp_meter_text_in_fg",
  TCP_FOLDER_INDENT = "p_tcp_folder_indent",
  TCP_INDICATOR_WIDTH = "p_tcp_indicator_width",
  TCP_INDICATOR_SHOW_RECARM = "p_tcp_indicator_show_recarm",
  TCP_FXLIST_WIDTH = "p_tcp_fxlist_width",
  TCP_FXLIST_COLUMNS = "p_tcp_fxlist_columns",
  TCP_HORIZONTAL_TEXT_HACK = "p_tcp_horizontal_text_hack",
  TCP_NO_FADE = "p_tcp_no_fade",
  TCP_MAX_RECINPUT_WIDTH = "p_tcp_max_recinput_width",
  TCP_HIGH_CONTRAST = "p_tcp_high_contrast",
  TCP_SINGLE_ROW_PAN_IO = "p_tcp_single_row_pan_io",
  TCP_PERMANENT_REC_SECTION = "p_tcp_permanent_rec_section",
  TCP_FXPARM_COL_WIDTH = "p_tcp_fxparm_col_width",
  MCP_WIDTH = "p_mcp_width",
  MCP_DIAGRAM_HEIGHT = "p_mcp_diagram_height",
  MCP_DIAGRAM_MAX_ROWS = "p_mcp_diagram_max_rows",
  MCP_METER_TEXT_IN_BG = "p_mcp_meter_text_in_bg",
  MCP_METER_TEXT_IN_FG = "p_mcp_meter_text_in_fg",
  MCP_FOLDER_INDENT = "p_mcp_folder_indent",
  MASTER_MCP_WIDTH = "p_master_mcp_width",
  TRANS_HEIGHT = "p_trans_height",
  TRANS_SHOW_PAUSE_BUTTON = "p_trans_show_pause_button",
  TRANS_SEL_W = "p_trans_sel_w",
  TRANS_SEL_H = "p_trans_sel_h",
  TRANS_SEL_LABEL_W = "p_trans_sel_label_w",
  TRANS_SEL_TEXT_H = "p_trans_sel_text_h",
}

function main() {
  // font size
  const REM = 14;

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
    gfx.setfont(1, "Arial", REM);
  }

  // create microui context
  const ctx = createContext();
  ctx.style.font = 1;

  // persistent variables
  enum Tabs {
    TCP = "Track Panel",
    MCP = "Mixer Panel",
    Transport = "Transport",
  }
  let activeTab = Tabs.TCP;
  themeHasChanged();
  let themeParams = getThemeParameters();
  let needLayoutRefresh = false;
  let hintText = "";

  // helper functions
  function hint(text: string) {
    const shouldShowHint = ctx.focus === ctx.lastId || ctx.hover === ctx.lastId;
    if (shouldShowHint) {
      hintText = text;
    }
  }

  // param widgets
  function setParam(key: P, value: number | boolean) {
    if (!(key in themeParams)) {
      throw new Error(`Set theme parameter does not exist: ${encode(key)}`);
    }

    const param = themeParams[key]!;

    const needChange =
      typeof value === "boolean"
        ? value !== (param.currentValue !== 0)
        : Math.round(value) !== Math.round(param.currentValue);

    if (needChange) {
      const numValue: number =
        typeof value === "boolean" ? (value ? 1 : 0) : value;

      reaper.ThemeLayout_SetParameter(param.id, numValue, true);
      param.currentValue = numValue;
      needLayoutRefresh = true;
    }
  }
  function paramCheckbox(key: P, label: string) {
    const param = themeParams[key];
    const currentValue = Math.round(param?.currentValue || 0);

    const newValue = ctx.checkbox(label, currentValue === 1);

    if (param) setParam(key, newValue);
  }
  function paramSlider(
    key: P,
    opt?: { min?: number; max?: number; format?: string },
  ) {
    const param = themeParams[key];
    const currentValue = Math.round(param?.currentValue || 0);
    const minValue = Math.round(opt?.min || param?.minValue || 0);
    const maxValue = Math.round(opt?.max || param?.maxValue || 1);
    const format = opt?.format || "%d";

    const newValue = Math.round(
      ctx.slider(key, currentValue, minValue, maxValue, 1, format),
    );
    hint("Shift-click sliders to type numbers manually");

    if (param) setParam(key, newValue);
  }
  const PARAM_RESET_WIDTH = 24;
  function paramReset(key: P) {
    const param = themeParams[key];
    ctx.pushId(`param-reset-${key}`);
    const clicked = ctx.button("R");
    ctx.popId();
    if (clicked && param) {
      setParam(key, param.defaultValue);
    }
  }

  // GUI loop
  microUILoop(
    ctx,
    (stop) => {
      // reset variables if needed
      hintText = "";
      if (themeHasChanged()) {
        themeParams = getThemeParameters();
      }

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

        // tabs display
        ctx.layoutRow([-1], 0);
        activeTab = tabsWidget(
          ctx,
          "tabs",
          [Tabs.TCP, Tabs.MCP, Tabs.Transport],
          activeTab,
        );

        // tabs content
        ctx.layoutRow([-1], -25);
        ctx.beginPanel(`tab-contents-${activeTab}`);

        switch (activeTab) {
          case Tabs.TCP: {
            ctx.label(activeTab);

            ctx.layoutRow([-1], 0);
            ctx.label("Tint");
            ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
            paramSlider(P.TCP_TINT);
            paramReset(P.TCP_TINT);

            // TCP_FOLDER_INDENT = "p_tcp_folder_indent",

            // TCP_INDICATOR_SHOW_RECARM = "p_tcp_indicator_show_recarm",
            // TCP_FXLIST_WIDTH = "p_tcp_fxlist_width",
            // TCP_FXLIST_COLUMNS = "p_tcp_fxlist_columns",
            // TCP_HORIZONTAL_TEXT_HACK = "p_tcp_horizontal_text_hack",
            // TCP_NO_FADE = "p_tcp_no_fade",
            // TCP_MAX_RECINPUT_WIDTH = "p_tcp_max_recinput_width",
            // TCP_HIGH_CONTRAST = "p_tcp_high_contrast",
            // TCP_SINGLE_ROW_PAN_IO = "p_tcp_single_row_pan_io",
            // TCP_PERMANENT_REC_SECTION = "p_tcp_permanent_rec_section",
            // TCP_FXPARM_COL_WIDTH = "p_tcp_fxparm_col_width",

            ctx.layoutRow([-1], 0);
            ctx.label("Meter width");
            ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
            paramSlider(P.TCP_METER_WIDTH, { format: "%d px" });
            paramReset(P.TCP_METER_WIDTH);

            ctx.layoutRow([-1], 0);
            ctx.label("Show dB scales...");
            paramCheckbox(P.TCP_METER_TEXT_IN_BG, "In background");
            paramCheckbox(P.TCP_METER_TEXT_IN_FG, "On top of meters");

            ctx.label("Selection indicator");
            {
              const param = themeParams[P.TCP_INDICATOR_WIDTH];
              const currentWidth = param?.currentValue || 0;
              const wasEnabled = currentWidth > 0;

              if (wasEnabled) {
                ctx.layoutRow([100, 40, -1], 0);
              } else {
                ctx.layoutRow([-1], 0);
              }

              const shouldEnable = ctx.checkbox("Enabled", wasEnabled);

              if (shouldEnable && !wasEnabled) {
                setParam(P.TCP_INDICATOR_WIDTH, 3);
              } else if (!shouldEnable && wasEnabled) {
                setParam(P.TCP_INDICATOR_WIDTH, 0);
              }

              if (shouldEnable && wasEnabled) {
                ctx.label("Width:");

                paramSlider(P.TCP_INDICATOR_WIDTH, { min: 1, format: "%d px" });

                ctx.layoutRow([-1], 0);
                paramCheckbox(
                  P.TCP_INDICATOR_SHOW_RECARM,
                  "Show recording-armed status",
                );
              } else {
                ctx.layoutRow([-1], 0);
              }
            }

            ctx.text("hello world");
            break;
          }
          case Tabs.MCP: {
            ctx.label(activeTab);
            break;
          }
          case Tabs.Transport: {
            ctx.label(activeTab);
            break;
          }
          default:
            assertUnreachable(activeTab);
        }

        ctx.endPanel();

        {
          const versionText = "v1.0 - kotll / jisai";
          const versionWidth = ctx.textWidth(ctx.style.font, versionText);
          ctx.layoutRow([-versionWidth - ctx.style.spacing * 2, -1], 0);

          ctx.label(hintText);
          ctx.label("v1.0 - kotll / jisai");
        }

        // ctx.text(encode(themeParams[Param.TCP_HIGH_CONTRAST]));

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

        if (needLayoutRefresh) {
          reaper.ThemeLayout_RefreshAll();
          needLayoutRefresh = false;
        }

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
