import {
  AddFxParams,
  FX,
  generateTakeContainerFxidx,
  generateTrackContainerFxidx,
  parseTakeContainerFxidx,
  parseTrackContainerFxidx,
  stringifyAddFxParams,
} from "./fx";
import { inspect } from "./inspect";

export class Track {
  obj: MediaTrack;

  constructor(track: MediaTrack) {
    this.obj = track;
  }

  static getMaster() {
    return new Track(reaper.GetMasterTrack(0));
  }

  static count() {
    return reaper.CountTracks(0);
  }

  static getByIdx(idx: number) {
    const obj = reaper.GetTrack(0, idx);
    if (obj === null) throw new Error(`failed to get track with index ${idx}`);
    return new Track(obj);
  }

  static getSelected() {
    const tracks = [];
    let i = 0;
    while (true) {
      const t = reaper.GetSelectedTrack2(0, i, true);
      if (t === null) return tracks;

      tracks.push(new Track(t));
      i += 1;
    }
  }

  static *iterAll() {
    const count = Track.count();
    for (let i = 0; i < count; i++) {
      yield Track.getByIdx(i);
    }
  }

  static getAll() {
    const count = Track.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(Track.getByIdx(i));
    }
    return result;
  }

  /** Returns new position if success, otherwise return nil */
  addFx(fx: AddFxParams, position?: number | number[]) {
    const fxname = stringifyAddFxParams(fx);

    let positionNum: number | null = null;
    let positionArr: number[] | null = null;
    if (position !== undefined) {
      if (typeof position === "number") {
        positionArr = parseTrackContainerFxidx(this.obj, position);
        positionNum = position;
      } else {
        positionArr = [...position];
        positionNum = generateTrackContainerFxidx(this.obj, position);
      }
    }

    const rv = reaper.TrackFX_AddByName(
      this.obj,
      fxname,
      false,
      positionNum === null ? -1 : -1000 - positionNum,
    );
    if (rv === -1) {
      return null;
    }

    // rv is fx index WITHIN container / fxchain, does not have container index
    const newSubposition = rv;
    if (positionArr === null) {
      // no position specified, so it must be root fxchain position
      return newSubposition;
    } else {
      positionArr[positionArr.length - 1] = newSubposition;
      return generateTrackContainerFxidx(this.obj, positionArr);
    }

    // const fxname = stringifyAddFxParams(fx);
    // if (position !== undefined && typeof position !== "number") {
    //   position = generateTrackContainerFxidx(this.obj, position);
    // }

    // const rv = reaper.TrackFX_AddByName(
    //   this.obj,
    //   fxname,
    //   false,
    //   position === undefined ? -1 : -1000 - position,
    // );
    // if (rv === -1) {
    //   return null;
    // }
    // // rv is fx index WITHIN container / fxchain, does not have container index
    // const newSubposition = rv;
    // if (position === undefined) {
    //   // no position specified, so it must be root fxchain position
    //   return newSubposition;
    // } else {
    //   const parsedPos = parseTrackContainerFxidx(this.obj, position);
    //   parsedPos.pop();
    //   parsedPos.push(newSubposition);
    //   return generateTrackContainerFxidx(this.obj, parsedPos);
    // }
  }

  getFxCount() {
    return reaper.TrackFX_GetCount(this.obj);
  }

  getAllFx() {
    const count = this.getFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new FX({ track: this.obj }, i));
    }
    return result;
  }

  getFx(idx: number) {
    return new FX({ track: this.obj }, idx);
  }

  /**
   * Raw folder depth value from Reaper's API. Value indicates the change
   * in depth in folder structure. E.g. '1' means next track will be a folder
   * down. '-2' means next track will be 2 folders up.
   *
   * Original documentation:
   *
   * ---
   *
   * folder depth change,
   * - 0=normal,
   * - 1=track is a folder parent,
   * - -1=track is the last in the innermost folder,
   * - -2=track is the last in the innermost and next-innermost folders, etc
   */
  getRawFolderDepth() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "I_FOLDERDEPTH");
  }

  getSends(includeParent: boolean = false) {
    const category = TrackRoutingCategory.Send;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    if (includeParent) {
      const info = TrackRouting.getParentInfo(this.obj);
      if (info.audio !== null || info.midi !== null) {
        let parentTrack = reaper.GetMediaTrackInfo_Value(
          this.obj,
          "P_PARTRACK",
        ) as MediaTrack | 0;
        // for some reason, 'P_PARTRACK' will just return a 0 (number) for the master track
        if (parentTrack === 0) {
          parentTrack = reaper.GetMasterTrack(0);
        }

        result.push({
          ...info,
          src: new Track(this.obj),
          dst: new Track(parentTrack),
        });
      }
    }

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      const { src, dst } = TrackRouting.getTargetTracks(this.obj, category, i);
      result.push({ src, dst, ...info });
    }

    return result;
  }

  /** Return value is scalar, 0..1..inf */
  getVolume() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_VOL");
  }
  /** Value is scalar, 0..1..inf */
  setVolume(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_VOL", val);
    if (!ok) throw new Error("failed to set volume");
  }
  /** Return value in range -1..0..1 */
  getPan() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_PAN");
  }
  /** Value in range -1..0..1 */
  setPan(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_PAN", val);
    if (!ok) throw new Error("failed to set pan");
  }
  /** Return value in range -1..0..1 */
  getWidth() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_WIDTH");
  }
  /** Value in range -1..0..1 */
  setWidth(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_WIDTH", val);
    if (!ok) throw new Error("failed to set width");
  }
  /** pan law of track, <0=project default, 0.5=-6dB, 0.707..=-3dB, 1=+0dB, 1.414..=-3dB with gain compensation, 2=-6dB with gain compensation, etc */
  getPanLaw() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_PANLAW");
  }
  /** pan law of track, <0=project default, 0.5=-6dB, 0.707..=-3dB, 1=+0dB, 1.414..=-3dB with gain compensation, 2=-6dB with gain compensation, etc */
  setPanLaw(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_PANLAW", val);
    if (!ok) throw new Error("failed to set pan law");
  }
  getMuted() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "B_MUTE") === 1;
  }
  setMuted(val: boolean) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "B_MUTE", val ? 1 : 0);
    if (!ok) throw new Error("failed to set muted");
  }
  getPhaseInverted() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "B_PHASE") === 1;
  }
  setPhaseInverted(val: boolean) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "B_PHASE", val ? 1 : 0);
    if (!ok) throw new Error("failed to set phase inverted");
  }
  /** pan mode, 0=classic 3.x, 3=new balance, 5=stereo pan, 6=dual pan */
  getPanmode() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "I_PANMODE");
  }
  /** pan mode, 0=classic 3.x, 3=new balance, 5=stereo pan, 6=dual pan */
  setPanmode(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "I_PANMODE", val);
    if (!ok) throw new Error("failed to set panmode");
  }

  getReceives() {
    const category = TrackRoutingCategory.Receive;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      const { src, dst } = TrackRouting.getTargetTracks(this.obj, category, i);
      result.push({ src, dst, ...info });
    }

    return result;
  }

  getHWOutputs() {
    const category = TrackRoutingCategory.HWOutput;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      result.push(info);
    }

    return result;
  }

  getName() {
    const [ok, val] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_NAME",
      "",
      false,
    );
    if (!ok) {
      // will always fail on master track, check if we are on master track
      if (this.getIdx() === -1) return "";

      throw new Error("failed to get track name");
    }
    return val;
  }

  setName(name: string) {
    const [ok, val] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_NAME",
      name,
      true,
    );
    if (!ok) {
      // will always fail on master track, check if we are on master track
      if (this.getIdx() === -1) return;

      throw new Error("failed to set track name");
    }
  }

  delete() {
    reaper.DeleteTrack(this.obj);
  }

  /** Returns 0-based index of track. Master track returns -1. */
  getIdx() {
    const tracknumber = reaper.GetMediaTrackInfo_Value(
      this.obj,
      "IP_TRACKNUMBER",
    );
    if (tracknumber === 0) throw new Error("failed to get track number");
    if (tracknumber === -1) return -1;

    // convert the float to an integer
    return Math.round(tracknumber - 1);
  }

  *iterItems() {
    const count = reaper.CountTrackMediaItems(this.obj);
    for (let i = 0; i < count; i++) {
      const item = reaper.GetTrackMediaItem(this.obj, i);
      yield new Item(item);
    }
  }
}

