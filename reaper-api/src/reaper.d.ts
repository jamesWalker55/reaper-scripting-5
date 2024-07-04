/** @noSelfInFile **/

declare type HWND = { readonly _opaqueTypeTag: "HWND" };

declare namespace reaper {
  /**
   * ```
   * is_new_value, filename, sectionID, cmdID, mode, resolution, val, contextstr = get_action_context()
   * ```
   *
   * Returns contextual information about the script, typically MIDI/OSC input values.
   *
   * - `val` will be set to a relative or absolute value depending on mode (=0: absolute mode, >0: relative modes).
   * - `resolution`=127 for 7-bit resolution, =16383 for 14-bit resolution.
   * - `sectionID`, and `cmdID` will be set to -1 if the script is not part of the action list.
   * - `mode`, `resolution` and `val` will be set to -1 if the script was not triggered via MIDI/OSC.
   * - `contextstr` may be empty or one of:
   *     - `midi:XX[:YY]` (one or two bytes hex)
   *     - `[wheel|hwheel|mtvert|mthorz|mtzoom|mtrot|mediakbd]:flags`
   *     - `key:flags:keycode`
   *     - `osc:/msg[:f=FloatValue|:s=StringValue]`
   *     - `KBD_OnMainActionEx`
   *     - (flags may include V=virtkey, S=shift, A=alt/option, C=control/command, W=win/control)
   */
  function get_action_context(): LuaMultiReturn<
    [false, string, number, number, number, number, number, string]
  >;

  /** Returns "Win32", "Win64", "OSX32", "OSX64", "macOS-arm64", or "Other". */
  function GetOS(): import("./reaperEnums").OSType;

  /**
   * Show a message to the user (also useful for debugging). Send "\n" for newline, "" to clear the console. Prefix string with "!SHOW:" and text will be added to console without opening the window. See ClearConsole
   */
  function ShowConsoleMsg(msg: string | number): void;

  /**
   * Adds code to be called back by REAPER. Used to create persistent ReaScripts that continue to run and respond to input, while the user does other tasks. Identical to runloop().
   *
   * Note that no undo point will be automatically created when the script finishes, unless you create it explicitly.
   */
  function defer(func: () => void): void;

  function GetMainHwnd(): HWND;
}
