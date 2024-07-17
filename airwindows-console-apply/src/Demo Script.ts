AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "reaper-api/inspect";
import { Track, TrackSendMode } from "reaper-api/track";
import { copy } from "reaper-api/clipboard";
import { FXParam, TrackFX, AddFxParams } from "reaper-api/fx";
import { msgBox, undoBlock } from "reaper-api/utils";

const PLUGIN_PREFIX = "_AWC_: ";

/** Converts 0.5 => -6.02dB */
function scalarToDb(value: number) {
  return 20 * Math.log10(value);
}

/** Converts -6dB => 0.501 */
function dbToScalar(db: number) {
  return Math.pow(10, db / 20);
}

/** Converts airwindow's 0.5 => 0dB */
function awcScalarToDb(value: number) {
  return scalarToDb(value * 2);
}

/** Converts airwindow's -6dB => 0.25 */
function awcDbToScalar(db: number) {
  return dbToScalar(db) / 2;
}

/**
 * This FX is expected to map 2 channels of input to the same output channels.
 * Return the 2 channels if this is indeed the case. Otherwise, return null.
 */
function getMappedChannels(fx: TrackFX) {
  // get the pin mapping bitmasks
  const tr = fx.track;
  const idx = fx.fxidx;
  const [in1a, in1b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 0);
  const [in1c, in1d] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 0 + 0x1000000);
  const [in2a, in2b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 1);
  const [in2c, in2d] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 1 + 0x1000000);
  const [out1a, out1b] = reaper.TrackFX_GetPinMappings(tr, idx, 1, 0);
  const [out1c, out1d] = reaper.TrackFX_GetPinMappings(
    tr,
    idx,
    1,
    0 + 0x1000000,
  );
  const [out2a, out2b] = reaper.TrackFX_GetPinMappings(tr, idx, 1, 1);
  const [out2c, out2d] = reaper.TrackFX_GetPinMappings(
    tr,
    idx,
    1,
    1 + 0x1000000,
  );

  // ensure pin inputs/outputs are the same
  {
    const inOut1IsTheSame =
      in1a === out1a && in1b === out1b && in1c === out1c && in1d === out1d;
    const inOut2IsTheSame =
      in2a === out2a && in2b === out2b && in2c === out2c && in2d === out2d;
    if (!inOut1IsTheSame || !inOut2IsTheSame) {
      return null;
    }
  }

  // find the SINGLE pinned channel, otherwise return null
  const pin1 = [in1a, in1b, in1c, in1d];
  const pin2 = [in2a, in2b, in2c, in2d];
  let pin1channel: number | null = null;
  let pin2channel: number | null = null;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 32; j++) {
      const channelIdx = j + 32 * i;
      const pin1isSet = (pin1[i] & (1 << j)) !== 0;
      if (pin1isSet) {
        if (pin1channel === null) {
          pin1channel = channelIdx;
        } else {
          // more than 1 pin is set
          return null;
        }
      }
      const pin2isSet = (pin2[i] & (1 << j)) !== 0;
      if (pin2isSet) {
        if (pin2channel === null) {
          pin2channel = channelIdx;
        } else {
          // more than 1 pin is set
          return null;
        }
      }
    }
  }
  if (pin1channel === null) return null;
  if (pin2channel === null) return null;

  // input/output channels should be different
  if (pin1channel === pin2channel) return null;

  // input/output channels should be sequential
  if (!(pin1channel + 1 === pin2channel)) return null;

  return [pin1channel, pin2channel] as [number, number];
}

class CStripFx {
  static FX_IDENTS = [
    "utility/volume_pan_sample_accurate_auto",
    "utility\\volume_pan_sample_accurate_auto",
  ];
  static FX_NAME = `${PLUGIN_PREFIX}#CSTRIP`;
  static FX_ADD: AddFxParams = { js: CStripFx.FX_IDENTS[0] };

  fx: TrackFX;
  gainParam: FXParam;
  panParam: FXParam;

  private constructor(fx: TrackFX, gainParam: FXParam, panParam: FXParam) {
    this.fx = fx;
    // values are in dB
    this.gainParam = gainParam;
    // ranges from -100.0 .. 100.0
    this.panParam = panParam;
  }

