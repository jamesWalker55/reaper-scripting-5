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

const SCRIPT_VERSION = "v1.0";

const config = (() => {
  const section = Section("80gray-theme-adjuster");

  function getConfigNumber(name: string): number | null {
    const str = section.get(name);
    if (str === null) return null;

    const num = parseInt(str);
    if (isNaN(num)) return null;

    return num;
  }

  class ThemeAdjusterConfig {
    get windowX(): number | null {
      return getConfigNumber("windowX");
    }
    set windowX(val: number | null) {
      section.set("windowX", val !== null ? val.toString() : val);
    }
    get windowY(): number | null {
      return getConfigNumber("windowY");
    }
    set windowY(val: number | null) {
      section.set("windowY", val !== null ? val.toString() : val);
    }
    get windowW(): number | null {
      return getConfigNumber("windowW");
    }
    set windowW(val: number | null) {
      section.set("windowW", val !== null ? val.toString() : val);
    }
    get windowH(): number | null {
      return getConfigNumber("windowH");
    }
    set windowH(val: number | null) {
      section.set("windowH", val !== null ? val.toString() : val);
    }
    get windowDock(): number | null {
      return getConfigNumber("windowDock");
    }
    set windowDock(val: number | null) {
      section.set("windowDock", val !== null ? val.toString() : val);
    }
    get activeTab(): Tabs | null {
      const text = section.get("activeTab");
      if (text === null) return null;

      if (!Object.values(Tabs).includes(text as Tabs)) return null;

      return text as Tabs;
    }
    set activeTab(val: Tabs | null) {
      section.set("activeTab", val);
    }
  }

  return new ThemeAdjusterConfig();
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
        // // draw fill
        // const color: Color | null =
        //   ctx.focus === id
        //     ? rgba(115, 115, 115, 1.0)
        //     : ctx.hover === id
        //     ? rgba(75, 75, 75, 1.0)
        //     : null;

        // if (color !== null) ctx.drawRect(r, color);

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
        const oldTextColor = ctx.style.colors[ColorId.Text];
        ctx.style.colors[ColorId.Text] = rgba(140, 140, 140, 1.0);
        ctx.drawControlText(tab, r, ColorId.Text, 0);
        ctx.style.colors[ColorId.Text] = oldTextColor;
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
  TCP_METER_TEXT_ONLY_IF_TALL = "p_tcp_meter_text_only_if_tall",
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

enum Tabs {
  General = "General",
  TCP = "Track Panel",
  MCP = "Mixer Panel",
  Transport = "Transport",
}

function main() {
  // font size
  const REM = 14;

  // initialize gfx
  {
    const WINDOW_DEFAULT_WIDTH = 400;
    const WINDOW_DEFAULT_HEIGHT = 800;
    const WINDOW_DEFAULT_DOCK = 0;
    const WINDOW_DEFAULT_X = 100;
    const WINDOW_DEFAULT_Y = 50;

    gfx.init(
      "80gray Theme Adjuster",
      config.windowW || WINDOW_DEFAULT_WIDTH,
      config.windowH || WINDOW_DEFAULT_HEIGHT,
      config.windowDock || WINDOW_DEFAULT_DOCK,
      config.windowX || WINDOW_DEFAULT_X,
      config.windowY || WINDOW_DEFAULT_Y,
    );
    gfx.setfont(1, "Arial", REM);
  }

  // create microui context
  const ctx = createContext();
  ctx.style.font = 1;

  // persistent variables
  let activeTab: Tabs = config.activeTab || Tabs.TCP;
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
    hint("Shift-click sliders to type in numbers manually");

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
          [Tabs.General, Tabs.TCP, Tabs.MCP, Tabs.Transport],
          activeTab,
        );

        // tabs content
        ctx.layoutRow([-1], -25);
        ctx.beginPanel(`tab-contents-${activeTab}`);
        const oldPanelBG = ctx.style.colors[ColorId.PanelBG];
        ctx.style.colors[ColorId.PanelBG] = rgba(45, 45, 45, 1.0);

        switch (activeTab) {
          case Tabs.General: {
            ctx.layoutRow([-1], 0);
            ctx.label("General settings");

            ctx.layoutRow([-1], 0);
            ctx.label("Scale fonts:");
            ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
            paramSlider(P.SCALE_FONT, { format: "%d%%" });
            paramReset(P.SCALE_FONT);

            break;
          }
          case Tabs.TCP: {
            ctx.layoutRow([-1], 0);
            ctx.label("Track panel settings");

            ctx.layoutRow([-1], 0);
            ctx.label("General settings:");
            ctx.layoutRow([-1], 56);
            ctx.beginPanel("general");
            {
              ctx.layoutRow([-1], 0);
              paramCheckbox(
                P.TCP_SINGLE_ROW_PAN_IO,
                "Show pan and routing controls in single row mode",
              );
              hint(
                '"single row": When track is too short to show 2nd row of buttons',
              );
              paramCheckbox(
                P.TCP_PERMANENT_REC_SECTION,
                "Always show extra recording buttons (monitor, input FX)",
              );
              hint("Show 'input monitor' and 'input FX' even when not armed");
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("FX list:");
            ctx.layoutRow([-1], 56);
            ctx.beginPanel("fxlist");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);
              ctx.label("Width");
              paramSlider(P.TCP_FXLIST_WIDTH, { format: "%d px" });
              paramReset(P.TCP_FXLIST_WIDTH);
              ctx.label("Columns");
              paramSlider(P.TCP_FXLIST_COLUMNS, { format: "%d columns" });
              paramReset(P.TCP_FXLIST_COLUMNS);
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Meter:");
            ctx.layoutRow([-1], 129);
            ctx.beginPanel("meter");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);
              ctx.label("Width");
              paramSlider(P.TCP_METER_WIDTH, { format: "%d px" });
              paramReset(P.TCP_METER_WIDTH);

              ctx.layoutRow([-1], 0);
              ctx.label("Show dB scales...");
              paramCheckbox(P.TCP_METER_TEXT_IN_BG, "In background");
              paramCheckbox(P.TCP_METER_TEXT_IN_FG, "On top of meters");
              paramCheckbox(
                P.TCP_METER_TEXT_ONLY_IF_TALL,
                "...Only if the panel is tall enough",
              );
              hint('"tall enough": When the panel shows more than 2 rows');
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Selection indicator:");
            ctx.layoutRow([-1], 57);
            ctx.beginPanel("selection-indicator");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);
              ctx.label("Width:");
              paramSlider(P.TCP_INDICATOR_WIDTH, { format: "%d px" });
              paramReset(P.TCP_INDICATOR_WIDTH);

              ctx.layoutRow([-1], 0);
              paramCheckbox(
                P.TCP_INDICATOR_SHOW_RECARM,
                "Show record-armed status",
              );
              hint("Tracks armed for recording will use different colors");
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Tweaks:");
            ctx.layoutRow([-1], 202);
            ctx.beginPanel("tweaks");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);
              ctx.label("Tint");
              paramSlider(P.TCP_TINT, { format: "%d %%" });
              hint(
                "Make the background color more similar to the track's custom color",
              );
              paramReset(P.TCP_TINT);

              ctx.layoutRow([-1], 0);
              paramCheckbox(P.TCP_HIGH_CONTRAST, "Higher contrast text");
              paramCheckbox(P.TCP_NO_FADE, "Disable text fade-out effect");
              paramCheckbox(
                P.TCP_HORIZONTAL_TEXT_HACK,
                "[Hack] Force text to be horizontal",
              );
              hint("Doesn't work on some systems (just makes text disappear)");

              ctx.layoutRow([-1], 0);
              ctx.label("Limit width of record-input text:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.TCP_MAX_RECINPUT_WIDTH, { format: "%d px" });
              paramReset(P.TCP_MAX_RECINPUT_WIDTH);

              ctx.layoutRow([-1], 0);
              ctx.label("FX parameters column width:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.TCP_FXPARM_COL_WIDTH, { format: "%d px" });
              paramReset(P.TCP_FXPARM_COL_WIDTH);
            }
            ctx.endPanel();

            break;
          }
          case Tabs.MCP: {
            ctx.layoutRow([-1], 0);
            ctx.label("Mixer panel settings");

            ctx.layoutRow([-1], 0);
            ctx.label("General settings:");
            ctx.layoutRow([-1], 152);
            ctx.beginPanel("general");
            {
              ctx.layoutRow([-1], 0);
              ctx.label("Panel width:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.MCP_WIDTH, { format: "%d px" });
              paramReset(P.MCP_WIDTH);

              ctx.layoutRow([-1], 0);
              ctx.label("Master panel width:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.MASTER_MCP_WIDTH, { format: "%d px" });
              paramReset(P.MASTER_MCP_WIDTH);

              ctx.layoutRow([-1], 0);
              ctx.label("Folder indent:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.MCP_FOLDER_INDENT, { format: "%d px" });
              paramReset(P.MCP_FOLDER_INDENT);
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Meter:");
            ctx.layoutRow([-1], 82);
            ctx.beginPanel("meter");
            {
              ctx.layoutRow([-1], 0);
              ctx.label("Show dB scales...");
              paramCheckbox(P.MCP_METER_TEXT_IN_BG, "In background");
              paramCheckbox(P.MCP_METER_TEXT_IN_FG, "On top of meters");
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Routing diagram:");
            ctx.layoutRow([-1], 110);
            ctx.beginPanel("routing-diagram");
            {
              ctx.layoutRow([-1], 0);
              ctx.label("Height:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.MCP_DIAGRAM_HEIGHT, { format: "%d px" });
              paramReset(P.MCP_DIAGRAM_HEIGHT);

              ctx.layoutRow([-1], 0);
              ctx.label("Max rows displayed in diagram:");
              ctx.layoutRow([-PARAM_RESET_WIDTH, -1], 0);
              paramSlider(P.MCP_DIAGRAM_MAX_ROWS, { format: "%d rows" });
              paramReset(P.MCP_DIAGRAM_MAX_ROWS);
            }
            ctx.endPanel();

            break;
          }
          case Tabs.Transport: {
            ctx.layoutRow([-1], 0);
            ctx.label("Transport settings");

            ctx.layoutRow([-1], 0);
            ctx.label("General settings:");
            ctx.layoutRow([-1], 56);
            ctx.beginPanel("general");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);
              ctx.label("Height");
              paramSlider(P.TRANS_HEIGHT, { format: "%d px" });
              paramReset(P.TRANS_HEIGHT);

              ctx.layoutRow([-1], 0);
              paramCheckbox(P.TRANS_SHOW_PAUSE_BUTTON, "Show pause button");
            }
            ctx.endPanel();

            ctx.layoutRow([-1], 0);
            ctx.label("Selection diagram:");
            ctx.layoutRow([-1], 160);
            ctx.beginPanel("general");
            {
              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);

              ctx.label("Width");
              paramSlider(P.TRANS_SEL_W, { format: "%d px" });
              paramReset(P.TRANS_SEL_W);

              ctx.label("Height");
              paramSlider(P.TRANS_SEL_H, { format: "%d px" });
              paramReset(P.TRANS_SEL_H);

              ctx.label("Text height");
              paramSlider(P.TRANS_SEL_TEXT_H, { format: "%d px" });
              paramReset(P.TRANS_SEL_TEXT_H);

              // some space
              ctx.layoutRow([-1], 4);
              ctx.layoutNext();

              ctx.layoutRow([-1], 0);
              ctx.text(
                "If the diagram shows some clipping text on the left side, please adjust the following clip length to fix it:",
              );

              // some space
              ctx.layoutRow([-1], 4);
              ctx.layoutNext();

              ctx.layoutRow([60, -PARAM_RESET_WIDTH, -1], 0);

              ctx.label("Clip left");
              paramSlider(P.TRANS_SEL_LABEL_W, { format: "%d px" });
              paramReset(P.TRANS_SEL_LABEL_W);
            }
            ctx.endPanel();

            break;
          }
          default:
            assertUnreachable(activeTab);
        }

        ctx.style.colors[ColorId.PanelBG] = oldPanelBG;

        ctx.endPanel();

        // footer section
        {
          const versionText = `${SCRIPT_VERSION} - kotll / jisai`;
          const versionWidth = ctx.textWidth(ctx.style.font, versionText);
          ctx.layoutRow([-versionWidth - ctx.style.spacing * 2, -1], 0);

          ctx.label(hintText);
          ctx.label("v1.0 - kotll / jisai");
        }

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

      config.windowDock = wnd.dock;
      config.windowX = wnd.x;
      config.windowY = wnd.y;
      config.windowW = wnd.w;
      config.windowH = wnd.h;
      config.activeTab = activeTab;
    },
  );
}

errorHandler(main);
