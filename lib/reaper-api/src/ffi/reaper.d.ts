/** @noSelfInFile **/

declare type HWND = { readonly _opaqueTypeTag: "HWND" };
declare type ReaProject = { readonly _opaqueTypeTag: "ReaProject" };
declare type MediaTrack = { readonly _opaqueTypeTag: "MediaTrack" };
declare type MediaItem = { readonly _opaqueTypeTag: "MediaItem" };
declare type MediaItem_Take = { readonly _opaqueTypeTag: "MediaItem_Take" };
declare type identifier = { readonly _opaqueTypeTag: "identifier" };

declare namespace reaper {
  /** Returns true if function_name exists in the REAPER API */
  function APIExists(function_name: string): boolean;

  /** type 0=OK,1=OKCANCEL,2=ABORTRETRYIGNORE,3=YESNOCANCEL,4=YESNO,5=RETRYCANCEL : ret 1=OK,2=CANCEL,3=ABORT,4=RETRY,5=IGNORE,6=YES,7=NO */
  function ShowMessageBox(msg: string, title: string, type: number): number;

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

  /** adds prevent_count to the UI refresh prevention state; always add then remove the same amount, or major disfunction will occur */
  function PreventUIRefresh(prevent_count: number): void;

  /** Returns "Win32", "Win64", "OSX32", "OSX64", "macOS-arm64", or "Other". */
  function GetOS(): import("./enums").OSType;

  /** call to start a new block */
  function Undo_BeginBlock2(proj: ReaProject | number): void;

  /**
   * call to end the block,with extra flags if any,and a description
   *
   * flags: (from https://forum.cockos.com/showthread.php?t=185118)
   * ```plain
   * -1: All undo info
   * 0: ???? When only calling actions via OnCommand, since these create their own undo points
   * 1: track configurations (track/master vol/pan/routing, ALL envelopes (master included))
   * 2: track/master FX
   * 4: track items
   * 8: project states (loop selection, markers, regions)
   * 16: freeze states
   * ```
   */
  function Undo_EndBlock2(
    proj: ReaProject | number,
    descchange: string,
    extraflags: number,
  ): void;

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

  /**
   * ```
   * boolean retval, integer trackidx, integer itemidx, integer takeidx, integer fxidx, integer parm = reaper.GetTouchedOrFocusedFX(integer mode)
   * ```
   * Returns false if failed. If successful,
   *
   * - trackIdxOut will be track index (-1 is master track, 0 is first track).
   * - itemidxOut will be 0-based item index if an item, or -1 if not an item.
   * - takeidxOut will be 0-based take index.
   * - fxidxOut will be FX index, potentially with 0x2000000 set to signify container-addressing, or with 0x1000000 set to signify record-input FX.
   * - parmOut will be set to the parameter index if querying last-touched. parmOut will have 1 set if querying focused state and FX is no longer focused but still open.
   * @param mode can be 0 to query last touched parameter, or 1 to query currently focused FX.
   */
  function GetTouchedOrFocusedFX(
    mode: 0 | 1,
  ): LuaMultiReturn<[boolean, number, number, number, number, number]>;

  /** get a track from a project by track count (zero-based) (proj=0 for active project) */
  function GetTrack(proj: ReaProject | number, trackidx: number): MediaTrack;

  function GetMasterTrack(proj: ReaProject | number): MediaTrack;

  function GetTrackMediaItem(tr: MediaTrack, itemidx: number): MediaItem;

  /** get a take from an item by take count (zero-based) */
  function GetTake(item: MediaItem, takeidx: number): MediaItem_Take;

  /** returns NULL if the take is not valid */
  function GetTakeName(take: MediaItem_Take): string | null;