  static fromFx(fx: TrackFX): CStripFx | null {
    const fxName = fx.getName();
    const fxIdent = fx.getIdent();
    if (
      !(fxName === CStripFx.FX_NAME && CStripFx.FX_IDENTS.includes(fxIdent))
    ) {
      return null;
    }

    // values are awc scalar 0 - 1
    const gainParam = fx.getParameter(0);
    if (!gainParam) return null;

    // values are 0 - 1
    const panParam = fx.getParameter(1);
    if (!panParam) return null;

    return new CStripFx(fx, gainParam, panParam);
  }

  static create(track: Track): CStripFx {
    const count = track.getFxCount();
    const newPos = track.addFx(CStripFx.FX_ADD, count - 1);
    if (newPos === null) error("failed to create gain plugin");

    const fx = track.getFx(newPos);
    fx.rename(CStripFx.FX_NAME);
    const strip = CStripFx.fromFx(fx);
    if (strip === null)
      error("created gain plugin, but its configuration is invalid");

    return strip;
  }

  static find(track: Track): CStripFx | null {
    for (const fx of track.getAllFx().reverse()) {
      const channel = CStripFx.fromFx(fx);
      if (channel !== null) return channel;
    }
    return null;
  }

  // move to second-last position
  moveToSecondLast() {
    const tr = this.fx.track;
    const fxcount = reaper.TrackFX_GetCount(tr);
    const oldIdx = this.fx.fxidx;
    const newIdx = fxcount - 2;
    log(`cstrip: move ${oldIdx} -> ${newIdx}`);

    // do nothing if already at end
    if (oldIdx === newIdx) return;

    // move the fx
    reaper.TrackFX_CopyToTrack(tr, oldIdx, tr, newIdx, true);
    // update the FX object to point to the correct index
    this.fx.fxidx = newIdx;

    // make sure it actually worked
    const channel = CStripFx.fromFx(this.fx);
    if (channel === null)
      error(
        `fatal error: something went wrong while moving cstrip fx from ${oldIdx} to ${newIdx}`,
      );
  }

  /** Gain amount in dB */
  gain() {
    return this.gainParam.getValue().cur;
  }

  /** @param gain Gain amount in dB */
  setGain(gain: number) {
    const rv = this.gainParam.setValue(gain);
    assert(rv, "failed to set gain");
  }

  /** Pan amount in range (-100 .. 100) */
  pan() {
    return this.panParam.getValue().cur;
  }

  /** @param pan Pan amount in range (-100 .. 100) */
  setPan(pan: number) {
    const rv = this.panParam.setValue(pan);
    assert(rv, "failed to set pan");
  }
}

class ChannelFx {
  static FX_IDENT = "com.airwindows.consolidated";
  static FX_NAME = `${PLUGIN_PREFIX}#CHANNEL`;
  static FX_ADD: AddFxParams = { clap: ChannelFx.FX_IDENT };
  static FX_PRESET = "ConsoleLAChannel";

  // max is 6dB
  static GAIN_DB_MAX = awcScalarToDb(1);
  static GAIN_PARAM_NAME = "Fader";
  static PAN_PARAM_NAME = "Pan";

  fx: TrackFX;
  gainParam: FXParam;
  panParam: FXParam;

  private constructor(fx: TrackFX, gainParam: FXParam, panParam: FXParam) {
    this.fx = fx;
    this.gainParam = gainParam;
    this.panParam = panParam;
  }

  static fromFx(fx: TrackFX): ChannelFx | null {
    const fxName = fx.getName();
    const fxIdent = fx.getIdent();
    if (!(fxName === ChannelFx.FX_NAME && fxIdent === ChannelFx.FX_IDENT)) {
      return null;
    }

    const [ok, preset] = reaper.TrackFX_GetPreset(fx.track, fx.fxidx);
    if (!ok) return null;
    if (preset !== ChannelFx.FX_PRESET) return null;

    const allParams = fx.getParameters();

    // values are awc scalar 0 - 1
    const gainParam = allParams.find(
      (x) => x.getName() === this.GAIN_PARAM_NAME,
    );
    if (!gainParam) return null;

    // values are 0 - 1
    const panParam = allParams.find((x) => x.getName() === this.PAN_PARAM_NAME);
    if (!panParam) return null;

    return new ChannelFx(fx, gainParam, panParam);
  }

  static create(track: Track): ChannelFx {
    const newPos = track.addFx(ChannelFx.FX_ADD);
    if (newPos === null) error("failed to create channel plugin");

    const fx = track.getFx(newPos);
    fx.rename(ChannelFx.FX_NAME);
    const ok = reaper.TrackFX_SetPreset(
      fx.track,
      fx.fxidx,
      ChannelFx.FX_PRESET,
    );
    if (!ok)
      error(
        `created channel plugin, but failed to set preset to ${ChannelFx.FX_PRESET}`,
      );

    const channel = ChannelFx.fromFx(fx);
    if (channel === null)
      error("created channel plugin, but its config is invalid");

    return channel;
  }