export class Item {
  obj: MediaItem;

  constructor(obj: MediaItem) {
    this.obj = obj;
  }

  static getSelected(): Item[] {
    const count = reaper.CountSelectedMediaItems(0);
    const result: Item[] = [];
    for (let i = 0; i < count; i++) {
      const obj = reaper.GetSelectedMediaItem(0, i);
      result.push(new Item(obj));
    }
    return result;
  }

  *iterTakes() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    for (let i = 0; i < count; i++) {
      const take = reaper.GetMediaItemTake(this.obj, i);
      yield new Take(take);
    }
  }

  activeTake() {
    const take = reaper.GetActiveTake(this.obj);
    if (!take) return null;

    return new Take(take);
  }

  isEmpty() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    return count === 0;
  }

  getColor(): { r: number; g: number; b: number } | null {
    const color = reaper.GetMediaItemInfo_Value(this.obj, "I_CUSTOMCOLOR");
    if (color === 0) return null;

    const [r, g, b] = reaper.ColorFromNative(color);
    return { r, g, b };
  }

  setColor(color: { r: number; g: number; b: number } | null) {
    const newColor: number =
      color !== null
        ? reaper.ColorToNative(color.r, color.g, color.b) | 0x01000000
        : 0;
    const rv = reaper.SetMediaItemInfo_Value(
      this.obj,
      "I_CUSTOMCOLOR",
      newColor,
    );
    if (!rv) throw new Error(`failed to set item color to ${inspect(color)}`);
  }

  getPosition(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_POSITION");
  }

  getSnapOffset(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_SNAPOFFSET");
  }

  getLength(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_LENGTH");
  }

  getTrack(): Track {
    const obj = reaper.GetMediaItemTrack(this.obj);
    return new Track(obj);
  }
}

