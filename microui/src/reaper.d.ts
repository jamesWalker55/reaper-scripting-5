/** @noSelf */
declare namespace reaper {
  /**
   * Show a message to the user (also useful for debugging). Send "\n" for newline, "" to clear the console. Prefix string with "!SHOW:" and text will be added to console without opening the window. See ClearConsole
   */
  function ShowConsoleMsg(msg: string | number): void;

  /**
   * returns theme layout parameter. return value is cfg-name, or nil/empty if out of range.
   */
  function ThemeLayout_GetParameter(
    wp: number,
  ):
    | LuaMultiReturn<[string, string, number, number, number, number]>
    | LuaMultiReturn<[null]>;

  /**
   * sets theme layout parameter to value. persist=true in order to have change loaded on next theme load. note that the caller should update layouts via ThemeLayout_RefreshAll to make changes visible.
   */
  function ThemeLayout_SetParameter(
    wp: number,
    value: number,
    persist: boolean,
  ): boolean;

  /**
   * Refreshes all layouts
   */
  function ThemeLayout_RefreshAll(): void;

  /**
   * Adds code to be called back by REAPER. Used to create persistent ReaScripts that continue to run and respond to input, while the user does other tasks. Identical to runloop().
   *
   * Note that no undo point will be automatically created when the script finishes, unless you create it explicitly.
   */
  function defer(func: () => void): void;

  function GetLastColorThemeFile(): string;
}

/** @noSelf */
declare namespace gfx {
  /**
   * current red component (0..1) used by drawing operations.
   */
  let r: number;

  /**
   * current green component (0..1) used by drawing operations.
   */
  let g: number;

  /**
   * current blue component (0..1) used by drawing operations.
   */
  let b: number;

  /**
   * current alpha component (0..1) used by drawing operations when writing solid colors (normally ignored but useful when creating transparent images).
   */
  let a2: number;

  /**
   * alpha for drawing (1=normal).
   */
  let a: number;

  /**
   * blend mode for drawing.
   *
   * Set mode to 0 for default options.
   *
   * Add 1.0 for additive blend mode (if you wish to do subtractive, set gfx.a to negative and use gfx.mode as additive).
   *
   * Add 2.0 to disable source alpha for gfx.blit().
   *
   * Add 4.0 to disable filtering for gfx.blit().
   */
  let mode: import("./reaperEnums").Mode;

  /**
   * width of the UI framebuffer.
   */
  let w: number;

  /**
   * height of the UI framebuffer.
   */
  let h: number;

  /**
   * current graphics position X. Some drawing functions use as start position and update.
   */
  let x: number;

  /**
   * current graphics position Y. Some drawing functions use as start position and update.
   */
  let y: number;

  /**
   * if greater than -1.0, framebuffer will be cleared to that color.
   *
   * the color for this one is packed RGB (0..255), i.e.
   *
   * ```
   * red + green * 256 + blue * 65536
   * ```
   *
   * The default is 0 (black).
   */
  let clear: number;

  /**
   * destination for drawing operations, -1 is main framebuffer, set to 0..1024-1 to have drawing operations go to an offscreen buffer (or loaded image).
   */
  let dest: number;

  /**
   * the (READ-ONLY) height of a line of text in the current font. Do not modify this variable.
   */
  const texth: number;

  /**
   * to support hidpi/retina, callers should set to 1.0 on initialization, this value will be updated to value greater than 1.0 (such as 2.0) if retina/hidpi.
   *
   * On macOS gfx.w/gfx.h/etc will be doubled, but on other systems gfx.w/gfx.h will remain the same and gfx.ext_retina is a scaling hint for drawing.
   */
  let ext_retina: number;

  /**
   * current X coordinate of the mouse relative to the graphics window.
   */
  const mouse_x: number;

  /**
   * current Y coordinate of the mouse relative to the graphics window.
   */
  const mouse_y: number;

  /**
   * wheel position, will change typically by 120 or a multiple thereof, the caller should clear the state to 0 after reading it.
   */
  let mouse_wheel: number;

  /**
   * horizontal wheel positions, will change typically by 120 or a multiple thereof, the caller should clear the state to 0 after reading it.
   */
  let mouse_hwheel: number;

  /**
   * a bitfield of mouse and keyboard modifier state.
   *
   * Note that a script must call `gfx_getchar()` at least once in order to get modifier state when the mouse is not captured by the window.
   */
  let mouse_cap: import("./reaperEnums").MouseCap;

