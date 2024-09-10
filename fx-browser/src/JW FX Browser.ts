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
  rgba,
} from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import { FxInfo, getCategories } from "./categories";
import { toggleButton } from "./widgets";

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
        log(folderFxs);

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

  gfx.init("My Window", 500, 700);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();
  ctx.style.font = 1;

  microUILoop(ctx, () => {
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

      ctx.layoutRow([-1], 0);
      ctx.text(inspect(manager.getActiveIdsMut()));

      ctx.layoutRow([-1], -1);
      ctx.beginPanel("fxlist");
      {
        const origSpacing = ctx.style.spacing;
        ctx.style.spacing = -6;

        for (const uid of manager.getFxlist()) {
          ctx.layoutRow([-1], 0);
          const fxInfo = manager.getFxInfo(uid);
          const fxTypeStr =
            FXFolderItemType[fxInfo.type] || fxInfo.type.toString();
          ctx.text(
            `[${fxTypeStr}] [${fxInfo.isInstrument}] ${
              fxInfo.display?.name || fxInfo.ident
            }`,
          );
        }

        ctx.style.spacing = origSpacing;
      }
      ctx.endPanel();

      ctx.endWindow();
    }
  });
}

errorHandler(main);