export class Take {
  obj: MediaItem_Take;

  constructor(obj: MediaItem_Take) {
    this.obj = obj;
  }

  type() {
    const source = reaper.GetMediaItemTake_Source(this.obj);
    return reaper.GetMediaSourceType(source);
  }

  isMidi() {
    const type = this.type();
    return type === "MIDI" || type === "MIDIPOOL";
  }

  source() {
    return new Source(reaper.GetMediaItemTake_Source(this.obj));
  }

  getName(): string {
    const [ok, rv] = reaper.GetSetMediaItemTakeInfo_String(
      this.obj,
      "P_NAME",
      "",
      false,
    );
    if (!ok) throw new Error("failed to get name of take");
    return rv;
  }

  getFxCount() {
    return reaper.TakeFX_GetCount(this.obj);
  }

  /** Returns new position if success, otherwise return nil */
  addFx(fx: AddFxParams, position?: number | number[]) {
    const fxname = stringifyAddFxParams(fx);

    let positionNum: number | null = null;
    let positionArr: number[] | null = null;
    if (position !== undefined) {
      if (typeof position === "number") {
        positionArr = parseTakeContainerFxidx(this.obj, position);
        positionNum = position;
      } else {
        positionArr = [...position];
        positionNum = generateTakeContainerFxidx(this.obj, position);
      }
    }

    const rv = reaper.TakeFX_AddByName(
      this.obj,
      fxname,
      positionNum === null ? -1 : -1000 - positionNum,
    );
    if (rv === -1) {
      return null;
    }

    // rv is fx index WITHIN container / fxchain, does not have container index
    const newSubposition = rv;
    if (positionArr === null) {
      // no position specified, so it must be root fxchain position
      return newSubposition;
    } else {
      positionArr[positionArr.length - 1] = newSubposition;
      return generateTakeContainerFxidx(this.obj, positionArr);
    }

    // const fxname = stringifyAddFxParams(fx);
    // if (position !== undefined && typeof position !== "number") {
    //   position = generateTakeContainerFxidx(this.obj, position);
    // }

    // const rv = reaper.TakeFX_AddByName(
    //   this.obj,
    //   fxname,
    //   position === undefined ? -1 : -1000 - position,
    // );
    // if (rv === -1) {
    //   return null;
    // }
    // // rv is fx index WITHIN container / fxchain, does not have container index
    // const newSubposition = rv;
    // if (position === undefined) {
    //   // no position specified, so it must be root fxchain position
    //   return newSubposition;
    // } else {
    //   const parsedPos = parseTakeContainerFxidx(this.obj, position);
    //   parsedPos.pop();
    //   parsedPos.push(newSubposition);
    //   return generateTakeContainerFxidx(this.obj, parsedPos);
    // }
  }

