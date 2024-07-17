AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "reaper-api/inspect";
import { Track } from "reaper-api/track";
import { copy } from "reaper-api/clipboard";
import { FXParam, TrackFX, AddFxParams } from "reaper-api/fx";

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

class CStripFx {
  FX_IDENT = "utility/volume_pan_sample_accurate_auto";
  FX_NAME = "#CSTRIP [AIRWINDOWS CONSOLE]";
  FX_ADD: AddFxParams = { js: this.FX_IDENT };

  fx: TrackFX;
  gainParam: FXParam;
  panParam: FXParam;

  private constructor(fx: TrackFX) {
    this.fx = fx;
    // values are in dB
    this.gainParam = this.fx.getParameter(0);
    // ranges from -100.0 .. 100.0
    this.panParam = this.fx.getParameter(1);

    this.validate();
  }

  validate() {
    const fxName = this.fx.getName();
    const fxIdent = this.fx.getIdent();
    assert(fxName === this.FX_NAME);
    assert(fxIdent === this.FX_IDENT);
  }

  create(track: Track) {
    const count = track.getFxCount();
    const newPos = track.addFx(this.FX_ADD, count);
    if (newPos === null) error("failed to create gain plugin");

    const fx = track.getFx(newPos);
    return new CStripFx(fx);
  }

  findAll(track: Track): CStripFx[] {
    const result = [];
    for (const fx of track.getAllFx().reverse()) {
      if (fx.getIdent() === this.FX_IDENT && fx.getName() === this.FX_NAME) {
        result.push(new CStripFx(fx));
      }
    }
    return result;
  }

  /**
   * This FX is expected to map 2 channels of input to the same output channels.
   * Return the 2 channels if this is indeed the case. Otherwise, return null.
   */
  getMappedChannels() {
    // get the pin mapping bitmasks
    const tr = this.fx.track;
    const idx = this.fx.fxidx;
    const [in1a, in1b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 0);
    const [in1c, in1d] = reaper.TrackFX_GetPinMappings(
      tr,
      idx,
      0,
      0 + 0x1000000,
    );
    const [in2a, in2b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 1);
    const [in2c, in2d] = reaper.TrackFX_GetPinMappings(
      tr,
      idx,
      0,
      1 + 0x1000000,
    );
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

    return [pin1channel, pin2channel];
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

  /** @param gain Pan amount in range (-100 .. 100) */
  setPan(pan: number) {
    const rv = this.panParam.setValue(pan);
    assert(rv, "failed to set pan");
  }
}

class ChannelFx {
  static FX_IDENT = "com.airwindows.consolidated";
  static FX_NAME = "#CHANNEL [AIRWINDOWS CONSOLE]";
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

  create(track: Track) {
    const newPos = track.addFx(ChannelFx.FX_ADD);
    if (newPos === null) error("failed to create channel plugin");

    const fx = track.getFx(newPos);
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

    return ChannelFx.fromFx(fx);
  }

  find(track: Track): ChannelFx | null {
    for (const fx of track.getAllFx().reverse()) {
      const channel = ChannelFx.fromFx(fx);
      if (channel !== null) return channel;
    }
    return null;
  }

  // /**
  //  * This FX is expected to map 2 channels of input to the same output channels.
  //  * Return the 2 channels if this is indeed the case. Otherwise, return null.
  //  */
  // getMappedChannels() {
  //   // get the pin mapping bitmasks
  //   const tr = this.fx.track;
  //   const idx = this.fx.fxidx;
  //   const [in1a, in1b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 0);
  //   const [in1c, in1d] = reaper.TrackFX_GetPinMappings(
  //     tr,
  //     idx,
  //     0,
  //     0 + 0x1000000,
  //   );
  //   const [in2a, in2b] = reaper.TrackFX_GetPinMappings(tr, idx, 0, 1);
  //   const [in2c, in2d] = reaper.TrackFX_GetPinMappings(
  //     tr,
  //     idx,
  //     0,
  //     1 + 0x1000000,
  //   );
  //   const [out1a, out1b] = reaper.TrackFX_GetPinMappings(tr, idx, 1, 0);
  //   const [out1c, out1d] = reaper.TrackFX_GetPinMappings(
  //     tr,
  //     idx,
  //     1,
  //     0 + 0x1000000,
  //   );
  //   const [out2a, out2b] = reaper.TrackFX_GetPinMappings(tr, idx, 1, 1);
  //   const [out2c, out2d] = reaper.TrackFX_GetPinMappings(
  //     tr,
  //     idx,
  //     1,
  //     1 + 0x1000000,
  //   );

  //   // ensure pin inputs/outputs are the same
  //   {
  //     const inOut1IsTheSame =
  //       in1a === out1a && in1b === out1b && in1c === out1c && in1d === out1d;
  //     const inOut2IsTheSame =
  //       in2a === out2a && in2b === out2b && in2c === out2c && in2d === out2d;
  //     if (!inOut1IsTheSame || !inOut2IsTheSame) {
  //       return null;
  //     }
  //   }

  //   // find the SINGLE pinned channel, otherwise return null
  //   const pin1 = [in1a, in1b, in1c, in1d];
  //   const pin2 = [in2a, in2b, in2c, in2d];
  //   let pin1channel: number | null = null;
  //   let pin2channel: number | null = null;
  //   for (let i = 0; i < 4; i++) {
  //     for (let j = 0; j < 32; j++) {
  //       const channelIdx = j + 32 * i;
  //       const pin1isSet = (pin1[i] & (1 << j)) !== 0;
  //       if (pin1isSet) {
  //         if (pin1channel === null) {
  //           pin1channel = channelIdx;
  //         } else {
  //           // more than 1 pin is set
  //           return null;
  //         }
  //       }
  //       const pin2isSet = (pin2[i] & (1 << j)) !== 0;
  //       if (pin2isSet) {
  //         if (pin2channel === null) {
  //           pin2channel = channelIdx;
  //         } else {
  //           // more than 1 pin is set
  //           return null;
  //         }
  //       }
  //     }
  //   }
  //   if (pin1channel === null) return null;
  //   if (pin2channel === null) return null;

  //   // input/output channels should be different
  //   if (pin1channel === pin2channel) return null;

  //   // input/output channels should be sequential
  //   if (!(pin1channel + 1 === pin2channel)) return null;

  //   return [pin1channel, pin2channel];
  // }

  // /** Gain amount in dB */
  // gain() {
  //   return this.volParam.getValue().cur;
  // }

  // /** @param gain Gain amount in dB */
  // setGain(gain: number) {
  //   const rv = this.volParam.setValue(gain);
  //   assert(rv, "failed to set gain");
  // }

  // /** Pan amount in range (-100 .. 100) */
  // pan() {
  //   return this.panParam.getValue().cur;
  // }

  // /** @param gain Pan amount in range (-100 .. 100) */
  // setPan(pan: number) {
  //   const rv = this.panParam.setValue(pan);
  //   assert(rv, "failed to set pan");
  // }
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
  const result = Track.getSelected()[0]
    .getAllFx()
    .map((x) => ({
      ident: x.getIdent(),
      name: x.getName(),
      mapping: reaper.TrackFX_GetPreset(x.track, x.fxidx),
      params: x.getParameters().map((p) => ({
        getValue: p.getValue(),
        getIdent: p.getIdent(),
        getName: p.getName(),
      })),
    }));
  log(inspect(result));
  copy(encode(result));
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
