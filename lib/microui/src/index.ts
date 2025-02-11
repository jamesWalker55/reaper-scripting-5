import { DrawStrFlags, Mode, MouseCap } from "reaper-api/ffi";
import { deferLoop, log } from "reaper-api/utils";
import {
  ColorId,
  CommandType,
  Context,
  createDefaultStyle,
  IconId,
  Key,
  MouseButton,
  Option,
  Rect,
  Response,
} from "./ui";

export * from "./ui";

export type ReaperFont = [string, number] | [string, number, string];
export type ReaperContext = Context<ReaperFont>;

/**
 * Create a new microUI context.
 *
 * You must run gfx.init before calling this. E.g.:
 *
 *     gfx.init("My window", 260, 450);
 *
 * Afterwards, use {@link microUILoop} to run the main GUI loop.
 */
export function createContext(): ReaperContext {
  return new Context<ReaperFont>(
    (font, str, len) => {
      if (len !== undefined) {
        str = str.slice(0, len);
      }
      gfx.setfont(1, font[0], font[1], font[2]);
      const [width, _] = gfx.measurestr(str);
      return width;
    },
    (font) => {
      gfx.setfont(1, font[0], font[1], font[2]);
      return gfx.texth;
    },
    createDefaultStyle(["Arial", 14]),
  );
}

/**
 * Main loop for a microUI GUI. Use {@link createContext} to create a context first.
 *
 * Example code:
 * - {@link demoSimple}
 * - {@link demoSingleWindow}
 * - {@link demoMultiWindow}
 */
