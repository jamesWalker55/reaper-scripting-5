import { DrawStrFlags, Mode, MouseCap } from "reaper-api/ffi";
import { deferLoop } from "reaper-api/utils";
import {
  ColorId,
  CommandType,
  ReaperContext as Context,
  IconId,
  Key,
  MouseButton,
  ReaperContext,
  Rect,
  rect,
  rgba,
  vec2,
} from "reaper-microui";

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

const BASE_MUTED_TEXT_COLOR = rgba(140, 140, 140, 1.0);

export function addFxText(ctx: Context, text: string) {
  const r = ctx.layoutNext();

  const PREFIX_TEXT = "Add FX to: ";
  const prefixWidth = ctx.textWidth(ctx.style.font, PREFIX_TEXT);
  const textWidth = ctx.textWidth(ctx.style.font, text);
  const availableWidth = r.w - ctx.style.padding * 2;

  const y = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  ctx.pushClipRect(r);
  if (prefixWidth + textWidth > availableWidth) {
    // hide the prefix
    const textX = r.x + ctx.style.padding;
    ctx.drawText(
      ctx.style.font,
      text,
      null,
      vec2(textX, y),
      ctx.style.colors[ColorId.Text],
    );
  } else {
    // draw the prefix
    const prefixX = r.x + ctx.style.padding;
    ctx.drawText(
      ctx.style.font,
      PREFIX_TEXT,
      null,
      vec2(prefixX, y),
      BASE_MUTED_TEXT_COLOR,
    );

    const textX = prefixX + prefixWidth;
    ctx.drawText(
      ctx.style.font,
      text,
      null,
      vec2(textX, y),
      ctx.style.colors[ColorId.Text],
    );
  }
  ctx.popClipRect();
}

const DIVIDER_COLOR = rgba(115, 115, 115, 1.0);

export function divider(ctx: Context) {
  const r = ctx.layoutNext();

  ctx.drawRect(
    rect(
      r.x + ctx.style.padding,
      r.y + ctx.style.padding,
      r.w - ctx.style.padding * 2,
      r.h - ctx.style.padding * 2,
    ),
    DIVIDER_COLOR,
  );
}

const TOGGLE_BUTTON_COLOR_NORMAL = rgba(25, 25, 25, 1.0);
const TOGGLE_BUTTON_COLOR_HOVER = rgba(45, 45, 45, 1.0);
const TOGGLE_BUTTON_COLOR_FOCUS = rgba(115, 115, 115, 1.0);

export function toggleButton(
  ctx: Context,
  label: string,
  state: boolean,
): [boolean, boolean] {
  const id = ctx.getId(label);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle left click
  if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
    state = !state;
  }
  // handle right click
  const rightClicked =
    ctx.mousePressed === MouseButton.Right && ctx.focus === id;

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

  return [state, rightClicked];
}

