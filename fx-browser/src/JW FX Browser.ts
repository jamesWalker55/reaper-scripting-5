AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import { loadFXFolders, loadInstalledFX } from "reaper-api/installedFx";
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
import { getCategories, serialiseFx } from "./categories";
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

function main() {
  let data = getCategories();
  let activeIds: LuaSet<string> = new LuaSet();
  let fxList = (() => {
    const resultSet: LuaSet<string> = new LuaSet();
    for (const [folderId, fxs] of Object.entries(data.folderFx)) {
      for (const fx of fxs) {
        resultSet.add(fx);
      }
    }
    const result: string[] = [];
    for (const x of resultSet) {
      result.push(x);
    }
    result.sort();
    return result;
  })();

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

        for (const { category, folders } of data.categories) {
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
        fxList = (() => {
          const resultSet: LuaSet<string> = new LuaSet();
          for (const [folderId, fxs] of Object.entries(data.folderFx)) {
            if (activeIds.has(folderId)) {
              for (const fx of fxs) {
                resultSet.add(fx);
              }
            }
          }
          const result: string[] = [];
          for (const x of resultSet) {
            result.push(x);
          }
          result.sort();
          return result;
        })();
      }

      ctx.layoutRow([-1], 0);
      ctx.text(inspect(activeIds));
      {
        const origSpacing = ctx.style.spacing;
        ctx.style.spacing = -3;

        for (const fx of fxList) {
          ctx.layoutRow([-1], 0);
          ctx.text(inspect(fx));
          // ctx.layoutRow([10, 20, 150, -1], 0);
          // for (const item of folder.items) {
          //   const displayName = installedfx[item.ident];
          //   ctx.label("");
          //   ctx.label(item.type.toString());
          //   ctx.label(displayName || "");
          //   ctx.label(item.ident);
          // }
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
