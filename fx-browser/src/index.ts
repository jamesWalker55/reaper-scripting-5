import {
  AddFxParams,
  generateTakeContainerFxidx,
  generateTrackContainerFxidx,
} from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { FXFolderItemType } from "reaper-api/installedFx";
import { Take, Track } from "reaper-api/track";
import { assertUnreachable, ensureAPI, errorHandler } from "reaper-api/utils";
import { createContext, Option, Response } from "reaper-microui";
import { getCategories } from "./categories";
import { getFXTarget } from "./detectTarget";
import {
  addFxText,
  divider,
  fxBrowserH,
  fxBrowserV,
  microUILoop,
  toggleButton,
  wrappedToggleButtons,
} from "./widgets";

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
    [FXFolderItemType.ReWire]: 5,
    [FXFolderItemType.Container]: 5,
    [FXFolderItemType.VideoProcessor]: 5,
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
          if (!fxName.includes(keyword)) {
            return false;
          }
        }
        return true;
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

      // // sort by plugin type
      // const aOrder =
      //   aInfo.type in fxOrder ? fxOrder[aInfo.type as FXFolderItemType] : 0;
      // const bOrder =
      //   bInfo.type in fxOrder ? fxOrder[bInfo.type as FXFolderItemType] : 0;
      // if (aOrder !== bOrder) return aOrder - bOrder;

      // sort by display name
      const aName = aInfo.name.toLowerCase();
      const bName = bInfo.name.toLowerCase();
      if (aName < bName) {
        return -1;
      } else if (aName > bName) {
        return 1;
      }

      // sort by identifier name
      const aIdent = aInfo.ident.toLowerCase();
      const bIdent = bInfo.ident.toLowerCase();
      if (aIdent < bIdent) {
        return -1;
      } else if (aIdent > bIdent) {
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
    setActiveIds(newval: typeof activeIds) {
      activeIds = newval;
    },
    regenerateFxList() {
      fxlist = generateFxList(fxOrder);
    },
    getCategories() {
      return data.categories;
    },
  };
}

const VirtualKeyboard = (() => {
  const MAIN_SECTION_ID = 0;
  const ACTION_SEND_TO_VKB = 40637;
  const ACTION_SHOW_VKB = 40377;

  return {
    isSendToVKB() {
      const state = reaper.GetToggleCommandStateEx(
        MAIN_SECTION_ID,
        ACTION_SEND_TO_VKB,
      );
      return state === 1;
    },
    isVKBVisible() {
      const state = reaper.GetToggleCommandStateEx(
        MAIN_SECTION_ID,
        ACTION_SHOW_VKB,
      );
      return state === 1;
    },
    toggleSendToVKB() {
      reaper.Main_OnCommand(ACTION_SEND_TO_VKB, 0);
    },
    toggleVKBVisible() {
      reaper.Main_OnCommand(ACTION_SHOW_VKB, 0);
    },
  };
})();

function getScreenViewport() {
  ensureAPI("SWS Extensions", "JS_Window_GetViewportFromRect");

  // get mouse position
  const [mouseX, mouseY] = reaper.GetMousePosition();

  // find the monitor where the mouse lies
  const [left, top, right, bottom] = reaper.JS_Window_GetViewportFromRect(
    mouseX,
    mouseY,
    1,
    1,
    true,
  );

  return {
    left,
    top,
    right,
    bottom,
  };
}