  /**
   * Draws an arc of the circle centered at x,y, with ang1/ang2 being specified in radians.
   */
  function arc(
    x: number,
    y: number,
    r: number,
    ang1: number,
    ang2: number,
    antialias?: boolean,
  ): void;

  /**
   * Copies from source (-1 = main framebuffer, or an image from gfx.loadimg() etc), using current opacity and copy mode (set with gfx.a, gfx.mode).
   *
   * If destx/desty are not specified, gfx.x/gfx.y will be used as the destination position.
   * @param source number: -1 = main framebuffer, or an image from gfx.loadimg() etc
   * @param scale scale (1.0 is unscaled) will be used only if destw/desth are not specified.
   * @param rotation rotation is an angle in radians
   * @param srcx specify the source rectangle (if omitted srcw/srch default to image size)
   * @param srcy specify the source rectangle (if omitted srcw/srch default to image size)
   * @param srcw specify the source rectangle (if omitted srcw/srch default to image size)
   * @param srch specify the source rectangle (if omitted srcw/srch default to image size)
   * @param destx specify destination rectangle (if not specified destw/desth default to srcw/srch * scale).
   * @param desty specify destination rectangle (if not specified destw/desth default to srcw/srch * scale).
   * @param destw specify destination rectangle (if not specified destw/desth default to srcw/srch * scale).
   * @param desth specify destination rectangle (if not specified destw/desth default to srcw/srch * scale).
   * @param rotxoffs
   * @param rotyoffs
   */
  function blit(
    source: number,
    scale?: number,
    rotation?: number,
    srcx?: number,
    srcy?: number,
    srcw?: number,
    srch?: number,
    destx?: number,
    desty?: number,
    destw?: number,
    desth?: number,
    rotxoffs?: number,
    rotyoffs?: number,
  ): void;

  /**
   * Blurs the region of the screen between gfx.x,gfx.y and x,y, and updates gfx.x,gfx.y to x,y.
   */
  function blurto(x: number, y: number): void;

  /**
   * Draws a circle, optionally filling/antialiasing.
   */
  function circle(
    x: number,
    y: number,
    r: number,
    fill?: boolean,
    antialias?: boolean,
  ): void;

