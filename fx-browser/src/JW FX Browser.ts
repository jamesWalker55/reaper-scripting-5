AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import {
  assertUnreachable,
  deferLoop,
  errorHandler,
  log,
} from "reaper-api/utils";
import {
  ColorId,
  CommandType,
  ReaperContext as Context,
  createContext,
  IconId,
  Key,
  MouseButton,
  Option,
  ReaperContext,
  Rect,
  Response,
  rgba,
} from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import { FxInfo, getCategories } from "./categories";
import { fxBrowserH, fxBrowserV, fxBrowserVRow, toggleButton } from "./widgets";
import { split } from "reaper-api/utilsLua";
import { MouseCap, Mode, DrawStrFlags } from "reaper-api/ffi";

function setIntersection<T extends AnyNotNil>(
  mutable: LuaSet<T>,
  other: LuaSet<T>,
) {
  for (const x of mutable) {
    if (!other.has(x)) {
      mutable.delete(x);
    }
  }
}

function setClone<T extends AnyNotNil>(value: LuaSet<T>): LuaSet<T> {
  const result: LuaSet<T> = new LuaSet();
  for (const x of value) {
    result.add(x);
  }
  return result;
}

function Manager(
  fxOrder: Record<FXFolderItemType, number> = {
    [FXFolderItemType.VST]: 1,
    [FXFolderItemType.CLAP]: 2,
    [FXFolderItemType.JS]: 3,
    [FXFolderItemType.FXChain]: 4,
    [FXFolderItemType.Smart]: -99999,
  },
) {
  let data = getCategories();
  let activeIds: LuaSet<string> = new LuaSet();
  // query keywords must be lowercase
  let query: string[] = [];

  function generateFxList(fxOrder: Record<FXFolderItemType, number>) {
    // collect all FX to be displayed
    let resultSet: LuaSet<string> = new LuaSet();
    if (activeIds.isEmpty()) {
      // no filters active, return all FX in all folders
      for (const [folderId, fxs] of Object.entries(data.folderFx)) {
        for (const fx of fxs) {
          resultSet.add(fx);
        }
      }
    } else {
      // filters active, take the union of all folders
      let working: LuaSet<string> | null = null;
      for (const folderId of activeIds) {
        if (!(folderId in data.folderFx)) {
          continue;
        }
        const folderFxs = data.folderFx[folderId];

        if (working === null) {
          // first loop, use folder contents as-is
          working = setClone(folderFxs);
        } else {
          // other loop, take union / intersection
          setIntersection(working, folderFxs);
        }
      }
      resultSet = working || new LuaSet();
    }

    // collect uids into list
    let result: string[] = [];
    for (const uid of resultSet) {
      result.push(uid);
    }

    // filter the fx by the query
    if (query.length > 0) {
      result = result.filter((uid) => {
        const fx = data.fxMap[uid];
        const fxName = fx.name.toLowerCase();
        for (const keyword of query) {
          if (fxName.includes(keyword)) {
            return true;
          }
        }
        return false;
      });
    }

    // sort fx
    result.sort((a, b) => {
      const aFav = data.favouriteFx.has(a);
      const bFav = data.favouriteFx.has(b);
      // favourites always come first
      if (aFav && !bFav) {
        return -1;
      } else if (!aFav && bFav) {
        return 1;
      }

      const aInfo = data.fxMap[a];
      const bInfo = data.fxMap[b];

      // sort by plugin type
      const aOrder =
        aInfo.type in fxOrder ? fxOrder[aInfo.type as FXFolderItemType] : 0;
      const bOrder =
        bInfo.type in fxOrder ? fxOrder[bInfo.type as FXFolderItemType] : 0;
      if (aOrder !== bOrder) return aOrder - bOrder;

      // sort by display name
      if (aInfo.name < bInfo.name) {
        return -1;
      } else if (aInfo.name > bInfo.name) {
        return 1;
      }

      // sort by identifier name
      if (aInfo.ident < bInfo.ident) {
        return -1;
      } else if (aInfo.ident > bInfo.ident) {
        return 1;
      }

      return 0;
    });

    return result;
  }

  let fxlist = generateFxList(fxOrder);

  return {
    getFxlist() {
      return fxlist;
    },
    inFavourites(uid: string) {
      return data.favouriteFx.has(uid);
    },
    getFxInfo(uid: string) {
      return data.fxMap[uid];
    },
    setOrder(newOrder: typeof fxOrder) {
      fxOrder = newOrder;
      fxlist = generateFxList(fxOrder);
    },
    setQuery(text: string) {
      // split by whitespace
      query = [];
      for (const [rv] of string.gmatch(text, "%S+")) {
        query.push(rv.toLowerCase());
      }
      fxlist = generateFxList(fxOrder);
    },
    getActiveIdsMut() {
      return activeIds;
    },
    regenerateFxList() {
      fxlist = generateFxList(fxOrder);
    },
    getCategories() {
      return data.categories;
    },
  };
}