function main() {
  const fxTarget = (() => {
    const fxTarget = getFXTarget();
    if (!fxTarget)
      throw new Error("Please click on a track before running this script!");

    const fxpathName =
      fxTarget.fxpath.length > 0
        ? ` > FX ${fxTarget.fxpath.map((x) => x + 1).join(" > ")}`
        : "";

    switch (fxTarget.target) {
      case "track": {
        const track = new Track(fxTarget.track);

        return {
          getDisplayName() {
            const trackIdx = track.getIdx() + 1;
            if (trackIdx === 0) {
              return `Master Track${fxpathName}`;
            } else {
              return `Track ${trackIdx} ${inspect(track.name)}${fxpathName}`;
            }
          },
          addFx(fx: AddFxParams) {
            const destpath = [...fxTarget.fxpath];

            // append FX count to the end of the path
            if (fxTarget.fxpath.length === 0) {
              const count = track.getFxCount();
              destpath.push(count);
            } else {
              const destContainerFxid = generateTrackContainerFxidx(
                track.obj,
                fxTarget.fxpath,
              );
              const [ok, count] = reaper.TrackFX_GetNamedConfigParm(
                track.obj,
                destContainerFxid,
                "container_count",
              );
              if (!ok)
                throw new Error(
                  `failed to get container_count for ${inspect(
                    fxTarget.fxpath,
                  )}`,
                );

              destpath.push(parseInt(count));
            }

            const newPos = track.addFx(fx, destpath);
            if (newPos === null) {
              throw new Error(
                `failed to add fx ${inspect(fx)} to dest ${destpath}`,
              );
            }

            // SetOpen doesn't work inside containers, only call this if the target is the root fxchain
            if (destpath.length === 1)
              reaper.TrackFX_SetOpen(track.obj, newPos, true);
          },
        };
      }
      case "take": {
        const track = new Track(fxTarget.track);
        const take = new Take(fxTarget.take);
        return {
          getDisplayName() {
            const trackIdx = track.getIdx() + 1;
            const takeName = take.name;
            return `Take ${inspect(
              takeName,
            )} (on Track ${trackIdx})${fxpathName}`;
          },
          addFx(fx: AddFxParams) {
            const destpath = [...fxTarget.fxpath];

            // append FX count to the end of the path
            if (fxTarget.fxpath.length === 0) {
              const count = take.getFxCount();
              destpath.push(count);
            } else {
              const destContainerFxid = generateTakeContainerFxidx(
                take.obj,
                fxTarget.fxpath,
              );
              const [ok, count] = reaper.TakeFX_GetNamedConfigParm(
                take.obj,
                destContainerFxid,
                "container_count",
              );
              if (!ok)
                throw new Error(
                  `failed to get container_count for ${inspect(
                    fxTarget.fxpath,
                  )}`,
                );

              destpath.push(parseInt(count));
            }

            const newPos = take.addFx(fx, destpath);
            if (newPos === null) {
              throw new Error(
                `failed to add fx ${inspect(fx)} to dest ${destpath}`,
              );
            }

            // SetOpen doesn't work inside containers, only call this if the target is the root fxchain
            if (destpath.length === 1)
              reaper.TakeFX_SetOpen(take.obj, newPos, true);
          },
        };
      }
      default:
        assertUnreachable(fxTarget);
    }
  })();

  let manager = Manager();
  let query = "";
  let firstLoop = true;
  let optionsEnabled = false;
  let verticalLayout = false;
  let queryIsFocused = false;
  let initialSendToVKB = VirtualKeyboard.isSendToVKB();

  {
    const WINDOW_WIDTH = 600;
    const WINDOW_HEIGHT = 702;
    const viewport = getScreenViewport();
    const windowPos = {
      x: (viewport.left + viewport.right) / 2 - WINDOW_WIDTH / 2,
      y: (viewport.top + viewport.bottom) / 2 - WINDOW_HEIGHT / 2,
    };
    gfx.init(
      "FX Browser",
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      undefined,
      windowPos.x,
      windowPos.y,
    );
  }
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();
  ctx.style.font = 1;

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

        // top title bar
        {
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
            manager = Manager();
            manager.setActiveIds(oldActiveIds);
            manager.setQuery(query);
          }

          optionsEnabled = toggleButton(ctx, "Options", optionsEnabled)[0];
        }

        if (optionsEnabled) {
          ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
          divider(ctx);

          ctx.layoutRow([-1], 0);
          verticalLayout = ctx.checkbox("Vertical layout", verticalLayout);

          ctx.layoutRow([-1], ctx.style.padding * 2 + 1);
          divider(ctx);
        }

        // search bar
        {
          const id = ctx.getId("query");
          if (firstLoop) {
            ctx.setFocus(id);
          }

          ctx.layoutRow([-1], 0);
          const [rv, newQuery] = ctx.textbox("query", query);
          query = newQuery;
          if (rv === Response.Change) {
            manager.setQuery(query);
          }

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
        }

        // add some space
        ctx.layoutRow([-1], 1);
        ctx.layoutNext();

        // filters
        ctx.layoutRow([-1], 0);

        {
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
        ctx.layoutRow([-1], -1);

        const uid = verticalLayout
          ? fxBrowserV(
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
            )
          : fxBrowserH(
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