  /**
   * Converts the coordinates x,y to screen coordinates, returns those values.
   */
  function clienttoscreen(
    x: number,
    y: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * Blits from srcimg(srcx,srcy,srcw,srch) to destination (destx,desty,destw,desth).
   *
   * - Source texture coordinates are s/t
   * - dsdx represents the change in s coordinate for each x pixel
   * - dtdy represents the change in t coordinate for each y pixel, etc
   * - dsdxdy represents the change in dsdx for each line
   *
   * If usecliprect is specified and 0, then srcw/srch are ignored.
   *
   * @param srcimg
   * @param srcs
   * @param srct
   * @param srcw
   * @param srch
   * @param destx
   * @param desty
   * @param destw
   * @param desth
   * @param dsdx
   * @param dtdx
   * @param dsdy
   * @param dtdy
   * @param dsdxdy
   * @param dtdxdy
   * @param usecliprect
   */
  function deltablit(
    srcimg: number,
    srcs: number,
    srct: number,
    srcw: number,
    srch: number,
    destx: number,
    desty: number,
    destw: number,
    desth: number,
    dsdx: number,
    dtdx: number,
    dsdy: number,
    dtdy: number,
    dsdxdy: number,
    dtdxdy: number,
    usecliprect?: 0 | 1,
  ): void;

  /**
   * Call with v=-1 to query docked state, otherwise v>=0 to set docked state.
   *
   * State is &1 if docked, second byte is docker index (or last docker index if undocked).
   *
   * If wx-wh specified, additional values will be returned with the undocked window position/size
   */
  function dock(
    v: number,
    wx?: boolean,
    wy?: boolean,
    ww?: boolean,
    wh?: boolean,
  ):
    | LuaMultiReturn<[number]>
    | LuaMultiReturn<[number, number]>
    | LuaMultiReturn<[number, number, number]>
    | LuaMultiReturn<[number, number, number, number]>
    | LuaMultiReturn<[number, number, number, number, number]>;

  /**
   * Draws the character (can be a numeric ASCII code as well), to gfx.x, gfx.y, and moves gfx.x over by the size of the character.
   */
  function drawchar(char: string | number): void;

  /**
   * Draws the number n with ndigits of precision to gfx.x, gfx.y, and updates gfx.x to the right side of the drawing. The text height is gfx.texth.
   * @param n Number to draw
   * @param ndigits Digits of precision
   */
  function drawnumber(n: number, ndigits: number): void;

  /**
   * Draws a string at gfx.x, gfx.y, and updates gfx.x/gfx.y so that subsequent draws will occur in a similar place.
   */
  function drawstr(
    str: string,
    flags?: import("./reaperEnums").DrawStrFlags,
    right?: number,
    bottom?: number,
  ): void;

  /**
   * If char is 0 or omitted, returns a character from the keyboard queue, or 0 if no character is available, or -1 if the graphics window is not open. If char is specified and nonzero, that character's status will be checked, and the function will return greater than 0 if it is pressed. Note that calling gfx.getchar() at least once causes gfx.mouse_cap to reflect keyboard modifiers even when the mouse is not captured.
   *
   * Common values are standard ASCII, such as 'a', 'A', '=' and '1', but for many keys multi-byte values are used, including 'home', 'up', 'down', 'left', 'rght', 'f1'.. 'f12', 'pgup', 'pgdn', 'ins', and 'del'.
   *
   * Modified and special keys can also be returned, including:
   *
   * - Ctrl/Cmd+A..Ctrl+Z as 1..26
   * - Ctrl/Cmd+Alt+A..Z as 257..282
   * - Alt+A..Z as 'A'+256..'Z'+256
   * - 27 for ESC
   * - 13 for Enter
   * - ' ' for space
   * - 65536 for query of special flags, returns: &1 (supported), &2=window has focus, &4=window is visible, &8=mouse click would hit window. 65537 queries special flags but does not do the mouse click hit testing (faster).
   * - If unichar is specified, it will be set to the unicode value of the key if available (and the return value may be the unicode value or a raw key value as described above, depending). If unichar is not specified, unicode codepoints greater than 255 will be returned as 'u'<<24 + value
   */
  function getchar(char?: number, unichar?: boolean): number;

  /**
   * Returns success,string for dropped file index idx. call gfx.dropfile(-1) to clear the list when finished.
   */
  function getdropfile(idx: number): boolean;

  /**
   * Returns current font index, and the actual font face used by this font (if available).
   */
  function getfont(): LuaMultiReturn<[number, string]>;

  /**
   * Retreives the dimensions of an image specified by handle, returns w, h pair.
   */
  function getimgdim(handle: number): LuaMultiReturn<[number, number]>;

  /** Returns r,g,b values [0..1] of the pixel at (gfx.x,gfx.y) */
  function getpixel(): LuaMultiReturn<[number, number, number]>;

  /**
   * Fills a gradient rectangle with the color and alpha specified.
   *
   * - drdx-dadx reflect the adjustment (per-pixel) applied for each pixel moved to the right,
   * - drdy-dady are the adjustment applied for each pixel moved toward the bottom.
   *
   * Normally drdx=adjustamount/w, drdy=adjustamount/h, etc.
   */
  function gradrect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    g: number,
    b: number,
    a: number,
    drdx?: number,
    dgdx?: number,
    dbdx?: number,
    dadx?: number,
    drdy?: number,
    dgdy?: number,
    dbdy?: number,
    dady?: number,
  ): void;

  /**
   * Initializes the graphics window with title name. Suggested width and height can be specified. If window is already open, a non-empty name will re-title window, or an empty title will resize window.
   *
   * Once the graphics window is open, gfx.update() should be called periodically.
   */
  function init(
    name: string,
    width?: number,
    height?: number,
    dockstate?: number,
    xpos?: number,
    ypos?: number,
  ): void;

  /**
   * Draws a line from x,y to x2,y2, and if aa is not specified or 0.5 or greater, it will be antialiased.
   */
  function line(
    x: number,
    y: number,
    x2: number,
    y2: number,
    aa: boolean,
  ): void;

  /**
   * Draws a line from gfx.x,gfx.y to x,y. If aa is 0.5 or greater, then antialiasing is used. Updates gfx.x and gfx.y to x,y.
   */
  function lineto(x: number, y: number, aa: boolean): void;

