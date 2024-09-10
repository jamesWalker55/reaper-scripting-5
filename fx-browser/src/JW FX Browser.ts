AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import { assertUnreachable, errorHandler, log } from "reaper-api/utils";
import {
  ColorId,
  ReaperContext as Context,
  createContext,
  microUILoop,
  MouseButton,
  Option,
  Response,
  rgba,
} from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import { FxInfo, getCategories } from "./categories";
import { fxRow, toggleButton } from "./widgets";

function wrappedButtons<T extends { name: string; state: boolean }>(
  ctx: Context,
  buttons: T[],
): T[] {
  // "peek" the next layout
  const r = ctx.layoutNext();
  ctx.layoutSetNext(r, false);

  // calculate available space for buttons
  const availableWidth = r.w + ctx.style.spacing;

  // storage to determine which button is clicked
  let activeBtns: T[] = [];

  ctx.layoutBeginColumn();
  {
    let remainingWidth = availableWidth;

    // split the names into rows, based on the width of each button
    let rows: { btn: T; width: number }[][] = [[]];
    for (const btn of buttons) {
      const buttonWidth =
        ctx.textWidth(ctx.style.font, btn.name) + ctx.style.padding * 2;

      if (remainingWidth < buttonWidth + ctx.style.spacing) {
        remainingWidth = availableWidth;
        rows.push([]);
      }
      remainingWidth -= buttonWidth + ctx.style.spacing;

      const currentRow = rows[rows.length - 1];
      currentRow.push({ btn, width: buttonWidth });
    }

    // layout each row
    for (const row of rows) {
      if (row.length === 0) continue;

      ctx.layoutRow(
        row.map((x) => x.width),
        0,
      );
      for (const btn of row) {
        btn.btn.state = toggleButton(ctx, btn.btn.name, btn.btn.state);
        if (btn.btn.state) {
          activeBtns.push(btn.btn);
        }
      }
    }
  }
  ctx.layoutEndColumn();

  return activeBtns;
}

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

    // sort the fx
    const result: string[] = [];
    for (const uid of resultSet) {
      result.push(uid);
    }
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
      if (aInfo.display?.name && bInfo.display?.name) {
        if (aInfo.display.name < bInfo.display.name) {
          return -1;
        } else if (aInfo.display.name > bInfo.display.name) {
          return 1;
        }
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
          ctx.label("query changed!");
        }
      }

      ctx.layoutRow([-1], 0);

      // ctx.button("⟳");
      // ctx.button("↻");
      // ctx.button("🗘");
      // ctx.button("✖");
      // gfx.ima

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
      const origPadding = ctx.style.padding;
      ctx.style.padding = 0;
      ctx.beginPanel("fxlist");
      ctx.style.padding = origPadding;
      {
        ctx.layoutRow([-1], 0);

        const origSpacing = ctx.style.spacing;
        ctx.style.spacing = 0;

        for (const uid of manager.getFxlist()) {
          const favourite = manager.inFavourites(uid);
          const fxInfo = manager.getFxInfo(uid);
          if (fxInfo.display) {
            // fx is installed and known
            fxRow(
              ctx,
              uid,
              fxInfo.display.name,
              fxInfo.display.prefix || FXFolderItemType[fxInfo.type] || "?",
              favourite,
            );
          } else if (fxInfo.type === FXFolderItemType.FXChain) {
            // fx chain has no display value
            fxRow(
              ctx,
              uid,
              fxInfo.ident,
              FXFolderItemType[FXFolderItemType.FXChain],
              favourite,
            );
          }
        }

        ctx.style.spacing = origSpacing;
      }
      ctx.endPanel();

      ctx.endWindow();
    }

    if (firstLoop) firstLoop = false;
  });
}

errorHandler(main);
