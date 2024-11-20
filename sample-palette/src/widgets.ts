import {
  ColorId,
  ReaperContext as Context,
  MouseButton,
  rgba,
} from "reaper-microui";

const TOGGLE_BUTTON_COLOR_NORMAL = rgba(25, 25, 25, 1.0);
const TOGGLE_BUTTON_COLOR_HOVER = rgba(45, 45, 45, 1.0);
const TOGGLE_BUTTON_COLOR_FOCUS = rgba(115, 115, 115, 1.0);

export function toggleButton(
  ctx: Context,
  label: string,
  state: boolean,
  identifier?: string,
): boolean {
  const id = ctx.getId(identifier || label);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle left click
  if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
    state = !state;
  }

  // draw
  if (state) {
    const originalButton = ctx.style.colors[ColorId.Button];
    const originalButtonHover = ctx.style.colors[ColorId.ButtonHover];
    const originalButtonFocus = ctx.style.colors[ColorId.ButtonFocus];
    ctx.style.colors[ColorId.Button] = TOGGLE_BUTTON_COLOR_NORMAL;
    ctx.style.colors[ColorId.ButtonHover] = TOGGLE_BUTTON_COLOR_HOVER;
    ctx.style.colors[ColorId.ButtonFocus] = TOGGLE_BUTTON_COLOR_FOCUS;
    ctx.drawControlFrame(id, r, ColorId.Button, 0);
    ctx.style.colors[ColorId.Button] = originalButton;
    ctx.style.colors[ColorId.ButtonHover] = originalButtonHover;
    ctx.style.colors[ColorId.ButtonFocus] = originalButtonFocus;
  } else {
    ctx.drawControlFrame(id, r, ColorId.Button, 0);
  }
  ctx.drawControlText(label, r, ColorId.Text, 0);

  return state;
}

function wrappedToggleButtons(
  ctx: Context,
  sectionIdentifier: string,
  label: string | null,
  buttons: {
    id: string;
    name: string;
  }[],
  activeIds: LuaSet<string>,
) {
  ctx.pushId(sectionIdentifier);

  // "peek" the next layout
  const r = ctx.layoutNext();
  ctx.layoutSetNext(r, false);

  // calculate available space for buttons
  const availableWidth = r.w + ctx.style.spacing;
  let labelWidth = 0;

  let response: { type: "enable" | "disable" | "solo"; id: string } | null =
    null;

  ctx.layoutBeginColumn();
  {
    let remainingWidth = availableWidth;

    // if there is a section name, subtract it from the initial row's width
    if (label !== null) {
      labelWidth = ctx.textWidth(ctx.style.font, label) + ctx.style.padding * 2;

      remainingWidth -= labelWidth + ctx.style.spacing;
    }

    // split the buttons into rows, based on the width of each button
    type Button = (typeof buttons)[number];
    let rows: { width: number; button: Button }[][] = [[]];
    for (const btn of buttons) {
      const buttonWidth =
        ctx.textWidth(ctx.style.font, btn.name) + ctx.style.padding * 2;

      if (remainingWidth < buttonWidth + ctx.style.spacing) {
        remainingWidth = availableWidth;
        rows.push([]);
      }
      remainingWidth -= buttonWidth + ctx.style.spacing;

      const currentRow = rows[rows.length - 1];
      currentRow.push({
        button: btn,
        width: buttonWidth,
      });
    }

    // layout each row
    let firstRow = true;
    for (const row of rows) {
      if (firstRow && label) {
        // add section label if is first row
        const widths = [labelWidth];
        for (const x of row) {
          widths.push(x.width);
        }

        ctx.layoutRow(widths, 0);
        ctx.label(label);
      } else if (row.length > 0) {
        // otherwise handle buttons normally (skip empty rows)
        const widths = [];
        for (const x of row) {
          widths.push(x.width);
        }

        ctx.layoutRow(widths, 0);
      } else {
        // skip empty row
        continue;
      }

      // add the buttons for this row
      for (const element of row) {
        ctx.pushId(element.button.id);
        const oldActive = activeIds.has(element.button.id);
        const newActive = toggleButton(
          ctx,
          element.button.name,
          activeIds.has(element.button.id),
          element.button.id,
        );
        ctx.popId();

        // handle mouse click
        if (oldActive !== newActive) {
          response = {
            type: newActive ? "enable" : "disable",
            id: element.button.id,
          };
        }
      }

      if (firstRow) firstRow = false;
    }
  }
  ctx.layoutEndColumn();

  ctx.popId();

  return response;
}

export function wrappedEnum<T extends number>(
  ctx: Context,
  identifier: string,
  choices: {
    id: T;
    name: string;
  }[],
  activeChoice: T,
): T {
  const activeIds: LuaSet<string> = new LuaSet();
  activeIds.add(string.format("%d", activeChoice));
  const res = wrappedToggleButtons(
    ctx,
    identifier,
    null,
    choices.map((x) => ({ id: string.format("%d", x.id), name: x.name })),
    activeIds,
  );
  if (res?.type === "enable") {
    return parseFloat(res.id) as T;
  }
  return activeChoice;
}

export function wrappedButtons(
  ctx: Context,
  identifier: string,
  sectionName: string | null,
  buttons: {
    name: string;
    callback: () => void;
  }[],
) {
  const idCallback: Record<string, () => void> = {};
  const choices = buttons.map((btn, i) => {
    const id = i.toString();
    idCallback[id] = btn.callback;
    return {
      name: btn.name,
      id,
    };
  });
  const res = wrappedToggleButtons(
    ctx,
    identifier,
    sectionName,
    choices,
    new LuaSet(),
  );
  if (res?.type === "enable") {
    idCallback[res.id]();
  }
}
