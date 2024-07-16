import { TrackFX } from "./fx";

export class Track {
  obj: MediaTrack;

  constructor(track: MediaTrack) {
    this.obj = track;
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

  sendsAudioToParent() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "B_MAINSEND") === 1;
  }

  getParentSendChannelOffset() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "C_MAINSEND_OFFS");
  }

  getParentSendChannelCount() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "C_MAINSEND_NCH");
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
    const mixToMono = I_DSTCHAN & 0b10000000000;

    const B_MUTE = GTSI_V("B_MUTE") === 1;
    const B_PHASE = GTSI_V("B_PHASE") === 1;
    const B_MONO = GTSI_V("B_MONO") === 1;
    const D_VOL = GTSI_V("D_VOL");
    const D_PAN = GTSI_V("D_PAN");
    const D_PANLAW = GTSI_V("D_PANLAW");
    const I_SENDMODE = GTSI_V("I_SENDMODE") as TrackSendMode;
    const I_AUTOMODE = GTSI_V("I_AUTOMODE") as TrackSendAutomationMode;
    // const P_DESTTRACK = GTSI_V("P_DESTTRACK") as unknown as MediaTrack;
    // const P_SRCTRACK = GTSI_V("P_SRCTRACK") as unknown as MediaTrack;

    return {
      channelCount,
      srcChannelOffset,
      dstChannelOffset,
      muted: B_MUTE,
      phaseInverted: B_PHASE,
      mono: B_MONO,
      volume: D_VOL,
      pan: D_PAN,
      panLaw: D_PANLAW === -1 ? null : D_PANLAW,
      sendMode: I_SENDMODE,
      automationMode: I_AUTOMODE,
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
    return { dst, src };
  }
}