export function microUILoop(
  ctx: ReaperContext,
  func: (stop: () => void) => void,
  cleanup?: () => void,
) {
  const downKeys = {
    // mouse
    left: false,
    middle: false,
    right: false,

    // keyboard
    shift: false,
    ctrl: false,
    alt: false,
    backspace: false,
    return: false,
  };
  const downChars: string[] = [];

  const KEY = {
    ESC: 27,
  } as const;

  deferLoop((stop) => {
    // handle char input
    {
      downKeys.backspace = false;
      downKeys.return = false;
      downChars.length = 0;
      while (true) {
        const char = gfx.getchar();
        if (char === KEY.ESC) return stop();
        if (char === -1) return stop();
        if (char === 0) break;

        if (char === 8) {
          // 8 is backspace / ctrl+h
          downKeys.backspace = true;
          continue;
        } else if (char === 13) {
          // 13 is enter / ctrl+?
          downKeys.return = true;
          continue;
        }

        const isUnicode = char >>> 24 === 117; // 'u'
        if (isUnicode) {
          const unicodeChar = char & 0xffffff;
          downChars.push(utf8.char(unicodeChar));
          continue;
        }

        // not unicode, only allow normal ASCII characters
        if (0x20 <= char && char <= 0x7e) {
          downChars.push(utf8.char(char));
          continue;
        }

        // TODO: unhandled character combination, e.g. Ctrl+A
        // log(char, isUnicode);
      }

      {
        const totalWheel = -gfx.mouse_wheel + gfx.mouse_hwheel;
        const wheelCoeff = 0.4;
        ctx.inputScroll(totalWheel * wheelCoeff, totalWheel * wheelCoeff);
        gfx.mouse_wheel = 0;
        gfx.mouse_hwheel = 0;
      }

      ctx.inputMouseMove(gfx.mouse_x, gfx.mouse_y);

      downKeys.left = (gfx.mouse_cap & MouseCap.LeftMouse) !== 0;
      downKeys.middle = (gfx.mouse_cap & MouseCap.MiddleMouse) !== 0;
      downKeys.right = (gfx.mouse_cap & MouseCap.RightMouse) !== 0;
      downKeys.ctrl = (gfx.mouse_cap & MouseCap.CommandKey) !== 0;
      downKeys.alt = (gfx.mouse_cap & MouseCap.OptionKey) !== 0;
      downKeys.shift = (gfx.mouse_cap & MouseCap.ShiftKey) !== 0;
      ctx.inputMouseContinuous(
        (downKeys.left ? MouseButton.Left : 0) |
          (downKeys.middle ? MouseButton.Middle : 0) |
          (downKeys.right ? MouseButton.Right : 0),
      );
      ctx.inputKeyContinuous(
        (downKeys.alt ? Key.Alt : 0) |
          (downKeys.backspace ? Key.Backspace : 0) |
          (downKeys.ctrl ? Key.Ctrl : 0) |
          (downKeys.return ? Key.Return : 0) |
          (downKeys.shift ? Key.Shift : 0),
      );

      ctx.inputText(downChars.join(""));
    }

    // user-provided GUI and processing code
    ctx.begin();
    func(stop);
    ctx.end();

    // draw frame
    let currentClip: Rect | null = null;
    for (const cmd of ctx.iterCommands()) {
      switch (cmd.type) {
        case CommandType.Clip: {
          currentClip = cmd.rect;
          break;
        }
        case CommandType.Rect: {
          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.rect(cmd.rect.x, cmd.rect.y, cmd.rect.w, cmd.rect.h);
          break;
        }
        case CommandType.Text: {
          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.x = cmd.pos.x;
          gfx.y = cmd.pos.y;

          // set font
          gfx.setfont(cmd.font);

          if (currentClip) {
            let [width, height] = gfx.measurestr(cmd.str);
            // increase by 1 pixel, because cmd position may be fractional
            width += 1;
            height += 1;

            const clipLeft = cmd.pos.x < currentClip.x;
            const clipRight =
              cmd.pos.x + width >= currentClip.x + currentClip.w;
            const clipTop = cmd.pos.y < currentClip.y;
            const clipBottom =
              cmd.pos.y + height >= currentClip.y + currentClip.h;

            if (!clipLeft && !clipRight && !clipTop && !clipBottom) {
              gfx.drawstr(cmd.str);
            } else if (!clipLeft && !clipTop) {
              // clipping right or bottom only, not left or top
              gfx.drawstr(
                cmd.str,
                0,
                currentClip.x + currentClip.w,
                currentClip.y + currentClip.h,
              );
            } else {
              // set buffer #0 resolution (must run this first)
              gfx.setimgdim(0, width, height);

              // clear the buffer to be transparent
              {
                // fill area with text color
                gfx.r = cmd.color.r / 255;
                gfx.g = cmd.color.g / 255;
                gfx.b = cmd.color.b / 255;
                gfx.a = 1.0;
                gfx.a2 = 1.0;
                gfx.mode = Mode.Default;
                gfx.dest = 0; // buffer #0
                gfx.rect(0, 0, width, height, true);

                // subtract alpha to make it completely transparent
                gfx.r = 0.0;
                gfx.g = 0.0;
                gfx.b = 0.0;
                gfx.a = -1.0;
                gfx.a2 = 1.0;
                gfx.mode = Mode.AdditiveBlend;
                gfx.dest = 0; // buffer #0
                gfx.rect(0, 0, width, height, true);
              }

              // draw text at (0, 0) + cmd fractional offset
              {
                // only affect the alpha channel
                gfx.r = 0.0;
                gfx.g = 0.0;
                gfx.b = 0.0;
                gfx.a = 1.0;
                gfx.a2 = cmd.color.a / 255;
                gfx.mode = Mode.AdditiveBlend;

                // use fractional part of command position for correct rendering
                gfx.x = cmd.pos.x % 1;
                gfx.y = cmd.pos.y % 1;

                gfx.dest = 0; // buffer #0
                gfx.drawstr(cmd.str, 0);
              }

              // blit the text to the main screen
              {
                gfx.x = 0.0;
                gfx.y = 0.0;
                gfx.a = 1.0;
                gfx.dest = -1; // main screen
                gfx.a2 = 1.0;
                gfx.mode = Mode.Default;
                gfx.blit(
                  0,
                  1.0,
                  0.0,
                  // src
                  // account for fractional part of command position for correct rendering
                  currentClip.x - cmd.pos.x + (cmd.pos.x % 1),
                  currentClip.y - cmd.pos.y + (cmd.pos.y % 1),
                  currentClip.w,
                  currentClip.h,
                  // dst
                  currentClip.x,
                  currentClip.y,
                  // currentClip.w,
                  // currentClip.h,
                );
              }

              // reset drawing settings
              {
                gfx.dest = -1; // main screen
                gfx.a2 = 1.0;
                gfx.mode = Mode.Default;
              }
            }
          } else {
            gfx.drawstr(cmd.str);
          }
          break;
        }
        case CommandType.Icon: {
          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.x = cmd.rect.x;
          gfx.y = cmd.rect.y;
          // TODO: Handle:
          // cmd.font
          // Clipping rect
          switch (cmd.id) {
            case IconId.Close: {
              gfx.drawstr(
                "✕",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                cmd.rect.x + cmd.rect.w,
                cmd.rect.y + cmd.rect.h,
              );
              break;
            }
            case IconId.Check: {
              gfx.drawstr(
                "✓",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                cmd.rect.x + cmd.rect.w,
                cmd.rect.y + cmd.rect.h,
              );
              break;
            }
            case IconId.Collapsed: {
              gfx.drawstr(
                "▸",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                cmd.rect.x + cmd.rect.w,
                cmd.rect.y + cmd.rect.h,
              );
              break;
            }
            case IconId.Expanded: {
              gfx.drawstr(
                "▾",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                cmd.rect.x + cmd.rect.w,
                cmd.rect.y + cmd.rect.h,
              );
              break;
            }
            default:
              error(`unhandled icon type: ${cmd}`);
          }
          break;
        }
        default:
          error(`unhandled command type: ${cmd}`);
      }
    }

    gfx.update();
  }, cleanup);
}