  // Load image from filename into slot 0..1024-1 specified by image. Returns the image index if success, otherwise -1 if failure. The image will be resized to the dimensions of the image file.
  // function loadimg(image,"filename");

  // Measures the drawing dimensions of a character with the current font (as set by gfx.setfont). Returns width and height of character.
  // function measurechar(char);

  /**
   * Measures the drawing dimensions of a string with the current font (as set by gfx.setfont). Returns width and height of string.
   */
  function measurestr(str: string): LuaMultiReturn<[number, number]>;

  // Multiplies each pixel by mul_* and adds add_*, and updates in-place. Useful for changing brightness/contrast, or other effects.
  // function muladdrect(x,y,w,h,mul_r,mul_g,mul_b[,mul_a,add_r,add_g,add_b,add_a]);

  /**
   * Formats and draws a string at gfx.x, gfx.y, and updates gfx.x/gfx.y accordingly (the latter only if the formatted string contains newline). For more information on format strings, see sprintf()
   */
  function printf(format: string, ...args: any[]): void;

  /**
   * Closes the graphics window.
   */
  function quit(): void;

  /**
   * Fills a rectangle at x,y, w,h pixels in dimension, filled by default.
   */
  function rect(
    x: number,
    y: number,
    w: number,
    h: number,
    filled?: boolean,
  ): void;

  /**
   * Fills a rectangle from gfx.x,gfx.y to x,y. Updates gfx.x,gfx.y to x,y.
   */
  function rectto(x: number, y: number): void;

  /**
   * Draws a rectangle with rounded corners.
   */
  function roundrect(
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number,
    antialias?: boolean,
  ): void;

  /**
   * Converts the screen coordinates x,y to client coordinates, returns those values.
   */
  function screentoclient(
    x: number,
    y: number,
  ): LuaMultiReturn<[number, number]>;

  // Sets gfx.r/gfx.g/gfx.b/gfx.a/gfx.mode/gfx.a2, sets gfx.dest if final parameter specified
  // function set(r[,g,b,a,mode,dest,a2]);

  // Sets the mouse cursor to resource_id and/or custom_cursor_name.
  // function setcursor(resource_id,custom_cursor_name);

  /**
   * Can select a font and optionally configure it.
   *
   * - idx=0 for default bitmapped font, no configuration is possible for this font.
   * - idx=1..16 for a configurable font, specify fontface such as "Arial", sz of 8-100, and optionally specify flags, which is a multibyte character, which can include 'i' for italics, 'u' for underline, or 'b' for bold. These flags may or may not be supported depending on the font and OS.
   *
   * After calling gfx.setfont(), gfx.texth may be updated to reflect the new average line height.
   */
  function setfont(
    idx: number,
    fontface?: string,
    sz?: number,
    flags?: string,
  ): void;

  // Resize image referenced by index 0..1024-1, width and height must be 0-8192. The contents of the image will be undefined after the resize.
  // function setimgdim(image,w,h);

  // Writes a pixel of r,g,b to gfx.x,gfx.y.
  // function setpixel(r,g,b);

  /**
   * Shows a popup menu at gfx.x,gfx.y. str is a list of fields separated by | characters. Each field represents a menu item.
   * Fields can start with special characters:
   *
   * - `#` : grayed out
   * - `!` : checked
   * - `>` : this menu item shows a submenu
   * - `<` : last item in the current submenu
   *
   * An empty field will appear as a separator in the menu. gfx.showmenu returns 0 if the user selected nothing from the menu, 1 if the first field is selected, etc.
   *
   * Example:
   *
   *     gfx.showmenu("first item, followed by separator||!second item, checked|>third item which spawns a submenu|#first item in submenu, grayed out|<second and last item in submenu|fourth item in top menu")
   */
  function showmenu(str: string): number;

  // Blits to destination at (destx,desty), size (destw,desth). div_w and div_h should be 2..64, and table should point to a table of 2*div_w*div_h values (table can be a regular table or (for less overhead) a reaper.array). Each pair in the table represents a S,T coordinate in the source image, and the table is treated as a left-right, top-bottom list of texture coordinates, which will then be rendered to the destination.
  // function transformblit(srcimg,destx,desty,destw,desth,div_w,div_h,table);

  /**
   * Draws a filled triangle, or any convex polygon.
   */
  function triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    ...xy: number[]
  ): void;

  /**
   * Updates the graphics display, if opened
   */
  function update(): void;
}