  getItem(): Item {
    const obj = reaper.GetMediaItemTake_Item(this.obj);
    return new Item(obj);
  }

  getTrack(): Track {
    const obj = reaper.GetMediaItemTake_Track(this.obj);
    return new Track(obj);
  }
}

export class MidiTake {
  obj: MediaItem_Take;

  constructor(obj: MediaItem_Take) {
    this.obj = obj;
  }

  /** Return the active MIDI take that's being edited in the open MIDI editor (if open) */
  static active(): MidiTake | null {
    const hwnd = reaper.MIDIEditor_GetActive();
    if (hwnd === null) return null;

    const take = reaper.MIDIEditor_GetTake(hwnd);
    return new MidiTake(take);
  }

  /**
   * Returns the grid info of this MIDI editor take
   * - `beats`: Grid size in beats (there are 4 beats in a measure)
   * - `swing`: From -1.0 .. 0.0 .. 1.0
   * - `noteLengthOverride`: Length of inputted notes, will be null if following grid size
   */
  grid() {
    const [beats, swing, noteBeats] = reaper.MIDI_GetGrid(this.obj);
    return {
      beats,
      swing,
      noteLengthOverride: noteBeats === 0 ? null : noteBeats,
    };
  }
}

export class Source {
  obj: PCM_source;

  constructor(obj: PCM_source) {
    this.obj = obj;
  }

  type() {
    return reaper.GetMediaSourceType(this.obj);
  }
}

/**
 * ================================================================
 *
 * Track routing functions
 *
 * ================================================================
 */

export enum TrackRoutingCategory {
  Receive = -1,
  Send = 0,
  HWOutput = 1,
}

export enum TrackSendMode {
  PostFader = 0,
  PreFx = 1,
  PostFxDeprecated = 2,
  PostFx = 3,
}

export enum TrackSendAutomationMode {
  TrackDefault = -1,
  Trim = 0,
  Read = 1,
  Touch = 2,
  Write = 3,
  Latch = 4,
}

namespace TrackRouting {
  export function parseMidiFlags(flags: number) {
    const first5bits = flags & 0b0000011111;
    const midiSendDisabled = first5bits === 0b11111;
    if (midiSendDisabled) return null;

    const next5bits = flags & 0b1111100000;
    const srcChannel = first5bits === 0 ? ("all" as const) : first5bits;
    const dstChannel = next5bits === 0 ? ("all" as const) : next5bits;

    // flag to indicate that the faders are controlling midi data
    // toggled with a button
    const fadersSendMidiVolPan = (flags & 1024) !== 0;

    const rawSrcBus = (flags >>> 14) & 255;
    const srcBus = rawSrcBus === 0 ? ("all" as const) : rawSrcBus;
    const rawDstBus = (flags >>> 22) & 255;
    const dstBus = rawDstBus === 0 ? ("all" as const) : rawDstBus;

    return {
      srcChannel,
      dstChannel,
      srcBus,
      dstBus,
      fadersSendMidiVolPan,
    };
  }