function main() {
  let manager = Manager();
  let query = "";
  let firstLoop = true;

  gfx.init("My Window", 500, 700);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();
  ctx.style.font = 1;

  microUILoop(ctx, (stop) => {
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

      // top title bar
      {
        const refreshWidth =
          ctx.textWidth(ctx.style.font, "Refresh") +
          ctx.style.padding * 2 +
          ctx.style.spacing;
        ctx.layoutRow([-refreshWidth, -1], 0);

        ctx.label("Add FX to: Track 1");
        ctx.button("Refresh");
      }

      // search bar
      {
        if (firstLoop) {
          const id = ctx.getId("query");
          ctx.setFocus(id);
        }
        ctx.layoutRow([-1], 0);
        const [rv, newQuery] = ctx.textbox("query", query);
        query = newQuery;
        if (rv === Response.Change) {
          manager.setQuery(query);
        }
      }

      ctx.layoutRow([-1], 0);

      let activeIdsChanged = false;

      {
        // "peek" the next layout
        const r = ctx.layoutNext();
        ctx.layoutSetNext(r, false);

        // calculate available space for buttons
        const availableWidth = r.w + ctx.style.spacing;

        const categories = manager.getCategories();
        const activeIds = manager.getActiveIdsMut();
        for (const { category, folders } of categories) {
          ctx.layoutBeginColumn();
          {
            let remainingWidth = availableWidth;

            // split the names into rows, based on the width of each button
            type Folder = (typeof folders)[number];
            type RowElement =
              | { width: number; type: "button"; folder: Folder }
              | { width: number; type: "label"; text: string };
            let rows: RowElement[][] = [[]];
            if (categories.length > 1) {
              // only show category label if there are more than 1 categories
              const labelWidth =
                ctx.textWidth(ctx.style.font, category) + ctx.style.padding * 2;

              if (remainingWidth < labelWidth + ctx.style.spacing) {
                remainingWidth = availableWidth;
                rows.push([]);
              }
              remainingWidth -= labelWidth + ctx.style.spacing;

              const currentRow = rows[rows.length - 1];
              currentRow.push({
                type: "label",
                width: labelWidth,
                text: category,
              });
            }
            for (const btn of folders) {
              const buttonWidth =
                ctx.textWidth(ctx.style.font, btn.name) + ctx.style.padding * 2;

              if (remainingWidth < buttonWidth + ctx.style.spacing) {
                remainingWidth = availableWidth;
                rows.push([]);
              }
              remainingWidth -= buttonWidth + ctx.style.spacing;

              const currentRow = rows[rows.length - 1];
              currentRow.push({
                type: "button",
                folder: btn,
                width: buttonWidth,
              });
            }

            // layout each row
            for (const row of rows) {
              if (row.length === 0) continue;

              ctx.layoutRow(
                row.map((x) => x.width),
                0,
              );
              for (const element of row) {
                switch (element.type) {
                  case "button": {
                    ctx.pushId(element.folder.id);
                    const active = toggleButton(
                      ctx,
                      element.folder.name,
                      activeIds.has(element.folder.id),
                    );
                    ctx.popId();
                    if (active) {
                      if (!activeIds.has(element.folder.id)) {
                        activeIds.add(element.folder.id);
                        activeIdsChanged = true;
                      }
                    } else {
                      if (activeIds.has(element.folder.id)) {
                        activeIds.delete(element.folder.id);
                        activeIdsChanged = true;
                      }
                    }
                    break;
                  }
                  case "label": {
                    ctx.label(category);
                    break;
                  }
                  default:
                    assertUnreachable(element);
                }
              }
            }
          }
          ctx.layoutEndColumn();
        }
      }

      // if filter has changed, regenerate the fx list
      if (activeIdsChanged) {
        manager.regenerateFxList();
      }

      ctx.layoutRow([-1], -1);

      const uid = fxBrowserH(
        ctx,
        manager.getFxlist().map((uid) => {
          const favourite = manager.inFavourites(uid);
          const fxInfo = manager.getFxInfo(uid);
          return {
            uid,
            name: fxInfo.name,
            type: fxInfo.prefix || FXFolderItemType[fxInfo.type] || "?",
            favourite,
          };
        }),
      );
      if (uid) log("Clicked on", inspect(uid));

      ctx.endWindow();
    }

    if (firstLoop) firstLoop = false;
  });
}

errorHandler(main);