export function wrappedToggleButtons(
  ctx: Context,
  label: string | null,
  buttons: {
    id: string;
    name: string;
  }[],
  activeIds: LuaSet<string>,
) {
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
        const [newActive, rightClicked] = toggleButton(
          ctx,
          element.button.name,
          activeIds.has(element.button.id),
        );
        ctx.popId();

        // handle mouse click
        if (rightClicked) {
          response = {
            type: "solo",
            id: element.button.id,
          };
        } else if (oldActive !== newActive) {
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

  return response;
}

const FX_ROW_COLOR_NORMAL = rgba(0, 0, 0, 0.0);
const FX_ROW_COLOR_HOVER = rgba(70, 70, 70, 1.0);
const FX_ROW_COLOR_FOCUS = rgba(90, 90, 90, 1.0);

const FX_ROW_TYPE_NAME_COLOR = rgba(140, 140, 140, 1.0);

// width of columns
const FX_ROW_H_MIN_COL_WIDTH = 200;

/**
 * Used for horizontal list layout
 */
export function fxBrowserH(
  ctx: Context,
  fxs: { uid: string; name: string; type: string; favourite: boolean }[],
) {
  ctx.beginPanel("fxlistv");

  if (fxs.length === 0) {
    ctx.endPanel();
    return null;
  }

  const origSpacing = ctx.style.spacing;
  ctx.style.spacing = 0;

  const r = ctx.getCurrentContainer().rect;

  // each row is `size.y + padding * 2` tall, with `spacing` between each one
  // also account for panel's border padding (`padding`)
  let maxRows =
    (r.h - ctx.style.padding * 2 + ctx.style.spacing) /
    (ctx.style.size.y + ctx.style.padding * 2 + ctx.style.spacing);
  maxRows = Math.max(maxRows, 1.0);
  maxRows = Math.floor(maxRows);

  // actual number of columns needed to show all FX
  const realCols = Math.ceil(fxs.length / maxRows);
  // column limit for fitting FX without scrolling
  const fitMaxCols = Math.floor(
    (r.w - ctx.style.padding * 2 + ctx.style.spacing) /
      (FX_ROW_H_MIN_COL_WIDTH + ctx.style.spacing),
  );

  let clickedUid: string | null = null;

  {
    const widths = [];

    if (realCols <= fitMaxCols) {
      // all columns can fit on screen without scrolling
      const width =
        (r.w - ctx.style.padding * 2 + ctx.style.spacing) / realCols -
        ctx.style.spacing;
      for (let i = 0; i < realCols; i++) {
        widths.push(width);
      }
    } else {
      // columns will overflow and need scrolling
      for (let i = 0; i < realCols; i++) {
        widths.push(FX_ROW_H_MIN_COL_WIDTH);
      }
    }

    ctx.layoutRow(widths, 0);

    // iterate though fx and rows at the same time
    let i = 0;
    while (i < fxs.length) {
      ctx.layoutBeginColumn();
      ctx.layoutRow([-1], 0);
      for (let row = 0; row < maxRows && i < fxs.length; row++) {
        const fx = fxs[i];

        if (fxBrowserHRow(ctx, fx)) {
          clickedUid = fx.uid;
        }

        i += 1;
      }
      ctx.layoutEndColumn();
    }
  }

  ctx.style.spacing = origSpacing;

  ctx.endPanel();

  return clickedUid;
}

/**
 * Used for horizontal list layout
 */
function fxBrowserHRow(
  ctx: Context,
  fx: { uid: string; name: string; type: string; favourite: boolean },
) {
  // mouse interaction logic
  const id = ctx.getId(fx.uid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  const clicked = ctx.mousePressed === MouseButton.Left && ctx.focus === id;

  // draw the background
  {
    if (ctx.focus === id) {
      // focused
      ctx.drawRect(r, FX_ROW_COLOR_FOCUS);
    } else if (ctx.hover === id) {
      // hovered
      ctx.drawRect(r, FX_ROW_COLOR_HOVER);
    } else {
      // normal
      ctx.drawRect(r, FX_ROW_COLOR_NORMAL);
    }
  }

  // draw text
  const textY = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  // draw the favourite icon
  const favouriteX = r.x + ctx.style.padding;
  const favouriteWidth = ctx.textWidth(ctx.style.font, "★");

  if (fx.favourite) {
    ctx.drawText(
      ctx.style.font,
      "★",
      null,
      vec2(favouriteX, textY),
      ctx.style.colors[ColorId.Text],
    );
  }

  // generate text for the FX type
  const typeWidth = ctx.textWidth(ctx.style.font, fx.type);

  const nameX = favouriteX + favouriteWidth + ctx.style.padding;
  let nameWidth: number;
  // draw the fx name text, but leave space for the type at the end
  {
    const maxWidth =
      r.w -
      ctx.style.padding -
      favouriteWidth -
      ctx.style.padding -
      ctx.style.padding -
      typeWidth -
      ctx.style.padding;

    nameWidth = ctx.textWidth(ctx.style.font, fx.name);
    nameWidth = Math.min(nameWidth, maxWidth);

    ctx.pushClipRect(rect(nameX, r.y, nameWidth, r.h));
    ctx.drawText(
      ctx.style.font,
      fx.name,
      null,
      vec2(nameX, textY),
      ctx.style.colors[ColorId.Text],
    );
    ctx.popClipRect();
  }

  // draw the fx type
  {
    const typeX = nameX + nameWidth + ctx.style.padding;
    ctx.drawText(
      ctx.style.font,
      fx.type,
      null,
      vec2(typeX, textY),
      FX_ROW_TYPE_NAME_COLOR,
    );
  }

  return clicked;
}

/**
 * Used for vertical list layout
 */
export function fxBrowserV(
  ctx: Context,
  fxs: { uid: string; name: string; type: string; favourite: boolean }[],
) {
  ctx.beginPanel("fxlistv");

  ctx.layoutRow([-1], 0);

  const origSpacing = ctx.style.spacing;
  ctx.style.spacing = 0;

  let clickedUid: string | null = null;

  for (const fx of fxs) {
    if (fxBrowserVRow(ctx, fx)) {
      clickedUid = fx.uid;
    }
  }

  ctx.style.spacing = origSpacing;

  ctx.endPanel();

  return clickedUid;
}

/**
 * Used for vertical list layout
 */
export function fxBrowserVRow(
  ctx: Context,
  fx: { uid: string; name: string; type: string; favourite: boolean },
) {
  // mouse interaction logic
  const id = ctx.getId(fx.uid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  const clicked = ctx.mousePressed === MouseButton.Left && ctx.focus === id;

  // draw the background
  {
    if (ctx.focus === id) {
      // focused
      ctx.drawRect(r, FX_ROW_COLOR_FOCUS);
    } else if (ctx.hover === id) {
      // hovered
      ctx.drawRect(r, FX_ROW_COLOR_HOVER);
    } else {
      // normal
      ctx.drawRect(r, FX_ROW_COLOR_NORMAL);
    }
  }

  // draw text
  const textY = r.y + (r.h - ctx.textHeight(ctx.style.font)) / 2;

  // draw the favourite icon
  const favouriteX = r.x + ctx.style.padding;
  const favouriteWidth = ctx.textWidth(ctx.style.font, "★");

  if (fx.favourite) {
    ctx.drawText(
      ctx.style.font,
      "★",
      null,
      vec2(favouriteX, textY),
      ctx.style.colors[ColorId.Text],
    );
  }

  // generate text for the FX type
  const typeWidth = ctx.textWidth(ctx.style.font, fx.type);
  const typeX = r.x + r.w - ctx.style.padding - typeWidth;

  // draw the fx type
  {
    ctx.drawText(
      ctx.style.font,
      fx.type,
      null,
      vec2(typeX, textY),
      FX_ROW_TYPE_NAME_COLOR,
    );
  }

  // draw the fx name text
  {
    const x = favouriteX + favouriteWidth + ctx.style.padding;
    const width =
      r.w -
      ctx.style.padding -
      favouriteWidth -
      ctx.style.padding -
      ctx.style.padding -
      typeWidth -
      ctx.style.padding;
    ctx.pushClipRect(rect(x, r.y, width, r.h));
    ctx.drawText(
      ctx.style.font,
      fx.name,
      null,
      vec2(x, textY),
      ctx.style.colors[ColorId.Text],
    );
    ctx.popClipRect();
  }

  return clicked;
}