  static find(track: Track): ChannelFx | null {
    for (const fx of track.getAllFx().reverse()) {
      const channel = ChannelFx.fromFx(fx);
      if (channel !== null) return channel;
    }
    return null;
  }

  moveToEnd() {
    const tr = this.fx.track;
    const fxcount = reaper.TrackFX_GetCount(tr);
    const oldIdx = this.fx.fxidx;
    const newIdx = fxcount - 1;
    log(`channel: move ${oldIdx} -> ${newIdx}`);

    // do nothing if already at end
    if (oldIdx === newIdx) return;

    // move the fx
    reaper.TrackFX_CopyToTrack(tr, oldIdx, tr, newIdx, true);
    // update the FX object to point to the correct index
    this.fx.fxidx = newIdx;

    // make sure it actually worked
    const channel = ChannelFx.fromFx(this.fx);
    if (channel === null)
      error(
        `fatal error: something went wrong while moving channel fx from ${oldIdx} to ${newIdx}`,
      );
  }

  /** Gain amount in dB */
  gain() {
    const scalar = this.gainParam.getValue().cur;
    return awcScalarToDb(scalar);
  }

  /**
   * NOTE: Gain is limited! Max gain is ~6dB.
   * See `ChannelFx.GAIN_DB_MAX`
   * @param gain Gain amount in dB
   */
  setGain(gain: number) {
    if (gain > ChannelFx.GAIN_DB_MAX) {
      error(`cannot set gain of channel plugin to ${gain} dB`);
    }
    const rv = this.gainParam.setValue(awcDbToScalar(gain));
    assert(rv, "failed to set gain");
  }

  /** Pan amount in range (-100 .. 100) */
  pan() {
    // range 0..1
    const scalar = this.panParam.getValue().cur;
    return scalar * 200 - 100;
  }

  /** @param pan Pan amount in range (-100 .. 100) */
  setPan(pan: number) {
    // convert to range 0..1
    const scalar = (pan + 100) / 200;
    const rv = this.panParam.setValue(scalar);
    assert(rv, "failed to set pan");
  }
}

class BussFx {
  static FX_IDENT = "com.airwindows.consolidated";
  static FX_NAME = `${PLUGIN_PREFIX}#BUSS`;
  static FX_ADD: AddFxParams = { clap: BussFx.FX_IDENT };
  static FX_PRESET = "ConsoleLABuss";

  fx: TrackFX;

  private constructor(fx: TrackFX) {
    this.fx = fx;
  }

  static fromFx(fx: TrackFX): BussFx | null {
    const fxName = fx.getName();
    const fxIdent = fx.getIdent();
    if (!(fxName === BussFx.FX_NAME && fxIdent === BussFx.FX_IDENT)) {
      return null;
    }

    const [ok, preset] = reaper.TrackFX_GetPreset(fx.track, fx.fxidx);
    if (!ok) return null;
    if (preset !== BussFx.FX_PRESET) return null;

    return new BussFx(fx);
  }

  static create(track: Track) {
    const newPos = track.addFx(BussFx.FX_ADD);
    if (newPos === null) error("failed to create channel plugin");

    const fx = track.getFx(newPos);
    fx.rename(BussFx.FX_NAME);
    const ok = reaper.TrackFX_SetPreset(fx.track, fx.fxidx, BussFx.FX_PRESET);
    if (!ok)
      error(
        `created channel plugin, but failed to set preset to ${BussFx.FX_PRESET}`,
      );

    const channel = BussFx.fromFx(fx);
    if (channel === null)
      error("created channel plugin, but its config is invalid");

    return channel;
  }

  static find(track: Track): BussFx | null {
    for (const fx of track.getAllFx().reverse()) {
      const channel = BussFx.fromFx(fx);
      if (channel !== null) return channel;
    }
    return null;
  }

  moveToTop() {
    const tr = this.fx.track;
    const oldIdx = this.fx.fxidx;
    const newIdx = 0;
    log(`buss: move ${oldIdx} -> ${newIdx}`);

    // do nothing if already at target pos
    if (oldIdx === newIdx) return;

    // move the fx
    reaper.TrackFX_CopyToTrack(tr, oldIdx, tr, newIdx, true);
    // update the FX object to point to the correct index
    this.fx.fxidx = newIdx;

    // make sure it actually worked
    const channel = BussFx.fromFx(this.fx);
    if (channel === null)
      error(
        `fatal error: something went wrong while moving buss fx from ${oldIdx} to ${newIdx}`,
      );
  }
}