export function microUILoop(
  ctx: ReaperContext,
  func: (stop: () => void, opt: { scale: number }) => void,
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

  const opt = {
    scale: 1.0,
  };

  deferLoop((stop) => {
    // handle char input
    {
      downKeys.backspace = false;
      downKeys.return = false;
      downChars.length = 0;
      while (true) {
        const char = gfx.getchar();
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

      if (downKeys.shift) {
        // treat mouse wheel as horizontal wheel
        ctx.inputScroll(-gfx.mouse_wheel * 0.3, gfx.mouse_hwheel * 0.3);
      } else {
        ctx.inputScroll(gfx.mouse_hwheel * 0.3, -gfx.mouse_wheel * 0.3);
      }
      gfx.mouse_wheel = 0;
      gfx.mouse_hwheel = 0;

      ctx.inputMouseMove(gfx.mouse_x / opt.scale, gfx.mouse_y / opt.scale);

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
    func(stop, opt);
    ctx.end();

    // draw frame
    let currentClip: Rect | null = null;
    for (const cmd of ctx.iterCommands()) {
      switch (cmd.type) {
        case CommandType.Clip: {
          currentClip = {
            x: cmd.rect.x * opt.scale,
            y: cmd.rect.y * opt.scale,
            w: cmd.rect.w * opt.scale,
            h: cmd.rect.h * opt.scale,
          };
          break;
        }
        case CommandType.Rect: {
          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.rect(
            cmd.rect.x * opt.scale,
            cmd.rect.y * opt.scale,
            cmd.rect.w * opt.scale,
            cmd.rect.h * opt.scale,
          );
          break;
        }
        case CommandType.Text: {
          const pos = { x: cmd.pos.x * opt.scale, y: cmd.pos.y * opt.scale };

          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.x = pos.x;
          gfx.y = pos.y;

          // set font
          gfx.setfont(1, cmd.font[0], cmd.font[1] * opt.scale, cmd.font[2]);

          if (currentClip) {
            let [width, height] = gfx.measurestr(cmd.str);
            // increase by 1 pixel, because cmd position may be fractional
            width += 1;
            height += 1;

            const clipLeft = pos.x < currentClip.x;
            const clipRight = pos.x + width >= currentClip.x + currentClip.w;
            const clipTop = pos.y < currentClip.y;
            const clipBottom = pos.y + height >= currentClip.y + currentClip.h;

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
                gfx.x = pos.x % 1;
                gfx.y = pos.y % 1;

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
                  currentClip.x - pos.x + (pos.x % 1),
                  currentClip.y - pos.y + (pos.y % 1),
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
          const rect = {
            x: cmd.rect.x * opt.scale,
            y: cmd.rect.y * opt.scale,
            w: cmd.rect.w * opt.scale,
            h: cmd.rect.h * opt.scale,
          };

          // set color
          gfx.r = cmd.color.r / 255;
          gfx.g = cmd.color.g / 255;
          gfx.b = cmd.color.b / 255;
          gfx.a = cmd.color.a / 255;

          gfx.x = rect.x;
          gfx.y = rect.y;
          // TODO: Handle:
          // cmd.font
          // Clipping rect
          switch (cmd.id) {
            case IconId.Close: {
              gfx.drawstr(
                "✕",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                rect.x + rect.w,
                rect.y + rect.h,
              );
              break;
            }
            case IconId.Check: {
              gfx.drawstr(
                "✓",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                rect.x + rect.w,
                rect.y + rect.h,
              );
              break;
            }
            case IconId.Collapsed: {
              gfx.drawstr(
                "▸",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                rect.x + rect.w,
                rect.y + rect.h,
              );
              break;
            }
            case IconId.Expanded: {
              gfx.drawstr(
                "▾",
                DrawStrFlags.CenterHorizontally | DrawStrFlags.CenterVertically,
                rect.x + rect.w,
                rect.y + rect.h,
              );
              break;
            }
            default:
              error(`unhandled icon type: ${cmd}`);
          }
          break;
        }
        case CommandType.Custom: {
          cmd.draw(currentClip);
          break;
        }
        default:
          error(`unhandled command type: ${cmd}`);
      }
    }

    gfx.update();
  }, cleanup);
}

export function demoMultiWindow() {
  gfx.init("Test window", 500, 500);

  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

  const bgColor = [90, 95, 100];
  const checks = [true, false, true];

  let logWindowTextboxInput = "";
  let logWindowLogUpdated = false;
  let logWindowLog = "";

  function writeLog(text: string) {
    if (logWindowLog.length > 0) {
      logWindowLog += `\n${text}`;
    } else {
      logWindowLog = text;
    }
    logWindowLogUpdated = true;
  }

  function logWindow(ctx: ReaperContext) {
    if (ctx.beginWindow("Log Window", { x: 350, y: 40, w: 300, h: 200 })) {
      /* output text panel */
      ctx.layoutRow([-1], -25);
      ctx.beginPanel("Log Output");
      const panel = ctx.getCurrentContainer();
      ctx.layoutRow([-1], -1);
      ctx.text(logWindowLog);
      ctx.endPanel();
      if (logWindowLogUpdated) {
        panel.scroll.y = panel.contentSize.y;
        logWindowLogUpdated = false;
      }

      /* input textbox + submit button */
      let submitted = false;
      ctx.layoutRow([-70, -1], 0);
      logWindowTextboxInput = ctx.textbox(
        "textbox",
        logWindowTextboxInput,
        Option.None,
        (res) => {
          if (res && (res & Response.Submit) !== 0) {
            ctx.setFocus(ctx.lastId);
            submitted = true;
          }
        },
      );
      if (ctx.button("Submit")) {
        submitted = true;
      }
      if (submitted) {
        writeLog(logWindowTextboxInput);
        logWindowTextboxInput = "";
      }

      ctx.endWindow();
    }
  }

  function testWindow(ctx: ReaperContext) {
    if (ctx.beginWindow("Demo Window", { x: 40, y: 40, w: 300, h: 450 })) {
      const win = ctx.getCurrentContainer();
      win.rect.w = Math.max(win.rect.w, 240);
      win.rect.h = Math.max(win.rect.h, 240);

      if (ctx.header("Window Info")) {
        const win = ctx.getCurrentContainer();
        ctx.layoutRow([54, -1], 0);

        ctx.label("Position:");
        ctx.label(`${win.rect.x}, ${win.rect.y}`);

        ctx.label("Size:");
        ctx.label(`${win.rect.w}, ${win.rect.h}`);
      }

      if (ctx.header("Test Buttons", Option.Expanded)) {
        ctx.layoutRow([86, -110, -1], 0);
        ctx.label("Test buttons 1:");
        if (ctx.button("Button 1")) {
          writeLog("Pressed button 1");
        }
        if (ctx.button("Button 2")) {
          writeLog("Pressed button 2");
        }
        ctx.label("Test buttons 2:");
        if (ctx.button("Button 3")) {
          writeLog("Pressed button 3");
        }
        if (ctx.button("Popup")) {
          ctx.openPopup("Test Popup");
        }
        if (ctx.beginPopup("Test Popup")) {
          ctx.button("Hello");
          ctx.button("World");
          ctx.endPopup();
        }
      }

      if (ctx.header("Tree and Text", Option.Expanded)) {
        ctx.layoutRow([140, -1], 0);
        ctx.layoutBeginColumn();
        if (ctx.beginTreenode("Test 1")) {
          if (ctx.beginTreenode("Test 1a")) {
            ctx.label("Hello");
            ctx.label("world");
            ctx.endTreenode();
          }
          if (ctx.beginTreenode("Test 1b")) {
            if (ctx.button("Button 1")) writeLog("Pressed button 1");
            if (ctx.button("Button 2")) writeLog("Pressed button 2");
            ctx.endTreenode();
          }
          ctx.endTreenode();
        }
        if (ctx.beginTreenode("Test 2")) {
          ctx.layoutRow([54, 54], 0);
          if (ctx.button("Button 3")) writeLog("Pressed button 3");
          if (ctx.button("Button 4")) writeLog("Pressed button 4");
          if (ctx.button("Button 5")) writeLog("Pressed button 5");
          if (ctx.button("Button 6")) writeLog("Pressed button 6");
          ctx.endTreenode();
        }
        if (ctx.beginTreenode("Test 3")) {
          checks[0] = ctx.checkbox("Checkbox 1", checks[0]);
          checks[1] = ctx.checkbox("Checkbox 2", checks[1]);
          checks[2] = ctx.checkbox("Checkbox 3", checks[2]);
          ctx.endTreenode();
        }
        ctx.layoutEndColumn();

        ctx.layoutBeginColumn();
        ctx.layoutRow([-1], 0);
        ctx.text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing " +
            "elit. Maecenas lacinia, sem eu lacinia molestie, mi risus faucibus " +
            "ipsum, eu varius magna felis a nulla.",
        );
        ctx.layoutEndColumn();
      }

      if (ctx.header("Background Color", Option.Expanded)) {
        ctx.layoutRow([-78, -1], 74);
        // sliders
        ctx.layoutBeginColumn();
        ctx.layoutRow([46, -1], 0);
        ctx.label("Red:");
        bgColor[0] = Math.floor(ctx.slider("bgColor[0]", bgColor[0], 0, 255));
        ctx.label("Green:");
        bgColor[1] = Math.floor(ctx.slider("bgColor[1]", bgColor[1], 0, 255));
        ctx.label("Blue:");
        bgColor[2] = Math.floor(ctx.slider("bgColor[2]", bgColor[2], 0, 255));
        ctx.layoutEndColumn();
        // color preview
        const r = ctx.layoutNext();
        ctx.drawRect(r, {
          r: bgColor[0],
          g: bgColor[1],
          b: bgColor[2],
          a: 255,
        });
        ctx.drawControlText(
          string.format("#%02X%02X%02X", bgColor[0], bgColor[1], bgColor[2]),
          r,
          ColorId.Text,
          Option.AlignCenter,
        );
      }

      ctx.endWindow();
    }
  }

  function uint8Slider(
    ctx: ReaperContext,
    name: string,
    value: number,
    low: number,
    high: number,
  ): number {
    const res = ctx.slider(
      name,
      value,
      low,
      high,
      0,
      "%.0f",
      Option.AlignCenter,
    );
    return Math.floor(res);
  }

  const styleWindowFields: [string, ColorId][] = [
    ["text:", ColorId.Text],
    ["border:", ColorId.Border],
    ["windowbg:", ColorId.WindowBG],
    ["titlebg:", ColorId.TitleBG],
    ["titletext:", ColorId.TitleText],
    ["panelbg:", ColorId.PanelBG],
    ["button:", ColorId.Button],
    ["buttonhover:", ColorId.ButtonHover],
    ["buttonfocus:", ColorId.ButtonFocus],
    ["base:", ColorId.Base],
    ["basehover:", ColorId.BaseHover],
    ["basefocus:", ColorId.BaseFocus],
    ["scrollbase:", ColorId.ScrollBase],
    ["scrollthumb:", ColorId.ScrollThumb],
  ];

  function styleWindow(ctx: ReaperContext) {
    if (ctx.beginWindow("Style Editor", { x: 350, y: 250, w: 300, h: 240 })) {
      const sw = ctx.getCurrentContainer().body.w * 0.14;
      ctx.layoutRow([80, sw, sw, sw, sw, -1], 0);
      // prettier-ignore
      for (let i = 0; i < styleWindowFields.length; i++) {
        const [label, colorId] = styleWindowFields[i];
        ctx.label(label);
        ctx.style.colors[colorId].r = uint8Slider(ctx, `${label}!r`, ctx.style.colors[colorId].r, 0, 255);
        ctx.style.colors[colorId].g = uint8Slider(ctx, `${label}!g`, ctx.style.colors[colorId].g, 0, 255);
        ctx.style.colors[colorId].b = uint8Slider(ctx, `${label}!b`, ctx.style.colors[colorId].b, 0, 255);
        ctx.style.colors[colorId].a = uint8Slider(ctx, `${label}!a`, ctx.style.colors[colorId].a, 0, 255);
        ctx.drawRect(ctx.layoutNext(), ctx.style.colors[colorId]);
      }
      ctx.endWindow();
    }
  }

  microUILoop(ctx, () => {
    styleWindow(ctx);
    logWindow(ctx);
    testWindow(ctx);

    gfx.clear = bgColor[0] + bgColor[1] * 256 + bgColor[2] * 65536;
  });
}

export function demoSingleWindow() {
  gfx.init("80gray Theme Adjuster", 260, 450);

  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

  const bgColor = [90, 95, 100];
  const checks = [true, false, true];

  microUILoop(ctx, () => {
    if (
      ctx.beginWindow(
        "Demo Window",
        { x: 0, y: 0, w: 0, h: 0 },
        Option.NoResize | Option.NoTitle | Option.NoClose,
      )
    ) {
      const win = ctx.getCurrentContainer();
      win.rect.w = gfx.w;
      win.rect.h = gfx.h;

      if (ctx.header("Window Info")) {
        const win = ctx.getCurrentContainer();
        ctx.layoutRow([54, -1], 0);

        ctx.label("Position:");
        ctx.label(`${win.rect.x}, ${win.rect.y}`);

        ctx.label("Size:");
        ctx.label(`${win.rect.w}, ${win.rect.h}`);
      }

      if (ctx.header("Test Buttons", Option.Expanded)) {
        ctx.layoutRow([86, -110, -1], 0);
        ctx.label("Test buttons 1:");
        if (ctx.button("Button 1")) {
          log("Pressed button 1");
        }
        if (ctx.button("Button 2")) {
          log("Pressed button 2");
        }
        ctx.label("Test buttons 2:");
        if (ctx.button("Button 3")) {
          log("Pressed button 3");
        }
        if (ctx.button("Popup")) {
          ctx.openPopup("Test Popup");
        }
        if (ctx.beginPopup("Test Popup")) {
          ctx.button("Hello");
          ctx.button("World");
          ctx.endPopup();
        }
      }

      if (ctx.header("Tree and Text", Option.Expanded)) {
        ctx.layoutRow([140, -1], 0);
        ctx.layoutBeginColumn();
        if (ctx.beginTreenode("Test 1")) {
          if (ctx.beginTreenode("Test 1a")) {
            ctx.label("Hello");
            ctx.label("world");
            ctx.endTreenode();
          }
          if (ctx.beginTreenode("Test 1b")) {
            if (ctx.button("Button 1")) log("Pressed button 1");
            if (ctx.button("Button 2")) log("Pressed button 2");
            ctx.endTreenode();
          }
          ctx.endTreenode();
        }
        if (ctx.beginTreenode("Test 2")) {
          ctx.layoutRow([54, 54], 0);
          if (ctx.button("Button 3")) log("Pressed button 3");
          if (ctx.button("Button 4")) log("Pressed button 4");
          if (ctx.button("Button 5")) log("Pressed button 5");
          if (ctx.button("Button 6")) log("Pressed button 6");
          ctx.endTreenode();
        }
        if (ctx.beginTreenode("Test 3")) {
          checks[0] = ctx.checkbox("Checkbox 1", checks[0]);
          checks[1] = ctx.checkbox("Checkbox 2", checks[1]);
          checks[2] = ctx.checkbox("Checkbox 3", checks[2]);
          ctx.endTreenode();
        }
        ctx.layoutEndColumn();

        ctx.layoutBeginColumn();
        ctx.layoutRow([-1], 0);
        ctx.text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing " +
            "elit. Maecenas lacinia, sem eu lacinia molestie, mi risus faucibus " +
            "ipsum, eu varius magna felis a nulla.",
        );
        ctx.layoutEndColumn();
      }

      if (ctx.header("Background Color", Option.Expanded)) {
        ctx.layoutRow([-78, -1], 74);
        // sliders
        ctx.layoutBeginColumn();
        ctx.layoutRow([46, -1], 0);
        ctx.label("Red:");
        bgColor[0] = Math.floor(ctx.slider("bgColor[0]", bgColor[0], 0, 255));
        ctx.label("Green:");
        bgColor[1] = Math.floor(ctx.slider("bgColor[1]", bgColor[1], 0, 255));
        ctx.label("Blue:");
        bgColor[2] = Math.floor(ctx.slider("bgColor[2]", bgColor[2], 0, 255));
        ctx.layoutEndColumn();
        // color preview
        const r = ctx.layoutNext();
        ctx.drawRect(r, {
          r: bgColor[0],
          g: bgColor[1],
          b: bgColor[2],
          a: 255,
        });
        ctx.drawControlText(
          string.format("#%02X%02X%02X", bgColor[0], bgColor[1], bgColor[2]),
          r,
          ColorId.Text,
          Option.AlignCenter,
        );
      }

      ctx.endWindow();
    }

    gfx.clear = bgColor[0] + bgColor[1] * 256 + bgColor[2] * 65536;
  });
}

export function demoSimple() {
  gfx.init("My Window", 260, 450);

  const ctx = createContext();
  ctx.style.font = ["Arial", 12];

  const checks = [true, false, true];

  microUILoop(ctx, () => {
    if (
      ctx.beginWindow(
        "Demo Window",
        { x: 0, y: 0, w: 0, h: 0 },
        Option.NoResize | Option.NoTitle | Option.NoClose,
      )
    ) {
      const win = ctx.getCurrentContainer();
      win.rect.w = gfx.w;
      win.rect.h = gfx.h;

      if (ctx.header("Window Info")) {
        const win = ctx.getCurrentContainer();
        ctx.layoutRow([54, -1], 0);

        ctx.label("Position:");
        ctx.label(`${win.rect.x}, ${win.rect.y}`);

        ctx.label("Size:");
        ctx.label(`${win.rect.w}, ${win.rect.h}`);
      }

      if (ctx.header("Test Buttons", Option.Expanded)) {
        ctx.layoutRow([86, -110, -1], 0);
        ctx.label("Test buttons 1:");
        if (ctx.button("Button 1")) {
          log("Pressed button 1");
        }
        if (ctx.button("Button 2")) {
          log("Pressed button 2");
        }
        ctx.label("Test buttons 2:");
        if (ctx.button("Button 3")) {
          log("Pressed button 3");
        }
        if (ctx.button("Popup")) {
          ctx.openPopup("Test Popup");
        }
        if (ctx.beginPopup("Test Popup")) {
          ctx.button("Hello");
          ctx.button("World");
          ctx.endPopup();
        }
      }

      if (ctx.header("Tree and Text", Option.Expanded)) {
        ctx.layoutRow([140, -1], 0);
        ctx.layoutBeginColumn();
        if (ctx.beginTreenode("Test 1")) {
          if (ctx.beginTreenode("Test 1a")) {
            ctx.label("Hello");
            ctx.label("world");
            ctx.endTreenode();
          }
          if (ctx.beginTreenode("Test 1b")) {
            if (ctx.button("Button 1")) log("Pressed button 1");
            if (ctx.button("Button 2")) log("Pressed button 2");
            ctx.endTreenode();
          }
          ctx.endTreenode();
        }
        if (ctx.beginTreenode("Test 2")) {
          checks[0] = ctx.checkbox("Checkbox 1", checks[0]);
          checks[1] = ctx.checkbox("Checkbox 2", checks[1]);
          checks[2] = ctx.checkbox("Checkbox 3", checks[2]);
          ctx.endTreenode();
        }
        ctx.layoutEndColumn();

        ctx.layoutBeginColumn();
        ctx.layoutRow([-1], 0);
        ctx.text(
          "Lorem ipsum dolor sit amet, consectetur adipiscing " +
            "elit. Maecenas lacinia, sem eu lacinia molestie, mi risus faucibus " +
            "ipsum, eu varius magna felis a nulla.",
        );
        ctx.layoutEndColumn();
      }

      ctx.endWindow();
    }
  });
}