  export function getAudioInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
  ) {
    const GTSI_V = (param: string) => {
      return reaper.GetTrackSendInfo_Value(track, category, idx, param);
    };
    const I_SRCCHAN = GTSI_V("I_SRCCHAN");
    if (I_SRCCHAN === -1) {
      return null;
    }

    const srcChannelOffset = I_SRCCHAN & 0b1111111111;
    let channelCount: number;
    switch (I_SRCCHAN >>> 10) {
      case 0:
        channelCount = 2;
        break;
      case 1:
        channelCount = 1;
        break;
      default:
        channelCount = (I_SRCCHAN >>> 10) * 2;
        break;
    }

    const I_DSTCHAN = GTSI_V("I_DSTCHAN");
    const dstChannelOffset = I_DSTCHAN & 0b01111111111;
    // idk what this is
    const mixToMono = (I_DSTCHAN & 0b10000000000) !== 0;

    const muted = GTSI_V("B_MUTE") === 1;
    const phaseInverted = GTSI_V("B_PHASE") === 1;
    const mono = GTSI_V("B_MONO") === 1;
    const volume = GTSI_V("D_VOL");
    const pan = GTSI_V("D_PAN");
    const D_PANLAW = GTSI_V("D_PANLAW");
    const panLaw = D_PANLAW === -1 ? null : D_PANLAW;
    const sendMode = GTSI_V("I_SENDMODE") as TrackSendMode;
    const automationMode = GTSI_V("I_AUTOMODE") as TrackSendAutomationMode;

    return {
      channelCount,
      srcChannelOffset,
      dstChannelOffset,
      muted,
      phaseInverted,
      mono,
      volume,
      pan,
      panLaw,
      sendMode,
      automationMode,
      mixToMono,
    };
  }

  export function getInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
  ) {
    const audio = TrackRouting.getAudioInfo(track, category, idx);

    const midiFlags = reaper.GetTrackSendInfo_Value(
      track,
      TrackRoutingCategory.Send,
      idx,
      "I_MIDIFLAGS",
    );
    const midi = TrackRouting.parseMidiFlags(midiFlags);

    return { audio, midi };
  }

  export function getTargetTracks(
    track: MediaTrack,
    category: TrackRoutingCategory.Send | TrackRoutingCategory.Receive,
    idx: number,
  ) {
    const dst: MediaTrack = reaper.GetTrackSendInfo_Value(
      track,
      category,
      idx,
      "P_DESTTRACK",
    );
    const src: MediaTrack = reaper.GetTrackSendInfo_Value(
      track,
      category,
      idx,
      "P_SRCTRACK",
    );
    return { dst: new Track(dst), src: new Track(src) };
  }

  export function getParentAudioInfo(
    track: MediaTrack,
  ): ReturnType<typeof getAudioInfo> {
    const sendsAudioToParent =
      reaper.GetMediaTrackInfo_Value(track, "B_MAINSEND") === 1;

    if (!sendsAudioToParent) return null;

    const trackChannelCount = reaper.GetMediaTrackInfo_Value(track, "I_NCHAN");
    const dstChannelOffset = reaper.GetMediaTrackInfo_Value(
      track,
      "C_MAINSEND_OFFS",
    );
    const rawSendChannelCount = reaper.GetMediaTrackInfo_Value(
      track,
      "C_MAINSEND_NCH",
    );
    const sendChannelCount =
      rawSendChannelCount === 0 ? trackChannelCount : rawSendChannelCount;

    return {
      channelCount: sendChannelCount,
      srcChannelOffset: 0, // always 0, no way to send with src offset
      dstChannelOffset: dstChannelOffset,
      // Hard-code values here instead of actually using fader values.
      // Because this should be in line with how the other sends behave.
      //
      // Imagine the fx audio flow looks like this:
      //
      //              +->Info-->Track1 (post-fade send)
      //              |
      //  FX-+->Fader-+->XXXX-->Parent
      //     |
      //     +->Info-->Track2 (pre-fade send)
      //
      // The 'Fader' is where the volume slider, pan, etc actually happens.
      // The 'Info' is what's being returned by these routing functions.
      // The 'XXXX' is what this function returns. It doesn't really exist
      // in Reaper's audio chain but this is a useful abstraction for me.
      muted: false,
      phaseInverted: false,
      mono: false,
      volume: 1,
      pan: 0,
      panLaw: null, // null means project default
      sendMode: TrackSendMode.PostFader, // post fader is the default
      automationMode: TrackSendAutomationMode.TrackDefault, // i'm lazy so i'll just set this as default for now
      mixToMono: false, // no idea what this is
    };
  }

  export function getParentMidiInfo(
    track: MediaTrack,
  ): ReturnType<typeof parseMidiFlags> {
    const sendsAudioToParent =
      reaper.GetMediaTrackInfo_Value(track, "B_MAINSEND") === 1;

    // this also includes midi I think
    if (!sendsAudioToParent) return null;

    const I_MIDI_CTL_CHAN = reaper.GetMediaTrackInfo_Value(
      track,
      "I_MIDI_CTL_CHAN",
    );
    let faderLinkedChannel: number | "all" | null;
    switch (I_MIDI_CTL_CHAN) {
      case 16:
        faderLinkedChannel = "all" as const;
        break;
      case -1:
        faderLinkedChannel = null;
        break;
      default:
        faderLinkedChannel = I_MIDI_CTL_CHAN + 1;
        break;
    }

    return {
      // there's no documentation on how to get these
      // so i'll assume all are send
      srcChannel: "all",
      dstChannel: "all",
      srcBus: "all",
      dstBus: "all",
      fadersSendMidiVolPan: faderLinkedChannel !== null,
    };
  }

  export function getParentInfo(track: MediaTrack): ReturnType<typeof getInfo> {
    const audio = TrackRouting.getParentAudioInfo(track);
    const midi = TrackRouting.getParentMidiInfo(track);
    return { audio, midi };
  }
}

