/** @noSelfInFile **/

// Up to date with REAPER v7.25/win64

// https://stackoverflow.com/questions/56737033/how-to-define-an-opaque-type-in-typescript
declare const opaqueTypeTag: unique symbol;
declare type AudioAccessor = { readonly [opaqueTypeTag]: "AudioAccessor" };
declare type AudioWriter = { readonly [opaqueTypeTag]: "AudioWriter" };
declare type BR_Envelope = { readonly [opaqueTypeTag]: "BR_Envelope" };
declare type CF_Preview = { readonly [opaqueTypeTag]: "CF_Preview" };
declare type FxChain = { readonly [opaqueTypeTag]: "FxChain" };
declare type HWND = { readonly [opaqueTypeTag]: "HWND" };
declare type IReaperControlSurface = {
  readonly [opaqueTypeTag]: "IReaperControlSurface";
};
declare type ImGui_Context = { readonly [opaqueTypeTag]: "ImGui_Context" };
declare type ImGui_DrawList = { readonly [opaqueTypeTag]: "ImGui_DrawList" };
declare type ImGui_DrawListSplitter = {
  readonly [opaqueTypeTag]: "ImGui_DrawListSplitter";
};
declare type ImGui_Font = { readonly [opaqueTypeTag]: "ImGui_Font" };
declare type ImGui_Function = { readonly [opaqueTypeTag]: "ImGui_Function" };
declare type ImGui_Image = { readonly [opaqueTypeTag]: "ImGui_Image" };
declare type ImGui_ImageSet = { readonly [opaqueTypeTag]: "ImGui_ImageSet" };
declare type ImGui_ListClipper = {
  readonly [opaqueTypeTag]: "ImGui_ListClipper";
};
declare type ImGui_Resource = { readonly [opaqueTypeTag]: "ImGui_Resource" };
declare type ImGui_TextFilter = {
  readonly [opaqueTypeTag]: "ImGui_TextFilter";
};
declare type ImGui_Viewport = { readonly [opaqueTypeTag]: "ImGui_Viewport" };
declare type KbdSectionInfo = { readonly [opaqueTypeTag]: "KbdSectionInfo" };
declare type LICE_IBitmap = { readonly [opaqueTypeTag]: "LICE_IBitmap" };
declare type MediaItem = { readonly [opaqueTypeTag]: "MediaItem" };
declare type MediaItem_Take = { readonly [opaqueTypeTag]: "MediaItem_Take" };
declare type MediaTrack = { readonly [opaqueTypeTag]: "MediaTrack" };
declare type PCM_source = { readonly [opaqueTypeTag]: "PCM_source" };
declare type PackageEntry = { readonly [opaqueTypeTag]: "PackageEntry" };
declare type ReaProject = { readonly [opaqueTypeTag]: "ReaProject" } | 0;
declare type RprMidiNote = { readonly [opaqueTypeTag]: "RprMidiNote" };
declare type RprMidiTake = { readonly [opaqueTypeTag]: "RprMidiTake" };
declare type TrackEnvelope = { readonly [opaqueTypeTag]: "TrackEnvelope" };
declare type WDL_FastString = { readonly [opaqueTypeTag]: "WDL_FastString" };
declare type identifier = { readonly [opaqueTypeTag]: "identifier" };
declare type joystick_device = { readonly [opaqueTypeTag]: "joystick_device" };
declare type unsupported = { readonly [opaqueTypeTag]: "unsupported" };

declare namespace reaper {
  /**
   * ```
   * MediaItem _ = reaper.AddMediaItemToTrack(MediaTrack tr)
   * ```
   * creates a new media item.
   */
  function AddMediaItemToTrack(tr: MediaTrack): MediaItem;

  /**
   * ```
   * integer _ = reaper.AddProjectMarker(ReaProject proj, boolean isrgn, number pos, number rgnend, string name, integer wantidx)
   * ```
   * Returns the index of the created marker/region, or -1 on failure. Supply wantidx>=0 if you want a particular index number, but you'll get a different index number a region and wantidx is already in use.
   */
  function AddProjectMarker(
    proj: ReaProject,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
    wantidx: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.AddProjectMarker2(ReaProject proj, boolean isrgn, number pos, number rgnend, string name, integer wantidx, integer color)
   * ```
   * Returns the index of the created marker/region, or -1 on failure. Supply wantidx>=0 if you want a particular index number, but you'll get a different index number a region and wantidx is already in use. color should be 0 (default color), or ColorToNative(r,g,b)|0x1000000
   */
  function AddProjectMarker2(
    proj: ReaProject,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
    wantidx: number,
    color: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.AddRemoveReaScript(boolean add, integer sectionID, string scriptfn, boolean commit)
   * ```
   * Add a ReaScript (return the new command ID, or 0 if failed) or remove a ReaScript (return >0 on success). Use commit==true when adding/removing a single script. When bulk adding/removing n scripts, you can optimize the n-1 first calls with commit==false and commit==true for the last call.
   */
  function AddRemoveReaScript(
    add: boolean,
    sectionID: number,
    scriptfn: string,
    commit: boolean,
  ): number;

  /**
   * ```
   * MediaItem_Take _ = reaper.AddTakeToMediaItem(MediaItem item)
   * ```
   * creates a new take in an item
   */
  function AddTakeToMediaItem(item: MediaItem): MediaItem_Take;

  /**
   * ```
   * boolean _ = reaper.AddTempoTimeSigMarker(ReaProject proj, number timepos, number bpm, integer timesig_num, integer timesig_denom, boolean lineartempochange)
   * ```
   * Deprecated. Use SetTempoTimeSigMarker with ptidx=-1.
   * @deprecated
   */
  function AddTempoTimeSigMarker(
    proj: ReaProject,
    timepos: number,
    bpm: number,
    timesig_num: number,
    timesig_denom: number,
    lineartempochange: boolean,
  ): boolean;

  /**
   * ```
   * reaper.adjustZoom(number amt, integer forceset, boolean doupd, integer centermode)
   * ```
   * forceset=0,doupd=true,centermode=-1 for default
   */
  function adjustZoom(
    amt: number,
    forceset: number,
    doupd: boolean,
    centermode: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.AnyTrackSolo(ReaProject proj)
   * ```
   */
  function AnyTrackSolo(proj: ReaProject): boolean;

  /**
   * ```
   * boolean _ = reaper.APIExists(string function_name)
   * ```
   * Returns true if function_name exists in the REAPER API
   */
  function APIExists(function_name: string): boolean;

  /**
   * ```
   * reaper.APITest()
   * ```
   * Displays a message window if the API was successfully called.
   */
  function APITest(): void;

  /**
   * ```
   * boolean _ = reaper.ApplyNudge(ReaProject project, integer nudgeflag, integer nudgewhat, integer nudgeunits, number value, boolean reverse, integer copies)
   * ```
   * nudgeflag: &1=set to value (otherwise nudge by value), &2=snap
   *
   * nudgewhat: 0=position, 1=left trim, 2=left edge, 3=right edge, 4=contents, 5=duplicate, 6=edit cursor
   *
   * nudgeunit: 0=ms, 1=seconds, 2=grid, 3=256th notes, ..., 15=whole notes, 16=measures.beats (1.15 = 1 measure + 1.5 beats), 17=samples, 18=frames, 19=pixels, 20=item lengths, 21=item selections
   *
   * value: amount to nudge by, or value to set to
   *
   * reverse: in nudge mode, nudges left (otherwise ignored)
   *
   * copies: in nudge duplicate mode, number of copies (otherwise ignored)
   */
  function ApplyNudge(
    project: ReaProject,
    nudgeflag: number,
    nudgewhat: number,
    nudgeunits: number,
    value: number,
    reverse: boolean,
    copies: number,
  ): boolean;

  /**
   * ```
   * reaper.ArmCommand(integer cmd, string sectionname)
   * ```
   * arms a command (or disarms if 0 passed) in section sectionname (empty string for main)
   */
  function ArmCommand(cmd: number, sectionname: string): void;

  /**
   * ```
   * reaper.Audio_Init()
   * ```
   * open all audio and MIDI devices, if not open
   */
  function Audio_Init(): void;

  /**
   * ```
   * integer _ = reaper.Audio_IsPreBuffer()
   * ```
   * is in pre-buffer? threadsafe
   */
  function Audio_IsPreBuffer(): number;

  /**
   * ```
   * integer _ = reaper.Audio_IsRunning()
   * ```
   * is audio running at all? threadsafe
   */
  function Audio_IsRunning(): number;

  /**
   * ```
   * reaper.Audio_Quit()
   * ```
   * close all audio and MIDI devices, if open
   */
  function Audio_Quit(): void;

  /**
   * ```
   * boolean _ = reaper.AudioAccessorStateChanged(AudioAccessor accessor)
   * ```
   * Returns true if the underlying samples (track or media item take) have changed, but does not update the audio accessor, so the user can selectively call AudioAccessorValidateState only when needed. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, DestroyAudioAccessor, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function AudioAccessorStateChanged(accessor: AudioAccessor): boolean;

  /**
   * ```
   * reaper.AudioAccessorUpdate(AudioAccessor accessor)
   * ```
   * Force the accessor to reload its state from the underlying track or media item take. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function AudioAccessorUpdate(accessor: AudioAccessor): void;

  /**
   * ```
   * boolean _ = reaper.AudioAccessorValidateState(AudioAccessor accessor)
   * ```
   * Validates the current state of the audio accessor -- must ONLY call this from the main thread. Returns true if the state changed.
   */
  function AudioAccessorValidateState(accessor: AudioAccessor): boolean;

  /**
   * ```
   * reaper.BypassFxAllTracks(integer bypass)
   * ```
   * -1 = bypass all if not all bypassed,otherwise unbypass all
   */
  function BypassFxAllTracks(bypass: number): void;

  /**
   * ```
   * integer _ = reaper.CalcMediaSrcLoudness(PCM_source mediasource)
   * ```
   * Calculates loudness statistics of media via dry run render. Statistics will be displayed to the user; call GetSetProjectInfo_String("RENDER_STATS") to retrieve via API. Returns 1 if loudness was calculated successfully, -1 if user canceled the dry run render.
   */
  function CalcMediaSrcLoudness(mediasource: PCM_source): number;

  /**
   * ```
   * number _ = reaper.CalculateNormalization(PCM_source source, integer normalizeTo, number normalizeTarget, number normalizeStart, number normalizeEnd)
   * ```
   * Calculate normalize adjustment for source media. normalizeTo: 0=LUFS-I, 1=RMS-I, 2=peak, 3=true peak, 4=LUFS-M max, 5=LUFS-S max. normalizeTarget: dBFS or LUFS value. normalizeStart, normalizeEnd: time bounds within source media for normalization calculation. If normalizationStart=0 and normalizationEnd=0, the full duration of the media will be used for the calculation.
   */
  function CalculateNormalization(
    source: PCM_source,
    normalizeTo: number,
    normalizeTarget: number,
    normalizeStart: number,
    normalizeEnd: number,
  ): number;

  /**
   * ```
   * reaper.ClearAllRecArmed()
   * ```
   */
  function ClearAllRecArmed(): void;

  /**
   * ```
   * reaper.ClearConsole()
   * ```
   * Clear the ReaScript console. See ShowConsoleMsg
   */
  function ClearConsole(): void;

  /**
   * ```
   * reaper.ClearPeakCache()
   * ```
   * resets the global peak caches
   */
  function ClearPeakCache(): void;

  /**
   * ```
   * integer r, integer g, integer b = reaper.ColorFromNative(integer col)
   * ```
   * Extract RGB values from an OS dependent color. See ColorToNative.
   */
  function ColorFromNative(
    col: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * integer _ = reaper.ColorToNative(integer r, integer g, integer b)
   * ```
   * Make an OS dependent color from RGB values (e.g. RGB() macro on Windows). r,g and b are in [0..255]. See ColorFromNative.
   */
  function ColorToNative(r: number, g: number, b: number): number;

  /**
   * ```
   * integer _ = reaper.CountActionShortcuts(KbdSectionInfo section, integer cmdID)
   * ```
   * Returns the number of shortcuts that exist for the given command ID.
   *
   * see GetActionShortcutDesc, DeleteActionShortcut, DoActionShortcutDialog.
   */
  function CountActionShortcuts(section: KbdSectionInfo, cmdID: number): number;

  /**
   * ```
   * integer _ = reaper.CountAutomationItems(TrackEnvelope env)
   * ```
   * Returns the number of automation items on this envelope. See GetSetAutomationItemInfo
   */
  function CountAutomationItems(env: TrackEnvelope): number;

  /**
   * ```
   * integer _ = reaper.CountEnvelopePoints(TrackEnvelope envelope)
   * ```
   * Returns the number of points in the envelope. See CountEnvelopePointsEx.
   */
  function CountEnvelopePoints(envelope: TrackEnvelope): number;

  /**
   * ```
   * integer _ = reaper.CountEnvelopePointsEx(TrackEnvelope envelope, integer autoitem_idx)
   * ```
   * Returns the number of points in the envelope.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See GetEnvelopePointEx, SetEnvelopePointEx, InsertEnvelopePointEx, DeleteEnvelopePointEx.
   */
  function CountEnvelopePointsEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.CountMediaItems(ReaProject proj)
   * ```
   * count the number of items in the project (proj=0 for active project)
   */
  function CountMediaItems(proj: ReaProject): number;

  /**
   * ```
   * integer retval, integer num_markers, integer num_regions = reaper.CountProjectMarkers(ReaProject proj)
   * ```
   * num_markersOut and num_regionsOut may be NULL.
   */
  function CountProjectMarkers(
    proj: ReaProject,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * integer _ = reaper.CountSelectedMediaItems(ReaProject proj)
   * ```
   * Discouraged, because GetSelectedMediaItem can be inefficient if media items are added, rearranged, or deleted in between calls. Instead see CountMediaItems, GetMediaItem, IsMediaItemSelected.
   */
  function CountSelectedMediaItems(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.CountSelectedTracks(ReaProject proj)
   * ```
   * Count the number of selected tracks in the project (proj=0 for active project). This function ignores the master track, see CountSelectedTracks2.
   */
  function CountSelectedTracks(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.CountSelectedTracks2(ReaProject proj, boolean wantmaster)
   * ```
   * Count the number of selected tracks in the project (proj=0 for active project).
   */
  function CountSelectedTracks2(proj: ReaProject, wantmaster: boolean): number;

  /**
   * ```
   * integer _ = reaper.CountTakeEnvelopes(MediaItem_Take take)
   * ```
   * See GetTakeEnvelope
   */
  function CountTakeEnvelopes(take: MediaItem_Take): number;

  /**
   * ```
   * integer _ = reaper.CountTakes(MediaItem item)
   * ```
   * count the number of takes in the item
   */
  function CountTakes(item: MediaItem): number;

  /**
   * ```
   * integer _ = reaper.CountTCPFXParms(ReaProject project, MediaTrack track)
   * ```
   * Count the number of FX parameter knobs displayed on the track control panel.
   */
  function CountTCPFXParms(project: ReaProject, track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.CountTempoTimeSigMarkers(ReaProject proj)
   * ```
   * Count the number of tempo/time signature markers in the project. See GetTempoTimeSigMarker, SetTempoTimeSigMarker, AddTempoTimeSigMarker.
   */
  function CountTempoTimeSigMarkers(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.CountTrackEnvelopes(MediaTrack track)
   * ```
   * see GetTrackEnvelope
   */
  function CountTrackEnvelopes(track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.CountTrackMediaItems(MediaTrack track)
   * ```
   * count the number of items in the track
   */
  function CountTrackMediaItems(track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.CountTracks(ReaProject proj)
   * ```
   * count the number of tracks in the project (proj=0 for active project)
   */
  function CountTracks(proj: ReaProject): number;

  /**
   * ```
   * MediaItem _ = reaper.CreateNewMIDIItemInProj(MediaTrack track, number starttime, number endtime, optional boolean qnIn)
   * ```
   * Create a new MIDI media item, containing no MIDI events. Time is in seconds unless qn is set.
   */
  function CreateNewMIDIItemInProj(
    track: MediaTrack,
    starttime: number,
    endtime: number,
    qnIn?: boolean,
  ): MediaItem;

  /**
   * ```
   * AudioAccessor _ = reaper.CreateTakeAudioAccessor(MediaItem_Take take)
   * ```
   * Create an audio accessor object for this take. Must only call from the main thread. See CreateTrackAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function CreateTakeAudioAccessor(take: MediaItem_Take): AudioAccessor;

  /**
   * ```
   * AudioAccessor _ = reaper.CreateTrackAudioAccessor(MediaTrack track)
   * ```
   * Create an audio accessor object for this track. Must only call from the main thread. See CreateTakeAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function CreateTrackAudioAccessor(track: MediaTrack): AudioAccessor;

  /**
   * ```
   * integer _ = reaper.CreateTrackSend(MediaTrack tr, MediaTrack desttrIn)
   * ```
   * Create a send/receive (desttrInOptional!=NULL), or a hardware output (desttrInOptional==NULL) with default properties, return >=0 on success (== new send/receive index). See RemoveTrackSend, GetSetTrackSendInfo, GetTrackSendInfo_Value, SetTrackSendInfo_Value.
   */
  function CreateTrackSend(tr: MediaTrack, desttrIn: MediaTrack): number;

  /**
   * ```
   * reaper.CSurf_FlushUndo(boolean force)
   * ```
   * call this to force flushing of the undo states after using CSurf_On*Change()
   */
  function CSurf_FlushUndo(force: boolean): void;

  /**
   * ```
   * boolean _ = reaper.CSurf_GetTouchState(MediaTrack trackid, integer isPan)
   * ```
   */
  function CSurf_GetTouchState(trackid: MediaTrack, isPan: number): boolean;

  /**
   * ```
   * reaper.CSurf_GoEnd()
   * ```
   */
  function CSurf_GoEnd(): void;

  /**
   * ```
   * reaper.CSurf_GoStart()
   * ```
   */
  function CSurf_GoStart(): void;

  /**
   * ```
   * integer _ = reaper.CSurf_NumTracks(boolean mcpView)
   * ```
   */
  function CSurf_NumTracks(mcpView: boolean): number;

  /**
   * ```
   * reaper.CSurf_OnArrow(integer whichdir, boolean wantzoom)
   * ```
   */
  function CSurf_OnArrow(whichdir: number, wantzoom: boolean): void;

  /**
   * ```
   * reaper.CSurf_OnFwd(integer seekplay)
   * ```
   */
  function CSurf_OnFwd(seekplay: number): void;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnFXChange(MediaTrack trackid, integer en)
   * ```
   */
  function CSurf_OnFXChange(trackid: MediaTrack, en: number): boolean;

  /**
   * ```
   * integer _ = reaper.CSurf_OnInputMonitorChange(MediaTrack trackid, integer monitor)
   * ```
   */
  function CSurf_OnInputMonitorChange(
    trackid: MediaTrack,
    monitor: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.CSurf_OnInputMonitorChangeEx(MediaTrack trackid, integer monitor, boolean allowgang)
   * ```
   */
  function CSurf_OnInputMonitorChangeEx(
    trackid: MediaTrack,
    monitor: number,
    allowgang: boolean,
  ): number;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnMuteChange(MediaTrack trackid, integer mute)
   * ```
   */
  function CSurf_OnMuteChange(trackid: MediaTrack, mute: number): boolean;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnMuteChangeEx(MediaTrack trackid, integer mute, boolean allowgang)
   * ```
   */
  function CSurf_OnMuteChangeEx(
    trackid: MediaTrack,
    mute: number,
    allowgang: boolean,
  ): boolean;

  /**
   * ```
   * number _ = reaper.CSurf_OnPanChange(MediaTrack trackid, number pan, boolean relative)
   * ```
   */
  function CSurf_OnPanChange(
    trackid: MediaTrack,
    pan: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnPanChangeEx(MediaTrack trackid, number pan, boolean relative, boolean allowGang)
   * ```
   */
  function CSurf_OnPanChangeEx(
    trackid: MediaTrack,
    pan: number,
    relative: boolean,
    allowGang: boolean,
  ): number;

  /**
   * ```
   * reaper.CSurf_OnPause()
   * ```
   */
  function CSurf_OnPause(): void;

  /**
   * ```
   * reaper.CSurf_OnPlay()
   * ```
   */
  function CSurf_OnPlay(): void;

  /**
   * ```
   * reaper.CSurf_OnPlayRateChange(number playrate)
   * ```
   */
  function CSurf_OnPlayRateChange(playrate: number): void;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnRecArmChange(MediaTrack trackid, integer recarm)
   * ```
   */
  function CSurf_OnRecArmChange(trackid: MediaTrack, recarm: number): boolean;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnRecArmChangeEx(MediaTrack trackid, integer recarm, boolean allowgang)
   * ```
   */
  function CSurf_OnRecArmChangeEx(
    trackid: MediaTrack,
    recarm: number,
    allowgang: boolean,
  ): boolean;

  /**
   * ```
   * reaper.CSurf_OnRecord()
   * ```
   */
  function CSurf_OnRecord(): void;

  /**
   * ```
   * number _ = reaper.CSurf_OnRecvPanChange(MediaTrack trackid, integer recv_index, number pan, boolean relative)
   * ```
   */
  function CSurf_OnRecvPanChange(
    trackid: MediaTrack,
    recv_index: number,
    pan: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnRecvVolumeChange(MediaTrack trackid, integer recv_index, number volume, boolean relative)
   * ```
   */
  function CSurf_OnRecvVolumeChange(
    trackid: MediaTrack,
    recv_index: number,
    volume: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * reaper.CSurf_OnRew(integer seekplay)
   * ```
   */
  function CSurf_OnRew(seekplay: number): void;

  /**
   * ```
   * reaper.CSurf_OnRewFwd(integer seekplay, integer dir)
   * ```
   */
  function CSurf_OnRewFwd(seekplay: number, dir: number): void;

  /**
   * ```
   * reaper.CSurf_OnScroll(integer xdir, integer ydir)
   * ```
   */
  function CSurf_OnScroll(xdir: number, ydir: number): void;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnSelectedChange(MediaTrack trackid, integer selected)
   * ```
   */
  function CSurf_OnSelectedChange(
    trackid: MediaTrack,
    selected: number,
  ): boolean;

  /**
   * ```
   * number _ = reaper.CSurf_OnSendPanChange(MediaTrack trackid, integer send_index, number pan, boolean relative)
   * ```
   */
  function CSurf_OnSendPanChange(
    trackid: MediaTrack,
    send_index: number,
    pan: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnSendVolumeChange(MediaTrack trackid, integer send_index, number volume, boolean relative)
   * ```
   */
  function CSurf_OnSendVolumeChange(
    trackid: MediaTrack,
    send_index: number,
    volume: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnSoloChange(MediaTrack trackid, integer solo)
   * ```
   */
  function CSurf_OnSoloChange(trackid: MediaTrack, solo: number): boolean;

  /**
   * ```
   * boolean _ = reaper.CSurf_OnSoloChangeEx(MediaTrack trackid, integer solo, boolean allowgang)
   * ```
   */
  function CSurf_OnSoloChangeEx(
    trackid: MediaTrack,
    solo: number,
    allowgang: boolean,
  ): boolean;

  /**
   * ```
   * reaper.CSurf_OnStop()
   * ```
   */
  function CSurf_OnStop(): void;

  /**
   * ```
   * reaper.CSurf_OnTempoChange(number bpm)
   * ```
   */
  function CSurf_OnTempoChange(bpm: number): void;

  /**
   * ```
   * reaper.CSurf_OnTrackSelection(MediaTrack trackid)
   * ```
   */
  function CSurf_OnTrackSelection(trackid: MediaTrack): void;

  /**
   * ```
   * number _ = reaper.CSurf_OnVolumeChange(MediaTrack trackid, number volume, boolean relative)
   * ```
   */
  function CSurf_OnVolumeChange(
    trackid: MediaTrack,
    volume: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnVolumeChangeEx(MediaTrack trackid, number volume, boolean relative, boolean allowGang)
   * ```
   */
  function CSurf_OnVolumeChangeEx(
    trackid: MediaTrack,
    volume: number,
    relative: boolean,
    allowGang: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnWidthChange(MediaTrack trackid, number width, boolean relative)
   * ```
   */
  function CSurf_OnWidthChange(
    trackid: MediaTrack,
    width: number,
    relative: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.CSurf_OnWidthChangeEx(MediaTrack trackid, number width, boolean relative, boolean allowGang)
   * ```
   */
  function CSurf_OnWidthChangeEx(
    trackid: MediaTrack,
    width: number,
    relative: boolean,
    allowGang: boolean,
  ): number;

  /**
   * ```
   * reaper.CSurf_OnZoom(integer xdir, integer ydir)
   * ```
   */
  function CSurf_OnZoom(xdir: number, ydir: number): void;

  /**
   * ```
   * reaper.CSurf_ResetAllCachedVolPanStates()
   * ```
   */
  function CSurf_ResetAllCachedVolPanStates(): void;

  /**
   * ```
   * reaper.CSurf_ScrubAmt(number amt)
   * ```
   */
  function CSurf_ScrubAmt(amt: number): void;

  /**
   * ```
   * reaper.CSurf_SetAutoMode(integer mode, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetAutoMode(
    mode: number,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetPlayState(boolean play, boolean pause, boolean rec, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetPlayState(
    play: boolean,
    pause: boolean,
    rec: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetRepeatState(boolean rep, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetRepeatState(
    rep: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfaceMute(MediaTrack trackid, boolean mute, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfaceMute(
    trackid: MediaTrack,
    mute: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfacePan(MediaTrack trackid, number pan, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfacePan(
    trackid: MediaTrack,
    pan: number,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfaceRecArm(MediaTrack trackid, boolean recarm, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfaceRecArm(
    trackid: MediaTrack,
    recarm: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfaceSelected(MediaTrack trackid, boolean selected, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfaceSelected(
    trackid: MediaTrack,
    selected: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfaceSolo(MediaTrack trackid, boolean solo, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfaceSolo(
    trackid: MediaTrack,
    solo: boolean,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetSurfaceVolume(MediaTrack trackid, number volume, IReaperControlSurface ignoresurf)
   * ```
   */
  function CSurf_SetSurfaceVolume(
    trackid: MediaTrack,
    volume: number,
    ignoresurf: IReaperControlSurface,
  ): void;

  /**
   * ```
   * reaper.CSurf_SetTrackListChange()
   * ```
   */
  function CSurf_SetTrackListChange(): void;

  /**
   * ```
   * MediaTrack _ = reaper.CSurf_TrackFromID(integer idx, boolean mcpView)
   * ```
   */
  function CSurf_TrackFromID(idx: number, mcpView: boolean): MediaTrack;

  /**
   * ```
   * integer _ = reaper.CSurf_TrackToID(MediaTrack track, boolean mcpView)
   * ```
   */
  function CSurf_TrackToID(track: MediaTrack, mcpView: boolean): number;

  /**
   * ```
   * number _ = reaper.DB2SLIDER(number x)
   * ```
   */
  function DB2SLIDER(x: number): number;

  /**
   * ```
   * boolean _ = reaper.DeleteActionShortcut(KbdSectionInfo section, integer cmdID, integer shortcutidx)
   * ```
   * Delete the specific shortcut for the given command ID.
   *
   * See CountActionShortcuts, GetActionShortcutDesc, DoActionShortcutDialog.
   */
  function DeleteActionShortcut(
    section: KbdSectionInfo,
    cmdID: number,
    shortcutidx: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.DeleteEnvelopePointEx(TrackEnvelope envelope, integer autoitem_idx, integer ptidx)
   * ```
   * Delete an envelope point. If setting multiple points at once, set noSort=true, and call Envelope_SortPoints when done.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See CountEnvelopePointsEx, GetEnvelopePointEx, SetEnvelopePointEx, InsertEnvelopePointEx.
   */
  function DeleteEnvelopePointEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    ptidx: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.DeleteEnvelopePointRange(TrackEnvelope envelope, number time_start, number time_end)
   * ```
   * Delete a range of envelope points. See DeleteEnvelopePointRangeEx, DeleteEnvelopePointEx.
   */
  function DeleteEnvelopePointRange(
    envelope: TrackEnvelope,
    time_start: number,
    time_end: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.DeleteEnvelopePointRangeEx(TrackEnvelope envelope, integer autoitem_idx, number time_start, number time_end)
   * ```
   * Delete a range of envelope points. autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   */
  function DeleteEnvelopePointRangeEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    time_start: number,
    time_end: number,
  ): boolean;

  /**
   * ```
   * reaper.DeleteExtState(string section, string key, boolean persist)
   * ```
   * Delete the extended state value for a specific section and key. persist=true means the value should remain deleted the next time REAPER is opened. See SetExtState, GetExtState, HasExtState.
   */
  function DeleteExtState(section: string, key: string, persist: boolean): void;

  /**
   * ```
   * boolean _ = reaper.DeleteProjectMarker(ReaProject proj, integer markrgnindexnumber, boolean isrgn)
   * ```
   * Delete a marker.  proj==NULL for the active project.
   */
  function DeleteProjectMarker(
    proj: ReaProject,
    markrgnindexnumber: number,
    isrgn: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.DeleteProjectMarkerByIndex(ReaProject proj, integer markrgnidx)
   * ```
   * Differs from DeleteProjectMarker only in that markrgnidx is 0 for the first marker/region, 1 for the next, etc (see EnumProjectMarkers3), rather than representing the displayed marker/region ID number (see SetProjectMarker4).
   */
  function DeleteProjectMarkerByIndex(
    proj: ReaProject,
    markrgnidx: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.DeleteTakeMarker(MediaItem_Take take, integer idx)
   * ```
   * Delete a take marker. Note that idx will change for all following take markers. See GetNumTakeMarkers, GetTakeMarker, SetTakeMarker
   */
  function DeleteTakeMarker(take: MediaItem_Take, idx: number): boolean;

  /**
   * ```
   * integer _ = reaper.DeleteTakeStretchMarkers(MediaItem_Take take, integer idx, optional integer countIn)
   * ```
   * Deletes one or more stretch markers. Returns number of stretch markers deleted.
   */
  function DeleteTakeStretchMarkers(
    take: MediaItem_Take,
    idx: number,
    countIn?: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.DeleteTempoTimeSigMarker(ReaProject project, integer markerindex)
   * ```
   * Delete a tempo/time signature marker.
   */
  function DeleteTempoTimeSigMarker(
    project: ReaProject,
    markerindex: number,
  ): boolean;

  /**
   * ```
   * reaper.DeleteTrack(MediaTrack tr)
   * ```
   * deletes a track
   */
  function DeleteTrack(tr: MediaTrack): void;

  /**
   * ```
   * boolean _ = reaper.DeleteTrackMediaItem(MediaTrack tr, MediaItem it)
   * ```
   */
  function DeleteTrackMediaItem(tr: MediaTrack, it: MediaItem): boolean;

  /**
   * ```
   * reaper.DestroyAudioAccessor(AudioAccessor accessor)
   * ```
   * Destroy an audio accessor. Must only call from the main thread. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function DestroyAudioAccessor(accessor: AudioAccessor): void;

  /**
   * ```
   * boolean _ = reaper.DoActionShortcutDialog(HWND hwnd, KbdSectionInfo section, integer cmdID, integer shortcutidx)
   * ```
   * Open the action shortcut dialog to edit or add a shortcut for the given command ID. If (shortcutidx >= 0 && shortcutidx < CountActionShortcuts()), that specific shortcut will be replaced, otherwise a new shortcut will be added.
   *
   * See CountActionShortcuts, GetActionShortcutDesc, DeleteActionShortcut.
   */
  function DoActionShortcutDialog(
    hwnd: HWND,
    section: KbdSectionInfo,
    cmdID: number,
    shortcutidx: number,
  ): boolean;

  /**
   * ```
   * reaper.Dock_UpdateDockID(string ident_str, integer whichDock)
   * ```
   * updates preference for docker window ident_str to be in dock whichDock on next open
   */
  function Dock_UpdateDockID(ident_str: string, whichDock: number): void;

  /**
   * ```
   * integer _ = reaper.DockGetPosition(integer whichDock)
   * ```
   * -1=not found, 0=bottom, 1=left, 2=top, 3=right, 4=floating
   */
  function DockGetPosition(whichDock: number): number;

  /**
   * ```
   * integer retval, boolean isFloatingDocker = reaper.DockIsChildOfDock(HWND hwnd)
   * ```
   * returns dock index that contains hwnd, or -1
   */
  function DockIsChildOfDock(hwnd: HWND): LuaMultiReturn<[number, boolean]>;

  /**
   * ```
   * reaper.DockWindowActivate(HWND hwnd)
   * ```
   */
  function DockWindowActivate(hwnd: HWND): void;

  /**
   * ```
   * reaper.DockWindowAdd(HWND hwnd, string name, integer pos, boolean allowShow)
   * ```
   */
  function DockWindowAdd(
    hwnd: HWND,
    name: string,
    pos: number,
    allowShow: boolean,
  ): void;

  /**
   * ```
   * reaper.DockWindowAddEx(HWND hwnd, string name, string identstr, boolean allowShow)
   * ```
   */
  function DockWindowAddEx(
    hwnd: HWND,
    name: string,
    identstr: string,
    allowShow: boolean,
  ): void;

  /**
   * ```
   * reaper.DockWindowRefresh()
   * ```
   */
  function DockWindowRefresh(): void;

  /**
   * ```
   * reaper.DockWindowRefreshForHWND(HWND hwnd)
   * ```
   */
  function DockWindowRefreshForHWND(hwnd: HWND): void;

  /**
   * ```
   * reaper.DockWindowRemove(HWND hwnd)
   * ```
   */
  function DockWindowRemove(hwnd: HWND): void;

  /**
   * ```
   * boolean _ = reaper.EditTempoTimeSigMarker(ReaProject project, integer markerindex)
   * ```
   * Open the tempo/time signature marker editor dialog.
   */
  function EditTempoTimeSigMarker(
    project: ReaProject,
    markerindex: number,
  ): boolean;

  /**
   * ```
   * integer r_left, integer r_top, integer r_right, integer r_bot = reaper.EnsureNotCompletelyOffscreen(integer r_left, integer r_top, integer r_right, integer r_bot)
   * ```
   * call with a saved window rect for your window and it'll correct any positioning info.
   */
  function EnsureNotCompletelyOffscreen(
    r_left: number,
    r_top: number,
    r_right: number,
    r_bot: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * string _ = reaper.EnumerateFiles(string path, integer fileindex)
   * ```
   * List the files in the "path" directory. Returns NULL/nil when all files have been listed. Use fileindex = -1 to force re-read of directory (invalidate cache). See EnumerateSubdirectories
   */
  function EnumerateFiles(path: string, fileindex: number): string;

  /**
   * ```
   * string _ = reaper.EnumerateSubdirectories(string path, integer subdirindex)
   * ```
   * List the subdirectories in the "path" directory. Use subdirindex = -1 to force re-read of directory (invalidate cache). Returns NULL/nil when all subdirectories have been listed. See EnumerateFiles
   */
  function EnumerateSubdirectories(path: string, subdirindex: number): string;

  /**
   * ```
   * boolean retval, string name, string ident = reaper.EnumInstalledFX(integer index)
   * ```
   * Enumerates installed FX. Returns true if successful, sets nameOut and identOut to name and ident of FX at index.
   */
  function EnumInstalledFX(
    index: number,
  ): LuaMultiReturn<[boolean, string, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.EnumPitchShiftModes(integer mode)
   * ```
   * Start querying modes at 0, returns FALSE when no more modes possible, sets strOut to NULL if a mode is currently unsupported
   */
  function EnumPitchShiftModes(mode: number): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string _ = reaper.EnumPitchShiftSubModes(integer mode, integer submode)
   * ```
   * Returns submode name, or NULL
   */
  function EnumPitchShiftSubModes(mode: number, submode: number): string;

  /**
   * ```
   * integer retval, boolean isrgn, number pos, number rgnend, string name, integer markrgnindexnumber = reaper.EnumProjectMarkers(integer idx)
   * ```
   */
  function EnumProjectMarkers(
    idx: number,
  ): LuaMultiReturn<[number, boolean, number, number, string, number]>;

  /**
   * ```
   * integer retval, boolean isrgn, number pos, number rgnend, string name, integer markrgnindexnumber = reaper.EnumProjectMarkers2(ReaProject proj, integer idx)
   * ```
   */
  function EnumProjectMarkers2(
    proj: ReaProject,
    idx: number,
  ): LuaMultiReturn<[number, boolean, number, number, string, number]>;

  /**
   * ```
   * integer retval, boolean isrgn, number pos, number rgnend, string name, integer markrgnindexnumber, integer color = reaper.EnumProjectMarkers3(ReaProject proj, integer idx)
   * ```
   */
  function EnumProjectMarkers3(
    proj: ReaProject,
    idx: number,
  ): LuaMultiReturn<[number, boolean, number, number, string, number, number]>;

  /**
   * ```
   * ReaProject retval, optional string projfn = reaper.EnumProjects(integer idx)
   * ```
   * idx=-1 for current project,projfn can be NULL if not interested in filename. use idx 0x40000000 for currently rendering project, if any.
   */
  function EnumProjects(idx: number): LuaMultiReturn<[ReaProject, string]>;

  /**
   * ```
   * boolean retval, optional string key, optional string val = reaper.EnumProjExtState(ReaProject proj, string extname, integer idx)
   * ```
   * Enumerate the data stored with the project for a specific extname. Returns false when there is no more data. See SetProjExtState, GetProjExtState.
   */
  function EnumProjExtState(
    proj: ReaProject,
    extname: string,
    idx: number,
  ): LuaMultiReturn<[boolean, string, string]>;

  /**
   * ```
   * MediaTrack _ = reaper.EnumRegionRenderMatrix(ReaProject proj, integer regionindex, integer rendertrack)
   * ```
   * Enumerate which tracks will be rendered within this region when using the region render matrix. When called with rendertrack==0, the function returns the first track that will be rendered (which may be the master track); rendertrack==1 will return the next track rendered, and so on. The function returns NULL when there are no more tracks that will be rendered within this region.
   */
  function EnumRegionRenderMatrix(
    proj: ReaProject,
    regionindex: number,
    rendertrack: number,
  ): MediaTrack;

  /**
   * ```
   * boolean retval, string programName = reaper.EnumTrackMIDIProgramNames(integer track, integer programNumber, string programName)
   * ```
   * returns false if there are no plugins on the track that support MIDI programs,or if all programs have been enumerated
   */
  function EnumTrackMIDIProgramNames(
    track: number,
    programNumber: number,
    programName: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string programName = reaper.EnumTrackMIDIProgramNamesEx(ReaProject proj, MediaTrack track, integer programNumber, string programName)
   * ```
   * returns false if there are no plugins on the track that support MIDI programs,or if all programs have been enumerated
   */
  function EnumTrackMIDIProgramNamesEx(
    proj: ReaProject,
    track: MediaTrack,
    programNumber: number,
    programName: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer retval, number value, number dVdS, number ddVdS, number dddVdS = reaper.Envelope_Evaluate(TrackEnvelope envelope, number time, number samplerate, integer samplesRequested)
   * ```
   * Get the effective envelope value at a given time position. samplesRequested is how long the caller expects until the next call to Envelope_Evaluate (often, the buffer block size). The return value is how many samples beyond that time position that the returned values are valid. dVdS is the change in value per sample (first derivative), ddVdS is the second derivative, dddVdS is the third derivative. See GetEnvelopeScalingMode.
   */
  function Envelope_Evaluate(
    envelope: TrackEnvelope,
    time: number,
    samplerate: number,
    samplesRequested: number,
  ): LuaMultiReturn<[number, number, number, number, number]>;

  /**
   * ```
   * string buf = reaper.Envelope_FormatValue(TrackEnvelope env, number value)
   * ```
   * Formats the value of an envelope to a user-readable form
   */
  function Envelope_FormatValue(env: TrackEnvelope, value: number): string;

  /**
   * ```
   * MediaItem_Take retval, integer index, integer index2 = reaper.Envelope_GetParentTake(TrackEnvelope env)
   * ```
   * If take envelope, gets the take from the envelope. If FX, indexOut set to FX index, index2Out set to parameter index, otherwise -1.
   */
  function Envelope_GetParentTake(
    env: TrackEnvelope,
  ): LuaMultiReturn<[MediaItem_Take, number, number]>;

  /**
   * ```
   * MediaTrack retval, integer index, integer index2 = reaper.Envelope_GetParentTrack(TrackEnvelope env)
   * ```
   * If track envelope, gets the track from the envelope. If FX, indexOut set to FX index, index2Out set to parameter index, otherwise -1.
   */
  function Envelope_GetParentTrack(
    env: TrackEnvelope,
  ): LuaMultiReturn<[MediaTrack, number, number]>;

  /**
   * ```
   * boolean _ = reaper.Envelope_SortPoints(TrackEnvelope envelope)
   * ```
   * Sort envelope points by time. See SetEnvelopePoint, InsertEnvelopePoint.
   */
  function Envelope_SortPoints(envelope: TrackEnvelope): boolean;

  /**
   * ```
   * boolean _ = reaper.Envelope_SortPointsEx(TrackEnvelope envelope, integer autoitem_idx)
   * ```
   * Sort envelope points by time. autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc. See SetEnvelopePoint, InsertEnvelopePoint.
   */
  function Envelope_SortPointsEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
  ): boolean;

  /**
   * ```
   * string _ = reaper.ExecProcess(string cmdline, integer timeoutmsec)
   * ```
   * Executes command line, returns NULL on total failure, otherwise the return value, a newline, and then the output of the command. If timeoutmsec is 0, command will be allowed to run indefinitely (recommended for large amounts of returned output). timeoutmsec is -1 for no wait/terminate, -2 for no wait and minimize
   */
  function ExecProcess(cmdline: string, timeoutmsec: number): string;

  /**
   * ```
   * boolean _ = reaper.file_exists(string path)
   * ```
   * returns true if path points to a valid, readable file
   */
  function file_exists(path: string): boolean;

  /**
   * ```
   * integer _ = reaper.FindTempoTimeSigMarker(ReaProject project, number time)
   * ```
   * Find the tempo/time signature marker that falls at or before this time position (the marker that is in effect as of this time position).
   */
  function FindTempoTimeSigMarker(project: ReaProject, time: number): number;

  /**
   * ```
   * string buf = reaper.format_timestr(number tpos, string buf)
   * ```
   * Format tpos (which is time in seconds) as hh:mm:ss.sss. See format_timestr_pos, format_timestr_len.
   */
  function format_timestr(tpos: number, buf: string): string;

  /**
   * ```
   * string buf = reaper.format_timestr_len(number tpos, string buf, number offset, integer modeoverride)
   * ```
   * time formatting mode overrides: -1=proj default.
   *
   * 0=time
   *
   * 1=measures.beats + time
   *
   * 2=measures.beats
   *
   * 3=seconds
   *
   * 4=samples
   *
   * 5=h:m:s:f
   *
   * offset is start of where the length will be calculated from
   */
  function format_timestr_len(
    tpos: number,
    buf: string,
    offset: number,
    modeoverride: number,
  ): string;

  /**
   * ```
   * string buf = reaper.format_timestr_pos(number tpos, string buf, integer modeoverride)
   * ```
   * time formatting mode overrides: -1=proj default.
   *
   * 0=time
   *
   * 1=measures.beats + time
   *
   * 2=measures.beats
   *
   * 3=seconds
   *
   * 4=samples
   *
   * 5=h:m:s:f
   */
  function format_timestr_pos(
    tpos: number,
    buf: string,
    modeoverride: number,
  ): string;

  /**
   * ```
   * string gGUID = reaper.genGuid(string gGUID)
   * ```
   */
  function genGuid(gGUID: string): string;

  /**
   * ```
   * boolean retval, string buf = reaper.get_config_var_string(string name)
   * ```
   * gets ini configuration variable value as string
   */
  function get_config_var_string(
    name: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string _ = reaper.get_ini_file()
   * ```
   * Get reaper.ini full filename.
   */
  function get_ini_file(): string;

  /**
   * ```
   * boolean retval, string desc = reaper.GetActionShortcutDesc(KbdSectionInfo section, integer cmdID, integer shortcutidx)
   * ```
   * Get the text description of a specific shortcut for the given command ID.
   *
   * See CountActionShortcuts,DeleteActionShortcut,DoActionShortcutDialog.
   */
  function GetActionShortcutDesc(
    section: KbdSectionInfo,
    cmdID: number,
    shortcutidx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * MediaItem_Take _ = reaper.GetActiveTake(MediaItem item)
   * ```
   * get the active take in this item
   */
  function GetActiveTake(item: MediaItem): MediaItem_Take;

  /**
   * ```
   * integer _ = reaper.GetAllProjectPlayStates(ReaProject ignoreProject)
   * ```
   * returns the bitwise OR of all project play states (1=playing, 2=pause, 4=recording)
   */
  function GetAllProjectPlayStates(ignoreProject: ReaProject): number;

  /**
   * ```
   * string _ = reaper.GetAppVersion()
   * ```
   * Returns app version which may include an OS/arch signifier, such as: "6.17" (windows 32-bit), "6.17/x64" (windows 64-bit), "6.17/OSX64" (macOS 64-bit Intel), "6.17/OSX" (macOS 32-bit), "6.17/macOS-arm64", "6.17/linux-x86_64", "6.17/linux-i686", "6.17/linux-aarch64", "6.17/linux-armv7l", etc
   */
  function GetAppVersion(): string;

  /**
   * ```
   * integer retval, string sec = reaper.GetArmedCommand()
   * ```
   * gets the currently armed command and section name (returns 0 if nothing armed). section name is empty-string for main section.
   */
  function GetArmedCommand(): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * number _ = reaper.GetAudioAccessorEndTime(AudioAccessor accessor)
   * ```
   * Get the end time of the audio that can be returned from this accessor. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorSamples.
   */
  function GetAudioAccessorEndTime(accessor: AudioAccessor): number;

  /**
   * ```
   * string hashNeed128 = reaper.GetAudioAccessorHash(AudioAccessor accessor, string hashNeed128)
   * ```
   * Deprecated. See AudioAccessorStateChanged instead.
   * @deprecated
   */
  function GetAudioAccessorHash(
    accessor: AudioAccessor,
    hashNeed128: string,
  ): string;

  /**
   * ```
   * integer _ = reaper.GetAudioAccessorSamples(AudioAccessor accessor, integer samplerate, integer numchannels, number starttime_sec, integer numsamplesperchannel, reaper_array samplebuffer)
   * ```
   * Get a block of samples from the audio accessor. Samples are extracted immediately pre-FX, and returned interleaved (first sample of first channel, first sample of second channel...). Returns 0 if no audio, 1 if audio, -1 on error. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorStartTime, GetAudioAccessorEndTime.
   *
   *
   *
   * This function has special handling in Python, and only returns two objects, the API function return value, and the sample buffer. Example usage:
   *
   *
   *
   * tr = RPR_GetTrack(0, 0)
   *
   * aa = RPR_CreateTrackAudioAccessor(tr)
   *
   * buf = list([0]*2*1024) # 2 channels, 1024 samples each, initialized to zero
   *
   * pos = 0.0
   *
   * (ret, buf) = GetAudioAccessorSamples(aa, 44100, 2, pos, 1024, buf)
   *
   * # buf now holds the first 2*1024 audio samples from the track.
   *
   * # typically GetAudioAccessorSamples() would be called within a loop, increasing pos each time.
   */
  function GetAudioAccessorSamples(
    accessor: AudioAccessor,
    samplerate: number,
    numchannels: number,
    starttime_sec: number,
    numsamplesperchannel: number,
    samplebuffer: reaper_array,
  ): number;

  /**
   * ```
   * number _ = reaper.GetAudioAccessorStartTime(AudioAccessor accessor)
   * ```
   * Get the start time of the audio that can be returned from this accessor. See CreateTakeAudioAccessor, CreateTrackAudioAccessor, DestroyAudioAccessor, AudioAccessorStateChanged, GetAudioAccessorEndTime, GetAudioAccessorSamples.
   */
  function GetAudioAccessorStartTime(accessor: AudioAccessor): number;

  /**
   * ```
   * boolean retval, string desc = reaper.GetAudioDeviceInfo(string attribute)
   * ```
   * get information about the currently open audio device. attribute can be MODE, IDENT_IN, IDENT_OUT, BSIZE, SRATE, BPS. returns false if unknown attribute or device not open.
   */
  function GetAudioDeviceInfo(
    attribute: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.GetConfigWantsDock(string ident_str)
   * ```
   * gets the dock ID desired by ident_str, if any
   */
  function GetConfigWantsDock(ident_str: string): number;

  /**
   * ```
   * ReaProject _ = reaper.GetCurrentProjectInLoadSave()
   * ```
   * returns current project if in load/save (usually only used from project_config_extension_t)
   */
  function GetCurrentProjectInLoadSave(): ReaProject;

  /**
   * ```
   * integer _ = reaper.GetCursorContext()
   * ```
   * return the current cursor context: 0 if track panels, 1 if items, 2 if envelopes, otherwise unknown
   */
  function GetCursorContext(): number;

  /**
   * ```
   * integer _ = reaper.GetCursorContext2(boolean want_last_valid)
   * ```
   * 0 if track panels, 1 if items, 2 if envelopes, otherwise unknown (unlikely when want_last_valid is true)
   */
  function GetCursorContext2(want_last_valid: boolean): number;

  /**
   * ```
   * number _ = reaper.GetCursorPosition()
   * ```
   * edit cursor position
   */
  function GetCursorPosition(): number;

  /**
   * ```
   * number _ = reaper.GetCursorPositionEx(ReaProject proj)
   * ```
   * edit cursor position
   */
  function GetCursorPositionEx(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.GetDisplayedMediaItemColor(MediaItem item)
   * ```
   * see GetDisplayedMediaItemColor2.
   */
  function GetDisplayedMediaItemColor(item: MediaItem): number;

  /**
   * ```
   * integer _ = reaper.GetDisplayedMediaItemColor2(MediaItem item, MediaItem_Take take)
   * ```
   * Returns the custom take, item, or track color that is used (according to the user preference) to color the media item. The returned color is OS dependent|0x01000000 (i.e. ColorToNative(r,g,b)|0x01000000), so a return of zero means "no color", not black.
   */
  function GetDisplayedMediaItemColor2(
    item: MediaItem,
    take: MediaItem_Take,
  ): number;

  /**
   * ```
   * number _ = reaper.GetEnvelopeInfo_Value(TrackEnvelope env, string parmname)
   * ```
   * Gets an envelope numerical-value attribute:
   *
   * I_TCPY : int : Y offset of envelope relative to parent track (may be separate lane or overlap with track contents)
   *
   * I_TCPH : int : visible height of envelope
   *
   * I_TCPY_USED : int : Y offset of envelope relative to parent track, exclusive of padding
   *
   * I_TCPH_USED : int : visible height of envelope, exclusive of padding
   *
   * P_TRACK : MediaTrack * : parent track pointer (if any)
   *
   * P_DESTTRACK : MediaTrack * : destination track pointer, if on a send
   *
   * P_ITEM : MediaItem * : parent item pointer (if any)
   *
   * P_TAKE : MediaItem_Take * : parent take pointer (if any)
   *
   * I_SEND_IDX : int : 1-based index of send in P_TRACK, or 0 if not a send
   *
   * I_HWOUT_IDX : int : 1-based index of hardware output in P_TRACK or 0 if not a hardware output
   *
   * I_RECV_IDX : int : 1-based index of receive in P_DESTTRACK or 0 if not a send/receive
   */
  function GetEnvelopeInfo_Value(env: TrackEnvelope, parmname: string): number;

  /**
   * ```
   * boolean retval, string buf = reaper.GetEnvelopeName(TrackEnvelope env)
   * ```
   */
  function GetEnvelopeName(
    env: TrackEnvelope,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, number time, number value, integer shape, number tension, boolean selected = reaper.GetEnvelopePoint(TrackEnvelope envelope, integer ptidx)
   * ```
   * Get the attributes of an envelope point. See GetEnvelopePointEx.
   */
  function GetEnvelopePoint(
    envelope: TrackEnvelope,
    ptidx: number,
  ): LuaMultiReturn<[boolean, number, number, number, number, boolean]>;

  /**
   * ```
   * integer _ = reaper.GetEnvelopePointByTime(TrackEnvelope envelope, number time)
   * ```
   * Returns the envelope point at or immediately prior to the given time position. See GetEnvelopePointByTimeEx.
   */
  function GetEnvelopePointByTime(
    envelope: TrackEnvelope,
    time: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.GetEnvelopePointByTimeEx(TrackEnvelope envelope, integer autoitem_idx, number time)
   * ```
   * Returns the envelope point at or immediately prior to the given time position.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See GetEnvelopePointEx, SetEnvelopePointEx, InsertEnvelopePointEx, DeleteEnvelopePointEx.
   */
  function GetEnvelopePointByTimeEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    time: number,
  ): number;

  /**
   * ```
   * boolean retval, number time, number value, integer shape, number tension, boolean selected = reaper.GetEnvelopePointEx(TrackEnvelope envelope, integer autoitem_idx, integer ptidx)
   * ```
   * Get the attributes of an envelope point.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See CountEnvelopePointsEx, SetEnvelopePointEx, InsertEnvelopePointEx, DeleteEnvelopePointEx.
   */
  function GetEnvelopePointEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    ptidx: number,
  ): LuaMultiReturn<[boolean, number, number, number, number, boolean]>;

  /**
   * ```
   * integer _ = reaper.GetEnvelopeScalingMode(TrackEnvelope env)
   * ```
   * Returns the envelope scaling mode: 0=no scaling, 1=fader scaling. All API functions deal with raw envelope point values, to convert raw from/to scaled values see ScaleFromEnvelopeMode, ScaleToEnvelopeMode.
   */
  function GetEnvelopeScalingMode(env: TrackEnvelope): number;

  /**
   * ```
   * boolean retval, string str = reaper.GetEnvelopeStateChunk(TrackEnvelope env, string str, boolean isundo)
   * ```
   * Gets the RPPXML state of an envelope, returns true if successful. Undo flag is a performance/caching hint.
   */
  function GetEnvelopeStateChunk(
    env: TrackEnvelope,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.GetEnvelopeUIState(TrackEnvelope env)
   * ```
   * gets information on the UI state of an envelope: returns &1 if automation/modulation is playing back, &2 if automation is being actively written, &4 if the envelope recently had an effective automation mode change
   */
  function GetEnvelopeUIState(env: TrackEnvelope): number;

  /**
   * ```
   * string _ = reaper.GetExePath()
   * ```
   * returns path of REAPER.exe (not including EXE), i.e. C:\Program Files\REAPER
   */
  function GetExePath(): string;

  /**
   * ```
   * string _ = reaper.GetExtState(string section, string key)
   * ```
   * Get the extended state value for a specific section and key. See SetExtState, DeleteExtState, HasExtState.
   */
  function GetExtState(section: string, key: string): string;

  /**
   * ```
   * integer retval, integer tracknumber, integer itemnumber, integer fxnumber = reaper.GetFocusedFX()
   * ```
   * This function is deprecated (returns GetFocusedFX2()&3), see GetTouchedOrFocusedFX.
   * @deprecated
   */
  function GetFocusedFX(): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * integer retval, integer tracknumber, integer itemnumber, integer fxnumber = reaper.GetFocusedFX2()
   * ```
   * Return value has 1 set if track FX, 2 if take/item FX, 4 set if FX is no longer focused but still open. tracknumber==0 means the master track, 1 means track 1, etc. itemnumber is zero-based (or -1 if not an item). For interpretation of fxnumber, see GetLastTouchedFX. Deprecated, see GetTouchedOrFocusedFX
   * @deprecated
   */
  function GetFocusedFX2(): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.GetFreeDiskSpaceForRecordPath(ReaProject proj, integer pathidx)
   * ```
   * returns free disk space in megabytes, pathIdx 0 for normal, 1 for alternate.
   */
  function GetFreeDiskSpaceForRecordPath(
    proj: ReaProject,
    pathidx: number,
  ): number;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetFXEnvelope(MediaTrack track, integer fxindex, integer parameterindex, boolean create)
   * ```
   * Returns the FX parameter envelope. If the envelope does not exist and create=true, the envelope will be created. If the envelope already exists and is bypassed and create=true, then the envelope will be unbypassed.
   */
  function GetFXEnvelope(
    track: MediaTrack,
    fxindex: number,
    parameterindex: number,
    create: boolean,
  ): TrackEnvelope;

  /**
   * ```
   * integer _ = reaper.GetGlobalAutomationOverride()
   * ```
   * return -1=no override, 0=trim/read, 1=read, 2=touch, 3=write, 4=latch, 5=bypass
   */
  function GetGlobalAutomationOverride(): number;

  /**
   * ```
   * number _ = reaper.GetHZoomLevel()
   * ```
   * returns pixels/second
   */
  function GetHZoomLevel(): number;

  /**
   * ```
   * number _ = reaper.GetInputActivityLevel(integer input_id)
   * ```
   * returns approximate input level if available, 0-511 mono inputs, |1024 for stereo pairs, 4096+devidx*32 for MIDI devices
   */
  function GetInputActivityLevel(input_id: number): number;

  /**
   * ```
   * string _ = reaper.GetInputChannelName(integer channelIndex)
   * ```
   */
  function GetInputChannelName(channelIndex: number): string;

  /**
   * ```
   * integer inputlatency, integer outputLatency = reaper.GetInputOutputLatency()
   * ```
   * Gets the audio device input/output latency in samples
   */
  function GetInputOutputLatency(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number num, PCM_source which_item, integer flags = reaper.GetItemEditingTime2()
   * ```
   * returns time of relevant edit, set which_item to the pcm_source (if applicable), flags (if specified) will be set to 1 for edge resizing, 2 for fade change, 4 for item move, 8 for item slip edit (edit cursor time or start of item)
   */
  function GetItemEditingTime2(): LuaMultiReturn<[number, PCM_source, number]>;

  /**
   * ```
   * MediaItem med, MediaItem_Take take = reaper.GetItemFromPoint(integer screen_x, integer screen_y, boolean allow_locked)
   * ```
   * Returns the first item at the screen coordinates specified. If allow_locked is false, locked items are ignored. If takeOutOptional specified, returns the take hit. See GetThingFromPoint.
   */
  function GetItemFromPoint(
    screen_x: number,
    screen_y: number,
    allow_locked: boolean,
  ): LuaMultiReturn<[MediaItem, MediaItem_Take]>;

  /**
   * ```
   * ReaProject _ = reaper.GetItemProjectContext(MediaItem item)
   * ```
   */
  function GetItemProjectContext(item: MediaItem): ReaProject;

  /**
   * ```
   * boolean retval, string str = reaper.GetItemStateChunk(MediaItem item, string str, boolean isundo)
   * ```
   * Gets the RPPXML state of an item, returns true if successful. Undo flag is a performance/caching hint.
   */
  function GetItemStateChunk(
    item: MediaItem,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string _ = reaper.GetLastColorThemeFile()
   * ```
   */
  function GetLastColorThemeFile(): string;

  /**
   * ```
   * integer markeridx, integer regionidx = reaper.GetLastMarkerAndCurRegion(ReaProject proj, number time)
   * ```
   * Get the last project marker before time, and/or the project region that includes time. markeridx and regionidx are returned not necessarily as the displayed marker/region index, but as the index that can be passed to EnumProjectMarkers. Either or both of markeridx and regionidx may be NULL. See EnumProjectMarkers.
   */
  function GetLastMarkerAndCurRegion(
    proj: ReaProject,
    time: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean retval, integer tracknumber, integer fxnumber, integer paramnumber = reaper.GetLastTouchedFX()
   * ```
   * Returns true if the last touched FX parameter is valid, false otherwise. The low word of tracknumber is the 1-based track index -- 0 means the master track, 1 means track 1, etc. If the high word of tracknumber is nonzero, it refers to the 1-based item index (1 is the first item on the track, etc). For track FX, the low 24 bits of fxnumber refer to the FX index in the chain, and if the next 8 bits are 01, then the FX is record FX. For item FX, the low word defines the FX index in the chain, and the high word defines the take number. Deprecated, see GetTouchedOrFocusedFX.
   * @deprecated
   */
  function GetLastTouchedFX(): LuaMultiReturn<
    [boolean, number, number, number]
  >;

  /**
   * ```
   * MediaTrack _ = reaper.GetLastTouchedTrack()
   * ```
   */
  function GetLastTouchedTrack(): MediaTrack | null;

  /**
   * ```
   * HWND _ = reaper.GetMainHwnd()
   * ```
   */
  function GetMainHwnd(): HWND;

  /**
   * ```
   * integer _ = reaper.GetMasterMuteSoloFlags()
   * ```
   * &1=master mute,&2=master solo. This is deprecated as you can just query the master track as well.
   * @deprecated
   */
  function GetMasterMuteSoloFlags(): number;

  function GetMasterTrack(proj: ReaProject): MediaTrack;

  /**
   * ```
   * integer _ = reaper.GetMasterTrackVisibility()
   * ```
   * returns &1 if the master track is visible in the TCP, &2 if NOT visible in the mixer. See SetMasterTrackVisibility.
   */
  function GetMasterTrackVisibility(): number;

  /**
   * ```
   * integer _ = reaper.GetMaxMidiInputs()
   * ```
   * returns max dev for midi inputs/outputs
   */
  function GetMaxMidiInputs(): number;

  /**
   * ```
   * integer _ = reaper.GetMaxMidiOutputs()
   * ```
   */
  function GetMaxMidiOutputs(): number;

  /**
   * ```
   * integer retval, string buf = reaper.GetMediaFileMetadata(PCM_source mediaSource, string identifier)
   * ```
   * Get text-based metadata from a media file for a given identifier. Call with identifier="" to list all identifiers contained in the file, separated by newlines. May return "[Binary data]" for metadata that REAPER doesn't handle.
   */
  function GetMediaFileMetadata(
    mediaSource: PCM_source,
    identifier: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * MediaItem _ = reaper.GetMediaItem(ReaProject proj, integer itemidx)
   * ```
   * get an item from a project by item count (zero-based) (proj=0 for active project)
   */
  function GetMediaItem(proj: ReaProject, itemidx: number): MediaItem;

  /**
   * ```
   * MediaTrack _ = reaper.GetMediaItem_Track(MediaItem item)
   * ```
   * Get parent track of media item
   */
  function GetMediaItem_Track(item: MediaItem): MediaTrack;

  /**
   * ```
   * number _ = reaper.GetMediaItemInfo_Value(MediaItem item, string parmname)
   * ```
   * Get media item numerical-value attributes.
   *
   * B_MUTE : bool * : muted (item solo overrides). setting this value will clear C_MUTE_SOLO.
   *
   * B_MUTE_ACTUAL : bool * : muted (ignores solo). setting this value will not affect C_MUTE_SOLO.
   *
   * C_LANEPLAYS : char * : on fixed lane tracks, 0=this item lane does not play, 1=this item lane plays exclusively, 2=this item lane plays and other lanes also play, -1=this item is on a non-visible, non-playing lane on a formerly fixed-lane track (read-only)
   *
   * C_MUTE_SOLO : char * : solo override (-1=soloed, 0=no override, 1=unsoloed). note that this API does not automatically unsolo other items when soloing (nor clear the unsolos when clearing the last soloed item), it must be done by the caller via action or via this API.
   *
   * B_LOOPSRC : bool * : loop source
   *
   * B_ALLTAKESPLAY : bool * : all takes play
   *
   * B_UISEL : bool * : selected in arrange view
   *
   * C_BEATATTACHMODE : char * : item timebase, -1=track or project default, 1=beats (position, length, rate), 2=beats (position only). for auto-stretch timebase: C_BEATATTACHMODE=1, C_AUTOSTRETCH=1
   *
   * C_AUTOSTRETCH: : char * : auto-stretch at project tempo changes, 1=enabled, requires C_BEATATTACHMODE=1
   *
   * C_LOCK : char * : locked, &1=locked
   *
   * D_VOL : double * : item volume,  0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc
   *
   * D_POSITION : double * : item position in seconds
   *
   * D_LENGTH : double * : item length in seconds
   *
   * D_SNAPOFFSET : double * : item snap offset in seconds
   *
   * D_FADEINLEN : double * : item manual fadein length in seconds
   *
   * D_FADEOUTLEN : double * : item manual fadeout length in seconds
   *
   * D_FADEINDIR : double * : item fadein curvature, -1..1
   *
   * D_FADEOUTDIR : double * : item fadeout curvature, -1..1
   *
   * D_FADEINLEN_AUTO : double * : item auto-fadein length in seconds, -1=no auto-fadein
   *
   * D_FADEOUTLEN_AUTO : double * : item auto-fadeout length in seconds, -1=no auto-fadeout
   *
   * C_FADEINSHAPE : int * : fadein shape, 0..6, 0=linear
   *
   * C_FADEOUTSHAPE : int * : fadeout shape, 0..6, 0=linear
   *
   * I_GROUPID : int * : group ID, 0=no group
   *
   * I_LASTY : int * : Y-position (relative to top of track) in pixels (read-only)
   *
   * I_LASTH : int * : height in pixels (read-only)
   *
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   *
   * I_CURTAKE : int * : active take number
   *
   * IP_ITEMNUMBER : int : item number on this track (read-only, returns the item number directly)
   *
   * F_FREEMODE_Y : float * : free item positioning or fixed lane Y-position. 0=top of track, 1.0=bottom of track
   *
   * F_FREEMODE_H : float * : free item positioning or fixed lane height. 0.5=half the track height, 1.0=full track height
   *
   * I_FIXEDLANE : int * : fixed lane of item (fine to call with setNewValue, but returned value is read-only)
   *
   * B_FIXEDLANE_HIDDEN : bool * : true if displaying only one fixed lane and this item is in a different lane (read-only)
   *
   * P_TRACK : MediaTrack * : (read-only)
   */
  function GetMediaItemInfo_Value(item: MediaItem, parmname: string): number;

  /**
   * ```
   * integer _ = reaper.GetMediaItemNumTakes(MediaItem item)
   * ```
   */
  function GetMediaItemNumTakes(item: MediaItem): number;

  /**
   * ```
   * MediaItem_Take _ = reaper.GetMediaItemTake(MediaItem item, integer tk)
   * ```
   */
  function GetMediaItemTake(item: MediaItem, tk: number): MediaItem_Take;

  /**
   * ```
   * MediaItem _ = reaper.GetMediaItemTake_Item(MediaItem_Take take)
   * ```
   * Get parent item of media item take
   */
  function GetMediaItemTake_Item(take: MediaItem_Take): MediaItem;

  /**
   * ```
   * integer _ = reaper.GetMediaItemTake_Peaks(MediaItem_Take take, number peakrate, number starttime, integer numchannels, integer numsamplesperchannel, integer want_extra_type, reaper_array buf)
   * ```
   * Gets block of peak samples to buf. Note that the peak samples are interleaved, but in two or three blocks (maximums, then minimums, then extra). Return value has 20 bits of returned sample count, then 4 bits of output_mode (0xf00000), then a bit to signify whether extra_type was available (0x1000000). extra_type can be 115 ('s') for spectral information, which will return peak samples as integers with the low 15 bits frequency, next 14 bits tonality.
   */
  function GetMediaItemTake_Peaks(
    take: MediaItem_Take,
    peakrate: number,
    starttime: number,
    numchannels: number,
    numsamplesperchannel: number,
    want_extra_type: number,
    buf: reaper_array,
  ): number;

  /**
   * ```
   * PCM_source _ = reaper.GetMediaItemTake_Source(MediaItem_Take take)
   * ```
   * Get media source of media item take
   */
  function GetMediaItemTake_Source(take: MediaItem_Take): PCM_source;

  /**
   * ```
   * MediaTrack _ = reaper.GetMediaItemTake_Track(MediaItem_Take take)
   * ```
   * Get parent track of media item take
   */
  function GetMediaItemTake_Track(take: MediaItem_Take): MediaTrack;

  /**
   * ```
   * MediaItem_Take _ = reaper.GetMediaItemTakeByGUID(ReaProject project, string guidGUID)
   * ```
   */
  function GetMediaItemTakeByGUID(
    project: ReaProject,
    guidGUID: string,
  ): MediaItem_Take;

  /**
   * ```
   * number _ = reaper.GetMediaItemTakeInfo_Value(MediaItem_Take take, string parmname)
   * ```
   * Get media item take numerical-value attributes.
   *
   * D_STARTOFFS : double * : start offset in source media, in seconds
   *
   * D_VOL : double * : take volume, 0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc, negative if take polarity is flipped
   *
   * D_PAN : double * : take pan, -1..1
   *
   * D_PANLAW : double * : take pan law, -1=default, 0.5=-6dB, 1.0=+0dB, etc
   *
   * D_PLAYRATE : double * : take playback rate, 0.5=half speed, 1=normal, 2=double speed, etc
   *
   * D_PITCH : double * : take pitch adjustment in semitones, -12=one octave down, 0=normal, +12=one octave up, etc
   *
   * B_PPITCH : bool * : preserve pitch when changing playback rate
   *
   * I_LASTY : int * : Y-position (relative to top of track) in pixels (read-only)
   *
   * I_LASTH : int * : height in pixels (read-only)
   *
   * I_CHANMODE : int * : channel mode, 0=normal, 1=reverse stereo, 2=downmix, 3=left, 4=right
   *
   * I_PITCHMODE : int * : pitch shifter mode, -1=project default, otherwise high 2 bytes=shifter, low 2 bytes=parameter
   *
   * I_STRETCHFLAGS : int * : stretch marker flags (&7 mask for mode override: 0=default, 1=balanced, 2/3/6=tonal, 4=transient, 5=no pre-echo)
   *
   * F_STRETCHFADESIZE : float * : stretch marker fade size in seconds (0.0025 default)
   *
   * I_RECPASSID : int * : record pass ID
   *
   * I_TAKEFX_NCH : int * : number of internal audio channels for per-take FX to use (OK to call with setNewValue, but the returned value is read-only)
   *
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   *
   * IP_TAKENUMBER : int : take number (read-only, returns the take number directly)
   *
   * P_TRACK : pointer to MediaTrack (read-only)
   *
   * P_ITEM : pointer to MediaItem (read-only)
   *
   * P_SOURCE : PCM_source *. Note that if setting this, you should first retrieve the old source, set the new, THEN delete the old.
   */
  function GetMediaItemTakeInfo_Value(
    take: MediaItem_Take,
    parmname: string,
  ): number;

  /**
   * ```
   * MediaTrack _ = reaper.GetMediaItemTrack(MediaItem item)
   * ```
   */
  function GetMediaItemTrack(item: MediaItem): MediaTrack;

  /**
   * ```
   * string filenamebuf = reaper.GetMediaSourceFileName(PCM_source source)
   * ```
   * Copies the media source filename to filenamebuf. Note that in-project MIDI media sources have no associated filename. See GetMediaSourceParent.
   */
  function GetMediaSourceFileName(source: PCM_source): string;

  /**
   * ```
   * number retval, boolean lengthIsQN = reaper.GetMediaSourceLength(PCM_source source)
   * ```
   * Returns the length of the source media. If the media source is beat-based, the length will be in quarter notes, otherwise it will be in seconds.
   */
  function GetMediaSourceLength(
    source: PCM_source,
  ): LuaMultiReturn<[number, boolean]>;

  /**
   * ```
   * integer _ = reaper.GetMediaSourceNumChannels(PCM_source source)
   * ```
   * Returns the number of channels in the source media.
   */
  function GetMediaSourceNumChannels(source: PCM_source): number;

  /**
   * ```
   * PCM_source _ = reaper.GetMediaSourceParent(PCM_source src)
   * ```
   * Returns the parent source, or NULL if src is the root source. This can be used to retrieve the parent properties of sections or reversed sources for example.
   */
  function GetMediaSourceParent(src: PCM_source): PCM_source | null;

  /**
   * ```
   * integer _ = reaper.GetMediaSourceSampleRate(PCM_source source)
   * ```
   * Returns the sample rate. MIDI source media will return zero.
   */
  function GetMediaSourceSampleRate(source: PCM_source): number;

  /**
   * ```
   * string typebuf = reaper.GetMediaSourceType(PCM_source source)
   * ```
   * copies the media source type ("WAV", "MIDI", etc) to typebuf
   */
  function GetMediaSourceType(source: PCM_source): string;

  /**
   * Get track numerical-value attributes.
   *
   * ```
   * B_MUTE : bool * : muted
   * B_PHASE : bool * : track phase inverted
   * B_RECMON_IN_EFFECT : bool * : record monitoring in effect (current audio-thread playback state, read-only)
   * IP_TRACKNUMBER : int : track number 1-based, 0=not found, -1=master track (read-only, returns the int directly)
   * I_SOLO : int * : soloed, 0=not soloed, 1=soloed, 2=soloed in place, 5=safe soloed, 6=safe soloed in place
   * B_SOLO_DEFEAT : bool * : when set, if anything else is soloed and this track is not muted, this track acts soloed
   * I_FXEN : int * : fx enabled, 0=bypassed, !0=fx active
   * I_RECARM : int * : record armed, 0=not record armed, 1=record armed
   * I_RECINPUT : int * : record input, <0=no input. if 4096 set, input is MIDI and low 5 bits represent channel (0=all, 1-16=only chan), next 6 bits represent physical input (63=all, 62=VKB). If 4096 is not set, low 10 bits (0..1023) are input start channel (ReaRoute/Loopback start at 512). If 2048 is set, input is multichannel input (using track channel count), or if 1024 is set, input is stereo input, otherwise input is mono.
   * I_RECMODE : int * : record mode, 0=input, 1=stereo out, 2=none, 3=stereo out w/latency compensation, 4=midi output, 5=mono out, 6=mono out w/ latency compensation, 7=midi overdub, 8=midi replace
   * I_RECMODE_FLAGS : int * : record mode flags, &3=output recording mode (0=post fader, 1=pre-fx, 2=post-fx/pre-fader)
   * I_RECMON : int * : record monitoring, 0=off, 1=normal, 2=not when playing (tape style)
   * I_RECMONITEMS : int * : monitor items while recording, 0=off, 1=on
   * B_AUTO_RECARM : bool * : automatically set record arm when selected (does not immediately affect recarm state, script should set directly if desired)
   * I_VUMODE : int * : track vu mode, &1:disabled, &30==0:stereo peaks, &30==2:multichannel peaks, &30==4:stereo RMS, &30==8:combined RMS, &30==12:LUFS-M, &30==16:LUFS-S (readout=max), &30==20:LUFS-S (readout=current), &32:LUFS calculation on channels 1+2 only
   * I_AUTOMODE : int * : track automation mode, 0=trim/off, 1=read, 2=touch, 3=write, 4=latch
   * I_NCHAN : int * : number of track channels, 2-128, even numbers only
   * I_SELECTED : int * : track selected, 0=unselected, 1=selected
   * I_WNDH : int * : current TCP window height in pixels including envelopes (read-only)
   * I_TCPH : int * : current TCP window height in pixels not including envelopes (read-only)
   * I_TCPY : int * : current TCP window Y-position in pixels relative to top of arrange view (read-only)
   * I_MCPX : int * : current MCP X-position in pixels relative to mixer container (read-only)
   * I_MCPY : int * : current MCP Y-position in pixels relative to mixer container (read-only)
   * I_MCPW : int * : current MCP width in pixels (read-only)
   * I_MCPH : int * : current MCP height in pixels (read-only)
   * I_FOLDERDEPTH : int * : folder depth change, 0=normal, 1=track is a folder parent, -1=track is the last in the innermost folder, -2=track is the last in the innermost and next-innermost folders, etc
   * I_FOLDERCOMPACT : int * : folder collapsed state (only valid on folders), 0=normal, 1=collapsed, 2=fully collapsed
   * I_MIDIHWOUT : int * : track midi hardware output index, <0=disabled, low 5 bits are which channels (0=all, 1-16), next 5 bits are output device index (0-31)
   * I_MIDI_INPUT_CHANMAP : int * : -1 maps to source channel, otherwise 1-16 to map to MIDI channel
   * I_MIDI_CTL_CHAN : int * : -1 no link, 0-15 link to MIDI volume/pan on channel, 16 link to MIDI volume/pan on all channels
   * I_MIDI_TRACKSEL_FLAG : int * : MIDI editor track list options: &1=expand media items, &2=exclude from list, &4=auto-pruned
   * I_PERFFLAGS : int * : track performance flags, &1=no media buffering, &2=no anticipative FX
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   * I_HEIGHTOVERRIDE : int * : custom height override for TCP window, 0 for none, otherwise size in pixels
   * I_SPACER : int * : 1=TCP track spacer above this trackB_HEIGHTLOCK : bool * : track height lock (must set I_HEIGHTOVERRIDE before locking)
   * D_VOL : double * : trim volume of track, 0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc
   * D_PAN : double * : trim pan of track, -1..1
   * D_WIDTH : double * : width of track, -1..1
   * D_DUALPANL : double * : dualpan position 1, -1..1, only if I_PANMODE==6
   * D_DUALPANR : double * : dualpan position 2, -1..1, only if I_PANMODE==6
   * I_PANMODE : int * : pan mode, 0=classic 3.x, 3=new balance, 5=stereo pan, 6=dual pan
   * D_PANLAW : double * : pan law of track, <0=project default, 0.5=-6dB, 0.707..=-3dB, 1=+0dB, 1.414..=-3dB with gain compensation, 2=-6dB with gain compensation, etc
   * I_PANLAW_FLAGS : int * : pan law flags, 0=sine taper, 1=hybrid taper with deprecated behavior when gain compensation enabled, 2=linear taper, 3=hybrid taper
   * P_ENV:<envchunkname or P_ENV:{GUID... : TrackEnvelope * : (read-only) chunkname can be <VOLENV, <PANENV, etc; GUID is the stringified envelope GUID.
   * B_SHOWINMIXER : bool * : track control panel visible in mixer (do not use on master track)
   * B_SHOWINTCP : bool * : track control panel visible in arrange view (do not use on master track)
   * B_MAINSEND : bool * : track sends audio to parent
   * C_MAINSEND_OFFS : char * : channel offset of track send to parent
   * C_MAINSEND_NCH : char * : channel count of track send to parent (0=use all child track channels, 1=use one channel only)
   * I_FREEMODE : int * : 1=track free item positioning enabled, 2=track fixed lanes enabled (call UpdateTimeline() after changing)
   * I_NUMFIXEDLANES : int * : number of track fixed lanes (fine to call with setNewValue, but returned value is read-only)
   * C_LANESCOLLAPSED : char * : fixed lane collapse state (1=lanes collapsed, 2=track displays as non-fixed-lanes but hidden lanes exist)
   * C_LANESETTINGS : char * : fixed lane settings (&1=auto-remove empty lanes at bottom, &2=do not auto-comp new recording, &4=newly recorded lanes play exclusively (else add lanes in layers), &8=big lanes (else small lanes), &16=add new recording at bottom (else record into first available lane), &32=hide lane buttons
   * C_LANEPLAYS:N : char * :  on fixed lane tracks, 0=lane N does not play, 1=lane N plays exclusively, 2=lane N plays and other lanes also play (fine to call with setNewValue, but returned value is read-only)
   * C_ALLLANESPLAY : char * : on fixed lane tracks, 0=no lanes play, 1=all lanes play, 2=some lanes play (fine to call with setNewValue 0 or 1, but returned value is read-only)
   * C_BEATATTACHMODE : char * : track timebase, -1=project default, 0=time, 1=beats (position, length, rate), 2=beats (position only)
   * F_MCP_FXSEND_SCALE : float * : scale of fx+send area in MCP (0=minimum allowed, 1=maximum allowed)
   * F_MCP_FXPARM_SCALE : float * : scale of fx parameter area in MCP (0=minimum allowed, 1=maximum allowed)
   * F_MCP_SENDRGN_SCALE : float * : scale of send area as proportion of the fx+send total area (0=minimum allowed, 1=maximum allowed)
   * F_TCP_FXPARM_SCALE : float * : scale of TCP parameter area when TCP FX are embedded (0=min allowed, default, 1=max allowed)
   * I_PLAY_OFFSET_FLAG : int * : track media playback offset state, &1=bypassed, &2=offset value is measured in samples (otherwise measured in seconds)
   * D_PLAY_OFFSET : double * : track media playback offset, units depend on I_PLAY_OFFSET_FLAG
   * P_PARTRACK : MediaTrack * : parent track (read-only)
   * P_PROJECT : ReaProject * : parent project (read-only)
   * ```
   */
  function GetMediaTrackInfo_Value(tr: MediaTrack, parmname: string): number;
  function GetMediaTrackInfo_Value(
    tr: MediaTrack,
    parmname: "P_PARTRACK",
  ): MediaTrack;

  /**
   * ```
   * boolean retval, string nameout = reaper.GetMIDIInputName(integer dev, string nameout)
   * ```
   * returns true if device present
   */
  function GetMIDIInputName(
    dev: number,
    nameout: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string nameout = reaper.GetMIDIOutputName(integer dev, string nameout)
   * ```
   * returns true if device present
   */
  function GetMIDIOutputName(
    dev: number,
    nameout: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * MediaTrack _ = reaper.GetMixerScroll()
   * ```
   * Get the leftmost track visible in the mixer
   */
  function GetMixerScroll(): MediaTrack;

  /**
   * ```
   * string action = reaper.GetMouseModifier(string context, integer modifier_flag)
   * ```
   * Get the current mouse modifier assignment for a specific modifier key assignment, in a specific context.
   *
   * action will be filled in with the command ID number for a built-in mouse modifier
   *
   * or built-in REAPER command ID, or the custom action ID string.
   *
   * Note: the action string may have a space and 'c' or 'm' appended to it to specify command ID vs mouse modifier ID.
   *
   * See SetMouseModifier for more information.
   */
  function GetMouseModifier(context: string, modifier_flag: number): string;

  /**
   * ```
   * integer x, integer y = reaper.GetMousePosition()
   * ```
   * get mouse position in screen coordinates
   */
  function GetMousePosition(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.GetNumAudioInputs()
   * ```
   * Return number of normal audio hardware inputs available
   */
  function GetNumAudioInputs(): number;

  /**
   * ```
   * integer _ = reaper.GetNumAudioOutputs()
   * ```
   * Return number of normal audio hardware outputs available
   */
  function GetNumAudioOutputs(): number;

  /**
   * ```
   * integer _ = reaper.GetNumMIDIInputs()
   * ```
   * returns max number of real midi hardware inputs
   */
  function GetNumMIDIInputs(): number;

  /**
   * ```
   * integer _ = reaper.GetNumMIDIOutputs()
   * ```
   * returns max number of real midi hardware outputs
   */
  function GetNumMIDIOutputs(): number;

  /**
   * ```
   * integer _ = reaper.GetNumTakeMarkers(MediaItem_Take take)
   * ```
   * Returns number of take markers. See GetTakeMarker, SetTakeMarker, DeleteTakeMarker
   */
  function GetNumTakeMarkers(take: MediaItem_Take): number;

  /**
   * ```
   * integer _ = reaper.GetNumTracks()
   * ```
   * Returns number of tracks in current project, see CountTracks()
   */
  function GetNumTracks(): number;

  /** Returns "Win32", "Win64", "OSX32", "OSX64", "macOS-arm64", or "Other". */
  function GetOS(): import("./enums").OSType;

  /**
   * ```
   * string _ = reaper.GetOutputChannelName(integer channelIndex)
   * ```
   */
  function GetOutputChannelName(channelIndex: number): string;

  /**
   * ```
   * number _ = reaper.GetOutputLatency()
   * ```
   * returns output latency in seconds
   */
  function GetOutputLatency(): number;

  /**
   * ```
   * MediaTrack _ = reaper.GetParentTrack(MediaTrack track)
   * ```
   */
  function GetParentTrack(track: MediaTrack): MediaTrack | null;

  /**
   * ```
   * string buf = reaper.GetPeakFileName(string fn)
   * ```
   * get the peak file name for a given file (can be either filename.reapeaks,or a hashed filename in another path)
   */
  function GetPeakFileName(fn: string): string;

  /**
   * ```
   * string buf = reaper.GetPeakFileNameEx(string fn, string buf, boolean forWrite)
   * ```
   * get the peak file name for a given file (can be either filename.reapeaks,or a hashed filename in another path)
   */
  function GetPeakFileNameEx(
    fn: string,
    buf: string,
    forWrite: boolean,
  ): string;

  /**
   * ```
   * string buf = reaper.GetPeakFileNameEx2(string fn, string buf, boolean forWrite, string peaksfileextension)
   * ```
   * Like GetPeakFileNameEx, but you can specify peaksfileextension such as ".reapeaks"
   */
  function GetPeakFileNameEx2(
    fn: string,
    buf: string,
    forWrite: boolean,
    peaksfileextension: string,
  ): string;

  /**
   * ```
   * number _ = reaper.GetPlayPosition()
   * ```
   * returns latency-compensated actual-what-you-hear position
   */
  function GetPlayPosition(): number;

  /**
   * ```
   * number _ = reaper.GetPlayPosition2()
   * ```
   * returns position of next audio block being processed
   */
  function GetPlayPosition2(): number;

  /**
   * ```
   * number _ = reaper.GetPlayPosition2Ex(ReaProject proj)
   * ```
   * returns position of next audio block being processed
   */
  function GetPlayPosition2Ex(proj: ReaProject): number;

  /**
   * ```
   * number _ = reaper.GetPlayPositionEx(ReaProject proj)
   * ```
   * returns latency-compensated actual-what-you-hear position
   */
  function GetPlayPositionEx(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.GetPlayState()
   * ```
   * &1=playing, &2=paused, &4=is recording
   */
  function GetPlayState(): number;

  /**
   * ```
   * integer _ = reaper.GetPlayStateEx(ReaProject proj)
   * ```
   * &1=playing, &2=paused, &4=is recording
   */
  function GetPlayStateEx(proj: ReaProject): number;

  /**
   * ```
   * number _ = reaper.GetProjectLength(ReaProject proj)
   * ```
   * returns length of project (maximum of end of media item, markers, end of regions, tempo map
   */
  function GetProjectLength(proj: ReaProject): number;

  /**
   * ```
   * string buf = reaper.GetProjectName(ReaProject proj)
   * ```
   */
  function GetProjectName(proj: ReaProject): string;

  /**
   * ```
   * string buf = reaper.GetProjectPath()
   * ```
   * Get the project recording path.
   */
  function GetProjectPath(): string;

  /**
   * ```
   * string buf = reaper.GetProjectPathEx(ReaProject proj)
   * ```
   * Get the project recording path.
   */
  function GetProjectPathEx(proj: ReaProject): string;

  /**
   * ```
   * integer _ = reaper.GetProjectStateChangeCount(ReaProject proj)
   * ```
   * returns an integer that changes when the project state changes
   */
  function GetProjectStateChangeCount(proj: ReaProject): number;

  /**
   * ```
   * number _ = reaper.GetProjectTimeOffset(ReaProject proj, boolean rndframe)
   * ```
   * Gets project time offset in seconds (project settings - project start time). If rndframe is true, the offset is rounded to a multiple of the project frame size.
   */
  function GetProjectTimeOffset(proj: ReaProject, rndframe: boolean): number;

  /**
   * ```
   * number bpm, number bpi = reaper.GetProjectTimeSignature()
   * ```
   * deprecated
   * @deprecated
   */
  function GetProjectTimeSignature(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number bpm, number bpi = reaper.GetProjectTimeSignature2(ReaProject proj)
   * ```
   * Gets basic time signature (beats per minute, numerator of time signature in bpi)
   *
   * this does not reflect tempo envelopes but is purely what is set in the project settings.
   */
  function GetProjectTimeSignature2(
    proj: ReaProject,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer retval, string val = reaper.GetProjExtState(ReaProject proj, string extname, string key)
   * ```
   * Get the value previously associated with this extname and key, the last time the project was saved. See SetProjExtState, EnumProjExtState.
   */
  function GetProjExtState(
    proj: ReaProject,
    extname: string,
    key: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * string _ = reaper.GetResourcePath()
   * ```
   * returns path where ini files are stored, other things are in subdirectories.
   */
  function GetResourcePath(): string;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetSelectedEnvelope(ReaProject proj)
   * ```
   * get the currently selected envelope, returns NULL/nil if no envelope is selected
   */
  function GetSelectedEnvelope(proj: ReaProject): TrackEnvelope;

  /**
   * ```
   * MediaItem _ = reaper.GetSelectedMediaItem(ReaProject proj, integer selitem)
   * ```
   * Discouraged, because GetSelectedMediaItem can be inefficient if media items are added, rearranged, or deleted in between calls. Instead see CountMediaItems, GetMediaItem, IsMediaItemSelected.
   */
  function GetSelectedMediaItem(proj: ReaProject, selitem: number): MediaItem;

  /**
   * ```
   * MediaTrack _ = reaper.GetSelectedTrack(ReaProject proj, integer seltrackidx)
   * ```
   * Get a selected track from a project (proj=0 for active project) by selected track count (zero-based). This function ignores the master track, see GetSelectedTrack2.
   */
  function GetSelectedTrack(proj: ReaProject, seltrackidx: number): MediaTrack;

  /** Get a selected track from a project (proj=0 for active project) by selected track count (zero-based). */
  function GetSelectedTrack2(
    proj: ReaProject,
    seltrackidx: number,
    wantmaster: boolean,
  ): MediaTrack | null;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetSelectedTrackEnvelope(ReaProject proj)
   * ```
   * get the currently selected track envelope, returns NULL/nil if no envelope is selected
   */
  function GetSelectedTrackEnvelope(proj: ReaProject): TrackEnvelope;

  /**
   * ```
   * number start_time, number end_time = reaper.GetSet_ArrangeView2(ReaProject proj, boolean isSet, integer screen_x_start, integer screen_x_end, number start_time, number end_time)
   * ```
   * Gets or sets the arrange view start/end time for screen coordinates. use screen_x_start=screen_x_end=0 to use the full arrange view's start/end time
   */
  function GetSet_ArrangeView2(
    proj: ReaProject,
    isSet: boolean,
    screen_x_start: number,
    screen_x_end: number,
    start_time: number,
    end_time: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number start, number _end = reaper.GetSet_LoopTimeRange(boolean isSet, boolean isLoop, number start, number _end, boolean allowautoseek)
   * ```
   */
  function GetSet_LoopTimeRange(
    isSet: boolean,
    isLoop: boolean,
    start: number,
    _end: number,
    allowautoseek: boolean,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number start, number _end = reaper.GetSet_LoopTimeRange2(ReaProject proj, boolean isSet, boolean isLoop, number start, number _end, boolean allowautoseek)
   * ```
   */
  function GetSet_LoopTimeRange2(
    proj: ReaProject,
    isSet: boolean,
    isLoop: boolean,
    start: number,
    _end: number,
    allowautoseek: boolean,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.GetSetAutomationItemInfo(TrackEnvelope env, integer autoitem_idx, string desc, number value, boolean is_set)
   * ```
   * Get or set automation item information. autoitem_idx=0 for the first automation item on an envelope, 1 for the second item, etc. desc can be any of the following:
   *
   * D_POOL_ID : double * : automation item pool ID (as an integer); edits are propagated to all other automation items that share a pool ID
   *
   * D_POSITION : double * : automation item timeline position in seconds
   *
   * D_LENGTH : double * : automation item length in seconds
   *
   * D_STARTOFFS : double * : automation item start offset in seconds
   *
   * D_PLAYRATE : double * : automation item playback rate
   *
   * D_BASELINE : double * : automation item baseline value in the range [0,1]
   *
   * D_AMPLITUDE : double * : automation item amplitude in the range [-1,1]
   *
   * D_LOOPSRC : double * : nonzero if the automation item contents are looped
   *
   * D_UISEL : double * : nonzero if the automation item is selected in the arrange view
   *
   * D_POOL_QNLEN : double * : automation item pooled source length in quarter notes (setting will affect all pooled instances)
   */
  function GetSetAutomationItemInfo(
    env: TrackEnvelope,
    autoitem_idx: number,
    desc: string,
    value: number,
    is_set: boolean,
  ): number;

  /**
   * ```
   * boolean retval, string valuestrNeedBig = reaper.GetSetAutomationItemInfo_String(TrackEnvelope env, integer autoitem_idx, string desc, string valuestrNeedBig, boolean is_set)
   * ```
   * Get or set automation item information. autoitem_idx=0 for the first automation item on an envelope, 1 for the second item, etc. returns true on success. desc can be any of the following:
   *
   * P_POOL_NAME : char * : name of the underlying automation item pool
   *
   * P_POOL_EXT:xyz : char * : extension-specific persistent data
   */
  function GetSetAutomationItemInfo_String(
    env: TrackEnvelope,
    autoitem_idx: number,
    desc: string,
    valuestrNeedBig: string,
    is_set: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string stringNeedBig = reaper.GetSetEnvelopeInfo_String(TrackEnvelope env, string parmname, string stringNeedBig, boolean setNewValue)
   * ```
   * Gets/sets an attribute string:
   *
   * ACTIVE : active state (bool as a string "0" or "1")
   *
   * ARM : armed state (bool...)
   *
   * VISIBLE : visible state (bool...)
   *
   * SHOWLANE : show envelope in separate lane (bool...)
   *
   * GUID : (read-only) GUID as a string {xyz-....}
   *
   * P_EXT:xyz : extension-specific persistent data
   *
   * Note that when writing some of these attributes you will need to manually update the arrange and/or track panels, see TrackList_AdjustWindows
   */
  function GetSetEnvelopeInfo_String(
    env: TrackEnvelope,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetEnvelopeState(TrackEnvelope env, string str)
   * ```
   * deprecated -- see SetEnvelopeStateChunk, GetEnvelopeStateChunk
   * @deprecated
   */
  function GetSetEnvelopeState(
    env: TrackEnvelope,
    str: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetEnvelopeState2(TrackEnvelope env, string str, boolean isundo)
   * ```
   * deprecated -- see SetEnvelopeStateChunk, GetEnvelopeStateChunk
   * @deprecated
   */
  function GetSetEnvelopeState2(
    env: TrackEnvelope,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetItemState(MediaItem item, string str)
   * ```
   * deprecated -- see SetItemStateChunk, GetItemStateChunk
   * @deprecated
   */
  function GetSetItemState(
    item: MediaItem,
    str: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetItemState2(MediaItem item, string str, boolean isundo)
   * ```
   * deprecated -- see SetItemStateChunk, GetItemStateChunk
   * @deprecated
   */
  function GetSetItemState2(
    item: MediaItem,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string stringNeedBig = reaper.GetSetMediaItemInfo_String(MediaItem item, string parmname, string stringNeedBig, boolean setNewValue)
   * ```
   * Gets/sets an item attribute string:
   *
   * P_NOTES : char * : item note text (do not write to returned pointer, use setNewValue to update)
   *
   * P_EXT:xyz : char * : extension-specific persistent data
   *
   * GUID : GUID * : 16-byte GUID, can query or update. If using a _String() function, GUID is a string {xyz-...}.
   */
  function GetSetMediaItemInfo_String(
    item: MediaItem,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string stringNeedBig = reaper.GetSetMediaItemTakeInfo_String(MediaItem_Take tk, string parmname, string stringNeedBig, boolean setNewValue)
   * ```
   * Gets/sets a take attribute string:
   *
   * P_NAME : char * : take name
   *
   * P_EXT:xyz : char * : extension-specific persistent data
   *
   * GUID : GUID * : 16-byte GUID, can query or update. If using a _String() function, GUID is a string {xyz-...}.
   */
  function GetSetMediaItemTakeInfo_String(
    tk: MediaItem_Take,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string stringNeedBig = reaper.GetSetMediaTrackInfo_String(MediaTrack tr, string parmname, string stringNeedBig, boolean setNewValue)
   * ```
   * Get or set track string attributes.
   *
   * P_NAME : char * : track name (on master returns NULL)
   *
   * P_ICON : const char * : track icon (full filename, or relative to resource_path/data/track_icons)
   *
   * P_LANENAME:n : char * : lane name (returns NULL for non-fixed-lane-tracks)
   *
   * P_MCP_LAYOUT : const char * : layout name
   *
   * P_RAZOREDITS : const char * : list of razor edit areas, as space-separated triples of start time, end time, and envelope GUID string.
   *
   *   Example: "0.0 1.0 \"\" 0.0 1.0 "{xyz-...}"
   *
   * P_RAZOREDITS_EXT : const char * : list of razor edit areas, as comma-separated sets of space-separated tuples of start time, end time, optional: envelope GUID string, fixed/fipm top y-position, fixed/fipm bottom y-position.
   *
   *   Example: "0.0 1.0,0.0 1.0 "{xyz-...}",1.0 2.0 "" 0.25 0.75"
   *
   * P_TCP_LAYOUT : const char * : layout name
   *
   * P_EXT:xyz : char * : extension-specific persistent data
   *
   * P_UI_RECT:tcp.mute : char * : read-only, allows querying screen position + size of track WALTER elements (tcp.size queries screen position and size of entire TCP, etc).
   *
   * GUID : GUID * : 16-byte GUID, can query or update. If using a _String() function, GUID is a string {xyz-...}.
   */
  function GetSetMediaTrackInfo_String(
    tr: MediaTrack,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string author = reaper.GetSetProjectAuthor(ReaProject proj, boolean set, string author)
   * ```
   * deprecated, see GetSetProjectInfo_String with desc="PROJECT_AUTHOR"
   * @deprecated
   */
  function GetSetProjectAuthor(
    proj: ReaProject,
    set: boolean,
    author: string,
  ): string;

  /**
   * ```
   * integer retval, optional number division, optional integer swingmode, optional number swingamt = reaper.GetSetProjectGrid(ReaProject project, boolean set, optional number division, optional integer swingmode, optional number swingamt)
   * ```
   * Get or set the arrange view grid division. 0.25=quarter note, 1.0/3.0=half note triplet, etc. swingmode can be 1 for swing enabled, swingamt is -1..1. swingmode can be 3 for measure-grid. Returns grid configuration flags
   */
  function GetSetProjectGrid(
    project: ReaProject,
    set: boolean,
    division?: number,
    swingmode?: number,
    swingamt?: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * number _ = reaper.GetSetProjectInfo(ReaProject project, string desc, number value, boolean is_set)
   * ```
   * Get or set project information.
   *
   * RENDER_SETTINGS : &(1|2)=0:master mix, &1=stems+master mix, &2=stems only, &4=multichannel tracks to multichannel files, &8=use render matrix, &16=tracks with only mono media to mono files, &32=selected media items, &64=selected media items via master, &128=selected tracks via master, &256=embed transients if format supports, &512=embed metadata if format supports, &1024=embed take markers if format supports, &2048=2nd pass render
   *
   * RENDER_BOUNDSFLAG : 0=custom time bounds, 1=entire project, 2=time selection, 3=all project regions, 4=selected media items, 5=selected project regions, 6=all project markers, 7=selected project markers
   *
   * RENDER_CHANNELS : number of channels in rendered file
   *
   * RENDER_SRATE : sample rate of rendered file (or 0 for project sample rate)
   *
   * RENDER_STARTPOS : render start time when RENDER_BOUNDSFLAG=0
   *
   * RENDER_ENDPOS : render end time when RENDER_BOUNDSFLAG=0
   *
   * RENDER_TAILFLAG : apply render tail setting when rendering: &1=custom time bounds, &2=entire project, &4=time selection, &8=all project markers/regions, &16=selected media items, &32=selected project markers/regions
   *
   * RENDER_TAILMS : tail length in ms to render (only used if RENDER_BOUNDSFLAG and RENDER_TAILFLAG are set)
   *
   * RENDER_ADDTOPROJ : &1=add rendered files to project, &2=do not render files that are likely silent
   *
   * RENDER_DITHER : &1=dither, &2=noise shaping, &4=dither stems, &8=noise shaping on stems
   *
   * RENDER_NORMALIZE: &1=enable, (&14==0)=LUFS-I, (&14==2)=RMS, (&14==4)=peak, (&14==6)=true peak, (&14==8)=LUFS-M max, (&14==10)=LUFS-S max, (&4128==32)=normalize stems to common gain based on master, &64=enable brickwall limit, &128=brickwall limit true peak, (&2304==256)=only normalize files that are too loud, (&2304==2048)=only normalize files that are too quiet, &512=apply fade-in, &1024=apply fade-out, (&4128==4096)=normalize to loudest file, (&4128==4128)=normalize as if one long file, &8192=adjust mono media additional -3dB
   *
   * RENDER_NORMALIZE_TARGET: render normalization target as amplitude, so 0.5 means -6.02dB, 0.25 means -12.04dB, etc
   *
   * RENDER_BRICKWALL: render brickwall limit as amplitude, so 0.5 means -6.02dB, 0.25 means -12.04dB, etc
   *
   * RENDER_FADEIN: render fade-in (0.001 means 1 ms, requires RENDER_NORMALIZE&512)
   *
   * RENDER_FADEOUT: render fade-out (0.001 means 1 ms, requires RENDER_NORMALIZE&1024)
   *
   * RENDER_FADEINSHAPE: render fade-in shape
   *
   * RENDER_FADEOUTSHAPE: render fade-out shape
   *
   * PROJECT_SRATE : sample rate (ignored unless PROJECT_SRATE_USE set)
   *
   * PROJECT_SRATE_USE : set to 1 if project sample rate is used
   */
  function GetSetProjectInfo(
    project: ReaProject,
    desc: string,
    value: number,
    is_set: boolean,
  ): number;

  /**
   * ```
   * boolean retval, string valuestrNeedBig = reaper.GetSetProjectInfo_String(ReaProject project, string desc, string valuestrNeedBig, boolean is_set)
   * ```
   * Get or set project information.
   *
   * PROJECT_NAME : project file name (read-only, is_set will be ignored)
   *
   * PROJECT_TITLE : title field from Project Settings/Notes dialog
   *
   * PROJECT_AUTHOR : author field from Project Settings/Notes dialog
   *
   * TRACK_GROUP_NAME:X : track group name, X should be 1..64
   *
   * MARKER_GUID:X : get the GUID (unique ID) of the marker or region with index X, where X is the index passed to EnumProjectMarkers, not necessarily the displayed number (read-only)
   *
   * MARKER_INDEX_FROM_GUID:{GUID} : get the GUID index of the marker or region with GUID {GUID} (read-only)
   *
   * OPENCOPY_CFGIDX : integer for the configuration of format to use when creating copies/applying FX. 0=wave (auto-depth), 1=APPLYFX_FORMAT, 2=RECORD_FORMAT
   *
   * RECORD_PATH : recording directory -- may be blank or a relative path, to get the effective path see GetProjectPathEx()
   *
   * RECORD_PATH_SECONDARY : secondary recording directory
   *
   * RECORD_FORMAT : base64-encoded sink configuration (see project files, etc). Callers can also pass a simple 4-byte string (non-base64-encoded), e.g. "evaw" or "l3pm", to use default settings for that sink type.
   *
   * APPLYFX_FORMAT : base64-encoded sink configuration (see project files, etc). Used only if RECFMT_OPENCOPY is set to 1. Callers can also pass a simple 4-byte string (non-base64-encoded), e.g. "evaw" or "l3pm", to use default settings for that sink type.
   *
   * RENDER_FILE : render directory
   *
   * RENDER_PATTERN : render file name (may contain wildcards)
   *
   * RENDER_METADATA : get or set the metadata saved with the project (not metadata embedded in project media). Example, ID3 album name metadata: valuestr="ID3:TALB" to get, valuestr="ID3:TALB|my album name" to set. Call with valuestr="" and is_set=false to get a semicolon-separated list of defined project metadata identifiers.
   *
   * RENDER_TARGETS : semicolon separated list of files that would be written if the project is rendered using the most recent render settings
   *
   * RENDER_STATS : (read-only) semicolon separated list of statistics for the most recently rendered files. call with valuestr="XXX" to run an action (for example, "42437"=dry run render selected items) before returning statistics.
   *
   * RENDER_FORMAT : base64-encoded sink configuration (see project files, etc). Callers can also pass a simple 4-byte string (non-base64-encoded), e.g. "evaw" or "l3pm", to use default settings for that sink type.
   *
   * RENDER_FORMAT2 : base64-encoded secondary sink configuration. Callers can also pass a simple 4-byte string (non-base64-encoded), e.g. "evaw" or "l3pm", to use default settings for that sink type, or "" to disable secondary render.
   *
   *     Formats available on this machine:
   *
   *     "wave" "aiff" "caff" "raw " "iso " "ddp " "flac" "mp3l" "oggv" "OggS" "FFMP" "WMF " "GIF " "LCF " "wvpk"
   */
  function GetSetProjectInfo_String(
    project: ReaProject,
    desc: string,
    valuestrNeedBig: string,
    is_set: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string notes = reaper.GetSetProjectNotes(ReaProject proj, boolean set, string notes)
   * ```
   * gets or sets project notes, notesNeedBig_sz is ignored when setting
   */
  function GetSetProjectNotes(
    proj: ReaProject,
    set: boolean,
    notes: string,
  ): string;

  /**
   * ```
   * integer _ = reaper.GetSetRepeat(integer val)
   * ```
   * -1 == query,0=clear,1=set,>1=toggle . returns new value
   */
  function GetSetRepeat(val: number): number;

  /**
   * ```
   * integer _ = reaper.GetSetRepeatEx(ReaProject proj, integer val)
   * ```
   * -1 == query,0=clear,1=set,>1=toggle . returns new value
   */
  function GetSetRepeatEx(proj: ReaProject, val: number): number;

  /**
   * ```
   * integer _ = reaper.GetSetTempoTimeSigMarkerFlag(ReaProject project, integer point_index, integer flag, boolean is_set)
   * ```
   * Gets or sets the attribute flag of a tempo/time signature marker. flag &1=sets time signature and starts new measure, &2=does not set tempo, &4=allow previous partial measure if starting new measure, &8=set new metronome pattern if starting new measure, &16=reset ruler grid if starting new measure
   */
  function GetSetTempoTimeSigMarkerFlag(
    project: ReaProject,
    point_index: number,
    flag: number,
    is_set: boolean,
  ): number;

  /**
   * ```
   * integer _ = reaper.GetSetTrackGroupMembership(MediaTrack tr, string groupname, integer setmask, integer setvalue)
   * ```
   * Gets or modifies the group membership for a track. Returns group state prior to call (each bit represents one of the 32 group numbers). if setmask has bits set, those bits in setvalue will be applied to group. Group can be one of:
   *
   * MEDIA_EDIT_LEAD
   *
   * MEDIA_EDIT_FOLLOW
   *
   * VOLUME_LEAD
   *
   * VOLUME_FOLLOW
   *
   * VOLUME_VCA_LEAD
   *
   * VOLUME_VCA_FOLLOW
   *
   * PAN_LEAD
   *
   * PAN_FOLLOW
   *
   * WIDTH_LEAD
   *
   * WIDTH_FOLLOW
   *
   * MUTE_LEAD
   *
   * MUTE_FOLLOW
   *
   * SOLO_LEAD
   *
   * SOLO_FOLLOW
   *
   * RECARM_LEAD
   *
   * RECARM_FOLLOW
   *
   * POLARITY_LEAD
   *
   * POLARITY_FOLLOW
   *
   * AUTOMODE_LEAD
   *
   * AUTOMODE_FOLLOW
   *
   * VOLUME_REVERSE
   *
   * PAN_REVERSE
   *
   * WIDTH_REVERSE
   *
   * NO_LEAD_WHEN_FOLLOW
   *
   * VOLUME_VCA_FOLLOW_ISPREFX
   *
   *
   *
   * Note: REAPER v6.11 and earlier used _MASTER and _SLAVE rather than _LEAD and _FOLLOW, which is deprecated but still supported (scripts that must support v6.11 and earlier can use the deprecated strings).
   */
  function GetSetTrackGroupMembership(
    tr: MediaTrack,
    groupname: string,
    setmask: number,
    setvalue: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.GetSetTrackGroupMembershipEx(MediaTrack tr, string groupname, integer offset, integer setmask, integer setvalue)
   * ```
   * Gets or modifies 32 bits (at offset, where 0 is the low 32 bits of the grouping) of the group membership for a track. Returns group state prior to call. if setmask has bits set, those bits in setvalue will be applied to group. Group can be one of:
   *
   * MEDIA_EDIT_LEAD
   *
   * MEDIA_EDIT_FOLLOW
   *
   * VOLUME_LEAD
   *
   * VOLUME_FOLLOW
   *
   * VOLUME_VCA_LEAD
   *
   * VOLUME_VCA_FOLLOW
   *
   * PAN_LEAD
   *
   * PAN_FOLLOW
   *
   * WIDTH_LEAD
   *
   * WIDTH_FOLLOW
   *
   * MUTE_LEAD
   *
   * MUTE_FOLLOW
   *
   * SOLO_LEAD
   *
   * SOLO_FOLLOW
   *
   * RECARM_LEAD
   *
   * RECARM_FOLLOW
   *
   * POLARITY_LEAD
   *
   * POLARITY_FOLLOW
   *
   * AUTOMODE_LEAD
   *
   * AUTOMODE_FOLLOW
   *
   * VOLUME_REVERSE
   *
   * PAN_REVERSE
   *
   * WIDTH_REVERSE
   *
   * NO_LEAD_WHEN_FOLLOW
   *
   * VOLUME_VCA_FOLLOW_ISPREFX
   *
   *
   *
   * Note: REAPER v6.11 and earlier used _MASTER and _SLAVE rather than _LEAD and _FOLLOW, which is deprecated but still supported (scripts that must support v6.11 and earlier can use the deprecated strings).
   * @deprecated
   */
  function GetSetTrackGroupMembershipEx(
    tr: MediaTrack,
    groupname: string,
    offset: number,
    setmask: number,
    setvalue: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.GetSetTrackGroupMembershipHigh(MediaTrack tr, string groupname, integer setmask, integer setvalue)
   * ```
   * Gets or modifies the group membership for a track. Returns group state prior to call (each bit represents one of the high 32 group numbers). if setmask has bits set, those bits in setvalue will be applied to group. Group can be one of:
   *
   * MEDIA_EDIT_LEAD
   *
   * MEDIA_EDIT_FOLLOW
   *
   * VOLUME_LEAD
   *
   * VOLUME_FOLLOW
   *
   * VOLUME_VCA_LEAD
   *
   * VOLUME_VCA_FOLLOW
   *
   * PAN_LEAD
   *
   * PAN_FOLLOW
   *
   * WIDTH_LEAD
   *
   * WIDTH_FOLLOW
   *
   * MUTE_LEAD
   *
   * MUTE_FOLLOW
   *
   * SOLO_LEAD
   *
   * SOLO_FOLLOW
   *
   * RECARM_LEAD
   *
   * RECARM_FOLLOW
   *
   * POLARITY_LEAD
   *
   * POLARITY_FOLLOW
   *
   * AUTOMODE_LEAD
   *
   * AUTOMODE_FOLLOW
   *
   * VOLUME_REVERSE
   *
   * PAN_REVERSE
   *
   * WIDTH_REVERSE
   *
   * NO_LEAD_WHEN_FOLLOW
   *
   * VOLUME_VCA_FOLLOW_ISPREFX
   *
   *
   *
   * Note: REAPER v6.11 and earlier used _MASTER and _SLAVE rather than _LEAD and _FOLLOW, which is deprecated but still supported (scripts that must support v6.11 and earlier can use the deprecated strings).
   */
  function GetSetTrackGroupMembershipHigh(
    tr: MediaTrack,
    groupname: string,
    setmask: number,
    setvalue: number,
  ): number;

  /**
   * ```
   * boolean retval, string stringNeedBig = reaper.GetSetTrackSendInfo_String(MediaTrack tr, integer category, integer sendidx, string parmname, string stringNeedBig, boolean setNewValue)
   * ```
   * Gets/sets a send attribute string:
   *
   * P_EXT:xyz : char * : extension-specific persistent data
   */
  function GetSetTrackSendInfo_String(
    tr: MediaTrack,
    category: number,
    sendidx: number,
    parmname: string,
    stringNeedBig: string,
    setNewValue: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetTrackState(MediaTrack track, string str)
   * ```
   * deprecated -- see SetTrackStateChunk, GetTrackStateChunk
   * @deprecated
   */
  function GetSetTrackState(
    track: MediaTrack,
    str: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string str = reaper.GetSetTrackState2(MediaTrack track, string str, boolean isundo)
   * ```
   * deprecated -- see SetTrackStateChunk, GetTrackStateChunk
   * @deprecated
   */
  function GetSetTrackState2(
    track: MediaTrack,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * ReaProject _ = reaper.GetSubProjectFromSource(PCM_source src)
   * ```
   */
  function GetSubProjectFromSource(src: PCM_source): ReaProject;

  /**
   * ```
   * MediaItem_Take _ = reaper.GetTake(MediaItem item, integer takeidx)
   * ```
   * get a take from an item by take count (zero-based)
   */
  function GetTake(item: MediaItem, takeidx: number): MediaItem_Take;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetTakeEnvelope(MediaItem_Take take, integer envidx)
   * ```
   */
  function GetTakeEnvelope(take: MediaItem_Take, envidx: number): TrackEnvelope;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetTakeEnvelopeByName(MediaItem_Take take, string envname)
   * ```
   */
  function GetTakeEnvelopeByName(
    take: MediaItem_Take,
    envname: string,
  ): TrackEnvelope;

  /**
   * ```
   * number retval, string name, optional integer color = reaper.GetTakeMarker(MediaItem_Take take, integer idx)
   * ```
   * Get information about a take marker. Returns the position in media item source time, or -1 if the take marker does not exist. See GetNumTakeMarkers, SetTakeMarker, DeleteTakeMarker
   */
  function GetTakeMarker(
    take: MediaItem_Take,
    idx: number,
  ): LuaMultiReturn<[number, string, number]>;

  /**
   * ```
   * string _ = reaper.GetTakeName(MediaItem_Take take)
   * ```
   * returns NULL if the take is not valid
   */
  function GetTakeName(take: MediaItem_Take): string | null;

  /**
   * ```
   * integer _ = reaper.GetTakeNumStretchMarkers(MediaItem_Take take)
   * ```
   * Returns number of stretch markers in take
   */
  function GetTakeNumStretchMarkers(take: MediaItem_Take): number;

  /**
   * ```
   * integer retval, number pos, optional number srcpos = reaper.GetTakeStretchMarker(MediaItem_Take take, integer idx)
   * ```
   * Gets information on a stretch marker, idx is 0..n. Returns -1 if stretch marker not valid. posOut will be set to position in item, srcposOutOptional will be set to source media position. Returns index. if input index is -1, the following marker is found using position (or source position if position is -1). If position/source position are used to find marker position, their values are not updated.
   */
  function GetTakeStretchMarker(
    take: MediaItem_Take,
    idx: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * number _ = reaper.GetTakeStretchMarkerSlope(MediaItem_Take take, integer idx)
   * ```
   * See SetTakeStretchMarkerSlope
   */
  function GetTakeStretchMarkerSlope(take: MediaItem_Take, idx: number): number;

  /**
   * ```
   * boolean retval, integer fxindex, integer parmidx = reaper.GetTCPFXParm(ReaProject project, MediaTrack track, integer index)
   * ```
   * Get information about a specific FX parameter knob (see CountTCPFXParms).
   */
  function GetTCPFXParm(
    project: ReaProject,
    track: MediaTrack,
    index: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, number rate, number targetlen = reaper.GetTempoMatchPlayRate(PCM_source source, number srcscale, number position, number mult)
   * ```
   * finds the playrate and target length to insert this item stretched to a round power-of-2 number of bars, between 1/8 and 256
   */
  function GetTempoMatchPlayRate(
    source: PCM_source,
    srcscale: number,
    position: number,
    mult: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, number timepos, integer measurepos, number beatpos, number bpm, integer timesig_num, integer timesig_denom, boolean lineartempo = reaper.GetTempoTimeSigMarker(ReaProject proj, integer ptidx)
   * ```
   * Get information about a tempo/time signature marker. See CountTempoTimeSigMarkers, SetTempoTimeSigMarker, AddTempoTimeSigMarker.
   */
  function GetTempoTimeSigMarker(
    proj: ReaProject,
    ptidx: number,
  ): LuaMultiReturn<
    [boolean, number, number, number, number, number, number, boolean]
  >;

  /**
   * ```
   * integer _ = reaper.GetThemeColor(string ini_key, integer flags)
   * ```
   * Returns the theme color specified, or -1 on failure. If the low bit of flags is set, the color as originally specified by the theme (before any transformations) is returned, otherwise the current (possibly transformed and modified) color is returned. See SetThemeColor for a list of valid ini_key.
   */
  function GetThemeColor(ini_key: string, flags: number): number;

  /**
   * ```
   * MediaTrack retval, string info = reaper.GetThingFromPoint(integer screen_x, integer screen_y)
   * ```
   * Hit tests a point in screen coordinates. Updates infoOut with information such as "arrange", "fx_chain", "fx_0" (first FX in chain, floating), "spacer_0" (spacer before first track). If a track panel is hit, string will begin with "tcp" or "mcp" or "tcp.mute" etc (future versions may append additional information). May return NULL with valid info string to indicate non-track thing.
   */
  function GetThingFromPoint(
    screen_x: number,
    screen_y: number,
  ): LuaMultiReturn<[MediaTrack, string]>;

  /**
   * ```
   * integer _ = reaper.GetToggleCommandState(integer command_id)
   * ```
   * See GetToggleCommandStateEx.
   */
  function GetToggleCommandState(command_id: number): number;

  /**
   * ```
   * integer _ = reaper.GetToggleCommandStateEx(integer section_id, integer command_id)
   * ```
   * For the main action context, the MIDI editor, or the media explorer, returns the toggle state of the action. 0=off, 1=on, -1=NA because the action does not have on/off states. For the MIDI editor, the action state for the most recently focused window will be returned.
   */
  function GetToggleCommandStateEx(
    section_id: number,
    command_id: number,
  ): number;

  /**
   * ```
   * HWND _ = reaper.GetTooltipWindow()
   * ```
   * gets a tooltip window,in case you want to ask it for font information. Can return NULL.
   */
  function GetTooltipWindow(): HWND;

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

  /**
   * ```
   * MediaTrack _ = reaper.GetTrack(ReaProject proj, integer trackidx)
   * ```
   * get a track from a project by track count (zero-based) (proj=0 for active project)
   */
  function GetTrack(proj: ReaProject, trackidx: number): MediaTrack | null;

  /**
   * ```
   * integer _ = reaper.GetTrackAutomationMode(MediaTrack tr)
   * ```
   * return the track mode, regardless of global override
   */
  function GetTrackAutomationMode(tr: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.GetTrackColor(MediaTrack track)
   * ```
   * Returns the track custom color as OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). Black is returned as 0x1000000, no color setting is returned as 0.
   */
  function GetTrackColor(track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.GetTrackDepth(MediaTrack track)
   * ```
   */
  function GetTrackDepth(track: MediaTrack): number;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetTrackEnvelope(MediaTrack track, integer envidx)
   * ```
   */
  function GetTrackEnvelope(track: MediaTrack, envidx: number): TrackEnvelope;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetTrackEnvelopeByChunkName(MediaTrack tr, string cfgchunkname_or_guid)
   * ```
   * Gets a built-in track envelope by configuration chunk name, like "<VOLENV", or GUID string, like "{B577250D-146F-B544-9B34-F24FBE488F1F}".
   */
  function GetTrackEnvelopeByChunkName(
    tr: MediaTrack,
    cfgchunkname_or_guid: string,
  ): TrackEnvelope;

  /**
   * ```
   * TrackEnvelope _ = reaper.GetTrackEnvelopeByName(MediaTrack track, string envname)
   * ```
   */
  function GetTrackEnvelopeByName(
    track: MediaTrack,
    envname: string,
  ): TrackEnvelope;

  /**
   * ```
   * MediaTrack retval, optional integer info = reaper.GetTrackFromPoint(integer screen_x, integer screen_y)
   * ```
   * Returns the track from the screen coordinates specified. If the screen coordinates refer to a window associated to the track (such as FX), the track will be returned. infoOutOptional will be set to 1 if it is likely an envelope, 2 if it is likely a track FX. For a free item positioning or fixed lane track, the second byte of infoOutOptional will be set to the (approximate, for fipm tracks) item lane underneath the mouse. See GetThingFromPoint.
   */
  function GetTrackFromPoint(
    screen_x: number,
    screen_y: number,
  ): LuaMultiReturn<[MediaTrack, number]>;

  /**
   * ```
   * string GUID = reaper.GetTrackGUID(MediaTrack tr)
   * ```
   */
  function GetTrackGUID(tr: MediaTrack): string;

  /**
   * ```
   * MediaItem _ = reaper.GetTrackMediaItem(MediaTrack tr, integer itemidx)
   * ```
   */
  function GetTrackMediaItem(tr: MediaTrack, itemidx: number): MediaItem;

  /**
   * ```
   * boolean retval, string buf = reaper.GetTrackMIDILyrics(MediaTrack track, integer flag)
   * ```
   * Get all MIDI lyrics on the track. Lyrics will be returned as one string with tabs between each word. flag&1: double tabs at the end of each measure and triple tabs when skipping measures, flag&2: each lyric is preceded by its beat position in the project (example with flag=2: "1.1.2\tLyric for measure 1 beat 2\t2.1.1\tLyric for measure 2 beat 1	"). See SetTrackMIDILyrics
   */
  function GetTrackMIDILyrics(
    track: MediaTrack,
    flag: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string _ = reaper.GetTrackMIDINoteName(integer track, integer pitch, integer chan)
   * ```
   * see GetTrackMIDINoteNameEx
   */
  function GetTrackMIDINoteName(
    track: number,
    pitch: number,
    chan: number,
  ): string;

  /**
   * ```
   * string _ = reaper.GetTrackMIDINoteNameEx(ReaProject proj, MediaTrack track, integer pitch, integer chan)
   * ```
   * Get note/CC name. pitch 128 for CC0 name, 129 for CC1 name, etc. See SetTrackMIDINoteNameEx
   */
  function GetTrackMIDINoteNameEx(
    proj: ReaProject,
    track: MediaTrack,
    pitch: number,
    chan: number,
  ): string;

  /**
   * ```
   * integer note_lo, integer note_hi = reaper.GetTrackMIDINoteRange(ReaProject proj, MediaTrack track)
   * ```
   */
  function GetTrackMIDINoteRange(
    proj: ReaProject,
    track: MediaTrack,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean retval, string buf = reaper.GetTrackName(MediaTrack track)
   * ```
   * Returns "MASTER" for master track, "Track N" if track has no name.
   */
  function GetTrackName(track: MediaTrack): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.GetTrackNumMediaItems(MediaTrack tr)
   * ```
   */
  function GetTrackNumMediaItems(tr: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.GetTrackNumSends(MediaTrack tr, integer category)
   * ```
   * returns number of sends/receives/hardware outputs - category is <0 for receives, 0=sends, >0 for hardware outputs
   */
  function GetTrackNumSends(tr: MediaTrack, category: number): number;

  /**
   * ```
   * boolean retval, string buf = reaper.GetTrackReceiveName(MediaTrack track, integer recv_index)
   * ```
   * See GetTrackSendName.
   */
  function GetTrackReceiveName(
    track: MediaTrack,
    recv_index: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean mute = reaper.GetTrackReceiveUIMute(MediaTrack track, integer recv_index)
   * ```
   * See GetTrackSendUIMute.
   */
  function GetTrackReceiveUIMute(
    track: MediaTrack,
    recv_index: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean retval, number volume, number pan = reaper.GetTrackReceiveUIVolPan(MediaTrack track, integer recv_index)
   * ```
   * See GetTrackSendUIVolPan.
   */
  function GetTrackReceiveUIVolPan(
    track: MediaTrack,
    recv_index: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * number _ = reaper.GetTrackSendInfo_Value(MediaTrack tr, integer category, integer sendidx, string parmname)
   * ```
   * Get send/receive/hardware output numerical-value attributes.
   *
   * category is <0 for receives, 0=sends, >0 for hardware outputs
   *
   * parameter names:
   *
   * - `B_MUTE` : bool *
   * - `B_PHASE` : bool * : true to flip phase
   * - `B_MONO` : bool *
   * - `D_VOL` : double * : 1.0 = +0dB etc
   * - `D_PAN` : double * : -1..+1
   * - `D_PANLAW` : double * : 1.0=+0.0db, 0.5=-6dB, -1.0 = projdef etc
   * - `I_SENDMODE` : int * : 0=post-fader, 1=pre-fx, 2=post-fx (deprecated), 3=post-fx
   * - `I_AUTOMODE` : int * : automation mode (-1=use track automode, 0=trim/off, 1=read, 2=touch, 3=write, 4=latch)
   * - `I_SRCCHAN` : int * : -1 for no audio send. Low 10 bits specify channel offset, and higher bits specify channel count. (srcchan>>10) == 0 for stereo, 1 for mono, 2 for 4 channel, 3 for 6 channel, etc.
   * - `I_DSTCHAN` : int * : low 10 bits are destination index, &1024 set to mix to mono.
   * - `I_MIDIFLAGS` : int * : low 5 bits=source channel 0=all, 1-16, 31=MIDI send disabled, next 5 bits=dest channel, 0=orig, 1-16=chan. &1024 for faders-send MIDI vol/pan. (>>14)&255 = src bus (0 for all, 1 for normal, 2+). (>>22)&255=destination bus (0 for all, 1 for normal, 2+)
   * - `P_DESTTRACK` : MediaTrack * : destination track, only applies for sends/recvs (read-only)
   * - `P_SRCTRACK` : MediaTrack * : source track, only applies for sends/recvs (read-only)
   * - `P_ENV:<envchunkname` : TrackEnvelope * : call with :<VOLENV, :<PANENV, etc appended (read-only)
   *
   * See CreateTrackSend, RemoveTrackSend, GetTrackNumSends.
   */
  function GetTrackSendInfo_Value(
    tr: MediaTrack,
    category: number,
    sendidx: number,
    parmname: "P_DESTTRACK" | "P_SRCTRACK",
  ): MediaTrack;
  function GetTrackSendInfo_Value(
    tr: MediaTrack,
    category: number,
    sendidx: number,
    parmname: string,
  ): number;

  /**
   * ```
   * boolean retval, string buf = reaper.GetTrackSendName(MediaTrack track, integer send_index)
   * ```
   * send_idx>=0 for hw ouputs, >=nb_of_hw_ouputs for sends. See GetTrackReceiveName.
   */
  function GetTrackSendName(
    track: MediaTrack,
    send_index: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean mute = reaper.GetTrackSendUIMute(MediaTrack track, integer send_index)
   * ```
   * send_idx>=0 for hw ouputs, >=nb_of_hw_ouputs for sends. See GetTrackReceiveUIMute.
   */
  function GetTrackSendUIMute(
    track: MediaTrack,
    send_index: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean retval, number volume, number pan = reaper.GetTrackSendUIVolPan(MediaTrack track, integer send_index)
   * ```
   * send_idx>=0 for hw ouputs, >=nb_of_hw_ouputs for sends. See GetTrackReceiveUIVolPan.
   */
  function GetTrackSendUIVolPan(
    track: MediaTrack,
    send_index: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * string retval, integer flags = reaper.GetTrackState(MediaTrack track)
   * ```
   * Gets track state, returns track name.
   *
   * flags will be set to:
   *
   * &1=folder
   *
   * &2=selected
   *
   * &4=has fx enabled
   *
   * &8=muted
   *
   * &16=soloed
   *
   * &32=SIP'd (with &16)
   *
   * &64=rec armed
   *
   * &128=rec monitoring on
   *
   * &256=rec monitoring auto
   *
   * &512=hide from TCP
   *
   * &1024=hide from MCP
   */
  function GetTrackState(track: MediaTrack): LuaMultiReturn<[string, number]>;

  /** Gets the RPPXML state of a track, returns true if successful. Undo flag is a performance/caching hint.  */
  function GetTrackStateChunk(
    track: MediaTrack,
    str: string,
    isundo: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean mute = reaper.GetTrackUIMute(MediaTrack track)
   * ```
   */
  function GetTrackUIMute(
    track: MediaTrack,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean retval, number pan1, number pan2, integer panmode = reaper.GetTrackUIPan(MediaTrack track)
   * ```
   */
  function GetTrackUIPan(
    track: MediaTrack,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, number volume, number pan = reaper.GetTrackUIVolPan(MediaTrack track)
   * ```
   */
  function GetTrackUIVolPan(
    track: MediaTrack,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * integer audio_xrun, integer media_xrun, integer curtime = reaper.GetUnderrunTime()
   * ```
   * retrieves the last timestamps of audio xrun (yellow-flash, if available), media xrun (red-flash), and the current time stamp (all milliseconds)
   */
  function GetUnderrunTime(): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * boolean retval, string filenameNeed4096 = reaper.GetUserFileNameForRead(string filenameNeed4096, string title, string defext)
   * ```
   * returns true if the user selected a valid file, false if the user canceled the dialog
   */
  function GetUserFileNameForRead(
    filenameNeed4096: string,
    title: string,
    defext: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string retvals_csv = reaper.GetUserInputs(string title, integer num_inputs, string captions_csv, string retvals_csv)
   * ```
   * Get values from the user.
   *
   * If a caption begins with *, for example "*password", the edit field will not display the input text.
   *
   * Maximum fields is 16. Values are returned as a comma-separated string. Returns false if the user canceled the dialog. You can supply special extra information via additional caption fields: extrawidth=XXX to increase text field width, separator=X to use a different separator for returned fields.
   */
  function GetUserInputs(
    title: string,
    num_inputs: number,
    captions_csv: string,
    retvals_csv: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * reaper.GoToMarker(ReaProject proj, integer marker_index, boolean use_timeline_order)
   * ```
   * Go to marker. If use_timeline_order==true, marker_index 1 refers to the first marker on the timeline.  If use_timeline_order==false, marker_index 1 refers to the first marker with the user-editable index of 1.
   */
  function GoToMarker(
    proj: ReaProject,
    marker_index: number,
    use_timeline_order: boolean,
  ): void;

  /**
   * ```
   * reaper.GoToRegion(ReaProject proj, integer region_index, boolean use_timeline_order)
   * ```
   * Seek to region after current region finishes playing (smooth seek). If use_timeline_order==true, region_index 1 refers to the first region on the timeline.  If use_timeline_order==false, region_index 1 refers to the first region with the user-editable index of 1.
   */
  function GoToRegion(
    proj: ReaProject,
    region_index: number,
    use_timeline_order: boolean,
  ): void;

  /**
   * ```
   * integer retval, integer color = reaper.GR_SelectColor(HWND hwnd)
   * ```
   * Runs the system color chooser dialog.  Returns 0 if the user cancels the dialog.
   */
  function GR_SelectColor(hwnd: HWND): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.GSC_mainwnd(integer t)
   * ```
   * this is just like win32 GetSysColor() but can have overrides.
   */
  function GSC_mainwnd(t: number): number;

  /**
   * ```
   * string destNeed64 = reaper.guidToString(string gGUID, string destNeed64)
   * ```
   * dest should be at least 64 chars long to be safe
   */
  function guidToString(gGUID: string, destNeed64: string): string;

  /**
   * ```
   * boolean _ = reaper.HasExtState(string section, string key)
   * ```
   * Returns true if there exists an extended state value for a specific section and key. See SetExtState, GetExtState, DeleteExtState.
   */
  function HasExtState(section: string, key: string): boolean;

  /**
   * ```
   * string _ = reaper.HasTrackMIDIPrograms(integer track)
   * ```
   * returns name of track plugin that is supplying MIDI programs,or NULL if there is none
   */
  function HasTrackMIDIPrograms(track: number): string;

  /**
   * ```
   * string _ = reaper.HasTrackMIDIProgramsEx(ReaProject proj, MediaTrack track)
   * ```
   * returns name of track plugin that is supplying MIDI programs,or NULL if there is none
   */
  function HasTrackMIDIProgramsEx(proj: ReaProject, track: MediaTrack): string;

  /**
   * ```
   * reaper.Help_Set(string helpstring, boolean is_temporary_help)
   * ```
   */
  function Help_Set(helpstring: string, is_temporary_help: boolean): void;

  /**
   * ```
   * string out = reaper.image_resolve_fn(string _in, string out)
   * ```
   */
  function image_resolve_fn(_in: string, out: string): string;

  /**
   * ```
   * integer _ = reaper.InsertAutomationItem(TrackEnvelope env, integer pool_id, number position, number length)
   * ```
   * Insert a new automation item. pool_id < 0 collects existing envelope points into the automation item; if pool_id is >= 0 the automation item will be a new instance of that pool (which will be created as an empty instance if it does not exist). Returns the index of the item, suitable for passing to other automation item API functions. See GetSetAutomationItemInfo.
   */
  function InsertAutomationItem(
    env: TrackEnvelope,
    pool_id: number,
    position: number,
    length: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.InsertEnvelopePoint(TrackEnvelope envelope, number time, number value, integer shape, number tension, boolean selected, optional boolean noSortIn)
   * ```
   * Insert an envelope point. If setting multiple points at once, set noSort=true, and call Envelope_SortPoints when done. See InsertEnvelopePointEx.
   */
  function InsertEnvelopePoint(
    envelope: TrackEnvelope,
    time: number,
    value: number,
    shape: number,
    tension: number,
    selected: boolean,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.InsertEnvelopePointEx(TrackEnvelope envelope, integer autoitem_idx, number time, number value, integer shape, number tension, boolean selected, optional boolean noSortIn)
   * ```
   * Insert an envelope point. If setting multiple points at once, set noSort=true, and call Envelope_SortPoints when done.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See CountEnvelopePointsEx, GetEnvelopePointEx, SetEnvelopePointEx, DeleteEnvelopePointEx.
   */
  function InsertEnvelopePointEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    time: number,
    value: number,
    shape: number,
    tension: number,
    selected: boolean,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.InsertMedia(string file, integer mode)
   * ```
   * mode: 0=add to current track, 1=add new track, 3=add to selected items as takes, &4=stretch/loop to fit time sel, &8=try to match tempo 1x, &16=try to match tempo 0.5x, &32=try to match tempo 2x, &64=don't preserve pitch when matching tempo, &128=no loop/section if startpct/endpct set, &256=force loop regardless of global preference for looping imported items, &512=use high word as absolute track index if mode&3==0 or mode&2048, &1024=insert into reasamplomatic on a new track (add 1 to insert on last selected track), &2048=insert into open reasamplomatic instance (add 512 to use high word as absolute track index), &4096=move to source preferred position (BWF start offset), &8192=reverse
   */
  function InsertMedia(file: string, mode: number): number;

  /**
   * ```
   * integer _ = reaper.InsertMediaSection(string file, integer mode, number startpct, number endpct, number pitchshift)
   * ```
   * See InsertMedia.
   */
  function InsertMediaSection(
    file: string,
    mode: number,
    startpct: number,
    endpct: number,
    pitchshift: number,
  ): number;

  /**
   * ```
   * reaper.InsertTrackAtIndex(integer idx, boolean wantDefaults)
   * ```
   * inserts a track at idx,of course this will be clamped to 0..GetNumTracks(). wantDefaults=TRUE for default envelopes/FX,otherwise no enabled fx/env. Superseded, see InsertTrackInProject
   */
  function InsertTrackAtIndex(idx: number, wantDefaults: boolean): void;

  /**
   * ```
   * reaper.InsertTrackInProject(ReaProject proj, integer idx, integer flags)
   * ```
   * inserts a track in project proj at idx, this will be clamped to 0..CountTracks(proj). flags&1 for default envelopes/FX, otherwise no enabled fx/envelopes will be added.
   */
  function InsertTrackInProject(
    proj: ReaProject,
    idx: number,
    flags: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.IsMediaExtension(string ext, boolean wantOthers)
   * ```
   * Tests a file extension (i.e. "wav" or "mid") to see if it's a media extension.
   *
   * If wantOthers is set, then "RPP", "TXT" and other project-type formats will also pass.
   */
  function IsMediaExtension(ext: string, wantOthers: boolean): boolean;

  /**
   * ```
   * boolean _ = reaper.IsMediaItemSelected(MediaItem item)
   * ```
   */
  function IsMediaItemSelected(item: MediaItem): boolean;

  /**
   * ```
   * integer _ = reaper.IsProjectDirty(ReaProject proj)
   * ```
   * Is the project dirty (needing save)? Always returns 0 if 'undo/prompt to save' is disabled in preferences.
   */
  function IsProjectDirty(proj: ReaProject): number;

  /**
   * ```
   * boolean _ = reaper.IsTrackSelected(MediaTrack track)
   * ```
   */
  function IsTrackSelected(track: MediaTrack): boolean;

  /**
   * ```
   * boolean _ = reaper.IsTrackVisible(MediaTrack track, boolean mixer)
   * ```
   * If mixer==true, returns true if the track is visible in the mixer.  If mixer==false, returns true if the track is visible in the track control panel.
   */
  function IsTrackVisible(track: MediaTrack, mixer: boolean): boolean;

  /**
   * ```
   * joystick_device _ = reaper.joystick_create(string guidGUID)
   * ```
   * creates a joystick device
   */
  function joystick_create(guidGUID: string): joystick_device;

  /**
   * ```
   * reaper.joystick_destroy(joystick_device device)
   * ```
   * destroys a joystick device
   */
  function joystick_destroy(device: joystick_device): void;

  /**
   * ```
   * string retval, optional string namestr = reaper.joystick_enum(integer index)
   * ```
   * enumerates installed devices, returns GUID as a string
   */
  function joystick_enum(index: number): LuaMultiReturn<[string, string]>;

  /**
   * ```
   * number _ = reaper.joystick_getaxis(joystick_device dev, integer axis)
   * ```
   * returns axis value (-1..1)
   */
  function joystick_getaxis(dev: joystick_device, axis: number): number;

  /**
   * ```
   * integer _ = reaper.joystick_getbuttonmask(joystick_device dev)
   * ```
   * returns button pressed mask, 1=first button, 2=second...
   */
  function joystick_getbuttonmask(dev: joystick_device): number;

  /**
   * ```
   * integer retval, optional integer axes, optional integer povs = reaper.joystick_getinfo(joystick_device dev)
   * ```
   * returns button count
   */
  function joystick_getinfo(
    dev: joystick_device,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * number _ = reaper.joystick_getpov(joystick_device dev, integer pov)
   * ```
   * returns POV value (usually 0..655.35, or 655.35 on error)
   */
  function joystick_getpov(dev: joystick_device, pov: number): number;

  /**
   * ```
   * boolean _ = reaper.joystick_update(joystick_device dev)
   * ```
   * Updates joystick state from hardware, returns true if successful (joystick_get* will not be valid until joystick_update() is called successfully)
   */
  function joystick_update(dev: joystick_device): boolean;

  /**
   * ```
   * integer retval, string name = reaper.kbd_enumerateActions(KbdSectionInfo section, integer idx)
   * ```
   */
  function kbd_enumerateActions(
    section: KbdSectionInfo,
    idx: number,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * string _ = reaper.kbd_getTextFromCmd(integer cmd, KbdSectionInfo section)
   * ```
   */
  function kbd_getTextFromCmd(cmd: number, section: KbdSectionInfo): string;

  /**
   * ```
   * boolean retval, integer pX1, integer pY1, integer pX2, integer pY2 = reaper.LICE_ClipLine(integer pX1, integer pY1, integer pX2, integer pY2, integer xLo, integer yLo, integer xHi, integer yHi)
   * ```
   * Returns false if the line is entirely offscreen.
   */
  function LICE_ClipLine(
    pX1: number,
    pY1: number,
    pX2: number,
    pY2: number,
    xLo: number,
    yLo: number,
    xHi: number,
    yHi: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * string _ = reaper.LocalizeString(string src_string, string section, integer flags)
   * ```
   * Returns a localized version of src_string, in section section. flags can have 1 set to only localize if sprintf-style formatting matches the original.
   */
  function LocalizeString(
    src_string: string,
    section: string,
    flags: number,
  ): string;

  /**
   * ```
   * boolean _ = reaper.Loop_OnArrow(ReaProject project, integer direction)
   * ```
   * Move the loop selection left or right. Returns true if snap is enabled.
   */
  function Loop_OnArrow(project: ReaProject, direction: number): boolean;

  /**
   * ```
   * reaper.Main_OnCommand(integer command, integer flag)
   * ```
   * See Main_OnCommandEx.
   */
  function Main_OnCommand(command: number, flag: number): void;

  /**
   * ```
   * reaper.Main_OnCommandEx(integer command, integer flag, ReaProject proj)
   * ```
   * Performs an action belonging to the main action section. To perform non-native actions (ReaScripts, custom or extension plugins' actions) safely, see NamedCommandLookup().
   */
  function Main_OnCommandEx(
    command: number,
    flag: number,
    proj: ReaProject,
  ): void;

  /**
   * ```
   * reaper.Main_openProject(string name)
   * ```
   * opens a project. will prompt the user to save unless name is prefixed with 'noprompt:'. If name is prefixed with 'template:', project file will be loaded as a template.
   *
   * If passed a .RTrackTemplate file, adds the template to the existing project.
   */
  function Main_openProject(name: string): void;

  /**
   * ```
   * reaper.Main_SaveProject(ReaProject proj, boolean forceSaveAsIn)
   * ```
   * Save the project.
   */
  function Main_SaveProject(proj: ReaProject, forceSaveAsIn: boolean): void;

  /**
   * ```
   * reaper.Main_SaveProjectEx(ReaProject proj, string filename, integer options)
   * ```
   * Save the project. options: &1=save selected tracks as track template, &2=include media with track template, &4=include envelopes with track template. See Main_openProject, Main_SaveProject.
   */
  function Main_SaveProjectEx(
    proj: ReaProject,
    filename: string,
    options: number,
  ): void;

  /**
   * ```
   * reaper.Main_UpdateLoopInfo(integer ignoremask)
   * ```
   */
  function Main_UpdateLoopInfo(ignoremask: number): void;

  /**
   * ```
   * reaper.MarkProjectDirty(ReaProject proj)
   * ```
   * Marks project as dirty (needing save) if 'undo/prompt to save' is enabled in preferences.
   */
  function MarkProjectDirty(proj: ReaProject): void;

  /**
   * ```
   * reaper.MarkTrackItemsDirty(MediaTrack track, MediaItem item)
   * ```
   * If track is supplied, item is ignored
   */
  function MarkTrackItemsDirty(track: MediaTrack, item: MediaItem): void;

  /**
   * ```
   * number _ = reaper.Master_GetPlayRate(ReaProject project)
   * ```
   */
  function Master_GetPlayRate(project: ReaProject): number;

  /**
   * ```
   * number _ = reaper.Master_GetPlayRateAtTime(number time_s, ReaProject proj)
   * ```
   */
  function Master_GetPlayRateAtTime(time_s: number, proj: ReaProject): number;

  /**
   * ```
   * number _ = reaper.Master_GetTempo()
   * ```
   */
  function Master_GetTempo(): number;

  /**
   * ```
   * number _ = reaper.Master_NormalizePlayRate(number playrate, boolean isnormalized)
   * ```
   * Convert play rate to/from a value between 0 and 1, representing the position on the project playrate slider.
   */
  function Master_NormalizePlayRate(
    playrate: number,
    isnormalized: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.Master_NormalizeTempo(number bpm, boolean isnormalized)
   * ```
   * Convert the tempo to/from a value between 0 and 1, representing bpm in the range of 40-296 bpm.
   */
  function Master_NormalizeTempo(bpm: number, isnormalized: boolean): number;

  /**
   * ```
   * integer _ = reaper.MB(string msg, string title, integer type)
   * ```
   * type 0=OK,1=OKCANCEL,2=ABORTRETRYIGNORE,3=YESNOCANCEL,4=YESNO,5=RETRYCANCEL : ret 1=OK,2=CANCEL,3=ABORT,4=RETRY,5=IGNORE,6=YES,7=NO
   */
  function MB(msg: string, title: string, type: number): number;

  /**
   * ```
   * integer _ = reaper.MediaItemDescendsFromTrack(MediaItem item, MediaTrack track)
   * ```
   * Returns 1 if the track holds the item, 2 if the track is a folder containing the track that holds the item, etc.
   */
  function MediaItemDescendsFromTrack(
    item: MediaItem,
    track: MediaTrack,
  ): number;

  /**
   * ```
   * boolean retval, string hash = reaper.Menu_GetHash(string menuname, integer flag)
   * ```
   * Get a string that only changes when menu/toolbar entries are added or removed (not re-ordered). Can be used to determine if a customized menu/toolbar differs from the default, or if the default changed after a menu/toolbar was customized. flag==0: current default menu/toolbar; flag==1: current customized menu/toolbar; flag==2: default menu/toolbar at the time the current menu/toolbar was most recently customized, if it was customized in REAPER v7.08 or later.
   */
  function Menu_GetHash(
    menuname: string,
    flag: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer retval, integer notecnt, integer ccevtcnt, integer textsyxevtcnt = reaper.MIDI_CountEvts(MediaItem_Take take)
   * ```
   * Count the number of notes, CC events, and text/sysex events in a given MIDI item.
   */
  function MIDI_CountEvts(
    take: MediaItem_Take,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.MIDI_DeleteCC(MediaItem_Take take, integer ccidx)
   * ```
   * Delete a MIDI CC event.
   */
  function MIDI_DeleteCC(take: MediaItem_Take, ccidx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_DeleteEvt(MediaItem_Take take, integer evtidx)
   * ```
   * Delete a MIDI event.
   */
  function MIDI_DeleteEvt(take: MediaItem_Take, evtidx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_DeleteNote(MediaItem_Take take, integer noteidx)
   * ```
   * Delete a MIDI note.
   */
  function MIDI_DeleteNote(take: MediaItem_Take, noteidx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_DeleteTextSysexEvt(MediaItem_Take take, integer textsyxevtidx)
   * ```
   * Delete a MIDI text or sysex event.
   */
  function MIDI_DeleteTextSysexEvt(
    take: MediaItem_Take,
    textsyxevtidx: number,
  ): boolean;

  /**
   * ```
   * reaper.MIDI_DisableSort(MediaItem_Take take)
   * ```
   * Disable sorting for all MIDI insert, delete, get and set functions, until MIDI_Sort is called.
   */
  function MIDI_DisableSort(take: MediaItem_Take): void;

  /**
   * ```
   * integer _ = reaper.MIDI_EnumSelCC(MediaItem_Take take, integer ccidx)
   * ```
   * Returns the index of the next selected MIDI CC event after ccidx (-1 if there are no more selected events).
   */
  function MIDI_EnumSelCC(take: MediaItem_Take, ccidx: number): number;

  /**
   * ```
   * integer _ = reaper.MIDI_EnumSelEvts(MediaItem_Take take, integer evtidx)
   * ```
   * Returns the index of the next selected MIDI event after evtidx (-1 if there are no more selected events).
   */
  function MIDI_EnumSelEvts(take: MediaItem_Take, evtidx: number): number;

  /**
   * ```
   * integer _ = reaper.MIDI_EnumSelNotes(MediaItem_Take take, integer noteidx)
   * ```
   * Returns the index of the next selected MIDI note after noteidx (-1 if there are no more selected events).
   */
  function MIDI_EnumSelNotes(take: MediaItem_Take, noteidx: number): number;

  /**
   * ```
   * integer _ = reaper.MIDI_EnumSelTextSysexEvts(MediaItem_Take take, integer textsyxidx)
   * ```
   * Returns the index of the next selected MIDI text/sysex event after textsyxidx (-1 if there are no more selected events).
   */
  function MIDI_EnumSelTextSysexEvts(
    take: MediaItem_Take,
    textsyxidx: number,
  ): number;

  /**
   * ```
   * boolean retval, string buf = reaper.MIDI_GetAllEvts(MediaItem_Take take)
   * ```
   * Get all MIDI data. MIDI buffer is returned as a list of { int offset, char flag, int msglen, unsigned char msg[] }.
   *
   * offset: MIDI ticks from previous event
   *
   * flag: &1=selected &2=muted
   *
   * flag high 4 bits for CC shape: &16=linear, &32=slow start/end, &16|32=fast start, &64=fast end, &64|16=bezier
   *
   * msg: the MIDI message.
   *
   * A meta-event of type 0xF followed by 'CCBZ ' and 5 more bytes represents bezier curve data for the previous MIDI event: 1 byte for the bezier type (usually 0) and 4 bytes for the bezier tension as a float.
   *
   * For tick intervals longer than a 32 bit word can represent, zero-length meta events may be placed between valid events.
   *
   * See MIDI_SetAllEvts.
   */
  function MIDI_GetAllEvts(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean selected, boolean muted, number ppqpos, integer chanmsg, integer chan, integer msg2, integer msg3 = reaper.MIDI_GetCC(MediaItem_Take take, integer ccidx)
   * ```
   * Get MIDI CC event properties.
   */
  function MIDI_GetCC(
    take: MediaItem_Take,
    ccidx: number,
  ): LuaMultiReturn<
    [boolean, boolean, boolean, number, number, number, number, number]
  >;

  /**
   * ```
   * boolean retval, integer shape, number beztension = reaper.MIDI_GetCCShape(MediaItem_Take take, integer ccidx)
   * ```
   * Get CC shape and bezier tension. See MIDI_GetCC, MIDI_SetCCShape
   */
  function MIDI_GetCCShape(
    take: MediaItem_Take,
    ccidx: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, boolean selected, boolean muted, number ppqpos, string msg = reaper.MIDI_GetEvt(MediaItem_Take take, integer evtidx)
   * ```
   * Get MIDI event properties.
   */
  function MIDI_GetEvt(
    take: MediaItem_Take,
    evtidx: number,
  ): LuaMultiReturn<[boolean, boolean, boolean, number, string]>;

  /**
   * ```
   * number retval, optional number swing, optional number noteLen = reaper.MIDI_GetGrid(MediaItem_Take take)
   * ```
   * Returns the most recent MIDI editor grid size for this MIDI take, in QN. Swing is between 0 and 1. Note length is 0 if it follows the grid size.
   */
  function MIDI_GetGrid(
    take: MediaItem_Take,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * boolean retval, string hash = reaper.MIDI_GetHash(MediaItem_Take take, boolean notesonly)
   * ```
   * Get a string that only changes when the MIDI data changes. If notesonly==true, then the string changes only when the MIDI notes change. See MIDI_GetTrackHash
   */
  function MIDI_GetHash(
    take: MediaItem_Take,
    notesonly: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean selected, boolean muted, number startppqpos, number endppqpos, integer chan, integer pitch, integer vel = reaper.MIDI_GetNote(MediaItem_Take take, integer noteidx)
   * ```
   * Get MIDI note properties.
   */
  function MIDI_GetNote(
    take: MediaItem_Take,
    noteidx: number,
  ): LuaMultiReturn<
    [boolean, boolean, boolean, number, number, number, number, number]
  >;

  /**
   * ```
   * number _ = reaper.MIDI_GetPPQPos_EndOfMeasure(MediaItem_Take take, number ppqpos)
   * ```
   * Returns the MIDI tick (ppq) position corresponding to the end of the measure.
   */
  function MIDI_GetPPQPos_EndOfMeasure(
    take: MediaItem_Take,
    ppqpos: number,
  ): number;

  /**
   * ```
   * number _ = reaper.MIDI_GetPPQPos_StartOfMeasure(MediaItem_Take take, number ppqpos)
   * ```
   * Returns the MIDI tick (ppq) position corresponding to the start of the measure.
   */
  function MIDI_GetPPQPos_StartOfMeasure(
    take: MediaItem_Take,
    ppqpos: number,
  ): number;

  /**
   * ```
   * number _ = reaper.MIDI_GetPPQPosFromProjQN(MediaItem_Take take, number projqn)
   * ```
   * Returns the MIDI tick (ppq) position corresponding to a specific project time in quarter notes.
   */
  function MIDI_GetPPQPosFromProjQN(
    take: MediaItem_Take,
    projqn: number,
  ): number;

  /**
   * ```
   * number _ = reaper.MIDI_GetPPQPosFromProjTime(MediaItem_Take take, number projtime)
   * ```
   * Returns the MIDI tick (ppq) position corresponding to a specific project time in seconds.
   */
  function MIDI_GetPPQPosFromProjTime(
    take: MediaItem_Take,
    projtime: number,
  ): number;

  /**
   * ```
   * number _ = reaper.MIDI_GetProjQNFromPPQPos(MediaItem_Take take, number ppqpos)
   * ```
   * Returns the project time in quarter notes corresponding to a specific MIDI tick (ppq) position.
   */
  function MIDI_GetProjQNFromPPQPos(
    take: MediaItem_Take,
    ppqpos: number,
  ): number;

  /**
   * ```
   * number _ = reaper.MIDI_GetProjTimeFromPPQPos(MediaItem_Take take, number ppqpos)
   * ```
   * Returns the project time in seconds corresponding to a specific MIDI tick (ppq) position.
   */
  function MIDI_GetProjTimeFromPPQPos(
    take: MediaItem_Take,
    ppqpos: number,
  ): number;

  /**
   * ```
   * integer retval, string buf, integer ts, integer devIdx, number projPos, integer projLoopCnt = reaper.MIDI_GetRecentInputEvent(integer idx)
   * ```
   * Gets a recent MIDI input event from the global history. idx=0 for the most recent event, which also latches to the latest MIDI event state (to get a more recent list, calling with idx=0 is necessary). idx=1 next most recent event, returns a non-zero sequence number for the event, or zero if no more events. tsOut will be set to the timestamp in samples relative to the current position (0 is current, -48000 is one second ago, etc). devIdxOut will have the low 16 bits set to the input device index, and 0x10000 will be set if device was enabled only for control. projPosOut will be set to project position in seconds if project was playing back at time of event, otherwise -1. Large SysEx events will not be included in this event list.
   */
  function MIDI_GetRecentInputEvent(
    idx: number,
  ): LuaMultiReturn<[number, string, number, number, number, number]>;

  /**
   * ```
   * boolean retval, integer root, integer scale, string name = reaper.MIDI_GetScale(MediaItem_Take take)
   * ```
   * Get the active scale in the media source, if any. root 0=C, 1=C#, etc. scale &0x1=root, &0x2=minor 2nd, &0x4=major 2nd, &0x8=minor 3rd, &0xF=fourth, etc.
   */
  function MIDI_GetScale(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, number, number, string]>;

  /**
   * ```
   * boolean retval, optional boolean selected, optional boolean muted, optional number ppqpos, optional integer type, optional string msg = reaper.MIDI_GetTextSysexEvt(MediaItem_Take take, integer textsyxevtidx, optional boolean selected, optional boolean muted, optional number ppqpos, optional integer type, optional string msg)
   * ```
   * Get MIDI meta-event properties. Allowable types are -1:sysex (msg should not include bounding F0..F7), 1-14:MIDI text event types, 15=REAPER notation event. For all other meta-messages, type is returned as -2 and msg returned as all zeroes. See MIDI_GetEvt.
   */
  function MIDI_GetTextSysexEvt(
    take: MediaItem_Take,
    textsyxevtidx: number,
    selected?: boolean,
    muted?: boolean,
    ppqpos?: number,
    type?: number,
    msg?: string,
  ): LuaMultiReturn<[boolean, boolean, boolean, number, number, string]>;

  /**
   * ```
   * boolean retval, string hash = reaper.MIDI_GetTrackHash(MediaTrack track, boolean notesonly)
   * ```
   * Get a string that only changes when the MIDI data changes. If notesonly==true, then the string changes only when the MIDI notes change. See MIDI_GetHash
   */
  function MIDI_GetTrackHash(
    track: MediaTrack,
    notesonly: boolean,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * reaper.midi_init(integer force_reinit_input, integer force_reinit_output)
   * ```
   * Opens MIDI devices as configured in preferences. force_reinit_input and force_reinit_output force a particular device index to close/re-open (pass -1 to not force any devices to reopen).
   */
  function midi_init(
    force_reinit_input: number,
    force_reinit_output: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.MIDI_InsertCC(MediaItem_Take take, boolean selected, boolean muted, number ppqpos, integer chanmsg, integer chan, integer msg2, integer msg3)
   * ```
   * Insert a new MIDI CC event.
   */
  function MIDI_InsertCC(
    take: MediaItem_Take,
    selected: boolean,
    muted: boolean,
    ppqpos: number,
    chanmsg: number,
    chan: number,
    msg2: number,
    msg3: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_InsertEvt(MediaItem_Take take, boolean selected, boolean muted, number ppqpos, string bytestr)
   * ```
   * Insert a new MIDI event.
   */
  function MIDI_InsertEvt(
    take: MediaItem_Take,
    selected: boolean,
    muted: boolean,
    ppqpos: number,
    bytestr: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_InsertNote(MediaItem_Take take, boolean selected, boolean muted, number startppqpos, number endppqpos, integer chan, integer pitch, integer vel, optional boolean noSortIn)
   * ```
   * Insert a new MIDI note. Set noSort if inserting multiple events, then call MIDI_Sort when done.
   */
  function MIDI_InsertNote(
    take: MediaItem_Take,
    selected: boolean,
    muted: boolean,
    startppqpos: number,
    endppqpos: number,
    chan: number,
    pitch: number,
    vel: number,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_InsertTextSysexEvt(MediaItem_Take take, boolean selected, boolean muted, number ppqpos, integer type, string bytestr)
   * ```
   * Insert a new MIDI text or sysex event. Allowable types are -1:sysex (msg should not include bounding F0..F7), 1-14:MIDI text event types, 15=REAPER notation event.
   */
  function MIDI_InsertTextSysexEvt(
    take: MediaItem_Take,
    selected: boolean,
    muted: boolean,
    ppqpos: number,
    type: number,
    bytestr: string,
  ): boolean;

  /**
   * ```
   * reaper.MIDI_RefreshEditors(MediaItem_Take tk)
   * ```
   * Synchronously updates any open MIDI editors for MIDI take
   */
  function MIDI_RefreshEditors(tk: MediaItem_Take): void;

  /**
   * ```
   * reaper.midi_reinit()
   * ```
   * Reset (close and re-open) all MIDI devices
   */
  function midi_reinit(): void;

  /**
   * ```
   * reaper.MIDI_SelectAll(MediaItem_Take take, boolean select)
   * ```
   * Select or deselect all MIDI content.
   */
  function MIDI_SelectAll(take: MediaItem_Take, select: boolean): void;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetAllEvts(MediaItem_Take take, string buf)
   * ```
   * Set all MIDI data. MIDI buffer is passed in as a list of { int offset, char flag, int msglen, unsigned char msg[] }.
   *
   * offset: MIDI ticks from previous event
   *
   * flag: &1=selected &2=muted
   *
   * flag high 4 bits for CC shape: &16=linear, &32=slow start/end, &16|32=fast start, &64=fast end, &64|16=bezier
   *
   * msg: the MIDI message.
   *
   * A meta-event of type 0xF followed by 'CCBZ ' and 5 more bytes represents bezier curve data for the previous MIDI event: 1 byte for the bezier type (usually 0) and 4 bytes for the bezier tension as a float.
   *
   * For tick intervals longer than a 32 bit word can represent, zero-length meta events may be placed between valid events.
   *
   * See MIDI_GetAllEvts.
   */
  function MIDI_SetAllEvts(take: MediaItem_Take, buf: string): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetCC(MediaItem_Take take, integer ccidx, optional boolean selectedIn, optional boolean mutedIn, optional number ppqposIn, optional integer chanmsgIn, optional integer chanIn, optional integer msg2In, optional integer msg3In, optional boolean noSortIn)
   * ```
   * Set MIDI CC event properties. Properties passed as NULL will not be set. set noSort if setting multiple events, then call MIDI_Sort when done.
   */
  function MIDI_SetCC(
    take: MediaItem_Take,
    ccidx: number,
    selectedIn?: boolean,
    mutedIn?: boolean,
    ppqposIn?: number,
    chanmsgIn?: number,
    chanIn?: number,
    msg2In?: number,
    msg3In?: number,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetCCShape(MediaItem_Take take, integer ccidx, integer shape, number beztension, optional boolean noSortIn)
   * ```
   * Set CC shape and bezier tension. set noSort if setting multiple events, then call MIDI_Sort when done. See MIDI_SetCC, MIDI_GetCCShape
   */
  function MIDI_SetCCShape(
    take: MediaItem_Take,
    ccidx: number,
    shape: number,
    beztension: number,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetEvt(MediaItem_Take take, integer evtidx, optional boolean selectedIn, optional boolean mutedIn, optional number ppqposIn, optional string msg, optional boolean noSortIn)
   * ```
   * Set MIDI event properties. Properties passed as NULL will not be set.  set noSort if setting multiple events, then call MIDI_Sort when done.
   */
  function MIDI_SetEvt(
    take: MediaItem_Take,
    evtidx: number,
    selectedIn?: boolean,
    mutedIn?: boolean,
    ppqposIn?: number,
    msg?: string,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetItemExtents(MediaItem item, number startQN, number endQN)
   * ```
   * Set the start/end positions of a media item that contains a MIDI take.
   */
  function MIDI_SetItemExtents(
    item: MediaItem,
    startQN: number,
    endQN: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetNote(MediaItem_Take take, integer noteidx, optional boolean selectedIn, optional boolean mutedIn, optional number startppqposIn, optional number endppqposIn, optional integer chanIn, optional integer pitchIn, optional integer velIn, optional boolean noSortIn)
   * ```
   * Set MIDI note properties. Properties passed as NULL (or negative values) will not be set. Set noSort if setting multiple events, then call MIDI_Sort when done. Setting multiple note start positions at once is done more safely by deleting and re-inserting the notes.
   */
  function MIDI_SetNote(
    take: MediaItem_Take,
    noteidx: number,
    selectedIn?: boolean,
    mutedIn?: boolean,
    startppqposIn?: number,
    endppqposIn?: number,
    chanIn?: number,
    pitchIn?: number,
    velIn?: number,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDI_SetTextSysexEvt(MediaItem_Take take, integer textsyxevtidx, optional boolean selectedIn, optional boolean mutedIn, optional number ppqposIn, optional integer typeIn, optional string msg, optional boolean noSortIn)
   * ```
   * Set MIDI text or sysex event properties. Properties passed as NULL will not be set. Allowable types are -1:sysex (msg should not include bounding F0..F7), 1-14:MIDI text event types, 15=REAPER notation event. set noSort if setting multiple events, then call MIDI_Sort when done.
   */
  function MIDI_SetTextSysexEvt(
    take: MediaItem_Take,
    textsyxevtidx: number,
    selectedIn?: boolean,
    mutedIn?: boolean,
    ppqposIn?: number,
    typeIn?: number,
    msg?: string,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * reaper.MIDI_Sort(MediaItem_Take take)
   * ```
   * Sort MIDI events after multiple calls to MIDI_SetNote, MIDI_SetCC, etc.
   */
  function MIDI_Sort(take: MediaItem_Take): void;

  /**
   * ```
   * MediaItem_Take _ = reaper.MIDIEditor_EnumTakes(HWND midieditor, integer takeindex, boolean editable_only)
   * ```
   * list the takes that are currently being edited in this MIDI editor, starting with the active take. See MIDIEditor_GetTake
   */
  function MIDIEditor_EnumTakes(
    midieditor: HWND,
    takeindex: number,
    editable_only: boolean,
  ): MediaItem_Take | null;

  /**
   * ```
   * HWND _ = reaper.MIDIEditor_GetActive()
   * ```
   * get a pointer to the focused MIDI editor window
   *
   * see MIDIEditor_GetMode, MIDIEditor_OnCommand
   */
  function MIDIEditor_GetActive(): HWND | null;

  /**
   * ```
   * integer _ = reaper.MIDIEditor_GetMode(HWND midieditor)
   * ```
   * get the mode of a MIDI editor (0=piano roll, 1=event list, -1=invalid editor)
   *
   * see MIDIEditor_GetActive, MIDIEditor_OnCommand
   */
  function MIDIEditor_GetMode(midieditor: HWND): number;

  /**
   * ```
   * integer _ = reaper.MIDIEditor_GetSetting_int(HWND midieditor, string setting_desc)
   * ```
   * Get settings from a MIDI editor. setting_desc can be:
   *
   * snap_enabled: returns 0 or 1
   *
   * active_note_row: returns 0-127
   *
   * last_clicked_cc_lane: returns 0-127=CC, 0x100|(0-31)=14-bit CC, 0x200=velocity, 0x201=pitch, 0x202=program, 0x203=channel pressure, 0x204=bank/program select, 0x205=text, 0x206=sysex, 0x207=off velocity, 0x208=notation events, 0x210=media item lane
   *
   * default_note_vel: returns 0-127
   *
   * default_note_chan: returns 0-15
   *
   * default_note_len: returns default length in MIDI ticks
   *
   * scale_enabled: returns 0-1
   *
   * scale_root: returns 0-12 (0=C)
   *
   * list_cnt: if viewing list view, returns event count
   *
   * if setting_desc is unsupported, the function returns -1.
   *
   * See MIDIEditor_SetSetting_int, MIDIEditor_GetActive, MIDIEditor_GetSetting_str
   */
  function MIDIEditor_GetSetting_int(
    midieditor: HWND,
    setting_desc: string,
  ): number;

  /**
   * ```
   * boolean retval, string buf = reaper.MIDIEditor_GetSetting_str(HWND midieditor, string setting_desc)
   * ```
   * Get settings from a MIDI editor. setting_desc can be:
   *
   * last_clicked_cc_lane: returns text description ("velocity", "pitch", etc)
   *
   * scale: returns the scale record, for example "102034050607" for a major scale
   *
   * list_X: if viewing list view, returns string describing event at row X (0-based). String will have a list of key=value pairs, e.g. 'pos=4.0 len=4.0 offvel=127 msg=90317F'. pos/len times are in QN, len/offvel may not be present if event is not a note. other keys which may be present include pos_pq/len_pq, sel, mute, ccval14, ccshape, ccbeztension.
   *
   * if setting_desc is unsupported, the function returns false.
   *
   * See MIDIEditor_GetActive, MIDIEditor_GetSetting_int
   */
  function MIDIEditor_GetSetting_str(
    midieditor: HWND,
    setting_desc: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * MediaItem_Take _ = reaper.MIDIEditor_GetTake(HWND midieditor)
   * ```
   * get the take that is currently being edited in this MIDI editor. see MIDIEditor_EnumTakes
   */
  function MIDIEditor_GetTake(midieditor: HWND): MediaItem_Take;

  /**
   * ```
   * boolean _ = reaper.MIDIEditor_LastFocused_OnCommand(integer command_id, boolean islistviewcommand)
   * ```
   * Send an action command to the last focused MIDI editor. Returns false if there is no MIDI editor open, or if the view mode (piano roll or event list) does not match the input.
   *
   * see MIDIEditor_OnCommand
   */
  function MIDIEditor_LastFocused_OnCommand(
    command_id: number,
    islistviewcommand: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDIEditor_OnCommand(HWND midieditor, integer command_id)
   * ```
   * Send an action command to a MIDI editor. Returns false if the supplied MIDI editor pointer is not valid (not an open MIDI editor).
   *
   * see MIDIEditor_GetActive, MIDIEditor_LastFocused_OnCommand
   */
  function MIDIEditor_OnCommand(midieditor: HWND, command_id: number): boolean;

  /**
   * ```
   * boolean _ = reaper.MIDIEditor_SetSetting_int(HWND midieditor, string setting_desc, integer setting)
   * ```
   * Set settings for a MIDI editor. setting_desc can be:
   *
   * active_note_row: 0-127
   *
   * See MIDIEditor_GetSetting_int
   */
  function MIDIEditor_SetSetting_int(
    midieditor: HWND,
    setting_desc: string,
    setting: number,
  ): boolean;

  /**
   * ```
   * integer pitchwheelrange, integer flags = reaper.MIDIEditorFlagsForTrack(MediaTrack track, integer pitchwheelrange, integer flags, boolean is_set)
   * ```
   * Get or set MIDI editor settings for this track. pitchwheelrange: semitones up or down. flags &1: snap pitch lane edits to semitones if pitchwheel range is defined.
   */
  function MIDIEditorFlagsForTrack(
    track: MediaTrack,
    pitchwheelrange: number,
    flags: number,
    is_set: boolean,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * string strNeed64 = reaper.mkpanstr(string strNeed64, number pan)
   * ```
   */
  function mkpanstr(strNeed64: string, pan: number): string;

  /**
   * ```
   * string strNeed64 = reaper.mkvolpanstr(string strNeed64, number vol, number pan)
   * ```
   */
  function mkvolpanstr(strNeed64: string, vol: number, pan: number): string;

  /**
   * ```
   * string strNeed64 = reaper.mkvolstr(string strNeed64, number vol)
   * ```
   */
  function mkvolstr(strNeed64: string, vol: number): string;

  /**
   * ```
   * reaper.MoveEditCursor(number adjamt, boolean dosel)
   * ```
   */
  function MoveEditCursor(adjamt: number, dosel: boolean): void;

  /**
   * ```
   * boolean _ = reaper.MoveMediaItemToTrack(MediaItem item, MediaTrack desttr)
   * ```
   * returns TRUE if move succeeded
   */
  function MoveMediaItemToTrack(item: MediaItem, desttr: MediaTrack): boolean;

  /**
   * ```
   * reaper.MuteAllTracks(boolean mute)
   * ```
   */
  function MuteAllTracks(mute: boolean): void;

  /**
   * ```
   * reaper.my_getViewport(integer r_left, integer r_top, integer r_right, integer r_bot, integer sr_left, integer sr_top, integer sr_right, integer sr_bot, boolean wantWorkArea)
   * ```
   */
  function my_getViewport(
    r_left: number,
    r_top: number,
    r_right: number,
    r_bot: number,
    sr_left: number,
    sr_top: number,
    sr_right: number,
    sr_bot: number,
    wantWorkArea: boolean,
  ): void;

  /**
   * ```
   * integer _ = reaper.NamedCommandLookup(string command_name)
   * ```
   * Get the command ID number for named command that was registered by an extension such as "_SWS_ABOUT" or "_113088d11ae641c193a2b7ede3041ad5" for a ReaScript or a custom action.
   */
  function NamedCommandLookup(command_name: string): number;

  /**
   * ```
   * reaper.OnPauseButton()
   * ```
   * direct way to simulate pause button hit
   */
  function OnPauseButton(): void;

  /**
   * ```
   * reaper.OnPauseButtonEx(ReaProject proj)
   * ```
   * direct way to simulate pause button hit
   */
  function OnPauseButtonEx(proj: ReaProject): void;

  /**
   * ```
   * reaper.OnPlayButton()
   * ```
   * direct way to simulate play button hit
   */
  function OnPlayButton(): void;

  /**
   * ```
   * reaper.OnPlayButtonEx(ReaProject proj)
   * ```
   * direct way to simulate play button hit
   */
  function OnPlayButtonEx(proj: ReaProject): void;

  /**
   * ```
   * reaper.OnStopButton()
   * ```
   * direct way to simulate stop button hit
   */
  function OnStopButton(): void;

  /**
   * ```
   * reaper.OnStopButtonEx(ReaProject proj)
   * ```
   * direct way to simulate stop button hit
   */
  function OnStopButtonEx(proj: ReaProject): void;

  /**
   * ```
   * boolean _ = reaper.OpenColorThemeFile(string fn)
   * ```
   */
  function OpenColorThemeFile(fn: string): boolean;

  /**
   * ```
   * HWND _ = reaper.OpenMediaExplorer(string mediafn, boolean play)
   * ```
   * Opens mediafn in the Media Explorer, play=true will play the file immediately (or toggle playback if mediafn was already open), =false will just select it.
   */
  function OpenMediaExplorer(mediafn: string, play: boolean): HWND;

  /**
   * ```
   * reaper.OscLocalMessageToHost(string message, optional number valueIn)
   * ```
   * Send an OSC message directly to REAPER. The value argument may be NULL. The message will be matched against the default OSC patterns.
   */
  function OscLocalMessageToHost(message: string, valueIn?: number): void;

  /**
   * ```
   * number _ = reaper.parse_timestr(string buf)
   * ```
   * Parse hh:mm:ss.sss time string, return time in seconds (or 0.0 on error). See parse_timestr_pos, parse_timestr_len.
   */
  function parse_timestr(buf: string): number;

  /**
   * ```
   * number _ = reaper.parse_timestr_len(string buf, number offset, integer modeoverride)
   * ```
   * time formatting mode overrides: -1=proj default.
   *
   * 0=time
   *
   * 1=measures.beats + time
   *
   * 2=measures.beats
   *
   * 3=seconds
   *
   * 4=samples
   *
   * 5=h:m:s:f
   */
  function parse_timestr_len(
    buf: string,
    offset: number,
    modeoverride: number,
  ): number;

  /**
   * ```
   * number _ = reaper.parse_timestr_pos(string buf, integer modeoverride)
   * ```
   * Parse time string, time formatting mode overrides: -1=proj default.
   *
   * 0=time
   *
   * 1=measures.beats + time
   *
   * 2=measures.beats
   *
   * 3=seconds
   *
   * 4=samples
   *
   * 5=h:m:s:f
   */
  function parse_timestr_pos(buf: string, modeoverride: number): number;

  /**
   * ```
   * number _ = reaper.parsepanstr(string str)
   * ```
   */
  function parsepanstr(str: string): number;

  /**
   * ```
   * integer retval, string descstr = reaper.PCM_Sink_Enum(integer idx)
   * ```
   */
  function PCM_Sink_Enum(idx: number): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * string _ = reaper.PCM_Sink_GetExtension(string data)
   * ```
   */
  function PCM_Sink_GetExtension(data: string): string;

  /**
   * ```
   * HWND _ = reaper.PCM_Sink_ShowConfig(string cfg, HWND hwndParent)
   * ```
   */
  function PCM_Sink_ShowConfig(cfg: string, hwndParent: HWND): HWND;

  /**
   * ```
   * integer _ = reaper.PCM_Source_BuildPeaks(PCM_source src, integer mode)
   * ```
   * Calls and returns PCM_source::PeaksBuild_Begin() if mode=0, PeaksBuild_Run() if mode=1, and PeaksBuild_Finish() if mode=2. Normal use is to call PCM_Source_BuildPeaks(src,0), and if that returns nonzero, call PCM_Source_BuildPeaks(src,1) periodically until it returns zero (it returns the percentage of the file remaining), then call PCM_Source_BuildPeaks(src,2) to finalize. If PCM_Source_BuildPeaks(src,0) returns zero, then no further action is necessary.
   */
  function PCM_Source_BuildPeaks(src: PCM_source, mode: number): number;

  /**
   * ```
   * PCM_source _ = reaper.PCM_Source_CreateFromFile(string filename)
   * ```
   * See PCM_Source_CreateFromFileEx.
   */
  function PCM_Source_CreateFromFile(filename: string): PCM_source;

  /**
   * ```
   * PCM_source _ = reaper.PCM_Source_CreateFromFileEx(string filename, boolean forcenoMidiImp)
   * ```
   * Create a PCM_source from filename, and override pref of MIDI files being imported as in-project MIDI events.
   */
  function PCM_Source_CreateFromFileEx(
    filename: string,
    forcenoMidiImp: boolean,
  ): PCM_source;

  /**
   * ```
   * PCM_source _ = reaper.PCM_Source_CreateFromType(string sourcetype)
   * ```
   * Create a PCM_source from a "type" (use this if you're going to load its state via LoadState/ProjectStateContext).
   *
   * Valid types include "WAVE", "MIDI", or whatever plug-ins define as well.
   */
  function PCM_Source_CreateFromType(sourcetype: string): PCM_source;

  /**
   * ```
   * reaper.PCM_Source_Destroy(PCM_source src)
   * ```
   * Deletes a PCM_source -- be sure that you remove any project reference before deleting a source
   */
  function PCM_Source_Destroy(src: PCM_source): void;

  /**
   * ```
   * integer _ = reaper.PCM_Source_GetPeaks(PCM_source src, number peakrate, number starttime, integer numchannels, integer numsamplesperchannel, integer want_extra_type, reaper_array buf)
   * ```
   * Gets block of peak samples to buf. Note that the peak samples are interleaved, but in two or three blocks (maximums, then minimums, then extra). Return value has 20 bits of returned sample count, then 4 bits of output_mode (0xf00000), then a bit to signify whether extra_type was available (0x1000000). extra_type can be 115 ('s') for spectral information, which will return peak samples as integers with the low 15 bits frequency, next 14 bits tonality.
   */
  function PCM_Source_GetPeaks(
    src: PCM_source,
    peakrate: number,
    starttime: number,
    numchannels: number,
    numsamplesperchannel: number,
    want_extra_type: number,
    buf: reaper_array,
  ): number;

  /**
   * ```
   * boolean retval, number offs, number len, boolean rev = reaper.PCM_Source_GetSectionInfo(PCM_source src)
   * ```
   * If a section/reverse block, retrieves offset/len/reverse. return true if success
   */
  function PCM_Source_GetSectionInfo(
    src: PCM_source,
  ): LuaMultiReturn<[boolean, number, number, boolean]>;

  /**
   * ```
   * reaper.PluginWantsAlwaysRunFx(integer amt)
   * ```
   */
  function PluginWantsAlwaysRunFx(amt: number): void;

  /**
   * ```
   * reaper.PreventUIRefresh(integer prevent_count)
   * ```
   * adds prevent_count to the UI refresh prevention state; always add then remove the same amount, or major disfunction will occur
   */
  function PreventUIRefresh(prevent_count: number): void;

  /**
   * ```
   * integer _ = reaper.PromptForAction(integer session_mode, integer init_id, integer section_id)
   * ```
   * Uses the action list to choose an action. Call with session_mode=1 to create a session (init_id will be the initial action to select, or 0), then poll with session_mode=0, checking return value for user-selected action (will return 0 if no action selected yet, or -1 if the action window is no longer available). When finished, call with session_mode=-1.
   */
  function PromptForAction(
    session_mode: number,
    init_id: number,
    section_id: number,
  ): number;

  /**
   * ```
   * reaper.ReaScriptError(string errmsg)
   * ```
   * Causes REAPER to display the error message after the current ReaScript finishes. If called within a Lua context and errmsg has a ! prefix, script execution will be terminated.
   */
  function ReaScriptError(errmsg: string): void;

  /**
   * ```
   * integer _ = reaper.RecursiveCreateDirectory(string path, integer ignored)
   * ```
   * returns positive value on success, 0 on failure.
   */
  function RecursiveCreateDirectory(path: string, ignored: number): number;

  /**
   * ```
   * integer _ = reaper.reduce_open_files(integer flags)
   * ```
   * garbage-collects extra open files and closes them. if flags has 1 set, this is done incrementally (call this from a regular timer, if desired). if flags has 2 set, files are aggressively closed (they may need to be re-opened very soon). returns number of files closed by this call.
   */
  function reduce_open_files(flags: number): number;

  /**
   * ```
   * reaper.RefreshToolbar(integer command_id)
   * ```
   * See RefreshToolbar2.
   */
  function RefreshToolbar(command_id: number): void;

  /**
   * ```
   * reaper.RefreshToolbar2(integer section_id, integer command_id)
   * ```
   * Refresh the toolbar button states of a toggle action.
   */
  function RefreshToolbar2(section_id: number, command_id: number): void;

  /**
   * ```
   * string out = reaper.relative_fn(string _in, string out)
   * ```
   * Makes a filename "in" relative to the current project, if any.
   */
  function relative_fn(_in: string, out: string): string;

  /**
   * ```
   * boolean _ = reaper.RemoveTrackSend(MediaTrack tr, integer category, integer sendidx)
   * ```
   * Remove a send/receive/hardware output, return true on success. category is <0 for receives, 0=sends, >0 for hardware outputs. See CreateTrackSend, GetSetTrackSendInfo, GetTrackSendInfo_Value, SetTrackSendInfo_Value, GetTrackNumSends.
   */
  function RemoveTrackSend(
    tr: MediaTrack,
    category: number,
    sendidx: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.RenderFileSection(string source_filename, string target_filename, number start_percent, number end_percent, number playrate)
   * ```
   * Not available while playing back.
   */
  function RenderFileSection(
    source_filename: string,
    target_filename: string,
    start_percent: number,
    end_percent: number,
    playrate: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ReorderSelectedTracks(integer beforeTrackIdx, integer makePrevFolder)
   * ```
   * Moves all selected tracks to immediately above track specified by index beforeTrackIdx, returns false if no tracks were selected. makePrevFolder=0 for normal, 1 = as child of track preceding track specified by beforeTrackIdx, 2 = if track preceding track specified by beforeTrackIdx is last track in folder, extend folder
   */
  function ReorderSelectedTracks(
    beforeTrackIdx: number,
    makePrevFolder: number,
  ): boolean;

  /**
   * ```
   * string _ = reaper.Resample_EnumModes(integer mode)
   * ```
   */
  function Resample_EnumModes(mode: number): string;

  /**
   * ```
   * string out = reaper.resolve_fn(string _in, string out)
   * ```
   * See resolve_fn2.
   */
  function resolve_fn(_in: string, out: string): string;

  /**
   * ```
   * string out = reaper.resolve_fn2(string _in, string out, optional string checkSubDir)
   * ```
   * Resolves a filename "in" by using project settings etc. If no file found, out will be a copy of in.
   */
  function resolve_fn2(_in: string, out: string, checkSubDir?: string): string;

  /**
   * ```
   * string _ = reaper.ReverseNamedCommandLookup(integer command_id)
   * ```
   * Get the named command for the given command ID. The returned string will not start with '_' (e.g. it will return "SWS_ABOUT"), it will be NULL if command_id is a native action.
   */
  function ReverseNamedCommandLookup(command_id: number): string;

  /**
   * ```
   * number _ = reaper.ScaleFromEnvelopeMode(integer scaling_mode, number val)
   * ```
   * See GetEnvelopeScalingMode.
   */
  function ScaleFromEnvelopeMode(scaling_mode: number, val: number): number;

  /**
   * ```
   * number _ = reaper.ScaleToEnvelopeMode(integer scaling_mode, number val)
   * ```
   * See GetEnvelopeScalingMode.
   */
  function ScaleToEnvelopeMode(scaling_mode: number, val: number): number;

  /**
   * ```
   * KbdSectionInfo _ = reaper.SectionFromUniqueID(integer uniqueID)
   * ```
   */
  function SectionFromUniqueID(uniqueID: number): KbdSectionInfo;

  /**
   * ```
   * reaper.SelectAllMediaItems(ReaProject proj, boolean selected)
   * ```
   */
  function SelectAllMediaItems(proj: ReaProject, selected: boolean): void;

  /**
   * ```
   * reaper.SelectProjectInstance(ReaProject proj)
   * ```
   */
  function SelectProjectInstance(proj: ReaProject): void;

  /**
   * ```
   * reaper.SendMIDIMessageToHardware(integer output, string msg)
   * ```
   * Sends a MIDI message to output device specified by output. Message is sent in immediate mode. Lua example of how to pack the message string:
   *
   * sysex = { 0xF0, 0x00, 0xF7 }
   *
   * msg = ""
   *
   * for i=1, #sysex do msg = msg .. string.char(sysex[i]) end
   */
  function SendMIDIMessageToHardware(output: number, msg: string): void;

  /**
   * ```
   * reaper.SetActiveTake(MediaItem_Take take)
   * ```
   * set this take active in this media item
   */
  function SetActiveTake(take: MediaItem_Take): void;

  /**
   * ```
   * reaper.SetAutomationMode(integer mode, boolean onlySel)
   * ```
   * sets all or selected tracks to mode.
   */
  function SetAutomationMode(mode: number, onlySel: boolean): void;

  /**
   * ```
   * reaper.SetCurrentBPM(ReaProject __proj, number bpm, boolean wantUndo)
   * ```
   * set current BPM in project, set wantUndo=true to add undo point
   */
  function SetCurrentBPM(
    __proj: ReaProject,
    bpm: number,
    wantUndo: boolean,
  ): void;

  /**
   * ```
   * reaper.SetCursorContext(integer mode, TrackEnvelope envIn)
   * ```
   * You must use this to change the focus programmatically. mode=0 to focus track panels, 1 to focus the arrange window, 2 to focus the arrange window and select env (or env==NULL to clear the current track/take envelope selection)
   */
  function SetCursorContext(mode: number, envIn: TrackEnvelope): void;

  /**
   * ```
   * reaper.SetEditCurPos(number time, boolean moveview, boolean seekplay)
   * ```
   */
  function SetEditCurPos(
    time: number,
    moveview: boolean,
    seekplay: boolean,
  ): void;

  /**
   * ```
   * reaper.SetEditCurPos2(ReaProject proj, number time, boolean moveview, boolean seekplay)
   * ```
   */
  function SetEditCurPos2(
    proj: ReaProject,
    time: number,
    moveview: boolean,
    seekplay: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.SetEnvelopePoint(TrackEnvelope envelope, integer ptidx, optional number timeIn, optional number valueIn, optional integer shapeIn, optional number tensionIn, optional boolean selectedIn, optional boolean noSortIn)
   * ```
   * Set attributes of an envelope point. Values that are not supplied will be ignored. If setting multiple points at once, set noSort=true, and call Envelope_SortPoints when done. See SetEnvelopePointEx.
   */
  function SetEnvelopePoint(
    envelope: TrackEnvelope,
    ptidx: number,
    timeIn?: number,
    valueIn?: number,
    shapeIn?: number,
    tensionIn?: number,
    selectedIn?: boolean,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetEnvelopePointEx(TrackEnvelope envelope, integer autoitem_idx, integer ptidx, optional number timeIn, optional number valueIn, optional integer shapeIn, optional number tensionIn, optional boolean selectedIn, optional boolean noSortIn)
   * ```
   * Set attributes of an envelope point. Values that are not supplied will be ignored. If setting multiple points at once, set noSort=true, and call Envelope_SortPoints when done.
   *
   * autoitem_idx=-1 for the underlying envelope, 0 for the first automation item on the envelope, etc.
   *
   * For automation items, pass autoitem_idx|0x10000000 to base ptidx on the number of points in one full loop iteration,
   *
   * even if the automation item is trimmed so that not all points are visible.
   *
   * Otherwise, ptidx will be based on the number of visible points in the automation item, including all loop iterations.
   *
   * See CountEnvelopePointsEx, GetEnvelopePointEx, InsertEnvelopePointEx, DeleteEnvelopePointEx.
   */
  function SetEnvelopePointEx(
    envelope: TrackEnvelope,
    autoitem_idx: number,
    ptidx: number,
    timeIn?: number,
    valueIn?: number,
    shapeIn?: number,
    tensionIn?: number,
    selectedIn?: boolean,
    noSortIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetEnvelopeStateChunk(TrackEnvelope env, string str, boolean isundo)
   * ```
   * Sets the RPPXML state of an envelope, returns true if successful. Undo flag is a performance/caching hint.
   */
  function SetEnvelopeStateChunk(
    env: TrackEnvelope,
    str: string,
    isundo: boolean,
  ): boolean;

  /**
   * ```
   * reaper.SetExtState(string section, string key, string value, boolean persist)
   * ```
   * Set the extended state value for a specific section and key. persist=true means the value should be stored and reloaded the next time REAPER is opened. See GetExtState, DeleteExtState, HasExtState.
   */
  function SetExtState(
    section: string,
    key: string,
    value: string,
    persist: boolean,
  ): void;

  /**
   * ```
   * reaper.SetGlobalAutomationOverride(integer mode)
   * ```
   * mode: see GetGlobalAutomationOverride
   */
  function SetGlobalAutomationOverride(mode: number): void;

  /**
   * ```
   * boolean _ = reaper.SetItemStateChunk(MediaItem item, string str, boolean isundo)
   * ```
   * Sets the RPPXML state of an item, returns true if successful. Undo flag is a performance/caching hint.
   */
  function SetItemStateChunk(
    item: MediaItem,
    str: string,
    isundo: boolean,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.SetMasterTrackVisibility(integer flag)
   * ```
   * set &1 to show the master track in the TCP, &2 to HIDE in the mixer. Returns the previous visibility state. See GetMasterTrackVisibility.
   */
  function SetMasterTrackVisibility(flag: number): number;

  /**
   * ```
   * boolean _ = reaper.SetMediaItemInfo_Value(MediaItem item, string parmname, number newvalue)
   * ```
   * Set media item numerical-value attributes.
   *
   * B_MUTE : bool * : muted (item solo overrides). setting this value will clear C_MUTE_SOLO.
   *
   * B_MUTE_ACTUAL : bool * : muted (ignores solo). setting this value will not affect C_MUTE_SOLO.
   *
   * C_LANEPLAYS : char * : on fixed lane tracks, 0=this item lane does not play, 1=this item lane plays exclusively, 2=this item lane plays and other lanes also play, -1=this item is on a non-visible, non-playing lane on a formerly fixed-lane track (read-only)
   *
   * C_MUTE_SOLO : char * : solo override (-1=soloed, 0=no override, 1=unsoloed). note that this API does not automatically unsolo other items when soloing (nor clear the unsolos when clearing the last soloed item), it must be done by the caller via action or via this API.
   *
   * B_LOOPSRC : bool * : loop source
   *
   * B_ALLTAKESPLAY : bool * : all takes play
   *
   * B_UISEL : bool * : selected in arrange view
   *
   * C_BEATATTACHMODE : char * : item timebase, -1=track or project default, 1=beats (position, length, rate), 2=beats (position only). for auto-stretch timebase: C_BEATATTACHMODE=1, C_AUTOSTRETCH=1
   *
   * C_AUTOSTRETCH: : char * : auto-stretch at project tempo changes, 1=enabled, requires C_BEATATTACHMODE=1
   *
   * C_LOCK : char * : locked, &1=locked
   *
   * D_VOL : double * : item volume,  0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc
   *
   * D_POSITION : double * : item position in seconds
   *
   * D_LENGTH : double * : item length in seconds
   *
   * D_SNAPOFFSET : double * : item snap offset in seconds
   *
   * D_FADEINLEN : double * : item manual fadein length in seconds
   *
   * D_FADEOUTLEN : double * : item manual fadeout length in seconds
   *
   * D_FADEINDIR : double * : item fadein curvature, -1..1
   *
   * D_FADEOUTDIR : double * : item fadeout curvature, -1..1
   *
   * D_FADEINLEN_AUTO : double * : item auto-fadein length in seconds, -1=no auto-fadein
   *
   * D_FADEOUTLEN_AUTO : double * : item auto-fadeout length in seconds, -1=no auto-fadeout
   *
   * C_FADEINSHAPE : int * : fadein shape, 0..6, 0=linear
   *
   * C_FADEOUTSHAPE : int * : fadeout shape, 0..6, 0=linear
   *
   * I_GROUPID : int * : group ID, 0=no group
   *
   * I_LASTY : int * : Y-position (relative to top of track) in pixels (read-only)
   *
   * I_LASTH : int * : height in pixels (read-only)
   *
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   *
   * I_CURTAKE : int * : active take number
   *
   * IP_ITEMNUMBER : int : item number on this track (read-only, returns the item number directly)
   *
   * F_FREEMODE_Y : float * : free item positioning or fixed lane Y-position. 0=top of track, 1.0=bottom of track
   *
   * F_FREEMODE_H : float * : free item positioning or fixed lane height. 0.5=half the track height, 1.0=full track height
   *
   * I_FIXEDLANE : int * : fixed lane of item (fine to call with setNewValue, but returned value is read-only)
   *
   * B_FIXEDLANE_HIDDEN : bool * : true if displaying only one fixed lane and this item is in a different lane (read-only)
   */
  function SetMediaItemInfo_Value(
    item: MediaItem,
    parmname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetMediaItemLength(MediaItem item, number length, boolean refreshUI)
   * ```
   * Redraws the screen only if refreshUI == true.
   *
   * See UpdateArrange().
   */
  function SetMediaItemLength(
    item: MediaItem,
    length: number,
    refreshUI: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetMediaItemPosition(MediaItem item, number position, boolean refreshUI)
   * ```
   * Redraws the screen only if refreshUI == true.
   *
   * See UpdateArrange().
   */
  function SetMediaItemPosition(
    item: MediaItem,
    position: number,
    refreshUI: boolean,
  ): boolean;

  /**
   * ```
   * reaper.SetMediaItemSelected(MediaItem item, boolean selected)
   * ```
   */
  function SetMediaItemSelected(item: MediaItem, selected: boolean): void;

  /**
   * ```
   * boolean _ = reaper.SetMediaItemTake_Source(MediaItem_Take take, PCM_source source)
   * ```
   * Set media source of media item take. The old source will not be destroyed, it is the caller's responsibility to retrieve it and destroy it after. If source already exists in any project, it will be duplicated before being set. C/C++ code should not use this and instead use GetSetMediaItemTakeInfo() with P_SOURCE to manage ownership directly.
   */
  function SetMediaItemTake_Source(
    take: MediaItem_Take,
    source: PCM_source,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetMediaItemTakeInfo_Value(MediaItem_Take take, string parmname, number newvalue)
   * ```
   * Set media item take numerical-value attributes.
   *
   * D_STARTOFFS : double * : start offset in source media, in seconds
   *
   * D_VOL : double * : take volume, 0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc, negative if take polarity is flipped
   *
   * D_PAN : double * : take pan, -1..1
   *
   * D_PANLAW : double * : take pan law, -1=default, 0.5=-6dB, 1.0=+0dB, etc
   *
   * D_PLAYRATE : double * : take playback rate, 0.5=half speed, 1=normal, 2=double speed, etc
   *
   * D_PITCH : double * : take pitch adjustment in semitones, -12=one octave down, 0=normal, +12=one octave up, etc
   *
   * B_PPITCH : bool * : preserve pitch when changing playback rate
   *
   * I_LASTY : int * : Y-position (relative to top of track) in pixels (read-only)
   *
   * I_LASTH : int * : height in pixels (read-only)
   *
   * I_CHANMODE : int * : channel mode, 0=normal, 1=reverse stereo, 2=downmix, 3=left, 4=right
   *
   * I_PITCHMODE : int * : pitch shifter mode, -1=project default, otherwise high 2 bytes=shifter, low 2 bytes=parameter
   *
   * I_STRETCHFLAGS : int * : stretch marker flags (&7 mask for mode override: 0=default, 1=balanced, 2/3/6=tonal, 4=transient, 5=no pre-echo)
   *
   * F_STRETCHFADESIZE : float * : stretch marker fade size in seconds (0.0025 default)
   *
   * I_RECPASSID : int * : record pass ID
   *
   * I_TAKEFX_NCH : int * : number of internal audio channels for per-take FX to use (OK to call with setNewValue, but the returned value is read-only)
   *
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   *
   * IP_TAKENUMBER : int : take number (read-only, returns the take number directly)
   */
  function SetMediaItemTakeInfo_Value(
    take: MediaItem_Take,
    parmname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetMediaTrackInfo_Value(MediaTrack tr, string parmname, number newvalue)
   * ```
   * Set track numerical-value attributes.
   *
   * B_MUTE : bool * : muted
   *
   * B_PHASE : bool * : track phase inverted
   *
   * B_RECMON_IN_EFFECT : bool * : record monitoring in effect (current audio-thread playback state, read-only)
   *
   * IP_TRACKNUMBER : int : track number 1-based, 0=not found, -1=master track (read-only, returns the int directly)
   *
   * I_SOLO : int * : soloed, 0=not soloed, 1=soloed, 2=soloed in place, 5=safe soloed, 6=safe soloed in place
   *
   * B_SOLO_DEFEAT : bool * : when set, if anything else is soloed and this track is not muted, this track acts soloed
   *
   * I_FXEN : int * : fx enabled, 0=bypassed, !0=fx active
   *
   * I_RECARM : int * : record armed, 0=not record armed, 1=record armed
   *
   * I_RECINPUT : int * : record input, <0=no input. if 4096 set, input is MIDI and low 5 bits represent channel (0=all, 1-16=only chan), next 6 bits represent physical input (63=all, 62=VKB). If 4096 is not set, low 10 bits (0..1023) are input start channel (ReaRoute/Loopback start at 512). If 2048 is set, input is multichannel input (using track channel count), or if 1024 is set, input is stereo input, otherwise input is mono.
   *
   * I_RECMODE : int * : record mode, 0=input, 1=stereo out, 2=none, 3=stereo out w/latency compensation, 4=midi output, 5=mono out, 6=mono out w/ latency compensation, 7=midi overdub, 8=midi replace
   *
   * I_RECMODE_FLAGS : int * : record mode flags, &3=output recording mode (0=post fader, 1=pre-fx, 2=post-fx/pre-fader)
   *
   * I_RECMON : int * : record monitoring, 0=off, 1=normal, 2=not when playing (tape style)
   *
   * I_RECMONITEMS : int * : monitor items while recording, 0=off, 1=on
   *
   * B_AUTO_RECARM : bool * : automatically set record arm when selected (does not immediately affect recarm state, script should set directly if desired)
   *
   * I_VUMODE : int * : track vu mode, &1:disabled, &30==0:stereo peaks, &30==2:multichannel peaks, &30==4:stereo RMS, &30==8:combined RMS, &30==12:LUFS-M, &30==16:LUFS-S (readout=max), &30==20:LUFS-S (readout=current), &32:LUFS calculation on channels 1+2 only
   *
   * I_AUTOMODE : int * : track automation mode, 0=trim/off, 1=read, 2=touch, 3=write, 4=latch
   *
   * I_NCHAN : int * : number of track channels, 2-128, even numbers only
   *
   * I_SELECTED : int * : track selected, 0=unselected, 1=selected
   *
   * I_WNDH : int * : current TCP window height in pixels including envelopes (read-only)
   *
   * I_TCPH : int * : current TCP window height in pixels not including envelopes (read-only)
   *
   * I_TCPY : int * : current TCP window Y-position in pixels relative to top of arrange view (read-only)
   *
   * I_MCPX : int * : current MCP X-position in pixels relative to mixer container (read-only)
   *
   * I_MCPY : int * : current MCP Y-position in pixels relative to mixer container (read-only)
   *
   * I_MCPW : int * : current MCP width in pixels (read-only)
   *
   * I_MCPH : int * : current MCP height in pixels (read-only)
   *
   * I_FOLDERDEPTH : int * : folder depth change, 0=normal, 1=track is a folder parent, -1=track is the last in the innermost folder, -2=track is the last in the innermost and next-innermost folders, etc
   *
   * I_FOLDERCOMPACT : int * : folder collapsed state (only valid on folders), 0=normal, 1=collapsed, 2=fully collapsed
   *
   * I_MIDIHWOUT : int * : track midi hardware output index, <0=disabled, low 5 bits are which channels (0=all, 1-16), next 5 bits are output device index (0-31)
   *
   * I_MIDI_INPUT_CHANMAP : int * : -1 maps to source channel, otherwise 1-16 to map to MIDI channel
   *
   * I_MIDI_CTL_CHAN : int * : -1 no link, 0-15 link to MIDI volume/pan on channel, 16 link to MIDI volume/pan on all channels
   *
   * I_MIDI_TRACKSEL_FLAG : int * : MIDI editor track list options: &1=expand media items, &2=exclude from list, &4=auto-pruned
   *
   * I_PERFFLAGS : int * : track performance flags, &1=no media buffering, &2=no anticipative FX
   *
   * I_CUSTOMCOLOR : int * : custom color, OS dependent color|0x1000000 (i.e. ColorToNative(r,g,b)|0x1000000). If you do not |0x1000000, then it will not be used, but will store the color
   *
   * I_HEIGHTOVERRIDE : int * : custom height override for TCP window, 0 for none, otherwise size in pixels
   *
   * I_SPACER : int * : 1=TCP track spacer above this trackB_HEIGHTLOCK : bool * : track height lock (must set I_HEIGHTOVERRIDE before locking)
   *
   * D_VOL : double * : trim volume of track, 0=-inf, 0.5=-6dB, 1=+0dB, 2=+6dB, etc
   *
   * D_PAN : double * : trim pan of track, -1..1
   *
   * D_WIDTH : double * : width of track, -1..1
   *
   * D_DUALPANL : double * : dualpan position 1, -1..1, only if I_PANMODE==6
   *
   * D_DUALPANR : double * : dualpan position 2, -1..1, only if I_PANMODE==6
   *
   * I_PANMODE : int * : pan mode, 0=classic 3.x, 3=new balance, 5=stereo pan, 6=dual pan
   *
   * D_PANLAW : double * : pan law of track, <0=project default, 0.5=-6dB, 0.707..=-3dB, 1=+0dB, 1.414..=-3dB with gain compensation, 2=-6dB with gain compensation, etc
   *
   * I_PANLAW_FLAGS : int * : pan law flags, 0=sine taper, 1=hybrid taper with deprecated behavior when gain compensation enabled, 2=linear taper, 3=hybrid taper
   *
   * P_ENV:<envchunkname or P_ENV:{GUID... : TrackEnvelope * : (read-only) chunkname can be <VOLENV, <PANENV, etc; GUID is the stringified envelope GUID.
   *
   * B_SHOWINMIXER : bool * : track control panel visible in mixer (do not use on master track)
   *
   * B_SHOWINTCP : bool * : track control panel visible in arrange view (do not use on master track)
   *
   * B_MAINSEND : bool * : track sends audio to parent
   *
   * C_MAINSEND_OFFS : char * : channel offset of track send to parent
   *
   * C_MAINSEND_NCH : char * : channel count of track send to parent (0=use all child track channels, 1=use one channel only)
   *
   * I_FREEMODE : int * : 1=track free item positioning enabled, 2=track fixed lanes enabled (call UpdateTimeline() after changing)
   *
   * I_NUMFIXEDLANES : int * : number of track fixed lanes (fine to call with setNewValue, but returned value is read-only)
   *
   * C_LANESCOLLAPSED : char * : fixed lane collapse state (1=lanes collapsed, 2=track displays as non-fixed-lanes but hidden lanes exist)
   *
   * C_LANESETTINGS : char * : fixed lane settings (&1=auto-remove empty lanes at bottom, &2=do not auto-comp new recording, &4=newly recorded lanes play exclusively (else add lanes in layers), &8=big lanes (else small lanes), &16=add new recording at bottom (else record into first available lane), &32=hide lane buttons
   *
   * C_LANEPLAYS:N : char * :  on fixed lane tracks, 0=lane N does not play, 1=lane N plays exclusively, 2=lane N plays and other lanes also play (fine to call with setNewValue, but returned value is read-only)
   *
   * C_ALLLANESPLAY : char * : on fixed lane tracks, 0=no lanes play, 1=all lanes play, 2=some lanes play (fine to call with setNewValue 0 or 1, but returned value is read-only)
   *
   * C_BEATATTACHMODE : char * : track timebase, -1=project default, 0=time, 1=beats (position, length, rate), 2=beats (position only)
   *
   * F_MCP_FXSEND_SCALE : float * : scale of fx+send area in MCP (0=minimum allowed, 1=maximum allowed)
   *
   * F_MCP_FXPARM_SCALE : float * : scale of fx parameter area in MCP (0=minimum allowed, 1=maximum allowed)
   *
   * F_MCP_SENDRGN_SCALE : float * : scale of send area as proportion of the fx+send total area (0=minimum allowed, 1=maximum allowed)
   *
   * F_TCP_FXPARM_SCALE : float * : scale of TCP parameter area when TCP FX are embedded (0=min allowed, default, 1=max allowed)
   *
   * I_PLAY_OFFSET_FLAG : int * : track media playback offset state, &1=bypassed, &2=offset value is measured in samples (otherwise measured in seconds)
   *
   * D_PLAY_OFFSET : double * : track media playback offset, units depend on I_PLAY_OFFSET_FLAG
   */
  function SetMediaTrackInfo_Value(
    tr: MediaTrack,
    parmname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * reaper.SetMIDIEditorGrid(ReaProject project, number division)
   * ```
   * Set the MIDI editor grid division. 0.25=quarter note, 1.0/3.0=half note tripet, etc.
   */
  function SetMIDIEditorGrid(project: ReaProject, division: number): void;

  /**
   * ```
   * MediaTrack _ = reaper.SetMixerScroll(MediaTrack leftmosttrack)
   * ```
   * Scroll the mixer so that leftmosttrack is the leftmost visible track. Returns the leftmost track after scrolling, which may be different from the passed-in track if there are not enough tracks to its right.
   */
  function SetMixerScroll(leftmosttrack: MediaTrack): MediaTrack;

  /**
   * ```
   * reaper.SetMouseModifier(string context, integer modifier_flag, string action)
   * ```
   * Set the mouse modifier assignment for a specific modifier key assignment, in a specific context.
   *
   * Context is a string like "MM_CTX_ITEM" (see reaper-mouse.ini) or "Media item left drag" (unlocalized).
   *
   * Modifier flag is a number from 0 to 15: add 1 for shift, 2 for control, 4 for alt, 8 for win.
   *
   * (macOS: add 1 for shift, 2 for command, 4 for opt, 8 for control.)
   *
   * For left-click and double-click contexts, the action can be any built-in command ID number
   *
   * or any custom action ID string. Find built-in command IDs in the REAPER actions window
   *
   * (enable "show command IDs" in the context menu), and find custom action ID strings in reaper-kb.ini.
   *
   * The action string may be a mouse modifier ID (see reaper-mouse.ini) with " m" appended to it,
   *
   * or (for click/double-click contexts) a command ID with " c" appended to it,
   *
   * or the text that appears in the mouse modifiers preferences dialog, like "Move item" (unlocalized).
   *
   * For example, SetMouseModifier("MM_CTX_ITEM", 0, "1 m") and SetMouseModifier("Media item left drag", 0, "Move item") are equivalent.
   *
   * SetMouseModifier(context, modifier_flag, -1) will reset that mouse modifier to default.
   *
   * SetMouseModifier(context, -1, -1) will reset the entire context to default.
   *
   * SetMouseModifier(-1, -1, -1) will reset all contexts to default.
   *
   * See GetMouseModifier.
   */
  function SetMouseModifier(
    context: string,
    modifier_flag: number,
    action: string,
  ): void;

  /**
   * ```
   * reaper.SetOnlyTrackSelected(MediaTrack track)
   * ```
   * Set exactly one track selected, deselect all others
   */
  function SetOnlyTrackSelected(track: MediaTrack): void;

  /**
   * ```
   * reaper.SetProjectGrid(ReaProject project, number division)
   * ```
   * Set the arrange view grid division. 0.25=quarter note, 1.0/3.0=half note triplet, etc.
   */
  function SetProjectGrid(project: ReaProject, division: number): void;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarker(integer markrgnindexnumber, boolean isrgn, number pos, number rgnend, string name)
   * ```
   * Note: this function can't clear a marker's name (an empty string will leave the name unchanged), see SetProjectMarker4.
   */
  function SetProjectMarker(
    markrgnindexnumber: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarker2(ReaProject proj, integer markrgnindexnumber, boolean isrgn, number pos, number rgnend, string name)
   * ```
   * Note: this function can't clear a marker's name (an empty string will leave the name unchanged), see SetProjectMarker4.
   */
  function SetProjectMarker2(
    proj: ReaProject,
    markrgnindexnumber: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarker3(ReaProject proj, integer markrgnindexnumber, boolean isrgn, number pos, number rgnend, string name, integer color)
   * ```
   * Note: this function can't clear a marker's name (an empty string will leave the name unchanged), see SetProjectMarker4.
   */
  function SetProjectMarker3(
    proj: ReaProject,
    markrgnindexnumber: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
    color: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarker4(ReaProject proj, integer markrgnindexnumber, boolean isrgn, number pos, number rgnend, string name, integer color, integer flags)
   * ```
   * color should be 0 to not change, or ColorToNative(r,g,b)|0x1000000, flags&1 to clear name
   */
  function SetProjectMarker4(
    proj: ReaProject,
    markrgnindexnumber: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
    color: number,
    flags: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarkerByIndex(ReaProject proj, integer markrgnidx, boolean isrgn, number pos, number rgnend, integer IDnumber, string name, integer color)
   * ```
   * See SetProjectMarkerByIndex2.
   */
  function SetProjectMarkerByIndex(
    proj: ReaProject,
    markrgnidx: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    IDnumber: number,
    name: string,
    color: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetProjectMarkerByIndex2(ReaProject proj, integer markrgnidx, boolean isrgn, number pos, number rgnend, integer IDnumber, string name, integer color, integer flags)
   * ```
   * Differs from SetProjectMarker4 in that markrgnidx is 0 for the first marker/region, 1 for the next, etc (see EnumProjectMarkers3), rather than representing the displayed marker/region ID number (see SetProjectMarker3). Function will fail if attempting to set a duplicate ID number for a region (duplicate ID numbers for markers are OK). , flags&1 to clear name. If flags&2, markers will not be re-sorted, and after making updates, you MUST call SetProjectMarkerByIndex2 with markrgnidx=-1 and flags&2 to force re-sort/UI updates.
   */
  function SetProjectMarkerByIndex2(
    proj: ReaProject,
    markrgnidx: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    IDnumber: number,
    name: string,
    color: number,
    flags: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.SetProjExtState(ReaProject proj, string extname, string key, string value)
   * ```
   * Save a key/value pair for a specific extension, to be restored the next time this specific project is loaded. Typically extname will be the name of a reascript or extension section. If key is NULL or "", all extended data for that extname will be deleted.  If val is NULL or "", the data previously associated with that key will be deleted. Returns the size of the state for this extname. See GetProjExtState, EnumProjExtState.
   */
  function SetProjExtState(
    proj: ReaProject,
    extname: string,
    key: string,
    value: string,
  ): number;

  /**
   * ```
   * reaper.SetRegionRenderMatrix(ReaProject proj, integer regionindex, MediaTrack track, integer flag)
   * ```
   * Add (flag > 0) or remove (flag < 0) a track from this region when using the region render matrix. If adding, flag==2 means force mono, flag==4 means force stereo, flag==N means force N/2 channels.
   */
  function SetRegionRenderMatrix(
    proj: ReaProject,
    regionindex: number,
    track: MediaTrack,
    flag: number,
  ): void;

  /**
   * ```
   * integer _ = reaper.SetTakeMarker(MediaItem_Take take, integer idx, string nameIn, optional number srcposIn, optional integer colorIn)
   * ```
   * Inserts or updates a take marker. If idx<0, a take marker will be added, otherwise an existing take marker will be updated. Returns the index of the new or updated take marker (which may change if srcPos is updated). See GetNumTakeMarkers, GetTakeMarker, DeleteTakeMarker
   */
  function SetTakeMarker(
    take: MediaItem_Take,
    idx: number,
    nameIn: string,
    srcposIn?: number,
    colorIn?: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.SetTakeStretchMarker(MediaItem_Take take, integer idx, number pos, optional number srcposIn)
   * ```
   * Adds or updates a stretch marker. If idx<0, stretch marker will be added. If idx>=0, stretch marker will be updated. When adding, if srcposInOptional is omitted, source position will be auto-calculated. When updating a stretch marker, if srcposInOptional is omitted, srcpos will not be modified. Position/srcposition values will be constrained to nearby stretch markers. Returns index of stretch marker, or -1 if did not insert (or marker already existed at time).
   */
  function SetTakeStretchMarker(
    take: MediaItem_Take,
    idx: number,
    pos: number,
    srcposIn?: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.SetTakeStretchMarkerSlope(MediaItem_Take take, integer idx, number slope)
   * ```
   * See GetTakeStretchMarkerSlope
   */
  function SetTakeStretchMarkerSlope(
    take: MediaItem_Take,
    idx: number,
    slope: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTempoTimeSigMarker(ReaProject proj, integer ptidx, number timepos, integer measurepos, number beatpos, number bpm, integer timesig_num, integer timesig_denom, boolean lineartempo)
   * ```
   * Set parameters of a tempo/time signature marker. Provide either timepos (with measurepos=-1, beatpos=-1), or measurepos and beatpos (with timepos=-1). If timesig_num and timesig_denom are zero, the previous time signature will be used. ptidx=-1 will insert a new tempo/time signature marker. See CountTempoTimeSigMarkers, GetTempoTimeSigMarker, AddTempoTimeSigMarker.
   */
  function SetTempoTimeSigMarker(
    proj: ReaProject,
    ptidx: number,
    timepos: number,
    measurepos: number,
    beatpos: number,
    bpm: number,
    timesig_num: number,
    timesig_denom: number,
    lineartempo: boolean,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.SetThemeColor(string ini_key, integer color, integer flags)
   * ```
   * Temporarily updates the theme color to the color specified (or the theme default color if -1 is specified). Returns -1 on failure, otherwise returns the color (or transformed-color). Note that the UI is not updated by this, the caller should call UpdateArrange() etc as necessary. If the low bit of flags is set, any color transformations are bypassed. To read a value see GetThemeColor.Currently valid ini_keys:
   *
   * col_main_bg2 : Main window/transport background
   *
   * -- current RGB: 38,38,38
   *
   * col_main_text2 : Main window/transport text
   *
   * -- current RGB: 81,81,81
   *
   * col_main_textshadow : Main window text shadow (ignored if too close to text color)
   *
   * -- current RGB: 211,208,200
   *
   * col_main_3dhl : Main window 3D highlight
   *
   * -- current RGB: 30,30,30
   *
   * col_main_3dsh : Main window 3D shadow
   *
   * -- current RGB: 30,30,30
   *
   * col_main_resize2 : Main window pane resize mouseover
   *
   * -- current RGB: 116,115,105
   *
   * col_main_text : Themed window text
   *
   * -- current RGB: 211,208,200
   *
   * col_main_bg : Themed window background
   *
   * -- current RGB: 45,45,45
   *
   * col_main_editbk : Themed window edit background
   *
   * -- current RGB: 30,30,30
   *
   * col_nodarkmodemiscwnd : Do not use window theming on macOS dark mode
   *
   * -- bool 00000001
   *
   * col_transport_editbk : Transport edit background
   *
   * -- current RGB: 30,30,30
   *
   * col_toolbar_text : Toolbar button text
   *
   * -- current RGB: 116,115,105
   *
   * col_toolbar_text_on : Toolbar button enabled text
   *
   * -- current RGB: 26,188,152
   *
   * col_toolbar_frame : Toolbar frame when floating or docked
   *
   * -- current RGB: 71,78,78
   *
   * toolbararmed_color : Toolbar button armed color
   *
   * -- current RGB: 20,160,140
   *
   * toolbararmed_drawmode : Toolbar button armed fill mode
   *
   * -- blendmode 00029a01
   *
   * io_text : I/O window text
   *
   * -- current RGB: 211,208,200
   *
   * io_3dhl : I/O window 3D highlight
   *
   * -- current RGB: 81,81,81
   *
   * io_3dsh : I/O window 3D shadow
   *
   * -- current RGB: 81,81,81
   *
   * genlist_bg : Window list background
   *
   * -- current RGB: 45,45,45
   *
   * genlist_fg : Window list text
   *
   * -- current RGB: 211,208,200
   *
   * genlist_grid : Window list grid lines
   *
   * -- current RGB: 116,115,105
   *
   * genlist_selbg : Window list selected row
   *
   * -- current RGB: 81,81,81
   *
   * genlist_selfg : Window list selected text
   *
   * -- current RGB: 211,208,200
   *
   * genlist_seliabg : Window list selected row (inactive)
   *
   * -- current RGB: 81,81,81
   *
   * genlist_seliafg : Window list selected text (inactive)
   *
   * -- current RGB: 211,208,200
   *
   * genlist_hilite : Window list highlighted text
   *
   * -- current RGB: 255,0,224
   *
   * genlist_hilite_sel : Window list highlighted selected text
   *
   * -- current RGB: 192,192,255
   *
   * col_buttonbg : Button background
   *
   * -- current RGB: 0,0,0
   *
   * col_tcp_text : Track panel text
   *
   * -- current RGB: 211,208,200
   *
   * col_tcp_textsel : Track panel (selected) text
   *
   * -- current RGB: 211,208,200
   *
   * col_seltrack : Selected track control panel background
   *
   * -- current RGB: 57,57,57
   *
   * col_seltrack2 : Unselected track control panel background (enabled with a checkbox above)
   *
   * -- current RGB: 45,45,45
   *
   * tcplocked_color : Locked track control panel overlay color
   *
   * -- current RGB: 30,30,30
   *
   * tcplocked_drawmode : Locked track control panel fill mode
   *
   * -- blendmode 0002c000
   *
   * col_tracklistbg : Empty track list area
   *
   * -- current RGB: 30,30,30
   *
   * col_mixerbg : Empty mixer list area
   *
   * -- current RGB: 30,30,30
   *
   * col_arrangebg : Empty arrange view area
   *
   * -- current RGB: 45,45,45
   *
   * arrange_vgrid : Empty arrange view area vertical grid shading
   *
   * -- current RGB: 45,45,45
   *
   * col_fadearm : Fader background when automation recording
   *
   * -- current RGB: 242,119,122
   *
   * col_fadearm2 : Fader background when automation playing
   *
   * -- current RGB: 153,204,153
   *
   * col_fadearm3 : Fader background when in inactive touch/latch
   *
   * -- current RGB: 204,153,204
   *
   * col_tl_fg : Timeline foreground
   *
   * -- current RGB: 116,115,105
   *
   * col_tl_fg2 : Timeline foreground (secondary markings)
   *
   * -- current RGB: 81,81,81
   *
   * col_tl_bg : Timeline background
   *
   * -- current RGB: 38,38,38
   *
   * col_tl_bgsel : Time selection color
   *
   * -- current RGB: 242,240,236
   *
   * timesel_drawmode : Time selection fill mode
   *
   * -- blendmode 00020900
   *
   * col_tl_bgsel2 : Timeline background (in loop points)
   *
   * -- current RGB: 81,81,81
   *
   * col_trans_bg : Transport status background
   *
   * -- current RGB: 0,0,0
   *
   * col_trans_fg : Transport status text
   *
   * -- current RGB: 0,0,0
   *
   * playrate_edited : Project play rate control when not 1.0
   *
   * -- current RGB: 127,63,0
   *
   * selitem_dot : Media item selection indicator
   *
   * -- current RGB: 255,255,255
   *
   * col_mi_label : Media item label
   *
   * -- current RGB: 57,57,57
   *
   * col_mi_label_sel : Media item label (selected)
   *
   * -- current RGB: 57,57,57
   *
   * col_mi_label_float : Floating media item label
   *
   * -- current RGB: 160,159,147
   *
   * col_mi_label_float_sel : Floating media item label (selected)
   *
   * -- current RGB: 160,159,147
   *
   * col_mi_bg2 : Media item background (odd tracks)
   *
   * -- current RGB: 211,208,200
   *
   * col_mi_bg : Media item background (even tracks)
   *
   * -- current RGB: 211,208,200
   *
   * col_tr1_itembgsel : Media item background selected (odd tracks)
   *
   * -- current RGB: 211,208,200
   *
   * col_tr2_itembgsel : Media item background selected (even tracks)
   *
   * -- current RGB: 211,208,200
   *
   * itembg_drawmode : Media item background fill mode
   *
   * -- blendmode 00030000
   *
   * col_tr1_peaks : Media item peaks (odd tracks)
   *
   * -- current RGB: 57,57,57
   *
   * col_tr2_peaks : Media item peaks (even tracks)
   *
   * -- current RGB: 57,57,57
   *
   * col_tr1_ps2 : Media item peaks when selected (odd tracks)
   *
   * -- current RGB: 57,57,57
   *
   * col_tr2_ps2 : Media item peaks when selected (even tracks)
   *
   * -- current RGB: 57,57,57
   *
   * col_peaksedge : Media item peaks edge highlight (odd tracks)
   *
   * -- current RGB: 242,240,236
   *
   * col_peaksedge2 : Media item peaks edge highlight (even tracks)
   *
   * -- current RGB: 242,240,236
   *
   * col_peaksedgesel : Media item peaks edge highlight when selected (odd tracks)
   *
   * -- current RGB: 242,240,236
   *
   * col_peaksedgesel2 : Media item peaks edge highlight when selected (even tracks)
   *
   * -- current RGB: 242,240,236
   *
   * cc_chase_drawmode : Media item MIDI CC peaks fill mode
   *
   * -- blendmode 00024d00
   *
   * col_peaksfade : Media item peaks when active in crossfade editor (fade-out)
   *
   * -- current RGB: 102,153,204
   *
   * col_peaksfade2 : Media item peaks when active in crossfade editor (fade-in)
   *
   * -- current RGB: 242,119,122
   *
   * col_mi_fades : Media item fade/volume controls
   *
   * -- current RGB: 45,45,45
   *
   * fadezone_color : Media item fade quiet zone fill color
   *
   * -- current RGB: 45,45,45
   *
   * fadezone_drawmode : Media item fade quiet zone fill mode
   *
   * -- blendmode 00029a00
   *
   * fadearea_color : Media item fade full area fill color
   *
   * -- current RGB: 45,45,45
   *
   * fadearea_drawmode : Media item fade full area fill mode
   *
   * -- blendmode 00020000
   *
   * col_mi_fade2 : Media item edges of controls
   *
   * -- current RGB: 242,240,236
   *
   * col_mi_fade2_drawmode : Media item edges of controls blend mode
   *
   * -- blendmode 00024000
   *
   * item_grouphl : Media item edge when selected via grouping
   *
   * -- current RGB: 204,153,204
   *
   * col_offlinetext : Media item "offline" text
   *
   * -- current RGB: 116,115,105
   *
   * col_stretchmarker : Media item stretch marker line
   *
   * -- current RGB: 45,45,45
   *
   * col_stretchmarker_h0 : Media item stretch marker handle (1x)
   *
   * -- current RGB: 211,208,200
   *
   * col_stretchmarker_h1 : Media item stretch marker handle (>1x)
   *
   * -- current RGB: 255,204,102
   *
   * col_stretchmarker_h2 : Media item stretch marker handle (<1x)
   *
   * -- current RGB: 102,204,204
   *
   * col_stretchmarker_b : Media item stretch marker handle edge
   *
   * -- current RGB: 45,45,45
   *
   * col_stretchmarkerm : Media item stretch marker blend mode
   *
   * -- blendmode 0002cd00
   *
   * col_stretchmarker_text : Media item stretch marker text
   *
   * -- current RGB: 116,115,105
   *
   * col_stretchmarker_tm : Media item transient guide handle
   *
   * -- current RGB: 160,159,147
   *
   * take_marker : Media item take marker
   *
   * -- current RGB: 242,119,122
   *
   * take_marker_sel : Media item take marker when item selected
   *
   * -- current RGB: 115,109,9
   *
   * selitem_tag : Selected media item bar color
   *
   * -- current RGB: 0,0,0
   *
   * activetake_tag : Active media item take bar color
   *
   * -- current RGB: 0,0,0
   *
   * col_tr1_bg : Track background (odd tracks)
   *
   * -- current RGB: 45,45,45
   *
   * col_tr2_bg : Track background (even tracks)
   *
   * -- current RGB: 45,45,45
   *
   * selcol_tr1_bg : Selected track background (odd tracks)
   *
   * -- current RGB: 57,57,57
   *
   * selcol_tr2_bg : Selected track background (even tracks)
   *
   * -- current RGB: 57,57,57
   *
   * track_lane_tabcol : Track fixed lane button
   *
   * -- current RGB: 116,115,105
   *
   * track_lanesolo_tabcol : Track fixed lane button when only this lane plays
   *
   * -- current RGB: 211,208,200
   *
   * track_lanesolo_text : Track fixed lane button text
   *
   * -- current RGB: 211,208,200
   *
   * track_lane_gutter : Track fixed lane add area
   *
   * -- current RGB: 81,81,81
   *
   * track_lane_gutter_drawmode : Track fixed lane add fill mode
   *
   * -- blendmode 00023300
   *
   * col_tr1_divline : Track divider line (odd tracks)
   *
   * -- current RGB: 38,38,38
   *
   * col_tr2_divline : Track divider line (even tracks)
   *
   * -- current RGB: 38,38,38
   *
   * col_envlane1_divline : Envelope lane divider line (odd tracks)
   *
   * -- current RGB: 38,38,38
   *
   * col_envlane2_divline : Envelope lane divider line (even tracks)
   *
   * -- current RGB: 38,38,38
   *
   * mute_overlay_col : Muted/unsoloed track/item overlay color
   *
   * -- current RGB: 30,30,30
   *
   * mute_overlay_mode : Muted/unsoloed track/item overlay mode
   *
   * -- blendmode 00029a00
   *
   * inactive_take_overlay_col : Inactive take/lane overlay color
   *
   * -- current RGB: 30,30,30
   *
   * inactive_take_overlay_mode : Inactive take/lane overlay mode
   *
   * -- blendmode 0002b300
   *
   * locked_overlay_col : Locked track/item overlay color
   *
   * -- current RGB: 255,204,102
   *
   * locked_overlay_mode : Locked track/item overlay mode
   *
   * -- blendmode 00024000
   *
   * marquee_fill : Marquee fill
   *
   * -- current RGB: 128,128,122
   *
   * marquee_drawmode : Marquee fill mode
   *
   * -- blendmode 000300fe
   *
   * marquee_outline : Marquee outline
   *
   * -- current RGB: 242,240,236
   *
   * marqueezoom_fill : Marquee zoom fill
   *
   * -- current RGB: 128,128,122
   *
   * marqueezoom_drawmode : Marquee zoom fill mode
   *
   * -- blendmode 000300fe
   *
   * marqueezoom_outline : Marquee zoom outline
   *
   * -- current RGB: 153,204,153
   *
   * areasel_fill : Razor edit area fill
   *
   * -- current RGB: 102,204,204
   *
   * areasel_drawmode : Razor edit area fill mode
   *
   * -- blendmode 00021a00
   *
   * areasel_outline : Razor edit area outline
   *
   * -- current RGB: 102,204,204
   *
   * areasel_outlinemode : Razor edit area outline mode
   *
   * -- blendmode 00030000
   *
   * linkedlane_fill : Fixed lane comp area fill
   *
   * -- current RGB: 81,81,81
   *
   * linkedlane_fillmode : Fixed lane comp area fill mode
   *
   * -- blendmode 00030000
   *
   * linkedlane_outline : Fixed lane comp area outline
   *
   * -- current RGB: 255,204,102
   *
   * linkedlane_outlinemode : Fixed lane comp area outline mode
   *
   * -- blendmode 00030000
   *
   * linkedlane_unsynced : Fixed lane comp lane unsynced media item
   *
   * -- current RGB: 102,153,204
   *
   * linkedlane_unsynced_mode : Fixed lane comp lane unsynced media item mode
   *
   * -- blendmode 00030000
   *
   * col_cursor : Edit cursor
   *
   * -- current RGB: 204,153,204
   *
   * col_cursor2 : Edit cursor (alternate)
   *
   * -- current RGB: 204,153,204
   *
   * playcursor_color : Play cursor
   *
   * -- current RGB: 204,153,204
   *
   * playcursor_drawmode : Play cursor mode
   *
   * -- blendmode 00028000
   *
   * col_gridlines2 : Grid lines (start of measure)
   *
   * -- current RGB: 242,240,236
   *
   * col_gridlines2dm : Grid lines (start of measure) - draw mode
   *
   * -- blendmode 00021a00
   *
   * col_gridlines3 : Grid lines (start of beats)
   *
   * -- current RGB: 242,240,236
   *
   * col_gridlines3dm : Grid lines (start of beats) - draw mode
   *
   * -- blendmode 00020d00
   *
   * col_gridlines : Grid lines (in between beats)
   *
   * -- current RGB: 242,240,236
   *
   * col_gridlines1dm : Grid lines (in between beats) - draw mode
   *
   * -- blendmode 00020800
   *
   * guideline_color : Editing guide line
   *
   * -- current RGB: 242,240,236
   *
   * guideline_drawmode : Editing guide mode
   *
   * -- blendmode 00026600
   *
   * mouseitem_color : Mouse position indicator
   *
   * -- current RGB: 196,255,196
   *
   * mouseitem_mode : Mouse position indicator mode
   *
   * -- blendmode 00028000
   *
   * region : Regions
   *
   * -- current RGB: 81,81,81
   *
   * region_lane_bg : Region lane background
   *
   * -- current RGB: 38,38,38
   *
   * region_lane_text : Region text
   *
   * -- current RGB: 211,208,200
   *
   * region_edge : Region edge
   *
   * -- current RGB: 116,116,116
   *
   * region_edge_sel : Region text and edge (selected)
   *
   * -- current RGB: 255,255,255
   *
   * marker : Markers
   *
   * -- current RGB: 116,115,105
   *
   * marker_lane_bg : Marker lane background
   *
   * -- current RGB: 38,38,38
   *
   * marker_lane_text : Marker text
   *
   * -- current RGB: 211,208,200
   *
   * marker_edge : Marker edge
   *
   * -- current RGB: 116,116,116
   *
   * marker_edge_sel : Marker text and edge (selected)
   *
   * -- current RGB: 255,255,255
   *
   * col_tsigmark : Time signature change marker
   *
   * -- current RGB: 210,123,83
   *
   * ts_lane_bg : Time signature lane background
   *
   * -- current RGB: 38,38,38
   *
   * ts_lane_text : Time signature lane text
   *
   * -- current RGB: 116,115,105
   *
   * timesig_sel_bg : Time signature marker selected background
   *
   * -- current RGB: 57,57,57
   *
   * col_routinghl1 : Routing matrix row highlight
   *
   * -- current RGB: 255,204,102
   *
   * col_routinghl2 : Routing matrix column highlight
   *
   * -- current RGB: 102,153,204
   *
   * col_routingact : Routing matrix input activity highlight
   *
   * -- current RGB: 153,204,153
   *
   * col_vudoint : Theme has interlaced VU meters
   *
   * -- bool 00000000
   *
   * col_vuclip : VU meter clip indicator
   *
   * -- current RGB: 187,37,0
   *
   * col_vutop : VU meter top
   *
   * -- current RGB: 0,254,149
   *
   * col_vumid : VU meter middle
   *
   * -- current RGB: 0,218,173
   *
   * col_vubot : VU meter bottom
   *
   * -- current RGB: 0,191,191
   *
   * col_vuintcol : VU meter interlace/edge color
   *
   * -- current RGB: 30,30,30
   *
   * vu_gr_bgcol : VU meter gain reduction background
   *
   * -- current RGB: 30,30,30
   *
   * vu_gr_fgcol : VU meter gain reduction indicator
   *
   * -- current RGB: 255,204,102
   *
   * col_vumidi : VU meter midi activity
   *
   * -- current RGB: 249,145,87
   *
   * col_vuind1 : VU (indicator) - no signal
   *
   * -- current RGB: 30,30,30
   *
   * col_vuind2 : VU (indicator) - low signal
   *
   * -- current RGB: 30,30,30
   *
   * col_vuind3 : VU (indicator) - med signal
   *
   * -- current RGB: 153,204,153
   *
   * col_vuind4 : VU (indicator) - hot signal
   *
   * -- current RGB: 255,204,102
   *
   * mcp_sends_normal : Sends text: normal
   *
   * -- current RGB: 211,208,200
   *
   * mcp_sends_muted : Sends text: muted
   *
   * -- current RGB: 116,115,105
   *
   * mcp_send_midihw : Sends text: MIDI hardware
   *
   * -- current RGB: 102,153,204
   *
   * mcp_sends_levels : Sends level
   *
   * -- current RGB: 102,153,204
   *
   * mcp_fx_normal : FX insert text: normal
   *
   * -- current RGB: 211,208,200
   *
   * mcp_fx_bypassed : FX insert text: bypassed
   *
   * -- current RGB: 116,115,105
   *
   * mcp_fx_offlined : FX insert text: offline
   *
   * -- current RGB: 210,123,83
   *
   * mcp_fxparm_normal : FX parameter text: normal
   *
   * -- current RGB: 211,208,200
   *
   * mcp_fxparm_bypassed : FX parameter text: bypassed
   *
   * -- current RGB: 116,115,105
   *
   * mcp_fxparm_offlined : FX parameter text: offline
   *
   * -- current RGB: 210,123,83
   *
   * tcp_list_scrollbar : List scrollbar (track panel)
   *
   * -- current RGB: 116,115,105
   *
   * tcp_list_scrollbar_mode : List scrollbar (track panel) - draw mode
   *
   * -- blendmode 00030000
   *
   * tcp_list_scrollbar_mouseover : List scrollbar mouseover (track panel)
   *
   * -- current RGB: 211,208,200
   *
   * tcp_list_scrollbar_mouseover_mode : List scrollbar mouseover (track panel) - draw mode
   *
   * -- blendmode 00030000
   *
   * mcp_list_scrollbar : List scrollbar (mixer panel)
   *
   * -- current RGB: 116,115,105
   *
   * mcp_list_scrollbar_mode : List scrollbar (mixer panel) - draw mode
   *
   * -- blendmode 00030000
   *
   * mcp_list_scrollbar_mouseover : List scrollbar mouseover (mixer panel)
   *
   * -- current RGB: 211,208,200
   *
   * mcp_list_scrollbar_mouseover_mode : List scrollbar mouseover (mixer panel) - draw mode
   *
   * -- blendmode 00030000
   *
   * midi_rulerbg : MIDI editor ruler background
   *
   * -- current RGB: 30,30,30
   *
   * midi_rulerfg : MIDI editor ruler text
   *
   * -- current RGB: 116,115,105
   *
   * midi_grid2 : MIDI editor grid line (start of measure)
   *
   * -- current RGB: 242,240,236
   *
   * midi_griddm2 : MIDI editor grid line (start of measure) - draw mode
   *
   * -- blendmode 00021a00
   *
   * midi_grid3 : MIDI editor grid line (start of beats)
   *
   * -- current RGB: 242,240,236
   *
   * midi_griddm3 : MIDI editor grid line (start of beats) - draw mode
   *
   * -- blendmode 00020d00
   *
   * midi_grid1 : MIDI editor grid line (between beats)
   *
   * -- current RGB: 242,240,236
   *
   * midi_griddm1 : MIDI editor grid line (between beats) - draw mode
   *
   * -- blendmode 00020800
   *
   * midi_trackbg1 : MIDI editor background color (naturals)
   *
   * -- current RGB: 45,45,45
   *
   * midi_trackbg2 : MIDI editor background color (sharps/flats)
   *
   * -- current RGB: 41,41,41
   *
   * midi_trackbg_outer1 : MIDI editor background color, out of bounds (naturals)
   *
   * -- current RGB: 38,38,38
   *
   * midi_trackbg_outer2 : MIDI editor background color, out of bounds (sharps/flats)
   *
   * -- current RGB: 38,38,38
   *
   * midi_selpitch1 : MIDI editor background color, selected pitch (naturals)
   *
   * -- current RGB: 57,57,57
   *
   * midi_selpitch2 : MIDI editor background color, selected pitch (sharps/flats)
   *
   * -- current RGB: 57,57,57
   *
   * midi_selbg : MIDI editor time selection color
   *
   * -- current RGB: 242,240,236
   *
   * midi_selbg_drawmode : MIDI editor time selection fill mode
   *
   * -- blendmode 00020900
   *
   * midi_gridhc : MIDI editor CC horizontal center line
   *
   * -- current RGB: 116,115,105
   *
   * midi_gridhcdm : MIDI editor CC horizontal center line - draw mode
   *
   * -- blendmode 00030000
   *
   * midi_gridh : MIDI editor CC horizontal line
   *
   * -- current RGB: 57,57,57
   *
   * midi_gridhdm : MIDI editor CC horizontal line - draw mode
   *
   * -- blendmode 00030000
   *
   * midi_ccbut : MIDI editor CC lane add/remove buttons
   *
   * -- current RGB: 116,115,105
   *
   * midi_ccbut_text : MIDI editor CC lane button text
   *
   * -- current RGB: 116,115,105
   *
   * midi_ccbut_arrow : MIDI editor CC lane button arrow
   *
   * -- current RGB: 116,115,105
   *
   * midioct : MIDI editor octave line color
   *
   * -- current RGB: 30,30,30
   *
   * midi_inline_trackbg1 : MIDI inline background color (naturals)
   *
   * -- current RGB: 45,45,45
   *
   * midi_inline_trackbg2 : MIDI inline background color (sharps/flats)
   *
   * -- current RGB: 41,41,41
   *
   * midioct_inline : MIDI inline octave line color
   *
   * -- current RGB: 30,30,30
   *
   * midi_endpt : MIDI editor end marker
   *
   * -- current RGB: 102,153,204
   *
   * midi_notebg : MIDI editor note, unselected (midi_note_colormap overrides)
   *
   * -- current RGB: 211,208,200
   *
   * midi_notefg : MIDI editor note, selected (midi_note_colormap overrides)
   *
   * -- current RGB: 57,57,57
   *
   * midi_notemute : MIDI editor note, muted, unselected (midi_note_colormap overrides)
   *
   * -- current RGB: 105,104,100
   *
   * midi_notemute_sel : MIDI editor note, muted, selected (midi_note_colormap overrides)
   *
   * -- current RGB: 28,28,28
   *
   * midi_itemctl : MIDI editor note controls
   *
   * -- current RGB: 57,57,57
   *
   * midi_ofsn : MIDI editor note (offscreen)
   *
   * -- current RGB: 242,240,236
   *
   * midi_ofsnsel : MIDI editor note (offscreen, selected)
   *
   * -- current RGB: 211,208,200
   *
   * midi_editcurs : MIDI editor cursor
   *
   * -- current RGB: 204,153,204
   *
   * midi_pkey1 : MIDI piano key color (naturals background, sharps/flats text)
   *
   * -- current RGB: 211,208,200
   *
   * midi_pkey2 : MIDI piano key color (sharps/flats background, naturals text)
   *
   * -- current RGB: 45,45,45
   *
   * midi_pkey3 : MIDI piano key color (selected)
   *
   * -- current RGB: 116,115,105
   *
   * midi_noteon_flash : MIDI piano key note-on flash
   *
   * -- current RGB: 116,115,105
   *
   * midi_leftbg : MIDI piano pane background
   *
   * -- current RGB: 30,30,30
   *
   * midifont_col_light_unsel : MIDI editor note text and control color, unselected (light)
   *
   * -- current RGB: 211,208,200
   *
   * midifont_col_dark_unsel : MIDI editor note text and control color, unselected (dark)
   *
   * -- current RGB: 57,57,57
   *
   * midifont_mode_unsel : MIDI editor note text and control mode, unselected
   *
   * -- blendmode 00030000
   *
   * midifont_col_light : MIDI editor note text and control color (light)
   *
   * -- current RGB: 211,208,200
   *
   * midifont_col_dark : MIDI editor note text and control color (dark)
   *
   * -- current RGB: 57,57,57
   *
   * midifont_mode : MIDI editor note text and control mode
   *
   * -- blendmode 00030000
   *
   * score_bg : MIDI notation editor background
   *
   * -- current RGB: 255,255,255
   *
   * score_fg : MIDI notation editor staff/notation/text
   *
   * -- current RGB: 0,0,0
   *
   * score_sel : MIDI notation editor selected staff/notation/text
   *
   * -- current RGB: 102,153,204
   *
   * score_timesel : MIDI notation editor time selection
   *
   * -- current RGB: 240,240,240
   *
   * score_loop : MIDI notation editor loop points, selected pitch
   *
   * -- current RGB: 255,204,102
   *
   * midieditorlist_bg : MIDI list editor background
   *
   * -- current RGB: 45,45,45
   *
   * midieditorlist_fg : MIDI list editor text
   *
   * -- current RGB: 211,208,200
   *
   * midieditorlist_grid : MIDI list editor grid lines
   *
   * -- current RGB: 81,81,81
   *
   * midieditorlist_selbg : MIDI list editor selected row
   *
   * -- current RGB: 116,115,105
   *
   * midieditorlist_selfg : MIDI list editor selected text
   *
   * -- current RGB: 211,208,200
   *
   * midieditorlist_seliabg : MIDI list editor selected row (inactive)
   *
   * -- current RGB: 116,115,105
   *
   * midieditorlist_seliafg : MIDI list editor selected text (inactive)
   *
   * -- current RGB: 211,208,200
   *
   * midieditorlist_bg2 : MIDI list editor background (secondary)
   *
   * -- current RGB: 45,45,45
   *
   * midieditorlist_fg2 : MIDI list editor text (secondary)
   *
   * -- current RGB: 160,159,147
   *
   * midieditorlist_selbg2 : MIDI list editor selected row (secondary)
   *
   * -- current RGB: 116,115,105
   *
   * midieditorlist_selfg2 : MIDI list editor selected text (secondary)
   *
   * -- current RGB: 211,208,200
   *
   * col_explorer_sel : Media explorer selection
   *
   * -- current RGB: 45,45,45
   *
   * col_explorer_seldm : Media explorer selection mode
   *
   * -- blendmode 00024f00
   *
   * col_explorer_seledge : Media explorer selection edge
   *
   * -- current RGB: 0,0,0
   *
   * explorer_grid : Media explorer grid, markers
   *
   * -- current RGB: 116,115,105
   *
   * explorer_pitchtext : Media explorer pitch detection text
   *
   * -- current RGB: 102,153,204
   *
   * docker_shadow : Tab control shadow
   *
   * -- current RGB: 9,9,9
   *
   * docker_selface : Tab control selected tab
   *
   * -- current RGB: 30,30,30
   *
   * docker_unselface : Tab control unselected tab
   *
   * -- current RGB: 30,30,30
   *
   * docker_text : Tab control text
   *
   * -- current RGB: 116,115,105
   *
   * docker_text_sel : Tab control text selected tab
   *
   * -- current RGB: 232,230,223
   *
   * docker_bg : Tab control background
   *
   * -- current RGB: 30,30,30
   *
   * windowtab_bg : Tab control background in windows
   *
   * -- current RGB: 30,30,30
   *
   * auto_item_unsel : Envelope: Unselected automation item
   *
   * -- current RGB: 211,208,200
   *
   * col_env1 : Envelope: Volume (pre-FX)
   *
   * -- current RGB: 255,204,102
   *
   * col_env2 : Envelope: Volume
   *
   * -- current RGB: 255,204,102
   *
   * env_trim_vol : Envelope: Trim Volume
   *
   * -- current RGB: 255,204,102
   *
   * col_env3 : Envelope: Pan (pre-FX)
   *
   * -- current RGB: 102,204,204
   *
   * col_env4 : Envelope: Pan
   *
   * -- current RGB: 102,204,204
   *
   * env_track_mute : Envelope: Mute
   *
   * -- current RGB: 242,119,122
   *
   * col_env5 : Envelope: Master playrate
   *
   * -- current RGB: 102,204,204
   *
   * col_env6 : Envelope: Master tempo
   *
   * -- current RGB: 210,123,83
   *
   * col_env7 : Envelope: Width / Send volume
   *
   * -- current RGB: 255,204,102
   *
   * col_env8 : Envelope: Send pan
   *
   * -- current RGB: 102,204,204
   *
   * col_env9 : Envelope: Send volume 2
   *
   * -- current RGB: 255,204,102
   *
   * col_env10 : Envelope: Send pan 2
   *
   * -- current RGB: 102,204,204
   *
   * env_sends_mute : Envelope: Send mute
   *
   * -- current RGB: 242,119,122
   *
   * col_env11 : Envelope: Audio hardware output volume
   *
   * -- current RGB: 255,204,102
   *
   * col_env12 : Envelope: Audio hardware output pan
   *
   * -- current RGB: 102,204,204
   *
   * col_env13 : Envelope: FX parameter 1
   *
   * -- current RGB: 204,153,204
   *
   * col_env14 : Envelope: FX parameter 2
   *
   * -- current RGB: 204,153,204
   *
   * col_env15 : Envelope: FX parameter 3
   *
   * -- current RGB: 204,153,204
   *
   * col_env16 : Envelope: FX parameter 4
   *
   * -- current RGB: 204,153,204
   *
   * env_item_vol : Envelope: Item take volume
   *
   * -- current RGB: 249,145,87
   *
   * env_item_pan : Envelope: Item take pan
   *
   * -- current RGB: 102,153,204
   *
   * env_item_mute : Envelope: Item take mute
   *
   * -- current RGB: 242,119,122
   *
   * env_item_pitch : Envelope: Item take pitch
   *
   * -- current RGB: 204,153,204
   *
   * wiring_grid2 : Wiring: Background
   *
   * -- current RGB: 30,30,30
   *
   * wiring_grid : Wiring: Background grid lines
   *
   * -- current RGB: 38,38,38
   *
   * wiring_border : Wiring: Box border
   *
   * -- current RGB: 30,30,30
   *
   * wiring_tbg : Wiring: Box background
   *
   * -- current RGB: 45,45,45
   *
   * wiring_ticon : Wiring: Box foreground
   *
   * -- current RGB: 242,240,236
   *
   * wiring_recbg : Wiring: Record section background
   *
   * -- current RGB: 249,145,87
   *
   * wiring_recitem : Wiring: Record section foreground
   *
   * -- current RGB: 210,123,83
   *
   * wiring_media : Wiring: Media
   *
   * -- current RGB: 153,204,153
   *
   * wiring_recv : Wiring: Receives
   *
   * -- current RGB: 81,81,81
   *
   * wiring_send : Wiring: Sends
   *
   * -- current RGB: 81,81,81
   *
   * wiring_fader : Wiring: Fader
   *
   * -- current RGB: 204,153,204
   *
   * wiring_parent : Wiring: Master/Parent
   *
   * -- current RGB: 102,204,204
   *
   * wiring_parentwire_border : Wiring: Master/Parent wire border
   *
   * -- current RGB: 81,81,81
   *
   * wiring_parentwire_master : Wiring: Master/Parent to master wire
   *
   * -- current RGB: 81,81,81
   *
   * wiring_parentwire_folder : Wiring: Master/Parent to parent folder wire
   *
   * -- current RGB: 81,81,81
   *
   * wiring_pin_normal : Wiring: Pins normal
   *
   * -- current RGB: 116,115,105
   *
   * wiring_pin_connected : Wiring: Pins connected
   *
   * -- current RGB: 153,204,153
   *
   * wiring_pin_disconnected : Wiring: Pins disconnected
   *
   * -- current RGB: 210,123,83
   *
   * wiring_horz_col : Wiring: Horizontal pin connections
   *
   * -- current RGB: 116,115,105
   *
   * wiring_sendwire : Wiring: Send hanging wire
   *
   * -- current RGB: 81,81,81
   *
   * wiring_hwoutwire : Wiring: Hardware output wire
   *
   * -- current RGB: 81,81,81
   *
   * wiring_recinputwire : Wiring: Record input wire
   *
   * -- current RGB: 242,119,122
   *
   * wiring_hwout : Wiring: System hardware outputs
   *
   * -- current RGB: 57,57,57
   *
   * wiring_recinput : Wiring: System record inputs
   *
   * -- current RGB: 210,123,83
   *
   * wiring_activity : Wiring: Activity lights
   *
   * -- current RGB: 153,204,153
   *
   * autogroup : Automatic track group
   *
   * -- current RGB: 242,119,122
   *
   * group_0 : Group #1
   *
   * -- current RGB: 255,0,0
   *
   * group_1 : Group #2
   *
   * -- current RGB: 0,255,0
   *
   * group_2 : Group #3
   *
   * -- current RGB: 0,0,255
   *
   * group_3 : Group #4
   *
   * -- current RGB: 255,255,0
   *
   * group_4 : Group #5
   *
   * -- current RGB: 255,0,255
   *
   * group_5 : Group #6
   *
   * -- current RGB: 0,255,255
   *
   * group_6 : Group #7
   *
   * -- current RGB: 192,0,0
   *
   * group_7 : Group #8
   *
   * -- current RGB: 0,192,0
   *
   * group_8 : Group #9
   *
   * -- current RGB: 0,0,192
   *
   * group_9 : Group #10
   *
   * -- current RGB: 192,192,0
   *
   * group_10 : Group #11
   *
   * -- current RGB: 192,0,192
   *
   * group_11 : Group #12
   *
   * -- current RGB: 0,192,192
   *
   * group_12 : Group #13
   *
   * -- current RGB: 128,0,0
   *
   * group_13 : Group #14
   *
   * -- current RGB: 0,128,0
   *
   * group_14 : Group #15
   *
   * -- current RGB: 0,0,128
   *
   * group_15 : Group #16
   *
   * -- current RGB: 128,128,0
   *
   * group_16 : Group #17
   *
   * -- current RGB: 128,0,128
   *
   * group_17 : Group #18
   *
   * -- current RGB: 0,128,128
   *
   * group_18 : Group #19
   *
   * -- current RGB: 192,128,0
   *
   * group_19 : Group #20
   *
   * -- current RGB: 0,192,128
   *
   * group_20 : Group #21
   *
   * -- current RGB: 0,128,192
   *
   * group_21 : Group #22
   *
   * -- current RGB: 192,128,0
   *
   * group_22 : Group #23
   *
   * -- current RGB: 128,0,192
   *
   * group_23 : Group #24
   *
   * -- current RGB: 128,192,0
   *
   * group_24 : Group #25
   *
   * -- current RGB: 64,0,0
   *
   * group_25 : Group #26
   *
   * -- current RGB: 0,64,0
   *
   * group_26 : Group #27
   *
   * -- current RGB: 0,0,64
   *
   * group_27 : Group #28
   *
   * -- current RGB: 64,64,0
   *
   * group_28 : Group #29
   *
   * -- current RGB: 64,0,64
   *
   * group_29 : Group #30
   *
   * -- current RGB: 0,64,64
   *
   * group_30 : Group #31
   *
   * -- current RGB: 64,0,64
   *
   * group_31 : Group #32
   *
   * -- current RGB: 0,64,64
   *
   * group_32 : Group #33
   *
   * -- current RGB: 128,255,255
   *
   * group_33 : Group #34
   *
   * -- current RGB: 128,0,128
   *
   * group_34 : Group #35
   *
   * -- current RGB: 1,255,128
   *
   * group_35 : Group #36
   *
   * -- current RGB: 128,0,255
   *
   * group_36 : Group #37
   *
   * -- current RGB: 1,255,255
   *
   * group_37 : Group #38
   *
   * -- current RGB: 1,0,128
   *
   * group_38 : Group #39
   *
   * -- current RGB: 128,255,224
   *
   * group_39 : Group #40
   *
   * -- current RGB: 128,63,128
   *
   * group_40 : Group #41
   *
   * -- current RGB: 32,255,128
   *
   * group_41 : Group #42
   *
   * -- current RGB: 128,63,224
   *
   * group_42 : Group #43
   *
   * -- current RGB: 32,255,224
   *
   * group_43 : Group #44
   *
   * -- current RGB: 32,63,128
   *
   * group_44 : Group #45
   *
   * -- current RGB: 128,255,192
   *
   * group_45 : Group #46
   *
   * -- current RGB: 128,127,128
   *
   * group_46 : Group #47
   *
   * -- current RGB: 64,255,128
   *
   * group_47 : Group #48
   *
   * -- current RGB: 128,127,192
   *
   * group_48 : Group #49
   *
   * -- current RGB: 64,255,192
   *
   * group_49 : Group #50
   *
   * -- current RGB: 64,127,128
   *
   * group_50 : Group #51
   *
   * -- current RGB: 128,127,224
   *
   * group_51 : Group #52
   *
   * -- current RGB: 64,63,128
   *
   * group_52 : Group #53
   *
   * -- current RGB: 32,127,128
   *
   * group_53 : Group #54
   *
   * -- current RGB: 128,127,224
   *
   * group_54 : Group #55
   *
   * -- current RGB: 32,255,192
   *
   * group_55 : Group #56
   *
   * -- current RGB: 128,63,192
   *
   * group_56 : Group #57
   *
   * -- current RGB: 128,255,160
   *
   * group_57 : Group #58
   *
   * -- current RGB: 128,191,128
   *
   * group_58 : Group #59
   *
   * -- current RGB: 96,255,128
   *
   * group_59 : Group #60
   *
   * -- current RGB: 128,191,160
   *
   * group_60 : Group #61
   *
   * -- current RGB: 96,255,160
   *
   * group_61 : Group #62
   *
   * -- current RGB: 96,191,128
   *
   * group_62 : Group #63
   *
   * -- current RGB: 96,255,160
   *
   * group_63 : Group #64
   *
   * -- current RGB: 96,191,128
   */
  function SetThemeColor(ini_key: string, color: number, flags: number): number;

  /**
   * ```
   * boolean _ = reaper.SetToggleCommandState(integer section_id, integer command_id, integer state)
   * ```
   * Updates the toggle state of an action, returns true if succeeded. Only ReaScripts can have their toggle states changed programmatically. See RefreshToolbar2.
   */
  function SetToggleCommandState(
    section_id: number,
    command_id: number,
    state: number,
  ): boolean;

  /**
   * ```
   * reaper.SetTrackAutomationMode(MediaTrack tr, integer mode)
   * ```
   */
  function SetTrackAutomationMode(tr: MediaTrack, mode: number): void;

  /**
   * ```
   * reaper.SetTrackColor(MediaTrack track, integer color)
   * ```
   * Set the custom track color, color is OS dependent (i.e. ColorToNative(r,g,b). To unset the track color, see SetMediaTrackInfo_Value I_CUSTOMCOLOR
   */
  function SetTrackColor(track: MediaTrack, color: number): void;

  /**
   * ```
   * boolean _ = reaper.SetTrackMIDILyrics(MediaTrack track, integer flag, string str)
   * ```
   * Set all MIDI lyrics on the track. Lyrics will be stuffed into any MIDI items found in range. Flag is unused at present. str is passed in as beat position, tab, text, tab (example with flag=2: "1.1.2\tLyric for measure 1 beat 2\t2.1.1\tLyric for measure 2 beat 1	"). See GetTrackMIDILyrics
   */
  function SetTrackMIDILyrics(
    track: MediaTrack,
    flag: number,
    str: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTrackMIDINoteName(integer track, integer pitch, integer chan, string name)
   * ```
   * channel < 0 assigns these note names to all channels.
   */
  function SetTrackMIDINoteName(
    track: number,
    pitch: number,
    chan: number,
    name: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTrackMIDINoteNameEx(ReaProject proj, MediaTrack track, integer pitch, integer chan, string name)
   * ```
   * channel < 0 assigns note name to all channels. pitch 128 assigns name for CC0, pitch 129 for CC1, etc.
   */
  function SetTrackMIDINoteNameEx(
    proj: ReaProject,
    track: MediaTrack,
    pitch: number,
    chan: number,
    name: string,
  ): boolean;

  /**
   * ```
   * reaper.SetTrackSelected(MediaTrack track, boolean selected)
   * ```
   */
  function SetTrackSelected(track: MediaTrack, selected: boolean): void;

  /**
   * ```
   * boolean _ = reaper.SetTrackSendInfo_Value(MediaTrack tr, integer category, integer sendidx, string parmname, number newvalue)
   * ```
   * Set send/receive/hardware output numerical-value attributes, return true on success.
   *
   * category is <0 for receives, 0=sends, >0 for hardware outputs
   *
   * parameter names:
   *
   * B_MUTE : bool *
   *
   * B_PHASE : bool * : true to flip phase
   *
   * B_MONO : bool *
   *
   * D_VOL : double * : 1.0 = +0dB etc
   *
   * D_PAN : double * : -1..+1
   *
   * D_PANLAW : double * : 1.0=+0.0db, 0.5=-6dB, -1.0 = projdef etc
   *
   * I_SENDMODE : int * : 0=post-fader, 1=pre-fx, 2=post-fx (deprecated), 3=post-fx
   *
   * I_AUTOMODE : int * : automation mode (-1=use track automode, 0=trim/off, 1=read, 2=touch, 3=write, 4=latch)
   *
   * I_SRCCHAN : int * : -1 for no audio send. Low 10 bits specify channel offset, and higher bits specify channel count. (srcchan>>10) == 0 for stereo, 1 for mono, 2 for 4 channel, 3 for 6 channel, etc.
   *
   * I_DSTCHAN : int * : low 10 bits are destination index, &1024 set to mix to mono.
   *
   * I_MIDIFLAGS : int * : low 5 bits=source channel 0=all, 1-16, 31=MIDI send disabled, next 5 bits=dest channel, 0=orig, 1-16=chan. &1024 for faders-send MIDI vol/pan. (>>14)&255 = src bus (0 for all, 1 for normal, 2+). (>>22)&255=destination bus (0 for all, 1 for normal, 2+)
   *
   * See CreateTrackSend, RemoveTrackSend, GetTrackNumSends.
   */
  function SetTrackSendInfo_Value(
    tr: MediaTrack,
    category: number,
    sendidx: number,
    parmname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTrackSendUIPan(MediaTrack track, integer send_idx, number pan, integer isend)
   * ```
   * send_idx<0 for receives, >=0 for hw ouputs, >=nb_of_hw_ouputs for sends. isend=1 for end of edit, -1 for an instant edit (such as reset), 0 for normal tweak.
   */
  function SetTrackSendUIPan(
    track: MediaTrack,
    send_idx: number,
    pan: number,
    isend: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTrackSendUIVol(MediaTrack track, integer send_idx, number vol, integer isend)
   * ```
   * send_idx<0 for receives, >=0 for hw ouputs, >=nb_of_hw_ouputs for sends. isend=1 for end of edit, -1 for an instant edit (such as reset), 0 for normal tweak.
   */
  function SetTrackSendUIVol(
    track: MediaTrack,
    send_idx: number,
    vol: number,
    isend: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SetTrackStateChunk(MediaTrack track, string str, boolean isundo)
   * ```
   * Sets the RPPXML state of a track, returns true if successful. Undo flag is a performance/caching hint.
   */
  function SetTrackStateChunk(
    track: MediaTrack,
    str: string,
    isundo: boolean,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.SetTrackUIInputMonitor(MediaTrack track, integer monitor, integer igngroupflags)
   * ```
   * monitor: 0=no monitoring, 1=monitoring, 2=auto-monitoring. returns new value or -1 if error. igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIInputMonitor(
    track: MediaTrack,
    monitor: number,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.SetTrackUIMute(MediaTrack track, integer mute, integer igngroupflags)
   * ```
   * mute: <0 toggles, >0 sets mute, 0=unsets mute. returns new value or -1 if error. igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIMute(
    track: MediaTrack,
    mute: number,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * number _ = reaper.SetTrackUIPan(MediaTrack track, number pan, boolean relative, boolean done, integer igngroupflags)
   * ```
   * igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIPan(
    track: MediaTrack,
    pan: number,
    relative: boolean,
    done: boolean,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.SetTrackUIPolarity(MediaTrack track, integer polarity, integer igngroupflags)
   * ```
   * polarity (AKA phase): <0 toggles, 0=normal, >0=inverted. returns new value or -1 if error.igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIPolarity(
    track: MediaTrack,
    polarity: number,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.SetTrackUIRecArm(MediaTrack track, integer recarm, integer igngroupflags)
   * ```
   * recarm: <0 toggles, >0 sets recarm, 0=unsets recarm. returns new value or -1 if error. igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIRecArm(
    track: MediaTrack,
    recarm: number,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.SetTrackUISolo(MediaTrack track, integer solo, integer igngroupflags)
   * ```
   * solo: <0 toggles, 1 sets solo (default mode), 0=unsets solo, 2 sets solo (non-SIP), 4 sets solo (SIP). returns new value or -1 if error. igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUISolo(
    track: MediaTrack,
    solo: number,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * number _ = reaper.SetTrackUIVolume(MediaTrack track, number volume, boolean relative, boolean done, integer igngroupflags)
   * ```
   * igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIVolume(
    track: MediaTrack,
    volume: number,
    relative: boolean,
    done: boolean,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * number _ = reaper.SetTrackUIWidth(MediaTrack track, number width, boolean relative, boolean done, integer igngroupflags)
   * ```
   * igngroupflags: &1 to prevent track grouping, &2 to prevent selection ganging
   */
  function SetTrackUIWidth(
    track: MediaTrack,
    width: number,
    relative: boolean,
    done: boolean,
    igngroupflags: number,
  ): number;

  /**
   * ```
   * reaper.ShowActionList(KbdSectionInfo section, HWND callerWnd)
   * ```
   */
  function ShowActionList(section: KbdSectionInfo, callerWnd: HWND): void;

  /**
   * Show a message to the user (also useful for debugging). Send "\n" for newline, "" to clear the console. Prefix string with "!SHOW:" and text will be added to console without opening the window. See ClearConsole
   */
  function ShowConsoleMsg(msg: string | number): void;

  /**
   * ```
   * integer _ = reaper.ShowMessageBox(string msg, string title, integer type)
   * ```
   * type 0=OK,1=OKCANCEL,2=ABORTRETRYIGNORE,3=YESNOCANCEL,4=YESNO,5=RETRYCANCEL : ret 1=OK,2=CANCEL,3=ABORT,4=RETRY,5=IGNORE,6=YES,7=NO
   */
  function ShowMessageBox(msg: string, title: string, type: number): number;

  /**
   * ```
   * reaper.ShowPopupMenu(string name, integer x, integer y, HWND hwndParent, identifier ctx, integer ctx2, integer ctx3)
   * ```
   * shows a context menu, valid names include: track_input, track_panel, track_area, track_routing, item, ruler, envelope, envelope_point, envelope_item. ctxOptional can be a track pointer for track_*, item pointer for item* (but is optional). for envelope_point, ctx2Optional has point index, ctx3Optional has item index (0=main envelope, 1=first AI). for envelope_item, ctx2Optional has AI index (1=first AI)
   */
  function ShowPopupMenu(
    name: string,
    x: number,
    y: number,
    hwndParent: HWND,
    ctx: identifier,
    ctx2: number,
    ctx3: number,
  ): void;

  /**
   * ```
   * number _ = reaper.SLIDER2DB(number y)
   * ```
   */
  function SLIDER2DB(y: number): number;

  /**
   * ```
   * number _ = reaper.SnapToGrid(ReaProject project, number time_pos)
   * ```
   */
  function SnapToGrid(project: ReaProject, time_pos: number): number;

  /**
   * ```
   * reaper.SoloAllTracks(integer solo)
   * ```
   * solo=2 for SIP
   */
  function SoloAllTracks(solo: number): void;

  /**
   * ```
   * HWND _ = reaper.Splash_GetWnd()
   * ```
   * gets the splash window, in case you want to display a message over it. Returns NULL when the splash window is not displayed.
   */
  function Splash_GetWnd(): HWND;

  /**
   * ```
   * MediaItem _ = reaper.SplitMediaItem(MediaItem item, number position)
   * ```
   * the original item becomes the left-hand split, the function returns the right-hand split (or NULL if the split failed)
   */
  function SplitMediaItem(item: MediaItem, position: number): MediaItem | null;

  /**
   * ```
   * string gGUID = reaper.stringToGuid(string str, string gGUID)
   * ```
   */
  function stringToGuid(str: string, gGUID: string): string;

  /**
   * ```
   * reaper.StuffMIDIMessage(integer mode, integer msg1, integer msg2, integer msg3)
   * ```
   * Stuffs a 3 byte MIDI message into either the Virtual MIDI Keyboard queue, or the MIDI-as-control input queue, or sends to a MIDI hardware output. mode=0 for VKB, 1 for control (actions map etc), 2 for VKB-on-current-channel; 16 for external MIDI device 0, 17 for external MIDI device 1, etc; see GetNumMIDIOutputs, GetMIDIOutputName.
   */
  function StuffMIDIMessage(
    mode: number,
    msg1: number,
    msg2: number,
    msg3: number,
  ): void;

  /**
   * ```
   * integer _ = reaper.TakeFX_AddByName(MediaItem_Take take, string fxname, integer instantiate)
   * ```
   * Adds or queries the position of a named FX in a take. See TrackFX_AddByName() for information on fxname and instantiate. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_AddByName(
    take: MediaItem_Take,
    fxname: string,
    instantiate: number,
  ): number;

  /**
   * ```
   * reaper.TakeFX_CopyToTake(MediaItem_Take src_take, integer src_fx, MediaItem_Take dest_take, integer dest_fx, boolean is_move)
   * ```
   * Copies (or moves) FX from src_take to dest_take. Can be used with src_take=dest_take to reorder. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_CopyToTake(
    src_take: MediaItem_Take,
    src_fx: number,
    dest_take: MediaItem_Take,
    dest_fx: number,
    is_move: boolean,
  ): void;

  /**
   * ```
   * reaper.TakeFX_CopyToTrack(MediaItem_Take src_take, integer src_fx, MediaTrack dest_track, integer dest_fx, boolean is_move)
   * ```
   * Copies (or moves) FX from src_take to dest_track. dest_fx can have 0x1000000 set to reference input FX. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_CopyToTrack(
    src_take: MediaItem_Take,
    src_fx: number,
    dest_track: MediaTrack,
    dest_fx: number,
    is_move: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TakeFX_Delete(MediaItem_Take take, integer fx)
   * ```
   * Remove a FX from take chain (returns true on success) FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_Delete(take: MediaItem_Take, fx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_EndParamEdit(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_EndParamEdit(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_FormatParamValue(MediaItem_Take take, integer fx, integer param, number val)
   * ```
   * Note: only works with FX that support Cockos VST extensions. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_FormatParamValue(
    take: MediaItem_Take,
    fx: number,
    param: number,
    val: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_FormatParamValueNormalized(MediaItem_Take take, integer fx, integer param, number value, string buf)
   * ```
   * Note: only works with FX that support Cockos VST extensions. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_FormatParamValueNormalized(
    take: MediaItem_Take,
    fx: number,
    param: number,
    value: number,
    buf: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.TakeFX_GetChainVisible(MediaItem_Take take)
   * ```
   * returns index of effect visible in chain, or -1 for chain hidden, or -2 for chain visible but no effect selected
   */
  function TakeFX_GetChainVisible(take: MediaItem_Take): number;

  /**
   * ```
   * integer _ = reaper.TakeFX_GetCount(MediaItem_Take take)
   * ```
   */
  function TakeFX_GetCount(take: MediaItem_Take): number;

  /**
   * ```
   * boolean _ = reaper.TakeFX_GetEnabled(MediaItem_Take take, integer fx)
   * ```
   * See TakeFX_SetEnabled FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetEnabled(take: MediaItem_Take, fx: number): boolean;

  /**
   * ```
   * TrackEnvelope _ = reaper.TakeFX_GetEnvelope(MediaItem_Take take, integer fxindex, integer parameterindex, boolean create)
   * ```
   * Returns the FX parameter envelope. If the envelope does not exist and create=true, the envelope will be created. If the envelope already exists and is bypassed and create=true, then the envelope will be unbypassed. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetEnvelope(
    take: MediaItem_Take,
    fxindex: number,
    parameterindex: number,
    create: boolean,
  ): TrackEnvelope;

  /**
   * ```
   * HWND _ = reaper.TakeFX_GetFloatingWindow(MediaItem_Take take, integer index)
   * ```
   * returns HWND of floating window for effect index, if any FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetFloatingWindow(take: MediaItem_Take, index: number): HWND;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_GetFormattedParamValue(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetFormattedParamValue(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string GUID = reaper.TakeFX_GetFXGUID(MediaItem_Take take, integer fx)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetFXGUID(take: MediaItem_Take, fx: number): string;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_GetFXName(MediaItem_Take take, integer fx)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetFXName(
    take: MediaItem_Take,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer retval, integer inputPins, integer outputPins = reaper.TakeFX_GetIOSize(MediaItem_Take take, integer fx)
   * ```
   * Gets the number of input/output pins for FX if available, returns plug-in type or -1 on error FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetIOSize(
    take: MediaItem_Take,
    fx: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_GetNamedConfigParm(MediaItem_Take take, integer fx, string parmname)
   * ```
   * gets plug-in specific named configuration value (returns true on success). see TrackFX_GetNamedConfigParm FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetNamedConfigParm(
    take: MediaItem_Take,
    fx: number,
    parmname: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.TakeFX_GetNumParams(MediaItem_Take take, integer fx)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetNumParams(take: MediaItem_Take, fx: number): number;

  /**
   * ```
   * boolean _ = reaper.TakeFX_GetOffline(MediaItem_Take take, integer fx)
   * ```
   * See TakeFX_SetOffline FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetOffline(take: MediaItem_Take, fx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_GetOpen(MediaItem_Take take, integer fx)
   * ```
   * Returns true if this FX UI is open in the FX chain window or a floating window. See TakeFX_SetOpen FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetOpen(take: MediaItem_Take, fx: number): boolean;

  /**
   * ```
   * number retval, number minval, number maxval = reaper.TakeFX_GetParam(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParam(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * boolean retval, number step, number smallstep, number largestep, boolean istoggle = reaper.TakeFX_GetParameterStepSizes(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParameterStepSizes(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, number, number, number, boolean]>;

  /**
   * ```
   * number retval, number minval, number maxval, number midval = reaper.TakeFX_GetParamEx(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParamEx(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.TakeFX_GetParamFromIdent(MediaItem_Take take, integer fx, string ident_str)
   * ```
   * gets the parameter index from an identifying string (:wet, :bypass, or a string returned from GetParamIdent), or -1 if unknown. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParamFromIdent(
    take: MediaItem_Take,
    fx: number,
    ident_str: string,
  ): number;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_GetParamIdent(MediaItem_Take take, integer fx, integer param)
   * ```
   * gets an identifying string for the parameter FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParamIdent(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string buf = reaper.TakeFX_GetParamName(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParamName(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * number _ = reaper.TakeFX_GetParamNormalized(MediaItem_Take take, integer fx, integer param)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetParamNormalized(
    take: MediaItem_Take,
    fx: number,
    param: number,
  ): number;

  /**
   * ```
   * integer retval, integer high32 = reaper.TakeFX_GetPinMappings(MediaItem_Take take, integer fx, integer isoutput, integer pin)
   * ```
   * gets the effective channel mapping bitmask for a particular pin. high32Out will be set to the high 32 bits. Add 0x1000000 to pin index in order to access the second 64 bits of mappings independent of the first 64 bits. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetPinMappings(
    take: MediaItem_Take,
    fx: number,
    isoutput: number,
    pin: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean retval, string presetname = reaper.TakeFX_GetPreset(MediaItem_Take take, integer fx)
   * ```
   * Get the name of the preset currently showing in the REAPER dropdown, or the full path to a factory preset file for VST3 plug-ins (.vstpreset). See TakeFX_SetPreset. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetPreset(
    take: MediaItem_Take,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer retval, integer numberOfPresets = reaper.TakeFX_GetPresetIndex(MediaItem_Take take, integer fx)
   * ```
   * Returns current preset index, or -1 if error. numberOfPresetsOut will be set to total number of presets available. See TakeFX_SetPresetByIndex FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetPresetIndex(
    take: MediaItem_Take,
    fx: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * string fn = reaper.TakeFX_GetUserPresetFilename(MediaItem_Take take, integer fx)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_GetUserPresetFilename(
    take: MediaItem_Take,
    fx: number,
  ): string;

  /**
   * ```
   * boolean _ = reaper.TakeFX_NavigatePresets(MediaItem_Take take, integer fx, integer presetmove)
   * ```
   * presetmove==1 activates the next preset, presetmove==-1 activates the previous preset, etc. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_NavigatePresets(
    take: MediaItem_Take,
    fx: number,
    presetmove: number,
  ): boolean;

  /**
   * ```
   * reaper.TakeFX_SetEnabled(MediaItem_Take take, integer fx, boolean enabled)
   * ```
   * See TakeFX_GetEnabled FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetEnabled(
    take: MediaItem_Take,
    fx: number,
    enabled: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetNamedConfigParm(MediaItem_Take take, integer fx, string parmname, string value)
   * ```
   * gets plug-in specific named configuration value (returns true on success). see TrackFX_SetNamedConfigParm FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetNamedConfigParm(
    take: MediaItem_Take,
    fx: number,
    parmname: string,
    value: string,
  ): boolean;

  /**
   * ```
   * reaper.TakeFX_SetOffline(MediaItem_Take take, integer fx, boolean offline)
   * ```
   * See TakeFX_GetOffline FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetOffline(
    take: MediaItem_Take,
    fx: number,
    offline: boolean,
  ): void;

  /**
   * ```
   * reaper.TakeFX_SetOpen(MediaItem_Take take, integer fx, boolean open)
   * ```
   * Open this FX UI. See TakeFX_GetOpen FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetOpen(
    take: MediaItem_Take,
    fx: number,
    open: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetParam(MediaItem_Take take, integer fx, integer param, number val)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetParam(
    take: MediaItem_Take,
    fx: number,
    param: number,
    val: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetParamNormalized(MediaItem_Take take, integer fx, integer param, number value)
   * ```
   * FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetParamNormalized(
    take: MediaItem_Take,
    fx: number,
    param: number,
    value: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetPinMappings(MediaItem_Take take, integer fx, integer isoutput, integer pin, integer low32bits, integer hi32bits)
   * ```
   * sets the channel mapping bitmask for a particular pin. returns false if unsupported (not all types of plug-ins support this capability). Add 0x1000000 to pin index in order to access the second 64 bits of mappings independent of the first 64 bits. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetPinMappings(
    take: MediaItem_Take,
    fx: number,
    isoutput: number,
    pin: number,
    low32bits: number,
    hi32bits: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetPreset(MediaItem_Take take, integer fx, string presetname)
   * ```
   * Activate a preset with the name shown in the REAPER dropdown. Full paths to .vstpreset files are also supported for VST3 plug-ins. See TakeFX_GetPreset. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetPreset(
    take: MediaItem_Take,
    fx: number,
    presetname: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TakeFX_SetPresetByIndex(MediaItem_Take take, integer fx, integer idx)
   * ```
   * Sets the preset idx, or the factory preset (idx==-2), or the default user preset (idx==-1). Returns true on success. See TakeFX_GetPresetIndex. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_SetPresetByIndex(
    take: MediaItem_Take,
    fx: number,
    idx: number,
  ): boolean;

  /**
   * ```
   * reaper.TakeFX_Show(MediaItem_Take take, integer index, integer showFlag)
   * ```
   * showflag=0 for hidechain, =1 for show chain(index valid), =2 for hide floating window(index valid), =3 for show floating window (index valid) FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TakeFX_Show(
    take: MediaItem_Take,
    index: number,
    showFlag: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TakeIsMIDI(MediaItem_Take take)
   * ```
   * Returns true if the active take contains MIDI.
   */
  function TakeIsMIDI(take: MediaItem_Take): boolean;

  /**
   * ```
   * boolean retval, string name = reaper.ThemeLayout_GetLayout(string section, integer idx)
   * ```
   * Gets theme layout information. section can be 'global' for global layout override, 'seclist' to enumerate a list of layout sections, otherwise a layout section such as 'mcp', 'tcp', 'trans', etc. idx can be -1 to query the current value, -2 to get the description of the section (if not global), -3 will return the current context DPI-scaling (256=normal, 512=retina, etc), or 0..x. returns false if failed.
   */
  function ThemeLayout_GetLayout(
    section: string,
    idx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string retval, optional string desc, optional integer value, optional integer defValue, optional integer minValue, optional integer maxValue = reaper.ThemeLayout_GetParameter(integer wp)
   * ```
   * returns theme layout parameter. return value is cfg-name, or nil/empty if out of range.
   */
  function ThemeLayout_GetParameter(
    wp: number,
  ):
    | LuaMultiReturn<[string, string, number, number, number, number]>
    | LuaMultiReturn<[null]>;

  /**
   * ```
   * reaper.ThemeLayout_RefreshAll()
   * ```
   * Refreshes all layouts
   */
  function ThemeLayout_RefreshAll(): void;

  /**
   * ```
   * boolean _ = reaper.ThemeLayout_SetLayout(string section, string layout)
   * ```
   * Sets theme layout override for a particular section -- section can be 'global' or 'mcp' etc. If setting global layout, prefix a ! to the layout string to clear any per-layout overrides. Returns false if failed.
   */
  function ThemeLayout_SetLayout(section: string, layout: string): boolean;

  /**
   * ```
   * boolean _ = reaper.ThemeLayout_SetParameter(integer wp, integer value, boolean persist)
   * ```
   * sets theme layout parameter to value. persist=true in order to have change loaded on next theme load. note that the caller should update layouts via ??? to make changes visible.
   */
  function ThemeLayout_SetParameter(
    wp: number,
    value: number,
    persist: boolean,
  ): boolean;

  /**
   * ```
   * number _ = reaper.time_precise()
   * ```
   * Gets a precise system timestamp in seconds
   */
  function time_precise(): number;

  /**
   * ```
   * number _ = reaper.TimeMap2_beatsToTime(ReaProject proj, number tpos, optional integer measuresIn)
   * ```
   * convert a beat position (or optionally a beats+measures if measures is non-NULL) to time.
   */
  function TimeMap2_beatsToTime(
    proj: ReaProject,
    tpos: number,
    measuresIn?: number,
  ): number;

  /**
   * ```
   * number _ = reaper.TimeMap2_GetDividedBpmAtTime(ReaProject proj, number time)
   * ```
   * get the effective BPM at the time (seconds) position (i.e. 2x in /8 signatures)
   */
  function TimeMap2_GetDividedBpmAtTime(proj: ReaProject, time: number): number;

  /**
   * ```
   * number _ = reaper.TimeMap2_GetNextChangeTime(ReaProject proj, number time)
   * ```
   * when does the next time map (tempo or time sig) change occur
   */
  function TimeMap2_GetNextChangeTime(proj: ReaProject, time: number): number;

  /**
   * ```
   * number _ = reaper.TimeMap2_QNToTime(ReaProject proj, number qn)
   * ```
   * converts project QN position to time.
   */
  function TimeMap2_QNToTime(proj: ReaProject, qn: number): number;

  /**
   * ```
   * number retval, optional integer measures, optional integer cml, optional number fullbeats, optional integer cdenom = reaper.TimeMap2_timeToBeats(ReaProject proj, number tpos)
   * ```
   * convert a time into beats.
   *
   * if measures is non-NULL, measures will be set to the measure count, return value will be beats since measure.
   *
   * if cml is non-NULL, will be set to current measure length in beats (i.e. time signature numerator)
   *
   * if fullbeats is non-NULL, and measures is non-NULL, fullbeats will get the full beat count (same value returned if measures is NULL).
   *
   * if cdenom is non-NULL, will be set to the current time signature denominator.
   */
  function TimeMap2_timeToBeats(
    proj: ReaProject,
    tpos: number,
  ): LuaMultiReturn<[number, number, number, number, number]>;

  /**
   * ```
   * number _ = reaper.TimeMap2_timeToQN(ReaProject proj, number tpos)
   * ```
   * converts project time position to QN position.
   */
  function TimeMap2_timeToQN(proj: ReaProject, tpos: number): number;

  /**
   * ```
   * number retval, boolean dropFrame = reaper.TimeMap_curFrameRate(ReaProject proj)
   * ```
   * Gets project framerate, and optionally whether it is drop-frame timecode
   */
  function TimeMap_curFrameRate(
    proj: ReaProject,
  ): LuaMultiReturn<[number, boolean]>;

  /**
   * ```
   * number _ = reaper.TimeMap_GetDividedBpmAtTime(number time)
   * ```
   * get the effective BPM at the time (seconds) position (i.e. 2x in /8 signatures)
   */
  function TimeMap_GetDividedBpmAtTime(time: number): number;

  /**
   * ```
   * number retval, number qn_start, number qn_end, integer timesig_num, integer timesig_denom, number tempo = reaper.TimeMap_GetMeasureInfo(ReaProject proj, integer measure)
   * ```
   * Get the QN position and time signature information for the start of a measure. Return the time in seconds of the measure start.
   */
  function TimeMap_GetMeasureInfo(
    proj: ReaProject,
    measure: number,
  ): LuaMultiReturn<[number, number, number, number, number, number]>;

  /**
   * ```
   * integer retval, string pattern = reaper.TimeMap_GetMetronomePattern(ReaProject proj, number time, string pattern)
   * ```
   * Fills in a string representing the active metronome pattern. For example, in a 7/8 measure divided 3+4, the pattern might be "1221222". The length of the string is the time signature numerator, and the function returns the time signature denominator.
   */
  function TimeMap_GetMetronomePattern(
    proj: ReaProject,
    time: number,
    pattern: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer timesig_num, integer timesig_denom, number tempo = reaper.TimeMap_GetTimeSigAtTime(ReaProject proj, number time)
   * ```
   * get the effective time signature and tempo
   */
  function TimeMap_GetTimeSigAtTime(
    proj: ReaProject,
    time: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * integer retval, optional number qnMeasureStart, optional number qnMeasureEnd = reaper.TimeMap_QNToMeasures(ReaProject proj, number qn)
   * ```
   * Find which measure the given QN position falls in.
   */
  function TimeMap_QNToMeasures(
    proj: ReaProject,
    qn: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * number _ = reaper.TimeMap_QNToTime(number qn)
   * ```
   * converts project QN position to time.
   */
  function TimeMap_QNToTime(qn: number): number;

  /**
   * ```
   * number _ = reaper.TimeMap_QNToTime_abs(ReaProject proj, number qn)
   * ```
   * Converts project quarter note count (QN) to time. QN is counted from the start of the project, regardless of any partial measures. See TimeMap2_QNToTime
   */
  function TimeMap_QNToTime_abs(proj: ReaProject, qn: number): number;

  /**
   * ```
   * number _ = reaper.TimeMap_timeToQN(number tpos)
   * ```
   * converts project QN position to time.
   */
  function TimeMap_timeToQN(tpos: number): number;

  /**
   * ```
   * number _ = reaper.TimeMap_timeToQN_abs(ReaProject proj, number tpos)
   * ```
   * Converts project time position to quarter note count (QN). QN is counted from the start of the project, regardless of any partial measures. See TimeMap2_timeToQN
   */
  function TimeMap_timeToQN_abs(proj: ReaProject, tpos: number): number;

  /**
   * ```
   * boolean _ = reaper.ToggleTrackSendUIMute(MediaTrack track, integer send_idx)
   * ```
   * send_idx<0 for receives, >=0 for hw ouputs, >=nb_of_hw_ouputs for sends.
   */
  function ToggleTrackSendUIMute(track: MediaTrack, send_idx: number): boolean;

  /**
   * ```
   * number _ = reaper.Track_GetPeakHoldDB(MediaTrack track, integer channel, boolean clear)
   * ```
   * Returns meter hold state, in dB*0.01 (0 = +0dB, -0.01 = -1dB, 0.02 = +2dB, etc). If clear is set, clears the meter hold. If channel==1024 or channel==1025, returns loudness values if this is the master track or this track's VU meters are set to display loudness.
   */
  function Track_GetPeakHoldDB(
    track: MediaTrack,
    channel: number,
    clear: boolean,
  ): number;

  /**
   * ```
   * number _ = reaper.Track_GetPeakInfo(MediaTrack track, integer channel)
   * ```
   * Returns peak meter value (1.0=+0dB, 0.0=-inf) for channel. If channel==1024 or channel==1025, returns loudness values if this is the master track or this track's VU meters are set to display loudness.
   */
  function Track_GetPeakInfo(track: MediaTrack, channel: number): number;

  /**
   * ```
   * reaper.TrackCtl_SetToolTip(string fmt, integer xpos, integer ypos, boolean topmost)
   * ```
   * displays tooltip at location, or removes if empty string
   */
  function TrackCtl_SetToolTip(
    fmt: string,
    xpos: number,
    ypos: number,
    topmost: boolean,
  ): void;

  /**
   * ```
   * integer _ = reaper.TrackFX_AddByName(MediaTrack track, string fxname, boolean recFX, integer instantiate)
   * ```
   * Adds or queries the position of a named FX from the track FX chain (recFX=false) or record input FX/monitoring FX (recFX=true, monitoring FX are on master track). Specify a negative value for instantiate to always create a new effect, 0 to only query the first instance of an effect, or a positive value to add an instance if one is not found. If instantiate is <= -1000, it is used for the insertion position (-1000 is first item in chain, -1001 is second, etc). fxname can have prefix to specify type: VST3:,VST2:,VST:,AU:,JS:, or DX:, or FXADD: which adds selected items from the currently-open FX browser, FXADD:2 to limit to 2 FX added, or FXADD:2e to only succeed if exactly 2 FX are selected. Returns -1 on failure or the new position in chain on success. FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_AddByName(
    track: MediaTrack,
    fxname: string,
    recFX: boolean,
    instantiate: number,
  ): number;

  /**
   * ```
   * reaper.TrackFX_CopyToTake(MediaTrack src_track, integer src_fx, MediaItem_Take dest_take, integer dest_fx, boolean is_move)
   * ```
   * Copies (or moves) FX from src_track to dest_take. src_fx can have 0x1000000 set to reference input FX. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_CopyToTake(
    src_track: MediaTrack,
    src_fx: number,
    dest_take: MediaItem_Take,
    dest_fx: number,
    is_move: boolean,
  ): void;

  /**
   * ```
   * reaper.TrackFX_CopyToTrack(MediaTrack src_track, integer src_fx, MediaTrack dest_track, integer dest_fx, boolean is_move)
   * ```
   * Copies (or moves) FX from src_track to dest_track. Can be used with src_track=dest_track to reorder, FX indices have 0x1000000 set to reference input FX. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_CopyToTrack(
    src_track: MediaTrack,
    src_fx: number,
    dest_track: MediaTrack,
    dest_fx: number,
    is_move: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TrackFX_Delete(MediaTrack track, integer fx)
   * ```
   * Remove a FX from track chain (returns true on success) FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_Delete(track: MediaTrack, fx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_EndParamEdit(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_EndParamEdit(
    track: MediaTrack,
    fx: number,
    param: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_FormatParamValue(MediaTrack track, integer fx, integer param, number val)
   * ```
   * Note: only works with FX that support Cockos VST extensions. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_FormatParamValue(
    track: MediaTrack,
    fx: number,
    param: number,
    val: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_FormatParamValueNormalized(MediaTrack track, integer fx, integer param, number value, string buf)
   * ```
   * Note: only works with FX that support Cockos VST extensions. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_FormatParamValueNormalized(
    track: MediaTrack,
    fx: number,
    param: number,
    value: number,
    buf: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetByName(MediaTrack track, string fxname, boolean instantiate)
   * ```
   * Get the index of the first track FX insert that matches fxname. If the FX is not in the chain and instantiate is true, it will be inserted. See TrackFX_GetInstrument, TrackFX_GetEQ. Deprecated in favor of TrackFX_AddByName.
   * @deprecated
   */
  function TrackFX_GetByName(
    track: MediaTrack,
    fxname: string,
    instantiate: boolean,
  ): number;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetChainVisible(MediaTrack track)
   * ```
   * returns index of effect visible in chain, or -1 for chain hidden, or -2 for chain visible but no effect selected
   */
  function TrackFX_GetChainVisible(track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetCount(MediaTrack track)
   * ```
   */
  function TrackFX_GetCount(track: MediaTrack): number;

  /**
   * ```
   * boolean _ = reaper.TrackFX_GetEnabled(MediaTrack track, integer fx)
   * ```
   * See TrackFX_SetEnabled FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetEnabled(track: MediaTrack, fx: number): boolean;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetEQ(MediaTrack track, boolean instantiate)
   * ```
   * Get the index of ReaEQ in the track FX chain. If ReaEQ is not in the chain and instantiate is true, it will be inserted. See TrackFX_GetInstrument, TrackFX_GetByName.
   */
  function TrackFX_GetEQ(track: MediaTrack, instantiate: boolean): number;

  /**
   * ```
   * boolean _ = reaper.TrackFX_GetEQBandEnabled(MediaTrack track, integer fxidx, integer bandtype, integer bandidx)
   * ```
   * Returns true if the EQ band is enabled.
   *
   * Returns false if the band is disabled, or if track/fxidx is not ReaEQ.
   *
   * Bandtype: -1=master gain, 0=hipass, 1=loshelf, 2=band, 3=notch, 4=hishelf, 5=lopass, 6=bandpass, 7=parallel bandpass.
   *
   * Bandidx (ignored for master gain): 0=target first band matching bandtype, 1=target 2nd band matching bandtype, etc.
   *
   *
   *
   * See TrackFX_GetEQ, TrackFX_GetEQParam, TrackFX_SetEQParam, TrackFX_SetEQBandEnabled. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetEQBandEnabled(
    track: MediaTrack,
    fxidx: number,
    bandtype: number,
    bandidx: number,
  ): boolean;

  /**
   * ```
   * boolean retval, integer bandtype, integer bandidx, integer paramtype, number normval = reaper.TrackFX_GetEQParam(MediaTrack track, integer fxidx, integer paramidx)
   * ```
   * Returns false if track/fxidx is not ReaEQ.
   *
   * Bandtype: -1=master gain, 0=hipass, 1=loshelf, 2=band, 3=notch, 4=hishelf, 5=lopass, 6=bandpass, 7=parallel bandpass.
   *
   * Bandidx (ignored for master gain): 0=target first band matching bandtype, 1=target 2nd band matching bandtype, etc.
   *
   * Paramtype (ignored for master gain): 0=freq, 1=gain, 2=Q.
   *
   * See TrackFX_GetEQ, TrackFX_SetEQParam, TrackFX_GetEQBandEnabled, TrackFX_SetEQBandEnabled. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetEQParam(
    track: MediaTrack,
    fxidx: number,
    paramidx: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * HWND _ = reaper.TrackFX_GetFloatingWindow(MediaTrack track, integer index)
   * ```
   * returns HWND of floating window for effect index, if any FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetFloatingWindow(track: MediaTrack, index: number): HWND;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_GetFormattedParamValue(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetFormattedParamValue(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string GUID = reaper.TrackFX_GetFXGUID(MediaTrack track, integer fx)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetFXGUID(track: MediaTrack, fx: number): string;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_GetFXName(MediaTrack track, integer fx)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetFXName(
    track: MediaTrack,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetInstrument(MediaTrack track)
   * ```
   * Get the index of the first track FX insert that is a virtual instrument, or -1 if none. See TrackFX_GetEQ, TrackFX_GetByName.
   */
  function TrackFX_GetInstrument(track: MediaTrack): number;

  /**
   * ```
   * integer retval, integer inputPins, integer outputPins = reaper.TrackFX_GetIOSize(MediaTrack track, integer fx)
   * ```
   * Gets the number of input/output pins for FX if available, returns plug-in type or -1 on error FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetIOSize(
    track: MediaTrack,
    fx: number,
  ): LuaMultiReturn<[number, number, number]>;

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

  /**
   * ```
   * integer _ = reaper.TrackFX_GetNumParams(MediaTrack track, integer fx)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetNumParams(track: MediaTrack, fx: number): number;

  /**
   * ```
   * boolean _ = reaper.TrackFX_GetOffline(MediaTrack track, integer fx)
   * ```
   * See TrackFX_SetOffline FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetOffline(track: MediaTrack, fx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_GetOpen(MediaTrack track, integer fx)
   * ```
   * Returns true if this FX UI is open in the FX chain window or a floating window. See TrackFX_SetOpen FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetOpen(track: MediaTrack, fx: number): boolean;

  /**
   * ```
   * number retval, number minval, number maxval = reaper.TrackFX_GetParam(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParam(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * boolean retval, number step, number smallstep, number largestep, boolean istoggle = reaper.TrackFX_GetParameterStepSizes(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParameterStepSizes(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, number, number, number, boolean]>;

  /**
   * ```
   * number retval, number minval, number maxval, number midval = reaper.TrackFX_GetParamEx(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParamEx(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetParamFromIdent(MediaTrack track, integer fx, string ident_str)
   * ```
   * gets the parameter index from an identifying string (:wet, :bypass, :delta, or a string returned from GetParamIdent), or -1 if unknown. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParamFromIdent(
    track: MediaTrack,
    fx: number,
    ident_str: string,
  ): number;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_GetParamIdent(MediaTrack track, integer fx, integer param)
   * ```
   * gets an identifying string for the parameter FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParamIdent(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string buf = reaper.TrackFX_GetParamName(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParamName(
    track: MediaTrack,
    fx: number,
    param: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * number _ = reaper.TrackFX_GetParamNormalized(MediaTrack track, integer fx, integer param)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetParamNormalized(
    track: MediaTrack,
    fx: number,
    param: number,
  ): number;

  /**
   * ```
   * integer retval, integer high32 = reaper.TrackFX_GetPinMappings(MediaTrack tr, integer fx, integer isoutput, integer pin)
   * ```
   * gets the effective channel mapping bitmask for a particular pin. high32Out will be set to the high 32 bits. Add 0x1000000 to pin index in order to access the second 64 bits of mappings independent of the first 64 bits. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetPinMappings(
    tr: MediaTrack,
    fx: number,
    isoutput: number,
    pin: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean retval, string presetname = reaper.TrackFX_GetPreset(MediaTrack track, integer fx)
   * ```
   * Get the name of the preset currently showing in the REAPER dropdown, or the full path to a factory preset file for VST3 plug-ins (.vstpreset). See TrackFX_SetPreset. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetPreset(
    track: MediaTrack,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer retval, integer numberOfPresets = reaper.TrackFX_GetPresetIndex(MediaTrack track, integer fx)
   * ```
   * Returns current preset index, or -1 if error. numberOfPresetsOut will be set to total number of presets available. See TrackFX_SetPresetByIndex FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetPresetIndex(
    track: MediaTrack,
    fx: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetRecChainVisible(MediaTrack track)
   * ```
   * returns index of effect visible in record input chain, or -1 for chain hidden, or -2 for chain visible but no effect selected
   */
  function TrackFX_GetRecChainVisible(track: MediaTrack): number;

  /**
   * ```
   * integer _ = reaper.TrackFX_GetRecCount(MediaTrack track)
   * ```
   * returns count of record input FX. To access record input FX, use a FX indices [0x1000000..0x1000000+n). On the master track, this accesses monitoring FX rather than record input FX.
   */
  function TrackFX_GetRecCount(track: MediaTrack): number;

  /**
   * ```
   * string fn = reaper.TrackFX_GetUserPresetFilename(MediaTrack track, integer fx)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_GetUserPresetFilename(track: MediaTrack, fx: number): string;

  /**
   * ```
   * boolean _ = reaper.TrackFX_NavigatePresets(MediaTrack track, integer fx, integer presetmove)
   * ```
   * presetmove==1 activates the next preset, presetmove==-1 activates the previous preset, etc. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_NavigatePresets(
    track: MediaTrack,
    fx: number,
    presetmove: number,
  ): boolean;

  /**
   * ```
   * reaper.TrackFX_SetEnabled(MediaTrack track, integer fx, boolean enabled)
   * ```
   * See TrackFX_GetEnabled FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetEnabled(
    track: MediaTrack,
    fx: number,
    enabled: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetEQBandEnabled(MediaTrack track, integer fxidx, integer bandtype, integer bandidx, boolean enable)
   * ```
   * Enable or disable a ReaEQ band.
   *
   * Returns false if track/fxidx is not ReaEQ.
   *
   * Bandtype: -1=master gain, 0=hipass, 1=loshelf, 2=band, 3=notch, 4=hishelf, 5=lopass, 6=bandpass, 7=parallel bandpass.
   *
   * Bandidx (ignored for master gain): 0=target first band matching bandtype, 1=target 2nd band matching bandtype, etc.
   *
   *
   *
   * See TrackFX_GetEQ, TrackFX_GetEQParam, TrackFX_SetEQParam, TrackFX_GetEQBandEnabled. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetEQBandEnabled(
    track: MediaTrack,
    fxidx: number,
    bandtype: number,
    bandidx: number,
    enable: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetEQParam(MediaTrack track, integer fxidx, integer bandtype, integer bandidx, integer paramtype, number val, boolean isnorm)
   * ```
   * Returns false if track/fxidx is not ReaEQ. Targets a band matching bandtype.
   *
   * Bandtype: -1=master gain, 0=hipass, 1=loshelf, 2=band, 3=notch, 4=hishelf, 5=lopass, 6=bandpass, 7=parallel bandpass.
   *
   * Bandidx (ignored for master gain): 0=target first band matching bandtype, 1=target 2nd band matching bandtype, etc.
   *
   * Paramtype (ignored for master gain): 0=freq, 1=gain, 2=Q.
   *
   * See TrackFX_GetEQ, TrackFX_GetEQParam, TrackFX_GetEQBandEnabled, TrackFX_SetEQBandEnabled. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetEQParam(
    track: MediaTrack,
    fxidx: number,
    bandtype: number,
    bandidx: number,
    paramtype: number,
    val: number,
    isnorm: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetNamedConfigParm(MediaTrack track, integer fx, string parmname, string value)
   * ```
   * sets plug-in specific named configuration value (returns true on success).
   *
   *
   *
   * Support values for write:
   *
   * vst_chunk[_program] : base64-encoded VST-specific chunk.
   *
   * clap_chunk : base64-encoded CLAP-specific chunk.
   *
   * param.X.lfo.[active,dir,phase,speed,strength,temposync,free,shape] : parameter moduation LFO state
   *
   * param.X.acs.[active,dir,strength,attack,release,dblo,dbhi,chan,stereo,x2,y2] : parameter modulation ACS state
   *
   * param.X.plink.[active,scale,offset,effect,param,midi_bus,midi_chan,midi_msg,midi_msg2] : parameter link/MIDI link: set effect=-100 to support midi_*
   *
   * param.X.mod.[active,baseline,visible] : parameter module global settings
   *
   * param.X.learn.[midi1,midi2,osc] : first two bytes of MIDI message, or OSC string if set
   *
   * param.X.learn.mode : absolution/relative mode flag (0: Absolute, 1: 127=-1,1=+1, 2: 63=-1, 65=+1, 3: 65=-1, 1=+1, 4: toggle if nonzero)
   *
   * param.X.learn.flags : &1=selected track only, &2=soft takeover, &4=focused FX only, &8=LFO retrigger, &16=visible FX only
   *
   * param.X.container_map.fx_index : index of FX contained in container
   *
   * param.X.container_map.fx_parm : parameter index of parameter of FX contained in container
   *
   * param.X.container_map.aliased_name : name of parameter (if user-renamed, otherwise fails)
   *
   * BANDTYPEx, BANDENABLEDx : band configuration [ReaEQ]
   *
   * THRESHOLD, CEILING, TRUEPEAK : [ReaLimit]
   *
   * NUMCHANNELS, NUMSPEAKERS, RESETCHANNELS : [ReaSurroundPan]
   *
   * ITEMx : [ReaVerb] state configuration line, when writing should be followed by a write of DONE
   *
   * FILE, FILEx, -FILEx, +FILEx, -FILE* : [RS5k] file list, -/+ prefixes are write-only, when writing any, should be followed by a write of DONE
   *
   * MODE, RSMODE : [RS5k] general mode, resample mode
   *
   * VIDEO_CODE : [video processor] code
   *
   * force_auto_bypass : 0 or 1 - force auto-bypass plug-in on silence
   *
   * parallel : 0, 1 or 2 - 1=process plug-in in parallel with previous, 2=process plug-in parallel and merge MIDI
   *
   * instance_oversample_shift : instance oversampling shift amount, 0=none, 1=~96k, 2=~192k, etc. When setting requires playback stop/start to take effect
   *
   * chain_oversample_shift : chain oversampling shift amount, 0=none, 1=~96k, 2=~192k, etc. When setting requires playback stop/start to take effect
   *
   * chain_pdc_mode : chain PDC mode (0=classic, 1=new-default, 2=ignore PDC, 3=hwcomp-master)
   *
   * chain_sel : selected/visible FX in chain
   *
   * renamed_name : renamed FX instance name (empty string = not renamed)
   *
   * container_nch : number of internal channels for container
   *
   * container_nch_in : number of input pins for container
   *
   * container_nch_out : number of output pints for container
   *
   * container_nch_feedback : number of internal feedback channels enabled in container
   *
   * focused : reading returns 1 if focused. Writing a positive value to this sets the FX UI as "last focused."
   *
   * last_touched : reading returns two integers, one indicates whether FX is the last-touched FX, the second indicates which parameter was last touched. Writing a negative value ensures this plug-in is not set as last touched, otherwise the FX is set "last touched," and last touched parameter index is set to the value in the string (if valid).
   *
   *  FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetNamedConfigParm(
    track: MediaTrack,
    fx: number,
    parmname: string,
    value: string,
  ): boolean;

  /**
   * ```
   * reaper.TrackFX_SetOffline(MediaTrack track, integer fx, boolean offline)
   * ```
   * See TrackFX_GetOffline FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetOffline(
    track: MediaTrack,
    fx: number,
    offline: boolean,
  ): void;

  /**
   * ```
   * reaper.TrackFX_SetOpen(MediaTrack track, integer fx, boolean open)
   * ```
   * Open this FX UI. See TrackFX_GetOpen FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetOpen(track: MediaTrack, fx: number, open: boolean): void;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetParam(MediaTrack track, integer fx, integer param, number val)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetParam(
    track: MediaTrack,
    fx: number,
    param: number,
    val: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetParamNormalized(MediaTrack track, integer fx, integer param, number value)
   * ```
   * FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetParamNormalized(
    track: MediaTrack,
    fx: number,
    param: number,
    value: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetPinMappings(MediaTrack tr, integer fx, integer isoutput, integer pin, integer low32bits, integer hi32bits)
   * ```
   * sets the channel mapping bitmask for a particular pin. returns false if unsupported (not all types of plug-ins support this capability). Add 0x1000000 to pin index in order to access the second 64 bits of mappings independent of the first 64 bits. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetPinMappings(
    tr: MediaTrack,
    fx: number,
    isoutput: number,
    pin: number,
    low32bits: number,
    hi32bits: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetPreset(MediaTrack track, integer fx, string presetname)
   * ```
   * Activate a preset with the name shown in the REAPER dropdown. Full paths to .vstpreset files are also supported for VST3 plug-ins. See TrackFX_GetPreset. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetPreset(
    track: MediaTrack,
    fx: number,
    presetname: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.TrackFX_SetPresetByIndex(MediaTrack track, integer fx, integer idx)
   * ```
   * Sets the preset idx, or the factory preset (idx==-2), or the default user preset (idx==-1). Returns true on success. See TrackFX_GetPresetIndex. FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_SetPresetByIndex(
    track: MediaTrack,
    fx: number,
    idx: number,
  ): boolean;

  /**
   * ```
   * reaper.TrackFX_Show(MediaTrack track, integer index, integer showFlag)
   * ```
   * showflag=0 for hidechain, =1 for show chain(index valid), =2 for hide floating window(index valid), =3 for show floating window (index valid) FX indices for tracks can have 0x1000000 added to them in order to reference record input FX (normal tracks) or hardware output FX (master track). FX indices can have 0x2000000 added to them, in which case they will be used to address FX in containers. To address a container, the 1-based subitem is multiplied by one plus the count of the FX chain and added to the 1-based container item index. e.g. to address the third item in the container at the second position of the track FX chain for tr, the index would be 0x2000000 + 3*(TrackFX_GetCount(tr)+1) + 2. This can be extended to sub-containers using TrackFX_GetNamedConfigParm with container_count and similar logic. In REAPER v7.06+, you can use the much more convenient method to navigate hierarchies, see TrackFX_GetNamedConfigParm with parent_container and container_item.X.
   */
  function TrackFX_Show(
    track: MediaTrack,
    index: number,
    showFlag: number,
  ): void;

  /**
   * ```
   * reaper.TrackList_AdjustWindows(boolean isMinor)
   * ```
   */
  function TrackList_AdjustWindows(isMinor: boolean): void;

  /**
   * ```
   * reaper.TrackList_UpdateAllExternalSurfaces()
   * ```
   */
  function TrackList_UpdateAllExternalSurfaces(): void;

  /**
   * ```
   * reaper.Undo_BeginBlock()
   * ```
   * call to start a new block
   */
  function Undo_BeginBlock(): void;

  /** call to start a new block */
  function Undo_BeginBlock2(proj: ReaProject): void;

  /**
   * ```
   * string _ = reaper.Undo_CanRedo2(ReaProject proj)
   * ```
   * returns string of next action,if able,NULL if not
   */
  function Undo_CanRedo2(proj: ReaProject): string;

  /**
   * ```
   * string _ = reaper.Undo_CanUndo2(ReaProject proj)
   * ```
   * returns string of last action,if able,NULL if not
   */
  function Undo_CanUndo2(proj: ReaProject): string;

  /**
   * ```
   * integer _ = reaper.Undo_DoRedo2(ReaProject proj)
   * ```
   * nonzero if success
   */
  function Undo_DoRedo2(proj: ReaProject): number;

  /**
   * ```
   * integer _ = reaper.Undo_DoUndo2(ReaProject proj)
   * ```
   * nonzero if success
   */
  function Undo_DoUndo2(proj: ReaProject): number;

  /**
   * ```
   * reaper.Undo_EndBlock(string descchange, integer extraflags)
   * ```
   * call to end the block,with extra flags if any,and a description
   */
  function Undo_EndBlock(descchange: string, extraflags: number): void;

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
    proj: ReaProject,
    descchange: string,
    extraflags: number,
  ): void;

  /**
   * ```
   * reaper.Undo_OnStateChange(string descchange)
   * ```
   * limited state change to items
   */
  function Undo_OnStateChange(descchange: string): void;

  /**
   * ```
   * reaper.Undo_OnStateChange2(ReaProject proj, string descchange)
   * ```
   * limited state change to items
   */
  function Undo_OnStateChange2(proj: ReaProject, descchange: string): void;

  /**
   * ```
   * reaper.Undo_OnStateChange_Item(ReaProject proj, string name, MediaItem item)
   * ```
   */
  function Undo_OnStateChange_Item(
    proj: ReaProject,
    name: string,
    item: MediaItem,
  ): void;

  /**
   * ```
   * reaper.Undo_OnStateChangeEx(string descchange, integer whichStates, integer trackparm)
   * ```
   * trackparm=-1 by default,or if updating one fx chain,you can specify track index
   */
  function Undo_OnStateChangeEx(
    descchange: string,
    whichStates: number,
    trackparm: number,
  ): void;

  /**
   * ```
   * reaper.Undo_OnStateChangeEx2(ReaProject proj, string descchange, integer whichStates, integer trackparm)
   * ```
   * trackparm=-1 by default,or if updating one fx chain,you can specify track index
   */
  function Undo_OnStateChangeEx2(
    proj: ReaProject,
    descchange: string,
    whichStates: number,
    trackparm: number,
  ): void;

  /**
   * ```
   * reaper.UpdateArrange()
   * ```
   * Redraw the arrange view
   */
  function UpdateArrange(): void;

  /**
   * ```
   * reaper.UpdateItemInProject(MediaItem item)
   * ```
   */
  function UpdateItemInProject(item: MediaItem): void;

  /**
   * ```
   * boolean _ = reaper.UpdateItemLanes(ReaProject proj)
   * ```
   * Recalculate lane arrangement for fixed lane tracks, including auto-removing empty lanes at the bottom of the track
   */
  function UpdateItemLanes(proj: ReaProject): boolean;

  /**
   * ```
   * reaper.UpdateTimeline()
   * ```
   * Redraw the arrange view and ruler
   */
  function UpdateTimeline(): void;

  /**
   * ```
   * boolean _ = reaper.ValidatePtr(identifier pointer, string ctypename)
   * ```
   * see ValidatePtr2
   */
  function ValidatePtr(pointer: identifier, ctypename: string): boolean;

  /**
   * ```
   * boolean _ = reaper.ValidatePtr2(ReaProject proj, identifier pointer, string ctypename)
   * ```
   * Return true if the pointer is a valid object of the right type in proj (proj is ignored if pointer is itself a project). Supported types are: ReaProject*, MediaTrack*, MediaItem*, MediaItem_Take*, TrackEnvelope* and PCM_source*.
   */
  function ValidatePtr2(
    proj: ReaProject,
    pointer: identifier,
    ctypename: string,
  ): boolean;

  /**
   * ```
   * reaper.ViewPrefs(integer page, string pageByName)
   * ```
   * Opens the prefs to a page, use pageByName if page is 0.
   */
  function ViewPrefs(page: number, pageByName: string): void;

  /**
   * ```
   * BR_Envelope _ = reaper.BR_EnvAlloc(TrackEnvelope envelope, boolean takeEnvelopesUseProjectTime)
   * ```
   * [BR] Allocate envelope object from track or take envelope pointer. Always call BR_EnvFree when done to release the object and commit changes if needed.
   *
   *  takeEnvelopesUseProjectTime: take envelope points' positions are counted from take position, not project start time. If you want to work with project time instead, pass this as true.
   *
   *
   *
   * For further manipulation see BR_EnvCountPoints, BR_EnvDeletePoint, BR_EnvFind, BR_EnvFindNext, BR_EnvFindPrevious, BR_EnvGetParentTake, BR_EnvGetParentTrack, BR_EnvGetPoint, BR_EnvGetProperties, BR_EnvSetPoint, BR_EnvSetProperties, BR_EnvValueAtPos.
   */
  function BR_EnvAlloc(
    envelope: TrackEnvelope,
    takeEnvelopesUseProjectTime: boolean,
  ): BR_Envelope;

  /**
   * ```
   * integer _ = reaper.BR_EnvCountPoints(BR_Envelope envelope)
   * ```
   * [BR] Count envelope points in the envelope object allocated with BR_EnvAlloc.
   */
  function BR_EnvCountPoints(envelope: BR_Envelope): number;

  /**
   * ```
   * boolean _ = reaper.BR_EnvDeletePoint(BR_Envelope envelope, integer id)
   * ```
   * [BR] Delete envelope point by index (zero-based) in the envelope object allocated with BR_EnvAlloc. Returns true on success.
   */
  function BR_EnvDeletePoint(envelope: BR_Envelope, id: number): boolean;

  /**
   * ```
   * integer _ = reaper.BR_EnvFind(BR_Envelope envelope, number position, number delta)
   * ```
   * [BR] Find envelope point at time position in the envelope object allocated with BR_EnvAlloc. Pass delta > 0 to search surrounding range - in that case the closest point to position within delta will be searched for. Returns envelope point id (zero-based) on success or -1 on failure.
   */
  function BR_EnvFind(
    envelope: BR_Envelope,
    position: number,
    delta: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.BR_EnvFindNext(BR_Envelope envelope, number position)
   * ```
   * [BR] Find next envelope point after time position in the envelope object allocated with BR_EnvAlloc. Returns envelope point id (zero-based) on success or -1 on failure.
   */
  function BR_EnvFindNext(envelope: BR_Envelope, position: number): number;

  /**
   * ```
   * integer _ = reaper.BR_EnvFindPrevious(BR_Envelope envelope, number position)
   * ```
   * [BR] Find previous envelope point before time position in the envelope object allocated with BR_EnvAlloc. Returns envelope point id (zero-based) on success or -1 on failure.
   */
  function BR_EnvFindPrevious(envelope: BR_Envelope, position: number): number;

  /**
   * ```
   * boolean _ = reaper.BR_EnvFree(BR_Envelope envelope, boolean commit)
   * ```
   * [BR] Free envelope object allocated with BR_EnvAlloc and commit changes if needed. Returns true if changes were committed successfully. Note that when envelope object wasn't modified nothing will get committed even if commit = true - in that case function returns false.
   */
  function BR_EnvFree(envelope: BR_Envelope, commit: boolean): boolean;

  /**
   * ```
   * MediaItem_Take _ = reaper.BR_EnvGetParentTake(BR_Envelope envelope)
   * ```
   * [BR] If envelope object allocated with BR_EnvAlloc is take envelope, returns parent media item take, otherwise NULL.
   */
  function BR_EnvGetParentTake(envelope: BR_Envelope): MediaItem_Take;

  /**
   * ```
   * MediaTrack _ = reaper.BR_EnvGetParentTrack(BR_Envelope envelope)
   * ```
   * [BR] Get parent track of envelope object allocated with BR_EnvAlloc. If take envelope, returns NULL.
   */
  function BR_EnvGetParentTrack(envelope: BR_Envelope): MediaTrack;

  /**
   * ```
   * boolean retval, number position, number value, integer shape, boolean selected, number bezier = reaper.BR_EnvGetPoint(BR_Envelope envelope, integer id)
   * ```
   * [BR] Get envelope point by id (zero-based) from the envelope object allocated with BR_EnvAlloc. Returns true on success.
   */
  function BR_EnvGetPoint(
    envelope: BR_Envelope,
    id: number,
  ): LuaMultiReturn<[boolean, number, number, number, boolean, number]>;

  /**
   * ```
   * boolean active, boolean visible, boolean armed, boolean inLane, integer laneHeight, integer defaultShape, number minValue, number maxValue, number centerValue, integer type, boolean faderScaling, optional integer automationItemsOptions = reaper.BR_EnvGetProperties(BR_Envelope envelope)
   * ```
   * [BR] Get envelope properties for the envelope object allocated with BR_EnvAlloc.
   *
   *
   *
   * active: true if envelope is active
   *
   * visible: true if envelope is visible
   *
   * armed: true if envelope is armed
   *
   * inLane: true if envelope has it's own envelope lane
   *
   * laneHeight: envelope lane override height. 0 for none, otherwise size in pixels
   *
   * defaultShape: default point shape: 0->Linear, 1->Square, 2->Slow start/end, 3->Fast start, 4->Fast end, 5->Bezier
   *
   * minValue: minimum envelope value
   *
   * maxValue: maximum envelope value
   *
   * type: envelope type: 0->Volume, 1->Volume (Pre-FX), 2->Pan, 3->Pan (Pre-FX), 4->Width, 5->Width (Pre-FX), 6->Mute, 7->Pitch, 8->Playrate, 9->Tempo map, 10->Parameter
   *
   * faderScaling: true if envelope uses fader scaling
   *
   * automationItemsOptions: -1->project default, &1=0->don't attach to underl. env., &1->attach to underl. env. on right side,  &2->attach to underl. env. on both sides, &4: bypass underl. env.
   */
  function BR_EnvGetProperties(
    envelope: BR_Envelope,
  ): LuaMultiReturn<
    [
      boolean,
      boolean,
      boolean,
      boolean,
      number,
      number,
      number,
      number,
      number,
      number,
      boolean,
      number,
    ]
  >;

  /**
   * ```
   * boolean _ = reaper.BR_EnvSetPoint(BR_Envelope envelope, integer id, number position, number value, integer shape, boolean selected, number bezier)
   * ```
   * [BR] Set envelope point by id (zero-based) in the envelope object allocated with BR_EnvAlloc. To create point instead, pass id = -1. Note that if new point is inserted or existing point's time position is changed, points won't automatically get sorted. To do that, see BR_EnvSortPoints.
   *
   * Returns true on success.
   */
  function BR_EnvSetPoint(
    envelope: BR_Envelope,
    id: number,
    position: number,
    value: number,
    shape: number,
    selected: boolean,
    bezier: number,
  ): boolean;

  /**
   * ```
   * reaper.BR_EnvSetProperties(BR_Envelope envelope, boolean active, boolean visible, boolean armed, boolean inLane, integer laneHeight, integer defaultShape, boolean faderScaling, optional integer automationItemsOptionsIn)
   * ```
   * [BR] Set envelope properties for the envelope object allocated with BR_EnvAlloc. For parameter description see BR_EnvGetProperties.
   *
   * Setting automationItemsOptions requires REAPER 5.979+.
   */
  function BR_EnvSetProperties(
    envelope: BR_Envelope,
    active: boolean,
    visible: boolean,
    armed: boolean,
    inLane: boolean,
    laneHeight: number,
    defaultShape: number,
    faderScaling: boolean,
    automationItemsOptionsIn?: number,
  ): void;

  /**
   * ```
   * reaper.BR_EnvSortPoints(BR_Envelope envelope)
   * ```
   * [BR] Sort envelope points by position. The only reason to call this is if sorted points are explicitly needed after editing them with BR_EnvSetPoint. Note that you do not have to call this before doing BR_EnvFree since it does handle unsorted points too.
   */
  function BR_EnvSortPoints(envelope: BR_Envelope): void;

  /**
   * ```
   * number _ = reaper.BR_EnvValueAtPos(BR_Envelope envelope, number position)
   * ```
   * [BR] Get envelope value at time position for the envelope object allocated with BR_EnvAlloc.
   */
  function BR_EnvValueAtPos(envelope: BR_Envelope, position: number): number;

  /**
   * ```
   * number startTime, number endTime = reaper.BR_GetArrangeView(ReaProject proj)
   * ```
   * [BR] Deprecated, see GetSet_ArrangeView2 (REAPER v5.12pre4+) -- Get start and end time position of arrange view. To set arrange view instead, see BR_SetArrangeView.
   * @deprecated
   */
  function BR_GetArrangeView(
    proj: ReaProject,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.BR_GetClosestGridDivision(number position)
   * ```
   * [BR] Get closest grid division to position. Note that this functions is different from SnapToGrid in two regards. SnapToGrid() needs snap enabled to work and this one works always. Secondly, grid divisions are different from grid lines because some grid lines may be hidden due to zoom level - this function ignores grid line visibility and always searches for the closest grid division at given position. For more grid division functions, see BR_GetNextGridDivision and BR_GetPrevGridDivision.
   */
  function BR_GetClosestGridDivision(position: number): number;

  /**
   * ```
   * string themePath, string themeName = reaper.BR_GetCurrentTheme()
   * ```
   * [BR] Get current theme information. themePathOut is set to full theme path and themeNameOut is set to theme name excluding any path info and extension
   */
  function BR_GetCurrentTheme(): LuaMultiReturn<[string, string]>;

  /**
   * ```
   * MediaItem _ = reaper.BR_GetMediaItemByGUID(ReaProject proj, string guidStringIn)
   * ```
   * [BR] Get media item from GUID string. Note that the GUID must be enclosed in braces {}. To get item's GUID as a string, see BR_GetMediaItemGUID.
   */
  function BR_GetMediaItemByGUID(
    proj: ReaProject,
    guidStringIn: string,
  ): MediaItem;

  /**
   * ```
   * string guidString = reaper.BR_GetMediaItemGUID(MediaItem item)
   * ```
   * [BR] Get media item GUID as a string (guidStringOut_sz should be at least 64). To get media item back from GUID string, see BR_GetMediaItemByGUID.
   */
  function BR_GetMediaItemGUID(item: MediaItem): string;

  /**
   * ```
   * boolean retval, string image, integer imageFlags = reaper.BR_GetMediaItemImageResource(MediaItem item)
   * ```
   * [BR] Get currently loaded image resource and its flags for a given item. Returns false if there is no image resource set. To set image resource, see BR_SetMediaItemImageResource.
   */
  function BR_GetMediaItemImageResource(
    item: MediaItem,
  ): LuaMultiReturn<[boolean, string, number]>;

  /**
   * ```
   * string guidString = reaper.BR_GetMediaItemTakeGUID(MediaItem_Take take)
   * ```
   * [BR] Get media item take GUID as a string (guidStringOut_sz should be at least 64). To get take from GUID string, see SNM_GetMediaItemTakeByGUID.
   */
  function BR_GetMediaItemTakeGUID(take: MediaItem_Take): string;

  /**
   * ```
   * boolean retval, boolean section, number start, number length, number fade, boolean reverse = reaper.BR_GetMediaSourceProperties(MediaItem_Take take)
   * ```
   * [BR] Get take media source properties as they appear in Item properties. Returns false if take can't have them (MIDI items etc.).
   *
   * To set source properties, see BR_SetMediaSourceProperties.
   */
  function BR_GetMediaSourceProperties(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, boolean, number, number, number, boolean]>;

  /**
   * ```
   * MediaTrack _ = reaper.BR_GetMediaTrackByGUID(ReaProject proj, string guidStringIn)
   * ```
   * [BR] Get media track from GUID string. Note that the GUID must be enclosed in braces {}. To get track's GUID as a string, see GetSetMediaTrackInfo_String.
   */
  function BR_GetMediaTrackByGUID(
    proj: ReaProject,
    guidStringIn: string,
  ): MediaTrack;

  /**
   * ```
   * integer _ = reaper.BR_GetMediaTrackFreezeCount(MediaTrack track)
   * ```
   * [BR] Get media track freeze count (if track isn't frozen at all, returns 0).
   */
  function BR_GetMediaTrackFreezeCount(track: MediaTrack): number;

  /**
   * ```
   * string guidString = reaper.BR_GetMediaTrackGUID(MediaTrack track)
   * ```
   * [BR] Deprecated, see GetSetMediaTrackInfo_String (v5.95+). Get media track GUID as a string (guidStringOut_sz should be at least 64). To get media track back from GUID string, see BR_GetMediaTrackByGUID.
   * @deprecated
   */
  function BR_GetMediaTrackGUID(track: MediaTrack): string;

  /**
   * ```
   * string mcpLayoutName, string tcpLayoutName = reaper.BR_GetMediaTrackLayouts(MediaTrack track)
   * ```
   * [BR] Deprecated, see GetSetMediaTrackInfo (REAPER v5.02+). Get media track layouts for MCP and TCP. Empty string ("") means that layout is set to the default layout. To set media track layouts, see BR_SetMediaTrackLayouts.
   * @deprecated
   */
  function BR_GetMediaTrackLayouts(
    track: MediaTrack,
  ): LuaMultiReturn<[string, string]>;

  /**
   * ```
   * TrackEnvelope _ = reaper.BR_GetMediaTrackSendInfo_Envelope(MediaTrack track, integer category, integer sendidx, integer envelopeType)
   * ```
   * [BR] Get track envelope for send/receive/hardware output.
   *
   *
   *
   * category is <0 for receives, 0=sends, >0 for hardware outputs
   *
   * sendidx is zero-based (see GetTrackNumSends to count track sends/receives/hardware outputs)
   *
   * envelopeType determines which envelope is returned (0=volume, 1=pan, 2=mute)
   *
   *
   *
   * Note: To get or set other send attributes, see BR_GetSetTrackSendInfo and BR_GetMediaTrackSendInfo_Track.
   */
  function BR_GetMediaTrackSendInfo_Envelope(
    track: MediaTrack,
    category: number,
    sendidx: number,
    envelopeType: number,
  ): TrackEnvelope;

  /**
   * ```
   * MediaTrack _ = reaper.BR_GetMediaTrackSendInfo_Track(MediaTrack track, integer category, integer sendidx, integer trackType)
   * ```
   * [BR] Get source or destination media track for send/receive.
   *
   *
   *
   * category is <0 for receives, 0=sends
   *
   * sendidx is zero-based (see GetTrackNumSends to count track sends/receives)
   *
   * trackType determines which track is returned (0=source track, 1=destination track)
   *
   *
   *
   * Note: To get or set other send attributes, see BR_GetSetTrackSendInfo and BR_GetMediaTrackSendInfo_Envelope.
   */
  function BR_GetMediaTrackSendInfo_Track(
    track: MediaTrack,
    category: number,
    sendidx: number,
    trackType: number,
  ): MediaTrack;

  /**
   * ```
   * number _ = reaper.BR_GetMidiSourceLenPPQ(MediaItem_Take take)
   * ```
   * [BR] Get MIDI take source length in PPQ. In case the take isn't MIDI, return value will be -1.
   */
  function BR_GetMidiSourceLenPPQ(take: MediaItem_Take): number;

  /**
   * ```
   * boolean retval, string guidString = reaper.BR_GetMidiTakePoolGUID(MediaItem_Take take)
   * ```
   * [BR] Get MIDI take pool GUID as a string (guidStringOut_sz should be at least 64). Returns true if take is pooled.
   */
  function BR_GetMidiTakePoolGUID(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, boolean ignoreProjTempo, number bpm, integer num, integer den = reaper.BR_GetMidiTakeTempoInfo(MediaItem_Take take)
   * ```
   * [BR] Get "ignore project tempo" information for MIDI take. Returns true if take can ignore project tempo (no matter if it's actually ignored), otherwise false.
   */
  function BR_GetMidiTakeTempoInfo(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, boolean, number, number, number]>;

  /**
   * ```
   * string window, string segment, string details = reaper.BR_GetMouseCursorContext()
   * ```
   * [BR] Get mouse cursor context. Each parameter returns information in a form of string as specified in the table below.
   *
   *
   *
   * To get more info on stuff that was found under mouse cursor see BR_GetMouseCursorContext_Envelope, BR_GetMouseCursorContext_Item, BR_GetMouseCursorContext_MIDI, BR_GetMouseCursorContext_Position, BR_GetMouseCursorContext_Take, BR_GetMouseCursorContext_Track
   *
   *
   *
   * Window Segment Details  unknown       ""          ""                                                             ruler         region_lane   ""                                                              marker_lane   ""                                                              tempo_lane    ""                                                              timeline      ""                                                             transport     ""          ""                                                             tcp           track         ""                                                              envelope      ""                                                              empty         ""                                                             mcp           track         ""                                                              empty         ""                                                             arrange       track         empty,item, item_stretch_marker,env_point, env_segment    envelope      empty, env_point, env_segment                                     empty         ""                                                             midi_editor   unknown       ""                                                              ruler         ""                                                              piano         ""                                                              notes         ""                                                              cc_lane       cc_selector, cc_lane
   */
  function BR_GetMouseCursorContext(): LuaMultiReturn<[string, string, string]>;

  /**
   * ```
   * TrackEnvelope retval, boolean takeEnvelope = reaper.BR_GetMouseCursorContext_Envelope()
   * ```
   * [BR] Returns envelope that was captured with the last call to BR_GetMouseCursorContext. In case the envelope belongs to take, takeEnvelope will be true.
   */
  function BR_GetMouseCursorContext_Envelope(): LuaMultiReturn<
    [TrackEnvelope, boolean]
  >;

  /**
   * ```
   * MediaItem _ = reaper.BR_GetMouseCursorContext_Item()
   * ```
   * [BR] Returns item under mouse cursor that was captured with the last call to BR_GetMouseCursorContext. Note that the function will return item even if mouse cursor is over some other track lane element like stretch marker or envelope. This enables for easier identification of items when you want to ignore elements within the item.
   */
  function BR_GetMouseCursorContext_Item(): MediaItem;

  /**
   * ```
   * identifier retval, boolean inlineEditor, integer noteRow, integer ccLane, integer ccLaneVal, integer ccLaneId = reaper.BR_GetMouseCursorContext_MIDI()
   * ```
   * [BR] Returns midi editor under mouse cursor that was captured with the last call to BR_GetMouseCursorContext.
   *
   *
   *
   * inlineEditor: if mouse was captured in inline MIDI editor, this will be true (consequentially, returned MIDI editor will be NULL)
   *
   * noteRow: note row or piano key under mouse cursor (0-127)
   *
   * ccLane: CC lane under mouse cursor (CC0-127=CC, 0x100|(0-31)=14-bit CC, 0x200=velocity, 0x201=pitch, 0x202=program, 0x203=channel pressure, 0x204=bank/program select, 0x205=text, 0x206=sysex, 0x207=off velocity, 0x208=notation events)
   *
   * ccLaneVal: value in CC lane under mouse cursor (0-127 or 0-16383)
   *
   * ccLaneId: lane position, counting from the top (0 based)
   *
   *
   *
   * Note: due to API limitations, if mouse is over inline MIDI editor with some note rows hidden, noteRow will be -1
   */
  function BR_GetMouseCursorContext_MIDI(): LuaMultiReturn<
    [identifier, boolean, number, number, number, number]
  >;

  /**
   * ```
   * number _ = reaper.BR_GetMouseCursorContext_Position()
   * ```
   * [BR] Returns project time position in arrange/ruler/midi editor that was captured with the last call to BR_GetMouseCursorContext.
   */
  function BR_GetMouseCursorContext_Position(): number;

  /**
   * ```
   * integer _ = reaper.BR_GetMouseCursorContext_StretchMarker()
   * ```
   * [BR] Returns id of a stretch marker under mouse cursor that was captured with the last call to BR_GetMouseCursorContext.
   */
  function BR_GetMouseCursorContext_StretchMarker(): number;

  /**
   * ```
   * MediaItem_Take _ = reaper.BR_GetMouseCursorContext_Take()
   * ```
   * [BR] Returns take under mouse cursor that was captured with the last call to BR_GetMouseCursorContext.
   */
  function BR_GetMouseCursorContext_Take(): MediaItem_Take;

  /**
   * ```
   * MediaTrack _ = reaper.BR_GetMouseCursorContext_Track()
   * ```
   * [BR] Returns track under mouse cursor that was captured with the last call to BR_GetMouseCursorContext.
   */
  function BR_GetMouseCursorContext_Track(): MediaTrack;

  /**
   * ```
   * number _ = reaper.BR_GetNextGridDivision(number position)
   * ```
   * [BR] Get next grid division after the time position. For more grid divisions function, see BR_GetClosestGridDivision and BR_GetPrevGridDivision.
   */
  function BR_GetNextGridDivision(position: number): number;

  /**
   * ```
   * number _ = reaper.BR_GetPrevGridDivision(number position)
   * ```
   * [BR] Get previous grid division before the time position. For more grid division functions, see BR_GetClosestGridDivision and BR_GetNextGridDivision.
   */
  function BR_GetPrevGridDivision(position: number): number;

  /**
   * ```
   * number _ = reaper.BR_GetSetTrackSendInfo(MediaTrack track, integer category, integer sendidx, string parmname, boolean setNewValue, number newValue)
   * ```
   * [BR] Get or set send attributes.
   *
   *
   *
   * category is <0 for receives, 0=sends, >0 for hardware outputs
   *
   * sendidx is zero-based (see GetTrackNumSends to count track sends/receives/hardware outputs)
   *
   * To set attribute, pass setNewValue as true
   *
   *
   *
   * List of possible parameters:
   *
   * B_MUTE : send mute state (1.0 if muted, otherwise 0.0)
   *
   * B_PHASE : send phase state (1.0 if phase is inverted, otherwise 0.0)
   *
   * B_MONO : send mono state (1.0 if send is set to mono, otherwise 0.0)
   *
   * D_VOL : send volume (1.0=+0dB etc...)
   *
   * D_PAN : send pan (-1.0=100%L, 0=center, 1.0=100%R)
   *
   * D_PANLAW : send pan law (1.0=+0.0db, 0.5=-6dB, -1.0=project default etc...)
   *
   * I_SENDMODE : send mode (0=post-fader, 1=pre-fx, 2=post-fx(deprecated), 3=post-fx)
   *
   * I_SRCCHAN : audio source starting channel index or -1 if audio send is disabled (&1024=mono...note that in that case, when reading index, you should do (index XOR 1024) to get starting channel index)
   *
   * I_DSTCHAN : audio destination starting channel index (&1024=mono (and in case of hardware output &512=rearoute)...note that in that case, when reading index, you should do (index XOR (1024 OR 512)) to get starting channel index)
   *
   * I_MIDI_SRCCHAN : source MIDI channel, -1 if MIDI send is disabled (0=all, 1-16)
   *
   * I_MIDI_DSTCHAN : destination MIDI channel, -1 if MIDI send is disabled (0=original, 1-16)
   *
   * I_MIDI_SRCBUS : source MIDI bus, -1 if MIDI send is disabled (0=all, otherwise bus index)
   *
   * I_MIDI_DSTBUS : receive MIDI bus, -1 if MIDI send is disabled (0=all, otherwise bus index)
   *
   * I_MIDI_LINK_VOLPAN : link volume/pan controls to MIDI
   *
   *
   *
   * Note: To get or set other send attributes, see BR_GetMediaTrackSendInfo_Envelope and BR_GetMediaTrackSendInfo_Track.
   */
  function BR_GetSetTrackSendInfo(
    track: MediaTrack,
    category: number,
    sendidx: number,
    parmname: string,
    setNewValue: boolean,
    newValue: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.BR_GetTakeFXCount(MediaItem_Take take)
   * ```
   * [BR] Returns FX count for supplied take
   */
  function BR_GetTakeFXCount(take: MediaItem_Take): number;

  /**
   * ```
   * boolean _ = reaper.BR_IsMidiOpenInInlineEditor(MediaItem_Take take)
   * ```
   * [SWS] Check if take has MIDI inline editor open and returns true or false.
   */
  function BR_IsMidiOpenInInlineEditor(take: MediaItem_Take): boolean;

  /**
   * ```
   * boolean retval, boolean inProjectMidi = reaper.BR_IsTakeMidi(MediaItem_Take take)
   * ```
   * [BR] Check if take is MIDI take, in case MIDI take is in-project MIDI source data, inProjectMidiOut will be true, otherwise false.
   */
  function BR_IsTakeMidi(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * MediaItem retval, number position = reaper.BR_ItemAtMouseCursor()
   * ```
   * [BR] Get media item under mouse cursor. Position is mouse cursor position in arrange.
   */
  function BR_ItemAtMouseCursor(): LuaMultiReturn<[MediaItem, number]>;

  /**
   * ```
   * boolean _ = reaper.BR_MIDI_CCLaneRemove(identifier midiEditor, integer laneId)
   * ```
   * [BR] Remove CC lane in midi editor. Top visible CC lane is laneId 0. Returns true on success
   */
  function BR_MIDI_CCLaneRemove(
    midiEditor: identifier,
    laneId: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_MIDI_CCLaneReplace(identifier midiEditor, integer laneId, integer newCC)
   * ```
   * [BR] Replace CC lane in midi editor. Top visible CC lane is laneId 0. Returns true on success.
   *
   * Valid CC lanes: CC0-127=CC, 0x100|(0-31)=14-bit CC, 0x200=velocity, 0x201=pitch, 0x202=program, 0x203=channel pressure, 0x204=bank/program select, 0x205=text, 0x206=sysex, 0x207
   */
  function BR_MIDI_CCLaneReplace(
    midiEditor: identifier,
    laneId: number,
    newCC: number,
  ): boolean;

  /**
   * ```
   * number _ = reaper.BR_PositionAtMouseCursor(boolean checkRuler)
   * ```
   * [BR] Get position at mouse cursor. To check ruler along with arrange, pass checkRuler=true. Returns -1 if cursor is not over arrange/ruler.
   */
  function BR_PositionAtMouseCursor(checkRuler: boolean): number;

  /**
   * ```
   * reaper.BR_SetArrangeView(ReaProject proj, number startTime, number endTime)
   * ```
   * [BR] Deprecated, see GetSet_ArrangeView2 (REAPER v5.12pre4+) -- Set start and end time position of arrange view. To get arrange view instead, see BR_GetArrangeView.
   * @deprecated
   */
  function BR_SetArrangeView(
    proj: ReaProject,
    startTime: number,
    endTime: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.BR_SetItemEdges(MediaItem item, number startTime, number endTime)
   * ```
   * [BR] Set item start and end edges' position - returns true in case of any changes
   */
  function BR_SetItemEdges(
    item: MediaItem,
    startTime: number,
    endTime: number,
  ): boolean;

  /**
   * ```
   * reaper.BR_SetMediaItemImageResource(MediaItem item, string imageIn, integer imageFlags)
   * ```
   * [BR] Set image resource and its flags for a given item. To clear current image resource, pass imageIn as "".
   *
   * imageFlags: &1=0: don't display image, &1: center / tile, &3: stretch, &5: full height (REAPER 5.974+).
   *
   * Can also be used to display existing text in empty items unstretched (pass imageIn = "", imageFlags = 0) or stretched (pass imageIn = "". imageFlags = 3).
   *
   * To get image resource, see BR_GetMediaItemImageResource.
   */
  function BR_SetMediaItemImageResource(
    item: MediaItem,
    imageIn: string,
    imageFlags: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.BR_SetMediaSourceProperties(MediaItem_Take take, boolean section, number start, number length, number fade, boolean reverse)
   * ```
   * [BR] Set take media source properties. Returns false if take can't have them (MIDI items etc.). Section parameters have to be valid only when passing section=true.
   *
   * To get source properties, see BR_GetMediaSourceProperties.
   */
  function BR_SetMediaSourceProperties(
    take: MediaItem_Take,
    section: boolean,
    start: number,
    length: number,
    fade: number,
    reverse: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_SetMediaTrackLayouts(MediaTrack track, string mcpLayoutNameIn, string tcpLayoutNameIn)
   * ```
   * [BR] Deprecated, see GetSetMediaTrackInfo (REAPER v5.02+). Set media track layouts for MCP and TCP. To set default layout, pass empty string ("") as layout name. In case layouts were successfully set, returns true (if layouts are already set to supplied layout names, it will return false since no changes were made).
   *
   * To get media track layouts, see BR_GetMediaTrackLayouts.
   * @deprecated
   */
  function BR_SetMediaTrackLayouts(
    track: MediaTrack,
    mcpLayoutNameIn: string,
    tcpLayoutNameIn: string,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_SetMidiTakeTempoInfo(MediaItem_Take take, boolean ignoreProjTempo, number bpm, integer num, integer den)
   * ```
   * [BR] Set "ignore project tempo" information for MIDI take. Returns true in case the take was successfully updated.
   */
  function BR_SetMidiTakeTempoInfo(
    take: MediaItem_Take,
    ignoreProjTempo: boolean,
    bpm: number,
    num: number,
    den: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_SetTakeSourceFromFile(MediaItem_Take take, string filenameIn, boolean inProjectData)
   * ```
   * [BR] Set new take source from file. To import MIDI file as in-project source data pass inProjectData=true. Returns false if failed.
   *
   * Any take source properties from the previous source will be lost - to preserve them, see BR_SetTakeSourceFromFile2.
   *
   * Note: To set source from existing take, see SNM_GetSetSourceState2.
   */
  function BR_SetTakeSourceFromFile(
    take: MediaItem_Take,
    filenameIn: string,
    inProjectData: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_SetTakeSourceFromFile2(MediaItem_Take take, string filenameIn, boolean inProjectData, boolean keepSourceProperties)
   * ```
   * [BR] Differs from BR_SetTakeSourceFromFile only that it can also preserve existing take media source properties.
   */
  function BR_SetTakeSourceFromFile2(
    take: MediaItem_Take,
    filenameIn: string,
    inProjectData: boolean,
    keepSourceProperties: boolean,
  ): boolean;

  /**
   * ```
   * MediaItem_Take retval, number position = reaper.BR_TakeAtMouseCursor()
   * ```
   * [BR] Get take under mouse cursor. Position is mouse cursor position in arrange.
   */
  function BR_TakeAtMouseCursor(): LuaMultiReturn<[MediaItem_Take, number]>;

  /**
   * ```
   * MediaTrack retval, integer context, number position = reaper.BR_TrackAtMouseCursor()
   * ```
   * [BR] Get track under mouse cursor.
   *
   * Context signifies where the track was found: 0 = TCP, 1 = MCP, 2 = Arrange.
   *
   * Position will hold mouse cursor position in arrange if applicable.
   */
  function BR_TrackAtMouseCursor(): LuaMultiReturn<
    [MediaTrack, number, number]
  >;

  /**
   * ```
   * boolean retval, string name = reaper.BR_TrackFX_GetFXModuleName(MediaTrack track, integer fx)
   * ```
   * [BR] Deprecated, see TrackFX_GetNamedConfigParm/'fx_ident' (v6.37+). Get the exact name (like effect.dll, effect.vst3, etc...) of an FX.
   * @deprecated
   */
  function BR_TrackFX_GetFXModuleName(
    track: MediaTrack,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.BR_Win32_CB_FindString(identifier comboBoxHwnd, integer startId, string string)
   * ```
   * [BR] Equivalent to win32 API ComboBox_FindString().
   */
  function BR_Win32_CB_FindString(
    comboBoxHwnd: identifier,
    startId: number,
    string: string,
  ): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_CB_FindStringExact(identifier comboBoxHwnd, integer startId, string string)
   * ```
   * [BR] Equivalent to win32 API ComboBox_FindStringExact().
   */
  function BR_Win32_CB_FindStringExact(
    comboBoxHwnd: identifier,
    startId: number,
    string: string,
  ): number;

  /**
   * ```
   * integer x, integer y = reaper.BR_Win32_ClientToScreen(identifier hwnd, integer xIn, integer yIn)
   * ```
   * [BR] Equivalent to win32 API ClientToScreen().
   */
  function BR_Win32_ClientToScreen(
    hwnd: identifier,
    xIn: number,
    yIn: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_FindWindowEx(string hwndParent, string hwndChildAfter, string className, string windowName, boolean searchClass, boolean searchName)
   * ```
   * [BR] Equivalent to win32 API FindWindowEx(). Since ReaScript doesn't allow passing NULL (None in Python, nil in Lua etc...) parameters, to search by supplied class or name set searchClass and searchName accordingly. HWND parameters should be passed as either "0" to signify NULL or as string obtained from BR_Win32_HwndToString.
   */
  function BR_Win32_FindWindowEx(
    hwndParent: string,
    hwndChildAfter: string,
    className: string,
    windowName: string,
    searchClass: boolean,
    searchName: boolean,
  ): identifier;

  /**
   * ```
   * integer _ = reaper.BR_Win32_GET_X_LPARAM(integer lParam)
   * ```
   * [BR] Equivalent to win32 API GET_X_LPARAM().
   */
  function BR_Win32_GET_X_LPARAM(lParam: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_GET_Y_LPARAM(integer lParam)
   * ```
   * [BR] Equivalent to win32 API GET_Y_LPARAM().
   */
  function BR_Win32_GET_Y_LPARAM(lParam: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_GetConstant(string constantName)
   * ```
   * [BR] Returns various constants needed for BR_Win32 functions.
   *
   * Supported constants are:
   *
   * CB_ERR, CB_GETCOUNT, CB_GETCURSEL, CB_SETCURSEL
   *
   * EM_SETSEL
   *
   * GW_CHILD, GW_HWNDFIRST, GW_HWNDLAST, GW_HWNDNEXT, GW_HWNDPREV, GW_OWNER
   *
   * GWL_STYLE
   *
   * SW_HIDE, SW_MAXIMIZE, SW_SHOW, SW_SHOWMINIMIZED, SW_SHOWNA, SW_SHOWNOACTIVATE, SW_SHOWNORMAL
   *
   * SWP_FRAMECHANGED, SWP_FRAMECHANGED, SWP_NOMOVE, SWP_NOOWNERZORDER, SWP_NOSIZE, SWP_NOZORDER
   *
   * VK_DOWN, VK_UP
   *
   * WM_CLOSE, WM_KEYDOWN
   *
   * WS_MAXIMIZE, WS_OVERLAPPEDWINDOW
   */
  function BR_Win32_GetConstant(constantName: string): number;

  /**
   * ```
   * boolean retval, integer x, integer y = reaper.BR_Win32_GetCursorPos()
   * ```
   * [BR] Equivalent to win32 API GetCursorPos().
   */
  function BR_Win32_GetCursorPos(): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_GetFocus()
   * ```
   * [BR] Equivalent to win32 API GetFocus().
   */
  function BR_Win32_GetFocus(): identifier;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_GetForegroundWindow()
   * ```
   * [BR] Equivalent to win32 API GetForegroundWindow().
   */
  function BR_Win32_GetForegroundWindow(): identifier;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_GetMainHwnd()
   * ```
   * [BR] Alternative to GetMainHwnd. REAPER seems to have problems with extensions using HWND type for exported functions so all BR_Win32 functions use void* instead of HWND type
   */
  function BR_Win32_GetMainHwnd(): identifier;

  /**
   * ```
   * identifier retval, boolean isDocked = reaper.BR_Win32_GetMixerHwnd()
   * ```
   * [BR] Get mixer window HWND. isDockedOut will be set to true if mixer is docked
   */
  function BR_Win32_GetMixerHwnd(): LuaMultiReturn<[identifier, boolean]>;

  /**
   * ```
   * integer left, integer top, integer right, integer bottom = reaper.BR_Win32_GetMonitorRectFromRect(boolean workingAreaOnly, integer leftIn, integer topIn, integer rightIn, integer bottomIn)
   * ```
   * [BR] Get coordinates for screen which is nearest to supplied coordinates. Pass workingAreaOnly as true to get screen coordinates excluding taskbar (or menu bar on OSX).
   */
  function BR_Win32_GetMonitorRectFromRect(
    workingAreaOnly: boolean,
    leftIn: number,
    topIn: number,
    rightIn: number,
    bottomIn: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_GetParent(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API GetParent().
   */
  function BR_Win32_GetParent(hwnd: identifier): identifier;

  /**
   * ```
   * integer retval, string string = reaper.BR_Win32_GetPrivateProfileString(string sectionName, string keyName, string defaultString, string filePath)
   * ```
   * [BR] Equivalent to win32 API GetPrivateProfileString(). For example, you can use this to get values from REAPER.ini.
   */
  function BR_Win32_GetPrivateProfileString(
    sectionName: string,
    keyName: string,
    defaultString: string,
    filePath: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_GetWindow(identifier hwnd, integer cmd)
   * ```
   * [BR] Equivalent to win32 API GetWindow().
   */
  function BR_Win32_GetWindow(hwnd: identifier, cmd: number): identifier;

  /**
   * ```
   * integer _ = reaper.BR_Win32_GetWindowLong(identifier hwnd, integer index)
   * ```
   * [BR] Equivalent to win32 API GetWindowLong().
   */
  function BR_Win32_GetWindowLong(hwnd: identifier, index: number): number;

  /**
   * ```
   * boolean retval, integer left, integer top, integer right, integer bottom = reaper.BR_Win32_GetWindowRect(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API GetWindowRect().
   */
  function BR_Win32_GetWindowRect(
    hwnd: identifier,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * integer retval, string text = reaper.BR_Win32_GetWindowText(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API GetWindowText().
   */
  function BR_Win32_GetWindowText(
    hwnd: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer _ = reaper.BR_Win32_HIBYTE(integer value)
   * ```
   * [BR] Equivalent to win32 API HIBYTE().
   */
  function BR_Win32_HIBYTE(value: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_HIWORD(integer value)
   * ```
   * [BR] Equivalent to win32 API HIWORD().
   */
  function BR_Win32_HIWORD(value: number): number;

  /**
   * ```
   * string string = reaper.BR_Win32_HwndToString(identifier hwnd)
   * ```
   * [BR] Convert HWND to string. To convert string back to HWND, see BR_Win32_StringToHwnd.
   */
  function BR_Win32_HwndToString(hwnd: identifier): string;

  /**
   * ```
   * boolean _ = reaper.BR_Win32_IsWindow(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API IsWindow().
   */
  function BR_Win32_IsWindow(hwnd: identifier): boolean;

  /**
   * ```
   * boolean _ = reaper.BR_Win32_IsWindowVisible(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API IsWindowVisible().
   */
  function BR_Win32_IsWindowVisible(hwnd: identifier): boolean;

  /**
   * ```
   * integer _ = reaper.BR_Win32_LOBYTE(integer value)
   * ```
   * [BR] Equivalent to win32 API LOBYTE().
   */
  function BR_Win32_LOBYTE(value: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_LOWORD(integer value)
   * ```
   * [BR] Equivalent to win32 API LOWORD().
   */
  function BR_Win32_LOWORD(value: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_MAKELONG(integer low, integer high)
   * ```
   * [BR] Equivalent to win32 API MAKELONG().
   */
  function BR_Win32_MAKELONG(low: number, high: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_MAKELPARAM(integer low, integer high)
   * ```
   * [BR] Equivalent to win32 API MAKELPARAM().
   */
  function BR_Win32_MAKELPARAM(low: number, high: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_MAKELRESULT(integer low, integer high)
   * ```
   * [BR] Equivalent to win32 API MAKELRESULT().
   */
  function BR_Win32_MAKELRESULT(low: number, high: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_MAKEWORD(integer low, integer high)
   * ```
   * [BR] Equivalent to win32 API MAKEWORD().
   */
  function BR_Win32_MAKEWORD(low: number, high: number): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_MAKEWPARAM(integer low, integer high)
   * ```
   * [BR] Equivalent to win32 API MAKEWPARAM().
   */
  function BR_Win32_MAKEWPARAM(low: number, high: number): number;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_MIDIEditor_GetActive()
   * ```
   * [BR] Alternative to MIDIEditor_GetActive. REAPER seems to have problems with extensions using HWND type for exported functions so all BR_Win32 functions use void* instead of HWND type.
   */
  function BR_Win32_MIDIEditor_GetActive(): identifier;

  /**
   * ```
   * integer x, integer y = reaper.BR_Win32_ScreenToClient(identifier hwnd, integer xIn, integer yIn)
   * ```
   * [BR] Equivalent to win32 API ClientToScreen().
   */
  function BR_Win32_ScreenToClient(
    hwnd: identifier,
    xIn: number,
    yIn: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.BR_Win32_SendMessage(identifier hwnd, integer msg, integer lParam, integer wParam)
   * ```
   * [BR] Equivalent to win32 API SendMessage().
   */
  function BR_Win32_SendMessage(
    hwnd: identifier,
    msg: number,
    lParam: number,
    wParam: number,
  ): number;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_SetFocus(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API SetFocus().
   */
  function BR_Win32_SetFocus(hwnd: identifier): identifier;

  /**
   * ```
   * integer _ = reaper.BR_Win32_SetForegroundWindow(identifier hwnd)
   * ```
   * [BR] Equivalent to win32 API SetForegroundWindow().
   */
  function BR_Win32_SetForegroundWindow(hwnd: identifier): number;

  /**
   * ```
   * integer _ = reaper.BR_Win32_SetWindowLong(identifier hwnd, integer index, integer newLong)
   * ```
   * [BR] Equivalent to win32 API SetWindowLong().
   */
  function BR_Win32_SetWindowLong(
    hwnd: identifier,
    index: number,
    newLong: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.BR_Win32_SetWindowPos(identifier hwnd, string hwndInsertAfter, integer x, integer y, integer width, integer height, integer flags)
   * ```
   * [BR] Equivalent to win32 API SetWindowPos().
   *
   * hwndInsertAfter may be a string: "HWND_BOTTOM", "HWND_NOTOPMOST", "HWND_TOP", "HWND_TOPMOST" or a string obtained with BR_Win32_HwndToString.
   */
  function BR_Win32_SetWindowPos(
    hwnd: identifier,
    hwndInsertAfter: string,
    x: number,
    y: number,
    width: number,
    height: number,
    flags: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.BR_Win32_ShellExecute(string operation, string file, string parameters, string directory, integer showFlags)
   * ```
   * [BR] Equivalent to win32 API ShellExecute() with HWND set to main window
   */
  function BR_Win32_ShellExecute(
    operation: string,
    file: string,
    parameters: string,
    directory: string,
    showFlags: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.BR_Win32_ShowWindow(identifier hwnd, integer cmdShow)
   * ```
   * [BR] Equivalent to win32 API ShowWindow().
   */
  function BR_Win32_ShowWindow(hwnd: identifier, cmdShow: number): boolean;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_StringToHwnd(string string)
   * ```
   * [BR] Convert string to HWND. To convert HWND back to string, see BR_Win32_HwndToString.
   */
  function BR_Win32_StringToHwnd(string: string): identifier;

  /**
   * ```
   * identifier _ = reaper.BR_Win32_WindowFromPoint(integer x, integer y)
   * ```
   * [BR] Equivalent to win32 API WindowFromPoint().
   */
  function BR_Win32_WindowFromPoint(x: number, y: number): identifier;

  /**
   * ```
   * boolean _ = reaper.BR_Win32_WritePrivateProfileString(string sectionName, string keyName, string value, string filePath)
   * ```
   * [BR] Equivalent to win32 API WritePrivateProfileString(). For example, you can use this to write to REAPER.ini. You can pass an empty string as value to delete a key.
   */
  function BR_Win32_WritePrivateProfileString(
    sectionName: string,
    keyName: string,
    value: string,
    filePath: string,
  ): boolean;

  /**
   * ```
   * CF_Preview _ = reaper.CF_CreatePreview(PCM_source source)
   * ```
   * Create a new preview object. Does not take ownership of the source (don't forget to destroy it unless it came from a take!). See CF_Preview_Play and the others CF_Preview_* functions.
   *
   *
   *
   * The preview object is automatically destroyed at the end of a defer cycle if at least one of these conditions are met:
   *
   * - playback finished
   *
   * - playback was not started using CF_Preview_Play
   *
   * - the output track no longer exists
   */
  function CF_CreatePreview(source: PCM_source): CF_Preview;

  /**
   * ```
   * integer retval, number time, number endTime, boolean isRegion, string name, boolean isChapter = reaper.CF_EnumMediaSourceCues(PCM_source src, integer index)
   * ```
   * Enumerate the source's media cues. Returns the next index or 0 when finished.
   */
  function CF_EnumMediaSourceCues(
    src: PCM_source,
    index: number,
  ): LuaMultiReturn<[number, number, number, boolean, string, boolean]>;

  /**
   * ```
   * integer _ = reaper.CF_EnumSelectedFX(FxChain hwnd, integer index)
   * ```
   * Return the index of the next selected effect in the given FX chain. Start index should be -1. Returns -1 if there are no more selected effects.
   */
  function CF_EnumSelectedFX(hwnd: FxChain, index: number): number;

  /**
   * ```
   * integer retval, string name = reaper.CF_EnumerateActions(integer section, integer index)
   * ```
   * Deprecated, see kbd_enumerateActions (v6.71+). Wrapper for the unexposed kbd_enumerateActions API function.
   *
   * Main=0, Main (alt recording)=100, MIDI Editor=32060, MIDI Event List Editor=32061, MIDI Inline Editor=32062, Media Explorer=32063
   * @deprecated
   */
  function CF_EnumerateActions(
    section: number,
    index: number,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * boolean _ = reaper.CF_ExportMediaSource(PCM_source src, string fn)
   * ```
   * Export the source to the given file (MIDI only).
   */
  function CF_ExportMediaSource(src: PCM_source, fn: string): boolean;

  /**
   * ```
   * string text = reaper.CF_GetClipboard()
   * ```
   * Read the contents of the system clipboard.
   */
  function CF_GetClipboard(): string;

  /**
   * ```
   * string _ = reaper.CF_GetClipboardBig(WDL_FastString output)
   * ```
   * [DEPRECATED: Use CF_GetClipboard] Read the contents of the system clipboard. See SNM_CreateFastString and SNM_DeleteFastString.
   * @deprecated
   */
  function CF_GetClipboardBig(output: WDL_FastString): string;

  /**
   * ```
   * string _ = reaper.CF_GetCommandText(integer section, integer command)
   * ```
   * Deprecated, see kbd_getTextFromCmd (v6.71+). Wrapper for the unexposed kbd_getTextFromCmd API function. See CF_EnumerateActions for common section IDs.
   * @deprecated
   */
  function CF_GetCommandText(section: number, command: number): string;

  /**
   * ```
   * integer _ = reaper.CF_GetCustomColor(integer index)
   * ```
   * Get one of 16 SWS custom colors (0xBBGGRR on Windows, 0xRRGGBB everyhwere else). Index is zero-based.
   */
  function CF_GetCustomColor(index: number): number;

  /**
   * ```
   * FxChain fxc = reaper.CF_GetFocusedFXChain()
   * ```
   * Return a handle to the currently focused FX chain window.
   */
  function CF_GetFocusedFXChain(): FxChain;

  /**
   * ```
   * integer _ = reaper.CF_GetMediaSourceBitDepth(PCM_source src)
   * ```
   * Returns the bit depth if available (0 otherwise).
   */
  function CF_GetMediaSourceBitDepth(src: PCM_source): number;

  /**
   * ```
   * number _ = reaper.CF_GetMediaSourceBitRate(PCM_source src)
   * ```
   * Returns the bit rate for WAVE (wav, aif) and streaming/variable formats (mp3, ogg, opus). REAPER v6.19 or later is required for non-WAVE formats.
   */
  function CF_GetMediaSourceBitRate(src: PCM_source): number;

  /**
   * ```
   * boolean retval, string out = reaper.CF_GetMediaSourceMetadata(PCM_source src, string name, string out)
   * ```
   * Get the value of the given metadata field (eg. DESC, ORIG, ORIGREF, DATE, TIME, UMI, CODINGHISTORY for BWF).
   */
  function CF_GetMediaSourceMetadata(
    src: PCM_source,
    name: string,
    out: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean _ = reaper.CF_GetMediaSourceOnline(PCM_source src)
   * ```
   * Returns the online/offline status of the given source.
   */
  function CF_GetMediaSourceOnline(src: PCM_source): boolean;

  /**
   * ```
   * boolean retval, string fn = reaper.CF_GetMediaSourceRPP(PCM_source src)
   * ```
   * Get the project associated with this source (BWF, subproject...).
   */
  function CF_GetMediaSourceRPP(
    src: PCM_source,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string version = reaper.CF_GetSWSVersion()
   * ```
   * Return the current SWS version number.
   */
  function CF_GetSWSVersion(): string;

  /**
   * ```
   * FxChain _ = reaper.CF_GetTakeFXChain(MediaItem_Take take)
   * ```
   * Return a handle to the given take FX chain window. HACK: This temporarily renames the take in order to disambiguate the take FX chain window from similarily named takes.
   */
  function CF_GetTakeFXChain(take: MediaItem_Take): FxChain;

  /**
   * ```
   * FxChain _ = reaper.CF_GetTrackFXChain(MediaTrack track)
   * ```
   * Return a handle to the given track FX chain window.
   */
  function CF_GetTrackFXChain(track: MediaTrack): FxChain;

  /**
   * ```
   * FxChain _ = reaper.CF_GetTrackFXChainEx(ReaProject project, MediaTrack track, boolean wantInputChain)
   * ```
   * Return a handle to the given track FX chain window. Set wantInputChain to get the track's input/monitoring FX chain.
   */
  function CF_GetTrackFXChainEx(
    project: ReaProject,
    track: MediaTrack,
    wantInputChain: boolean,
  ): FxChain;

  /**
   * ```
   * boolean _ = reaper.CF_LocateInExplorer(string file)
   * ```
   * Select the given file in explorer/finder.
   */
  function CF_LocateInExplorer(file: string): boolean;

  /**
   * ```
   * string normalized = reaper.CF_NormalizeUTF8(string input, integer mode)
   * ```
   * Apply Unicode normalization to the provided UTF-8 string.
   *
   *
   *
   * Mode values:
   *
   * - Bit 0 (composition mode):
   *
   *   * 0 = decomposition only
   *
   *   * 1 = decomposition + canonical composition
   *
   * - Bit 1 (decomposition mode):
   *
   *   * 0 = canonical decomposition
   *
   *   * 1 = compatibility decomposition
   *
   *
   *
   * Warning: this function is no-op on Windows XP (the input string is returned as-is).
   */
  function CF_NormalizeUTF8(input: string, mode: number): string;

  /**
   * ```
   * boolean _ = reaper.CF_PCM_Source_SetSectionInfo(PCM_source section, PCM_source source, number offset, number length, boolean reverse, optional number fadeIn)
   * ```
   * Give a section source created using PCM_Source_CreateFromType("SECTION"). Offset and length are ignored if 0. Negative length to subtract from the total length of the source.
   */
  function CF_PCM_Source_SetSectionInfo(
    section: PCM_source,
    source: PCM_source,
    offset: number,
    length: number,
    reverse: boolean,
    fadeIn?: number,
  ): boolean;

  /**
   * ```
   * MediaTrack _ = reaper.CF_Preview_GetOutputTrack(CF_Preview preview)
   * ```
   */
  function CF_Preview_GetOutputTrack(preview: CF_Preview): MediaTrack;

  /**
   * ```
   * boolean retval, number peakvol = reaper.CF_Preview_GetPeak(CF_Preview preview, integer channel)
   * ```
   * Return the maximum sample value played since the last read. Refresh speed depends on buffer size.
   */
  function CF_Preview_GetPeak(
    preview: CF_Preview,
    channel: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, number value = reaper.CF_Preview_GetValue(CF_Preview preview, string name)
   * ```
   * Supported attributes:
   *
   * B_LOOP         seek to the beginning when reaching the end of the source
   *
   * B_PPITCH       preserve pitch when changing playback rate
   *
   * D_FADEINLEN    length in seconds of playback fade in
   *
   * D_FADEOUTLEN   length in seconds of playback fade out
   *
   * D_LENGTH       (read only) length of the source * playback rate
   *
   * D_MEASUREALIGN >0 = wait until the next bar before starting playback (note: this causes playback to silently continue when project is paused and previewing through a track)
   *
   * D_PAN          playback pan
   *
   * D_PITCH        pitch adjustment in semitones
   *
   * D_PLAYRATE     playback rate (0.01..100)
   *
   * D_POSITION     current playback position
   *
   * D_VOLUME       playback volume
   *
   * I_OUTCHAN      first hardware output channel (&1024=mono, reads -1 when playing through a track, see CF_Preview_SetOutputTrack)
   *
   * I_PITCHMODE    highest 16 bits=pitch shift mode (see EnumPitchShiftModes), lower 16 bits=pitch shift submode (see EnumPitchShiftSubModes)
   */
  function CF_Preview_GetValue(
    preview: CF_Preview,
    name: string,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean _ = reaper.CF_Preview_Play(CF_Preview preview)
   * ```
   * Start playback of the configured preview object.
   */
  function CF_Preview_Play(preview: CF_Preview): boolean;

  /**
   * ```
   * boolean _ = reaper.CF_Preview_SetOutputTrack(CF_Preview preview, ReaProject project, MediaTrack track)
   * ```
   */
  function CF_Preview_SetOutputTrack(
    preview: CF_Preview,
    project: ReaProject,
    track: MediaTrack,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.CF_Preview_SetValue(CF_Preview preview, string name, number newValue)
   * ```
   * See CF_Preview_GetValue.
   */
  function CF_Preview_SetValue(
    preview: CF_Preview,
    name: string,
    newValue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.CF_Preview_Stop(CF_Preview preview)
   * ```
   * Stop and destroy a preview object.
   */
  function CF_Preview_Stop(preview: CF_Preview): boolean;

  /**
   * ```
   * reaper.CF_Preview_StopAll()
   * ```
   * Stop and destroy all currently active preview objects.
   */
  function CF_Preview_StopAll(): void;

  /**
   * ```
   * boolean _ = reaper.CF_SelectTakeFX(MediaItem_Take take, integer index)
   * ```
   * Set which take effect is active in the take's FX chain. The FX chain window does not have to be open.
   */
  function CF_SelectTakeFX(take: MediaItem_Take, index: number): boolean;

  /**
   * ```
   * boolean _ = reaper.CF_SelectTrackFX(MediaTrack track, integer index)
   * ```
   * Set which track effect is active in the track's FX chain. The FX chain window does not have to be open.
   */
  function CF_SelectTrackFX(track: MediaTrack, index: number): boolean;

  /**
   * ```
   * boolean _ = reaper.CF_SendActionShortcut(identifier hwnd, integer section, integer key, optional integer modifiersIn)
   * ```
   * Run in the specified window the action command ID associated with the shortcut key in the given section. See CF_EnumerateActions for common section IDs.
   *
   *
   *
   * 	Keys are Windows virtual key codes. &0x8000 for an extended key (eg. Numpad Enter = VK_RETURN & 0x8000).
   *
   * 	Modifier values: nil = read from keyboard, 0 = no modifier, &4 = Control (Cmd on macOS), &8 = Shift, &16 = Alt, &32 = Super
   */
  function CF_SendActionShortcut(
    hwnd: identifier,
    section: number,
    key: number,
    modifiersIn?: number,
  ): boolean;

  /**
   * ```
   * reaper.CF_SetClipboard(string str)
   * ```
   * Write the given string into the system clipboard.
   */
  function CF_SetClipboard(str: string): void;

  /**
   * ```
   * reaper.CF_SetCustomColor(integer index, integer color)
   * ```
   * Set one of 16 SWS custom colors (0xBBGGRR on Windows, 0xRRGGBB everyhwere else). Index is zero-based.
   */
  function CF_SetCustomColor(index: number, color: number): void;

  /**
   * ```
   * reaper.CF_SetMediaSourceOnline(PCM_source src, boolean set)
   * ```
   * Set the online/offline status of the given source (closes files when set=false).
   */
  function CF_SetMediaSourceOnline(src: PCM_source, set: boolean): void;

  /**
   * ```
   * boolean _ = reaper.CF_ShellExecute(string file)
   * ```
   * Open the given file or URL in the default application. See also CF_LocateInExplorer.
   */
  function CF_ShellExecute(file: string): boolean;

  /**
   * ```
   * RprMidiNote _ = reaper.FNG_AddMidiNote(RprMidiTake midiTake)
   * ```
   * [FNG] Add MIDI note to MIDI take
   */
  function FNG_AddMidiNote(midiTake: RprMidiTake): RprMidiNote;

  /**
   * ```
   * RprMidiTake _ = reaper.FNG_AllocMidiTake(MediaItem_Take take)
   * ```
   * [FNG] Allocate a RprMidiTake from a take pointer. Returns a NULL pointer if the take is not an in-project MIDI take
   */
  function FNG_AllocMidiTake(take: MediaItem_Take): RprMidiTake;

  /**
   * ```
   * integer _ = reaper.FNG_CountMidiNotes(RprMidiTake midiTake)
   * ```
   * [FNG] Count of how many MIDI notes are in the MIDI take
   */
  function FNG_CountMidiNotes(midiTake: RprMidiTake): number;

  /**
   * ```
   * reaper.FNG_FreeMidiTake(RprMidiTake midiTake)
   * ```
   * [FNG] Commit changes to MIDI take and free allocated memory
   */
  function FNG_FreeMidiTake(midiTake: RprMidiTake): void;

  /**
   * ```
   * RprMidiNote _ = reaper.FNG_GetMidiNote(RprMidiTake midiTake, integer index)
   * ```
   * [FNG] Get a MIDI note from a MIDI take at specified index
   */
  function FNG_GetMidiNote(midiTake: RprMidiTake, index: number): RprMidiNote;

  /**
   * ```
   * integer _ = reaper.FNG_GetMidiNoteIntProperty(RprMidiNote midiNote, string property)
   * ```
   * [FNG] Get MIDI note property
   */
  function FNG_GetMidiNoteIntProperty(
    midiNote: RprMidiNote,
    property: string,
  ): number;

  /**
   * ```
   * reaper.FNG_SetMidiNoteIntProperty(RprMidiNote midiNote, string property, integer value)
   * ```
   * [FNG] Set MIDI note property
   */
  function FNG_SetMidiNoteIntProperty(
    midiNote: RprMidiNote,
    property: string,
    value: number,
  ): void;

  /**
   * ```
   * boolean retval, string payload = reaper.ImGui_AcceptDragDropPayload(ImGui_Context ctx, string type, string payload, optional integer flagsIn)
   * ```
   * Accept contents of a given type. If DragDropFlags_AcceptBeforeDelivery is set
   *
   * you can peek into the payload before the mouse button is released.
   */
  function ImGui_AcceptDragDropPayload(
    ctx: ImGui_Context,
    type: string,
    payload: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, integer count = reaper.ImGui_AcceptDragDropPayloadFiles(ImGui_Context ctx, integer count, optional integer flagsIn)
   * ```
   * Accept a list of dropped files. See AcceptDragDropPayload and GetDragDropPayloadFile.
   */
  function ImGui_AcceptDragDropPayloadFiles(
    ctx: ImGui_Context,
    count: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer rgb = reaper.ImGui_AcceptDragDropPayloadRGB(ImGui_Context ctx, integer rgb, optional integer flagsIn)
   * ```
   * Accept a RGB color. See AcceptDragDropPayload.
   */
  function ImGui_AcceptDragDropPayloadRGB(
    ctx: ImGui_Context,
    rgb: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer rgba = reaper.ImGui_AcceptDragDropPayloadRGBA(ImGui_Context ctx, integer rgba, optional integer flagsIn)
   * ```
   * Accept a RGBA color. See AcceptDragDropPayload.
   */
  function ImGui_AcceptDragDropPayloadRGBA(
    ctx: ImGui_Context,
    rgba: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * reaper.ImGui_AlignTextToFramePadding(ImGui_Context ctx)
   * ```
   * Vertically align upcoming text baseline to StyleVar_FramePadding.y so that it
   *
   * will align properly to regularly framed items (call if you have text on a line
   *
   * before a framed item).
   */
  function ImGui_AlignTextToFramePadding(ctx: ImGui_Context): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_ArrowButton(ImGui_Context ctx, string str_id, integer dir)
   * ```
   * Square button with an arrow shape. 'dir' is one of the Dir_* values
   */
  function ImGui_ArrowButton(
    ctx: ImGui_Context,
    str_id: string,
    dir: number,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_Attach(ImGui_Context ctx, ImGui_Resource obj)
   * ```
   * Link the object's lifetime to the given context.
   *
   * Objects can be draw list splitters, fonts, images, list clippers, etc.
   *
   * Call Detach to let the object be garbage-collected after unuse again.
   *
   *
   *
   * List clipper objects may only be attached to the context they were created for.
   *
   *
   *
   * Fonts are (currently) a special case: they must be attached to the context
   *
   * before usage. Furthermore, fonts may only be attached or detached immediately
   *
   * after the context is created or before any other function calls modifying the
   *
   * context per defer cycle. See "limitations" in the font API documentation.
   */
  function ImGui_Attach(ctx: ImGui_Context, obj: ImGui_Resource): void;

  /**
   * ```
   * boolean retval, optional boolean p_open = reaper.ImGui_Begin(ImGui_Context ctx, string name, optional boolean p_open, optional integer flagsIn)
   * ```
   * Push window to the stack and start appending to it.
   *
   *
   *
   * - Passing true to 'p_open' shows a window-closing widget in the upper-right
   *
   *   corner of the window, which clicking will set the boolean to false when returned.
   *
   * - You may append multiple times to the same window during the same frame by
   *
   *   calling Begin()/End() pairs multiple times. Some information such as 'flags'
   *
   *   or 'p_open' will only be considered by the first call to Begin().
   *
   * - Begin() return false to indicate the window is collapsed or fully clipped,
   *
   *   so you may early out and omit submitting anything to the window.
   */
  function ImGui_Begin(
    ctx: ImGui_Context,
    name: string,
    p_open?: boolean,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginChild(ImGui_Context ctx, string str_id, optional number size_wIn, optional number size_hIn, optional integer child_flagsIn, optional integer window_flagsIn)
   * ```
   * Manual sizing (each axis can use a different setting e.g. size_w=0 and size_h=400):
   *
   * - = 0.0: use remaining parent window size for this axis
   *
   * - \> 0.0: use specified size for this axis
   *
   * - < 0.0: right/bottom-align to specified distance from available content boundaries
   *
   *
   *
   * Specifying ChildFlags_AutoResizeX or ChildFlags_AutoResizeY makes the sizing
   *
   * automatic based on child contents.
   *
   *
   *
   * Combining both ChildFlags_AutoResizeX _and_ ChildFlags_AutoResizeY defeats
   *
   * purpose of a scrolling region and is NOT recommended.
   *
   *
   *
   * Returns false to indicate the window is collapsed or fully clipped.
   */
  function ImGui_BeginChild(
    ctx: ImGui_Context,
    str_id: string,
    size_wIn?: number,
    size_hIn?: number,
    child_flagsIn?: number,
    window_flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginCombo(ImGui_Context ctx, string label, string preview_value, optional integer flagsIn)
   * ```
   * The BeginCombo/EndCombo API allows you to manage your contents and selection
   *
   * state however you want it, by creating e.g. Selectable items.
   */
  function ImGui_BeginCombo(
    ctx: ImGui_Context,
    label: string,
    preview_value: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_BeginDisabled(ImGui_Context ctx, optional boolean disabledIn)
   * ```
   * Disable all user interactions and dim items visuals
   *
   * (applying StyleVar_DisabledAlpha over current colors).
   *
   *
   *
   * Those can be nested but it cannot be used to enable an already disabled section
   *
   * (a single BeginDisabled(true) in the stack is enough to keep everything disabled).
   *
   *
   *
   * Tooltips windows by exception are opted out of disabling.
   *
   *
   *
   * BeginDisabled(false) essentially does nothing useful but is provided to
   *
   * facilitate use of boolean expressions.
   *
   * If you can avoid calling BeginDisabled(false)/EndDisabled() best to avoid it.
   */
  function ImGui_BeginDisabled(ctx: ImGui_Context, disabledIn?: boolean): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginDragDropSource(ImGui_Context ctx, optional integer flagsIn)
   * ```
   * Call after submitting an item which may be dragged. when this return true,
   *
   * you can call SetDragDropPayload() + EndDragDropSource()
   *
   *
   *
   * If you stop calling BeginDragDropSource() the payload is preserved however
   *
   * it won't have a preview tooltip (we currently display a fallback "..." tooltip
   *
   * as replacement).
   */
  function ImGui_BeginDragDropSource(
    ctx: ImGui_Context,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginDragDropTarget(ImGui_Context ctx)
   * ```
   * Call after submitting an item that may receive a payload.
   *
   * If this returns true, you can call AcceptDragDropPayload + EndDragDropTarget.
   */
  function ImGui_BeginDragDropTarget(ctx: ImGui_Context): boolean;

  /**
   * ```
   * reaper.ImGui_BeginGroup(ImGui_Context ctx)
   * ```
   * Lock horizontal starting position. See EndGroup.
   */
  function ImGui_BeginGroup(ctx: ImGui_Context): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginItemTooltip(ImGui_Context ctx)
   * ```
   * Begin/append a tooltip window if preceding item was hovered. Shortcut for
   *
   * `IsItemHovered(HoveredFlags_ForTooltip) && BeginTooltip()`.
   */
  function ImGui_BeginItemTooltip(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginListBox(ImGui_Context ctx, string label, optional number size_wIn, optional number size_hIn)
   * ```
   * Open a framed scrolling region.
   *
   *
   *
   * You can submit contents and manage your selection state however you want it,
   *
   * by creating e.g. Selectable or any other items.
   *
   *
   *
   * - Choose frame width:
   *
   *   - width  > 0.0: custom
   *
   *   - width  < 0.0 or -FLT_MIN: right-align
   *
   *   - width  = 0.0 (default): use current ItemWidth
   *
   * - Choose frame height:
   *
   *   - height > 0.0: custom
   *
   *   - height < 0.0 or -FLT_MIN: bottom-align
   *
   *   - height = 0.0 (default): arbitrary default height which can fit ~7 items
   *
   *
   *
   * See EndListBox.
   */
  function ImGui_BeginListBox(
    ctx: ImGui_Context,
    label: string,
    size_wIn?: number,
    size_hIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginMenu(ImGui_Context ctx, string label, optional boolean enabledIn)
   * ```
   * Create a sub-menu entry. only call EndMenu if this returns true!
   */
  function ImGui_BeginMenu(
    ctx: ImGui_Context,
    label: string,
    enabledIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginMenuBar(ImGui_Context ctx)
   * ```
   * Append to menu-bar of current window (requires WindowFlags_MenuBar flag set
   *
   * on parent window). See EndMenuBar.
   */
  function ImGui_BeginMenuBar(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginPopup(ImGui_Context ctx, string str_id, optional integer flagsIn)
   * ```
   * Query popup state, if open start appending into the window. Call EndPopup
   *
   * afterwards if returned true. WindowFlags* are forwarded to the window.
   *
   *
   *
   * Return true if the popup is open, and you can start outputting to it.
   */
  function ImGui_BeginPopup(
    ctx: ImGui_Context,
    str_id: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginPopupContextItem(ImGui_Context ctx, optional string str_idIn, optional integer popup_flagsIn)
   * ```
   * This is a helper to handle the simplest case of associating one named popup
   *
   * to one given widget. You can pass a nil str_id to use the identifier of the last
   *
   * item. This is essentially the same as calling OpenPopupOnItemClick + BeginPopup
   *
   * but written to avoid computing the ID twice because BeginPopupContext*
   *
   * functions may be called very frequently.
   *
   *
   *
   * If you want to use that on a non-interactive item such as Text you need to pass
   *
   * in an explicit ID here.
   */
  function ImGui_BeginPopupContextItem(
    ctx: ImGui_Context,
    str_idIn?: string,
    popup_flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginPopupContextWindow(ImGui_Context ctx, optional string str_idIn, optional integer popup_flagsIn)
   * ```
   * Open+begin popup when clicked on current window.
   */
  function ImGui_BeginPopupContextWindow(
    ctx: ImGui_Context,
    str_idIn?: string,
    popup_flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean retval, optional boolean p_open = reaper.ImGui_BeginPopupModal(ImGui_Context ctx, string name, optional boolean p_open, optional integer flagsIn)
   * ```
   * Block every interaction behind the window, cannot be closed by user, add a
   *
   * dimming background, has a title bar. Return true if the modal is open, and you
   *
   * can start outputting to it. See BeginPopup.
   */
  function ImGui_BeginPopupModal(
    ctx: ImGui_Context,
    name: string,
    p_open?: boolean,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginTabBar(ImGui_Context ctx, string str_id, optional integer flagsIn)
   * ```
   * Create and append into a TabBar.
   */
  function ImGui_BeginTabBar(
    ctx: ImGui_Context,
    str_id: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean retval, optional boolean p_open = reaper.ImGui_BeginTabItem(ImGui_Context ctx, string label, optional boolean p_open, optional integer flagsIn)
   * ```
   * Create a Tab. Returns true if the Tab is selected.
   *
   * Set 'p_open' to true to enable the close button.
   */
  function ImGui_BeginTabItem(
    ctx: ImGui_Context,
    label: string,
    p_open?: boolean,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginTable(ImGui_Context ctx, string str_id, integer columns, optional integer flagsIn, optional number outer_size_wIn, optional number outer_size_hIn, optional number inner_widthIn)
   * ```
   */
  function ImGui_BeginTable(
    ctx: ImGui_Context,
    str_id: string,
    columns: number,
    flagsIn?: number,
    outer_size_wIn?: number,
    outer_size_hIn?: number,
    inner_widthIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_BeginTooltip(ImGui_Context ctx)
   * ```
   * Begin/append a tooltip window.
   */
  function ImGui_BeginTooltip(ctx: ImGui_Context): boolean;

  /**
   * ```
   * reaper.ImGui_Bullet(ImGui_Context ctx)
   * ```
   * Draw a small circle + keep the cursor on the same line.
   *
   * Advance cursor x position by GetTreeNodeToLabelSpacing,
   *
   * same distance that TreeNode uses.
   */
  function ImGui_Bullet(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_BulletText(ImGui_Context ctx, string text)
   * ```
   * Shortcut for Bullet + Text.
   */
  function ImGui_BulletText(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_Button(ImGui_Context ctx, string label, optional number size_wIn, optional number size_hIn)
   * ```
   */
  function ImGui_Button(
    ctx: ImGui_Context,
    label: string,
    size_wIn?: number,
    size_hIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_ButtonFlags_MouseButtonLeft()
   * ```
   * React on left mouse button (default).
   */
  function ImGui_ButtonFlags_MouseButtonLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ButtonFlags_MouseButtonMiddle()
   * ```
   * React on center mouse button.
   */
  function ImGui_ButtonFlags_MouseButtonMiddle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ButtonFlags_MouseButtonRight()
   * ```
   * React on right mouse button.
   */
  function ImGui_ButtonFlags_MouseButtonRight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ButtonFlags_None()
   * ```
   */
  function ImGui_ButtonFlags_None(): number;

  /**
   * ```
   * number _ = reaper.ImGui_CalcItemWidth(ImGui_Context ctx)
   * ```
   * Width of item given pushed settings and current cursor position.
   *
   * NOT necessarily the width of last item unlike most 'Item' functions.
   */
  function ImGui_CalcItemWidth(ctx: ImGui_Context): number;

  /**
   * ```
   * number w, number h = reaper.ImGui_CalcTextSize(ImGui_Context ctx, string text, number w, number h, optional boolean hide_text_after_double_hashIn, optional number wrap_widthIn)
   * ```
   */
  function ImGui_CalcTextSize(
    ctx: ImGui_Context,
    text: string,
    w: number,
    h: number,
    hide_text_after_double_hashIn?: boolean,
    wrap_widthIn?: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean retval, boolean v = reaper.ImGui_Checkbox(ImGui_Context ctx, string label, boolean v)
   * ```
   */
  function ImGui_Checkbox(
    ctx: ImGui_Context,
    label: string,
    v: boolean,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean retval, integer flags = reaper.ImGui_CheckboxFlags(ImGui_Context ctx, string label, integer flags, integer flags_value)
   * ```
   */
  function ImGui_CheckboxFlags(
    ctx: ImGui_Context,
    label: string,
    flags: number,
    flags_value: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_AlwaysAutoResize()
   * ```
   * Combined with AutoResizeX/AutoResizeY. Always measure size even when child
   *
   * is hidden, always return true, always disable clipping optimization! NOT RECOMMENDED.
   */
  function ImGui_ChildFlags_AlwaysAutoResize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_AlwaysUseWindowPadding()
   * ```
   * Pad with StyleVar_WindowPadding even if no border are drawn (no padding by
   *
   * default for non-bordered child windows because it makes more sense).
   */
  function ImGui_ChildFlags_AlwaysUseWindowPadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_AutoResizeX()
   * ```
   * Enable auto-resizing width. Read notes above.
   */
  function ImGui_ChildFlags_AutoResizeX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_AutoResizeY()
   * ```
   * Enable auto-resizing height. Read notes above.
   */
  function ImGui_ChildFlags_AutoResizeY(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_Border()
   * ```
   * Show an outer border and enable WindowPadding.
   */
  function ImGui_ChildFlags_Border(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_FrameStyle()
   * ```
   * Style the child window like a framed item: use Col_FrameBg,
   *
   *    StyleVar_FrameRounding, StyleVar_FrameBorderSize, StyleVar_FramePadding
   *
   *    instead of Col_ChildBg, StyleVar_ChildRounding, StyleVar_ChildBorderSize,
   *
   *    StyleVar_WindowPadding.
   */
  function ImGui_ChildFlags_FrameStyle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_NavFlattened()
   * ```
   * Share focus scope, allow gamepad/keyboard navigation to cross over parent
   *
   *    border to this child or between sibling child windows.
   */
  function ImGui_ChildFlags_NavFlattened(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_None()
   * ```
   */
  function ImGui_ChildFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_ResizeX()
   * ```
   * Allow resize from right border (layout direction).
   *
   * Enables .ini saving (unless WindowFlags_NoSavedSettings passed to window flags).
   */
  function ImGui_ChildFlags_ResizeX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ChildFlags_ResizeY()
   * ```
   * Allow resize from bottom border (layout direction).
   *
   * Enables .ini saving (unless WindowFlags_NoSavedSettings passed to window flags).
   */
  function ImGui_ChildFlags_ResizeY(): number;

  /**
   * ```
   * reaper.ImGui_CloseCurrentPopup(ImGui_Context ctx)
   * ```
   * Manually close the popup we have begin-ed into.
   *
   * Use inside the BeginPopup/EndPopup scope to close manually.
   *
   *
   *
   * CloseCurrentPopup() is called by default by Selectable/MenuItem when activated.
   */
  function ImGui_CloseCurrentPopup(ctx: ImGui_Context): void;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Border()
   * ```
   */
  function ImGui_Col_Border(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_BorderShadow()
   * ```
   */
  function ImGui_Col_BorderShadow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Button()
   * ```
   */
  function ImGui_Col_Button(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ButtonActive()
   * ```
   */
  function ImGui_Col_ButtonActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ButtonHovered()
   * ```
   */
  function ImGui_Col_ButtonHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_CheckMark()
   * ```
   * Checkbox tick and RadioButton circle
   */
  function ImGui_Col_CheckMark(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ChildBg()
   * ```
   * Background of child windows.
   */
  function ImGui_Col_ChildBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_DockingEmptyBg()
   * ```
   * Background color for empty node (e.g. CentralNode with no window docked into it).
   */
  function ImGui_Col_DockingEmptyBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_DockingPreview()
   * ```
   * Preview overlay color when about to docking something.
   */
  function ImGui_Col_DockingPreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_DragDropTarget()
   * ```
   * Rectangle highlighting a drop target
   */
  function ImGui_Col_DragDropTarget(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_FrameBg()
   * ```
   * Background of checkbox, radio button, plot, slider, text input.
   */
  function ImGui_Col_FrameBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_FrameBgActive()
   * ```
   */
  function ImGui_Col_FrameBgActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_FrameBgHovered()
   * ```
   */
  function ImGui_Col_FrameBgHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Header()
   * ```
   * Header* colors are used for CollapsingHeader, TreeNode, Selectable, MenuItem.
   */
  function ImGui_Col_Header(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_HeaderActive()
   * ```
   */
  function ImGui_Col_HeaderActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_HeaderHovered()
   * ```
   */
  function ImGui_Col_HeaderHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_MenuBarBg()
   * ```
   */
  function ImGui_Col_MenuBarBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ModalWindowDimBg()
   * ```
   * Darken/colorize entire screen behind a modal window, when one is active.
   */
  function ImGui_Col_ModalWindowDimBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_NavHighlight()
   * ```
   * Gamepad/keyboard: current highlighted item.
   */
  function ImGui_Col_NavHighlight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_NavWindowingDimBg()
   * ```
   * Darken/colorize entire screen behind the CTRL+TAB window list, when active.
   */
  function ImGui_Col_NavWindowingDimBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_NavWindowingHighlight()
   * ```
   * Highlight window when using CTRL+TAB.
   */
  function ImGui_Col_NavWindowingHighlight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_PlotHistogram()
   * ```
   */
  function ImGui_Col_PlotHistogram(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_PlotHistogramHovered()
   * ```
   */
  function ImGui_Col_PlotHistogramHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_PlotLines()
   * ```
   */
  function ImGui_Col_PlotLines(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_PlotLinesHovered()
   * ```
   */
  function ImGui_Col_PlotLinesHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_PopupBg()
   * ```
   * Background of popups, menus, tooltips windows.
   */
  function ImGui_Col_PopupBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ResizeGrip()
   * ```
   * Resize grip in lower-right and lower-left corners of windows.
   */
  function ImGui_Col_ResizeGrip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ResizeGripActive()
   * ```
   */
  function ImGui_Col_ResizeGripActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ResizeGripHovered()
   * ```
   */
  function ImGui_Col_ResizeGripHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ScrollbarBg()
   * ```
   */
  function ImGui_Col_ScrollbarBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ScrollbarGrab()
   * ```
   */
  function ImGui_Col_ScrollbarGrab(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ScrollbarGrabActive()
   * ```
   */
  function ImGui_Col_ScrollbarGrabActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_ScrollbarGrabHovered()
   * ```
   */
  function ImGui_Col_ScrollbarGrabHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Separator()
   * ```
   */
  function ImGui_Col_Separator(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_SeparatorActive()
   * ```
   */
  function ImGui_Col_SeparatorActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_SeparatorHovered()
   * ```
   */
  function ImGui_Col_SeparatorHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_SliderGrab()
   * ```
   */
  function ImGui_Col_SliderGrab(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_SliderGrabActive()
   * ```
   */
  function ImGui_Col_SliderGrabActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Tab()
   * ```
   * Tab background, when tab-bar is focused & tab is unselected
   */
  function ImGui_Col_Tab(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabDimmed()
   * ```
   * Tab background, when tab-bar is unfocused & tab is unselected
   */
  function ImGui_Col_TabDimmed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabDimmedSelected()
   * ```
   * Tab background, when tab-bar is unfocused & tab is selected
   */
  function ImGui_Col_TabDimmedSelected(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabDimmedSelectedOverline()
   * ```
   * Horizontal overline, when tab-bar is unfocused & tab is selected
   */
  function ImGui_Col_TabDimmedSelectedOverline(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabHovered()
   * ```
   * Tab background, when hovered
   */
  function ImGui_Col_TabHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabSelected()
   * ```
   * Tab background, when tab-bar is focused & tab is selected
   */
  function ImGui_Col_TabSelected(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TabSelectedOverline()
   * ```
   * Tab horizontal overline, when tab-bar is focused & tab is selected
   */
  function ImGui_Col_TabSelectedOverline(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TableBorderLight()
   * ```
   * Table inner borders (prefer using Alpha=1.0 here).
   */
  function ImGui_Col_TableBorderLight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TableBorderStrong()
   * ```
   * Table outer and header borders (prefer using Alpha=1.0 here).
   */
  function ImGui_Col_TableBorderStrong(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TableHeaderBg()
   * ```
   * Table header background.
   */
  function ImGui_Col_TableHeaderBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TableRowBg()
   * ```
   * Table row background (even rows).
   */
  function ImGui_Col_TableRowBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TableRowBgAlt()
   * ```
   * Table row background (odd rows).
   */
  function ImGui_Col_TableRowBgAlt(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_Text()
   * ```
   */
  function ImGui_Col_Text(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TextDisabled()
   * ```
   */
  function ImGui_Col_TextDisabled(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TextSelectedBg()
   * ```
   */
  function ImGui_Col_TextSelectedBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TitleBg()
   * ```
   * Title bar
   */
  function ImGui_Col_TitleBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TitleBgActive()
   * ```
   * Title bar when focused
   */
  function ImGui_Col_TitleBgActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_TitleBgCollapsed()
   * ```
   * Title bar when collapsed
   */
  function ImGui_Col_TitleBgCollapsed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Col_WindowBg()
   * ```
   * Background of normal windows. See also WindowFlags_NoBackground.
   */
  function ImGui_Col_WindowBg(): number;

  /**
   * ```
   * boolean retval, optional boolean p_visible = reaper.ImGui_CollapsingHeader(ImGui_Context ctx, string label, optional boolean p_visible, optional integer flagsIn)
   * ```
   * Returns true when opened but do not indent nor push into the ID stack
   *
   * (because of the TreeNodeFlags_NoTreePushOnOpen flag).
   *
   *
   *
   * This is basically the same as calling TreeNode(label, TreeNodeFlags_CollapsingHeader).
   *
   * You can remove the _NoTreePushOnOpen flag if you want behavior closer to normal
   *
   * TreeNode.
   *
   *
   *
   * When 'visible' is provided: if 'true' display an additional small close button
   *
   * on upper right of the header which will set the bool to false when clicked,
   *
   * if 'false' don't display the header.
   */
  function ImGui_CollapsingHeader(
    ctx: ImGui_Context,
    label: string,
    p_visible?: boolean,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_ColorButton(ImGui_Context ctx, string desc_id, integer col_rgba, optional integer flagsIn, optional number size_wIn, optional number size_hIn)
   * ```
   * Display a color square/button, hover for details, return true when pressed.
   *
   * Color is in 0xRRGGBBAA or, if ColorEditFlags_NoAlpha is set, 0xRRGGBB.
   */
  function ImGui_ColorButton(
    ctx: ImGui_Context,
    desc_id: string,
    col_rgba: number,
    flagsIn?: number,
    size_wIn?: number,
    size_hIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorConvertDouble4ToU32(number r, number g, number b, number a)
   * ```
   * Pack 0..1 RGBA values into a 32-bit integer (0xRRGGBBAA).
   */
  function ImGui_ColorConvertDouble4ToU32(
    r: number,
    g: number,
    b: number,
    a: number,
  ): number;

  /**
   * ```
   * number r, number g, number b = reaper.ImGui_ColorConvertHSVtoRGB(number h, number s, number v)
   * ```
   * Convert HSV values (0..1) into RGB (0..1).
   */
  function ImGui_ColorConvertHSVtoRGB(
    h: number,
    s: number,
    v: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorConvertNative(integer rgb)
   * ```
   * Convert a native color coming from REAPER or 0xRRGGBB to native.
   *
   * This swaps the red and blue channels on Windows.
   */
  function ImGui_ColorConvertNative(rgb: number): number;

  /**
   * ```
   * number h, number s, number v = reaper.ImGui_ColorConvertRGBtoHSV(number r, number g, number b)
   * ```
   * Convert RGB values (0..1) into HSV (0..1).
   */
  function ImGui_ColorConvertRGBtoHSV(
    r: number,
    g: number,
    b: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * ```
   * number r, number g, number b, number a = reaper.ImGui_ColorConvertU32ToDouble4(integer rgba)
   * ```
   * Unpack a 32-bit integer (0xRRGGBBAA) into separate RGBA values (0..1).
   */
  function ImGui_ColorConvertU32ToDouble4(
    rgba: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * boolean retval, integer col_rgb = reaper.ImGui_ColorEdit3(ImGui_Context ctx, string label, integer col_rgb, optional integer flagsIn)
   * ```
   * Color is in 0xXXRRGGBB. XX is ignored and will not be modified.
   */
  function ImGui_ColorEdit3(
    ctx: ImGui_Context,
    label: string,
    col_rgb: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer col_rgba = reaper.ImGui_ColorEdit4(ImGui_Context ctx, string label, integer col_rgba, optional integer flagsIn)
   * ```
   * Color is in 0xRRGGBBAA or, if ColorEditFlags_NoAlpha is set, 0xXXRRGGBB
   *
   * (XX is ignored and will not be modified).
   */
  function ImGui_ColorEdit4(
    ctx: ImGui_Context,
    label: string,
    col_rgba: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_AlphaBar()
   * ```
   * ColorEdit, ColorPicker: show vertical alpha bar/gradient in picker.
   */
  function ImGui_ColorEditFlags_AlphaBar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_AlphaPreview()
   * ```
   * ColorEdit, ColorPicker, ColorButton: display preview as a transparent color
   *
   *    over a checkerboard, instead of opaque.
   */
  function ImGui_ColorEditFlags_AlphaPreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_AlphaPreviewHalf()
   * ```
   * ColorEdit, ColorPicker, ColorButton: display half opaque / half checkerboard,
   *
   *    instead of opaque.
   */
  function ImGui_ColorEditFlags_AlphaPreviewHalf(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_DisplayHSV()
   * ```
   * ColorEdit: override _display_ type to HSV. ColorPicker:
   *
   *    select any combination using one or more of RGB/HSV/Hex.
   */
  function ImGui_ColorEditFlags_DisplayHSV(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_DisplayHex()
   * ```
   * ColorEdit: override _display_ type to Hex. ColorPicker:
   *
   *    select any combination using one or more of RGB/HSV/Hex.
   */
  function ImGui_ColorEditFlags_DisplayHex(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_DisplayRGB()
   * ```
   * ColorEdit: override _display_ type to RGB. ColorPicker:
   *
   *    select any combination using one or more of RGB/HSV/Hex.
   */
  function ImGui_ColorEditFlags_DisplayRGB(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_Float()
   * ```
   * ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0.0..1.0
   *
   *    floats instead of 0..255 integers. No round-trip of value via integers.
   */
  function ImGui_ColorEditFlags_Float(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_InputHSV()
   * ```
   * ColorEdit, ColorPicker: input and output data in HSV format.
   */
  function ImGui_ColorEditFlags_InputHSV(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_InputRGB()
   * ```
   * ColorEdit, ColorPicker: input and output data in RGB format.
   */
  function ImGui_ColorEditFlags_InputRGB(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoAlpha()
   * ```
   * ColorEdit, ColorPicker, ColorButton: ignore Alpha component
   *
   *   (will only read 3 components from the input pointer).
   */
  function ImGui_ColorEditFlags_NoAlpha(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoBorder()
   * ```
   * ColorButton: disable border (which is enforced by default).
   */
  function ImGui_ColorEditFlags_NoBorder(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoDragDrop()
   * ```
   * ColorEdit: disable drag and drop target. ColorButton: disable drag and drop source.
   */
  function ImGui_ColorEditFlags_NoDragDrop(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoInputs()
   * ```
   * ColorEdit, ColorPicker: disable inputs sliders/text widgets
   *
   *    (e.g. to show only the small preview color square).
   */
  function ImGui_ColorEditFlags_NoInputs(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoLabel()
   * ```
   * ColorEdit, ColorPicker: disable display of inline text label
   *
   *    (the label is still forwarded to the tooltip and picker).
   */
  function ImGui_ColorEditFlags_NoLabel(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoOptions()
   * ```
   * ColorEdit: disable toggling options menu when right-clicking on inputs/small preview.
   */
  function ImGui_ColorEditFlags_NoOptions(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoPicker()
   * ```
   * ColorEdit: disable picker when clicking on color square.
   */
  function ImGui_ColorEditFlags_NoPicker(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoSidePreview()
   * ```
   * ColorPicker: disable bigger color preview on right side of the picker,
   *
   *    use small color square preview instead.
   */
  function ImGui_ColorEditFlags_NoSidePreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoSmallPreview()
   * ```
   * ColorEdit, ColorPicker: disable color square preview next to the inputs.
   *
   *    (e.g. to show only the inputs).
   */
  function ImGui_ColorEditFlags_NoSmallPreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_NoTooltip()
   * ```
   * ColorEdit, ColorPicker, ColorButton: disable tooltip when hovering the preview.
   */
  function ImGui_ColorEditFlags_NoTooltip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_None()
   * ```
   */
  function ImGui_ColorEditFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_PickerHueBar()
   * ```
   * ColorPicker: bar for Hue, rectangle for Sat/Value.
   */
  function ImGui_ColorEditFlags_PickerHueBar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_PickerHueWheel()
   * ```
   * ColorPicker: wheel for Hue, triangle for Sat/Value.
   */
  function ImGui_ColorEditFlags_PickerHueWheel(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ColorEditFlags_Uint8()
   * ```
   * ColorEdit, ColorPicker, ColorButton: _display_ values formatted as 0..255.
   */
  function ImGui_ColorEditFlags_Uint8(): number;

  /**
   * ```
   * boolean retval, integer col_rgb = reaper.ImGui_ColorPicker3(ImGui_Context ctx, string label, integer col_rgb, optional integer flagsIn)
   * ```
   * Color is in 0xXXRRGGBB. XX is ignored and will not be modified.
   */
  function ImGui_ColorPicker3(
    ctx: ImGui_Context,
    label: string,
    col_rgb: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer col_rgba = reaper.ImGui_ColorPicker4(ImGui_Context ctx, string label, integer col_rgba, optional integer flagsIn, optional integer ref_colIn)
   * ```
   */
  function ImGui_ColorPicker4(
    ctx: ImGui_Context,
    label: string,
    col_rgba: number,
    flagsIn?: number,
    ref_colIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer current_item = reaper.ImGui_Combo(ImGui_Context ctx, string label, integer current_item, string items, optional integer popup_max_height_in_itemsIn)
   * ```
   * Helper over BeginCombo/EndCombo for convenience purpose. Each item must be
   *
   * null-terminated (requires REAPER v6.44 or newer for EEL and Lua).
   */
  function ImGui_Combo(
    ctx: ImGui_Context,
    label: string,
    current_item: number,
    items: string,
    popup_max_height_in_itemsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_HeightLarge()
   * ```
   * Max ~20 items visible.
   */
  function ImGui_ComboFlags_HeightLarge(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_HeightLargest()
   * ```
   * As many fitting items as possible.
   */
  function ImGui_ComboFlags_HeightLargest(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_HeightRegular()
   * ```
   * Max ~8 items visible (default).
   */
  function ImGui_ComboFlags_HeightRegular(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_HeightSmall()
   * ```
   * Max ~4 items visible. Tip: If you want your combo popup to be a specific size
   *
   * you can use SetNextWindowSizeConstraints prior to calling BeginCombo.
   */
  function ImGui_ComboFlags_HeightSmall(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_NoArrowButton()
   * ```
   * Display on the preview box without the square arrow button.
   */
  function ImGui_ComboFlags_NoArrowButton(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_NoPreview()
   * ```
   * Display only a square arrow button.
   */
  function ImGui_ComboFlags_NoPreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_None()
   * ```
   */
  function ImGui_ComboFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_PopupAlignLeft()
   * ```
   * Align the popup toward the left by default.
   */
  function ImGui_ComboFlags_PopupAlignLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ComboFlags_WidthFitPreview()
   * ```
   * Width dynamically calculated from preview contents.
   */
  function ImGui_ComboFlags_WidthFitPreview(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Cond_Always()
   * ```
   * No condition (always set the variable).
   */
  function ImGui_Cond_Always(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Cond_Appearing()
   * ```
   * Set the variable if the object/window is appearing after being
   *
   *    hidden/inactive (or the first time).
   */
  function ImGui_Cond_Appearing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Cond_FirstUseEver()
   * ```
   * Set the variable if the object/window has no persistently saved data
   *
   *    (no entry in .ini file).
   */
  function ImGui_Cond_FirstUseEver(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Cond_Once()
   * ```
   * Set the variable once per runtime session (only the first call will succeed).
   */
  function ImGui_Cond_Once(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_DockingEnable()
   * ```
   * Enable docking functionality.
   */
  function ImGui_ConfigFlags_DockingEnable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NavEnableKeyboard()
   * ```
   * Master keyboard navigation enable flag.
   *
   *    Enable full Tabbing + directional arrows + space/enter to activate.
   */
  function ImGui_ConfigFlags_NavEnableKeyboard(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NavEnableSetMousePos()
   * ```
   * Instruct navigation to move the mouse cursor.
   */
  function ImGui_ConfigFlags_NavEnableSetMousePos(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NavNoCaptureKeyboard()
   * ```
   * Instruct navigation to not capture global keyboard input when
   *
   *    ConfigFlags_NavEnableKeyboard is set (see SetNextFrameWantCaptureKeyboard).
   */
  function ImGui_ConfigFlags_NavNoCaptureKeyboard(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NoKeyboard()
   * ```
   * Instruct dear imgui to disable keyboard inputs and interactions.
   *
   * This is done by ignoring keyboard events and clearing existing states.
   */
  function ImGui_ConfigFlags_NoKeyboard(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NoMouse()
   * ```
   * Instruct dear imgui to disable mouse inputs and interactions
   */
  function ImGui_ConfigFlags_NoMouse(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NoMouseCursorChange()
   * ```
   * Instruct backend to not alter mouse cursor shape and visibility.
   */
  function ImGui_ConfigFlags_NoMouseCursorChange(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_NoSavedSettings()
   * ```
   * Disable state restoration and persistence for the whole context.
   */
  function ImGui_ConfigFlags_NoSavedSettings(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigFlags_None()
   * ```
   */
  function ImGui_ConfigFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DebugBeginReturnValueLoop()
   * ```
   * Some calls to Begin()/BeginChild() will return false.
   *
   * Will cycle through window depths then repeat. Suggested use: add
   *
   * "SetConfigVar(ConfigVar_DebugBeginReturnValueLoop(), GetKeyMods() == Mod_Shift"
   *
   * in your main loop then occasionally press SHIFT.
   *
   * Windows should be flickering while running.
   */
  function ImGui_ConfigVar_DebugBeginReturnValueLoop(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DebugBeginReturnValueOnce()
   * ```
   * First-time calls to Begin()/BeginChild() will return false.
   *
   * **Needs to be set at context startup time** if you don't want to miss windows.
   */
  function ImGui_ConfigVar_DebugBeginReturnValueOnce(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DockingNoSplit()
   * ```
   * Simplified docking mode: disable window splitting, so docking is limited to
   *
   *    merging multiple windows together into tab-bars.
   */
  function ImGui_ConfigVar_DockingNoSplit(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DockingTransparentPayload()
   * ```
   * Make window or viewport transparent when docking and only display docking
   *
   *    boxes on the target viewport.
   */
  function ImGui_ConfigVar_DockingTransparentPayload(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DockingWithShift()
   * ```
   * Enable docking with holding Shift key
   *
   *    (reduce visual noise, allows dropping in wider space
   */
  function ImGui_ConfigVar_DockingWithShift(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_DragClickToInputText()
   * ```
   * Enable turning Drag* widgets into text input with a simple mouse
   *
   *    click-release (without moving). Not desirable on devices without a keyboard.
   */
  function ImGui_ConfigVar_DragClickToInputText(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_Flags()
   * ```
   * ConfigFlags_*
   */
  function ImGui_ConfigVar_Flags(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_HoverDelayNormal()
   * ```
   * Delay for IsItemHovered(HoveredFlags_DelayNormal).
   *
   *    Usually used along with ConfigVar_HoverStationaryDelay.
   */
  function ImGui_ConfigVar_HoverDelayNormal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_HoverDelayShort()
   * ```
   * Delay for IsItemHovered(HoveredFlags_DelayShort).
   *
   *    Usually used along with ConfigVar_HoverStationaryDelay.
   */
  function ImGui_ConfigVar_HoverDelayShort(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_HoverFlagsForTooltipMouse()
   * ```
   * Default flags when using IsItemHovered(HoveredFlags_ForTooltip) or
   *
   *    BeginItemTooltip()/SetItemTooltip() while using mouse.
   */
  function ImGui_ConfigVar_HoverFlagsForTooltipMouse(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_HoverFlagsForTooltipNav()
   * ```
   * Default flags when using IsItemHovered(HoveredFlags_ForTooltip) or
   *
   *    BeginItemTooltip()/SetItemTooltip() while using keyboard/gamepad.
   */
  function ImGui_ConfigVar_HoverFlagsForTooltipNav(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_HoverStationaryDelay()
   * ```
   * Delay for IsItemHovered(HoveredFlags_Stationary).
   *
   *    Time required to consider mouse stationary.
   */
  function ImGui_ConfigVar_HoverStationaryDelay(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_InputTextCursorBlink()
   * ```
   * Enable blinking cursor (optional as some users consider it to be distracting).
   */
  function ImGui_ConfigVar_InputTextCursorBlink(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_InputTextEnterKeepActive()
   * ```
   * Pressing Enter will keep item active and select contents (single-line only).
   */
  function ImGui_ConfigVar_InputTextEnterKeepActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_InputTrickleEventQueue()
   * ```
   * Enable input queue trickling: some types of events submitted during the same
   *
   *    frame (e.g. button down + up) will be spread over multiple frames, improving
   *
   *    interactions with low framerates.
   *
   *
   *
   *    Warning: when this option is disabled mouse clicks and key presses faster
   *
   *    than a frame will be lost.
   *
   *    This affects accessiblity features and some input devices.
   */
  function ImGui_ConfigVar_InputTrickleEventQueue(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_KeyRepeatDelay()
   * ```
   * When holding a key/button, time before it starts repeating, in seconds
   *
   *    (for buttons in Repeat mode, etc.).
   */
  function ImGui_ConfigVar_KeyRepeatDelay(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_KeyRepeatRate()
   * ```
   * When holding a key/button, rate at which it repeats, in seconds.
   */
  function ImGui_ConfigVar_KeyRepeatRate(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_MacOSXBehaviors()
   * ```
   * Enabled by default on macOS. Swap Cmd<>Ctrl keys, OS X style text editing
   *
   *    cursor movement using Alt instead of Ctrl, Shortcuts using Cmd/Super instead
   *
   *    of Ctrl, Line/Text Start and End using Cmd+Arrows instead of Home/End,
   *
   *    Double click selects by word instead of selecting whole text, Multi-selection
   *
   *    in lists uses Cmd/Super instead of Ctrl.
   */
  function ImGui_ConfigVar_MacOSXBehaviors(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_MouseDoubleClickMaxDist()
   * ```
   * Distance threshold to stay in to validate a double-click, in pixels.
   */
  function ImGui_ConfigVar_MouseDoubleClickMaxDist(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_MouseDoubleClickTime()
   * ```
   * Time for a double-click, in seconds.
   */
  function ImGui_ConfigVar_MouseDoubleClickTime(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_MouseDragThreshold()
   * ```
   * Distance threshold before considering we are dragging.
   */
  function ImGui_ConfigVar_MouseDragThreshold(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_ViewportsNoDecoration()
   * ```
   * Disable default OS window decoration. Enabling decoration can create
   *
   *    subsequent issues at OS levels (e.g. minimum window size).
   */
  function ImGui_ConfigVar_ViewportsNoDecoration(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_WindowsMoveFromTitleBarOnly()
   * ```
   * Enable allowing to move windows only when clicking on their title bar.
   *
   *    Does not apply to windows without a title bar.
   */
  function ImGui_ConfigVar_WindowsMoveFromTitleBarOnly(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_ConfigVar_WindowsResizeFromEdges()
   * ```
   * Enable resizing of windows from their edges and from the lower-left corner.
   */
  function ImGui_ConfigVar_WindowsResizeFromEdges(): number;

  /**
   * ```
   * ImGui_Context _ = reaper.ImGui_CreateContext(string label, optional integer config_flagsIn)
   * ```
   * Create a new ReaImGui context.
   *
   * The context will remain valid as long as it is used in each defer cycle.
   *
   *
   *
   * The label is used for the tab text when windows are docked in REAPER
   *
   * and also as a unique identifier for storing settings.
   */
  function ImGui_CreateContext(
    label: string,
    config_flagsIn?: number,
  ): ImGui_Context;

  /**
   * ```
   * ImGui_DrawListSplitter _ = reaper.ImGui_CreateDrawListSplitter(ImGui_DrawList draw_list)
   * ```
   */
  function ImGui_CreateDrawListSplitter(
    draw_list: ImGui_DrawList,
  ): ImGui_DrawListSplitter;

  /**
   * ```
   * ImGui_Font _ = reaper.ImGui_CreateFont(string family_or_file, integer size, optional integer flagsIn)
   * ```
   * Load a font matching a font family name or from a font file.
   *
   * The font will remain valid while it's attached to a context. See Attach.
   *
   *
   *
   * The family name can be an installed font or one of the generic fonts:
   *
   * sans-serif, serif, monospace, cursive, fantasy.
   *
   *
   *
   * If 'family_or_file' specifies a path to a font file (contains a / or \\):
   *
   * - The first byte of 'flags' is used as the font index within the file
   *
   * - The font styles in 'flags' are simulated by the font renderer
   */
  function ImGui_CreateFont(
    family_or_file: string,
    size: number,
    flagsIn?: number,
  ): ImGui_Font;

  /**
   * ```
   * ImGui_Font _ = reaper.ImGui_CreateFontFromMem(string data, integer size, optional integer flagsIn)
   * ```
   * Requires REAPER v6.44 or newer for EEL and Lua. Use CreateFont or
   *
   * explicitely specify data_sz to support older versions.
   *
   *
   *
   * - The first byte of 'flags' is used as the font index within the file
   *
   * - The font styles in 'flags' are simulated by the font renderer
   */
  function ImGui_CreateFontFromMem(
    data: string,
    size: number,
    flagsIn?: number,
  ): ImGui_Font;

  /**
   * ```
   * ImGui_Function _ = reaper.ImGui_CreateFunctionFromEEL(string code)
   * ```
   * Compile an EEL program.
   *
   *
   *
   * Standard EEL [math](https://www.reaper.fm/sdk/js/basiccode.php#js_basicfunc)
   *
   * and [string](https://www.reaper.fm/sdk/js/strings.php#js_string_funcs)
   *
   * functions are available in addition to callback-specific functions
   *
   * (see InputTextCallback_*).
   */
  function ImGui_CreateFunctionFromEEL(code: string): ImGui_Function;

  /**
   * ```
   * ImGui_Image _ = reaper.ImGui_CreateImage(string file, optional integer flagsIn)
   * ```
   * The returned object is valid as long as it is used in each defer cycle
   *
   * unless attached to a context (see Attach).
   *
   *
   *
   * ('flags' currently unused and reserved for future expansion)
   */
  function ImGui_CreateImage(file: string, flagsIn?: number): ImGui_Image;

  /**
   * ```
   * ImGui_Image _ = reaper.ImGui_CreateImageFromLICE(LICE_IBitmap bitmap, optional integer flagsIn)
   * ```
   * Copies pixel data from a LICE bitmap created using JS_LICE_CreateBitmap.
   */
  function ImGui_CreateImageFromLICE(
    bitmap: LICE_IBitmap,
    flagsIn?: number,
  ): ImGui_Image;

  /**
   * ```
   * ImGui_Image _ = reaper.ImGui_CreateImageFromMem(string data, optional integer flagsIn)
   * ```
   * Requires REAPER v6.44 or newer for EEL and Lua. Load from a file using
   *
   * CreateImage or explicitely specify data_sz to support older versions.
   */
  function ImGui_CreateImageFromMem(
    data: string,
    flagsIn?: number,
  ): ImGui_Image;

  function ImGui_CreateImageSet(): ImGui_ImageSet;

  /**
   * ```
   * ImGui_ListClipper _ = reaper.ImGui_CreateListClipper(ImGui_Context ctx)
   * ```
   * The returned clipper object is only valid for the given context and is valid
   *
   * as long as it is used in each defer cycle unless attached (see Attach).
   */
  function ImGui_CreateListClipper(ctx: ImGui_Context): ImGui_ListClipper;

  /**
   * ```
   * ImGui_TextFilter _ = reaper.ImGui_CreateTextFilter(optional string default_filterIn)
   * ```
   * Valid while used every frame unless attached to a context (see Attach).
   */
  function ImGui_CreateTextFilter(default_filterIn?: string): ImGui_TextFilter;

  /**
   * ```
   * reaper.ImGui_DebugFlashStyleColor(ImGui_Context ctx, integer idx)
   * ```
   */
  function ImGui_DebugFlashStyleColor(ctx: ImGui_Context, idx: number): void;

  /**
   * ```
   * reaper.ImGui_DebugStartItemPicker(ImGui_Context ctx)
   * ```
   */
  function ImGui_DebugStartItemPicker(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_DebugTextEncoding(ImGui_Context ctx, string text)
   * ```
   * Helper tool to diagnose between text encoding issues and font loading issues.
   *
   * Pass your UTF-8 string and verify that there are correct.
   */
  function ImGui_DebugTextEncoding(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_Detach(ImGui_Context ctx, ImGui_Resource obj)
   * ```
   * Unlink the object's lifetime. Unattached objects are automatically destroyed
   *
   * when left unused. You may check whether an object has been destroyed using
   *
   * ValidatePtr.
   */
  function ImGui_Detach(ctx: ImGui_Context, obj: ImGui_Resource): void;

  /**
   * ```
   * integer _ = reaper.ImGui_Dir_Down()
   * ```
   */
  function ImGui_Dir_Down(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Dir_Left()
   * ```
   */
  function ImGui_Dir_Left(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Dir_None()
   * ```
   */
  function ImGui_Dir_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Dir_Right()
   * ```
   */
  function ImGui_Dir_Right(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Dir_Up()
   * ```
   */
  function ImGui_Dir_Up(): number;

  /**
   * ```
   * boolean retval, number v = reaper.ImGui_DragDouble(ImGui_Context ctx, string label, number v, optional number v_speedIn, optional number v_minIn, optional number v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragDouble(
    ctx: ImGui_Context,
    label: string,
    v: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2 = reaper.ImGui_DragDouble2(ImGui_Context ctx, string label, number v1, number v2, optional number v_speedIn, optional number v_minIn, optional number v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragDouble2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3 = reaper.ImGui_DragDouble3(ImGui_Context ctx, string label, number v1, number v2, number v3, optional number v_speedIn, optional number v_minIn, optional number v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragDouble3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3, number v4 = reaper.ImGui_DragDouble4(ImGui_Context ctx, string label, number v1, number v2, number v3, number v4, optional number v_speedIn, optional number v_minIn, optional number v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragDouble4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_DragDoubleN(ImGui_Context ctx, string label, reaper_array values, optional number speedIn, optional number minIn, optional number maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragDoubleN(
    ctx: ImGui_Context,
    label: string,
    values: reaper_array,
    speedIn?: number,
    minIn?: number,
    maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_AcceptBeforeDelivery()
   * ```
   * AcceptDragDropPayload will returns true even before the mouse button is
   *
   *    released. You can then check GetDragDropPayload/is_delivery to test if the
   *
   *    payload needs to be delivered.
   */
  function ImGui_DragDropFlags_AcceptBeforeDelivery(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_AcceptNoDrawDefaultRect()
   * ```
   * Do not draw the default highlight rectangle when hovering over target.
   */
  function ImGui_DragDropFlags_AcceptNoDrawDefaultRect(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_AcceptNoPreviewTooltip()
   * ```
   * Request hiding the BeginDragDropSource tooltip from the BeginDragDropTarget site.
   */
  function ImGui_DragDropFlags_AcceptNoPreviewTooltip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_AcceptPeekOnly()
   * ```
   * For peeking ahead and inspecting the payload before delivery.
   *
   *    Equivalent to DragDropFlags_AcceptBeforeDelivery |
   *
   *    DragDropFlags_AcceptNoDrawDefaultRect.
   */
  function ImGui_DragDropFlags_AcceptPeekOnly(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_None()
   * ```
   */
  function ImGui_DragDropFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_PayloadAutoExpire()
   * ```
   * Automatically expire the payload if the source cease to be submitted
   *
   *    (otherwise payloads are persisting while being dragged).
   */
  function ImGui_DragDropFlags_PayloadAutoExpire(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_SourceAllowNullID()
   * ```
   * Allow items such as Text, Image that have no unique identifier to be used as
   *
   *    drag source, by manufacturing a temporary identifier based on their
   *
   *    window-relative position. This is extremely unusual within the dear imgui
   *
   *    ecosystem and so we made it explicit.
   */
  function ImGui_DragDropFlags_SourceAllowNullID(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_SourceExtern()
   * ```
   * External source (from outside of dear imgui), won't attempt to read current
   *
   *    item/window info. Will always return true.
   *
   *    Only one Extern source can be active simultaneously.
   */
  function ImGui_DragDropFlags_SourceExtern(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_SourceNoDisableHover()
   * ```
   * By default, when dragging we clear data so that IsItemHovered will return
   *
   *    false, to avoid subsequent user code submitting tooltips. This flag disables
   *
   *    this behavior so you can still call IsItemHovered on the source item.
   */
  function ImGui_DragDropFlags_SourceNoDisableHover(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_SourceNoHoldToOpenOthers()
   * ```
   * Disable the behavior that allows to open tree nodes and collapsing header by
   *
   *    holding over them while dragging a source item.
   */
  function ImGui_DragDropFlags_SourceNoHoldToOpenOthers(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DragDropFlags_SourceNoPreviewTooltip()
   * ```
   * By default, a successful call to BeginDragDropSource opens a tooltip so you
   *
   *    can display a preview or description of the source contents.
   *
   *    This flag disables this behavior.
   */
  function ImGui_DragDropFlags_SourceNoPreviewTooltip(): number;

  /**
   * ```
   * boolean retval, number v_current_min, number v_current_max = reaper.ImGui_DragFloatRange2(ImGui_Context ctx, string label, number v_current_min, number v_current_max, optional number v_speedIn, optional number v_minIn, optional number v_maxIn, optional string formatIn, optional string format_maxIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragFloatRange2(
    ctx: ImGui_Context,
    label: string,
    v_current_min: number,
    v_current_max: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    format_maxIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, integer v = reaper.ImGui_DragInt(ImGui_Context ctx, string label, integer v, optional number v_speedIn, optional integer v_minIn, optional integer v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragInt(
    ctx: ImGui_Context,
    label: string,
    v: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2 = reaper.ImGui_DragInt2(ImGui_Context ctx, string label, integer v1, integer v2, optional number v_speedIn, optional integer v_minIn, optional integer v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragInt2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3 = reaper.ImGui_DragInt3(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, optional number v_speedIn, optional integer v_minIn, optional integer v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragInt3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3, integer v4 = reaper.ImGui_DragInt4(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, integer v4, optional number v_speedIn, optional integer v_minIn, optional integer v_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragInt4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean retval, integer v_current_min, integer v_current_max = reaper.ImGui_DragIntRange2(ImGui_Context ctx, string label, integer v_current_min, integer v_current_max, optional number v_speedIn, optional integer v_minIn, optional integer v_maxIn, optional string formatIn, optional string format_maxIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DragIntRange2(
    ctx: ImGui_Context,
    label: string,
    v_current_min: number,
    v_current_max: number,
    v_speedIn?: number,
    v_minIn?: number,
    v_maxIn?: number,
    formatIn?: string,
    format_maxIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_Closed()
   * ```
   * DrawList_PathStroke, DrawList_AddPolyline: specify that shape should be
   *
   *    closed (Important: this is always == 1 for legacy reason).
   */
  function ImGui_DrawFlags_Closed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_None()
   * ```
   */
  function ImGui_DrawFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersAll()
   * ```
   */
  function ImGui_DrawFlags_RoundCornersAll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersBottom()
   * ```
   */
  function ImGui_DrawFlags_RoundCornersBottom(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersBottomLeft()
   * ```
   * DrawList_AddRect, DrawList_AddRectFilled, DrawList_PathRect: enable rounding
   *
   *    bottom-left corner only (when rounding > 0.0, we default to all corners).
   */
  function ImGui_DrawFlags_RoundCornersBottomLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersBottomRight()
   * ```
   * DrawList_AddRect, DrawList_AddRectFilled, DrawList_PathRect: enable rounding
   *
   *    bottom-right corner only (when rounding > 0.0, we default to all corners).
   */
  function ImGui_DrawFlags_RoundCornersBottomRight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersLeft()
   * ```
   */
  function ImGui_DrawFlags_RoundCornersLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersNone()
   * ```
   * DrawList_AddRect, DrawList_AddRectFilled, DrawList_PathRect: disable rounding
   *
   *    on all corners (when rounding > 0.0). This is NOT zero, NOT an implicit flag!.
   */
  function ImGui_DrawFlags_RoundCornersNone(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersRight()
   * ```
   */
  function ImGui_DrawFlags_RoundCornersRight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersTop()
   * ```
   */
  function ImGui_DrawFlags_RoundCornersTop(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersTopLeft()
   * ```
   * DrawList_AddRect, DrawList_AddRectFilled, DrawList_PathRect: enable rounding
   *
   *    top-left corner only (when rounding > 0.0, we default to all corners).
   */
  function ImGui_DrawFlags_RoundCornersTopLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_DrawFlags_RoundCornersTopRight()
   * ```
   * DrawList_AddRect, DrawList_AddRectFilled, DrawList_PathRect: enable rounding
   *
   *    top-right corner only (when rounding > 0.0, we default to all corners).
   */
  function ImGui_DrawFlags_RoundCornersTopRight(): number;

  /**
   * ```
   * reaper.ImGui_DrawListSplitter_Clear(ImGui_DrawListSplitter splitter)
   * ```
   */
  function ImGui_DrawListSplitter_Clear(splitter: ImGui_DrawListSplitter): void;

  /**
   * ```
   * reaper.ImGui_DrawListSplitter_Merge(ImGui_DrawListSplitter splitter)
   * ```
   */
  function ImGui_DrawListSplitter_Merge(splitter: ImGui_DrawListSplitter): void;

  /**
   * ```
   * reaper.ImGui_DrawListSplitter_SetCurrentChannel(ImGui_DrawListSplitter splitter, integer channel_idx)
   * ```
   */
  function ImGui_DrawListSplitter_SetCurrentChannel(
    splitter: ImGui_DrawListSplitter,
    channel_idx: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawListSplitter_Split(ImGui_DrawListSplitter splitter, integer count)
   * ```
   */
  function ImGui_DrawListSplitter_Split(
    splitter: ImGui_DrawListSplitter,
    count: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddBezierCubic(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, number p4_x, number p4_y, integer col_rgba, number thickness, optional integer num_segmentsIn)
   * ```
   * Cubic Bezier (4 control points)
   */
  function ImGui_DrawList_AddBezierCubic(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    p4_x: number,
    p4_y: number,
    col_rgba: number,
    thickness: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddBezierQuadratic(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, integer col_rgba, number thickness, optional integer num_segmentsIn)
   * ```
   * Quadratic Bezier (3 control points)
   */
  function ImGui_DrawList_AddBezierQuadratic(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    col_rgba: number,
    thickness: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddCircle(ImGui_DrawList draw_list, number center_x, number center_y, number radius, integer col_rgba, optional integer num_segmentsIn, optional number thicknessIn)
   * ```
   * Use "num_segments == 0" to automatically calculate tessellation (preferred).
   */
  function ImGui_DrawList_AddCircle(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    col_rgba: number,
    num_segmentsIn?: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddCircleFilled(ImGui_DrawList draw_list, number center_x, number center_y, number radius, integer col_rgba, optional integer num_segmentsIn)
   * ```
   * Use "num_segments == 0" to automatically calculate tessellation (preferred).
   */
  function ImGui_DrawList_AddCircleFilled(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    col_rgba: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddConcavePolyFilled(ImGui_DrawList draw_list, reaper_array points, integer col_rgba)
   * ```
   * Concave polygon fill is more expensive than convex one: it has O(N^2) complexity.
   */
  function ImGui_DrawList_AddConcavePolyFilled(
    draw_list: ImGui_DrawList,
    points: reaper_array,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddConvexPolyFilled(ImGui_DrawList draw_list, reaper_array points, integer col_rgba)
   * ```
   * Note: Anti-aliased filling requires points to be in clockwise order.
   */
  function ImGui_DrawList_AddConvexPolyFilled(
    draw_list: ImGui_DrawList,
    points: reaper_array,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddEllipse(ImGui_DrawList draw_list, number center_x, number center_y, number radius_x, number radius_y, integer col_rgba, optional number rotIn, optional integer num_segmentsIn, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddEllipse(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius_x: number,
    radius_y: number,
    col_rgba: number,
    rotIn?: number,
    num_segmentsIn?: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddEllipseFilled(ImGui_DrawList draw_list, number center_x, number center_y, number radius_x, number radius_y, integer col_rgba, optional number rotIn, optional integer num_segmentsIn)
   * ```
   */
  function ImGui_DrawList_AddEllipseFilled(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius_x: number,
    radius_y: number,
    col_rgba: number,
    rotIn?: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddImage(ImGui_DrawList draw_list, ImGui_Image image, number p_min_x, number p_min_y, number p_max_x, number p_max_y, optional number uv_min_xIn, optional number uv_min_yIn, optional number uv_max_xIn, optional number uv_max_yIn, optional integer col_rgbaIn)
   * ```
   */
  function ImGui_DrawList_AddImage(
    draw_list: ImGui_DrawList,
    image: ImGui_Image,
    p_min_x: number,
    p_min_y: number,
    p_max_x: number,
    p_max_y: number,
    uv_min_xIn?: number,
    uv_min_yIn?: number,
    uv_max_xIn?: number,
    uv_max_yIn?: number,
    col_rgbaIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddImageQuad(ImGui_DrawList draw_list, ImGui_Image image, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, number p4_x, number p4_y, optional number uv1_xIn, optional number uv1_yIn, optional number uv2_xIn, optional number uv2_yIn, optional number uv3_xIn, optional number uv3_yIn, optional number uv4_xIn, optional number uv4_yIn, optional integer col_rgbaIn)
   * ```
   */
  function ImGui_DrawList_AddImageQuad(
    draw_list: ImGui_DrawList,
    image: ImGui_Image,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    p4_x: number,
    p4_y: number,
    uv1_xIn?: number,
    uv1_yIn?: number,
    uv2_xIn?: number,
    uv2_yIn?: number,
    uv3_xIn?: number,
    uv3_yIn?: number,
    uv4_xIn?: number,
    uv4_yIn?: number,
    col_rgbaIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddImageRounded(ImGui_DrawList draw_list, ImGui_Image image, number p_min_x, number p_min_y, number p_max_x, number p_max_y, number uv_min_x, number uv_min_y, number uv_max_x, number uv_max_y, integer col_rgba, number rounding, optional integer flagsIn)
   * ```
   */
  function ImGui_DrawList_AddImageRounded(
    draw_list: ImGui_DrawList,
    image: ImGui_Image,
    p_min_x: number,
    p_min_y: number,
    p_max_x: number,
    p_max_y: number,
    uv_min_x: number,
    uv_min_y: number,
    uv_max_x: number,
    uv_max_y: number,
    col_rgba: number,
    rounding: number,
    flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddLine(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, integer col_rgba, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddLine(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    col_rgba: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddNgon(ImGui_DrawList draw_list, number center_x, number center_y, number radius, integer col_rgba, integer num_segments, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddNgon(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    col_rgba: number,
    num_segments: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddNgonFilled(ImGui_DrawList draw_list, number center_x, number center_y, number radius, integer col_rgba, integer num_segments)
   * ```
   */
  function ImGui_DrawList_AddNgonFilled(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    col_rgba: number,
    num_segments: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddPolyline(ImGui_DrawList draw_list, reaper_array points, integer col_rgba, integer flags, number thickness)
   * ```
   * Points is a list of x,y coordinates.
   */
  function ImGui_DrawList_AddPolyline(
    draw_list: ImGui_DrawList,
    points: reaper_array,
    col_rgba: number,
    flags: number,
    thickness: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddQuad(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, number p4_x, number p4_y, integer col_rgba, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddQuad(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    p4_x: number,
    p4_y: number,
    col_rgba: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddQuadFilled(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, number p4_x, number p4_y, integer col_rgba)
   * ```
   */
  function ImGui_DrawList_AddQuadFilled(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    p4_x: number,
    p4_y: number,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddRect(ImGui_DrawList draw_list, number p_min_x, number p_min_y, number p_max_x, number p_max_y, integer col_rgba, optional number roundingIn, optional integer flagsIn, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddRect(
    draw_list: ImGui_DrawList,
    p_min_x: number,
    p_min_y: number,
    p_max_x: number,
    p_max_y: number,
    col_rgba: number,
    roundingIn?: number,
    flagsIn?: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddRectFilled(ImGui_DrawList draw_list, number p_min_x, number p_min_y, number p_max_x, number p_max_y, integer col_rgba, optional number roundingIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DrawList_AddRectFilled(
    draw_list: ImGui_DrawList,
    p_min_x: number,
    p_min_y: number,
    p_max_x: number,
    p_max_y: number,
    col_rgba: number,
    roundingIn?: number,
    flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddRectFilledMultiColor(ImGui_DrawList draw_list, number p_min_x, number p_min_y, number p_max_x, number p_max_y, integer col_upr_left, integer col_upr_right, integer col_bot_right, integer col_bot_left)
   * ```
   */
  function ImGui_DrawList_AddRectFilledMultiColor(
    draw_list: ImGui_DrawList,
    p_min_x: number,
    p_min_y: number,
    p_max_x: number,
    p_max_y: number,
    col_upr_left: number,
    col_upr_right: number,
    col_bot_right: number,
    col_bot_left: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddText(ImGui_DrawList draw_list, number x, number y, integer col_rgba, string text)
   * ```
   */
  function ImGui_DrawList_AddText(
    draw_list: ImGui_DrawList,
    x: number,
    y: number,
    col_rgba: number,
    text: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddTextEx(ImGui_DrawList draw_list, ImGui_Font font, number font_size, number pos_x, number pos_y, integer col_rgba, string text, optional number wrap_widthIn, optional number cpu_fine_clip_rect_min_xIn, optional number cpu_fine_clip_rect_min_yIn, optional number cpu_fine_clip_rect_max_xIn, optional number cpu_fine_clip_rect_max_yIn)
   * ```
   * The last pushed font is used if font is nil.
   *
   * The size of the last pushed font is used if font_size is 0.
   *
   * cpu_fine_clip_rect_* only takes effect if all four are non-nil.
   */
  function ImGui_DrawList_AddTextEx(
    draw_list: ImGui_DrawList,
    font: ImGui_Font,
    font_size: number,
    pos_x: number,
    pos_y: number,
    col_rgba: number,
    text: string,
    wrap_widthIn?: number,
    cpu_fine_clip_rect_min_xIn?: number,
    cpu_fine_clip_rect_min_yIn?: number,
    cpu_fine_clip_rect_max_xIn?: number,
    cpu_fine_clip_rect_max_yIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddTriangle(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, integer col_rgba, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_AddTriangle(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    col_rgba: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_AddTriangleFilled(ImGui_DrawList draw_list, number p1_x, number p1_y, number p2_x, number p2_y, number p3_x, number p3_y, integer col_rgba)
   * ```
   */
  function ImGui_DrawList_AddTriangleFilled(
    draw_list: ImGui_DrawList,
    p1_x: number,
    p1_y: number,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathArcTo(ImGui_DrawList draw_list, number center_x, number center_y, number radius, number a_min, number a_max, optional integer num_segmentsIn)
   * ```
   */
  function ImGui_DrawList_PathArcTo(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    a_min: number,
    a_max: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathArcToFast(ImGui_DrawList draw_list, number center_x, number center_y, number radius, integer a_min_of_12, integer a_max_of_12)
   * ```
   * Use precomputed angles for a 12 steps circle.
   */
  function ImGui_DrawList_PathArcToFast(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius: number,
    a_min_of_12: number,
    a_max_of_12: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathBezierCubicCurveTo(ImGui_DrawList draw_list, number p2_x, number p2_y, number p3_x, number p3_y, number p4_x, number p4_y, optional integer num_segmentsIn)
   * ```
   * Cubic Bezier (4 control points)
   */
  function ImGui_DrawList_PathBezierCubicCurveTo(
    draw_list: ImGui_DrawList,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    p4_x: number,
    p4_y: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathBezierQuadraticCurveTo(ImGui_DrawList draw_list, number p2_x, number p2_y, number p3_x, number p3_y, optional integer num_segmentsIn)
   * ```
   * Quadratic Bezier (3 control points)
   */
  function ImGui_DrawList_PathBezierQuadraticCurveTo(
    draw_list: ImGui_DrawList,
    p2_x: number,
    p2_y: number,
    p3_x: number,
    p3_y: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathClear(ImGui_DrawList draw_list)
   * ```
   */
  function ImGui_DrawList_PathClear(draw_list: ImGui_DrawList): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathEllipticalArcTo(ImGui_DrawList draw_list, number center_x, number center_y, number radius_x, number radius_y, number rot, number a_min, number a_max, optional integer num_segmentsIn)
   * ```
   * Ellipse
   */
  function ImGui_DrawList_PathEllipticalArcTo(
    draw_list: ImGui_DrawList,
    center_x: number,
    center_y: number,
    radius_x: number,
    radius_y: number,
    rot: number,
    a_min: number,
    a_max: number,
    num_segmentsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathFillConcave(ImGui_DrawList draw_list, integer col_rgba)
   * ```
   */
  function ImGui_DrawList_PathFillConcave(
    draw_list: ImGui_DrawList,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathFillConvex(ImGui_DrawList draw_list, integer col_rgba)
   * ```
   */
  function ImGui_DrawList_PathFillConvex(
    draw_list: ImGui_DrawList,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathLineTo(ImGui_DrawList draw_list, number pos_x, number pos_y)
   * ```
   */
  function ImGui_DrawList_PathLineTo(
    draw_list: ImGui_DrawList,
    pos_x: number,
    pos_y: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathRect(ImGui_DrawList draw_list, number rect_min_x, number rect_min_y, number rect_max_x, number rect_max_y, optional number roundingIn, optional integer flagsIn)
   * ```
   */
  function ImGui_DrawList_PathRect(
    draw_list: ImGui_DrawList,
    rect_min_x: number,
    rect_min_y: number,
    rect_max_x: number,
    rect_max_y: number,
    roundingIn?: number,
    flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PathStroke(ImGui_DrawList draw_list, integer col_rgba, optional integer flagsIn, optional number thicknessIn)
   * ```
   */
  function ImGui_DrawList_PathStroke(
    draw_list: ImGui_DrawList,
    col_rgba: number,
    flagsIn?: number,
    thicknessIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PopClipRect(ImGui_DrawList draw_list)
   * ```
   * See DrawList_PushClipRect
   */
  function ImGui_DrawList_PopClipRect(draw_list: ImGui_DrawList): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PushClipRect(ImGui_DrawList draw_list, number clip_rect_min_x, number clip_rect_min_y, number clip_rect_max_x, number clip_rect_max_y, optional boolean intersect_with_current_clip_rectIn)
   * ```
   * Render-level scissoring. Prefer using higher-level PushClipRect to affect
   *
   * logic (hit-testing and widget culling).
   */
  function ImGui_DrawList_PushClipRect(
    draw_list: ImGui_DrawList,
    clip_rect_min_x: number,
    clip_rect_min_y: number,
    clip_rect_max_x: number,
    clip_rect_max_y: number,
    intersect_with_current_clip_rectIn?: boolean,
  ): void;

  /**
   * ```
   * reaper.ImGui_DrawList_PushClipRectFullScreen(ImGui_DrawList draw_list)
   * ```
   */
  function ImGui_DrawList_PushClipRectFullScreen(
    draw_list: ImGui_DrawList,
  ): void;

  /**
   * ```
   * reaper.ImGui_Dummy(ImGui_Context ctx, number size_w, number size_h)
   * ```
   * Add a dummy item of given size. unlike InvisibleButton, Dummy() won't take the
   *
   * mouse click or be navigable into.
   */
  function ImGui_Dummy(
    ctx: ImGui_Context,
    size_w: number,
    size_h: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_End(ImGui_Context ctx)
   * ```
   * Pop window from the stack. See Begin.
   */
  function ImGui_End(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndChild(ImGui_Context ctx)
   * ```
   * See BeginChild.
   */
  function ImGui_EndChild(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndCombo(ImGui_Context ctx)
   * ```
   * Only call EndCombo() if BeginCombo returns true!
   */
  function ImGui_EndCombo(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndDisabled(ImGui_Context ctx)
   * ```
   * See BeginDisabled.
   */
  function ImGui_EndDisabled(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndDragDropSource(ImGui_Context ctx)
   * ```
   * Only call EndDragDropSource() if BeginDragDropSource returns true!
   */
  function ImGui_EndDragDropSource(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndDragDropTarget(ImGui_Context ctx)
   * ```
   * Only call EndDragDropTarget() if BeginDragDropTarget returns true!
   */
  function ImGui_EndDragDropTarget(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndGroup(ImGui_Context ctx)
   * ```
   * Unlock horizontal starting position + capture the whole group bounding box
   *
   * into one "item" (so you can use IsItemHovered or layout primitives such as
   *
   * SameLine on whole group, etc.).
   *
   *
   *
   * See BeginGroup.
   */
  function ImGui_EndGroup(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndListBox(ImGui_Context ctx)
   * ```
   * Only call EndListBox() if BeginListBox returned true!
   */
  function ImGui_EndListBox(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndMenu(ImGui_Context ctx)
   * ```
   * Only call EndMenu() if BeginMenu returns true!
   */
  function ImGui_EndMenu(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndMenuBar(ImGui_Context ctx)
   * ```
   * Only call EndMenuBar if BeginMenuBar returns true!
   */
  function ImGui_EndMenuBar(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndPopup(ImGui_Context ctx)
   * ```
   * Only call EndPopup() if BeginPopup*() returns true!
   */
  function ImGui_EndPopup(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndTabBar(ImGui_Context ctx)
   * ```
   * Only call EndTabBar() if BeginTabBar() returns true!
   */
  function ImGui_EndTabBar(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndTabItem(ImGui_Context ctx)
   * ```
   * Only call EndTabItem() if BeginTabItem() returns true!
   */
  function ImGui_EndTabItem(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndTable(ImGui_Context ctx)
   * ```
   * Only call EndTable() if BeginTable() returns true!
   */
  function ImGui_EndTable(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_EndTooltip(ImGui_Context ctx)
   * ```
   * Only call EndTooltip() if BeginTooltip()/BeginItemTooltip() returns true.
   */
  function ImGui_EndTooltip(ctx: ImGui_Context): void;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_AnyWindow()
   * ```
   * Return true if any window is focused.
   */
  function ImGui_FocusedFlags_AnyWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_ChildWindows()
   * ```
   * Return true if any children of the window is focused.
   */
  function ImGui_FocusedFlags_ChildWindows(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_DockHierarchy()
   * ```
   * Consider docking hierarchy (treat dockspace host as parent of docked window)
   *
   *    (when used with _ChildWindows or _RootWindow).
   */
  function ImGui_FocusedFlags_DockHierarchy(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_NoPopupHierarchy()
   * ```
   * Do not consider popup hierarchy (do not treat popup emitter as parent of
   *
   *    popup) (when used with _ChildWindows or _RootWindow).
   */
  function ImGui_FocusedFlags_NoPopupHierarchy(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_None()
   * ```
   */
  function ImGui_FocusedFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_RootAndChildWindows()
   * ```
   * FocusedFlags_RootWindow | FocusedFlags_ChildWindows
   */
  function ImGui_FocusedFlags_RootAndChildWindows(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FocusedFlags_RootWindow()
   * ```
   * Test from root window (top most parent of the current hierarchy).
   */
  function ImGui_FocusedFlags_RootWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FontFlags_Bold()
   * ```
   */
  function ImGui_FontFlags_Bold(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FontFlags_Italic()
   * ```
   */
  function ImGui_FontFlags_Italic(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_FontFlags_None()
   * ```
   */
  function ImGui_FontFlags_None(): number;

  /**
   * ```
   * reaper.ImGui_Function_Execute(ImGui_Function func)
   * ```
   */
  function ImGui_Function_Execute(func: ImGui_Function): void;

  /**
   * ```
   * number _ = reaper.ImGui_Function_GetValue(ImGui_Function func, string name)
   * ```
   */
  function ImGui_Function_GetValue(func: ImGui_Function, name: string): number;

  /**
   * ```
   * reaper.ImGui_Function_GetValue_Array(ImGui_Function func, string name, reaper_array values)
   * ```
   * Copy the values in the function's memory starting at the address stored
   *
   * in the given variable into the array.
   */
  function ImGui_Function_GetValue_Array(
    func: ImGui_Function,
    name: string,
    values: reaper_array,
  ): void;

  /**
   * ```
   * string value = reaper.ImGui_Function_GetValue_String(ImGui_Function func, string name)
   * ```
   * Read from a string slot or a named string (when name starts with a `#`).
   */
  function ImGui_Function_GetValue_String(
    func: ImGui_Function,
    name: string,
  ): string;

  /**
   * ```
   * reaper.ImGui_Function_SetValue(ImGui_Function func, string name, number value)
   * ```
   */
  function ImGui_Function_SetValue(
    func: ImGui_Function,
    name: string,
    value: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_Function_SetValue_Array(ImGui_Function func, string name, reaper_array values)
   * ```
   * Copy the values in the array to the function's memory at the address stored
   *
   * in the given variable.
   */
  function ImGui_Function_SetValue_Array(
    func: ImGui_Function,
    name: string,
    values: reaper_array,
  ): void;

  /**
   * ```
   * reaper.ImGui_Function_SetValue_String(ImGui_Function func, string name, string value)
   * ```
   * Write to a string slot or a named string (when name starts with a `#`).
   */
  function ImGui_Function_SetValue_String(
    func: ImGui_Function,
    name: string,
    value: string,
  ): void;

  /**
   * ```
   * ImGui_DrawList _ = reaper.ImGui_GetBackgroundDrawList(ImGui_Context ctx)
   * ```
   * This draw list will be the first rendering one. Useful to quickly draw
   *
   * shapes/text behind dear imgui contents.
   */
  function ImGui_GetBackgroundDrawList(ctx: ImGui_Context): ImGui_DrawList;

  /**
   * ```
   * string _ = reaper.ImGui_GetBuiltinPath()
   * ```
   * Returns the path to the directory containing imgui.lua, imgui.py and gfx2imgui.lua.
   */
  function ImGui_GetBuiltinPath(): string;

  /**
   * ```
   * string _ = reaper.ImGui_GetClipboardText(ImGui_Context ctx)
   * ```
   */
  function ImGui_GetClipboardText(ctx: ImGui_Context): string;

  /**
   * ```
   * integer _ = reaper.ImGui_GetColor(ImGui_Context ctx, integer idx, optional number alpha_mulIn)
   * ```
   * Retrieve given style color with style alpha applied and optional extra alpha
   *
   * multiplier, packed as a 32-bit value (RGBA). See Col_* for available style colors.
   */
  function ImGui_GetColor(
    ctx: ImGui_Context,
    idx: number,
    alpha_mulIn?: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.ImGui_GetColorEx(ImGui_Context ctx, integer col_rgba, optional number alpha_mulIn)
   * ```
   * Retrieve given color with style alpha applied, packed as a 32-bit value (RGBA).
   */
  function ImGui_GetColorEx(
    ctx: ImGui_Context,
    col_rgba: number,
    alpha_mulIn?: number,
  ): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetConfigVar(ImGui_Context ctx, integer var_idx)
   * ```
   */
  function ImGui_GetConfigVar(ctx: ImGui_Context, var_idx: number): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetContentRegionAvail(ImGui_Context ctx)
   * ```
   * == GetContentRegionMax() - GetCursorPos()
   */
  function ImGui_GetContentRegionAvail(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetContentRegionMax(ImGui_Context ctx)
   * ```
   * Current content boundaries (typically window boundaries including scrolling,
   *
   * or current column boundaries), in windows coordinates.
   */
  function ImGui_GetContentRegionMax(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetCursorPos(ImGui_Context ctx)
   * ```
   * Cursor position in window
   */
  function ImGui_GetCursorPos(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetCursorPosX(ImGui_Context ctx)
   * ```
   * Cursor X position in window
   */
  function ImGui_GetCursorPosX(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetCursorPosY(ImGui_Context ctx)
   * ```
   * Cursor Y position in window
   */
  function ImGui_GetCursorPosY(ctx: ImGui_Context): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetCursorScreenPos(ImGui_Context ctx)
   * ```
   * Cursor position in absolute screen coordinates (useful to work with the DrawList API).
   */
  function ImGui_GetCursorScreenPos(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetCursorStartPos(ImGui_Context ctx)
   * ```
   * Initial cursor position in window coordinates.
   */
  function ImGui_GetCursorStartPos(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetDeltaTime(ImGui_Context ctx)
   * ```
   * Time elapsed since last frame, in seconds.
   */
  function ImGui_GetDeltaTime(ctx: ImGui_Context): number;

  /**
   * ```
   * boolean retval, string type, string payload, boolean is_preview, boolean is_delivery = reaper.ImGui_GetDragDropPayload(ImGui_Context ctx)
   * ```
   * Peek directly into the current payload from anywhere.
   *
   * Returns false when drag and drop is finished or inactive.
   */
  function ImGui_GetDragDropPayload(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[boolean, string, string, boolean, boolean]>;

  /**
   * ```
   * boolean retval, string filename = reaper.ImGui_GetDragDropPayloadFile(ImGui_Context ctx, integer index)
   * ```
   * Get a filename from the list of dropped files.
   *
   * Returns false if index is out of bounds.
   */
  function ImGui_GetDragDropPayloadFile(
    ctx: ImGui_Context,
    index: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * ImGui_Font _ = reaper.ImGui_GetFont(ImGui_Context ctx)
   * ```
   * Get the current font
   */
  function ImGui_GetFont(ctx: ImGui_Context): ImGui_Font;

  /**
   * ```
   * number _ = reaper.ImGui_GetFontSize(ImGui_Context ctx)
   * ```
   * Get current font size (= height in pixels) of current font with current scale
   *
   * applied.
   */
  function ImGui_GetFontSize(ctx: ImGui_Context): number;

  /**
   * ```
   * ImGui_DrawList _ = reaper.ImGui_GetForegroundDrawList(ImGui_Context ctx)
   * ```
   * This draw list will be the last rendered one. Useful to quickly draw
   *
   * shapes/text over dear imgui contents.
   */
  function ImGui_GetForegroundDrawList(ctx: ImGui_Context): ImGui_DrawList;

  /**
   * ```
   * integer _ = reaper.ImGui_GetFrameCount(ImGui_Context ctx)
   * ```
   * Get global imgui frame count. incremented by 1 every frame.
   */
  function ImGui_GetFrameCount(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetFrameHeight(ImGui_Context ctx)
   * ```
   * GetFontSize + StyleVar_FramePadding.y * 2
   */
  function ImGui_GetFrameHeight(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetFrameHeightWithSpacing(ImGui_Context ctx)
   * ```
   * GetFontSize + StyleVar_FramePadding.y * 2 + StyleVar_ItemSpacing.y
   *
   * (distance in pixels between 2 consecutive lines of framed widgets).
   */
  function ImGui_GetFrameHeightWithSpacing(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetFramerate(ImGui_Context ctx)
   * ```
   * Estimate of application framerate (rolling average over 60 frames, based on
   *
   * GetDeltaTime), in frame per second. Solely for convenience.
   */
  function ImGui_GetFramerate(ctx: ImGui_Context): number;

  /**
   * ```
   * boolean retval, integer unicode_char = reaper.ImGui_GetInputQueueCharacter(ImGui_Context ctx, integer idx)
   * ```
   * Read from ImGui's character input queue.
   *
   * Call with increasing idx until false is returned.
   */
  function ImGui_GetInputQueueCharacter(
    ctx: ImGui_Context,
    idx: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetItemRectMax(ImGui_Context ctx)
   * ```
   * Get lower-right bounding rectangle of the last item (screen space)
   */
  function ImGui_GetItemRectMax(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetItemRectMin(ImGui_Context ctx)
   * ```
   * Get upper-left bounding rectangle of the last item (screen space)
   */
  function ImGui_GetItemRectMin(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number w, number h = reaper.ImGui_GetItemRectSize(ImGui_Context ctx)
   * ```
   * Get size of last item
   */
  function ImGui_GetItemRectSize(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetKeyDownDuration(ImGui_Context ctx, integer key)
   * ```
   * Duration the keyboard key has been down (0.0 == just pressed)
   */
  function ImGui_GetKeyDownDuration(ctx: ImGui_Context, key: number): number;

  /**
   * ```
   * integer _ = reaper.ImGui_GetKeyMods(ImGui_Context ctx)
   * ```
   * Flags for the Ctrl/Shift/Alt/Super keys. Uses Mod_* values.
   */
  function ImGui_GetKeyMods(ctx: ImGui_Context): number;

  /**
   * ```
   * integer _ = reaper.ImGui_GetKeyPressedAmount(ImGui_Context ctx, integer key, number repeat_delay, number rate)
   * ```
   * Uses provided repeat rate/delay. Return a count, most often 0 or 1 but might
   *
   * be >1 if ConfigVar_RepeatRate is small enough that GetDeltaTime > RepeatRate.
   */
  function ImGui_GetKeyPressedAmount(
    ctx: ImGui_Context,
    key: number,
    repeat_delay: number,
    rate: number,
  ): number;

  /**
   * ```
   * ImGui_Viewport _ = reaper.ImGui_GetMainViewport(ImGui_Context ctx)
   * ```
   * Currently represents REAPER's main window (arrange view).
   *
   * WARNING: This may change or be removed in the future.
   */
  function ImGui_GetMainViewport(ctx: ImGui_Context): ImGui_Viewport;

  /**
   * ```
   * integer _ = reaper.ImGui_GetMouseClickedCount(ImGui_Context ctx, integer button)
   * ```
   * Return the number of successive mouse-clicks at the time where a click happen (otherwise 0).
   */
  function ImGui_GetMouseClickedCount(
    ctx: ImGui_Context,
    button: number,
  ): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetMouseClickedPos(ImGui_Context ctx, integer button)
   * ```
   */
  function ImGui_GetMouseClickedPos(
    ctx: ImGui_Context,
    button: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_GetMouseCursor(ImGui_Context ctx)
   * ```
   * Get desired mouse cursor shape, reset every frame. This is updated during the frame.
   */
  function ImGui_GetMouseCursor(ctx: ImGui_Context): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetMouseDelta(ImGui_Context ctx)
   * ```
   * Mouse delta. Note that this is zero if either current or previous position
   *
   * are invalid (-FLT_MAX,-FLT_MAX), so a disappearing/reappearing mouse won't have
   *
   * a huge delta.
   */
  function ImGui_GetMouseDelta(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetMouseDownDuration(ImGui_Context ctx, integer button)
   * ```
   * Duration the mouse button has been down (0.0 == just clicked)
   */
  function ImGui_GetMouseDownDuration(
    ctx: ImGui_Context,
    button: number,
  ): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetMouseDragDelta(ImGui_Context ctx, number x, number y, optional integer buttonIn, optional number lock_thresholdIn)
   * ```
   * Return the delta from the initial clicking position while the mouse button is
   *
   * pressed or was just released. This is locked and return 0.0 until the mouse
   *
   * moves past a distance threshold at least once (uses ConfigVar_MouseDragThreshold
   *
   * if lock_threshold < 0.0).
   */
  function ImGui_GetMouseDragDelta(
    ctx: ImGui_Context,
    x: number,
    y: number,
    buttonIn?: number,
    lock_thresholdIn?: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetMousePos(ImGui_Context ctx)
   * ```
   */
  function ImGui_GetMousePos(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetMousePosOnOpeningCurrentPopup(ImGui_Context ctx)
   * ```
   * Retrieve mouse position at the time of opening popup we have BeginPopup()
   *
   * into (helper to avoid user backing that value themselves).
   */
  function ImGui_GetMousePosOnOpeningCurrentPopup(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number vertical, number horizontal = reaper.ImGui_GetMouseWheel(ImGui_Context ctx)
   * ```
   * Vertical: 1 unit scrolls about 5 lines text. >0 scrolls Up, <0 scrolls Down.
   *
   * Hold SHIFT to turn vertical scroll into horizontal scroll
   *
   *
   *
   * Horizontal: >0 scrolls Left, <0 scrolls Right.
   *
   * Most users don't have a mouse with a horizontal wheel.
   */
  function ImGui_GetMouseWheel(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetScrollMaxX(ImGui_Context ctx)
   * ```
   * Get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x
   */
  function ImGui_GetScrollMaxX(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetScrollMaxY(ImGui_Context ctx)
   * ```
   * Get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y
   */
  function ImGui_GetScrollMaxY(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetScrollX(ImGui_Context ctx)
   * ```
   * Get scrolling amount [0 .. GetScrollMaxX()]
   */
  function ImGui_GetScrollX(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetScrollY(ImGui_Context ctx)
   * ```
   * Get scrolling amount [0 .. GetScrollMaxY()]
   */
  function ImGui_GetScrollY(ctx: ImGui_Context): number;

  /**
   * ```
   * integer _ = reaper.ImGui_GetStyleColor(ImGui_Context ctx, integer idx)
   * ```
   * Retrieve style color as stored in ImGuiStyle structure.
   *
   * Use to feed back into PushStyleColor, Otherwise use GetColor to get style color
   *
   * with style alpha baked in. See Col_* for available style colors.
   */
  function ImGui_GetStyleColor(ctx: ImGui_Context, idx: number): number;

  /**
   * ```
   * number val1, number val2 = reaper.ImGui_GetStyleVar(ImGui_Context ctx, integer var_idx)
   * ```
   */
  function ImGui_GetStyleVar(
    ctx: ImGui_Context,
    var_idx: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.ImGui_GetTextLineHeight(ImGui_Context ctx)
   * ```
   * Same as GetFontSize
   */
  function ImGui_GetTextLineHeight(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetTextLineHeightWithSpacing(ImGui_Context ctx)
   * ```
   * GetFontSize + StyleVar_ItemSpacing.y
   *
   * (distance in pixels between 2 consecutive lines of text).
   */
  function ImGui_GetTextLineHeightWithSpacing(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetTime(ImGui_Context ctx)
   * ```
   * Get global imgui time. Incremented every frame.
   */
  function ImGui_GetTime(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetTreeNodeToLabelSpacing(ImGui_Context ctx)
   * ```
   * Horizontal distance preceding label when using TreeNode*() or Bullet()
   *
   * == (GetFontSize + StyleVar_FramePadding.x*2) for a regular unframed TreeNode.
   */
  function ImGui_GetTreeNodeToLabelSpacing(ctx: ImGui_Context): number;

  /**
   * ```
   * string imgui_version, integer imgui_version_num, string reaimgui_version = reaper.ImGui_GetVersion()
   * ```
   */
  function ImGui_GetVersion(): LuaMultiReturn<[string, number, string]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetWindowContentRegionMax(ImGui_Context ctx)
   * ```
   * Content boundaries max (roughly (0,0)+Size-Scroll) where Size can be
   *
   * overridden with SetNextWindowContentSize, in window coordinates.
   */
  function ImGui_GetWindowContentRegionMax(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetWindowContentRegionMin(ImGui_Context ctx)
   * ```
   * Content boundaries min (roughly (0,0)-Scroll), in window coordinates.
   */
  function ImGui_GetWindowContentRegionMin(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_GetWindowDockID(ImGui_Context ctx)
   * ```
   */
  function ImGui_GetWindowDockID(ctx: ImGui_Context): number;

  /**
   * ```
   * number _ = reaper.ImGui_GetWindowDpiScale(ImGui_Context ctx)
   * ```
   * Get DPI scale currently associated to the current window's viewport
   *
   * (1.0 = 96 DPI).
   */
  function ImGui_GetWindowDpiScale(ctx: ImGui_Context): number;

  /**
   * ```
   * ImGui_DrawList _ = reaper.ImGui_GetWindowDrawList(ImGui_Context ctx)
   * ```
   * The draw list associated to the current window, to append your own drawing primitives
   */
  function ImGui_GetWindowDrawList(ctx: ImGui_Context): ImGui_DrawList;

  /**
   * ```
   * number _ = reaper.ImGui_GetWindowHeight(ImGui_Context ctx)
   * ```
   * Get current window height (shortcut for (GetWindowSize().h).
   */
  function ImGui_GetWindowHeight(ctx: ImGui_Context): number;

  /**
   * ```
   * number x, number y = reaper.ImGui_GetWindowPos(ImGui_Context ctx)
   * ```
   * Get current window position in screen space (note: it is unlikely you need to
   *
   * use this. Consider using current layout pos instead, GetCursorScreenPos()).
   */
  function ImGui_GetWindowPos(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number w, number h = reaper.ImGui_GetWindowSize(ImGui_Context ctx)
   * ```
   * Get current window size (note: it is unlikely you need to use this.
   *
   * Consider using GetCursorScreenPos() and e.g. GetContentRegionAvail() instead)
   */
  function ImGui_GetWindowSize(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * ImGui_Viewport _ = reaper.ImGui_GetWindowViewport(ImGui_Context ctx)
   * ```
   * Get viewport currently associated to the current window.
   */
  function ImGui_GetWindowViewport(ctx: ImGui_Context): ImGui_Viewport;

  /**
   * ```
   * number _ = reaper.ImGui_GetWindowWidth(ImGui_Context ctx)
   * ```
   * Get current window width (shortcut for (GetWindowSize().w).
   */
  function ImGui_GetWindowWidth(ctx: ImGui_Context): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenBlockedByActiveItem()
   * ```
   * Return true even if an active item is blocking access to this item/window.
   *
   *    Useful for Drag and Drop patterns.
   */
  function ImGui_HoveredFlags_AllowWhenBlockedByActiveItem(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenBlockedByPopup()
   * ```
   * Return true even if a popup window is normally blocking access to this item/window.
   */
  function ImGui_HoveredFlags_AllowWhenBlockedByPopup(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenDisabled()
   * ```
   * Return true even if the item is disabled.
   */
  function ImGui_HoveredFlags_AllowWhenDisabled(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenOverlapped()
   * ```
   * HoveredFlags_AllowWhenOverlappedByItem | HoveredFlags_AllowWhenOverlappedByWindow
   */
  function ImGui_HoveredFlags_AllowWhenOverlapped(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenOverlappedByItem()
   * ```
   * Return true even if the item uses AllowOverlap mode and is overlapped by
   *
   *    another hoverable item.
   */
  function ImGui_HoveredFlags_AllowWhenOverlappedByItem(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AllowWhenOverlappedByWindow()
   * ```
   * Return true even if the position is obstructed or overlapped by another window.
   */
  function ImGui_HoveredFlags_AllowWhenOverlappedByWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_AnyWindow()
   * ```
   * Return true if any window is hovered.
   */
  function ImGui_HoveredFlags_AnyWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_ChildWindows()
   * ```
   * Return true if any children of the window is hovered.
   */
  function ImGui_HoveredFlags_ChildWindows(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_DelayNone()
   * ```
   * Return true immediately (default). As this is the default you generally ignore this.
   */
  function ImGui_HoveredFlags_DelayNone(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_DelayNormal()
   * ```
   * Return true after ConfigVar_HoverDelayNormal elapsed (~0.40 sec)
   *
   *    (shared between items) + requires mouse to be stationary for
   *
   *    ConfigVar_HoverStationaryDelay (once per item).
   */
  function ImGui_HoveredFlags_DelayNormal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_DelayShort()
   * ```
   * Return true after ConfigVar_HoverDelayShort elapsed (~0.15 sec)
   *
   *    (shared between items) + requires mouse to be stationary for
   *
   *    ConfigVar_HoverStationaryDelay (once per item).
   */
  function ImGui_HoveredFlags_DelayShort(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_DockHierarchy()
   * ```
   * Consider docking hierarchy (treat dockspace host as
   *
   *   parent of docked window) (when used with _ChildWindows or _RootWindow).
   */
  function ImGui_HoveredFlags_DockHierarchy(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_ForTooltip()
   * ```
   * Typically used with IsItemHovered() before SetTooltip().
   *
   *    This is a shortcut to pull flags from ConfigVar_HoverFlagsForTooltip* where
   *
   *    you can reconfigure the desired behavior.
   *
   *
   *
   *    For frequently actioned or hovered items providing a tooltip, you want may to use
   *
   *    this (defaults to stationary + delay) so the tooltip doesn't show too often.
   *
   *    For items which main purpose is to be hovered, or items with low affordance,
   *
   *    or in less consistent apps, prefer no delay or shorter delay.
   */
  function ImGui_HoveredFlags_ForTooltip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_NoNavOverride()
   * ```
   * Disable using gamepad/keyboard navigation state when active, always query mouse.
   */
  function ImGui_HoveredFlags_NoNavOverride(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_NoPopupHierarchy()
   * ```
   * Do not consider popup hierarchy (do not treat popup
   *
   *   emitter as parent of popup) (when used with _ChildWindows or _RootWindow).
   */
  function ImGui_HoveredFlags_NoPopupHierarchy(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_NoSharedDelay()
   * ```
   * Disable shared delay system where moving from one item to the next keeps
   *
   *    the previous timer for a short time (standard for tooltips with long delays
   */
  function ImGui_HoveredFlags_NoSharedDelay(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_None()
   * ```
   * Return true if directly over the item/window, not obstructed by another
   *
   *    window, not obstructed by an active popup or modal blocking inputs under them.
   */
  function ImGui_HoveredFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_RectOnly()
   * ```
   * HoveredFlags_AllowWhenBlockedByPopup |
   *
   *    HoveredFlags_AllowWhenBlockedByActiveItem | HoveredFlags_AllowWhenOverlapped
   */
  function ImGui_HoveredFlags_RectOnly(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_RootAndChildWindows()
   * ```
   * HoveredFlags_RootWindow | HoveredFlags_ChildWindows
   */
  function ImGui_HoveredFlags_RootAndChildWindows(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_RootWindow()
   * ```
   * Test from root window (top most parent of the current hierarchy).
   */
  function ImGui_HoveredFlags_RootWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_HoveredFlags_Stationary()
   * ```
   * Require mouse to be stationary for ConfigVar_HoverStationaryDelay (~0.15 sec)
   *
   *    _at least one time_. After this, can move on same item/window.
   *
   *    Using the stationary test tends to reduces the need for a long delay.
   */
  function ImGui_HoveredFlags_Stationary(): number;

  /**
   * ```
   * reaper.ImGui_Image(ImGui_Context ctx, ImGui_Image image, number image_size_w, number image_size_h, optional number uv0_xIn, optional number uv0_yIn, optional number uv1_xIn, optional number uv1_yIn, optional integer tint_col_rgbaIn, optional integer border_col_rgbaIn)
   * ```
   * Adds 2.0 to the provided size if a border is visible.
   */
  function ImGui_Image(
    ctx: ImGui_Context,
    image: ImGui_Image,
    image_size_w: number,
    image_size_h: number,
    uv0_xIn?: number,
    uv0_yIn?: number,
    uv1_xIn?: number,
    uv1_yIn?: number,
    tint_col_rgbaIn?: number,
    border_col_rgbaIn?: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_ImageButton(ImGui_Context ctx, string str_id, ImGui_Image image, number image_size_w, number image_size_h, optional number uv0_xIn, optional number uv0_yIn, optional number uv1_xIn, optional number uv1_yIn, optional integer bg_col_rgbaIn, optional integer tint_col_rgbaIn)
   * ```
   * Adds StyleVar_FramePadding*2.0 to provided size.
   */
  function ImGui_ImageButton(
    ctx: ImGui_Context,
    str_id: string,
    image: ImGui_Image,
    image_size_w: number,
    image_size_h: number,
    uv0_xIn?: number,
    uv0_yIn?: number,
    uv1_xIn?: number,
    uv1_yIn?: number,
    bg_col_rgbaIn?: number,
    tint_col_rgbaIn?: number,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_ImageSet_Add(ImGui_ImageSet set, number scale, ImGui_Image image)
   * ```
   * 'img' cannot be another ImageSet.
   */
  function ImGui_ImageSet_Add(
    set: ImGui_ImageSet,
    scale: number,
    image: ImGui_Image,
  ): void;

  /**
   * ```
   * number w, number h = reaper.ImGui_Image_GetSize(ImGui_Image image)
   * ```
   */
  function ImGui_Image_GetSize(
    image: ImGui_Image,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * reaper.ImGui_Indent(ImGui_Context ctx, optional number indent_wIn)
   * ```
   * Move content position toward the right, by 'indent_w', or
   *
   * StyleVar_IndentSpacing if 'indent_w' <= 0. See Unindent.
   */
  function ImGui_Indent(ctx: ImGui_Context, indent_wIn?: number): void;

  /**
   * ```
   * boolean retval, number v = reaper.ImGui_InputDouble(ImGui_Context ctx, string label, number v, optional number stepIn, optional number step_fastIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputDouble(
    ctx: ImGui_Context,
    label: string,
    v: number,
    stepIn?: number,
    step_fastIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2 = reaper.ImGui_InputDouble2(ImGui_Context ctx, string label, number v1, number v2, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputDouble2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3 = reaper.ImGui_InputDouble3(ImGui_Context ctx, string label, number v1, number v2, number v3, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputDouble3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3, number v4 = reaper.ImGui_InputDouble4(ImGui_Context ctx, string label, number v1, number v2, number v3, number v4, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputDouble4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_InputDoubleN(ImGui_Context ctx, string label, reaper_array values, optional number stepIn, optional number step_fastIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputDoubleN(
    ctx: ImGui_Context,
    label: string,
    values: reaper_array,
    stepIn?: number,
    step_fastIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_None()
   * ```
   */
  function ImGui_InputFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_Repeat()
   * ```
   * Enable repeat. Return true on successive repeats.
   */
  function ImGui_InputFlags_Repeat(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteActive()
   * ```
   * Route to active item only.
   */
  function ImGui_InputFlags_RouteActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteAlways()
   * ```
   * Do not register route, poll keys directly.
   */
  function ImGui_InputFlags_RouteAlways(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteFocused()
   * ```
   * Route to windows in the focus stack. Deep-most focused window takes inputs.
   *
   *    Active item takes inputs over deep-most focused window.
   */
  function ImGui_InputFlags_RouteFocused(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteFromRootWindow()
   * ```
   * Option: route evaluated from the point of view of root window rather than current window.
   */
  function ImGui_InputFlags_RouteFromRootWindow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteGlobal()
   * ```
   * Global route (unless a focused window or active item registered the route).
   */
  function ImGui_InputFlags_RouteGlobal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteOverActive()
   * ```
   * Global route: higher priority than active item. Unlikely you need to
   *
   *    use that: will interfere with every active items, e.g. Ctrl+A registered by
   *
   *    InputText will be overridden by this. May not be fully honored as user/internal
   *
   *    code is likely to always assume they can access keys when active.
   */
  function ImGui_InputFlags_RouteOverActive(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteOverFocused()
   * ```
   * Global route: higher priority than focused route
   *
   *    (unless active item in focused route).
   */
  function ImGui_InputFlags_RouteOverFocused(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_RouteUnlessBgFocused()
   * ```
   * Option: global route: will not be applied if underlying background/void is
   *
   *    focused (== no Dear ImGui windows are focused). Useful for overlay applications.
   */
  function ImGui_InputFlags_RouteUnlessBgFocused(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputFlags_Tooltip()
   * ```
   * Automatically display a tooltip when hovering item
   */
  function ImGui_InputFlags_Tooltip(): number;

  /**
   * ```
   * boolean retval, integer v = reaper.ImGui_InputInt(ImGui_Context ctx, string label, integer v, optional integer stepIn, optional integer step_fastIn, optional integer flagsIn)
   * ```
   */
  function ImGui_InputInt(
    ctx: ImGui_Context,
    label: string,
    v: number,
    stepIn?: number,
    step_fastIn?: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2 = reaper.ImGui_InputInt2(ImGui_Context ctx, string label, integer v1, integer v2, optional integer flagsIn)
   * ```
   */
  function ImGui_InputInt2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3 = reaper.ImGui_InputInt3(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, optional integer flagsIn)
   * ```
   */
  function ImGui_InputInt3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3, integer v4 = reaper.ImGui_InputInt4(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, integer v4, optional integer flagsIn)
   * ```
   */
  function ImGui_InputInt4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean retval, string buf = reaper.ImGui_InputText(ImGui_Context ctx, string label, string buf, integer flagsIn, ImGui_Function callbackIn)
   * ```
   */
  function ImGui_InputText(
    ctx: ImGui_Context,
    label: string,
    buf: string,
    flagsIn: number,
    callbackIn: ImGui_Function,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_AllowTabInput()
   * ```
   * Pressing TAB input a '\t' character into the text field.
   */
  function ImGui_InputTextFlags_AllowTabInput(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_AlwaysOverwrite()
   * ```
   * Overwrite mode.
   */
  function ImGui_InputTextFlags_AlwaysOverwrite(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_AutoSelectAll()
   * ```
   * Select entire text when first taking mouse focus.
   */
  function ImGui_InputTextFlags_AutoSelectAll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CallbackAlways()
   * ```
   * Callback on each iteration. User code may query cursor position, modify text buffer.
   */
  function ImGui_InputTextFlags_CallbackAlways(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CallbackCharFilter()
   * ```
   * Callback on character inputs to replace or discard them.
   *
   *    Modify 'EventChar' to replace or 'EventChar = 0' to discard.
   */
  function ImGui_InputTextFlags_CallbackCharFilter(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CallbackCompletion()
   * ```
   * Callback on pressing TAB (for completion handling).
   */
  function ImGui_InputTextFlags_CallbackCompletion(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CallbackEdit()
   * ```
   * Callback on any edit (note that InputText() already returns true on edit,
   *
   *    the callback is useful mainly to manipulate the underlying buffer while
   *
   *    focus is active).
   */
  function ImGui_InputTextFlags_CallbackEdit(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CallbackHistory()
   * ```
   * Callback on pressing Up/Down arrows (for history handling).
   */
  function ImGui_InputTextFlags_CallbackHistory(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CharsDecimal()
   * ```
   * Allow 0123456789.+-* /.
   */
  function ImGui_InputTextFlags_CharsDecimal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CharsHexadecimal()
   * ```
   * Allow 0123456789ABCDEFabcdef.
   */
  function ImGui_InputTextFlags_CharsHexadecimal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CharsNoBlank()
   * ```
   * Filter out spaces, tabs.
   */
  function ImGui_InputTextFlags_CharsNoBlank(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CharsScientific()
   * ```
   * Allow 0123456789.+-* /eE (Scientific notation input).
   */
  function ImGui_InputTextFlags_CharsScientific(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CharsUppercase()
   * ```
   * Turn a..z into A..Z.
   */
  function ImGui_InputTextFlags_CharsUppercase(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_CtrlEnterForNewLine()
   * ```
   * In multi-line mode, unfocus with Enter, add new line with Ctrl+Enter
   *
   *    (default is opposite: unfocus with Ctrl+Enter, add line with Enter).
   */
  function ImGui_InputTextFlags_CtrlEnterForNewLine(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_DisplayEmptyRefVal()
   * ```
   * InputDouble(), InputInt() etc. only: when value is zero, do not display it.
   *
   *    Generally used with InputTextFlags_ParseEmptyRefVal.
   */
  function ImGui_InputTextFlags_DisplayEmptyRefVal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_EnterReturnsTrue()
   * ```
   * Return 'true' when Enter is pressed (as opposed to every time the value was
   *
   *    modified). Consider looking at the IsItemDeactivatedAfterEdit function.
   */
  function ImGui_InputTextFlags_EnterReturnsTrue(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_EscapeClearsAll()
   * ```
   * Escape key clears content if not empty, and deactivate otherwise
   *
   *    (constrast to default behavior of Escape to revert).
   */
  function ImGui_InputTextFlags_EscapeClearsAll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_NoHorizontalScroll()
   * ```
   * Disable following the cursor horizontally.
   */
  function ImGui_InputTextFlags_NoHorizontalScroll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_NoUndoRedo()
   * ```
   * Disable undo/redo. Note that input text owns the text data while active.
   */
  function ImGui_InputTextFlags_NoUndoRedo(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_None()
   * ```
   */
  function ImGui_InputTextFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_ParseEmptyRefVal()
   * ```
   * InputDouble(), InputInt() etc. only: parse empty string as zero value.
   */
  function ImGui_InputTextFlags_ParseEmptyRefVal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_Password()
   * ```
   * Password mode, display all characters as '*'.
   */
  function ImGui_InputTextFlags_Password(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_InputTextFlags_ReadOnly()
   * ```
   * Read-only mode.
   */
  function ImGui_InputTextFlags_ReadOnly(): number;

  /**
   * ```
   * boolean retval, string buf = reaper.ImGui_InputTextMultiline(ImGui_Context ctx, string label, string buf, number size_wIn, number size_hIn, integer flagsIn, ImGui_Function callbackIn)
   * ```
   */
  function ImGui_InputTextMultiline(
    ctx: ImGui_Context,
    label: string,
    buf: string,
    size_wIn: number,
    size_hIn: number,
    flagsIn: number,
    callbackIn: ImGui_Function,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean retval, string buf = reaper.ImGui_InputTextWithHint(ImGui_Context ctx, string label, string hint, string buf, integer flagsIn, ImGui_Function callbackIn)
   * ```
   */
  function ImGui_InputTextWithHint(
    ctx: ImGui_Context,
    label: string,
    hint: string,
    buf: string,
    flagsIn: number,
    callbackIn: ImGui_Function,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_InvisibleButton(ImGui_Context ctx, string str_id, number size_w, number size_h, optional integer flagsIn)
   * ```
   * Flexible button behavior without the visuals, frequently useful to build
   *
   * custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.).
   */
  function ImGui_InvisibleButton(
    ctx: ImGui_Context,
    str_id: string,
    size_w: number,
    size_h: number,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsAnyItemActive(ImGui_Context ctx)
   * ```
   */
  function ImGui_IsAnyItemActive(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsAnyItemFocused(ImGui_Context ctx)
   * ```
   */
  function ImGui_IsAnyItemFocused(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsAnyItemHovered(ImGui_Context ctx)
   * ```
   */
  function ImGui_IsAnyItemHovered(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsAnyMouseDown(ImGui_Context ctx)
   * ```
   * Is any mouse button held?
   */
  function ImGui_IsAnyMouseDown(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemActivated(ImGui_Context ctx)
   * ```
   * Was the last item just made active (item was previously inactive).
   */
  function ImGui_IsItemActivated(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemActive(ImGui_Context ctx)
   * ```
   * Is the last item active? (e.g. button being held, text field being edited.
   *
   * This will continuously return true while holding mouse button on an item.
   *
   * Items that don't interact will always return false.
   */
  function ImGui_IsItemActive(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemClicked(ImGui_Context ctx, optional integer mouse_buttonIn)
   * ```
   * Is the last item clicked? (e.g. button/node just clicked on)
   *
   * == IsMouseClicked(mouse_button) && IsItemHovered().
   *
   *
   *
   * This is NOT equivalent to the behavior of e.g. Button.
   *
   * Most widgets have specific reactions based on mouse-up/down state, mouse position etc.
   */
  function ImGui_IsItemClicked(
    ctx: ImGui_Context,
    mouse_buttonIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemDeactivated(ImGui_Context ctx)
   * ```
   * Was the last item just made inactive (item was previously active).
   *
   * Useful for Undo/Redo patterns with widgets that require continuous editing.
   */
  function ImGui_IsItemDeactivated(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemDeactivatedAfterEdit(ImGui_Context ctx)
   * ```
   * Was the last item just made inactive and made a value change when it was
   *
   * active? (e.g. Slider/Drag moved).
   *
   *
   *
   * Useful for Undo/Redo patterns with widgets that require continuous editing. Note
   *
   * that you may get false positives (some widgets such as Combo/ListBox/Selectable
   *
   * will return true even when clicking an already selected item).
   */
  function ImGui_IsItemDeactivatedAfterEdit(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemEdited(ImGui_Context ctx)
   * ```
   * Did the last item modify its underlying value this frame? or was pressed?
   *
   * This is generally the same as the "bool" return value of many widgets.
   */
  function ImGui_IsItemEdited(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemFocused(ImGui_Context ctx)
   * ```
   * Is the last item focused for keyboard/gamepad navigation?
   */
  function ImGui_IsItemFocused(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemHovered(ImGui_Context ctx, optional integer flagsIn)
   * ```
   * Is the last item hovered? (and usable, aka not blocked by a popup, etc.).
   *
   * See HoveredFlags_* for more options.
   */
  function ImGui_IsItemHovered(ctx: ImGui_Context, flagsIn?: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemToggledOpen(ImGui_Context ctx)
   * ```
   * Was the last item open state toggled? Set by TreeNode.
   */
  function ImGui_IsItemToggledOpen(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsItemVisible(ImGui_Context ctx)
   * ```
   * Is the last item visible? (items may be out of sight because of clipping/scrolling)
   */
  function ImGui_IsItemVisible(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsKeyChordPressed(ImGui_Context ctx, integer key_chord)
   * ```
   * Was key chord (mods + key) pressed? You can pass e.g. `Mod_Ctrl | Key_S`
   *
   * as a key chord. This doesn't do any routing or focus check, consider using the
   *
   * Shortcut function instead.
   */
  function ImGui_IsKeyChordPressed(
    ctx: ImGui_Context,
    key_chord: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsKeyDown(ImGui_Context ctx, integer key)
   * ```
   * Is key being held.
   */
  function ImGui_IsKeyDown(ctx: ImGui_Context, key: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsKeyPressed(ImGui_Context ctx, integer key, optional boolean repeatIn)
   * ```
   * Was key pressed (went from !Down to Down)?
   *
   * If repeat=true, uses ConfigVar_KeyRepeatDelay / ConfigVar_KeyRepeatRate.
   */
  function ImGui_IsKeyPressed(
    ctx: ImGui_Context,
    key: number,
    repeatIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsKeyReleased(ImGui_Context ctx, integer key)
   * ```
   * Was key released (went from Down to !Down)?
   */
  function ImGui_IsKeyReleased(ctx: ImGui_Context, key: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseClicked(ImGui_Context ctx, integer button, optional boolean repeatIn)
   * ```
   * Did mouse button clicked? (went from !Down to Down).
   *
   * Same as GetMouseClickedCount() == 1.
   */
  function ImGui_IsMouseClicked(
    ctx: ImGui_Context,
    button: number,
    repeatIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseDoubleClicked(ImGui_Context ctx, integer button)
   * ```
   * Did mouse button double-clicked? Same as GetMouseClickedCount() == 2.
   *
   * (Note that a double-click will also report IsMouseClicked() == true)
   */
  function ImGui_IsMouseDoubleClicked(
    ctx: ImGui_Context,
    button: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseDown(ImGui_Context ctx, integer button)
   * ```
   * Is mouse button held?
   */
  function ImGui_IsMouseDown(ctx: ImGui_Context, button: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseDragging(ImGui_Context ctx, integer button, optional number lock_thresholdIn)
   * ```
   * Is mouse dragging? (uses ConfigVar_MouseDragThreshold if lock_threshold < 0.0)
   */
  function ImGui_IsMouseDragging(
    ctx: ImGui_Context,
    button: number,
    lock_thresholdIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseHoveringRect(ImGui_Context ctx, number r_min_x, number r_min_y, number r_max_x, number r_max_y, optional boolean clipIn)
   * ```
   * Is mouse hovering given bounding rect (in screen space).
   *
   * Clipped by current clipping settings, but disregarding of other consideration
   *
   * of focus/window ordering/popup-block.
   */
  function ImGui_IsMouseHoveringRect(
    ctx: ImGui_Context,
    r_min_x: number,
    r_min_y: number,
    r_max_x: number,
    r_max_y: number,
    clipIn?: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMousePosValid(ImGui_Context ctx, optional number mouse_pos_xIn, optional number mouse_pos_yIn)
   * ```
   */
  function ImGui_IsMousePosValid(
    ctx: ImGui_Context,
    mouse_pos_xIn?: number,
    mouse_pos_yIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsMouseReleased(ImGui_Context ctx, integer button)
   * ```
   * Did mouse button released? (went from Down to !Down)
   */
  function ImGui_IsMouseReleased(ctx: ImGui_Context, button: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsPopupOpen(ImGui_Context ctx, string str_id, optional integer flagsIn)
   * ```
   * Return true if the popup is open at the current BeginPopup level of the
   *
   * popup stack.
   *
   *
   *
   * - With PopupFlags_AnyPopupId: return true if any popup is open at the current
   *
   *   BeginPopup() level of the popup stack.
   *
   * - With PopupFlags_AnyPopupId + PopupFlags_AnyPopupLevel: return true if any
   *
   *   popup is open.
   */
  function ImGui_IsPopupOpen(
    ctx: ImGui_Context,
    str_id: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsRectVisible(ImGui_Context ctx, number size_w, number size_h)
   * ```
   * Test if rectangle (of given size, starting from cursor position) is
   *
   * visible / not clipped.
   */
  function ImGui_IsRectVisible(
    ctx: ImGui_Context,
    size_w: number,
    size_h: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsRectVisibleEx(ImGui_Context ctx, number rect_min_x, number rect_min_y, number rect_max_x, number rect_max_y)
   * ```
   * Test if rectangle (in screen space) is visible / not clipped. to perform
   *
   * coarse clipping on user's side.
   */
  function ImGui_IsRectVisibleEx(
    ctx: ImGui_Context,
    rect_min_x: number,
    rect_min_y: number,
    rect_max_x: number,
    rect_max_y: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsWindowAppearing(ImGui_Context ctx)
   * ```
   * Use after Begin/BeginPopup/BeginPopupModal to tell if a window just opened.
   */
  function ImGui_IsWindowAppearing(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsWindowDocked(ImGui_Context ctx)
   * ```
   * Is current window docked into another window or a REAPER docker?
   */
  function ImGui_IsWindowDocked(ctx: ImGui_Context): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsWindowFocused(ImGui_Context ctx, optional integer flagsIn)
   * ```
   * Is current window focused? or its root/child, depending on flags.
   *
   * See flags for options.
   */
  function ImGui_IsWindowFocused(ctx: ImGui_Context, flagsIn?: number): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_IsWindowHovered(ImGui_Context ctx, optional integer flagsIn)
   * ```
   * Is current window hovered and hoverable (e.g. not blocked by a popup/modal)?
   *
   * See HoveredFlags_* for options.
   */
  function ImGui_IsWindowHovered(ctx: ImGui_Context, flagsIn?: number): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_0()
   * ```
   */
  function ImGui_Key_0(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_1()
   * ```
   */
  function ImGui_Key_1(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_2()
   * ```
   */
  function ImGui_Key_2(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_3()
   * ```
   */
  function ImGui_Key_3(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_4()
   * ```
   */
  function ImGui_Key_4(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_5()
   * ```
   */
  function ImGui_Key_5(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_6()
   * ```
   */
  function ImGui_Key_6(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_7()
   * ```
   */
  function ImGui_Key_7(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_8()
   * ```
   */
  function ImGui_Key_8(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_9()
   * ```
   */
  function ImGui_Key_9(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_A()
   * ```
   */
  function ImGui_Key_A(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Apostrophe()
   * ```
   * '
   */
  function ImGui_Key_Apostrophe(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_AppBack()
   * ```
   * Available on some keyboard/mouses. Often referred as "Browser Back".
   */
  function ImGui_Key_AppBack(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_AppForward()
   * ```
   */
  function ImGui_Key_AppForward(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_B()
   * ```
   */
  function ImGui_Key_B(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Backslash()
   * ```
   * \
   */
  function ImGui_Key_Backslash(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Backspace()
   * ```
   */
  function ImGui_Key_Backspace(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_C()
   * ```
   */
  function ImGui_Key_C(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_CapsLock()
   * ```
   */
  function ImGui_Key_CapsLock(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Comma()
   * ```
   * ,
   */
  function ImGui_Key_Comma(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_D()
   * ```
   */
  function ImGui_Key_D(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Delete()
   * ```
   */
  function ImGui_Key_Delete(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_DownArrow()
   * ```
   */
  function ImGui_Key_DownArrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_E()
   * ```
   */
  function ImGui_Key_E(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_End()
   * ```
   */
  function ImGui_Key_End(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Enter()
   * ```
   */
  function ImGui_Key_Enter(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Equal()
   * ```
   * =
   */
  function ImGui_Key_Equal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Escape()
   * ```
   */
  function ImGui_Key_Escape(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F()
   * ```
   */
  function ImGui_Key_F(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F1()
   * ```
   */
  function ImGui_Key_F1(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F10()
   * ```
   */
  function ImGui_Key_F10(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F11()
   * ```
   */
  function ImGui_Key_F11(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F12()
   * ```
   */
  function ImGui_Key_F12(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F13()
   * ```
   */
  function ImGui_Key_F13(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F14()
   * ```
   */
  function ImGui_Key_F14(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F15()
   * ```
   */
  function ImGui_Key_F15(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F16()
   * ```
   */
  function ImGui_Key_F16(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F17()
   * ```
   */
  function ImGui_Key_F17(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F18()
   * ```
   */
  function ImGui_Key_F18(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F19()
   * ```
   */
  function ImGui_Key_F19(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F2()
   * ```
   */
  function ImGui_Key_F2(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F20()
   * ```
   */
  function ImGui_Key_F20(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F21()
   * ```
   */
  function ImGui_Key_F21(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F22()
   * ```
   */
  function ImGui_Key_F22(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F23()
   * ```
   */
  function ImGui_Key_F23(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F24()
   * ```
   */
  function ImGui_Key_F24(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F3()
   * ```
   */
  function ImGui_Key_F3(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F4()
   * ```
   */
  function ImGui_Key_F4(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F5()
   * ```
   */
  function ImGui_Key_F5(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F6()
   * ```
   */
  function ImGui_Key_F6(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F7()
   * ```
   */
  function ImGui_Key_F7(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F8()
   * ```
   */
  function ImGui_Key_F8(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_F9()
   * ```
   */
  function ImGui_Key_F9(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_G()
   * ```
   */
  function ImGui_Key_G(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_GraveAccent()
   * ```
   * `
   */
  function ImGui_Key_GraveAccent(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_H()
   * ```
   */
  function ImGui_Key_H(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Home()
   * ```
   */
  function ImGui_Key_Home(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_I()
   * ```
   */
  function ImGui_Key_I(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Insert()
   * ```
   */
  function ImGui_Key_Insert(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_J()
   * ```
   */
  function ImGui_Key_J(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_K()
   * ```
   */
  function ImGui_Key_K(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad0()
   * ```
   */
  function ImGui_Key_Keypad0(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad1()
   * ```
   */
  function ImGui_Key_Keypad1(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad2()
   * ```
   */
  function ImGui_Key_Keypad2(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad3()
   * ```
   */
  function ImGui_Key_Keypad3(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad4()
   * ```
   */
  function ImGui_Key_Keypad4(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad5()
   * ```
   */
  function ImGui_Key_Keypad5(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad6()
   * ```
   */
  function ImGui_Key_Keypad6(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad7()
   * ```
   */
  function ImGui_Key_Keypad7(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad8()
   * ```
   */
  function ImGui_Key_Keypad8(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Keypad9()
   * ```
   */
  function ImGui_Key_Keypad9(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadAdd()
   * ```
   */
  function ImGui_Key_KeypadAdd(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadDecimal()
   * ```
   */
  function ImGui_Key_KeypadDecimal(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadDivide()
   * ```
   */
  function ImGui_Key_KeypadDivide(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadEnter()
   * ```
   */
  function ImGui_Key_KeypadEnter(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadEqual()
   * ```
   */
  function ImGui_Key_KeypadEqual(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadMultiply()
   * ```
   */
  function ImGui_Key_KeypadMultiply(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_KeypadSubtract()
   * ```
   */
  function ImGui_Key_KeypadSubtract(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_L()
   * ```
   */
  function ImGui_Key_L(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftAlt()
   * ```
   */
  function ImGui_Key_LeftAlt(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftArrow()
   * ```
   */
  function ImGui_Key_LeftArrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftBracket()
   * ```
   * [
   */
  function ImGui_Key_LeftBracket(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftCtrl()
   * ```
   */
  function ImGui_Key_LeftCtrl(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftShift()
   * ```
   */
  function ImGui_Key_LeftShift(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_LeftSuper()
   * ```
   */
  function ImGui_Key_LeftSuper(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_M()
   * ```
   */
  function ImGui_Key_M(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Menu()
   * ```
   */
  function ImGui_Key_Menu(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Minus()
   * ```
   * -
   */
  function ImGui_Key_Minus(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseLeft()
   * ```
   */
  function ImGui_Key_MouseLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseMiddle()
   * ```
   */
  function ImGui_Key_MouseMiddle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseRight()
   * ```
   */
  function ImGui_Key_MouseRight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseWheelX()
   * ```
   */
  function ImGui_Key_MouseWheelX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseWheelY()
   * ```
   */
  function ImGui_Key_MouseWheelY(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseX1()
   * ```
   */
  function ImGui_Key_MouseX1(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_MouseX2()
   * ```
   */
  function ImGui_Key_MouseX2(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_N()
   * ```
   */
  function ImGui_Key_N(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_NumLock()
   * ```
   */
  function ImGui_Key_NumLock(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_O()
   * ```
   */
  function ImGui_Key_O(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_P()
   * ```
   */
  function ImGui_Key_P(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_PageDown()
   * ```
   */
  function ImGui_Key_PageDown(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_PageUp()
   * ```
   */
  function ImGui_Key_PageUp(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Pause()
   * ```
   */
  function ImGui_Key_Pause(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Period()
   * ```
   * .
   */
  function ImGui_Key_Period(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_PrintScreen()
   * ```
   */
  function ImGui_Key_PrintScreen(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Q()
   * ```
   */
  function ImGui_Key_Q(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_R()
   * ```
   */
  function ImGui_Key_R(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightAlt()
   * ```
   */
  function ImGui_Key_RightAlt(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightArrow()
   * ```
   */
  function ImGui_Key_RightArrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightBracket()
   * ```
   * ]
   */
  function ImGui_Key_RightBracket(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightCtrl()
   * ```
   */
  function ImGui_Key_RightCtrl(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightShift()
   * ```
   */
  function ImGui_Key_RightShift(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_RightSuper()
   * ```
   */
  function ImGui_Key_RightSuper(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_S()
   * ```
   */
  function ImGui_Key_S(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_ScrollLock()
   * ```
   */
  function ImGui_Key_ScrollLock(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Semicolon()
   * ```
   * ;
   */
  function ImGui_Key_Semicolon(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Slash()
   * ```
   * /
   */
  function ImGui_Key_Slash(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Space()
   * ```
   */
  function ImGui_Key_Space(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_T()
   * ```
   */
  function ImGui_Key_T(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Tab()
   * ```
   */
  function ImGui_Key_Tab(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_U()
   * ```
   */
  function ImGui_Key_U(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_UpArrow()
   * ```
   */
  function ImGui_Key_UpArrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_V()
   * ```
   */
  function ImGui_Key_V(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_W()
   * ```
   */
  function ImGui_Key_W(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_X()
   * ```
   */
  function ImGui_Key_X(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Y()
   * ```
   */
  function ImGui_Key_Y(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Key_Z()
   * ```
   */
  function ImGui_Key_Z(): number;

  /**
   * ```
   * reaper.ImGui_LabelText(ImGui_Context ctx, string label, string text)
   * ```
   * Display text+label aligned the same way as value+label widgets
   */
  function ImGui_LabelText(
    ctx: ImGui_Context,
    label: string,
    text: string,
  ): void;

  /**
   * ```
   * boolean retval, integer current_item = reaper.ImGui_ListBox(ImGui_Context ctx, string label, integer current_item, string items, optional integer height_in_itemsIn)
   * ```
   * This is an helper over BeginListBox/EndListBox for convenience purpose.
   *
   *
   *
   * Each item must be null-terminated (requires REAPER v6.44 or newer for EEL and Lua).
   */
  function ImGui_ListBox(
    ctx: ImGui_Context,
    label: string,
    current_item: number,
    items: string,
    height_in_itemsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * reaper.ImGui_ListClipper_Begin(ImGui_ListClipper clipper, integer items_count, optional number items_heightIn)
   * ```
   * - items_count: Use INT_MAX if you don't know how many items you have
   *
   * (in which case the cursor won't be advanced in the final step)
   *
   * - items_height: Use -1.0 to be calculated automatically on first step.
   *
   *   Otherwise pass in the distance between your items, typically
   *
   *   GetTextLineHeightWithSpacing or GetFrameHeightWithSpacing.
   */
  function ImGui_ListClipper_Begin(
    clipper: ImGui_ListClipper,
    items_count: number,
    items_heightIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_ListClipper_End(ImGui_ListClipper clipper)
   * ```
   * Automatically called on the last call of ListClipper_Step that returns false.
   */
  function ImGui_ListClipper_End(clipper: ImGui_ListClipper): void;

  /**
   * ```
   * integer display_start, integer display_end = reaper.ImGui_ListClipper_GetDisplayRange(ImGui_ListClipper clipper)
   * ```
   */
  function ImGui_ListClipper_GetDisplayRange(
    clipper: ImGui_ListClipper,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * reaper.ImGui_ListClipper_IncludeItemByIndex(ImGui_ListClipper clipper, integer item_index)
   * ```
   * Call ListClipper_IncludeItemByIndex or ListClipper_IncludeItemsByIndex before
   *
   * the first call to ListClipper_Step if you need a range of items to be displayed
   *
   * regardless of visibility.
   *
   *
   *
   * (Due to alignment / padding of certain items it is possible that an extra item
   *
   * may be included on either end of the display range).
   */
  function ImGui_ListClipper_IncludeItemByIndex(
    clipper: ImGui_ListClipper,
    item_index: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_ListClipper_IncludeItemsByIndex(ImGui_ListClipper clipper, integer item_begin, integer item_end)
   * ```
   * See ListClipper_IncludeItemByIndex.
   *
   *
   *
   * item_end is exclusive e.g. use (42, 42+1) to make item 42 never clipped.
   */
  function ImGui_ListClipper_IncludeItemsByIndex(
    clipper: ImGui_ListClipper,
    item_begin: number,
    item_end: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_ListClipper_Step(ImGui_ListClipper clipper)
   * ```
   * Call until it returns false. The display_start/display_end fields from
   *
   * ListClipper_GetDisplayRange will be set and you can process/draw those items.
   */
  function ImGui_ListClipper_Step(clipper: ImGui_ListClipper): boolean;

  /**
   * ```
   * reaper.ImGui_LogFinish(ImGui_Context ctx)
   * ```
   * Stop logging (close file, etc.)
   */
  function ImGui_LogFinish(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_LogText(ImGui_Context ctx, string text)
   * ```
   * Pass text data straight to log (without being displayed)
   */
  function ImGui_LogText(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_LogToClipboard(ImGui_Context ctx, optional integer auto_open_depthIn)
   * ```
   * Start logging all text output from the interface to the OS clipboard.
   *
   * See also SetClipboardText.
   */
  function ImGui_LogToClipboard(
    ctx: ImGui_Context,
    auto_open_depthIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_LogToFile(ImGui_Context ctx, optional integer auto_open_depthIn, optional string filenameIn)
   * ```
   * Start logging all text output from the interface to a file.
   *
   * The data is saved to $resource_path/imgui_log.txt if filename is nil.
   */
  function ImGui_LogToFile(
    ctx: ImGui_Context,
    auto_open_depthIn?: number,
    filenameIn?: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_LogToTTY(ImGui_Context ctx, optional integer auto_open_depthIn)
   * ```
   * Start logging all text output from the interface to the TTY (stdout).
   */
  function ImGui_LogToTTY(ctx: ImGui_Context, auto_open_depthIn?: number): void;

  /**
   * ```
   * boolean retval, optional boolean p_selected = reaper.ImGui_MenuItem(ImGui_Context ctx, string label, optional string shortcutIn, optional boolean p_selected, optional boolean enabledIn)
   * ```
   * Return true when activated. Shortcuts are displayed for convenience but not
   *
   * processed by ImGui at the moment. Toggle state is written to 'selected' when
   *
   * provided.
   */
  function ImGui_MenuItem(
    ctx: ImGui_Context,
    label: string,
    shortcutIn?: string,
    p_selected?: boolean,
    enabledIn?: boolean,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * integer _ = reaper.ImGui_Mod_Alt()
   * ```
   */
  function ImGui_Mod_Alt(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Mod_Ctrl()
   * ```
   * Cmd when ConfigVar_MacOSXBehaviors is enabled.
   */
  function ImGui_Mod_Ctrl(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Mod_None()
   * ```
   */
  function ImGui_Mod_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Mod_Shift()
   * ```
   */
  function ImGui_Mod_Shift(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_Mod_Super()
   * ```
   * Ctrl when ConfigVar_MacOSXBehaviors is enabled.
   */
  function ImGui_Mod_Super(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseButton_Left()
   * ```
   */
  function ImGui_MouseButton_Left(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseButton_Middle()
   * ```
   */
  function ImGui_MouseButton_Middle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseButton_Right()
   * ```
   */
  function ImGui_MouseButton_Right(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_Arrow()
   * ```
   */
  function ImGui_MouseCursor_Arrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_Hand()
   * ```
   * (Unused by Dear ImGui functions. Use for e.g. hyperlinks)
   */
  function ImGui_MouseCursor_Hand(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_None()
   * ```
   */
  function ImGui_MouseCursor_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_NotAllowed()
   * ```
   * When hovering something with disallowed interaction. Usually a crossed circle.
   */
  function ImGui_MouseCursor_NotAllowed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_ResizeAll()
   * ```
   * (Unused by Dear ImGui functions)
   */
  function ImGui_MouseCursor_ResizeAll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_ResizeEW()
   * ```
   * When hovering over a vertical border or a column.
   */
  function ImGui_MouseCursor_ResizeEW(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_ResizeNESW()
   * ```
   * When hovering over the bottom-left corner of a window.
   */
  function ImGui_MouseCursor_ResizeNESW(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_ResizeNS()
   * ```
   * When hovering over a horizontal border.
   */
  function ImGui_MouseCursor_ResizeNS(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_ResizeNWSE()
   * ```
   * When hovering over the bottom-right corner of a window.
   */
  function ImGui_MouseCursor_ResizeNWSE(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_MouseCursor_TextInput()
   * ```
   * When hovering over InputText, etc.
   */
  function ImGui_MouseCursor_TextInput(): number;

  /**
   * ```
   * reaper.ImGui_NewLine(ImGui_Context ctx)
   * ```
   * Undo a SameLine() or force a new line when in a horizontal-layout context.
   */
  function ImGui_NewLine(ctx: ImGui_Context): void;

  /**
   * ```
   * number min, number max = reaper.ImGui_NumericLimits_Double()
   * ```
   * Returns DBL_MIN and DBL_MAX for this system.
   */
  function ImGui_NumericLimits_Double(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number min, number max = reaper.ImGui_NumericLimits_Float()
   * ```
   * Returns FLT_MIN and FLT_MAX for this system.
   */
  function ImGui_NumericLimits_Float(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer min, integer max = reaper.ImGui_NumericLimits_Int()
   * ```
   * Returns INT_MIN and INT_MAX for this system.
   */
  function ImGui_NumericLimits_Int(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * reaper.ImGui_OpenPopup(ImGui_Context ctx, string str_id, optional integer popup_flagsIn)
   * ```
   * Set popup state to open (don't call every frame!).
   *
   * ImGuiPopupFlags are available for opening options.
   *
   *
   *
   * If not modal: they can be closed by clicking anywhere outside them, or by
   *
   * pressing ESCAPE.
   *
   *
   *
   * Use PopupFlags_NoOpenOverExistingPopup to avoid opening a popup if there's
   *
   * already one at the same level.
   */
  function ImGui_OpenPopup(
    ctx: ImGui_Context,
    str_id: string,
    popup_flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_OpenPopupOnItemClick(ImGui_Context ctx, optional string str_idIn, optional integer popup_flagsIn)
   * ```
   * Helper to open popup when clicked on last item. return true when just opened.
   *
   * (Note: actually triggers on the mouse _released_ event to be consistent with
   *
   * popup behaviors.)
   */
  function ImGui_OpenPopupOnItemClick(
    ctx: ImGui_Context,
    str_idIn?: string,
    popup_flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_PlotHistogram(ImGui_Context ctx, string label, reaper_array values, optional integer values_offsetIn, optional string overlay_textIn, optional number scale_minIn, optional number scale_maxIn, optional number graph_size_wIn, optional number graph_size_hIn)
   * ```
   */
  function ImGui_PlotHistogram(
    ctx: ImGui_Context,
    label: string,
    values: reaper_array,
    values_offsetIn?: number,
    overlay_textIn?: string,
    scale_minIn?: number,
    scale_maxIn?: number,
    graph_size_wIn?: number,
    graph_size_hIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_PlotLines(ImGui_Context ctx, string label, reaper_array values, optional integer values_offsetIn, optional string overlay_textIn, optional number scale_minIn, optional number scale_maxIn, optional number graph_size_wIn, optional number graph_size_hIn)
   * ```
   */
  function ImGui_PlotLines(
    ctx: ImGui_Context,
    label: string,
    values: reaper_array,
    values_offsetIn?: number,
    overlay_textIn?: string,
    scale_minIn?: number,
    scale_maxIn?: number,
    graph_size_wIn?: number,
    graph_size_hIn?: number,
  ): void;

  /**
   * ```
   * number x, number y = reaper.ImGui_PointConvertNative(ImGui_Context ctx, number x, number y, optional boolean to_nativeIn)
   * ```
   * Convert a position from the current platform's native coordinate position
   *
   * system to ReaImGui global coordinates (or vice versa).
   *
   *
   *
   * This effectively flips the Y coordinate on macOS and applies HiDPI scaling on
   *
   * Windows and Linux.
   */
  function ImGui_PointConvertNative(
    ctx: ImGui_Context,
    x: number,
    y: number,
    to_nativeIn?: boolean,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * reaper.ImGui_PopButtonRepeat(ImGui_Context ctx)
   * ```
   * See PushButtonRepeat
   */
  function ImGui_PopButtonRepeat(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopClipRect(ImGui_Context ctx)
   * ```
   * See PushClipRect
   */
  function ImGui_PopClipRect(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopFont(ImGui_Context ctx)
   * ```
   * See PushFont.
   */
  function ImGui_PopFont(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopID(ImGui_Context ctx)
   * ```
   * Pop from the ID stack.
   */
  function ImGui_PopID(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopItemWidth(ImGui_Context ctx)
   * ```
   * See PushItemWidth
   */
  function ImGui_PopItemWidth(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopStyleColor(ImGui_Context ctx, optional integer countIn)
   * ```
   */
  function ImGui_PopStyleColor(ctx: ImGui_Context, countIn?: number): void;

  /**
   * ```
   * reaper.ImGui_PopStyleVar(ImGui_Context ctx, optional integer countIn)
   * ```
   * Reset a style variable.
   */
  function ImGui_PopStyleVar(ctx: ImGui_Context, countIn?: number): void;

  /**
   * ```
   * reaper.ImGui_PopTabStop(ImGui_Context ctx)
   * ```
   * See PushTabStop
   */
  function ImGui_PopTabStop(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_PopTextWrapPos(ImGui_Context ctx)
   * ```
   */
  function ImGui_PopTextWrapPos(ctx: ImGui_Context): void;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_AnyPopup()
   * ```
   * PopupFlags_AnyPopupId | PopupFlags_AnyPopupLevel
   */
  function ImGui_PopupFlags_AnyPopup(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_AnyPopupId()
   * ```
   * Ignore the str_id parameter and test for any popup.
   */
  function ImGui_PopupFlags_AnyPopupId(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_AnyPopupLevel()
   * ```
   * Search/test at any level of the popup stack (default test in the current level).
   */
  function ImGui_PopupFlags_AnyPopupLevel(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_MouseButtonLeft()
   * ```
   * Open on Left Mouse release.
   *
   *    Guaranteed to always be == 0 (same as MouseButton_Left).
   */
  function ImGui_PopupFlags_MouseButtonLeft(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_MouseButtonMiddle()
   * ```
   * Open on Middle Mouse release.
   *
   *    Guaranteed to always be == 2 (same as MouseButton_Middle).
   */
  function ImGui_PopupFlags_MouseButtonMiddle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_MouseButtonRight()
   * ```
   * Open on Right Mouse release.
   *
   *    Guaranteed to always be == 1 (same as MouseButton_Right).
   */
  function ImGui_PopupFlags_MouseButtonRight(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_NoOpenOverExistingPopup()
   * ```
   * Don't open if there's already a popup at the same level of the popup stack.
   */
  function ImGui_PopupFlags_NoOpenOverExistingPopup(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_NoOpenOverItems()
   * ```
   * For BeginPopupContextWindow: don't return true when hovering items,
   *
   *    only when hovering empty space.
   */
  function ImGui_PopupFlags_NoOpenOverItems(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_NoReopen()
   * ```
   * Don't reopen same popup if already open
   *
   *    (won't reposition, won't reinitialize navigation).
   */
  function ImGui_PopupFlags_NoReopen(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_PopupFlags_None()
   * ```
   */
  function ImGui_PopupFlags_None(): number;

  /**
   * ```
   * reaper.ImGui_ProgressBar(ImGui_Context ctx, number fraction, optional number size_arg_wIn, optional number size_arg_hIn, optional string overlayIn)
   * ```
   * Fraction < 0.0 displays an indeterminate progress bar animation since v0.9.1.
   *
   * The value must be animated along with time, for example `-1.0 * ImGui.GetTime()`.
   */
  function ImGui_ProgressBar(
    ctx: ImGui_Context,
    fraction: number,
    size_arg_wIn?: number,
    size_arg_hIn?: number,
    overlayIn?: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_PushButtonRepeat(ImGui_Context ctx, boolean _repeat)
   * ```
   * In 'repeat' mode, Button*() functions return repeated true in a typematic
   *
   * manner (using ConfigVar_KeyRepeatDelay/ConfigVar_KeyRepeatRate settings).
   *
   *
   *
   * Note that you can call IsItemActive after any Button to tell if the button is
   *
   * held in the current frame.
   */
  function ImGui_PushButtonRepeat(ctx: ImGui_Context, _repeat: boolean): void;

  /**
   * ```
   * reaper.ImGui_PushClipRect(ImGui_Context ctx, number clip_rect_min_x, number clip_rect_min_y, number clip_rect_max_x, number clip_rect_max_y, boolean intersect_with_current_clip_rect)
   * ```
   */
  function ImGui_PushClipRect(
    ctx: ImGui_Context,
    clip_rect_min_x: number,
    clip_rect_min_y: number,
    clip_rect_max_x: number,
    clip_rect_max_y: number,
    intersect_with_current_clip_rect: boolean,
  ): void;

  /**
   * ```
   * reaper.ImGui_PushFont(ImGui_Context ctx, ImGui_Font font)
   * ```
   * Change the current font. Use nil to push the default font.
   *
   * The font object must have been registered using Attach. See PopFont.
   */
  function ImGui_PushFont(ctx: ImGui_Context, font: ImGui_Font): void;

  /**
   * ```
   * reaper.ImGui_PushID(ImGui_Context ctx, string str_id)
   * ```
   * Push string into the ID stack.
   */
  function ImGui_PushID(ctx: ImGui_Context, str_id: string): void;

  /**
   * ```
   * reaper.ImGui_PushItemWidth(ImGui_Context ctx, number item_width)
   * ```
   * Push width of items for common large "item+label" widgets.
   *
   *
   *
   * - \>0.0: width in pixels
   *
   * - <0.0 align xx pixels to the right of window
   *
   *   (so -FLT_MIN always align width to the right side)
   *
   * - 0.0 = default to ~2/3 of windows width.
   */
  function ImGui_PushItemWidth(ctx: ImGui_Context, item_width: number): void;

  /**
   * ```
   * reaper.ImGui_PushStyleColor(ImGui_Context ctx, integer idx, integer col_rgba)
   * ```
   * Temporarily modify a style color.
   *
   * Call PopStyleColor to undo after use (before the end of the frame).
   *
   * See Col_* for available style colors.
   */
  function ImGui_PushStyleColor(
    ctx: ImGui_Context,
    idx: number,
    col_rgba: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_PushStyleVar(ImGui_Context ctx, integer var_idx, number val1, optional number val2In)
   * ```
   * Temporarily modify a style variable.
   *
   * Call PopStyleVar to undo after use (before the end of the frame).
   *
   * See StyleVar_* for possible values of 'var_idx'.
   */
  function ImGui_PushStyleVar(
    ctx: ImGui_Context,
    var_idx: number,
    val1: number,
    val2In?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_PushTabStop(ImGui_Context ctx, boolean tab_stop)
   * ```
   * Allow focusing using TAB/Shift-TAB, enabled by default but you can disable it
   *
   * for certain widgets
   */
  function ImGui_PushTabStop(ctx: ImGui_Context, tab_stop: boolean): void;

  /**
   * ```
   * reaper.ImGui_PushTextWrapPos(ImGui_Context ctx, optional number wrap_local_pos_xIn)
   * ```
   * Push word-wrapping position for Text*() commands.
   *
   *
   *
   * -  < 0.0: no wrapping
   *
   * -  = 0.0: wrap to end of window (or column)
   *
   * - \> 0.0: wrap at 'wrap_pos_x' position in window local space.
   */
  function ImGui_PushTextWrapPos(
    ctx: ImGui_Context,
    wrap_local_pos_xIn?: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_RadioButton(ImGui_Context ctx, string label, boolean active)
   * ```
   * Use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; }
   */
  function ImGui_RadioButton(
    ctx: ImGui_Context,
    label: string,
    active: boolean,
  ): boolean;

  /**
   * ```
   * boolean retval, integer v = reaper.ImGui_RadioButtonEx(ImGui_Context ctx, string label, integer v, integer v_button)
   * ```
   * Shortcut to handle RadioButton's example pattern when value is an integer
   */
  function ImGui_RadioButtonEx(
    ctx: ImGui_Context,
    label: string,
    v: number,
    v_button: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * reaper.ImGui_ResetMouseDragDelta(ImGui_Context ctx, optional integer buttonIn)
   * ```
   */
  function ImGui_ResetMouseDragDelta(
    ctx: ImGui_Context,
    buttonIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SameLine(ImGui_Context ctx, optional number offset_from_start_xIn, optional number spacingIn)
   * ```
   * Call between widgets or groups to layout them horizontally.
   *
   * X position given in window coordinates.
   */
  function ImGui_SameLine(
    ctx: ImGui_Context,
    offset_from_start_xIn?: number,
    spacingIn?: number,
  ): void;

  /**
   * ```
   * boolean retval, optional boolean p_selected = reaper.ImGui_Selectable(ImGui_Context ctx, string label, optional boolean p_selected, optional integer flagsIn, optional number size_wIn, optional number size_hIn)
   * ```
   */
  function ImGui_Selectable(
    ctx: ImGui_Context,
    label: string,
    p_selected?: boolean,
    flagsIn?: number,
    size_wIn?: number,
    size_hIn?: number,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_AllowDoubleClick()
   * ```
   * Generate press events on double clicks too.
   */
  function ImGui_SelectableFlags_AllowDoubleClick(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_AllowOverlap()
   * ```
   * Hit testing to allow subsequent widgets to overlap this one.
   */
  function ImGui_SelectableFlags_AllowOverlap(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_Disabled()
   * ```
   * Cannot be selected, display grayed out text.
   */
  function ImGui_SelectableFlags_Disabled(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_DontClosePopups()
   * ```
   * Clicking this doesn't close parent popup window.
   */
  function ImGui_SelectableFlags_DontClosePopups(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_None()
   * ```
   */
  function ImGui_SelectableFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SelectableFlags_SpanAllColumns()
   * ```
   * Frame will span all columns of its container table (text will still fit in current column).
   */
  function ImGui_SelectableFlags_SpanAllColumns(): number;

  /**
   * ```
   * reaper.ImGui_Separator(ImGui_Context ctx)
   * ```
   * Separator, generally horizontal. inside a menu bar or in horizontal layout
   *
   * mode, this becomes a vertical separator.
   */
  function ImGui_Separator(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_SeparatorText(ImGui_Context ctx, string label)
   * ```
   * Text formatted with an horizontal line
   */
  function ImGui_SeparatorText(ctx: ImGui_Context, label: string): void;

  /**
   * ```
   * reaper.ImGui_SetClipboardText(ImGui_Context ctx, string text)
   * ```
   * See also the LogToClipboard function to capture GUI into clipboard,
   *
   * or easily output text data to the clipboard.
   */
  function ImGui_SetClipboardText(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_SetColorEditOptions(ImGui_Context ctx, integer flags)
   * ```
   * Picker type, etc. User will be able to change many settings, unless you pass
   *
   * the _NoOptions flag to your calls.
   */
  function ImGui_SetColorEditOptions(ctx: ImGui_Context, flags: number): void;

  /**
   * ```
   * reaper.ImGui_SetConfigVar(ImGui_Context ctx, integer var_idx, number value)
   * ```
   */
  function ImGui_SetConfigVar(
    ctx: ImGui_Context,
    var_idx: number,
    value: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetCursorPos(ImGui_Context ctx, number local_pos_x, number local_pos_y)
   * ```
   * Cursor position in window
   */
  function ImGui_SetCursorPos(
    ctx: ImGui_Context,
    local_pos_x: number,
    local_pos_y: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetCursorPosX(ImGui_Context ctx, number local_x)
   * ```
   * Cursor X position in window
   */
  function ImGui_SetCursorPosX(ctx: ImGui_Context, local_x: number): void;

  /**
   * ```
   * reaper.ImGui_SetCursorPosY(ImGui_Context ctx, number local_y)
   * ```
   * Cursor Y position in window
   */
  function ImGui_SetCursorPosY(ctx: ImGui_Context, local_y: number): void;

  /**
   * ```
   * reaper.ImGui_SetCursorScreenPos(ImGui_Context ctx, number pos_x, number pos_y)
   * ```
   * Cursor position in absolute screen coordinates.
   */
  function ImGui_SetCursorScreenPos(
    ctx: ImGui_Context,
    pos_x: number,
    pos_y: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_SetDragDropPayload(ImGui_Context ctx, string type, string data, optional integer condIn)
   * ```
   * The type is a user defined string of maximum 32 characters.
   *
   * Strings starting with '_' are reserved for dear imgui internal types.
   *
   * Data is copied and held by imgui.
   */
  function ImGui_SetDragDropPayload(
    ctx: ImGui_Context,
    type: string,
    data: string,
    condIn?: number,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_SetItemDefaultFocus(ImGui_Context ctx)
   * ```
   * Make last item the default focused item of a window.
   */
  function ImGui_SetItemDefaultFocus(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_SetItemTooltip(ImGui_Context ctx, string text)
   * ```
   * Set a text-only tooltip if preceding item was hovered.
   *
   * Override any previous call to SetTooltip(). Shortcut for
   *
   * `if (IsItemHovered(HoveredFlags_ForTooltip)) { SetTooltip(...); }`.
   */
  function ImGui_SetItemTooltip(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_SetKeyboardFocusHere(ImGui_Context ctx, optional integer offsetIn)
   * ```
   * Focus keyboard on the next widget. Use positive 'offset' to access sub
   *
   * components of a multiple component widget. Use -1 to access previous widget.
   */
  function ImGui_SetKeyboardFocusHere(
    ctx: ImGui_Context,
    offsetIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetMouseCursor(ImGui_Context ctx, integer cursor_type)
   * ```
   * Set desired mouse cursor shape. See MouseCursor_* for possible values.
   */
  function ImGui_SetMouseCursor(ctx: ImGui_Context, cursor_type: number): void;

  /**
   * ```
   * reaper.ImGui_SetNextFrameWantCaptureKeyboard(ImGui_Context ctx, boolean want_capture_keyboard)
   * ```
   * Request capture of keyboard shortcuts in REAPER's global scope for the next frame.
   */
  function ImGui_SetNextFrameWantCaptureKeyboard(
    ctx: ImGui_Context,
    want_capture_keyboard: boolean,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextItemAllowOverlap(ImGui_Context ctx)
   * ```
   * Allow next item to be overlapped by a subsequent item.
   *
   * Useful with invisible buttons, selectable, treenode covering an area where
   *
   * subsequent items may need to be added. Note that both Selectable() and TreeNode()
   *
   * have dedicated flags doing this.
   */
  function ImGui_SetNextItemAllowOverlap(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_SetNextItemOpen(ImGui_Context ctx, boolean is_open, optional integer condIn)
   * ```
   * Set next TreeNode/CollapsingHeader open state.
   *
   * Can also be done with the TreeNodeFlags_DefaultOpen flag.
   */
  function ImGui_SetNextItemOpen(
    ctx: ImGui_Context,
    is_open: boolean,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextItemShortcut(ImGui_Context ctx, integer key_chord, optional integer flagsIn)
   * ```
   */
  function ImGui_SetNextItemShortcut(
    ctx: ImGui_Context,
    key_chord: number,
    flagsIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextItemWidth(ImGui_Context ctx, number item_width)
   * ```
   * Set width of the _next_ common large "item+label" widget.
   *
   *
   *
   * - \>0.0: width in pixels
   *
   * - <0.0 align xx pixels to the right of window
   *
   *   (so -FLT_MIN always align width to the right side)
   */
  function ImGui_SetNextItemWidth(ctx: ImGui_Context, item_width: number): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowBgAlpha(ImGui_Context ctx, number alpha)
   * ```
   * Set next window background color alpha. Helper to easily override the Alpha
   *
   * component of Col_WindowBg/Col_ChildBg/Col_PopupBg.
   *
   * You may also use WindowFlags_NoBackground for a fully transparent window.
   */
  function ImGui_SetNextWindowBgAlpha(ctx: ImGui_Context, alpha: number): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowCollapsed(ImGui_Context ctx, boolean collapsed, optional integer condIn)
   * ```
   * Set next window collapsed state.
   */
  function ImGui_SetNextWindowCollapsed(
    ctx: ImGui_Context,
    collapsed: boolean,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowContentSize(ImGui_Context ctx, number size_w, number size_h)
   * ```
   * Set next window content size (~ scrollable client area, which enforce the
   *
   * range of scrollbars). Not including window decorations (title bar, menu bar,
   *
   * etc.) nor StyleVar_WindowPadding. set an axis to 0.0 to leave it automatic.
   */
  function ImGui_SetNextWindowContentSize(
    ctx: ImGui_Context,
    size_w: number,
    size_h: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowDockID(ImGui_Context ctx, integer dock_id, optional integer condIn)
   * ```
   */
  function ImGui_SetNextWindowDockID(
    ctx: ImGui_Context,
    dock_id: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowFocus(ImGui_Context ctx)
   * ```
   * Set next window to be focused / top-most.
   */
  function ImGui_SetNextWindowFocus(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowPos(ImGui_Context ctx, number pos_x, number pos_y, optional integer condIn, optional number pivot_xIn, optional number pivot_yIn)
   * ```
   * Set next window position. Use pivot=(0.5,0.5) to center on given point, etc.
   */
  function ImGui_SetNextWindowPos(
    ctx: ImGui_Context,
    pos_x: number,
    pos_y: number,
    condIn?: number,
    pivot_xIn?: number,
    pivot_yIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowScroll(ImGui_Context ctx, number scroll_x, number scroll_y)
   * ```
   * Set next window scrolling value (use < 0.0 to not affect a given axis).
   */
  function ImGui_SetNextWindowScroll(
    ctx: ImGui_Context,
    scroll_x: number,
    scroll_y: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowSize(ImGui_Context ctx, number size_w, number size_h, optional integer condIn)
   * ```
   * Set next window size. set axis to 0.0 to force an auto-fit on this axis.
   */
  function ImGui_SetNextWindowSize(
    ctx: ImGui_Context,
    size_w: number,
    size_h: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetNextWindowSizeConstraints(ImGui_Context ctx, number size_min_w, number size_min_h, number size_max_w, number size_max_h, ImGui_Function custom_callbackIn)
   * ```
   * Set next window size limits. Use 0.0 or FLT_MAX (second return value of
   *
   * NumericLimits_Float) if you don't want limits.
   *
   *
   *
   * Use -1 for both min and max of same axis to preserve current size (which itself
   *
   * is a constraint).
   *
   *
   *
   * Use callback to apply non-trivial programmatic constraints.
   */
  function ImGui_SetNextWindowSizeConstraints(
    ctx: ImGui_Context,
    size_min_w: number,
    size_min_h: number,
    size_max_w: number,
    size_max_h: number,
    custom_callbackIn: ImGui_Function,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetScrollFromPosX(ImGui_Context ctx, number local_x, optional number center_x_ratioIn)
   * ```
   * Adjust scrolling amount to make given position visible.
   *
   * Generally GetCursorStartPos() + offset to compute a valid position.
   */
  function ImGui_SetScrollFromPosX(
    ctx: ImGui_Context,
    local_x: number,
    center_x_ratioIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetScrollFromPosY(ImGui_Context ctx, number local_y, optional number center_y_ratioIn)
   * ```
   * Adjust scrolling amount to make given position visible.
   *
   * Generally GetCursorStartPos() + offset to compute a valid position.
   */
  function ImGui_SetScrollFromPosY(
    ctx: ImGui_Context,
    local_y: number,
    center_y_ratioIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetScrollHereX(ImGui_Context ctx, optional number center_x_ratioIn)
   * ```
   * Adjust scrolling amount to make current cursor position visible.
   *
   * center_x_ratio=0.0: left, 0.5: center, 1.0: right.
   *
   * When using to make a "default/current item" visible,
   *
   * consider using SetItemDefaultFocus instead.
   */
  function ImGui_SetScrollHereX(
    ctx: ImGui_Context,
    center_x_ratioIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetScrollHereY(ImGui_Context ctx, optional number center_y_ratioIn)
   * ```
   * Adjust scrolling amount to make current cursor position visible.
   *
   * center_y_ratio=0.0: top, 0.5: center, 1.0: bottom.
   *
   * When using to make a "default/current item" visible,
   *
   * consider using SetItemDefaultFocus instead.
   */
  function ImGui_SetScrollHereY(
    ctx: ImGui_Context,
    center_y_ratioIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetScrollX(ImGui_Context ctx, number scroll_x)
   * ```
   * Set scrolling amount [0 .. GetScrollMaxX()]
   */
  function ImGui_SetScrollX(ctx: ImGui_Context, scroll_x: number): void;

  /**
   * ```
   * reaper.ImGui_SetScrollY(ImGui_Context ctx, number scroll_y)
   * ```
   * Set scrolling amount [0 .. GetScrollMaxY()]
   */
  function ImGui_SetScrollY(ctx: ImGui_Context, scroll_y: number): void;

  /**
   * ```
   * reaper.ImGui_SetTabItemClosed(ImGui_Context ctx, string tab_or_docked_window_label)
   * ```
   * Notify TabBar or Docking system of a closed tab/window ahead
   *
   * (useful to reduce visual flicker on reorderable tab bars).
   *
   * For tab-bar: call after BeginTabBar and before Tab submissions.
   *
   * Otherwise call with a window name.
   */
  function ImGui_SetTabItemClosed(
    ctx: ImGui_Context,
    tab_or_docked_window_label: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetTooltip(ImGui_Context ctx, string text)
   * ```
   * Set a text-only tooltip. Often used after a IsItemHovered() check.
   *
   * Override any previous call to SetTooltip.
   *
   *
   *
   * Shortcut for `if (BeginTooltip()) { Text(...); EndTooltip(); }`.
   */
  function ImGui_SetTooltip(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_SetWindowCollapsed(ImGui_Context ctx, boolean collapsed, optional integer condIn)
   * ```
   * (Not recommended) Set current window collapsed state.
   *
   * Prefer using SetNextWindowCollapsed.
   */
  function ImGui_SetWindowCollapsed(
    ctx: ImGui_Context,
    collapsed: boolean,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetWindowCollapsedEx(ImGui_Context ctx, string name, boolean collapsed, optional integer condIn)
   * ```
   * Set named window collapsed state.
   */
  function ImGui_SetWindowCollapsedEx(
    ctx: ImGui_Context,
    name: string,
    collapsed: boolean,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetWindowFocus(ImGui_Context ctx)
   * ```
   * (Not recommended) Set current window to be focused / top-most.
   *
   * Prefer using SetNextWindowFocus.
   */
  function ImGui_SetWindowFocus(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_SetWindowFocusEx(ImGui_Context ctx, string name)
   * ```
   * Set named window to be focused / top-most. Use an empty name to remove focus.
   */
  function ImGui_SetWindowFocusEx(ctx: ImGui_Context, name: string): void;

  /**
   * ```
   * reaper.ImGui_SetWindowPos(ImGui_Context ctx, number pos_x, number pos_y, optional integer condIn)
   * ```
   * (Not recommended) Set current window position - call within Begin/End.
   *
   * Prefer using SetNextWindowPos, as this may incur tearing and minor side-effects.
   */
  function ImGui_SetWindowPos(
    ctx: ImGui_Context,
    pos_x: number,
    pos_y: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetWindowPosEx(ImGui_Context ctx, string name, number pos_x, number pos_y, optional integer condIn)
   * ```
   * Set named window position.
   */
  function ImGui_SetWindowPosEx(
    ctx: ImGui_Context,
    name: string,
    pos_x: number,
    pos_y: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetWindowSize(ImGui_Context ctx, number size_w, number size_h, optional integer condIn)
   * ```
   * (Not recommended) Set current window size - call within Begin/End.
   *
   * Set size_w and size_h to 0 to force an auto-fit.
   *
   * Prefer using SetNextWindowSize, as this may incur tearing and minor side-effects.
   */
  function ImGui_SetWindowSize(
    ctx: ImGui_Context,
    size_w: number,
    size_h: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_SetWindowSizeEx(ImGui_Context ctx, string name, number size_w, number size_h, optional integer condIn)
   * ```
   * Set named window size. Set axis to 0.0 to force an auto-fit on this axis.
   */
  function ImGui_SetWindowSizeEx(
    ctx: ImGui_Context,
    name: string,
    size_w: number,
    size_h: number,
    condIn?: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_Shortcut(ImGui_Context ctx, integer key_chord, optional integer flagsIn)
   * ```
   */
  function ImGui_Shortcut(
    ctx: ImGui_Context,
    key_chord: number,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * optional boolean p_open = reaper.ImGui_ShowAboutWindow(ImGui_Context ctx, optional boolean p_open)
   * ```
   * Create About window.
   *
   * Display ReaImGui version, Dear ImGui version, credits and build/system information.
   */
  function ImGui_ShowAboutWindow(
    ctx: ImGui_Context,
    p_open?: boolean,
  ): boolean | null;

  /**
   * ```
   * optional boolean p_open = reaper.ImGui_ShowDebugLogWindow(ImGui_Context ctx, optional boolean p_open)
   * ```
   * Create Debug Log window. display a simplified log of important dear imgui events.
   */
  function ImGui_ShowDebugLogWindow(
    ctx: ImGui_Context,
    p_open?: boolean,
  ): boolean | null;

  /**
   * ```
   * optional boolean p_open = reaper.ImGui_ShowIDStackToolWindow(ImGui_Context ctx, optional boolean p_open)
   * ```
   * Create Stack Tool window. Hover items with mouse to query information about
   *
   * the source of their unique ID.
   */
  function ImGui_ShowIDStackToolWindow(
    ctx: ImGui_Context,
    p_open?: boolean,
  ): boolean | null;

  /**
   * ```
   * optional boolean p_open = reaper.ImGui_ShowMetricsWindow(ImGui_Context ctx, optional boolean p_open)
   * ```
   * Create Metrics/Debugger window.
   *
   * Display Dear ImGui internals: windows, draw commands, various internal state, etc.
   */
  function ImGui_ShowMetricsWindow(
    ctx: ImGui_Context,
    p_open?: boolean,
  ): boolean | null;

  /**
   * ```
   * boolean retval, number v_rad = reaper.ImGui_SliderAngle(ImGui_Context ctx, string label, number v_rad, optional number v_degrees_minIn, optional number v_degrees_maxIn, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderAngle(
    ctx: ImGui_Context,
    label: string,
    v_rad: number,
    v_degrees_minIn?: number,
    v_degrees_maxIn?: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, number v = reaper.ImGui_SliderDouble(ImGui_Context ctx, string label, number v, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderDouble(
    ctx: ImGui_Context,
    label: string,
    v: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2 = reaper.ImGui_SliderDouble2(ImGui_Context ctx, string label, number v1, number v2, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderDouble2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3 = reaper.ImGui_SliderDouble3(ImGui_Context ctx, string label, number v1, number v2, number v3, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderDouble3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, number v1, number v2, number v3, number v4 = reaper.ImGui_SliderDouble4(ImGui_Context ctx, string label, number v1, number v2, number v3, number v4, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderDouble4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_SliderDoubleN(ImGui_Context ctx, string label, reaper_array values, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderDoubleN(
    ctx: ImGui_Context,
    label: string,
    values: reaper_array,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_AlwaysClamp()
   * ```
   * Clamp value to min/max bounds when input manually with CTRL+Click.
   *
   *    By default CTRL+Click allows going out of bounds.
   */
  function ImGui_SliderFlags_AlwaysClamp(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_Logarithmic()
   * ```
   * Make the widget logarithmic (linear otherwise).
   *
   *    Consider using SliderFlags_NoRoundToFormat with this if using a format-string
   *
   *    with small amount of digits.
   */
  function ImGui_SliderFlags_Logarithmic(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_NoInput()
   * ```
   * Disable CTRL+Click or Enter key allowing to input text directly into the widget.
   */
  function ImGui_SliderFlags_NoInput(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_NoRoundToFormat()
   * ```
   * Disable rounding underlying value to match precision of the display format
   *
   *    string (e.g. %.3f values are rounded to those 3 digits).
   */
  function ImGui_SliderFlags_NoRoundToFormat(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_None()
   * ```
   */
  function ImGui_SliderFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SliderFlags_WrapAround()
   * ```
   * Enable wrapping around from max to min and from min to max
   *
   *    (only supported by DragXXX() functions for now).
   */
  function ImGui_SliderFlags_WrapAround(): number;

  /**
   * ```
   * boolean retval, integer v = reaper.ImGui_SliderInt(ImGui_Context ctx, string label, integer v, integer v_min, integer v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderInt(
    ctx: ImGui_Context,
    label: string,
    v: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2 = reaper.ImGui_SliderInt2(ImGui_Context ctx, string label, integer v1, integer v2, integer v_min, integer v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderInt2(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3 = reaper.ImGui_SliderInt3(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, integer v_min, integer v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderInt3(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * boolean retval, integer v1, integer v2, integer v3, integer v4 = reaper.ImGui_SliderInt4(ImGui_Context ctx, string label, integer v1, integer v2, integer v3, integer v4, integer v_min, integer v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_SliderInt4(
    ctx: ImGui_Context,
    label: string,
    v1: number,
    v2: number,
    v3: number,
    v4: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_SmallButton(ImGui_Context ctx, string label)
   * ```
   * Button with StyleVar_FramePadding.y == 0 to easily embed within text.
   */
  function ImGui_SmallButton(ctx: ImGui_Context, label: string): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_SortDirection_Ascending()
   * ```
   * Ascending = 0->9, A->Z etc.
   */
  function ImGui_SortDirection_Ascending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SortDirection_Descending()
   * ```
   * Descending = 9->0, Z->A etc.
   */
  function ImGui_SortDirection_Descending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_SortDirection_None()
   * ```
   */
  function ImGui_SortDirection_None(): number;

  /**
   * ```
   * reaper.ImGui_Spacing(ImGui_Context ctx)
   * ```
   * Add vertical spacing.
   */
  function ImGui_Spacing(ctx: ImGui_Context): void;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_Alpha()
   * ```
   * Global alpha applies to everything in Dear ImGui.
   */
  function ImGui_StyleVar_Alpha(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ButtonTextAlign()
   * ```
   * Alignment of button text when button is larger than text.
   *
   *    Defaults to (0.5, 0.5) (centered).
   */
  function ImGui_StyleVar_ButtonTextAlign(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_CellPadding()
   * ```
   * Padding within a table cell.
   *
   *    CellPadding.x is locked for entire table.
   *
   *    CellPadding.y may be altered between different rows.
   */
  function ImGui_StyleVar_CellPadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ChildBorderSize()
   * ```
   * Thickness of border around child windows. Generally set to 0.0 or 1.0.
   *
   *    (Other values are not well tested and more CPU/GPU costly).
   */
  function ImGui_StyleVar_ChildBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ChildRounding()
   * ```
   * Radius of child window corners rounding. Set to 0.0 to have rectangular windows.
   */
  function ImGui_StyleVar_ChildRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_DisabledAlpha()
   * ```
   * Additional alpha multiplier applied by BeginDisabled.
   *
   *   Multiply over current value of Alpha.
   */
  function ImGui_StyleVar_DisabledAlpha(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_FrameBorderSize()
   * ```
   * Thickness of border around frames. Generally set to 0.0 or 1.0.
   *
   *    (Other values are not well tested and more CPU/GPU costly).
   */
  function ImGui_StyleVar_FrameBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_FramePadding()
   * ```
   * Padding within a framed rectangle (used by most widgets).
   */
  function ImGui_StyleVar_FramePadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_FrameRounding()
   * ```
   * Radius of frame corners rounding.
   *
   *    Set to 0.0 to have rectangular frame (used by most widgets).
   */
  function ImGui_StyleVar_FrameRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_GrabMinSize()
   * ```
   * Minimum width/height of a grab box for slider/scrollbar.
   */
  function ImGui_StyleVar_GrabMinSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_GrabRounding()
   * ```
   * Radius of grabs corners rounding. Set to 0.0 to have rectangular slider grabs.
   */
  function ImGui_StyleVar_GrabRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_IndentSpacing()
   * ```
   * Horizontal indentation when e.g. entering a tree node.
   *
   *    Generally == (GetFontSize + StyleVar_FramePadding.x*2).
   */
  function ImGui_StyleVar_IndentSpacing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ItemInnerSpacing()
   * ```
   * Horizontal and vertical spacing between within elements of a composed widget
   *
   *    (e.g. a slider and its label).
   */
  function ImGui_StyleVar_ItemInnerSpacing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ItemSpacing()
   * ```
   * Horizontal and vertical spacing between widgets/lines.
   */
  function ImGui_StyleVar_ItemSpacing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_PopupBorderSize()
   * ```
   * Thickness of border around popup/tooltip windows. Generally set to 0.0 or 1.0.
   *
   *    (Other values are not well tested and more CPU/GPU costly).
   */
  function ImGui_StyleVar_PopupBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_PopupRounding()
   * ```
   * Radius of popup window corners rounding.
   *
   *    (Note that tooltip windows use StyleVar_WindowRounding.)
   */
  function ImGui_StyleVar_PopupRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ScrollbarRounding()
   * ```
   * Radius of grab corners for scrollbar.
   */
  function ImGui_StyleVar_ScrollbarRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_ScrollbarSize()
   * ```
   * Width of the vertical scrollbar, Height of the horizontal scrollbar.
   */
  function ImGui_StyleVar_ScrollbarSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_SelectableTextAlign()
   * ```
   * Alignment of selectable text. Defaults to (0.0, 0.0) (top-left aligned).
   *
   *    It's generally important to keep this left-aligned if you want to lay
   *
   *    multiple items on a same line.
   */
  function ImGui_StyleVar_SelectableTextAlign(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_SeparatorTextAlign()
   * ```
   * Alignment of text within the separator.
   *
   * Defaults to (0.0, 0.5) (left aligned, center).
   */
  function ImGui_StyleVar_SeparatorTextAlign(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_SeparatorTextBorderSize()
   * ```
   * Thickness of border in SeparatorText()
   */
  function ImGui_StyleVar_SeparatorTextBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_SeparatorTextPadding()
   * ```
   * Horizontal offset of text from each edge of the separator + spacing on other
   *
   * axis. Generally small values. .y is recommended to be == StyleVar_FramePadding.y.
   */
  function ImGui_StyleVar_SeparatorTextPadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_TabBarBorderSize()
   * ```
   * Thickness of tab-bar separator, which takes on the tab active color to denote focus.
   */
  function ImGui_StyleVar_TabBarBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_TabBorderSize()
   * ```
   * Thickness of border around tabs.
   */
  function ImGui_StyleVar_TabBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_TabRounding()
   * ```
   * Radius of upper corners of a tab. Set to 0.0 to have rectangular tabs.
   */
  function ImGui_StyleVar_TabRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_TableAngledHeadersAngle()
   * ```
   * Angle of angled headers (supported values range from -50.0 degrees to +50.0 degrees).
   */
  function ImGui_StyleVar_TableAngledHeadersAngle(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_TableAngledHeadersTextAlign()
   * ```
   * Alignment of angled headers within the cell
   */
  function ImGui_StyleVar_TableAngledHeadersTextAlign(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_WindowBorderSize()
   * ```
   * Thickness of border around windows. Generally set to 0.0 or 1.0.
   *
   *   (Other values are not well tested and more CPU/GPU costly).
   */
  function ImGui_StyleVar_WindowBorderSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_WindowMinSize()
   * ```
   * Minimum window size. This is a global setting.
   *
   *   If you want to constrain individual windows, use SetNextWindowSizeConstraints.
   */
  function ImGui_StyleVar_WindowMinSize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_WindowPadding()
   * ```
   * Padding within a window.
   */
  function ImGui_StyleVar_WindowPadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_WindowRounding()
   * ```
   * Radius of window corners rounding. Set to 0.0 to have rectangular windows.
   *
   *   Large values tend to lead to variety of artifacts and are not recommended.
   */
  function ImGui_StyleVar_WindowRounding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_StyleVar_WindowTitleAlign()
   * ```
   * Alignment for title bar text.
   *
   *    Defaults to (0.0,0.5) for left-aligned,vertically centered.
   */
  function ImGui_StyleVar_WindowTitleAlign(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_AutoSelectNewTabs()
   * ```
   * Automatically select new tabs when they appear.
   */
  function ImGui_TabBarFlags_AutoSelectNewTabs(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_DrawSelectedOverline()
   * ```
   * Draw selected overline markers over selected tab
   */
  function ImGui_TabBarFlags_DrawSelectedOverline(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_FittingPolicyResizeDown()
   * ```
   * Resize tabs when they don't fit.
   */
  function ImGui_TabBarFlags_FittingPolicyResizeDown(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_FittingPolicyScroll()
   * ```
   * Add scroll buttons when tabs don't fit.
   */
  function ImGui_TabBarFlags_FittingPolicyScroll(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_NoCloseWithMiddleMouseButton()
   * ```
   * Disable behavior of closing tabs (that are submitted with p_open != nil)
   *
   *    with middle mouse button. You may handle this behavior manually on user's
   *
   *    side with if(IsItemHovered() && IsMouseClicked(2)) p_open = false.
   */
  function ImGui_TabBarFlags_NoCloseWithMiddleMouseButton(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_NoTabListScrollingButtons()
   * ```
   * Disable scrolling buttons (apply when fitting policy is
   *
   *    TabBarFlags_FittingPolicyScroll).
   */
  function ImGui_TabBarFlags_NoTabListScrollingButtons(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_NoTooltip()
   * ```
   * Disable tooltips when hovering a tab.
   */
  function ImGui_TabBarFlags_NoTooltip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_None()
   * ```
   */
  function ImGui_TabBarFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_Reorderable()
   * ```
   * Allow manually dragging tabs to re-order them + New tabs are appended at
   *
   *    the end of list.
   */
  function ImGui_TabBarFlags_Reorderable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabBarFlags_TabListPopupButton()
   * ```
   * Disable buttons to open the tab list popup.
   */
  function ImGui_TabBarFlags_TabListPopupButton(): number;

  /**
   * ```
   * boolean _ = reaper.ImGui_TabItemButton(ImGui_Context ctx, string label, optional integer flagsIn)
   * ```
   * Create a Tab behaving like a button. Return true when clicked.
   *
   * Cannot be selected in the tab bar.
   */
  function ImGui_TabItemButton(
    ctx: ImGui_Context,
    label: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_Leading()
   * ```
   * Enforce the tab position to the left of the tab bar (after the tab list popup button).
   */
  function ImGui_TabItemFlags_Leading(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_NoAssumedClosure()
   * ```
   * Tab is selected when trying to close + closure is not immediately assumed
   *
   *    (will wait for user to stop submitting the tab).
   *
   *    Otherwise closure is assumed when pressing the X, so if you keep submitting
   *
   *    the tab may reappear at end of tab bar.
   */
  function ImGui_TabItemFlags_NoAssumedClosure(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_NoCloseWithMiddleMouseButton()
   * ```
   * Disable behavior of closing tabs (that are submitted with p_open != nil) with
   *
   *    middle mouse button. You can still repro this behavior on user's side with
   *
   *    if(IsItemHovered() && IsMouseClicked(2)) p_open = false.
   */
  function ImGui_TabItemFlags_NoCloseWithMiddleMouseButton(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_NoPushId()
   * ```
   * Don't call PushID()/PopID() on BeginTabItem/EndTabItem.
   */
  function ImGui_TabItemFlags_NoPushId(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_NoReorder()
   * ```
   * Disable reordering this tab or having another tab cross over this tab.
   */
  function ImGui_TabItemFlags_NoReorder(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_NoTooltip()
   * ```
   * Disable tooltip for the given tab.
   */
  function ImGui_TabItemFlags_NoTooltip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_None()
   * ```
   */
  function ImGui_TabItemFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_SetSelected()
   * ```
   * Trigger flag to programmatically make the tab selected when calling BeginTabItem.
   */
  function ImGui_TabItemFlags_SetSelected(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_Trailing()
   * ```
   * Enforce the tab position to the right of the tab bar (before the scrolling buttons).
   */
  function ImGui_TabItemFlags_Trailing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TabItemFlags_UnsavedDocument()
   * ```
   * Display a dot next to the title + set TabItemFlags_NoAssumedClosure.
   */
  function ImGui_TabItemFlags_UnsavedDocument(): number;

  /**
   * ```
   * reaper.ImGui_TableAngledHeadersRow(ImGui_Context ctx)
   * ```
   * Submit a row with angled headers for every column with the
   *
   * TableColumnFlags_AngledHeader flag. Must be the first row.
   */
  function ImGui_TableAngledHeadersRow(ctx: ImGui_Context): void;

  /**
   * ```
   * integer _ = reaper.ImGui_TableBgTarget_CellBg()
   * ```
   * Set cell background color (top-most color).
   */
  function ImGui_TableBgTarget_CellBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableBgTarget_None()
   * ```
   */
  function ImGui_TableBgTarget_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableBgTarget_RowBg0()
   * ```
   * Set row background color 0 (generally used for background,
   *
   *    automatically set when TableFlags_RowBg is used).
   */
  function ImGui_TableBgTarget_RowBg0(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableBgTarget_RowBg1()
   * ```
   * Set row background color 1 (generally used for selection marking).
   */
  function ImGui_TableBgTarget_RowBg1(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_AngledHeader()
   * ```
   * TableHeadersRow will submit an angled header row for this column.
   *
   *    Note this will add an extra row.
   */
  function ImGui_TableColumnFlags_AngledHeader(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_DefaultHide()
   * ```
   * Default as a hidden/disabled column.
   */
  function ImGui_TableColumnFlags_DefaultHide(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_DefaultSort()
   * ```
   * Default as a sorting column.
   */
  function ImGui_TableColumnFlags_DefaultSort(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_Disabled()
   * ```
   * Overriding/master disable flag: hide column, won't show in context menu
   *
   *    (unlike calling TableSetColumnEnabled which manipulates the user accessible state).
   */
  function ImGui_TableColumnFlags_Disabled(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IndentDisable()
   * ```
   * Ignore current Indent value when entering cell (default for columns > 0).
   *
   *    Indentation changes _within_ the cell will still be honored.
   */
  function ImGui_TableColumnFlags_IndentDisable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IndentEnable()
   * ```
   * Use current Indent value when entering cell (default for column 0).
   */
  function ImGui_TableColumnFlags_IndentEnable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IsEnabled()
   * ```
   * Status: is enabled == not hidden by user/api (referred to as "Hide" in
   *
   *    _DefaultHide and _NoHide) flags.
   */
  function ImGui_TableColumnFlags_IsEnabled(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IsHovered()
   * ```
   * Status: is hovered by mouse.
   */
  function ImGui_TableColumnFlags_IsHovered(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IsSorted()
   * ```
   * Status: is currently part of the sort specs.
   */
  function ImGui_TableColumnFlags_IsSorted(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_IsVisible()
   * ```
   * Status: is visible == is enabled AND not clipped by scrolling.
   */
  function ImGui_TableColumnFlags_IsVisible(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoClip()
   * ```
   * Disable clipping for this column
   *
   *    (all NoClip columns will render in a same draw command).
   */
  function ImGui_TableColumnFlags_NoClip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoHeaderLabel()
   * ```
   * TableHeadersRow will not submit horizontal label for this column.
   *
   *    Convenient for some small columns. Name will still appear in context menu
   *
   *    or in angled headers.
   */
  function ImGui_TableColumnFlags_NoHeaderLabel(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoHeaderWidth()
   * ```
   * Disable header text width contribution to automatic column width.
   */
  function ImGui_TableColumnFlags_NoHeaderWidth(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoHide()
   * ```
   * Disable ability to hide/disable this column.
   */
  function ImGui_TableColumnFlags_NoHide(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoReorder()
   * ```
   * Disable manual reordering this column, this will also prevent other columns
   *
   *    from crossing over this column.
   */
  function ImGui_TableColumnFlags_NoReorder(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoResize()
   * ```
   * Disable manual resizing.
   */
  function ImGui_TableColumnFlags_NoResize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoSort()
   * ```
   * Disable ability to sort on this field
   *
   *    (even if TableFlags_Sortable is set on the table).
   */
  function ImGui_TableColumnFlags_NoSort(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoSortAscending()
   * ```
   * Disable ability to sort in the ascending direction.
   */
  function ImGui_TableColumnFlags_NoSortAscending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_NoSortDescending()
   * ```
   * Disable ability to sort in the descending direction.
   */
  function ImGui_TableColumnFlags_NoSortDescending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_None()
   * ```
   */
  function ImGui_TableColumnFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_PreferSortAscending()
   * ```
   * Make the initial sort direction Ascending when first sorting on this column (default).
   */
  function ImGui_TableColumnFlags_PreferSortAscending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_PreferSortDescending()
   * ```
   * Make the initial sort direction Descending when first sorting on this column.
   */
  function ImGui_TableColumnFlags_PreferSortDescending(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_WidthFixed()
   * ```
   * Column will not stretch. Preferable with horizontal scrolling enabled
   *
   *    (default if table sizing policy is _SizingFixedFit and table is resizable).
   */
  function ImGui_TableColumnFlags_WidthFixed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableColumnFlags_WidthStretch()
   * ```
   * Column will stretch. Preferable with horizontal scrolling disabled
   *
   *    (default if table sizing policy is _SizingStretchSame or _SizingStretchProp).
   */
  function ImGui_TableColumnFlags_WidthStretch(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_Borders()
   * ```
   * Draw all borders.
   */
  function ImGui_TableFlags_Borders(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersH()
   * ```
   * Draw horizontal borders.
   */
  function ImGui_TableFlags_BordersH(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersInner()
   * ```
   * Draw inner borders.
   */
  function ImGui_TableFlags_BordersInner(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersInnerH()
   * ```
   * Draw horizontal borders between rows.
   */
  function ImGui_TableFlags_BordersInnerH(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersInnerV()
   * ```
   * Draw vertical borders between columns.
   */
  function ImGui_TableFlags_BordersInnerV(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersOuter()
   * ```
   * Draw outer borders.
   */
  function ImGui_TableFlags_BordersOuter(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersOuterH()
   * ```
   * Draw horizontal borders at the top and bottom.
   */
  function ImGui_TableFlags_BordersOuterH(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersOuterV()
   * ```
   * Draw vertical borders on the left and right sides.
   */
  function ImGui_TableFlags_BordersOuterV(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_BordersV()
   * ```
   * Draw vertical borders.
   */
  function ImGui_TableFlags_BordersV(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_ContextMenuInBody()
   * ```
   * Right-click on columns body/contents will display table context menu.
   *
   *    By default it is available in TableHeadersRow.
   */
  function ImGui_TableFlags_ContextMenuInBody(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_Hideable()
   * ```
   * Enable hiding/disabling columns in context menu.
   */
  function ImGui_TableFlags_Hideable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_HighlightHoveredColumn()
   * ```
   * Highlight column headers when hovered (may evolve into a fuller highlight.)
   */
  function ImGui_TableFlags_HighlightHoveredColumn(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoClip()
   * ```
   * Disable clipping rectangle for every individual columns
   *
   *    (reduce draw command count, items will be able to overflow into other columns).
   *
   *    Generally incompatible with TableSetupScrollFreeze.
   */
  function ImGui_TableFlags_NoClip(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoHostExtendX()
   * ```
   * Make outer width auto-fit to columns, overriding outer_size.x value. Only
   *
   *    available when ScrollX/ScrollY are disabled and Stretch columns are not used.
   */
  function ImGui_TableFlags_NoHostExtendX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoHostExtendY()
   * ```
   * Make outer height stop exactly at outer_size.y (prevent auto-extending table
   *
   *    past the limit). Only available when ScrollX/ScrollY are disabled.
   *
   *    Data below the limit will be clipped and not visible.
   */
  function ImGui_TableFlags_NoHostExtendY(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoKeepColumnsVisible()
   * ```
   * Disable keeping column always minimally visible when ScrollX is off and table
   *
   *    gets too small. Not recommended if columns are resizable.
   */
  function ImGui_TableFlags_NoKeepColumnsVisible(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoPadInnerX()
   * ```
   * Disable inner padding between columns (double inner padding if
   *
   *    TableFlags_BordersOuterV is on, single inner padding if BordersOuterV is off).
   */
  function ImGui_TableFlags_NoPadInnerX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoPadOuterX()
   * ```
   * Default if TableFlags_BordersOuterV is off. Disable outermost padding.
   */
  function ImGui_TableFlags_NoPadOuterX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_NoSavedSettings()
   * ```
   * Disable persisting columns order, width and sort settings in the .ini file.
   */
  function ImGui_TableFlags_NoSavedSettings(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_None()
   * ```
   */
  function ImGui_TableFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_PadOuterX()
   * ```
   * Default if TableFlags_BordersOuterV is on. Enable outermost padding.
   *
   *    Generally desirable if you have headers.
   */
  function ImGui_TableFlags_PadOuterX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_PreciseWidths()
   * ```
   * Disable distributing remainder width to stretched columns (width allocation
   *
   *    on a 100-wide table with 3 columns: Without this flag: 33,33,34. With this
   *
   *    flag: 33,33,33).
   *
   *    With larger number of columns, resizing will appear to be less smooth.
   */
  function ImGui_TableFlags_PreciseWidths(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_Reorderable()
   * ```
   * Enable reordering columns in header row
   *
   *    (need calling TableSetupColumn + TableHeadersRow to display headers).
   */
  function ImGui_TableFlags_Reorderable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_Resizable()
   * ```
   * Enable resizing columns.
   */
  function ImGui_TableFlags_Resizable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_RowBg()
   * ```
   * Set each RowBg color with Col_TableRowBg or Col_TableRowBgAlt (equivalent of
   *
   *    calling TableSetBgColor with TableBgTarget_RowBg0 on each row manually).
   */
  function ImGui_TableFlags_RowBg(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_ScrollX()
   * ```
   * Enable horizontal scrolling. Require 'outer_size' parameter of BeginTable to
   *
   *    specify the container size. Changes default sizing policy.
   *
   *    Because this creates a child window, ScrollY is currently generally
   *
   *    recommended when using ScrollX.
   */
  function ImGui_TableFlags_ScrollX(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_ScrollY()
   * ```
   * Enable vertical scrolling.
   *
   *    Require 'outer_size' parameter of BeginTable to specify the container size.
   */
  function ImGui_TableFlags_ScrollY(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SizingFixedFit()
   * ```
   * Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable),
   *
   *    matching contents width.
   */
  function ImGui_TableFlags_SizingFixedFit(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SizingFixedSame()
   * ```
   * Columns default to _WidthFixed or _WidthAuto (if resizable or not resizable),
   *
   *    matching the maximum contents width of all columns.
   *
   *    Implicitly enable TableFlags_NoKeepColumnsVisible.
   */
  function ImGui_TableFlags_SizingFixedSame(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SizingStretchProp()
   * ```
   * Columns default to _WidthStretch with default weights proportional to each
   *
   *    columns contents widths.
   */
  function ImGui_TableFlags_SizingStretchProp(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SizingStretchSame()
   * ```
   * Columns default to _WidthStretch with default weights all equal,
   *
   *    unless overriden by TableSetupColumn.
   */
  function ImGui_TableFlags_SizingStretchSame(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SortMulti()
   * ```
   * Hold shift when clicking headers to sort on multiple column.
   *
   *    TableGetColumnSortSpecs may return specs where (SpecsCount > 1).
   */
  function ImGui_TableFlags_SortMulti(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_SortTristate()
   * ```
   * Allow no sorting, disable default sorting.
   *
   *    TableGetColumnSortSpecs may return specs where (SpecsCount == 0).
   */
  function ImGui_TableFlags_SortTristate(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableFlags_Sortable()
   * ```
   * Enable sorting. Call TableNeedSort/TableGetColumnSortSpecs to obtain sort specs.
   *
   *    Also see TableFlags_SortMulti and TableFlags_SortTristate.
   */
  function ImGui_TableFlags_Sortable(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableGetColumnCount(ImGui_Context ctx)
   * ```
   * Return number of columns (value passed to BeginTable).
   */
  function ImGui_TableGetColumnCount(ctx: ImGui_Context): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableGetColumnFlags(ImGui_Context ctx, optional integer column_nIn)
   * ```
   * Return column flags so you can query their Enabled/Visible/Sorted/Hovered
   *
   * status flags. Pass -1 to use current column.
   */
  function ImGui_TableGetColumnFlags(
    ctx: ImGui_Context,
    column_nIn?: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableGetColumnIndex(ImGui_Context ctx)
   * ```
   * Return current column index.
   */
  function ImGui_TableGetColumnIndex(ctx: ImGui_Context): number;

  /**
   * ```
   * string _ = reaper.ImGui_TableGetColumnName(ImGui_Context ctx, optional integer column_nIn)
   * ```
   * Return "" if column didn't have a name declared by TableSetupColumn.
   *
   * Pass -1 to use current column.
   */
  function ImGui_TableGetColumnName(
    ctx: ImGui_Context,
    column_nIn?: number,
  ): string;

  /**
   * ```
   * boolean retval, integer column_index, integer column_user_id, integer sort_direction = reaper.ImGui_TableGetColumnSortSpecs(ImGui_Context ctx, integer id)
   * ```
   * Sorting specification for one column of a table.
   *
   * Call while incrementing 'id' from 0 until false is returned.
   *
   *
   *
   * - id:             Index of the sorting specification (always stored in order
   *
   *   starting from 0, tables sorted on a single criteria will always have a 0 here)
   *
   * - column_index:   Index of the column
   *
   * - column_user_id: User ID of the column (if specified by a TableSetupColumn call)
   *
   * - sort_direction: SortDirection_Ascending or SortDirection_Descending
   *
   *
   *
   * See TableNeedSort.
   */
  function ImGui_TableGetColumnSortSpecs(
    ctx: ImGui_Context,
    id: number,
  ): LuaMultiReturn<[boolean, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_TableGetHoveredColumn(ImGui_Context ctx)
   * ```
   * Returns hovered column or -1 when table is not hovered. Returns columns_count
   *
   * if the unused space at the right of visible columns is hovered.
   *
   *
   *
   * Can also use (TableGetColumnFlags() & TableColumnFlags_IsHovered) instead.
   */
  function ImGui_TableGetHoveredColumn(ctx: ImGui_Context): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableGetRowIndex(ImGui_Context ctx)
   * ```
   * Return current row index.
   */
  function ImGui_TableGetRowIndex(ctx: ImGui_Context): number;

  /**
   * ```
   * reaper.ImGui_TableHeader(ImGui_Context ctx, string label)
   * ```
   * Submit one header cell manually (rarely used). See TableSetupColumn.
   */
  function ImGui_TableHeader(ctx: ImGui_Context, label: string): void;

  /**
   * ```
   * reaper.ImGui_TableHeadersRow(ImGui_Context ctx)
   * ```
   * Submit a row with headers cells based on data provided to TableSetupColumn
   *
   * + submit context menu.
   */
  function ImGui_TableHeadersRow(ctx: ImGui_Context): void;

  /**
   * ```
   * boolean retval, boolean has_specs = reaper.ImGui_TableNeedSort(ImGui_Context ctx)
   * ```
   * Return true once when sorting specs have changed since last call,
   *
   * or the first time. 'has_specs' is false when not sorting.
   *
   *
   *
   * See TableGetColumnSortSpecs.
   */
  function ImGui_TableNeedSort(
    ctx: ImGui_Context,
  ): LuaMultiReturn<[boolean, boolean]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_TableNextColumn(ImGui_Context ctx)
   * ```
   * Append into the next column (or first column of next row if currently in
   *
   * last column). Return true when column is visible.
   */
  function ImGui_TableNextColumn(ctx: ImGui_Context): boolean;

  /**
   * ```
   * reaper.ImGui_TableNextRow(ImGui_Context ctx, optional integer row_flagsIn, optional number min_row_heightIn)
   * ```
   * Append into the first cell of a new row.
   */
  function ImGui_TableNextRow(
    ctx: ImGui_Context,
    row_flagsIn?: number,
    min_row_heightIn?: number,
  ): void;

  /**
   * ```
   * integer _ = reaper.ImGui_TableRowFlags_Headers()
   * ```
   * Identify header row (set default background color + width of its contents
   *
   *    accounted different for auto column width).
   */
  function ImGui_TableRowFlags_Headers(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TableRowFlags_None()
   * ```
   * For TableNextRow.
   */
  function ImGui_TableRowFlags_None(): number;

  /**
   * ```
   * reaper.ImGui_TableSetBgColor(ImGui_Context ctx, integer target, integer color_rgba, optional integer column_nIn)
   * ```
   * Change the color of a cell, row, or column.
   *
   * See TableBgTarget_* flags for details.
   */
  function ImGui_TableSetBgColor(
    ctx: ImGui_Context,
    target: number,
    color_rgba: number,
    column_nIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_TableSetColumnEnabled(ImGui_Context ctx, integer column_n, boolean v)
   * ```
   * Change user-accessible enabled/disabled state of a column, set to false to
   *
   * hide the column. Note that end-user can use the context menu to change this
   *
   * themselves (right-click in headers, or right-click in columns body with
   *
   * TableFlags_ContextMenuInBody).
   *
   *
   *
   * - Require table to have the TableFlags_Hideable flag because we are manipulating
   *
   *   user accessible state.
   *
   * - Request will be applied during next layout, which happens on the first call to
   *
   *   TableNextRow after Begin_Table.
   *
   * - For the getter you can test
   *
   *   (TableGetColumnFlags() & TableColumnFlags_IsEnabled) != 0.
   */
  function ImGui_TableSetColumnEnabled(
    ctx: ImGui_Context,
    column_n: number,
    v: boolean,
  ): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_TableSetColumnIndex(ImGui_Context ctx, integer column_n)
   * ```
   * Append into the specified column. Return true when column is visible.
   */
  function ImGui_TableSetColumnIndex(
    ctx: ImGui_Context,
    column_n: number,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_TableSetupColumn(ImGui_Context ctx, string label, optional integer flagsIn, optional number init_width_or_weightIn, optional integer user_idIn)
   * ```
   * Use to specify label, resizing policy, default width/weight, id,
   *
   * various other flags etc.
   */
  function ImGui_TableSetupColumn(
    ctx: ImGui_Context,
    label: string,
    flagsIn?: number,
    init_width_or_weightIn?: number,
    user_idIn?: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_TableSetupScrollFreeze(ImGui_Context ctx, integer cols, integer rows)
   * ```
   * Lock columns/rows so they stay visible when scrolled.
   */
  function ImGui_TableSetupScrollFreeze(
    ctx: ImGui_Context,
    cols: number,
    rows: number,
  ): void;

  /**
   * ```
   * reaper.ImGui_Text(ImGui_Context ctx, string text)
   * ```
   */
  function ImGui_Text(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_TextColored(ImGui_Context ctx, integer col_rgba, string text)
   * ```
   * Shortcut for PushStyleColor(Col_Text, color); Text(text); PopStyleColor();
   */
  function ImGui_TextColored(
    ctx: ImGui_Context,
    col_rgba: number,
    text: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_TextDisabled(ImGui_Context ctx, string text)
   * ```
   */
  function ImGui_TextDisabled(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * reaper.ImGui_TextFilter_Clear(ImGui_TextFilter filter)
   * ```
   */
  function ImGui_TextFilter_Clear(filter: ImGui_TextFilter): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_TextFilter_Draw(ImGui_TextFilter filter, ImGui_Context ctx, optional string labelIn, optional number widthIn)
   * ```
   * Helper calling InputText+TextFilter_Set
   */
  function ImGui_TextFilter_Draw(
    filter: ImGui_TextFilter,
    ctx: ImGui_Context,
    labelIn?: string,
    widthIn?: number,
  ): boolean;

  /**
   * ```
   * string _ = reaper.ImGui_TextFilter_Get(ImGui_TextFilter filter)
   * ```
   */
  function ImGui_TextFilter_Get(filter: ImGui_TextFilter): string;

  /**
   * ```
   * boolean _ = reaper.ImGui_TextFilter_IsActive(ImGui_TextFilter filter)
   * ```
   */
  function ImGui_TextFilter_IsActive(filter: ImGui_TextFilter): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_TextFilter_PassFilter(ImGui_TextFilter filter, string text)
   * ```
   */
  function ImGui_TextFilter_PassFilter(
    filter: ImGui_TextFilter,
    text: string,
  ): boolean;

  /**
   * ```
   * reaper.ImGui_TextFilter_Set(ImGui_TextFilter filter, string filter_text)
   * ```
   */
  function ImGui_TextFilter_Set(
    filter: ImGui_TextFilter,
    filter_text: string,
  ): void;

  /**
   * ```
   * reaper.ImGui_TextWrapped(ImGui_Context ctx, string text)
   * ```
   * Shortcut for PushTextWrapPos(0.0); Text(text); PopTextWrapPos();.
   *
   * Note that this won't work on an auto-resizing window if there's no other
   *
   * widgets to extend the window width, yoy may need to set a size using
   *
   * SetNextWindowSize.
   */
  function ImGui_TextWrapped(ctx: ImGui_Context, text: string): void;

  /**
   * ```
   * boolean _ = reaper.ImGui_TreeNode(ImGui_Context ctx, string label, optional integer flagsIn)
   * ```
   * TreeNode functions return true when the node is open, in which case you need
   *
   * to also call TreePop when you are finished displaying the tree node contents.
   */
  function ImGui_TreeNode(
    ctx: ImGui_Context,
    label: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.ImGui_TreeNodeEx(ImGui_Context ctx, string str_id, string label, optional integer flagsIn)
   * ```
   * Helper variation to easily decorelate the id from the displayed string.
   *
   * Read the [FAQ](https://dearimgui.com/faq) about why and how to use ID.
   *
   * To align arbitrary text at the same level as a TreeNode you can use Bullet.
   */
  function ImGui_TreeNodeEx(
    ctx: ImGui_Context,
    str_id: string,
    label: string,
    flagsIn?: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_AllowOverlap()
   * ```
   * Hit testing to allow subsequent widgets to overlap this one.
   */
  function ImGui_TreeNodeFlags_AllowOverlap(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_Bullet()
   * ```
   * Display a bullet instead of arrow. IMPORTANT: node can still be marked
   *
   *    open/close if you don't set the _Leaf flag!
   */
  function ImGui_TreeNodeFlags_Bullet(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_CollapsingHeader()
   * ```
   * TreeNodeFlags_Framed | TreeNodeFlags_NoTreePushOnOpen | TreeNodeFlags_NoAutoOpenOnLog
   */
  function ImGui_TreeNodeFlags_CollapsingHeader(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_DefaultOpen()
   * ```
   * Default node to be open.
   */
  function ImGui_TreeNodeFlags_DefaultOpen(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_FramePadding()
   * ```
   * Use FramePadding (even for an unframed text node) to vertically align text
   *
   *    baseline to regular widget height.
   *
   *    Equivalent to calling AlignTextToFramePadding before the node.
   */
  function ImGui_TreeNodeFlags_FramePadding(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_Framed()
   * ```
   * Draw frame with background (e.g. for CollapsingHeader).
   */
  function ImGui_TreeNodeFlags_Framed(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_Leaf()
   * ```
   * No collapsing, no arrow (use as a convenience for leaf nodes).
   */
  function ImGui_TreeNodeFlags_Leaf(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_NoAutoOpenOnLog()
   * ```
   * Don't automatically and temporarily open node when Logging is active
   *
   *    (by default logging will automatically open tree nodes).
   */
  function ImGui_TreeNodeFlags_NoAutoOpenOnLog(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_NoTreePushOnOpen()
   * ```
   * Don't do a TreePush when open (e.g. for CollapsingHeader)
   *
   *    = no extra indent nor pushing on ID stack.
   */
  function ImGui_TreeNodeFlags_NoTreePushOnOpen(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_None()
   * ```
   */
  function ImGui_TreeNodeFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_OpenOnArrow()
   * ```
   * Only open when clicking on the arrow part.
   *
   *    If TreeNodeFlags_OpenOnDoubleClick is also set, single-click arrow or
   *
   *    double-click all box to open.
   */
  function ImGui_TreeNodeFlags_OpenOnArrow(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_OpenOnDoubleClick()
   * ```
   * Need double-click to open node.
   */
  function ImGui_TreeNodeFlags_OpenOnDoubleClick(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_Selected()
   * ```
   * Draw as selected.
   */
  function ImGui_TreeNodeFlags_Selected(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_SpanAllColumns()
   * ```
   * Frame will span all columns of its container table (text will still fit in current column).
   */
  function ImGui_TreeNodeFlags_SpanAllColumns(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_SpanAvailWidth()
   * ```
   * Extend hit box to the right-most edge, even if not framed.
   *
   *    This is not the default in order to allow adding other items on the same line.
   *
   *    In the future we may refactor the hit system to be front-to-back,
   *
   *    allowing natural overlaps and then this can become the default.
   */
  function ImGui_TreeNodeFlags_SpanAvailWidth(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_SpanFullWidth()
   * ```
   * Extend hit box to the left-most and right-most edges (bypass the indented area).
   */
  function ImGui_TreeNodeFlags_SpanFullWidth(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_TreeNodeFlags_SpanTextWidth()
   * ```
   * Narrow hit box + narrow hovering highlight, will only cover the label text.
   */
  function ImGui_TreeNodeFlags_SpanTextWidth(): number;

  /**
   * ```
   * reaper.ImGui_TreePop(ImGui_Context ctx)
   * ```
   * Unindent()+PopID()
   */
  function ImGui_TreePop(ctx: ImGui_Context): void;

  /**
   * ```
   * reaper.ImGui_TreePush(ImGui_Context ctx, string str_id)
   * ```
   * Indent()+PushID(). Already called by TreeNode when returning true,
   *
   * but you can call TreePush/TreePop yourself if desired.
   */
  function ImGui_TreePush(ctx: ImGui_Context, str_id: string): void;

  /**
   * ```
   * reaper.ImGui_Unindent(ImGui_Context ctx, optional number indent_wIn)
   * ```
   * Move content position back to the left, by 'indent_w', or
   *
   * StyleVar_IndentSpacing if 'indent_w' <= 0
   */
  function ImGui_Unindent(ctx: ImGui_Context, indent_wIn?: number): void;

  /**
   * ```
   * boolean retval, number v = reaper.ImGui_VSliderDouble(ImGui_Context ctx, string label, number size_w, number size_h, number v, number v_min, number v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_VSliderDouble(
    ctx: ImGui_Context,
    label: string,
    size_w: number,
    size_h: number,
    v: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, integer v = reaper.ImGui_VSliderInt(ImGui_Context ctx, string label, number size_w, number size_h, integer v, integer v_min, integer v_max, optional string formatIn, optional integer flagsIn)
   * ```
   */
  function ImGui_VSliderInt(
    ctx: ImGui_Context,
    label: string,
    size_w: number,
    size_h: number,
    v: number,
    v_min: number,
    v_max: number,
    formatIn?: string,
    flagsIn?: number,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean _ = reaper.ImGui_ValidatePtr(identifier pointer, string type)
   * ```
   * Return whether the given pointer is a valid instance of one of the following
   *
   * types (indentation represents inheritance):
   *
   *
   *
   * - ImGui_Context*
   *
   * - ImGui_DrawList*
   *
   * - ImGui_DrawListSplitter*
   *
   * - ImGui_Font*
   *
   * - ImGui_Function*
   *
   * - ImGui_Image*
   *
   *   - ImGui_ImageSet*
   *
   * - ImGui_ListClipper*
   *
   * - ImGui_TextFilter*
   *
   * - ImGui_Viewport*
   */
  function ImGui_ValidatePtr(pointer: identifier, type: string): boolean;

  /**
   * ```
   * number x, number y = reaper.ImGui_Viewport_GetCenter(ImGui_Viewport viewport)
   * ```
   * Center of the viewport.
   */
  function ImGui_Viewport_GetCenter(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_Viewport_GetPos(ImGui_Viewport viewport)
   * ```
   * Main Area: Position of the viewport
   */
  function ImGui_Viewport_GetPos(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number w, number h = reaper.ImGui_Viewport_GetSize(ImGui_Viewport viewport)
   * ```
   * Main Area: Size of the viewport.
   */
  function ImGui_Viewport_GetSize(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_Viewport_GetWorkCenter(ImGui_Viewport viewport)
   * ```
   * Center of the viewport's work area.
   */
  function ImGui_Viewport_GetWorkCenter(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number x, number y = reaper.ImGui_Viewport_GetWorkPos(ImGui_Viewport viewport)
   * ```
   * >= Viewport_GetPos
   */
  function ImGui_Viewport_GetWorkPos(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number w, number h = reaper.ImGui_Viewport_GetWorkSize(ImGui_Viewport viewport)
   * ```
   * <= Viewport_GetSize
   */
  function ImGui_Viewport_GetWorkSize(
    viewport: ImGui_Viewport,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_AlwaysAutoResize()
   * ```
   * Resize every window to its content every frame.
   */
  function ImGui_WindowFlags_AlwaysAutoResize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_AlwaysHorizontalScrollbar()
   * ```
   * Always show horizontal scrollbar (even if ContentSize.x < Size.x).
   */
  function ImGui_WindowFlags_AlwaysHorizontalScrollbar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_AlwaysVerticalScrollbar()
   * ```
   * Always show vertical scrollbar (even if ContentSize.y < Size.y).
   */
  function ImGui_WindowFlags_AlwaysVerticalScrollbar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_HorizontalScrollbar()
   * ```
   * Allow horizontal scrollbar to appear (off by default).
   *
   *    You may use SetNextWindowContentSize(width, 0.0) prior to calling Begin() to
   *
   *    specify width. Read code in the demo's "Horizontal Scrolling" section.
   */
  function ImGui_WindowFlags_HorizontalScrollbar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_MenuBar()
   * ```
   * Has a menu-bar.
   */
  function ImGui_WindowFlags_MenuBar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoBackground()
   * ```
   * Disable drawing background color (WindowBg, etc.) and outside border.
   *
   *    Similar as using SetNextWindowBgAlpha(0.0).
   */
  function ImGui_WindowFlags_NoBackground(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoCollapse()
   * ```
   * Disable user collapsing window by double-clicking on it.
   *
   *    Also referred to as Window Menu Button (e.g. within a docking node).
   */
  function ImGui_WindowFlags_NoCollapse(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoDecoration()
   * ```
   * WindowFlags_NoTitleBar | WindowFlags_NoResize | WindowFlags_NoScrollbar |
   *
   *    WindowFlags_NoCollapse
   */
  function ImGui_WindowFlags_NoDecoration(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoDocking()
   * ```
   * Disable docking of this window.
   */
  function ImGui_WindowFlags_NoDocking(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoFocusOnAppearing()
   * ```
   * Disable taking focus when transitioning from hidden to visible state.
   */
  function ImGui_WindowFlags_NoFocusOnAppearing(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoInputs()
   * ```
   * WindowFlags_NoMouseInputs | WindowFlags_NoNavInputs | WindowFlags_NoNavFocus
   */
  function ImGui_WindowFlags_NoInputs(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoMouseInputs()
   * ```
   * Disable catching mouse, hovering test with pass through.
   */
  function ImGui_WindowFlags_NoMouseInputs(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoMove()
   * ```
   * Disable user moving the window.
   */
  function ImGui_WindowFlags_NoMove(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoNav()
   * ```
   * WindowFlags_NoNavInputs | WindowFlags_NoNavFocus
   */
  function ImGui_WindowFlags_NoNav(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoNavFocus()
   * ```
   * No focusing toward this window with gamepad/keyboard navigation
   *
   *    (e.g. skipped by CTRL+TAB).
   */
  function ImGui_WindowFlags_NoNavFocus(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoNavInputs()
   * ```
   * No gamepad/keyboard navigation within the window.
   */
  function ImGui_WindowFlags_NoNavInputs(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoResize()
   * ```
   * Disable user resizing with the lower-right grip.
   */
  function ImGui_WindowFlags_NoResize(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoSavedSettings()
   * ```
   * Never load/save settings in .ini file.
   */
  function ImGui_WindowFlags_NoSavedSettings(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoScrollWithMouse()
   * ```
   * Disable user vertically scrolling with mouse wheel.
   *
   *    On child window, mouse wheel will be forwarded to the parent unless
   *
   *    NoScrollbar is also set.
   */
  function ImGui_WindowFlags_NoScrollWithMouse(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoScrollbar()
   * ```
   * Disable scrollbars (window can still scroll with mouse or programmatically).
   */
  function ImGui_WindowFlags_NoScrollbar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_NoTitleBar()
   * ```
   * Disable title-bar.
   */
  function ImGui_WindowFlags_NoTitleBar(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_None()
   * ```
   * Default flag.
   */
  function ImGui_WindowFlags_None(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_TopMost()
   * ```
   * Show the window above all non-topmost windows.
   */
  function ImGui_WindowFlags_TopMost(): number;

  /**
   * ```
   * integer _ = reaper.ImGui_WindowFlags_UnsavedDocument()
   * ```
   * Display a dot next to the title. When used in a tab/docking context,
   *
   *    tab is selected when clicking the X + closure is not assumed
   *
   *    (will wait for user to stop submitting the tab).
   *
   *    Otherwise closure is assumed when pressing the X,
   *
   *    so if you keep submitting the tab may reappear at end of tab bar.
   */
  function ImGui_WindowFlags_UnsavedDocument(): number;

  /**
   * ```
   * identifier _ = reaper.ImGui__getapi(string version, string symbol_name)
   * ```
   * Internal use only.
   */
  function ImGui__getapi(version: string, symbol_name: string): identifier;

  /**
   * ```
   * string _ = reaper.ImGui__geterr()
   * ```
   * Internal use only.
   */
  function ImGui__geterr(): string;

  /**
   * ```
   * string buf = reaper.ImGui__init(string buf)
   * ```
   * Internal use only.
   */
  function ImGui__init(buf: string): string;

  /**
   * ```
   * reaper.ImGui__setshim(string version, string symbol_name)
   * ```
   * Internal use only.
   */
  function ImGui__setshim(version: string, symbol_name: string): void;

  /**
   * ```
   * reaper.ImGui__shim()
   * ```
   * Internal use only.
   */
  function ImGui__shim(): void;

  /**
   * ```
   * string _ = reaper.JB_GetSWSExtraProjectNotes(ReaProject project)
   * ```
   */
  function JB_GetSWSExtraProjectNotes(project: ReaProject): string;

  /**
   * ```
   * reaper.JB_SetSWSExtraProjectNotes(ReaProject project, string str)
   * ```
   */
  function JB_SetSWSExtraProjectNotes(project: ReaProject, str: string): void;

  /**
   * ```
   * integer _ = reaper.JS_Actions_CountShortcuts(integer section, integer cmdID)
   * ```
   * Section:
   *
   * 0 = Main, 100 = Main (alt recording), 32060 = MIDI Editor, 32061 = MIDI Event List Editor, 32062 = MIDI Inline Editor, 32063 = Media Explorer.
   */
  function JS_Actions_CountShortcuts(section: number, cmdID: number): number;

  /**
   * ```
   * boolean _ = reaper.JS_Actions_DeleteShortcut(integer section, integer cmdID, integer shortcutidx)
   * ```
   * Section:
   *
   * 0 = Main, 100 = Main (alt recording), 32060 = MIDI Editor, 32061 = MIDI Event List Editor, 32062 = MIDI Inline Editor, 32063 = Media Explorer.
   */
  function JS_Actions_DeleteShortcut(
    section: number,
    cmdID: number,
    shortcutidx: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Actions_DoShortcutDialog(integer section, integer cmdID, integer shortcutidx)
   * ```
   * Section:
   *
   * 0 = Main, 100 = Main (alt recording), 32060 = MIDI Editor, 32061 = MIDI Event List Editor, 32062 = MIDI Inline Editor, 32063 = Media Explorer.
   *
   *
   *
   * If the shortcut index is higher than the current number of shortcuts, it will add a new shortcut.
   */
  function JS_Actions_DoShortcutDialog(
    section: number,
    cmdID: number,
    shortcutidx: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string desc = reaper.JS_Actions_GetShortcutDesc(integer section, integer cmdID, integer shortcutidx)
   * ```
   * Section:
   *
   * 0 = Main, 100 = Main (alt recording), 32060 = MIDI Editor, 32061 = MIDI Event List Editor, 32062 = MIDI Inline Editor, 32063 = Media Explorer.
   */
  function JS_Actions_GetShortcutDesc(
    section: number,
    cmdID: number,
    shortcutidx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer byte = reaper.JS_Byte(identifier pointer, integer offset)
   * ```
   * Returns the unsigned byte at address[offset]. Offset is added as steps of 1 byte each.
   */
  function JS_Byte(pointer: identifier, offset: number): number;

  /**
   * ```
   * integer _ = reaper.JS_Composite(identifier windowHWND, integer dstx, integer dsty, integer dstw, integer dsth, identifier sysBitmap, integer srcx, integer srcy, integer srcw, integer srch, unsupported autoUpdate)
   * ```
   * Composites a LICE bitmap with a REAPER window.  Each time that the window is re-drawn, the bitmap will be blitted over the window's client area (with per-pixel alpha blending).
   *
   *
   *
   *  * If dstw or dsth is -1, the bitmap will be stretched to fill the width or height of the window, respectively.
   *
   *
   *
   *  * autoUpdate is an optional parameter that is false by default. If true, JS_Composite will automatically invalidate and re-draw the part of the window that covers the current position of the bitmap, and if the bitmap is being moved, also the previous position. (If only one or a handful of bitmaps are being moved across the screen, autoUpdate should result in smoother animation on WindowsOS; if numerous bitmaps are spread over the entire window, it may be faster to disable autoUpdate and instead call JS_Window_InvalidateRect explicitly once all bitmaps have been moved.)
   *
   *
   *
   *  * InvalidateRect should also be called whenever the contents of the bitmap contents have been changed, but not the position, to trigger a window update.
   *
   *
   *
   *  * On WindowsOS, the key to reducing flickering is to slow down the frequency at which the window is re-drawn. InvalidateRect should only be called when absolutely necessary, preferably not more than 20 times per second.  (Also refer to the JS_Composite_Delay function.)
   *
   *
   *
   *  * On WindowsOS, flickering can further be reduced by keeping the invalidated area as small as possible, covering only the bitmaps that have been edited or moved.  However, if numerous bitmaps are spread over the entire window, it may be faster to simply invalidate the entire client area.
   *
   *
   *
   *  * This function should not be applied directly to top-level windows, but rather to child windows.
   *
   *
   *
   *  * Some classes of UI elements, particularly buttons, do not take kindly to being composited, and may crash REAPER.
   *
   *
   *
   *  * On WindowsOS, GDI blitting does not perform alpha multiplication of the source bitmap. For proper color rendering, a separate pre-multiplication step is therefore required, using either LICE_Blit or LICE_ProcessRect.
   *
   *
   *
   * Returns:
   *
   * 1 if successful, otherwise -1 = windowHWND is not a window, -3 = Could not obtain the original window process, -4 = sysBitmap is not a LICE bitmap, -5 = sysBitmap is not a system bitmap, -6 = Could not obtain the window HDC, -7 = Error when subclassing to new window process.
   */
  function JS_Composite(
    windowHWND: identifier,
    dstx: number,
    dsty: number,
    dstw: number,
    dsth: number,
    sysBitmap: identifier,
    srcx: number,
    srcy: number,
    srcw: number,
    srch: number,
    autoUpdate: unsupported,
  ): number;

  /**
   * ```
   * integer retval, number prevMinTime, number prevMaxTime, integer prevBitmaps = reaper.JS_Composite_Delay(identifier windowHWND, number minTime, number maxTime, integer numBitmapsWhenMax)
   * ```
   * On WindowsOS, flickering of composited images can be improved considerably by slowing the refresh rate of the window.  The optimal refresh rate may depend on the number of composited bitmaps.
   *
   *
   *
   * minTime is the minimum refresh delay, in seconds, when only one bitmap is composited onto the window.  The delay time will increase linearly with the number of bitmaps, up to a maximum of maxTime when numBitmapsWhenMax is reached.
   *
   *
   *
   * If both minTime and maxTime are 0, all delay settings for the window are cleared.
   *
   *
   *
   * Returns:
   *
   *  * retval = 1 if successful, 0 if arguments are invalid (i.e. if maxTime < minTime, or maxBitmaps < 1).
   *
   *  * If delay times have not previously been set for this window, prev time values are 0.
   */
  function JS_Composite_Delay(
    windowHWND: identifier,
    minTime: number,
    maxTime: number,
    numBitmapsWhenMax: number,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * integer retval, string list = reaper.JS_Composite_ListBitmaps(identifier windowHWND)
   * ```
   * Returns all bitmaps composited to the given window.
   *
   *
   *
   * The list is formatted as a comma-separated string of hexadecimal values, each representing a LICE_IBitmap* pointer.
   *
   *
   *
   * retval is the number of linked bitmaps found, or negative if an error occured.
   */
  function JS_Composite_ListBitmaps(
    windowHWND: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * reaper.JS_Composite_Unlink(identifier windowHWND, identifier bitmap, unsupported autoUpdate)
   * ```
   * Unlinks the window and bitmap.
   *
   *
   *
   *  * autoUpdate is an optional parameter. If unlinking a single bitmap and autoUpdate is true, the function will automatically re-draw the window to remove the blitted image.
   *
   *
   *
   * If no bitmap is specified, all bitmaps composited to the window will be unlinked -- even those by other scripts.
   */
  function JS_Composite_Unlink(
    windowHWND: identifier,
    bitmap: identifier,
    autoUpdate: unsupported,
  ): void;

  /**
   * ```
   * integer retval, string folder = reaper.JS_Dialog_BrowseForFolder(string caption, string initialFolder)
   * ```
   * retval is 1 if a file was selected, 0 if the user cancelled the dialog, and -1 if an error occurred.
   */
  function JS_Dialog_BrowseForFolder(
    caption: string,
    initialFolder: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer retval, string fileNames = reaper.JS_Dialog_BrowseForOpenFiles(string windowTitle, string initialFolder, string initialFile, string extensionList, boolean allowMultiple)
   * ```
   * If allowMultiple is true, multiple files may be selected. The returned string is \0-separated, with the first substring containing the folder path and subsequent substrings containing the file names.
   *
   *  * On macOS, the first substring may be empty, and each file name will then contain its entire path.
   *
   *  * This function only allows selection of existing files, and does not allow creation of new files.
   *
   *
   *
   * extensionList is a string containing pairs of \0-terminated substrings. The last substring must be terminated by two \0 characters. Each pair defines one filter pattern:
   *
   *  * The first substring in each pair describes the filter in user-readable form (for example, "Lua script files (*.lua)") and will be displayed in the dialog box.
   *
   *  * The second substring specifies the filter that the operating system must use to search for the files (for example, "*.txt"; the wildcard should not be omitted). To specify multiple extensions for a single display string, use a semicolon to separate the patterns (for example, "*.lua;*.eel").
   *
   *
   *
   * An example of an extensionList string:
   *
   * "ReaScript files\0*.lua;*.eel\0Lua files (.lua)\0*.lua\0EEL files (.eel)\0*.eel\0\0".
   *
   *
   *
   * On macOS, file dialogs do not accept empty extensionLists, nor wildcard extensions (such as "All files\0*.*\0\0"), so each acceptable extension must be listed explicitly. On Linux and Windows, wildcard extensions are acceptable, and if the extensionList string is empty, the dialog will display a default "All files (*.*)" filter.
   *
   *
   *
   * retval is 1 if one or more files were selected, 0 if the user cancelled the dialog, or negative if an error occurred.
   *
   *
   *
   * Displaying \0-separated strings:
   *
   *  * REAPER's IDE and ShowConsoleMsg only display strings up to the first \0 byte. If multiple files were selected, only the first substring containing the path will be displayed. This is not a problem for Lua or EEL, which can access the full string beyond the first \0 byte as usual.
   */
  function JS_Dialog_BrowseForOpenFiles(
    windowTitle: string,
    initialFolder: string,
    initialFile: string,
    extensionList: string,
    allowMultiple: boolean,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer retval, string fileName = reaper.JS_Dialog_BrowseForSaveFile(string windowTitle, string initialFolder, string initialFile, string extensionList)
   * ```
   * retval is 1 if a file was selected, 0 if the user cancelled the dialog, or negative if an error occurred.
   *
   *
   *
   * extensionList is as described for JS_Dialog_BrowseForOpenFiles.
   */
  function JS_Dialog_BrowseForSaveFile(
    windowTitle: string,
    initialFolder: string,
    initialFile: string,
    extensionList: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * number double = reaper.JS_Double(identifier pointer, integer offset)
   * ```
   * Returns the 8-byte floating point value at address[offset]. Offset is added as steps of 8 bytes each.
   */
  function JS_Double(pointer: identifier, offset: number): number;

  /**
   * ```
   * integer retval, number size, string accessedTime, string modifiedTime, string cTime, integer deviceID, integer deviceSpecialID, integer inode, integer mode, integer numLinks, integer ownerUserID, integer ownerGroupID = reaper.JS_File_Stat(string filePath)
   * ```
   * Returns information about a file.
   *
   *
   *
   * cTime is not implemented on all systems. If it does return a time, the value may differ depending on the OS: on WindowsOS, it may refer to the time that the file was either created or copied, whereas on Linux and macOS, it may refer to the time of last status change.
   *
   *
   *
   * retval is 0 if successful, negative if not.
   */
  function JS_File_Stat(
    filePath: string,
  ): LuaMultiReturn<
    [
      number,
      number,
      string,
      string,
      string,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ]
  >;

  /**
   * ```
   * reaper.JS_GDI_Blit(identifier destHDC, integer dstx, integer dsty, identifier sourceHDC, integer srcx, integer srxy, integer width, integer height, optional string mode)
   * ```
   * Blits between two device contexts, which may include LICE "system bitmaps".
   *
   *
   *
   * mode: Optional parameter. "SRCCOPY" by default, or specify "ALPHA" to enable per-pixel alpha blending.
   *
   *
   *
   * WARNING: On WindowsOS, GDI_Blit does not perform alpha multiplication of the source bitmap. For proper color rendering, a separate pre-multiplication step is therefore required, using either LICE_Blit or LICE_ProcessRect.
   */
  function JS_GDI_Blit(
    destHDC: identifier,
    dstx: number,
    dsty: number,
    sourceHDC: identifier,
    srcx: number,
    srxy: number,
    width: number,
    height: number,
    mode?: string,
  ): void;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_CreateFillBrush(integer color)
   * ```
   */
  function JS_GDI_CreateFillBrush(color: number): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_CreateFont(integer height, integer weight, integer angle, boolean italic, boolean underline, boolean strike, string fontName)
   * ```
   * Parameters:
   *
   *  * weight: 0 - 1000, with 0 = auto, 400 = normal and 700 = bold.
   *
   *  * angle: the angle, in tenths of degrees, between the text and the x-axis of the device.
   *
   *  * fontName: If empty string "", uses first font that matches the other specified attributes.
   *
   *
   *
   * Note: Text color must be set separately.
   */
  function JS_GDI_CreateFont(
    height: number,
    weight: number,
    angle: number,
    italic: boolean,
    underline: boolean,
    strike: boolean,
    fontName: string,
  ): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_CreatePen(integer width, integer color)
   * ```
   */
  function JS_GDI_CreatePen(width: number, color: number): identifier;

  /**
   * ```
   * reaper.JS_GDI_DeleteObject(identifier GDIObject)
   * ```
   */
  function JS_GDI_DeleteObject(GDIObject: identifier): void;

  /**
   * ```
   * integer _ = reaper.JS_GDI_DrawText(identifier deviceHDC, string text, integer len, integer left, integer top, integer right, integer bottom, string align)
   * ```
   * Parameters:
   *
   *  * align: Combination of: "TOP", "VCENTER", "LEFT", "HCENTER", "RIGHT", "BOTTOM", "WORDBREAK", "SINGLELINE", "NOCLIP", "CALCRECT", "NOPREFIX" or "ELLIPSIS"
   */
  function JS_GDI_DrawText(
    deviceHDC: identifier,
    text: string,
    len: number,
    left: number,
    top: number,
    right: number,
    bottom: number,
    align: string,
  ): number;

  /**
   * ```
   * reaper.JS_GDI_FillEllipse(identifier deviceHDC, integer left, integer top, integer right, integer bottom)
   * ```
   */
  function JS_GDI_FillEllipse(
    deviceHDC: identifier,
    left: number,
    top: number,
    right: number,
    bottom: number,
  ): void;

  /**
   * ```
   * reaper.JS_GDI_FillPolygon(identifier deviceHDC, string packedX, string packedY, integer numPoints)
   * ```
   * packedX and packedY are strings of points, each packed as "<i4".
   */
  function JS_GDI_FillPolygon(
    deviceHDC: identifier,
    packedX: string,
    packedY: string,
    numPoints: number,
  ): void;

  /**
   * ```
   * reaper.JS_GDI_FillRect(identifier deviceHDC, integer left, integer top, integer right, integer bottom)
   * ```
   */
  function JS_GDI_FillRect(
    deviceHDC: identifier,
    left: number,
    top: number,
    right: number,
    bottom: number,
  ): void;

  /**
   * ```
   * reaper.JS_GDI_FillRoundRect(identifier deviceHDC, integer left, integer top, integer right, integer bottom, integer xrnd, integer yrnd)
   * ```
   */
  function JS_GDI_FillRoundRect(
    deviceHDC: identifier,
    left: number,
    top: number,
    right: number,
    bottom: number,
    xrnd: number,
    yrnd: number,
  ): void;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_GetClientDC(identifier windowHWND)
   * ```
   * Returns the device context for the client area of the specified window.
   */
  function JS_GDI_GetClientDC(windowHWND: identifier): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_GetScreenDC()
   * ```
   * Returns a device context for the entire screen.
   *
   *
   *
   * WARNING: Only available on Windows, not Linux or macOS.
   */
  function JS_GDI_GetScreenDC(): identifier;

  /**
   * ```
   * integer _ = reaper.JS_GDI_GetSysColor(string GUIElement)
   * ```
   */
  function JS_GDI_GetSysColor(GUIElement: string): number;

  /**
   * ```
   * integer _ = reaper.JS_GDI_GetTextColor(identifier deviceHDC)
   * ```
   */
  function JS_GDI_GetTextColor(deviceHDC: identifier): number;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_GetWindowDC(identifier windowHWND)
   * ```
   * Returns the device context for the entire window, including title bar and frame.
   */
  function JS_GDI_GetWindowDC(windowHWND: identifier): identifier;

  /**
   * ```
   * reaper.JS_GDI_Line(identifier deviceHDC, integer x1, integer y1, integer x2, integer y2)
   * ```
   */
  function JS_GDI_Line(
    deviceHDC: identifier,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void;

  /**
   * ```
   * reaper.JS_GDI_Polyline(identifier deviceHDC, string packedX, string packedY, integer numPoints)
   * ```
   * packedX and packedY are strings of points, each packed as "<i4".
   */
  function JS_GDI_Polyline(
    deviceHDC: identifier,
    packedX: string,
    packedY: string,
    numPoints: number,
  ): void;

  /**
   * ```
   * integer _ = reaper.JS_GDI_ReleaseDC(identifier deviceHDC, identifier windowHWND)
   * ```
   * To release a window HDC, both arguments must be supplied: the HWND as well as the HDC.  To release a screen DC, only the HDC needs to be supplied.
   *
   *
   *
   * For compatibility with previous versions, the HWND and HDC can be supplied in any order.
   *
   *
   *
   * NOTE: Any GDI HDC should be released immediately after drawing, and deferred scripts should get and release new DCs in each cycle.
   */
  function JS_GDI_ReleaseDC(
    deviceHDC: identifier,
    windowHWND: identifier,
  ): number;

  /**
   * ```
   * identifier _ = reaper.JS_GDI_SelectObject(identifier deviceHDC, identifier GDIObject)
   * ```
   * Activates a font, pen, or fill brush for subsequent drawing in the specified device context.
   */
  function JS_GDI_SelectObject(
    deviceHDC: identifier,
    GDIObject: identifier,
  ): identifier;

  /**
   * ```
   * reaper.JS_GDI_SetPixel(identifier deviceHDC, integer x, integer y, integer color)
   * ```
   */
  function JS_GDI_SetPixel(
    deviceHDC: identifier,
    x: number,
    y: number,
    color: number,
  ): void;

  /**
   * ```
   * reaper.JS_GDI_SetTextBkColor(identifier deviceHDC, integer color)
   * ```
   */
  function JS_GDI_SetTextBkColor(deviceHDC: identifier, color: number): void;

  /**
   * ```
   * reaper.JS_GDI_SetTextBkMode(identifier deviceHDC, integer mode)
   * ```
   */
  function JS_GDI_SetTextBkMode(deviceHDC: identifier, mode: number): void;

  /**
   * ```
   * reaper.JS_GDI_SetTextColor(identifier deviceHDC, integer color)
   * ```
   */
  function JS_GDI_SetTextColor(deviceHDC: identifier, color: number): void;

  /**
   * ```
   * reaper.JS_GDI_StretchBlit(identifier destHDC, integer dstx, integer dsty, integer dstw, integer dsth, identifier sourceHDC, integer srcx, integer srxy, integer srcw, integer srch, optional string mode)
   * ```
   * Blits between two device contexts, which may include LICE "system bitmaps".
   *
   *
   *
   * modeOptional: "SRCCOPY" by default, or specify "ALPHA" to enable per-pixel alpha blending.
   *
   *
   *
   * WARNING: On WindowsOS, GDI_Blit does not perform alpha multiplication of the source bitmap. For proper color rendering, a separate pre-multiplication step is therefore required, using either LICE_Blit or LICE_ProcessRect.
   */
  function JS_GDI_StretchBlit(
    destHDC: identifier,
    dstx: number,
    dsty: number,
    dstw: number,
    dsth: number,
    sourceHDC: identifier,
    srcx: number,
    srxy: number,
    srcw: number,
    srch: number,
    mode?: string,
  ): void;

  /**
   * ```
   * integer _ = reaper.JS_Header_GetItemCount(identifier headerHWND)
   * ```
   */
  function JS_Header_GetItemCount(headerHWND: identifier): number;

  /**
   * ```
   * integer int = reaper.JS_Int(identifier pointer, integer offset)
   * ```
   * Returns the 4-byte signed integer at address[offset]. Offset is added as steps of 4 bytes each.
   */
  function JS_Int(pointer: identifier, offset: number): number;

  /**
   * ```
   * reaper.JS_LICE_AlterBitmapHSV(identifier bitmap, number hue, number saturation, number value)
   * ```
   * Hue is rolled over, saturation and value are clamped, all 0..1. (Alpha remains unchanged.)
   */
  function JS_LICE_AlterBitmapHSV(
    bitmap: identifier,
    hue: number,
    saturation: number,
    value: number,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_AlterRectHSV(identifier bitmap, integer x, integer y, integer w, integer h, number hue, number saturation, number value)
   * ```
   * Hue is rolled over, saturation and value are clamped, all 0..1. (Alpha remains unchanged.)
   */
  function JS_LICE_AlterRectHSV(
    bitmap: identifier,
    x: number,
    y: number,
    w: number,
    h: number,
    hue: number,
    saturation: number,
    value: number,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_Arc(identifier bitmap, number cx, number cy, number r, number minAngle, number maxAngle, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_Arc(
    bitmap: identifier,
    cx: number,
    cy: number,
    r: number,
    minAngle: number,
    maxAngle: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * integer _ = reaper.JS_LICE_ArrayAllBitmaps(identifier reaperarray)
   * ```
   */
  function JS_LICE_ArrayAllBitmaps(reaperarray: identifier): number;

  /**
   * ```
   * reaper.JS_LICE_Bezier(identifier bitmap, number xstart, number ystart, number xctl1, number yctl1, number xctl2, number yctl2, number xend, number yend, number tol, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA" to enable per-pixel alpha blending.
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_Bezier(
    bitmap: identifier,
    xstart: number,
    ystart: number,
    xctl1: number,
    yctl1: number,
    xctl2: number,
    yctl2: number,
    xend: number,
    yend: number,
    tol: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_Blit(identifier destBitmap, integer dstx, integer dsty, identifier sourceBitmap, integer srcx, integer srcy, integer width, integer height, number alpha, string mode)
   * ```
   * Standard LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA" to enable per-pixel alpha blending.
   *
   *
   *
   * In addition to the standard LICE modes, LICE_Blit also offers:
   *
   *  * "CHANCOPY_XTOY", with X and Y any of the four channels, A, R, G or B. (CHANCOPY_ATOA is similar to MASK mode.)
   *
   *  * "BLUR"
   *
   *  * "ALPHAMUL", which overwrites the destination with a per-pixel alpha-multiplied copy of the source. (Similar to first clearing the destination with 0x00000000 and then blitting with "COPY,ALPHA".)
   */
  function JS_LICE_Blit(
    destBitmap: identifier,
    dstx: number,
    dsty: number,
    sourceBitmap: identifier,
    srcx: number,
    srcy: number,
    width: number,
    height: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_Circle(identifier bitmap, number cx, number cy, number r, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_Circle(
    bitmap: identifier,
    cx: number,
    cy: number,
    r: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_Clear(identifier bitmap, integer color)
   * ```
   */
  function JS_LICE_Clear(bitmap: identifier, color: number): void;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_CreateBitmap(boolean isSysBitmap, integer width, integer height)
   * ```
   */
  function JS_LICE_CreateBitmap(
    isSysBitmap: boolean,
    width: number,
    height: number,
  ): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_CreateFont()
   * ```
   */
  function JS_LICE_CreateFont(): identifier;

  /**
   * ```
   * reaper.JS_LICE_DestroyBitmap(identifier bitmap)
   * ```
   * Deletes the bitmap, and also unlinks bitmap from any composited window.
   */
  function JS_LICE_DestroyBitmap(bitmap: identifier): void;

  /**
   * ```
   * reaper.JS_LICE_DestroyFont(identifier LICEFont)
   * ```
   */
  function JS_LICE_DestroyFont(LICEFont: identifier): void;

  /**
   * ```
   * reaper.JS_LICE_DrawChar(identifier bitmap, integer x, integer y, integer c, integer color, number alpha, integer mode)
   * ```
   */
  function JS_LICE_DrawChar(
    bitmap: identifier,
    x: number,
    y: number,
    c: number,
    color: number,
    alpha: number,
    mode: number,
  ): void;

  /**
   * ```
   * integer _ = reaper.JS_LICE_DrawText(identifier bitmap, identifier LICEFont, string text, integer textLen, integer x1, integer y1, integer x2, integer y2)
   * ```
   */
  function JS_LICE_DrawText(
    bitmap: identifier,
    LICEFont: identifier,
    text: string,
    textLen: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number;

  /**
   * ```
   * reaper.JS_LICE_FillCircle(identifier bitmap, number cx, number cy, number r, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_FillCircle(
    bitmap: identifier,
    cx: number,
    cy: number,
    r: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_FillPolygon(identifier bitmap, string packedX, string packedY, integer numPoints, integer color, number alpha, string mode)
   * ```
   * packedX and packedY are two strings of coordinates, each packed as "<i4".
   *
   *
   *
   * LICE modes : "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA" to enable per-pixel alpha blending.
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_FillPolygon(
    bitmap: identifier,
    packedX: string,
    packedY: string,
    numPoints: number,
    color: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_FillRect(identifier bitmap, integer x, integer y, integer w, integer h, integer color, number alpha, string mode)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_FillRect(
    bitmap: identifier,
    x: number,
    y: number,
    w: number,
    h: number,
    color: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_FillTriangle(identifier bitmap, integer x1, integer y1, integer x2, integer y2, integer x3, integer y3, integer color, number alpha, string mode)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_FillTriangle(
    bitmap: identifier,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    color: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_GetDC(identifier bitmap)
   * ```
   */
  function JS_LICE_GetDC(bitmap: identifier): identifier;

  /**
   * ```
   * integer _ = reaper.JS_LICE_GetHeight(identifier bitmap)
   * ```
   */
  function JS_LICE_GetHeight(bitmap: identifier): number;

  /**
   * ```
   * number color = reaper.JS_LICE_GetPixel(identifier bitmap, integer x, integer y)
   * ```
   * Returns the color of the specified pixel.
   */
  function JS_LICE_GetPixel(bitmap: identifier, x: number, y: number): number;

  /**
   * ```
   * integer _ = reaper.JS_LICE_GetWidth(identifier bitmap)
   * ```
   */
  function JS_LICE_GetWidth(bitmap: identifier): number;

  /**
   * ```
   * reaper.JS_LICE_GradRect(identifier bitmap, integer dstx, integer dsty, integer dstw, integer dsth, number ir, number ig, number ib, number ia, number drdx, number dgdx, number dbdx, number dadx, number drdy, number dgdy, number dbdy, number dady, string mode)
   * ```
   */
  function JS_LICE_GradRect(
    bitmap: identifier,
    dstx: number,
    dsty: number,
    dstw: number,
    dsth: number,
    ir: number,
    ig: number,
    ib: number,
    ia: number,
    drdx: number,
    dgdx: number,
    dbdx: number,
    dadx: number,
    drdy: number,
    dgdy: number,
    dbdy: number,
    dady: number,
    mode: string,
  ): void;

  /**
   * ```
   * boolean _ = reaper.JS_LICE_IsFlipped(identifier bitmap)
   * ```
   */
  function JS_LICE_IsFlipped(bitmap: identifier): boolean;

  /**
   * ```
   * reaper.JS_LICE_Line(identifier bitmap, number x1, number y1, number x2, number y2, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_Line(
    bitmap: identifier,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * integer retval, string list = reaper.JS_LICE_ListAllBitmaps()
   * ```
   */
  function JS_LICE_ListAllBitmaps(): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_LoadJPG(string filename)
   * ```
   * Returns a system LICE bitmap containing the JPEG.
   */
  function JS_LICE_LoadJPG(filename: string): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_LoadJPGFromMemory(string buffer, integer bufsize)
   * ```
   * Returns a system LICE bitmap containing the JPEG.
   */
  function JS_LICE_LoadJPGFromMemory(
    buffer: string,
    bufsize: number,
  ): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_LoadPNG(string filename)
   * ```
   * Returns a system LICE bitmap containing the PNG.
   */
  function JS_LICE_LoadPNG(filename: string): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_LICE_LoadPNGFromMemory(string buffer, integer bufsize)
   * ```
   * Returns a system LICE bitmap containing the PNG.
   */
  function JS_LICE_LoadPNGFromMemory(
    buffer: string,
    bufsize: number,
  ): identifier;

  /**
   * ```
   * integer width, integer Height = reaper.JS_LICE_MeasureText(string text)
   * ```
   */
  function JS_LICE_MeasureText(text: string): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * boolean _ = reaper.JS_LICE_ProcessRect(identifier bitmap, integer x, integer y, integer w, integer h, string mode, number operand)
   * ```
   * Applies bitwise operations to each pixel in the target rectangle.
   *
   *
   *
   * operand: a color in 0xAARRGGBB format.
   *
   *
   *
   * modes:
   *
   *  * "XOR", "OR" or "AND".
   *
   *  * "SET_XYZ", with XYZ any combination of A, R, G, and B: copies the specified channels from operand to the bitmap. (Useful for setting the alpha values of a bitmap.)
   *
   *  * "ALPHAMUL": Performs alpha pre-multiplication on each pixel in the rect. operand is ignored in this mode. (On WindowsOS, GDI_Blit does not perform alpha multiplication on the fly, and a separate alpha pre-multiplication step is therefore required.)
   *
   *
   *
   * NOTE:
   *
   * LICE_Blit and LICE_ScaledBlit are also useful for processing bitmap colors. For example, to multiply all channel values by 1.5:
   *
   * reaper.JS_LICE_Blit(bitmap, x, y, bitmap, x, y, w, h, 0.5, "ADD").
   */
  function JS_LICE_ProcessRect(
    bitmap: identifier,
    x: number,
    y: number,
    w: number,
    h: number,
    mode: string,
    operand: number,
  ): boolean;

  /**
   * ```
   * reaper.JS_LICE_PutPixel(identifier bitmap, integer x, integer y, number color, number alpha, string mode)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_PutPixel(
    bitmap: identifier,
    x: number,
    y: number,
    color: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_Resize(identifier bitmap, integer width, integer height)
   * ```
   */
  function JS_LICE_Resize(
    bitmap: identifier,
    width: number,
    height: number,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_RotatedBlit(identifier destBitmap, integer dstx, integer dsty, integer dstw, integer dsth, identifier sourceBitmap, number srcx, number srcy, number srcw, number srch, number angle, number rotxcent, number rotycent, boolean cliptosourcerect, number alpha, string mode)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA" to enable per-pixel alpha blending.
   */
  function JS_LICE_RotatedBlit(
    destBitmap: identifier,
    dstx: number,
    dsty: number,
    dstw: number,
    dsth: number,
    sourceBitmap: identifier,
    srcx: number,
    srcy: number,
    srcw: number,
    srch: number,
    angle: number,
    rotxcent: number,
    rotycent: number,
    cliptosourcerect: boolean,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_RoundRect(identifier bitmap, number x, number y, number w, number h, integer cornerradius, integer color, number alpha, string mode, boolean antialias)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA".
   *
   *
   *
   * LICE color format: 0xAARRGGBB (AA is only used in ALPHA mode).
   */
  function JS_LICE_RoundRect(
    bitmap: identifier,
    x: number,
    y: number,
    w: number,
    h: number,
    cornerradius: number,
    color: number,
    alpha: number,
    mode: string,
    antialias: boolean,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_ScaledBlit(identifier destBitmap, integer dstx, integer dsty, integer dstw, integer dsth, identifier srcBitmap, number srcx, number srcy, number srcw, number srch, number alpha, string mode)
   * ```
   * LICE modes: "COPY" (default if empty string), "MASK", "ADD", "DODGE", "MUL", "OVERLAY" or "HSVADJ", any of which may be combined with "ALPHA" to enable per-pixel alpha blending.
   */
  function JS_LICE_ScaledBlit(
    destBitmap: identifier,
    dstx: number,
    dsty: number,
    dstw: number,
    dsth: number,
    srcBitmap: identifier,
    srcx: number,
    srcy: number,
    srcw: number,
    srch: number,
    alpha: number,
    mode: string,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_SetAlphaFromColorMask(identifier bitmap, integer colorRGB)
   * ```
   * Sets all pixels that match the given color's RGB values to fully transparent, and all other pixels to fully opaque.  (All pixels' RGB values remain unchanged.)
   */
  function JS_LICE_SetAlphaFromColorMask(
    bitmap: identifier,
    colorRGB: number,
  ): void;

  /**
   * ```
   * reaper.JS_LICE_SetFontBkColor(identifier LICEFont, integer color)
   * ```
   * Sets the color of the font background.
   */
  function JS_LICE_SetFontBkColor(LICEFont: identifier, color: number): void;

  /**
   * ```
   * reaper.JS_LICE_SetFontColor(identifier LICEFont, integer color)
   * ```
   */
  function JS_LICE_SetFontColor(LICEFont: identifier, color: number): void;

  /**
   * ```
   * reaper.JS_LICE_SetFontFXColor(identifier LICEFont, integer color)
   * ```
   * Sets the color of font FX such as shadow.
   */
  function JS_LICE_SetFontFXColor(LICEFont: identifier, color: number): void;

  /**
   * ```
   * reaper.JS_LICE_SetFontFromGDI(identifier LICEFont, identifier GDIFont, string moreFormats)
   * ```
   * Converts a GDI font into a LICE font.
   *
   *
   *
   * The font can be modified by the following flags, in a comma-separated list:
   *
   * "VERTICAL", "BOTTOMUP", "NATIVE", "BLUR", "INVERT", "MONO", "SHADOW" or "OUTLINE".
   */
  function JS_LICE_SetFontFromGDI(
    LICEFont: identifier,
    GDIFont: identifier,
    moreFormats: string,
  ): void;

  /**
   * ```
   * boolean _ = reaper.JS_LICE_WriteJPG(string filename, identifier bitmap, integer quality, unsupported forceBaseline)
   * ```
   * Parameters:
   *
   *
   *
   *  * quality is an integer in the range 1..100.
   *
   *  * forceBaseline is an optional boolean parameter that ensures compatibility with all JPEG viewers by preventing too low quality, "cubist" settings.
   */
  function JS_LICE_WriteJPG(
    filename: string,
    bitmap: identifier,
    quality: number,
    forceBaseline: unsupported,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_LICE_WritePNG(string filename, identifier bitmap, boolean wantAlpha)
   * ```
   */
  function JS_LICE_WritePNG(
    filename: string,
    bitmap: identifier,
    wantAlpha: boolean,
  ): boolean;

  /**
   * ```
   * reaper.JS_ListView_EnsureVisible(identifier listviewHWND, integer index, boolean partialOK)
   * ```
   */
  function JS_ListView_EnsureVisible(
    listviewHWND: identifier,
    index: number,
    partialOK: boolean,
  ): void;

  /**
   * ```
   * integer _ = reaper.JS_ListView_EnumSelItems(identifier listviewHWND, integer index)
   * ```
   * Returns the index of the next selected list item with index greater that the specified number. Returns -1 if no selected items left.
   */
  function JS_ListView_EnumSelItems(
    listviewHWND: identifier,
    index: number,
  ): number;

  /**
   * ```
   * integer retval, string text = reaper.JS_ListView_GetFocusedItem(identifier listviewHWND)
   * ```
   * Returns the index and text of the focused item, if any.
   */
  function JS_ListView_GetFocusedItem(
    listviewHWND: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * identifier _ = reaper.JS_ListView_GetHeader(identifier listviewHWND)
   * ```
   */
  function JS_ListView_GetHeader(listviewHWND: identifier): identifier;

  /**
   * ```
   * string text, integer state = reaper.JS_ListView_GetItem(identifier listviewHWND, integer index, integer subItem)
   * ```
   * Returns the text and state of specified item.
   */
  function JS_ListView_GetItem(
    listviewHWND: identifier,
    index: number,
    subItem: number,
  ): LuaMultiReturn<[string, number]>;

  /**
   * ```
   * integer _ = reaper.JS_ListView_GetItemCount(identifier listviewHWND)
   * ```
   */
  function JS_ListView_GetItemCount(listviewHWND: identifier): number;

  /**
   * ```
   * boolean retval, integer left, integer top, integer right, integer bottom = reaper.JS_ListView_GetItemRect(identifier listviewHWND, integer index)
   * ```
   * Returns client coordinates of the item.
   */
  function JS_ListView_GetItemRect(
    listviewHWND: identifier,
    index: number,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.JS_ListView_GetItemState(identifier listviewHWND, integer index)
   * ```
   * State is a bitmask:
   *
   * 1 = focused, 2 = selected. On Windows only, cut-and-paste marked = 4, drag-and-drop highlighted = 8.
   *
   *
   *
   * Warning: this function uses the Win32 bitmask values, which differ from the values used by WDL/swell.
   */
  function JS_ListView_GetItemState(
    listviewHWND: identifier,
    index: number,
  ): number;

  /**
   * ```
   * string text = reaper.JS_ListView_GetItemText(identifier listviewHWND, integer index, integer subItem)
   * ```
   */
  function JS_ListView_GetItemText(
    listviewHWND: identifier,
    index: number,
    subItem: number,
  ): string;

  /**
   * ```
   * integer _ = reaper.JS_ListView_GetSelectedCount(identifier listviewHWND)
   * ```
   */
  function JS_ListView_GetSelectedCount(listviewHWND: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_ListView_GetTopIndex(identifier listviewHWND)
   * ```
   */
  function JS_ListView_GetTopIndex(listviewHWND: identifier): number;

  /**
   * ```
   * integer index, integer subItem, integer flags = reaper.JS_ListView_HitTest(identifier listviewHWND, integer clientX, integer clientY)
   * ```
   */
  function JS_ListView_HitTest(
    listviewHWND: identifier,
    clientX: number,
    clientY: number,
  ): LuaMultiReturn<[number, number, number]>;

  /**
   * Returns the indices of all selected items as a comma-separated list.
   *
   * - retval: Number of selected items found; negative or zero if an error occured.
   */
  function JS_ListView_ListAllSelItems(
    listviewHWND: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * reaper.JS_ListView_SetItemState(identifier listviewHWND, integer index, integer state, integer mask)
   * ```
   * The mask parameter specifies the state bits that must be set, and the state parameter specifies the new values for those bits.
   *
   *
   *
   * 1 = focused, 2 = selected. On Windows only, cut-and-paste marked = 4, drag-and-drop highlighted = 8.
   *
   *
   *
   * Warning: this function uses the Win32 bitmask values, which differ from the values used by WDL/swell.
   */
  function JS_ListView_SetItemState(
    listviewHWND: identifier,
    index: number,
    state: number,
    mask: number,
  ): void;

  /**
   * ```
   * reaper.JS_ListView_SetItemText(identifier listviewHWND, integer index, integer subItem, string text)
   * ```
   * Currently, this fuction only accepts ASCII text.
   */
  function JS_ListView_SetItemText(
    listviewHWND: identifier,
    index: number,
    subItem: number,
    text: string,
  ): void;

  /**
   * ```
   * string translation = reaper.JS_Localize(string USEnglish, string LangPackSection)
   * ```
   * Returns the translation of the given US English text, according to the currently loaded Language Pack.
   *
   *
   *
   * Parameters:
   *
   *  * LangPackSection: Language Packs are divided into sections such as "common" or "DLG_102".
   *
   *  * In Lua, by default, text of up to 1024 chars can be returned. To increase (or reduce) the default buffer size, a string and size can be included as optional 3rd and 4th arguments.
   *
   *
   *
   * Example: reaper.JS_Localize("Actions", "common", "", 20)
   */
  function JS_Localize(USEnglish: string, LangPackSection: string): string;

  /**
   * ```
   * integer _ = reaper.JS_MIDIEditor_ArrayAll(identifier reaperarray)
   * ```
   * Finds all open MIDI windows (whether docked or not).
   *
   *
   *
   *  * retval: The number of MIDI editor windows found; negative if an error occurred.
   *
   *
   *
   *  * The address of each MIDI editor window is stored in the provided reaper.array. Each address can be converted to a REAPER object (HWND) by the function JS_Window_HandleFromAddress.
   */
  function JS_MIDIEditor_ArrayAll(reaperarray: identifier): number;

  /**
   * ```
   * integer retval, string list = reaper.JS_MIDIEditor_ListAll()
   * ```
   * Finds all open MIDI windows (whether docked or not).
   *
   *
   *
   *  * retval: The number of MIDI editor windows found; negative if an error occurred.
   *
   *
   *
   *  * list: Comma-separated string of hexadecimal values. Each value is an address that can be converted to a HWND by the function Window_HandleFromAddress.
   */
  function JS_MIDIEditor_ListAll(): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * identifier _ = reaper.JS_Mem_Alloc(integer sizeBytes)
   * ```
   * Allocates memory for general use by functions that require memory buffers.
   */
  function JS_Mem_Alloc(sizeBytes: number): identifier;

  /**
   * ```
   * boolean _ = reaper.JS_Mem_Free(identifier mallocPointer)
   * ```
   * Frees memory that was previously allocated by JS_Mem_Alloc.
   */
  function JS_Mem_Free(mallocPointer: identifier): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Mem_FromString(identifier mallocPointer, integer offset, string packedString, integer stringLength)
   * ```
   * Copies a packed string into a memory buffer.
   */
  function JS_Mem_FromString(
    mallocPointer: identifier,
    offset: number,
    packedString: string,
    stringLength: number,
  ): boolean;

  /**
   * ```
   * identifier _ = reaper.JS_Mouse_GetCursor()
   * ```
   * On Windows, retrieves a handle to the current mouse cursor.
   *
   * On Linux and macOS, retrieves a handle to the last cursor set by REAPER or its extensions via SWELL.
   */
  function JS_Mouse_GetCursor(): identifier;

  /**
   * ```
   * integer _ = reaper.JS_Mouse_GetState(integer flags)
   * ```
   * Retrieves the states of mouse buttons and modifiers keys.
   *
   *
   *
   * Parameters:
   *
   *  * flags, state: The parameter and the return value both use the same format as gfx.mouse_cap. For example, to get the states of the left mouse button and the ctrl key, use flags = 0b00000101.
   */
  function JS_Mouse_GetState(flags: number): number;

  /**
   * ```
   * identifier _ = reaper.JS_Mouse_LoadCursor(integer cursorNumber)
   * ```
   * Loads a cursor by number.
   *
   *
   *
   * cursorNumber: Same as used for gfx.setcursor, and includes some of Windows' predefined cursors (with numbers > 32000; refer to documentation for the Win32 C++ function LoadCursor), and REAPER's own cursors (with numbers < 2000).
   *
   *
   *
   * If successful, returns a handle to the cursor, which can be used in JS_Mouse_SetCursor.
   */
  function JS_Mouse_LoadCursor(cursorNumber: number): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_Mouse_LoadCursorFromFile(string pathAndFileName, unsupported forceNewLoad)
   * ```
   * Loads a cursor from a .cur file.
   *
   *
   *
   * forceNewLoad is an optional boolean parameter:
   *
   *  * If omitted or false, and if the cursor file has already been loaded previously during the REAPER session by any script, the file will not be re-loaded, and the existing handle will be returned.
   *
   *  * If true, the file will be re-loaded and a new handle will be returned.
   *
   *  * WARNING: Each time that a cursor file is re-loaded, the number of GDI objects increases for the entire duration of the REAPER session.
   *
   *
   *
   * If successful, returns a handle to the cursor, which can be used in JS_Mouse_SetCursor.
   */
  function JS_Mouse_LoadCursorFromFile(
    pathAndFileName: string,
    forceNewLoad: unsupported,
  ): identifier;

  /**
   * ```
   * reaper.JS_Mouse_SetCursor(identifier cursorHandle)
   * ```
   * Sets the mouse cursor.  (Only lasts while script is running, and for a single "defer" cycle.)
   */
  function JS_Mouse_SetCursor(cursorHandle: identifier): void;

  /**
   * ```
   * boolean _ = reaper.JS_Mouse_SetPosition(integer x, integer y)
   * ```
   * Moves the mouse cursor to the specified screen coordinates.
   *
   *
   *
   * NOTES:
   *
   *  * On Windows and Linux, screen coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, screen coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   */
  function JS_Mouse_SetPosition(x: number, y: number): boolean;

  /**
   * ```
   * number version = reaper.JS_ReaScriptAPI_Version()
   * ```
   * Returns the version of the js_ReaScriptAPI extension.
   */
  function JS_ReaScriptAPI_Version(): number;

  /**
   * ```
   * boolean retval, string buf = reaper.JS_String(identifier pointer, integer offset, integer lengthChars)
   * ```
   * Returns the memory contents starting at address[offset] as a packed string. Offset is added as steps of 1 byte (char) each.
   */
  function JS_String(
    pointer: identifier,
    offset: number,
    lengthChars: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string state = reaper.JS_VKeys_GetDown(number cutoffTime)
   * ```
   * Returns a 255-byte array that specifies which virtual keys, from 0x01 to 0xFF, have sent KEYDOWN messages since cutoffTime.
   *
   *
   *
   * Notes:
   *
   *  * Mouse buttons and modifier keys are not (currently) reliably detected, and JS_Mouse_GetState can be used instead.
   *
   *  * Auto-repeated KEYDOWN messages are ignored.
   */
  function JS_VKeys_GetDown(cutoffTime: number): string;

  /**
   * ```
   * string state = reaper.JS_VKeys_GetState(number cutoffTime)
   * ```
   * Retrieves the current states (0 or 1) of all virtual keys, from 0x01 to 0xFF, in a 255-byte array.
   *
   *
   *
   * cutoffTime: A key is only regarded as down if it sent a KEYDOWN message after the cut-off time, not followed by KEYUP. (This is useful for excluding old KEYDOWN messages that weren't properly followed by KEYUP.)
   *
   * If cutoffTime is positive, is it interpreted as absolute time in similar format as time_precise().
   *
   * If cutoffTime is negative, it is relative to the current time.
   *
   *
   *
   * Notes:
   *
   *  * Mouse buttons and modifier keys are not (currently) reliably detected, and JS_Mouse_GetState can be used instead.
   *
   *  * Auto-repeated KEYDOWN messages are ignored.
   */
  function JS_VKeys_GetState(cutoffTime: number): string;

  /**
   * ```
   * string state = reaper.JS_VKeys_GetUp(number cutoffTime)
   * ```
   * Return a 255-byte array that specifies which virtual keys, from 0x01 to 0xFF, have sent KEYUP messages since cutoffTime.
   *
   *
   *
   * Note: Mouse buttons and modifier keys are not (currently) reliably detected, and JS_Mouse_GetState can be used instead.
   */
  function JS_VKeys_GetUp(cutoffTime: number): string;

  /**
   * ```
   * integer _ = reaper.JS_VKeys_Intercept(integer keyCode, integer intercept)
   * ```
   * Intercepting (blocking) virtual keys work similar to the native function PreventUIRefresh:  Each key has a (non-negative) intercept state, and the key is passed through as usual if the state equals 0, or blocked if the state is greater than 0.
   *
   *
   *
   * keyCode: The virtual key code of the key, or -1 to change the state of all keys.
   *
   *
   *
   * intercept: A script can increase the intercept state by passing +1, or lower the state by passing -1.  Multiple scripts can block the same key, and the intercept state may reach up to 255. If zero is passed, the intercept state is not changed, but the current state is returned.
   *
   *
   *
   * Returns: If keyCode refers to a single key, the intercept state of that key is returned.  If keyCode = -1, the state of the key that is most strongly blocked (highest intercept state) is returned.
   */
  function JS_VKeys_Intercept(keyCode: number, intercept: number): number;

  /**
   * ```
   * integer _ = reaper.JS_WindowMessage_Intercept(identifier windowHWND, string message, boolean passThrough)
   * ```
   * Begins intercepting a window message type to specified window.
   *
   *
   *
   * Parameters:
   *
   *  * message: a single message type to be intercepted, either in WM_ or hexadecimal format. For example "WM_SETCURSOR" or "0x0020".
   *
   *  * passThrough: Whether message should be blocked (false) or passed through (true) to the window.
   *
   *     For more information on message codes, refer to the Win32 C++ API documentation.
   *
   *     All WM_ and CB_ message types listed in swell-types.h should be valid cross-platform, and the function can recognize all of these by name. Other messages can be specified by their hex code.
   *
   *
   *
   * Returns:
   *
   *  * 1: Success.
   *
   *  * 0: The message type is already being intercepted by another script.
   *
   *  * -2: message string could not be parsed.
   *
   *  * -3: Failure getting original window process / window not valid.
   *
   *  * -6: Could not obtain the window client HDC.
   *
   *
   *
   * Notes:
   *
   *  * Intercepted messages can be polled using JS_WindowMessage_Peek.
   *
   *  * Intercepted messages can be edited, if necessary, and then forwarded to their original destination using JS_WindowMessage_Post or JS_WindowMessage_Send.
   *
   *  * To check whether a message type is being blocked or passed through, Peek the message type, or retrieve the entire List of intercepts.
   *
   *  * Mouse events are typically received by the child window under the mouse, not the parent window.
   *
   * Keyboard events are usually *not* received by any individual window. To intercept keyboard events, use the VKey functions.
   */
  function JS_WindowMessage_Intercept(
    windowHWND: identifier,
    message: string,
    passThrough: boolean,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_WindowMessage_InterceptList(identifier windowHWND, string messages)
   * ```
   * Begins intercepting window messages to specified window.
   *
   *
   *
   * Parameters:
   *
   *  * messages: comma-separated string of message types to be intercepted (either in WM_ or hexadecimal format), each with a "block" or "passthrough" modifier to specify whether the message should be blocked or passed through to the window. For example "WM_SETCURSOR:block, 0x0201:passthrough".
   *
   *     For more information on message codes, refer to the Win32 C++ API documentation.
   *
   *     All WM_ and CB_ message types listed in swell-types.h should be valid cross-platform, and the function can recognize all of these by name. Other messages can be specified by their hex code.
   *
   *
   *
   * Returns:
   *
   *  * 1: Success.
   *
   *  * 0: The message type is already being intercepted by another script.
   *
   *  * -1: windowHWND is not a valid window.
   *
   *  * -2: message string could not be parsed.
   *
   *  * -3: Failure getting original window process.
   *
   *  * -6: COuld not obtain the window client HDC.
   *
   *
   *
   * Notes:
   *
   *  * Intercepted messages can be polled using JS_WindowMessage_Peek.
   *
   *  * Intercepted messages can be edited, if necessary, and then forwarded to their original destination using JS_WindowMessage_Post or JS_WindowMessage_Send.
   *
   *  * To check whether a message type is being blocked or passed through, Peek the message type, or retrieve the entire List of intercepts.
   */
  function JS_WindowMessage_InterceptList(
    windowHWND: identifier,
    messages: string,
  ): number;

  /**
   * ```
   * boolean retval, string list = reaper.JS_WindowMessage_ListIntercepts(identifier windowHWND)
   * ```
   * Returns a string with a list of all message types currently being intercepted for the specified window.
   */
  function JS_WindowMessage_ListIntercepts(
    windowHWND: identifier,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * integer _ = reaper.JS_WindowMessage_PassThrough(identifier windowHWND, string message, boolean passThrough)
   * ```
   * Changes the passthrough setting of a message type that is already being intercepted.
   *
   *
   *
   * Returns 1 if successful, 0 if the message type is not yet being intercepted, or -2 if the argument could not be parsed.
   */
  function JS_WindowMessage_PassThrough(
    windowHWND: identifier,
    message: string,
    passThrough: boolean,
  ): number;

  /**
   * ```
   * boolean retval, boolean passedThrough, number time, integer wParamLow, integer wParamHigh, integer lParamLow, integer lParamHigh = reaper.JS_WindowMessage_Peek(identifier windowHWND, string message)
   * ```
   * Polls the state of an intercepted message.
   *
   *
   *
   * Parameters:
   *
   *  * message: String containing a single message name, such as "WM_SETCURSOR", or in hexadecimal format, "0x0020".
   *
   *  (For a list of WM_ and CB_ message types that are valid cross-platform, refer to swell-types.h. Only these will be recognized by WM_ or CB_ name.)
   *
   *
   *
   * Returns:
   *
   *  * A retval of false indicates that the message type is not being intercepted in the specified window.
   *
   *  * All messages are timestamped. A time of 0 indicates that no message if this type has been intercepted yet.
   *
   *  * For more information about wParam and lParam for different message types, refer to Win32 C++ documentation.
   *
   *  * For example, in the case of mousewheel, returns mousewheel delta, modifier keys, x position and y position.
   *
   *  * wParamHigh, lParamLow and lParamHigh are signed, whereas wParamLow is unsigned.
   */
  function JS_WindowMessage_Peek(
    windowHWND: identifier,
    message: string,
  ): LuaMultiReturn<[boolean, boolean, number, number, number, number, number]>;

  /**
   * ```
   * boolean _ = reaper.JS_WindowMessage_Post(identifier windowHWND, string message, number wParam, integer wParamHighWord, number lParam, integer lParamHighWord)
   * ```
   * If the specified window and message type are not currently being intercepted by a script, this function will post the message in the message queue of the specified window, and return without waiting.
   *
   *
   *
   * If the window and message type are currently being intercepted, the message will be sent directly to the original window process, similar to WindowMessage_Send, thereby skipping any intercepts.
   *
   *
   *
   * Parameters:
   *
   *  * message: String containing a single message name, such as "WM_SETCURSOR", or in hexadecimal format, "0x0020".
   *
   *  (For a list of WM_ and CB_ message types that are valid cross-platform, refer to swell-types.h. Only these will be recognized by WM_ or CB_ name.)
   *
   *  * wParam, wParamHigh, lParam and lParamHigh: Low and high 16-bit WORDs of the WPARAM and LPARAM parameters.
   *
   * (Most window messages encode separate information into the two WORDs. However, for those rare cases in which the entire WPARAM and LPARAM must be used to post a large pointer, the script can store this address in wParam or lParam, and keep wParamHigh and lParamHigh zero.)
   *
   *
   *
   * Notes:
   *
   *  * For more information about parameter values, refer to documentation for the Win32 C++ function PostMessage.
   *
   *  * Messages should only be sent to windows that were created from the main thread.
   *
   *  * Useful for simulating mouse clicks and calling mouse modifier actions from scripts.
   */
  function JS_WindowMessage_Post(
    windowHWND: identifier,
    message: string,
    wParam: number,
    wParamHighWord: number,
    lParam: number,
    lParamHighWord: number,
  ): boolean;

  /**
   * ```
   * integer _ = reaper.JS_WindowMessage_Release(identifier windowHWND, string messages)
   * ```
   * Release intercepts of specified message types.
   *
   *
   *
   * Parameters:
   *
   *  * messages: "WM_SETCURSOR,WM_MOUSEHWHEEL" or "0x0020,0x020E", for example.
   */
  function JS_WindowMessage_Release(
    windowHWND: identifier,
    messages: string,
  ): number;

  /**
   * ```
   * reaper.JS_WindowMessage_ReleaseAll()
   * ```
   * Release script intercepts of window messages for all windows.
   */
  function JS_WindowMessage_ReleaseAll(): void;

  /**
   * ```
   * reaper.JS_WindowMessage_ReleaseWindow(identifier windowHWND)
   * ```
   * Release script intercepts of window messages for specified window.
   */
  function JS_WindowMessage_ReleaseWindow(windowHWND: identifier): void;

  /**
   * ```
   * integer _ = reaper.JS_WindowMessage_Send(identifier windowHWND, string message, number wParam, integer wParamHighWord, number lParam, integer lParamHighWord)
   * ```
   * Sends a message to the specified window by calling the window process directly, and only returns after the message has been processed. Any intercepts of the message by scripts will be skipped, and the message can therefore not be blocked.
   *
   *
   *
   * Parameters:
   *
   *  * message: String containing a single message name, such as "WM_SETCURSOR", or in hexadecimal format, "0x0020".
   *
   *  (For a list of WM_ and CB_ message types that are valid cross-platform, refer to swell-types.h. Only these will be recognized by WM_ or CB_ name.)
   *
   *  * wParam, wParamHigh, lParam and lParamHigh: Low and high 16-bit WORDs of the WPARAM and LPARAM parameters.
   *
   * (Most window messages encode separate information into the two WORDs. However, for those rare cases in which the entire WPARAM and LPARAM must be used to post a large pointer, the script can store this address in wParam or lParam, and keep wParamHigh and lParamHigh zero.)
   *
   *
   *
   * Notes:
   *
   *  * For more information about parameter and return values, refer to documentation for the Win32 C++ function SendMessage.
   *
   *  * Messages should only be sent to windows that were created from the main thread.
   *
   *  * Useful for simulating mouse clicks and calling mouse modifier actions from scripts.
   */
  function JS_WindowMessage_Send(
    windowHWND: identifier,
    message: string,
    wParam: number,
    wParamHighWord: number,
    lParam: number,
    lParamHighWord: number,
  ): number;

  /**
   * ```
   * number address = reaper.JS_Window_AddressFromHandle(identifier handle)
   * ```
   */
  function JS_Window_AddressFromHandle(handle: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_Window_ArrayAllChild(identifier parentHWND, identifier reaperarray)
   * ```
   * Finds all child windows of the specified parent.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * The addresses are stored in the provided reaper.array, and can be converted to REAPER objects (HWNDs) by the function JS_Window_HandleFromAddress.
   */
  function JS_Window_ArrayAllChild(
    parentHWND: identifier,
    reaperarray: identifier,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_Window_ArrayAllTop(identifier reaperarray)
   * ```
   * Finds all top-level windows.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * The addresses are stored in the provided reaper.array, and can be converted to REAPER objects (HWNDs) by the function JS_Window_HandleFromAddress.
   */
  function JS_Window_ArrayAllTop(reaperarray: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_Window_ArrayFind(string title, boolean exact, identifier reaperarray)
   * ```
   * Finds all windows, whether top-level or child, whose titles match the specified string.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * The addresses are stored in the provided reaper.array, and can be converted to REAPER objects (HWNDs) by the function JS_Window_HandleFromAddress.
   *
   *
   *
   * Parameters:
   *
   *  * exact: Match entire title exactly, or match substring of title.
   */
  function JS_Window_ArrayFind(
    title: string,
    exact: boolean,
    reaperarray: identifier,
  ): number;

  /**
   * ```
   * reaper.JS_Window_AttachResizeGrip(identifier windowHWND)
   * ```
   */
  function JS_Window_AttachResizeGrip(windowHWND: identifier): void;

  /**
   * ```
   * reaper.JS_Window_AttachTopmostPin(identifier windowHWND)
   * ```
   * Attaches a "pin on top" button to the window frame. The button should remember its state when closing and re-opening the window.
   *
   *
   *
   * WARNING: This function does not yet work on Linux.
   */
  function JS_Window_AttachTopmostPin(windowHWND: identifier): void;

  /**
   * ```
   * integer x, integer y = reaper.JS_Window_ClientToScreen(identifier windowHWND, integer x, integer y)
   * ```
   * Converts the client-area coordinates of a specified point to screen coordinates.
   *
   *
   *
   * NOTES:
   *
   *  * On Windows and Linux, screen coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, screen coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   *
   *  * On all platforms, client coordinates are relative to the upper left corner of the client area.
   */
  function JS_Window_ClientToScreen(
    windowHWND: identifier,
    x: number,
    y: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * identifier retval, optional string style = reaper.JS_Window_Create(string title, string className, integer x, integer y, integer w, integer h, string style, identifier ownerHWND)
   * ```
   * Creates a modeless window with WS_OVERLAPPEDWINDOW style and only rudimentary features. Scripts can paint into the window using GDI or LICE/Composite functions (and JS_Window_InvalidateRect to trigger re-painting).
   *
   *
   *
   * style: An optional parameter that overrides the default style. The string may include any combination of standard window styles, such as "POPUP" for a frameless window, or "CAPTION,SIZEBOX,SYSMENU" for a standard framed window.
   *
   *
   *
   * On Linux and macOS, "MAXIMIZE" has not yet been implemented, and the remaining styles may appear slightly different from their WindowsOS counterparts.
   *
   *
   *
   * className: On Windows, only standard ANSI characters are supported.
   *
   *
   *
   * ownerHWND: Optional parameter, only available on WindowsOS.  Usually either the REAPER main window or another script window, and useful for ensuring that the created window automatically closes when the owner is closed.
   *
   *
   *
   * NOTE: On Linux and macOS, the window contents are only updated *between* defer cycles, so the window cannot be animated by for/while loops within a single defer cycle.
   */
  function JS_Window_Create(
    title: string,
    className: string,
    x: number,
    y: number,
    w: number,
    h: number,
    style: string,
    ownerHWND: identifier,
  ): LuaMultiReturn<[identifier, string]>;

  /**
   * ```
   * reaper.JS_Window_Destroy(identifier windowHWND)
   * ```
   * Destroys the specified window.
   */
  function JS_Window_Destroy(windowHWND: identifier): void;

  /**
   * ```
   * reaper.JS_Window_Enable(identifier windowHWND, boolean enable)
   * ```
   * Enables or disables mouse and keyboard input to the specified window or control.
   */
  function JS_Window_Enable(windowHWND: identifier, enable: boolean): void;

  /**
   * ```
   * integer _ = reaper.JS_Window_EnableMetal(identifier windowHWND)
   * ```
   * On macOS, returns the Metal graphics setting:
   *
   * 2 = Metal enabled and support GetDC()/ReleaseDC() for drawing (more overhead).
   *
   * 1 = Metal enabled.
   *
   * 0 = N/A (Windows and Linux).
   *
   * -1 = non-metal async layered mode.
   *
   * -2 = non-metal non-async layered mode.
   *
   *
   *
   * WARNING: If using mode -1, any BitBlt()/StretchBlt() MUST have the source bitmap persist. If it is resized after Blit it could cause crashes.
   */
  function JS_Window_EnableMetal(windowHWND: identifier): number;

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
   * ```
   * identifier _ = reaper.JS_Window_FindChild(identifier parentHWND, string title, boolean exact)
   * ```
   * Returns a HWND to a child window whose title matches the specified string.
   *
   *
   *
   * Parameters:
   *
   *  * exact: Match entire title length, or match substring of title. In both cases, matching is not case sensitive.
   */
  function JS_Window_FindChild(
    parentHWND: identifier,
    title: string,
    exact: boolean,
  ): identifier;

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
   * ```
   * identifier _ = reaper.JS_Window_FindEx(identifier parentHWND, identifier childHWND, string className, string title)
   * ```
   * Returns a handle to a child window whose class and title match the specified strings.
   *
   *
   *
   * Parameters: * childWindow: The function searches child windows, beginning with the window *after* the specified child window. If childHWND is equal to parentHWND, the search begins with the first child window of parentHWND.
   *
   *  * title: An empty string, "", will match all windows. (Search is not case sensitive.)
   */
  function JS_Window_FindEx(
    parentHWND: identifier,
    childHWND: identifier,
    className: string,
    title: string,
  ): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_Window_FindTop(string title, boolean exact)
   * ```
   * Returns a HWND to a top-level window whose title matches the specified string.
   *
   *
   *
   * Parameters:
   *
   *  * exact: Match entire title length, or match substring of title. In both cases, matching is not case sensitive.
   */
  function JS_Window_FindTop(title: string, exact: boolean): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_Window_FromPoint(integer x, integer y)
   * ```
   * Retrieves a HWND to the window that contains the specified point.
   *
   *
   *
   * NOTES:
   *
   *  * On Windows and Linux, screen coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, screen coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   */
  function JS_Window_FromPoint(x: number, y: number): identifier;

  /**
   * ```
   * string class = reaper.JS_Window_GetClassName(identifier windowHWND)
   * ```
   * WARNING: May not be fully implemented on macOS and Linux.
   */
  function JS_Window_GetClassName(windowHWND: identifier): string;

  /**
   * ```
   * boolean retval, integer left, integer top, integer right, integer bottom = reaper.JS_Window_GetClientRect(identifier windowHWND)
   * ```
   * Retrieves the screen coordinates of the client area rectangle of the specified window.
   *
   *
   *
   * NOTES:
   *
   *  * Unlike the C++ function GetClientRect, this function returns the screen coordinates, not the width and height. To get the client size, use GetClientSize.
   *
   *  * The pixel at (right, bottom) lies immediately outside the rectangle.
   *
   *  * On Windows and Linux, screen coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, screen coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   */
  function JS_Window_GetClientRect(
    windowHWND: identifier,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * boolean retval, integer width, integer height = reaper.JS_Window_GetClientSize(identifier windowHWND)
   * ```
   */
  function JS_Window_GetClientSize(
    windowHWND: identifier,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * identifier _ = reaper.JS_Window_GetFocus()
   * ```
   * Retrieves a HWND to the window that has the keyboard focus, if the window is attached to the calling thread's message queue.
   */
  function JS_Window_GetFocus(): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_Window_GetForeground()
   * ```
   * Retrieves a HWND to the top-level foreground window (the window with which the user is currently working).
   */
  function JS_Window_GetForeground(): identifier;

  /**
   * ```
   * number retval = reaper.JS_Window_GetLong(identifier windowHWND, string info)
   * ```
   * Similar to JS_Window_GetLongPtr, but returns the information as a number instead of a pointer.
   *
   *
   *
   * In the case of "DLGPROC" and "WNDPROC", the return values can be converted to pointers by JS_Window_HandleFromAddress.
   *
   *
   *
   * If the function fails, the return value is 0.
   */
  function JS_Window_GetLong(windowHWND: identifier, info: string): number;

  /**
   * ```
   * identifier _ = reaper.JS_Window_GetLongPtr(identifier windowHWND, string info)
   * ```
   * Returns information about the specified window.
   *
   *
   *
   * info: "USERDATA", "WNDPROC", "DLGPROC", "ID", "EXSTYLE" or "STYLE".
   *
   *
   *
   * For documentation about the types of information returned, refer to the Win32 function GetWindowLongPtr.
   *
   *
   *
   * The values returned by "DLGPROC" and "WNDPROC" are typically used as-is, as pointers, whereas the others should first be converted to integers.
   *
   *
   *
   * If the function fails, a null pointer is returned.
   */
  function JS_Window_GetLongPtr(
    windowHWND: identifier,
    info: string,
  ): identifier;

  /**
   * ```
   * identifier _ = reaper.JS_Window_GetParent(identifier windowHWND)
   * ```
   * Retrieves a HWND to the specified window's parent or owner.
   *
   * Returns NULL if the window is unowned or if the function otherwise fails.
   */
  function JS_Window_GetParent(windowHWND: identifier): identifier;

  /**
   * ```
   * boolean retval, integer left, integer top, integer right, integer bottom = reaper.JS_Window_GetRect(identifier windowHWND)
   * ```
   * Retrieves the screen coordinates of the bounding rectangle of the specified window.
   *
   *
   *
   * NOTES:
   *
   *  * On Windows and Linux, coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   *
   *  * The pixel at (right, bottom) lies immediately outside the rectangle.
   */
  function JS_Window_GetRect(
    windowHWND: identifier,
  ): LuaMultiReturn<[boolean, number, number, number, number]>;

  /**
   * ```
   * identifier _ = reaper.JS_Window_GetRelated(identifier windowHWND, string relation)
   * ```
   * Retrieves a handle to a window that has the specified relationship (Z-Order or owner) to the specified window.
   *
   * relation: "LAST", "NEXT", "PREV", "OWNER" or "CHILD".
   *
   * (Refer to documentation for Win32 C++ function GetWindow.)
   */
  function JS_Window_GetRelated(
    windowHWND: identifier,
    relation: string,
  ): identifier;

  /**
   * ```
   * boolean retval, integer position, integer pageSize, integer min, integer max, integer trackPos = reaper.JS_Window_GetScrollInfo(identifier windowHWND, string scrollbar)
   * ```
   * Retrieves the scroll information of a window.
   *
   *
   *
   * Parameters:
   *
   *  * windowHWND: The window that contains the scrollbar. This is usually a child window, not a top-level, framed window.
   *
   *  * scrollbar: "v" (or "SB_VERT", or "VERT") for vertical scroll, "h" (or "SB_HORZ" or "HORZ") for horizontal.
   *
   *
   *
   * Returns:
   *
   *  * Leftmost or topmost visible pixel position, as well as the visible page size, the range minimum and maximum, and scroll box tracking position.
   */
  function JS_Window_GetScrollInfo(
    windowHWND: identifier,
    scrollbar: string,
  ): LuaMultiReturn<[boolean, number, number, number, number, number]>;

  /**
   * ```
   * string title = reaper.JS_Window_GetTitle(identifier windowHWND)
   * ```
   * Returns the title (if any) of the specified window.
   */
  function JS_Window_GetTitle(windowHWND: identifier): string;

  /**
   * ```
   * integer left, integer top, integer right, integer bottom = reaper.JS_Window_GetViewportFromRect(integer x1, integer y1, integer x2, integer y2, boolean wantWork)
   * ```
   * Retrieves the dimensions of the display monitor that has the largest area of intersection with the specified rectangle.
   *
   *
   *
   * If the monitor is not the primary display, some of the rectangle's coordinates may be negative.
   *
   *
   *
   * wantWork: Returns the work area of the display, which excludes the system taskbar or application desktop toolbars.
   */
  function JS_Window_GetViewportFromRect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    wantWork: boolean,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * identifier _ = reaper.JS_Window_HandleFromAddress(number address)
   * ```
   * Converts an address to a handle (such as a HWND) that can be utilized by REAPER and other API functions.
   */
  function JS_Window_HandleFromAddress(address: number): identifier;

  /**
   * ```
   * boolean _ = reaper.JS_Window_InvalidateRect(identifier windowHWND, integer left, integer top, integer right, integer bottom, boolean eraseBackground)
   * ```
   * Similar to the Win32 function InvalidateRect.
   */
  function JS_Window_InvalidateRect(
    windowHWND: identifier,
    left: number,
    top: number,
    right: number,
    bottom: number,
    eraseBackground: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Window_IsChild(identifier parentHWND, identifier childHWND)
   * ```
   * Determines whether a window is a child window or descendant window of a specified parent window.
   */
  function JS_Window_IsChild(
    parentHWND: identifier,
    childHWND: identifier,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Window_IsVisible(identifier windowHWND)
   * ```
   * Determines the visibility state of the window.
   */
  function JS_Window_IsVisible(windowHWND: identifier): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Window_IsWindow(identifier windowHWND)
   * ```
   * Determines whether the specified window handle identifies an existing window.
   *
   *
   *
   * On macOS and Linux, only windows that were created by WDL/swell will be identified (and only such windows should be acted on by scripts).
   *
   *
   *
   * NOTE: Since REAPER v5.974, windows can be checked using the native function ValidatePtr(windowHWND, "HWND").
   */
  function JS_Window_IsWindow(windowHWND: identifier): boolean;

  /**
   * ```
   * integer retval, string list = reaper.JS_Window_ListAllChild(identifier parentHWND)
   * ```
   * Finds all child windows of the specified parent.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * list: A comma-separated string of hexadecimal values.
   *
   * Each value is an address that can be converted to a HWND by the function Window_HandleFromAddress.
   */
  function JS_Window_ListAllChild(
    parentHWND: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer retval, string list = reaper.JS_Window_ListAllTop()
   * ```
   * Finds all top-level windows.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * list: A comma-separated string of hexadecimal values. Each value is an address that can be converted to a HWND by the function Window_HandleFromAddress.
   */
  function JS_Window_ListAllTop(): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer retval, string list = reaper.JS_Window_ListFind(string title, boolean exact)
   * ```
   * Finds all windows (whether top-level or child) whose titles match the specified string.
   *
   *
   *
   * Returns:
   *
   *  * retval: The number of windows found; negative if an error occurred.
   *
   *  * list: A comma-separated string of hexadecimal values. Each value is an address that can be converted to a HWND by the function Window_HandleFromAddress.
   *
   *
   *
   * Parameters:
   *
   *  * exact: Match entire title exactly, or match substring of title.
   */
  function JS_Window_ListFind(
    title: string,
    exact: boolean,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer left, integer top, integer right, integer bottom = reaper.JS_Window_MonitorFromRect(integer x1, integer y1, integer x2, integer y2, boolean wantWork)
   * ```
   * Deprecated - use GetViewportFromRect instead.
   * @deprecated
   */
  function JS_Window_MonitorFromRect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    wantWork: boolean,
  ): LuaMultiReturn<[number, number, number, number]>;

  /**
   * ```
   * reaper.JS_Window_Move(identifier windowHWND, integer left, integer top)
   * ```
   * Changes the position of the specified window, keeping its size constant.
   *
   *
   *
   * NOTES:
   *
   *  * For top-level windows, position is relative to the primary display.
   *
   *  * On Windows and Linux, position is calculated as the coordinates of the upper left corner of the window, relative to upper left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, position is calculated as the coordinates of the bottom left corner of the window, relative to bottom left corner of the display, and the positive Y-axis points upward.
   *
   *  * For a child window, on all platforms, position is relative to the upper-left corner of the parent window's client area.
   *
   *  * Equivalent to calling JS_Window_SetPosition with NOSIZE, NOZORDER, NOACTIVATE and NOOWNERZORDER flags set.
   */
  function JS_Window_Move(
    windowHWND: identifier,
    left: number,
    top: number,
  ): void;

  /**
   * ```
   * boolean _ = reaper.JS_Window_OnCommand(identifier windowHWND, integer commandID)
   * ```
   * Sends a "WM_COMMAND" message to the specified window, which simulates a user selecting a command in the window menu.
   *
   *
   *
   * This function is similar to Main_OnCommand and MIDIEditor_OnCommand, but can send commands to any window that has a menu.
   *
   *
   *
   * In the case of windows that are listed among the Action list's contexts (such as the Media Explorer), the commandIDs of the actions in the Actions list may be used.
   */
  function JS_Window_OnCommand(
    windowHWND: identifier,
    commandID: number,
  ): boolean;

  /**
   * ```
   * reaper.JS_Window_Resize(identifier windowHWND, integer width, integer height)
   * ```
   * Changes the dimensions of the specified window, keeping the top left corner position constant.
   *
   *  * If resizing script GUIs, call gfx.update() after resizing.
   *
   * * Equivalent to calling JS_Window_SetPosition with NOMOVE, NOZORDER, NOACTIVATE and NOOWNERZORDER flags set.
   */
  function JS_Window_Resize(
    windowHWND: identifier,
    width: number,
    height: number,
  ): void;

  /**
   * ```
   * integer x, integer y = reaper.JS_Window_ScreenToClient(identifier windowHWND, integer x, integer y)
   * ```
   * Converts the screen coordinates of a specified point on the screen to client-area coordinates.
   *
   *
   *
   * NOTES:
   *
   *  * On Windows and Linux, screen coordinates are relative to *upper* left corner of the primary display, and the positive Y-axis points downward.
   *
   *  * On macOS, screen coordinates are relative to the *bottom* left corner of the primary display, and the positive Y-axis points upward.
   *
   *  * On all platforms, client coordinates are relative to the upper left corner of the client area.
   */
  function JS_Window_ScreenToClient(
    windowHWND: identifier,
    x: number,
    y: number,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * reaper.JS_Window_SetFocus(identifier windowHWND)
   * ```
   * Sets the keyboard focus to the specified window.
   */
  function JS_Window_SetFocus(windowHWND: identifier): void;

  /**
   * ```
   * reaper.JS_Window_SetForeground(identifier windowHWND)
   * ```
   * Brings the specified window into the foreground, activates the window, and directs keyboard input to it.
   */
  function JS_Window_SetForeground(windowHWND: identifier): void;

  /**
   * ```
   * number retval = reaper.JS_Window_SetLong(identifier windowHWND, string info, number value)
   * ```
   * Similar to the Win32 function SetWindowLongPtr.
   *
   *
   *
   * info: "USERDATA", "WNDPROC", "DLGPROC", "ID", "EXSTYLE" or "STYLE", and only on WindowOS, "INSTANCE" and "PARENT".
   */
  function JS_Window_SetLong(
    windowHWND: identifier,
    info: string,
    value: number,
  ): number;

  /**
   * ```
   * boolean _ = reaper.JS_Window_SetOpacity(identifier windowHWND, string mode, number value)
   * ```
   * Sets the window opacity.
   *
   *
   *
   * Parameters:
   *
   * mode: either "ALPHA" or "COLOR".
   *
   * value: If ALPHA, the specified value may range from zero to one, and will apply to the entire window, frame included.
   *
   * If COLOR, value specifies a 0xRRGGBB color, and all pixels of this color will be made transparent. (All mouse clicks over transparent pixels will pass through, too).  WARNING:
   *
   * COLOR mode is only available in Windows, not Linux or macOS.
   *
   *
   *
   * Transparency can only be applied to top-level windows. If windowHWND refers to a child window, the entire top-level window that contains windowHWND will be made transparent.
   */
  function JS_Window_SetOpacity(
    windowHWND: identifier,
    mode: string,
    value: number,
  ): boolean;

  /**
   * ```
   * identifier _ = reaper.JS_Window_SetParent(identifier childHWND, identifier parentHWND)
   * ```
   * If successful, returns a handle to the previous parent window.
   *
   *
   *
   * Only on WindowsOS: If parentHWND is not specified, the desktop window becomes the new parent window.
   */
  function JS_Window_SetParent(
    childHWND: identifier,
    parentHWND: identifier,
  ): identifier;

  /**
   * ```
   * boolean retval, optional string ZOrder, optional string flags = reaper.JS_Window_SetPosition(identifier windowHWND, integer left, integer top, integer width, integer height, optional string ZOrder, optional string flags)
   * ```
   * Interface to the Win32/swell function SetWindowPos, with which window position, size, Z-order and visibility can be set, and new frame styles can be applied.
   *
   *
   *
   * ZOrder and flags are optional parameters. If no arguments are supplied, the window will simply be moved and resized, as if the NOACTIVATE, NOZORDER, NOOWNERZORDER flags were set.
   *
   *  * ZOrder: "BOTTOM", "TOPMOST", "NOTOPMOST", "TOP" or a window HWND converted to a string, for example by the Lua function tostring.
   *
   *  * flags: Any combination of the standard flags, of which "NOMOVE", "NOSIZE", "NOZORDER", "NOACTIVATE", "SHOWWINDOW", "FRAMECHANGED" and "NOCOPYBITS" should be valid cross-platform.
   */
  function JS_Window_SetPosition(
    windowHWND: identifier,
    left: number,
    top: number,
    width: number,
    height: number,
    ZOrder?: string,
    flags?: string,
  ): LuaMultiReturn<[boolean, string, string]>;

  /**
   * ```
   * boolean _ = reaper.JS_Window_SetScrollPos(identifier windowHWND, string scrollbar, integer position)
   * ```
   * Parameters:
   *
   *  * scrollbar: "v" (or "SB_VERT", or "VERT") for vertical scroll, "h" (or "SB_HORZ" or "HORZ") for horizontal.
   *
   *
   *
   * NOTE: API functions can scroll REAPER's windows, but cannot zoom them.  Instead, use actions such as "View: Zoom to one loop iteration".
   */
  function JS_Window_SetScrollPos(
    windowHWND: identifier,
    scrollbar: string,
    position: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string style = reaper.JS_Window_SetStyle(identifier windowHWND, string style)
   * ```
   * Sets and applies a window style.
   *
   *
   *
   * style may include any combination of standard window styles, such as "POPUP" for a frameless window, or "CAPTION,SIZEBOX,SYSMENU" for a standard framed window.
   *
   *
   *
   * On Linux and macOS, "MAXIMIZE" has not yet been implmented, and the remaining styles may appear slightly different from their WindowsOS counterparts.
   */
  function JS_Window_SetStyle(
    windowHWND: identifier,
    style: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean _ = reaper.JS_Window_SetTitle(identifier windowHWND, string title)
   * ```
   * Changes the title of the specified window. Returns true if successful.
   */
  function JS_Window_SetTitle(windowHWND: identifier, title: string): boolean;

  /**
   * ```
   * boolean _ = reaper.JS_Window_SetZOrder(identifier windowHWND, string ZOrder, identifier insertAfterHWND)
   * ```
   * Sets the window Z order.
   *
   *  * Equivalent to calling JS_Window_SetPos with flags NOMOVE | NOSIZE.
   *
   *  * Not all the Z orders have been implemented in Linux yet.
   *
   *
   *
   * Parameters:
   *
   *  * ZOrder: "BOTTOM", "TOPMOST", "NOTOPMOST", "TOP", or a window HWND converted to a string, for example by the Lua function tostring.
   *
   *
   *
   * * InsertAfterHWND: For compatibility with older versions, this parameter is still available, and is optional. If ZOrder is "INSERTAFTER", insertAfterHWND must be a handle to the window behind which windowHWND will be placed in the Z order, equivalent to setting ZOrder to this HWND; otherwise, insertAfterHWND is ignored and can be left out (or it can simply be set to the same value as windowHWND).
   */
  function JS_Window_SetZOrder(
    windowHWND: identifier,
    ZOrder: string,
    insertAfterHWND: identifier,
  ): boolean;

  /**
   * ```
   * reaper.JS_Window_Show(identifier windowHWND, string state)
   * ```
   * Sets the specified window's show state.
   *
   *
   *
   * Parameters:
   *
   *  * state: One of the following options: "SHOW", "SHOWNA" (or "SHOWNOACTIVATE"), "SHOWMINIMIZED", "HIDE", "NORMAL", "SHOWNORMAL", "SHOWMAXIMIZED", "SHOWDEFAULT" or "RESTORE". On Linux and macOS, only the first four options are fully implemented.
   */
  function JS_Window_Show(windowHWND: identifier, state: string): void;

  /**
   * ```
   * reaper.JS_Window_Update(identifier windowHWND)
   * ```
   * Similar to the Win32 function UpdateWindow.
   */
  function JS_Window_Update(windowHWND: identifier): void;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Close(string zipFile, identifier zipHandle)
   * ```
   * Closes the zip archive, using either the file name or the zip handle. Finalizes entries and releases resources.
   */
  function JS_Zip_Close(zipFile: string, zipHandle: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_CountEntries(identifier zipHandle)
   * ```
   */
  function JS_Zip_CountEntries(zipHandle: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_DeleteEntries(identifier zipHandle, string entryNames, integer entryNamesStrLen)
   * ```
   * Deletes the specified entries from an existing Zip file.
   *
   *
   *
   * entryNames is zero-separated and double-zero-terminated.
   *
   *
   *
   * Returns the number of deleted entries on success, negative number (< 0) on error.
   */
  function JS_Zip_DeleteEntries(
    zipHandle: identifier,
    entryNames: string,
    entryNamesStrLen: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_Close(identifier zipHandle)
   * ```
   * Closes a zip entry, flushes buffer and releases resources. In WRITE mode, entries must be closed in order to apply and save changes.
   *
   *
   *
   * Returns 0 on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_Close(zipHandle: identifier): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_CompressFile(identifier zipHandle, string inputFile)
   * ```
   * Compresses the specified file into the zip archive's open entry.
   *
   *
   *
   * Returns 0 on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_CompressFile(
    zipHandle: identifier,
    inputFile: string,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_CompressMemory(identifier zipHandle, string buf, integer buf_size)
   * ```
   * Compresses the specified memory buffer into the zip archive's open entry.
   *
   *
   *
   * Returns 0 on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_CompressMemory(
    zipHandle: identifier,
    buf: string,
    buf_size: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_ExtractToFile(identifier zipHandle, string outputFile)
   * ```
   * Extracts the zip archive's open entry.
   *
   *
   *
   * Returns 0 on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_ExtractToFile(
    zipHandle: identifier,
    outputFile: string,
  ): number;

  /**
   * ```
   * integer retval, string contents = reaper.JS_Zip_Entry_ExtractToMemory(identifier zipHandle)
   * ```
   * Extracts and returns the zip archive's open entry.
   *
   *
   *
   * Returns the number of bytes extracted on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_ExtractToMemory(
    zipHandle: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * integer retval, string name, integer index, integer isFolder, number size, number crc32 = reaper.JS_Zip_Entry_Info(identifier zipHandle)
   * ```
   * Returns information about the zip archive's open entry.
   */
  function JS_Zip_Entry_Info(
    zipHandle: identifier,
  ): LuaMultiReturn<[number, string, number, number, number, number]>;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_OpenByIndex(identifier zipHandle, integer index)
   * ```
   * Opens a new entry by index in the zip archive.
   *
   *
   *
   * This function is only valid if zip archive was opened in 'r' (readonly) mode.
   *
   *
   *
   * Returns 0 on success, negative number on error.
   */
  function JS_Zip_Entry_OpenByIndex(
    zipHandle: identifier,
    index: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Entry_OpenByName(identifier zipHandle, string entryName)
   * ```
   * Opens an entry by name in the zip archive.
   *
   *
   *
   * For zip archive opened in 'w' or 'a' mode the function will append a new entry. In readonly mode the function tries to locate an existing entry.
   *
   *
   *
   * Returns 0 on success, negative number (< 0) on error.
   */
  function JS_Zip_Entry_OpenByName(
    zipHandle: identifier,
    entryName: string,
  ): number;

  /**
   * ```
   * string errorStr = reaper.JS_Zip_ErrorString(integer errorNum)
   * ```
   * Returns a descriptive string for the given error code.
   */
  function JS_Zip_ErrorString(errorNum: number): string;

  /**
   * ```
   * integer _ = reaper.JS_Zip_Extract(string zipFile, string outputFolder)
   * ```
   * Extracts an existing Zip file to the specified folder.
   *
   *
   *
   * Returns the number of extracted files on success, negative number (< 0) on error.
   */
  function JS_Zip_Extract(zipFile: string, outputFolder: string): number;

  /**
   * ```
   * integer retval, string list = reaper.JS_Zip_ListAllEntries(identifier zipHandle)
   * ```
   * Returns the number of entries and a zero-separated and double-zero-terminated string of entry names.
   *
   *
   *
   * On error, returns a negative number (< 0).
   */
  function JS_Zip_ListAllEntries(
    zipHandle: identifier,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * identifier retval, integer retval = reaper.JS_Zip_Open(string zipFile, string mode, integer compressionLevel)
   * ```
   * Opens a zip archive using the given mode, which can be either "READ" or "WRITE" (or simply 'r' or 'w').
   *
   *
   *
   *  * READ: Opens an existing archive for reading/extracting.
   *
   *  * WRITE: Opens an archive for writing/deleting. If the file doesn't exist, an empty archive will created.
   *
   *
   *
   * compressionLevel is only relevant for WRITE mode, and ranges from 0 (fastest, no compression) to 9 (slowest, best compression), with a default of 6.
   *
   *
   *
   * If successful, returns 0 and a handle to the Zip archive. If failed, returns a negative error code. If the file is already open -- in the given mode -- the existing handle will be returned.
   *
   *
   *
   * NOTES:
   *
   *  * The Zip API functions support Unicode file names and entry names.
   *
   *  * The original zip specification did not support Unicode. Some applications still use this outdated specification by default, or try to use the local code page. This may lead to incompatibility and incorrect retrieval of file or entry names.
   */
  function JS_Zip_Open(
    zipFile: string,
    mode: string,
    compressionLevel: number,
  ): LuaMultiReturn<[identifier, number]>;

  /**
   * ```
   * boolean _ = reaper.NF_AnalyzeMediaItemPeakAndRMS(MediaItem item, number windowSize, identifier reaper_array_peaks, identifier reaper_array_peakpositions, identifier reaper_array_RMSs, identifier reaper_array_RMSpositions)
   * ```
   * This function combines all other NF_Peak/RMS functions in a single one and additionally returns peak RMS positions. Lua example code here. Note: It's recommended to use this function with ReaScript/Lua as it provides reaper.array objects. If using this function with other scripting languages, you must provide arrays in the reaper.array format.
   */
  function NF_AnalyzeMediaItemPeakAndRMS(
    item: MediaItem,
    windowSize: number,
    reaper_array_peaks: identifier,
    reaper_array_peakpositions: identifier,
    reaper_array_RMSs: identifier,
    reaper_array_RMSpositions: identifier,
  ): boolean;

  /**
   * ```
   * boolean retval, number lufsIntegrated, number range, number truePeak, number truePeakPos, number shortTermMax, number momentaryMax = reaper.NF_AnalyzeTakeLoudness(MediaItem_Take take, boolean analyzeTruePeak)
   * ```
   * Full loudness analysis. retval: returns true on successful analysis, false on MIDI take or when analysis failed for some reason. analyzeTruePeak=true: Also do true peak analysis. Returns true peak value in dBTP and true peak position (relative to item position). Considerably slower than without true peak analysis (since it uses oversampling). Note: Short term uses a time window of 3 sec. for calculation. So for items shorter than this shortTermMaxOut can't be calculated correctly. Momentary uses a time window of 0.4 sec.
   */
  function NF_AnalyzeTakeLoudness(
    take: MediaItem_Take,
    analyzeTruePeak: boolean,
  ): LuaMultiReturn<[boolean, number, number, number, number, number, number]>;

  /**
   * ```
   * boolean retval, number lufsIntegrated, number range, number truePeak, number truePeakPos, number shortTermMax, number momentaryMax, number shortTermMaxPos, number momentaryMaxPos = reaper.NF_AnalyzeTakeLoudness2(MediaItem_Take take, boolean analyzeTruePeak)
   * ```
   * Same as NF_AnalyzeTakeLoudness but additionally returns shortTermMaxPos and momentaryMaxPos (in absolute project time). Note: shortTermMaxPos and momentaryMaxPos indicate the beginning of time intervalls, (3 sec. and 0.4 sec. resp.).
   */
  function NF_AnalyzeTakeLoudness2(
    take: MediaItem_Take,
    analyzeTruePeak: boolean,
  ): LuaMultiReturn<
    [boolean, number, number, number, number, number, number, number, number]
  >;

  /**
   * ```
   * boolean retval, number lufsIntegrated = reaper.NF_AnalyzeTakeLoudness_IntegratedOnly(MediaItem_Take take)
   * ```
   * Does LUFS integrated analysis only. Faster than full loudness analysis (NF_AnalyzeTakeLoudness) . Use this if only LUFS integrated is required. Take vol. env. is taken into account. See: Signal flow
   */
  function NF_AnalyzeTakeLoudness_IntegratedOnly(
    take: MediaItem_Take,
  ): LuaMultiReturn<[boolean, number]>;

  /**
   * ```
   * boolean retval, string decodedStr = reaper.NF_Base64_Decode(string base64Str)
   * ```
   * Returns true on success.
   */
  function NF_Base64_Decode(
    base64Str: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * string encodedStr = reaper.NF_Base64_Encode(string str, boolean usePadding)
   * ```
   * Input string may contain null bytes in REAPER 6.44 or newer. Note: Doesn't allow padding in the middle (e.g. concatenated encoded strings), doesn't allow newlines.
   */
  function NF_Base64_Encode(str: string, usePadding: boolean): string;

  /**
   * ```
   * boolean _ = reaper.NF_ClearGlobalStartupAction()
   * ```
   * Returns true if global startup action was cleared successfully.
   */
  function NF_ClearGlobalStartupAction(): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_ClearProjectStartupAction()
   * ```
   * Returns true if project startup action was cleared successfully.
   */
  function NF_ClearProjectStartupAction(): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_ClearProjectTrackSelectionAction()
   * ```
   * Returns true if project track selection action was cleared successfully.
   */
  function NF_ClearProjectTrackSelectionAction(): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_DeleteTakeFromItem(MediaItem item, integer takeIdx)
   * ```
   * Deletes a take from an item. takeIdx is zero-based. Returns true on success.
   */
  function NF_DeleteTakeFromItem(item: MediaItem, takeIdx: number): boolean;

  /**
   * ```
   * boolean retval, string desc, string cmdId = reaper.NF_GetGlobalStartupAction()
   * ```
   * Gets action description and command ID number (for native actions) or named command IDs / identifier strings (for extension actions /ReaScripts) if global startup action is set, otherwise empty string. Returns false on failure.
   */
  function NF_GetGlobalStartupAction(): LuaMultiReturn<
    [boolean, string, string]
  >;

  /**
   * ```
   * number _ = reaper.NF_GetMediaItemAverageRMS(MediaItem item)
   * ```
   * Returns the average overall (non-windowed) dB RMS level of active channels of an audio item active take, post item gain, post take volume envelope, post-fade, pre fader, pre item FX.
   *
   *  Returns -150.0 if MIDI take or empty item.
   */
  function NF_GetMediaItemAverageRMS(item: MediaItem): number;

  /**
   * ```
   * number _ = reaper.NF_GetMediaItemMaxPeak(MediaItem item)
   * ```
   * Returns the greatest max. peak value in dBFS of all active channels of an audio item active take, post item gain, post take volume envelope, post-fade, pre fader, pre item FX.
   *
   *  Returns -150.0 if MIDI take or empty item.
   */
  function NF_GetMediaItemMaxPeak(item: MediaItem): number;

  /**
   * ```
   * number retval, number maxPeakPos = reaper.NF_GetMediaItemMaxPeakAndMaxPeakPos(MediaItem item)
   * ```
   * See NF_GetMediaItemMaxPeak, additionally returns maxPeakPos (relative to item position).
   */
  function NF_GetMediaItemMaxPeakAndMaxPeakPos(
    item: MediaItem,
  ): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * number _ = reaper.NF_GetMediaItemPeakRMS_NonWindowed(MediaItem item)
   * ```
   * Returns the greatest overall (non-windowed) dB RMS peak level of all active channels of an audio item active take, post item gain, post take volume envelope, post-fade, pre fader, pre item FX.
   *
   *  Returns -150.0 if MIDI take or empty item.
   */
  function NF_GetMediaItemPeakRMS_NonWindowed(item: MediaItem): number;

  /**
   * ```
   * number _ = reaper.NF_GetMediaItemPeakRMS_Windowed(MediaItem item)
   * ```
   * Returns the average dB RMS peak level of all active channels of an audio item active take, post item gain, post take volume envelope, post-fade, pre fader, pre item FX.
   *
   *  Obeys 'Window size for peak RMS' setting in 'SWS: Set RMS analysis/normalize options' for calculation. Returns -150.0 if MIDI take or empty item.
   */
  function NF_GetMediaItemPeakRMS_Windowed(item: MediaItem): number;

  /**
   * ```
   * boolean retval, string desc, string cmdId = reaper.NF_GetProjectStartupAction()
   * ```
   * Gets action description and command ID number (for native actions) or named command IDs / identifier strings (for extension actions /ReaScripts) if project startup action is set, otherwise empty string. Returns false on failure.
   */
  function NF_GetProjectStartupAction(): LuaMultiReturn<
    [boolean, string, string]
  >;

  /**
   * ```
   * boolean retval, string desc, string cmdId = reaper.NF_GetProjectTrackSelectionAction()
   * ```
   * Gets action description and command ID number (for native actions) or named command IDs / identifier strings (for extension actions /ReaScripts) if project track selection action is set, otherwise empty string. Returns false on failure.
   */
  function NF_GetProjectTrackSelectionAction(): LuaMultiReturn<
    [boolean, string, string]
  >;

  /**
   * ```
   * string _ = reaper.NF_GetSWSMarkerRegionSub(integer markerRegionIdx)
   * ```
   * Returns SWS/S&M marker/region subtitle. markerRegionIdx: Refers to index that can be passed to EnumProjectMarkers (not displayed marker/region index). Returns empty string if marker/region with specified index not found or marker/region subtitle not set. Lua code example here.
   */
  function NF_GetSWSMarkerRegionSub(markerRegionIdx: number): string;

  /**
   * ```
   * string _ = reaper.NF_GetSWSTrackNotes(MediaTrack track)
   * ```
   */
  function NF_GetSWSTrackNotes(track: MediaTrack): string;

  /**
   * ```
   * number target, number windowSize = reaper.NF_GetSWS_RMSoptions()
   * ```
   * Get SWS analysis/normalize options. See NF_SetSWS_RMSoptions.
   */
  function NF_GetSWS_RMSoptions(): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * integer supercollapsed, integer collapsed, integer small, integer recarm = reaper.NF_GetThemeDefaultTCPHeights()
   * ```
   */
  function NF_GetThemeDefaultTCPHeights(): LuaMultiReturn<
    [number, number, number, number]
  >;

  /**
   * ```
   * integer _ = reaper.NF_ReadAudioFileBitrate(string fn)
   * ```
   * Returns the bitrate of an audio file in kb/s if available (0 otherwise). For supported filetypes see TagLib::AudioProperties::bitrate.
   */
  function NF_ReadAudioFileBitrate(fn: string): number;

  /**
   * ```
   * reaper.NF_ScrollHorizontallyByPercentage(integer amount)
   * ```
   * 100 means scroll one page. Negative values scroll left.
   */
  function NF_ScrollHorizontallyByPercentage(amount: number): void;

  /**
   * ```
   * boolean _ = reaper.NF_SetGlobalStartupAction(string str)
   * ```
   * Returns true if global startup action was set successfully (i.e. valid action ID). Note: For SWS / S&M actions and macros / scripts, you must use identifier strings (e.g. "_SWS_ABOUT", "_f506bc780a0ab34b8fdedb67ed5d3649"), not command IDs (e.g. "47145").
   *
   * Tip: to copy such identifiers, right-click the action in the Actions window > Copy selected action cmdID / identifier string.
   *
   * NOnly works for actions / scripts from Main action section.
   */
  function NF_SetGlobalStartupAction(str: string): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_SetProjectStartupAction(string str)
   * ```
   * Returns true if project startup action was set successfully (i.e. valid action ID). Note: For SWS / S&M actions and macros / scripts, you must use identifier strings (e.g. "_SWS_ABOUT", "_f506bc780a0ab34b8fdedb67ed5d3649"), not command IDs (e.g. "47145").
   *
   * Tip: to copy such identifiers, right-click the action in the Actions window > Copy selected action cmdID / identifier string.
   *
   * Only works for actions / scripts from Main action section. Project must be saved after setting project startup action to be persistent.
   */
  function NF_SetProjectStartupAction(str: string): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_SetProjectTrackSelectionAction(string str)
   * ```
   * Returns true if project track selection action was set successfully (i.e. valid action ID). Note: For SWS / S&M actions and macros / scripts, you must use identifier strings (e.g. "_SWS_ABOUT", "_f506bc780a0ab34b8fdedb67ed5d3649"), not command IDs (e.g. "47145").
   *
   * Tip: to copy such identifiers, right-click the action in the Actions window > Copy selected action cmdID / identifier string.
   *
   * Only works for actions / scripts from Main action section. Project must be saved after setting project track selection action to be persistent.
   */
  function NF_SetProjectTrackSelectionAction(str: string): boolean;

  /**
   * ```
   * boolean _ = reaper.NF_SetSWSMarkerRegionSub(string markerRegionSub, integer markerRegionIdx)
   * ```
   * Set SWS/S&M marker/region subtitle. markerRegionIdx: Refers to index that can be passed to EnumProjectMarkers (not displayed marker/region index). Returns true if subtitle is set successfully (i.e. marker/region with specified index is present in project). Lua code example here.
   */
  function NF_SetSWSMarkerRegionSub(
    markerRegionSub: string,
    markerRegionIdx: number,
  ): boolean;

  /**
   * ```
   * reaper.NF_SetSWSTrackNotes(MediaTrack track, string str)
   * ```
   */
  function NF_SetSWSTrackNotes(track: MediaTrack, str: string): void;

  /**
   * ```
   * boolean _ = reaper.NF_SetSWS_RMSoptions(number targetLevel, number windowSize)
   * ```
   * Set SWS analysis/normalize options (same as running action 'SWS: Set RMS analysis/normalize options'). targetLevel: target RMS normalize level (dB), windowSize: window size for peak RMS (sec.)
   */
  function NF_SetSWS_RMSoptions(
    targetLevel: number,
    windowSize: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string name = reaper.NF_TakeFX_GetFXModuleName(MediaItem item, integer fx)
   * ```
   * Deprecated, see TakeFX_GetNamedConfigParm/'fx_ident' (v6.37+). See BR_TrackFX_GetFXModuleName. fx: counted consecutively across all takes (zero-based).
   * @deprecated
   */
  function NF_TakeFX_GetFXModuleName(
    item: MediaItem,
    fx: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * reaper.NF_UpdateSWSMarkerRegionSubWindow()
   * ```
   * Redraw the Notes window (call if you've changed a subtitle via NF_SetSWSMarkerRegionSub which is currently displayed in the Notes window and you want to appear the new subtitle immediately.)
   */
  function NF_UpdateSWSMarkerRegionSubWindow(): void;

  /**
   * ```
   * integer _ = reaper.NF_Win32_GetSystemMetrics(integer nIndex)
   * ```
   * Equivalent to win32 API GetSystemMetrics(). Note: Only SM_C[XY]SCREEN, SM_C[XY][HV]SCROLL and SM_CYMENU are currently supported on macOS and Linux as of REAPER 6.68. Check the SWELL source code for up-to-date support information (swell-wnd.mm, swell-wnd-generic.cpp).
   */
  function NF_Win32_GetSystemMetrics(nIndex: number): number;

  /**
   * ```
   * boolean _ = reaper.ReaPack_AboutInstalledPackage(PackageEntry entry)
   * ```
   * Show the about dialog of the given package entry.
   *
   * The repository index is downloaded asynchronously if the cached copy doesn't exist or is older than one week.
   */
  function ReaPack_AboutInstalledPackage(entry: PackageEntry): boolean;

  /**
   * ```
   * boolean _ = reaper.ReaPack_AboutRepository(string repoName)
   * ```
   * Show the about dialog of the given repository. Returns true if the repository exists in the user configuration.
   *
   * The repository index is downloaded asynchronously if the cached copy doesn't exist or is older than one week.
   */
  function ReaPack_AboutRepository(repoName: string): boolean;

  /**
   * ```
   * boolean retval, string error = reaper.ReaPack_AddSetRepository(string name, string url, boolean enable, integer autoInstall)
   * ```
   * Add or modify a repository. Set url to nullptr (or empty string in Lua) to keep the existing URL. Call ReaPack_ProcessQueue(true) when done to process the new list and update the GUI.
   *
   *
   *
   * autoInstall: usually set to 2 (obey user setting).
   */
  function ReaPack_AddSetRepository(
    name: string,
    url: string,
    enable: boolean,
    autoInstall: number,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * reaper.ReaPack_BrowsePackages(string filter)
   * ```
   * Opens the package browser with the given filter string.
   */
  function ReaPack_BrowsePackages(filter: string): void;

  /**
   * ```
   * integer retval, string error = reaper.ReaPack_CompareVersions(string ver1, string ver2)
   * ```
   * Returns 0 if both versions are equal, a positive value if ver1 is higher than ver2 and a negative value otherwise.
   */
  function ReaPack_CompareVersions(
    ver1: string,
    ver2: string,
  ): LuaMultiReturn<[number, string]>;

  /**
   * ```
   * boolean retval, string path, integer sections, integer type = reaper.ReaPack_EnumOwnedFiles(PackageEntry entry, integer index)
   * ```
   * Enumerate the files owned by the given package. Returns false when there is no more data.
   *
   *
   *
   * sections: 0=not in action list, &1=main, &2=midi editor, &4=midi inline editor
   *
   * type: see ReaPack_GetEntryInfo.
   */
  function ReaPack_EnumOwnedFiles(
    entry: PackageEntry,
    index: number,
  ): LuaMultiReturn<[boolean, string, number, number]>;

  /**
   * ```
   * boolean _ = reaper.ReaPack_FreeEntry(PackageEntry entry)
   * ```
   * Free resources allocated for the given package entry.
   */
  function ReaPack_FreeEntry(entry: PackageEntry): boolean;

  /**
   * ```
   * boolean retval, string repo, string cat, string pkg, string desc, integer type, string ver, string author, integer flags, integer fileCount = reaper.ReaPack_GetEntryInfo(PackageEntry entry)
   * ```
   * Get the repository name, category, package name, package description, package type, the currently installed version, author name, flags (&1=Pinned, &2=BleedingEdge) and how many files are owned by the given package entry.
   *
   *
   *
   * type: 1=script, 2=extension, 3=effect, 4=data, 5=theme, 6=langpack, 7=webinterface
   */
  function ReaPack_GetEntryInfo(
    entry: PackageEntry,
  ): LuaMultiReturn<
    [
      boolean,
      string,
      string,
      string,
      string,
      number,
      string,
      string,
      number,
      number,
    ]
  >;

  /**
   * ```
   * PackageEntry retval, string error = reaper.ReaPack_GetOwner(string fn)
   * ```
   * Returns the package entry owning the given file.
   *
   * Delete the returned object from memory after use with ReaPack_FreeEntry.
   */
  function ReaPack_GetOwner(fn: string): LuaMultiReturn<[PackageEntry, string]>;

  /**
   * ```
   * boolean retval, string url, boolean enabled, integer autoInstall = reaper.ReaPack_GetRepositoryInfo(string name)
   * ```
   * Get the infos of the given repository.
   *
   *
   *
   * autoInstall: 0=manual, 1=when sychronizing, 2=obey user setting
   */
  function ReaPack_GetRepositoryInfo(
    name: string,
  ): LuaMultiReturn<[boolean, string, boolean, number]>;

  /**
   * ```
   * reaper.ReaPack_ProcessQueue(boolean refreshUI)
   * ```
   * Run pending operations and save the configuration file. If refreshUI is true the browser and manager windows are guaranteed to be refreshed (otherwise it depends on which operations are in the queue).
   */
  function ReaPack_ProcessQueue(refreshUI: boolean): void;

  /**
   * ```
   * boolean _ = reaper.SNM_AddReceive(MediaTrack src, MediaTrack dest, integer type)
   * ```
   * [S&M] Deprecated, see CreateTrackSend (v5.15pre1+). Adds a receive. Returns false if nothing updated.
   *
   * type -1=Default type (user preferences), 0=Post-Fader (Post-Pan), 1=Pre-FX, 2=deprecated, 3=Pre-Fader (Post-FX).
   *
   * Note: obeys default sends preferences, supports frozen tracks, etc..
   * @deprecated
   */
  function SNM_AddReceive(
    src: MediaTrack,
    dest: MediaTrack,
    type: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_AddTCPFXParm(MediaTrack tr, integer fxId, integer prmId)
   * ```
   * [S&M] Add an FX parameter knob in the TCP. Returns false if nothing updated (invalid parameters, knob already present, etc..)
   */
  function SNM_AddTCPFXParm(
    tr: MediaTrack,
    fxId: number,
    prmId: number,
  ): boolean;

  /**
   * ```
   * WDL_FastString _ = reaper.SNM_CreateFastString(string str)
   * ```
   * [S&M] Instantiates a new "fast string". You must delete this string, see SNM_DeleteFastString.
   */
  function SNM_CreateFastString(str: string): WDL_FastString;

  /**
   * ```
   * reaper.SNM_DeleteFastString(WDL_FastString str)
   * ```
   * [S&M] Deletes a "fast string" instance.
   */
  function SNM_DeleteFastString(str: WDL_FastString): void;

  /**
   * ```
   * number _ = reaper.SNM_GetDoubleConfigVar(string varname, number errvalue)
   * ```
   * [S&M] Returns a floating-point preference (look in project prefs first, then in general prefs). Returns errvalue if failed (e.g. varname not found).
   */
  function SNM_GetDoubleConfigVar(varname: string, errvalue: number): number;

  /**
   * ```
   * number _ = reaper.SNM_GetDoubleConfigVarEx(ReaProject proj, string varname, number errvalue)
   * ```
   * [S&M] See SNM_GetDoubleConfigVar.
   */
  function SNM_GetDoubleConfigVarEx(
    proj: ReaProject,
    varname: string,
    errvalue: number,
  ): number;

  /**
   * ```
   * string _ = reaper.SNM_GetFastString(WDL_FastString str)
   * ```
   * [S&M] Gets the "fast string" content.
   */
  function SNM_GetFastString(str: WDL_FastString): string;

  /**
   * ```
   * integer _ = reaper.SNM_GetFastStringLength(WDL_FastString str)
   * ```
   * [S&M] Gets the "fast string" length.
   */
  function SNM_GetFastStringLength(str: WDL_FastString): number;

  /**
   * ```
   * integer _ = reaper.SNM_GetIntConfigVar(string varname, integer errvalue)
   * ```
   * [S&M] Returns an integer preference (look in project prefs first, then in general prefs). Returns errvalue if failed (e.g. varname not found).
   */
  function SNM_GetIntConfigVar(varname: string, errvalue: number): number;

  /**
   * ```
   * integer _ = reaper.SNM_GetIntConfigVarEx(ReaProject proj, string varname, integer errvalue)
   * ```
   * [S&M] See SNM_GetIntConfigVar.
   */
  function SNM_GetIntConfigVarEx(
    proj: ReaProject,
    varname: string,
    errvalue: number,
  ): number;

  /**
   * ```
   * boolean retval, integer high, integer low = reaper.SNM_GetLongConfigVar(string varname)
   * ```
   * [S&M] Reads a 64-bit integer preference split in two 32-bit integers (look in project prefs first, then in general prefs). Returns false if failed (e.g. varname not found).
   */
  function SNM_GetLongConfigVar(
    varname: string,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * boolean retval, integer high, integer low = reaper.SNM_GetLongConfigVarEx(ReaProject proj, string varname)
   * ```
   * [S&M] See SNM_GetLongConfigVar.
   */
  function SNM_GetLongConfigVarEx(
    proj: ReaProject,
    varname: string,
  ): LuaMultiReturn<[boolean, number, number]>;

  /**
   * ```
   * MediaItem_Take _ = reaper.SNM_GetMediaItemTakeByGUID(ReaProject project, string guid)
   * ```
   * [S&M] Gets a take by GUID as string. The GUID must be enclosed in braces {}. To get take GUID as string, see BR_GetMediaItemTakeGUID
   */
  function SNM_GetMediaItemTakeByGUID(
    project: ReaProject,
    guid: string,
  ): MediaItem_Take;

  /**
   * ```
   * boolean _ = reaper.SNM_GetProjectMarkerName(ReaProject proj, integer num, boolean isrgn, WDL_FastString name)
   * ```
   * [S&M] Gets a marker/region name. Returns true if marker/region found.
   */
  function SNM_GetProjectMarkerName(
    proj: ReaProject,
    num: number,
    isrgn: boolean,
    name: WDL_FastString,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_GetSetObjectState(identifier obj, WDL_FastString state, boolean setnewvalue, boolean wantminimalstate)
   * ```
   * [S&M] Gets or sets the state of a track, an item or an envelope. The state chunk size is unlimited. Returns false if failed.
   *
   * When getting a track state (and when you are not interested in FX data), you can use wantminimalstate=true to radically reduce the length of the state. Do not set such minimal states back though, this is for read-only applications!
   *
   * Note: unlike the native GetSetObjectState, calling to FreeHeapPtr() is not required.
   */
  function SNM_GetSetObjectState(
    obj: identifier,
    state: WDL_FastString,
    setnewvalue: boolean,
    wantminimalstate: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_GetSetSourceState(MediaItem item, integer takeidx, WDL_FastString state, boolean setnewvalue)
   * ```
   * [S&M] Gets or sets a take source state. Returns false if failed. Use takeidx=-1 to get/alter the active take.
   *
   * Note: this function does not use a MediaItem_Take* param in order to manage empty takes (i.e. takes with MediaItem_Take*==NULL), see SNM_GetSetSourceState2.
   */
  function SNM_GetSetSourceState(
    item: MediaItem,
    takeidx: number,
    state: WDL_FastString,
    setnewvalue: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_GetSetSourceState2(MediaItem_Take take, WDL_FastString state, boolean setnewvalue)
   * ```
   * [S&M] Gets or sets a take source state. Returns false if failed.
   *
   * Note: this function cannot deal with empty takes, see SNM_GetSetSourceState.
   */
  function SNM_GetSetSourceState2(
    take: MediaItem_Take,
    state: WDL_FastString,
    setnewvalue: boolean,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_GetSourceType(MediaItem_Take take, WDL_FastString type)
   * ```
   * [S&M] Deprecated, see GetMediaSourceType. Gets the source type of a take. Returns false if failed (e.g. take with empty source, etc..)
   * @deprecated
   */
  function SNM_GetSourceType(
    take: MediaItem_Take,
    type: WDL_FastString,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_MoveOrRemoveTrackFX(MediaTrack tr, integer fxId, integer what)
   * ```
   * [S&M] Deprecated, see TrackFX_{CopyToTrack,Delete} (v5.95+). Move or removes a track FX. Returns true if tr has been updated.
   *
   * fxId: fx index in chain or -1 for the selected fx. what: 0 to remove, -1 to move fx up in chain, 1 to move fx down in chain.
   * @deprecated
   */
  function SNM_MoveOrRemoveTrackFX(
    tr: MediaTrack,
    fxId: number,
    what: number,
  ): boolean;

  /**
   * ```
   * boolean retval, string tagval = reaper.SNM_ReadMediaFileTag(string fn, string tag)
   * ```
   * [S&M] Reads a media file tag. Supported tags: "artist", "album", "genre", "comment", "title", "track" (track number) or "year". Returns false if tag was not found. See SNM_TagMediaFile.
   */
  function SNM_ReadMediaFileTag(
    fn: string,
    tag: string,
  ): LuaMultiReturn<[boolean, string]>;

  /**
   * ```
   * boolean _ = reaper.SNM_RemoveReceive(MediaTrack tr, integer rcvidx)
   * ```
   * [S&M] Deprecated, see RemoveTrackSend (v5.15pre1+). Removes a receive. Returns false if nothing updated.
   * @deprecated
   */
  function SNM_RemoveReceive(tr: MediaTrack, rcvidx: number): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_RemoveReceivesFrom(MediaTrack tr, MediaTrack srctr)
   * ```
   * [S&M] Removes all receives from srctr. Returns false if nothing updated.
   */
  function SNM_RemoveReceivesFrom(tr: MediaTrack, srctr: MediaTrack): boolean;

  /**
   * ```
   * integer _ = reaper.SNM_SelectResourceBookmark(string name)
   * ```
   * [S&M] Select a bookmark of the Resources window. Returns the related bookmark id (or -1 if failed).
   */
  function SNM_SelectResourceBookmark(name: string): number;

  /**
   * ```
   * boolean _ = reaper.SNM_SetDoubleConfigVar(string varname, number newvalue)
   * ```
   * [S&M] Sets a floating-point preference (look in project prefs first, then in general prefs). Returns false if failed (e.g. varname not found or newvalue out of range).
   */
  function SNM_SetDoubleConfigVar(varname: string, newvalue: number): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetDoubleConfigVarEx(ReaProject proj, string varname, number newvalue)
   * ```
   * [S&M] See SNM_SetDoubleConfigVar.
   */
  function SNM_SetDoubleConfigVarEx(
    proj: ReaProject,
    varname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * WDL_FastString _ = reaper.SNM_SetFastString(WDL_FastString str, string newstr)
   * ```
   * [S&M] Sets the "fast string" content. Returns str for facility.
   */
  function SNM_SetFastString(
    str: WDL_FastString,
    newstr: string,
  ): WDL_FastString;

  /**
   * ```
   * boolean _ = reaper.SNM_SetIntConfigVar(string varname, integer newvalue)
   * ```
   * [S&M] Sets an integer preference (look in project prefs first, then in general prefs). Returns false if failed (e.g. varname not found or newvalue out of range).
   */
  function SNM_SetIntConfigVar(varname: string, newvalue: number): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetIntConfigVarEx(ReaProject proj, string varname, integer newvalue)
   * ```
   * [S&M] See SNM_SetIntConfigVar.
   */
  function SNM_SetIntConfigVarEx(
    proj: ReaProject,
    varname: string,
    newvalue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetLongConfigVar(string varname, integer newHighValue, integer newLowValue)
   * ```
   * [S&M] Sets a 64-bit integer preference from two 32-bit integers (look in project prefs first, then in general prefs). Returns false if failed (e.g. varname not found).
   */
  function SNM_SetLongConfigVar(
    varname: string,
    newHighValue: number,
    newLowValue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetLongConfigVarEx(ReaProject proj, string varname, integer newHighValue, integer newLowValue)
   * ```
   * [S&M] SNM_SetLongConfigVar.
   */
  function SNM_SetLongConfigVarEx(
    proj: ReaProject,
    varname: string,
    newHighValue: number,
    newLowValue: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetProjectMarker(ReaProject proj, integer num, boolean isrgn, number pos, number rgnend, string name, integer color)
   * ```
   * [S&M] Deprecated, see SetProjectMarker4 -- Same function as SetProjectMarker3() except it can set empty names "".
   * @deprecated
   */
  function SNM_SetProjectMarker(
    proj: ReaProject,
    num: number,
    isrgn: boolean,
    pos: number,
    rgnend: number,
    name: string,
    color: number,
  ): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_SetStringConfigVar(string varname, string newvalue)
   * ```
   * [S&M] Sets a string preference (general prefs only). Returns false if failed (e.g. varname not found or value too long). See get_config_var_string.
   */
  function SNM_SetStringConfigVar(varname: string, newvalue: string): boolean;

  /**
   * ```
   * boolean _ = reaper.SNM_TagMediaFile(string fn, string tag, string tagval)
   * ```
   * [S&M] Tags a media file thanks to TagLib. Supported tags: "artist", "album", "genre", "comment", "title", "track" (track number) or "year". Use an empty tagval to clear a tag. When a file is opened in REAPER, turn it offline before using this function. Returns false if nothing updated. See SNM_ReadMediaFileTag.
   */
  function SNM_TagMediaFile(fn: string, tag: string, tagval: string): boolean;

  /**
   * ```
   * reaper.SNM_TieResourceSlotActions(integer bookmarkId)
   * ```
   * [S&M] Attach Resources slot actions to a given bookmark.
   */
  function SNM_TieResourceSlotActions(bookmarkId: number): void;

  /**
   * ```
   * reaper.SN_FocusMIDIEditor()
   * ```
   * Focuses the active/open MIDI editor.
   */
  function SN_FocusMIDIEditor(): void;

  /**
   * ```
   * string _ = reaper.ULT_GetMediaItemNote(MediaItem item)
   * ```
   * [ULT] Deprecated, see GetSetMediaItemInfo_String (v5.95+). Get item notes.
   * @deprecated
   */
  function ULT_GetMediaItemNote(item: MediaItem): string;

  /**
   * ```
   * reaper.ULT_SetMediaItemNote(MediaItem item, string note)
   * ```
   * [ULT] Deprecated, see GetSetMediaItemInfo_String (v5.95+). Set item notes.
   * @deprecated
   */
  function ULT_SetMediaItemNote(item: MediaItem, note: string): void;

  /**
   * ```
   * AudioWriter _ = reaper.Xen_AudioWriter_Create(string filename, integer numchans, integer samplerate)
   * ```
   * Creates writer for 32 bit floating point WAV
   */
  function Xen_AudioWriter_Create(
    filename: string,
    numchans: number,
    samplerate: number,
  ): AudioWriter;

  /**
   * ```
   * reaper.Xen_AudioWriter_Destroy(AudioWriter writer)
   * ```
   * Destroys writer
   */
  function Xen_AudioWriter_Destroy(writer: AudioWriter): void;

  /**
   * ```
   * integer _ = reaper.Xen_AudioWriter_Write(AudioWriter writer, integer numframes, identifier data, integer offset)
   * ```
   * Write interleaved audio data to disk
   */
  function Xen_AudioWriter_Write(
    writer: AudioWriter,
    numframes: number,
    data: identifier,
    offset: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.Xen_GetMediaSourceSamples(PCM_source src, identifier destbuf, integer destbufoffset, integer numframes, integer numchans, number samplerate, number sourceposition)
   * ```
   * Get interleaved audio data from media source
   */
  function Xen_GetMediaSourceSamples(
    src: PCM_source,
    destbuf: identifier,
    destbufoffset: number,
    numframes: number,
    numchans: number,
    samplerate: number,
    sourceposition: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.Xen_StartSourcePreview(PCM_source source, number gain, boolean loop, optional integer outputchanindexIn)
   * ```
   * Start audio preview of a PCM_source. Returns id of a preview handle that can be provided to Xen_StopSourcePreview.
   *
   * If the given PCM_source does not belong to an existing MediaItem/Take, it will be deleted by the preview system when the preview is stopped.
   */
  function Xen_StartSourcePreview(
    source: PCM_source,
    gain: number,
    loop: boolean,
    outputchanindexIn?: number,
  ): number;

  /**
   * ```
   * integer _ = reaper.Xen_StopSourcePreview(integer preview_id)
   * ```
   * Stop audio preview. id -1 stops all.
   */
  function Xen_StopSourcePreview(preview_id: number): number;

  /**
   * ```
   * reaper.atexit(function fun)
   * ```
   * Adds code to be executed when the script finishes or is ended by the user. Typically used to clean up after the user terminates defer() or runloop() code.
   */
  function atexit(fun: Function): void;

  /**
   * Adds code to be called back by REAPER. Used to create persistent ReaScripts that continue to run and respond to input, while the user does other tasks. Identical to runloop().
   *
   * Note that no undo point will be automatically created when the script finishes, unless you create it explicitly.
   */
  function defer(func: () => void): void;

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

  /**
   * ```
   * reaper.gmem_attach(any sharedMemoryName)
   * ```
   * Causes gmem_read()/gmem_write() to read EEL2/JSFX/Video shared memory segment named by parameter. Set to empty string to detach. 6.20+: returns previous shared memory segment name.
   */
  function gmem_attach(sharedMemoryName: any): void;

  /**
   * ```
   * reaper.gmem_read(any index)
   * ```
   * Read (number) value from shared memory attached-to by gmem_attach(). index can be [0..1<<25).
   */
  function gmem_read(index: any): void;

  /**
   * ```
   * reaper.gmem_write(any index, any value)
   * ```
   * Write (number) value to shared memory attached-to by gmem_attach(). index can be [0..1<<25).
   */
  function gmem_write(index: any, value: any): void;

  /**
   * ```
   * reaper.runloop(function fun)
   * ```
   * Adds code to be called back by REAPER. Used to create persistent ReaScripts that continue to run and respond to input, while the user does other tasks. Identical to defer().Note that no undo point will be automatically created when the script finishes, unless you create it explicitly.
   */
  function runloop(fun: Function): void;

  /**
   * ```
   * reaper.set_action_options(flag)
   * ```
   * Sets action options for the script.
   * - flag&1: script will auto-terminate if re-launched while already running
   * - flag&2: if (flag&1) is set, script will re-launch after auto-terminating
   * - flag&4: set script toggle state on
   * - flag&8: set script toggle state off
   */
  function set_action_options(flag: number): void;
}

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
   * ```
   * gfx.blitext(any source, any coordinatelist, any rotation)
   * ```
   * Deprecated, use gfx.blit instead.
   * @deprecated
   */
  function blitext(source: any, coordinatelist: any, rotation: any): void;

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

  /**
   * ```
   * gfx.loadimg(any image, string filename)
   * ```
   * Load image from filename into slot 0..1024-1 specified by image. Returns the image index if success, otherwise -1 if failure. The image will be resized to the dimensions of the image file.
   */
  function loadimg(image: any, filename: string): void;

  /**
   * ```
   * gfx.measurechar(any char)
   * ```
   * Measures the drawing dimensions of a character with the current font (as set by gfx.setfont). Returns width and height of character.
   */
  function measurechar(char: string): LuaMultiReturn<[number, number]>;

  /**
   * Measures the drawing dimensions of a string with the current font (as set by gfx.setfont). Returns width and height of string.
   */
  function measurestr(str: string): LuaMultiReturn<[number, number]>;

  /**
   * ```
   * gfx.muladdrect(any x, any y, any w, any h, any mul_r, any mul_g, any mul_b, optional any mul_a, optional any add_r, optional any add_g, optional any add_b, optional any add_a)
   * ```
   * Multiplies each pixel by mul_* and adds add_*, and updates in-place. Useful for changing brightness/contrast, or other effects.
   */
  function muladdrect(
    x: number,
    y: number,
    w: number,
    h: number,
    mul_r: number,
    mul_g: number,
    mul_b: number,
    mul_a?: number,
    add_r?: number,
    add_g?: number,
    add_b?: number,
    add_a?: number,
  ): void;

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

  /**
   * ```
   * gfx.set(any r, optional any g, optional any b, optional any a, optional any mode, optional any dest, optional any a2)
   * ```
   * Sets gfx.r/gfx.g/gfx.b/gfx.a/gfx.mode/gfx.a2, sets gfx.dest if final parameter specified
   */
  function set(
    r: number,
    g?: number,
    b?: number,
    a?: number,
    mode?: number,
    dest?: number,
    a2?: number,
  ): void;

  /**
   * ```
   * gfx.setcursor(any resource_id, any custom_cursor_name)
   * ```
   * Sets the mouse cursor to resource_id and/or custom_cursor_name.
   */
  function setcursor(resource_id: any, custom_cursor_name: any): void;

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

  /**
   * Resize image referenced by index 0..1024-1, width and height must be 0-8192. The contents of the image will be undefined after the resize.
   */
  function setimgdim(image: number, w: number, h: number): void;

  /**
   * ```
   * gfx.setpixel(any r, any g, any b)
   * ```
   * Writes a pixel of r,g,b to gfx.x,gfx.y.
   */
  function setpixel(r: number, g: number, b: number): void;

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

  /**
   * ```
   * gfx.transformblit(any srcimg, any destx, any desty, any destw, any desth, any div_w, any div_h, any table)
   * ```
   * Blits to destination at (destx,desty), size (destw,desth). div_w and div_h should be 2..64, and table should point to a table of 2*div_w*div_h values (table can be a regular table or (for less overhead) a reaper.array). Each pair in the table represents a S,T coordinate in the source image, and the table is treated as a left-right, top-bottom list of texture coordinates, which will then be rendered to the destination.
   */
  function transformblit(
    srcimg: number,
    destx: number,
    desty: number,
    destw: number,
    desth: number,
    div_w: number,
    div_h: number,
    table: any,
  ): void;

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

declare class reaper_array {
  readonly [opaqueTypeTag]: "reaper_array";

  /**
   * ```
   * reaper_array.clear(optional any value, optional any offset, optional any size)
   * ```
   * Sets the value of zero or more items in the array. If value not specified, 0.0 is used. offset is 1-based, if size omitted then the maximum amount available will be set.
   */
  clear(value?: any, offset?: any, size?: any): void;
  /**
   * ```
   * reaper_array.convolve(optional any src, optional any srcoffs, optional any size, optional any destoffs)
   * ```
   * Convolves complex value pairs from reaper.array, starting at 1-based srcoffs, reading/writing to 1-based destoffs. size is in normal items (so it must be even)
   */
  convolve(src?: any, srcoffs?: any, size?: any, destoffs?: any): void;
  /**
   * ```
   * reaper_array.copy(optional any src, optional any srcoffs, optional any size, optional any destoffs)
   * ```
   * Copies values from reaper.array or table, starting at 1-based srcoffs, writing to 1-based destoffs.
   */
  copy(src?: any, srcoffs?: any, size?: any, destoffs?: any): void;
  /**
   * ```
   * reaper_array.fft(any size, optional any permute, optional any offset)
   * ```
   * Performs a forward FFT of size. size must be a power of two between 4 and 32768 inclusive. If permute is specified and true, the values will be shuffled following the FFT to be in normal order.
   */
  fft(size: any, permute?: any, offset?: any): void;
  /**
   * ```
   * reaper_array.fft_real(any size, optional any permute, optional any offset)
   * ```
   * Performs a forward real->complex FFT of size. size must be a power of two between 4 and 32768 inclusive. If permute is specified and true, the values will be shuffled following the FFT to be in normal order.
   */
  fft_real(size: any, permute?: any, offset?: any): void;
  /**
   * ```
   * reaper_array.get_alloc()
   * ```
   * Returns the maximum (allocated) size of the array.
   */
  get_alloc(): void;
  /**
   * ```
   * reaper_array.ifft(any size, optional any permute, optional any offset)
   * ```
   * Performs a backwards FFT of size. size must be a power of two between 4 and 32768 inclusive. If permute is specified and true, the values will be shuffled before the IFFT to be in fft-order.
   */
  ifft(size: any, permute?: any, offset?: any): void;
  /**
   * ```
   * reaper_array.ifft_real(any size, optional any permute, optional any offset)
   * ```
   * Performs a backwards complex->real FFT of size. size must be a power of two between 4 and 32768 inclusive. If permute is specified and true, the values will be shuffled before the IFFT to be in fft-order.
   */
  ifft_real(size: any, permute?: any, offset?: any): void;
  /**
   * ```
   * reaper_array.multiply(optional any src, optional any srcoffs, optional any size, optional any destoffs)
   * ```
   * Multiplies values from reaper.array, starting at 1-based srcoffs, reading/writing to 1-based destoffs.
   */
  multiply(src?: any, srcoffs?: any, size?: any, destoffs?: any): void;
  /**
   * ```
   * reaper_array.resize(any size)
   * ```
   * Resizes an array object to size. size must be [0..max_size].
   */
  resize(size: any): void;
  /**
   * ```
   * reaper_array.table(optional any offset, optional any size)
   * ```
   * Returns a new table with values from items in the array. Offset is 1-based and if size is omitted all available values are used.
   */
  table(offset?: any, size?: any): void;
}
