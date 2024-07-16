import { TrackFX } from "./fx";

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
    return new Track(reaper.GetTrack(0, idx));
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

  getFxCount() {
    return reaper.TrackFX_GetCount(this.obj);
  }

  getAllFx() {
    const count = this.getFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new TrackFX(this.obj, i));
    }
    return result;
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

  getSends() {
    const category = TrackRoutingCategory.Send;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      const { src, dst } = TrackRouting.getTargetTracks(this.obj, category, i);
      result.push({ src, dst, ...info });
    }

    return result;
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

  getParentSendInfo(): ReturnType<Track["getSends"]>[number] {
    const parentTrack = reaper.GetMediaTrackInfo_Value(this.obj, "P_PARTRACK");
    return {
      ...TrackRouting.getParentInfo(this.obj),
      src: this.obj,
      dst: parentTrack,
    };
  }

  delete() {
    reaper.DeleteTrack(this.obj);
  }
}

export function getSelectedTracks() {
  return Track.getSelected();
}

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

module TrackRouting {
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
    // I'm adding '0' here because *parent* folder routing uses a number 0 to
    // indicate sending to master.
    //
    // Note this only happens for `Track.getParentSendInfo()`. This function
    // will always return a MediaTrack because 'track sends' can't target
    // the master track.
    //
    // I'm using TypeScript's `ReturnType<...>` bullshit so I have to add it here.
    const dst: MediaTrack | 0 = reaper.GetTrackSendInfo_Value(
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
    return { dst, src };
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

    const muted = reaper.GetMediaTrackInfo_Value(track, "B_MUTE") === 1;
    const phaseInverted =
      reaper.GetMediaTrackInfo_Value(track, "B_PHASE") === 1;

    const panmode = reaper.GetMediaTrackInfo_Value(track, "I_PANMODE");
    if (panmode === 6) {
      // dual pan mode, pan value is ignored in this track
      // i don't want to deal with this now
      error("dual-panned tracks are not supported by this script");
    }

    const volume = reaper.GetMediaTrackInfo_Value(track, "D_VOL");
    const pan = reaper.GetMediaTrackInfo_Value(track, "D_PAN");
    const width = reaper.GetMediaTrackInfo_Value(track, "D_WIDTH");
    const panLaw = reaper.GetMediaTrackInfo_Value(track, "D_PANLAW");

    return {
      channelCount: sendChannelCount,
      srcChannelOffset: 0, // always 0, no way to send with src offset
      dstChannelOffset: dstChannelOffset,
      muted,
      phaseInverted,
      mono: width === 0,
      volume,
      pan,
      panLaw,
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