/**
 * Iterates through all tracks in the project, then returns maps for sending and receiving
 * tracks. This includes the default routing to folder parents.
 *
 * - `sends`: Maps from `trackIdx` to a list of `trackIdx` which this track sends to
 * - `receives`: Maps from `trackIdx` to a list of `trackIdx` sends to this track
 *
 * Note: The `receives` map contains `-1` which represent the master track.
 *
 * @param opt Specify what kind of routing to filter for. E.g. If you only care about audio
 *            routing, specify `{ audio: true }`
 */
export function getProjectRoutingInfo(
  opt: {
    audio?: boolean;
    midi?: boolean;
  } = { audio: true, midi: true },
) {
  const count = Track.count();

  const sends: LuaTable<number, number[]> = new LuaTable();
  const receives: LuaTable<number, number[]> = new LuaTable();

  for (let srcIdx = 0; srcIdx < count; srcIdx++) {
    const track = Track.getByIdx(srcIdx);

    for (const send of track.getSends(true)) {
      if (opt.audio && opt.midi) {
        if (!(send.audio || send.midi)) continue;
      } else if (opt.audio) {
        if (!send.audio) continue;
      } else if (opt.midi) {
        if (!send.midi) continue;
      }

      const dstIdx = send.dst.getIdx();

      if (!sends.has(srcIdx)) sends.set(srcIdx, []);
      sends.get(srcIdx).push(dstIdx);

      if (!receives.has(dstIdx)) receives.set(dstIdx, []);
      receives.get(dstIdx).push(srcIdx);
    }
  }

  return { sends, receives };
}
