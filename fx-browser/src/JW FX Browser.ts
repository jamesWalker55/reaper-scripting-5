AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import {
  FXFolderItemType,
  loadFXFolders,
  loadInstalledFX,
} from "reaper-api/installedFx";
import { errorHandler, log } from "reaper-api/utils";
import {
  ColorId,
  Context,
  createContext,
  microUILoop,
  MouseButton,
  Option,
  rgba,
} from "reaper-microui";
import { getFXTarget } from "./detectTarget";
import {
  deserialiseFx,
  FxInfo,
  getCategories,
  serialiseFx,
} from "./categories";
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
    const result: (FxInfo & {
      serialised: string;
      displayName: string | undefined;
    })[] = [];
    for (const x of resultSet) {
      const fx = deserialiseFx(x);
      result.push({
        ...fx,
        serialised: x,
        displayName: data.fxNames[fx.ident],
      });
    }
    result.sort((a, b) => {
      const aFav = data.favouriteFx.has(a.serialised);
      const bFav = data.favouriteFx.has(b.serialised);
      // favourites always come first
      if (aFav && !bFav) {
        return -1;
      } else if (!aFav && bFav) {
        return 1;
      }

      // sort by plugin type
      const aOrder =
        a.type in fxOrder ? fxOrder[a.type as FXFolderItemType] : 0;
      const bOrder =
        b.type in fxOrder ? fxOrder[b.type as FXFolderItemType] : 0;
      if (aOrder !== bOrder) return aOrder - bOrder;

      // sort by display name
      if (a.displayName && b.displayName) {
        if (a.displayName < b.displayName) {
          return -1;
        } else if (a.displayName > b.displayName) {
          return 1;
        }
      }

      // sort by identifier name
      if (a.ident < b.ident) {
        return -1;
      } else if (a.ident > b.ident) {
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

  gfx.init("My Window", 260, 450);
  gfx.setfont(1, "Arial", 12);

  const ctx = createContext();

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
          ctx.label(category);

          ctx.layoutBeginColumn();
          {
            let remainingWidth = availableWidth;

            // split the names into rows, based on the width of each button
            type T = (typeof folders)[number];
            let rows: { folder: T; width: number }[][] = [[]];
            for (const btn of folders) {
              const buttonWidth =
                ctx.textWidth(ctx.style.font, btn.name) + ctx.style.padding * 2;

              if (remainingWidth < buttonWidth + ctx.style.spacing) {
                remainingWidth = availableWidth;
                rows.push([]);
              }
              remainingWidth -= buttonWidth + ctx.style.spacing;

              const currentRow = rows[rows.length - 1];
              currentRow.push({ folder: btn, width: buttonWidth });
            }

            // layout each row
            for (const row of rows) {
              if (row.length === 0) continue;

              ctx.layoutRow(
                row.map((x) => x.width),
                0,
              );
              for (const btn of row) {
                ctx.pushId(btn.folder.id);
                const active = toggleButton(
                  ctx,
                  btn.folder.name,
                  activeIds.has(btn.folder.id),
                );
                ctx.popId();
                if (active) {
                  if (!activeIds.has(btn.folder.id)) {
                    activeIds.add(btn.folder.id);
                    activeIdsChanged = true;
                  }
                } else {
                  if (activeIds.has(btn.folder.id)) {
                    activeIds.delete(btn.folder.id);
                    activeIdsChanged = true;
                  }
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
      {
        const origSpacing = ctx.style.spacing;
        ctx.style.spacing = -6;

        for (const fx of manager.getFxlist()) {
          ctx.layoutRow([-1], 0);
          const fxTypeStr = FXFolderItemType[fx.type] || fx.type.toString();
          ctx.text(`[${fxTypeStr}] ${fx.displayName || fx.ident}`);
        }

        ctx.style.spacing = origSpacing;
      }

      // {
      //   const origSpacing = ctx.style.spacing;
      //   ctx.style.spacing = -3;

      //   for (const folder of fxfolders) {
      //     ctx.layoutRow([-1], 0);
      //     ctx.label(`${folder.id}. ${folder.name}`);
      //     ctx.layoutRow([10, 20, 150, -1], 0);
      //     for (const item of folder.items) {
      //       const displayName = installedfx[item.ident];
      //       ctx.label("");
      //       ctx.label(item.type.toString());
      //       ctx.label(displayName || "");
      //       ctx.label(item.ident);
      //     }
      //   }

      //   ctx.style.spacing = origSpacing;
      // }

      ctx.endWindow();
    }
  });
}

errorHandler(main);