function trackHasAudioItems(tr: Track) {
  for (const item of tr.iterItems()) {
    for (const take of item.iterTakes()) {
      // assume non-midi take is audio
      if (!take.isMidi()) {
        return true;
      }
    }
  }
  return false;
}

function audioRoutingInfo() {
  type Idx = number;

  const count = Track.count();
  const errors = {
    unsupportedSendMode: [] as Idx[],
    nonUnityGain: [] as Idx[],
    nonUnityPan: [] as Idx[],
    bussWithAudioItems: [] as Idx[],
  };

  const srcTracks: Record<number, { volume: number; pan: number; dst: Idx[] }> =
    {};
  const dstTracks: Record<number, Idx[]> = {};

  for (let srcIdx = 0; srcIdx < count; srcIdx++) {
    const track = Track.getByIdx(srcIdx);
    const trackVolume = track.getVolume();
    const trackPan = track.getPan();

    for (const send of track.getSends(true)) {
      const audio = send.audio;
      if (!audio) continue;

      // i can potentially support 2 types of tracks:
      // - **all** sends are post-fader, routing to parent folder is optional
      // - **all** sends are pre-fader, and no routing to parent folder
      // i'm running out of time so i'll only support the first type of send
      if (audio.sendMode !== TrackSendMode.PostFader) {
        errors.unsupportedSendMode.push(srcIdx);
        continue;
      }

      if (audio.volume !== 1) {
        errors.nonUnityGain.push(srcIdx);
        continue;
      }
      if (audio.pan !== 0) {
        errors.nonUnityPan.push(srcIdx);
        continue;
      }

      const dstIdx = send.dst.getIdx();

      srcTracks[srcIdx] ||= {
        volume: trackVolume,
        pan: trackPan,
        dst: [],
      };
      srcTracks[srcIdx].dst.push(dstIdx);

      dstTracks[dstIdx] ||= [];
      dstTracks[dstIdx].push(srcIdx);
    }
  }

  // for receives, check that they don't have audio items
  for (const _ in dstTracks) {
    const dstIdx = _ as unknown as number;

    // skip master track
    if (dstIdx === -1) continue;

    const track = Track.getByIdx(dstIdx);
    const hasAudioItems = trackHasAudioItems(track);

    if (hasAudioItems) {
      delete dstTracks[dstIdx];
      errors.bussWithAudioItems.push(dstIdx);
    }
  }

  return { sends: srcTracks, receives: dstTracks, errors };
}

class ChannelTrack {
  track: Track;
  channel: ChannelFx;
  strip?: CStripFx;

  private constructor(track: Track, channel: ChannelFx, strip?: CStripFx) {
    this.track = track;
    this.channel = channel;
    this.strip = strip;
  }

  static setup(tr: Track): ChannelTrack {
    const channel = ChannelFx.find(tr) || ChannelFx.create(tr);
    channel.moveToEnd();
    const strip = CStripFx.find(tr);
    if (strip) strip.moveToSecondLast();

    return new ChannelTrack(tr, channel, strip || undefined);
  }

  /** Return the gain applied by all the plugins, minus the track fader. Unit is dB */
  fxgain(): number {
    if (this.strip) {
      return this.channel.gain() + this.strip.gain();
    } else {
      return this.channel.gain();
    }
  }

  /** Set the gain applied by all the plugins, minus the track fader. Unit is dB */
  setFxgain(db: number) {
    if (db > ChannelFx.GAIN_DB_MAX) {
      const channelDb = ChannelFx.GAIN_DB_MAX;
      const stripDb = db - ChannelFx.GAIN_DB_MAX;
      this.channel.setGain(channelDb);

      if (!this.strip) {
        // create a strip
        this.strip = CStripFx.create(this.track);
        // fix fx index of channel plugin
        this.channel.fx.fxidx += 1;
      }

      this.strip.setGain(stripDb);
    } else {
      this.channel.setGain(db);
      if (this.strip) {
        // delete the strip
        reaper.TrackFX_Delete(this.track.obj, this.strip.fx.fxidx);
        this.strip = undefined;

        // fix fx index of channel plugin
        this.channel.fx.fxidx -= 1;
      }
    }
  }

