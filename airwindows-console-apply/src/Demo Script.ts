AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "reaper-api/inspect";
import { Track } from "reaper-api/track";
import { copy } from "reaper-api/clipboard";
import { FXParam, TrackFX, AddFxParams } from "reaper-api/fx";
import { undoBlock } from "reaper-api/utils";

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
  static FX_NAME = "AWC: #CSTRIP";
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
  static FX_NAME = "AWC: #CHANNEL";
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
  static FX_NAME = "AWC: #BUSS";
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

// class ConsoleTrack {
//   track: Track;

//   constructor(track: Track) {
//     this.track = track;
//   }

//   setup() {
//     for (const fx of this.track.getAllFx()) {
//       // // ensure fx is at end of chain
//       // const fxcount = track.getFxCount();
//       // if (fx.fxidx !== fxcount - 1) {
//       //   reaper.TrackFX_CopyToTrack(
//       //     track.obj,
//       //     fx.fxidx,
//       //     track.obj,
//       //     fxcount - 1,
//       //     true,
//       //   );
//       // }
//     }
//     reaper.TrackFX_SetNamedConfigParm;
//     // this.track.addFx({js: 'utility/volume'});
//   }
// }

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  undoBlock(() => {
    const result = Track.getSelected().map((tr) => {
      const buss = BussFx.find(tr) || BussFx.create(tr);
      buss.moveToTop();
      const channel = ChannelFx.find(tr) || ChannelFx.create(tr);
      channel.moveToEnd();
      const strip = CStripFx.find(tr) || CStripFx.create(tr);
      strip.moveToSecondLast();
      log("success");
    });

    return { desc: "testing script", flags: 0 };
  });
  // log(inspect(result));
  // copy(encode(result));

  // // map from raw track to track obj
  // const trackMap: LuaTable<MediaTrack, Track> = new LuaTable();
  // function store(obj: MediaTrack, track: Track) {
  //   trackMap.set(obj, track);
  // }
  // function get(obj: MediaTrack): Track {
  //   return trackMap.get(obj);
  // }

  // for (const track of Track.iterAll()) {
  //   store(track.obj, track);
  // }

  // const allSends = [];
  // for (const track of Track.iterAll()) {
  //   const sends = track.getSends();
  //   const parentSend = track.getParentSendInfo();
  //   if (parentSend !== null) {
  //     sends.push(parentSend);
  //   }
  //   allSends.push(sends);
  // }

  // log(inspect(allSends));

  // const userdataMap: Record<any, number> = {};
  // allSends.forEach((sends, i) => {
  //   for (const send of sends) {
  //     if (type(send.src) === "userdata") {
  //       userdataMap[send.src as any] = i + 1;
  //     }
  //   }
  // });
  // allSends.forEach((sends, i) => {
  //   for (const send of sends) {
  //     if (userdataMap[send.src as any] !== undefined) {
  //       send.src = `track ${userdataMap[send.src as any]}` as any;
  //     }
  //     if (userdataMap[send.dst as any] !== undefined) {
  //       send.dst = `track ${userdataMap[send.dst as any]}` as any;
  //     }
  //   }
  // });
  // copy(encode(allSends));
}

main();