  /**
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers.
   *
   * To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index.
   *
   * e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be `0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2`
   *
   * This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic.
   *
   * In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetFXGUID(take: MediaItem_Take, fx: number): string;

  /**
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers.
   *
   * To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index.
   *
   * e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be `0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2`
   *
   * This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic.
   *
   * In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetFXGUID(track: MediaTrack, fx: number): string;

  /**
   * Get or set track string attributes.
   *
   * - `P_NAME` : char * : track name (on master returns NULL)
   * - `P_ICON` : const char * : track icon (full filename, or relative to resource_path/data/track_icons)
   * - `P_LANENAME:n` : char * : lane name (returns NULL for non-fixed-lane-tracks)
   * - `P_MCP_LAYOUT` : const char * : layout name
   * - `P_RAZOREDITS` : const char * : list of razor edit areas, as space-separated triples of start time, end time, and envelope GUID string.
   *   - Example: "0.0 1.0 \"\" 0.0 1.0 "{xyz-...}"
   * - `P_RAZOREDITS_EXT` : const char * : list of razor edit areas, as comma-separated sets of space-separated tuples of start time, end time, optional: envelope GUID string, fixed/fipm top y-position, fixed/fipm bottom y-position.
   *   - Example: "0.0 1.0,0.0 1.0 "{xyz-...}",1.0 2.0 "" 0.25 0.75"
   * - `P_TCP_LAYOUT` : const char * : layout name
   * - `P_EXT:xyz` : char * : extension-specific persistent data
   * - `P_UI_RECT:tcp.mute` : char * : read-only, allows querying screen position + size of track WALTER elements (tcp.size queries screen position and size of entire TCP, etc).
   * - `GUID` : GUID * : 16-byte GUID, can query or update. If using a _String() function, GUID is a string {xyz-...}.
   */
  function GetSetMediaTrackInfo_String(
    tr: MediaTrack,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * gets plug-in specific named configuration value (returns true on success).
   *
   * Supported values for read:
   *
   * - `pdc` : PDC latency
   * - `in_pin_X` : name of input pin X
   * - `out_pin_X` : name of output pin X
   * - `fx_type` : type string
   * - `fx_ident` : type-specific identifier
   * - `fx_name` : name of FX (also supported as original_name)
   * - `GainReduction_dB` : [ReaComp + other supported compressors]
   * - `parent_container` : FX ID of parent container, if any (v7.06+)
   * - `container_count` : [Container] number of FX in container
   * - `container_item.X` : FX ID of item in container (first item is container_item.0) (v7.06+)
   * - `param.X.container_map.hint_id` : unique ID of mapping (preserved if mapping order changes)
   * - `param.X.container_map.delete` : read this value in order to remove the mapping for this parameter
   * - `container_map.add` : read from this value to add a new container parameter mapping -- will return new parameter index (accessed via param.X.container_map.*)
   * - `container_map.add.FXID.PARMIDX` : read from this value to add/get container parameter mapping for FXID/PARMIDX -- will return the parameter index (accessed via param.X.container_map.*). FXID can be a full address (must be a child of the container) or a 0-based sub-index (v7.06+).
   * - `container_map.get.FXID.PARMIDX` : read from this value to get container parameter mapping for FXID/PARMIDX -- will return the parameter index (accessed via param.X.container_map.*). FXID can be a full address (must be a child of the container) or a 0-based sub-index (v7.06+).
   * - `chain_pdc_actual` : returns the actual chain latency in samples, only valid after playback has commenced, may be rounded up to block size.
   * - `chain_pdc_reporting` : returns the reported chain latency, always valid, not rounded to block size.
   *
   * Supported values for read/write:
   *
   * - `vst_chunk[_program]` : base64-encoded VST-specific chunk.
   * - `clap_chunk` : base64-encoded CLAP-specific chunk.
   * - `param.X.lfo.[active,dir,phase,speed,strength,temposync,free,shape]` : parameter moduation LFO state
   * - `param.X.acs.[active,dir,strength,attack,release,dblo,dbhi,chan,stereo,x2,y2]` : parameter modulation ACS state
   * - `param.X.plink.[active,scale,offset,effect,param,midi_bus,midi_chan,midi_msg,midi_msg2]` : parameter link/MIDI link: set effect=-100 to support midi_*
   * - `param.X.mod.[active,baseline,visible]` : parameter module global settings
   * - `param.X.learn.[midi1,midi2,osc]` : first two bytes of MIDI message, or OSC string if set
   * - `param.X.learn.mode` : absolution/relative mode flag (0: Absolute, 1: 127=-1,1=+1, 2: 63=-1, 65=+1, 3: 65=-1, 1=+1, 4: toggle if nonzero)
   * - `param.X.learn.flags` : &1=selected track only, &2=soft takeover, &4=focused FX only, &8=LFO retrigger, &16=visible FX only
   * - `param.X.container_map.fx_index` : index of FX contained in container
   * - `param.X.container_map.fx_parm` : parameter index of parameter of FX contained in container
   * - `param.X.container_map.aliased_name` : name of parameter (if user-renamed, otherwise fails)
   * - `BANDTYPEx, BANDENABLEDx` : band configuration [ReaEQ]
   * - `THRESHOLD, CEILING, TRUEPEAK` : [ReaLimit]
   * - `NUMCHANNELS, NUMSPEAKERS, RESETCHANNELS` : [ReaSurroundPan]
   * - `ITEMx` : [ReaVerb] state configuration line, when writing should be followed by a write of DONE
   * - `FILE, FILEx, -FILEx, +FILEx, -FILE*` : [RS5k] file list, -/+ prefixes are write-only, when writing any, should be followed by a write of DONE
   * - `MODE, RSMODE` : [RS5k] general mode, resample mode
   * - `VIDEO_CODE` : [video processor] code
   * - `force_auto_bypass` : 0 or 1 - force auto-bypass plug-in on silence
   * - `parallel` : 0, 1 or 2 - 1=process plug-in in parallel with previous, 2=process plug-in parallel and merge MIDI
   * - `instance_oversample_shift` : instance oversampling shift amount, 0=none, 1=~96k, 2=~192k, etc. When setting requires playback stop/start to take effect
   * - `chain_oversample_shift` : chain oversampling shift amount, 0=none, 1=~96k, 2=~192k, etc. When setting requires playback stop/start to take effect
   * - `chain_pdc_mode` : chain PDC mode (0=classic, 1=new-default, 2=ignore PDC, 3=hwcomp-master)
   * - `chain_sel` : selected/visible FX in chain
   * - `renamed_name` : renamed FX instance name (empty string = not renamed)
   * - `container_nch` : number of internal channels for container
   * - `container_nch_in` : number of input pins for container
   * - `container_nch_out` : number of output pints for container
   * - `container_nch_feedback` : number of internal feedback channels enabled in container
   * - `focused` : reading returns 1 if focused. Writing a positive value to this sets the FX UI as "last focused."
   * - `last_touched` : reading returns two integers, one indicates whether FX is the last-touched FX, the second indicates which parameter was last touched. Writing a negative value ensures this plug-in is not set as last touched, otherwise the FX is set "last touched," and last touched parameter index is set to the value in the string (if valid).
   *
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetNamedConfigParm(
    track: MediaTrack,
    fx: number,
    parmname: string,
  ): LuaMultiReturn<[boolean, string]>;

  /** sets plug-in specific named configuration value (returns true on success). See TrackFX_GetNamedConfigParm */
  function TrackFX_SetNamedConfigParm(
    track: MediaTrack,
    fx: number,
    parmname: string,
    value: string,
  ): boolean;

  /** gets plug-in specific named configuration value (returns true on success). see TrackFX_GetNamedConfigParm */
  function TakeFX_GetNamedConfigParm(
    take: MediaItem_Take,
    fx: number,
    parmname: string,
  ): LuaMultiReturn<[boolean, string]>;

  /** sets plug-in specific named configuration value (returns true on success). See TrackFX_GetNamedConfigParm */
  function TakeFX_SetNamedConfigParm(
    take: MediaItem_Take,
    fx: number,
    parmname: string,
    value: string,
  ): boolean;

  function TrackFX_GetNumParams(track: MediaTrack, fx: number): number;

  function TakeFX_GetNumParams(take: MediaItem_Take, fx: number): number;

  /** gets an identifying string for the parameter */
  function TrackFX_GetParamIdent(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /** gets an identifying string for the parameter */
  function TakeFX_GetParamIdent(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  function TrackFX_GetParamName(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  function TakeFX_GetParamName(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

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

  function GetLastColorThemeFile(): string;

  /**
   * Returns a HWND to a window whose title matches the specified string.
   * - Unlike the Win32 function FindWindow, this function searches top-level as well as child windows, so that the target window can be found irrespective of docked state.
   * - In addition, the function can optionally match substrings of the title.
   * - Matching is not case sensitive.
   * @param title
   * @param exact Match entire title, or match substring of title.
   */
  function JS_Window_Find(title: string, exact: boolean): identifier | null;

  /**
   * Similar to the C++ WIN32 function GetDlgItem, this function finds child windows by ID.
   *
   * (The ID of a window may be retrieved by JS_Window_GetLongPtr.)
   */
  function JS_Window_FindChildByID(
    parentHWND: identifier,
    ID: number,
  ): identifier | null;

  /**
   * Returns the indices of all selected items as a comma-separated list.
   *
   * - retval: Number of selected items found; negative or zero if an error occured.
   */
  function JS_ListView_ListAllSelItems(
    listviewHWND: identifier,
  ): LuaMultiReturn<[number, string]>;

  function JS_ListView_GetItemCount(listviewHWND: identifier): number;

  /** Write the given string into the system clipboard. */
  function CF_SetClipboard(str: string): void;

  /** Read the contents of the system clipboard. */
  function CF_GetClipboard(): string;
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
  let mode: import("./enums").Mode;

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
  let mouse_cap: import("./enums").MouseCap;

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
    flags?: import("./enums").DrawStrFlags,
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