  /** Range is -100..100 */
  fxpan(): number {
    return this.channel.pan();
  }

  /** Range is -100..100 */
  setFxpan(pan: number) {
    this.channel.setPan(pan);
  }

  /** Unit is dB */
  trackgain(): number {
    return scalarToDb(this.track.getVolume());
  }

  /** Range is -100..100 */
  trackpan(): number {
    // convert range -1..1 to -100..100
    return this.track.getPan() * 100;
  }

  /** Unit is dB */
  setTrackgain(db: number) {
    this.track.setVolume(dbToScalar(db));
  }

  /** Range is -100..100 */
  setTrackpan(pan: number) {
    this.track.setPan(pan / 100);
  }
}

class BussTrack {
  track: Track;
  buss: BussFx;

  private constructor(track: Track, buss: BussFx) {
    this.track = track;
    this.buss = buss;
  }

  static setup(tr: Track): BussTrack {
    const buss = BussFx.find(tr) || BussFx.create(tr);
    buss.moveToTop();
    return new BussTrack(tr, buss);
  }
}

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  const result = audioRoutingInfo();

  // show errors with message box
  {
    if (result.errors.nonUnityGain.length > 0) {
      msgBox(
        "Error",
        "Some tracks have sends with gain set to a non-zero value. Please set the gain of these tracks' sends to 0dB. (The tracks will be shown in the console output window)",
      );
      log("Please set the gain of the following tracks' sends to 0dB:");
      for (const idx of result.errors.nonUnityGain) {
        const track = Track.getByIdx(idx as unknown as number);
        const name = track.getName();
        log(`- Track ${idx}: ${encode(name)}`);
      }
    }
    if (result.errors.nonUnityPan.length > 0) {
      msgBox(
        "Error",
        "Some tracks have sends with pan set to a non-zero value. Please set the pan of these tracks' sends to center. (The tracks will be shown in the console output window)",
      );
      log("Please set the pan of the following tracks' sends to center:");
      for (const idx of result.errors.nonUnityPan) {
        const track = Track.getByIdx(idx as unknown as number);
        const name = track.getName();
        log(`- Track ${idx}: ${encode(name)}`);
      }
    }
    if (result.errors.unsupportedSendMode.length > 0) {
      msgBox(
        "Error",
        "Some tracks have sends with mode set to an unsupported mode. Please set the mode of these tracks' sends to 'Post-Fader (Post-Pan)'. (The tracks will be shown in the console output window)",
      );
      log(
        "Please set the mode of the following tracks' sends to 'Post-Fader (Post-Pan)':",
      );
      for (const idx of result.errors.unsupportedSendMode) {
        const track = Track.getByIdx(idx as unknown as number);
        const name = track.getName();
        log(`- Track ${idx}: ${encode(name)}`);
      }
    }
    if (result.errors.bussWithAudioItems.length > 0) {
      msgBox(
        "Error",
        "Some tracks receive audio from other tracks, and also receives audio from audio items. Please reorganise the tracks to avoid tracks that have both audio items and receives from other tracks. (The tracks will be shown in the console output window)",
      );
      log(
        "Please reorganise these tracks to avoid tracks with both audio items and receives from other tracks:",
      );
      for (const idx of result.errors.bussWithAudioItems) {
        const track = Track.getByIdx(idx as unknown as number);
        const name = track.getName();
        log(`- Track ${idx}: ${encode(name)}`);
      }
    }
    if (
      result.errors.nonUnityGain.length > 0 ||
      result.errors.nonUnityPan.length > 0 ||
      result.errors.unsupportedSendMode.length > 0 ||
      result.errors.bussWithAudioItems.length > 0
    ) {
      return;
    }
  }

  undoBlock(() => {
    // process sends
    for (const _ in result.sends) {
      const srcIdx = _ as unknown as number;
      const sendInfo = result.sends[srcIdx];

      const track = Track.getByIdx(srcIdx as unknown as number);

      const channel = ChannelTrack.setup(track);
      channel.setTrackgain(0);
      channel.setTrackpan(0);
      channel.setFxgain(sendInfo.volume);
      channel.setFxpan(sendInfo.pan);
    }

    // process receives
    for (const _ in result.receives) {
      const dstIdx = _ as unknown as number;
      const receiveInfo = result.receives[dstIdx];
      const track = dstIdx === -1 ? Track.getMaster() : Track.getByIdx(dstIdx);

      const buss = BussTrack.setup(track);
    }

    return { desc: "testing script", flags: -1 };
  });
}

main();
