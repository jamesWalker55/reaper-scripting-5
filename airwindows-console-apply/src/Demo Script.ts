AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "reaper-api/inspect";
import { Track } from "reaper-api/track";
import { copy } from "reaper-api/clipboard";
import { FXParam, TrackFX, AddFxParams } from "reaper-api/fx";

class CStripFx {
  FX_IDENT = "utility/volume_pan_sample_accurate_auto";
  FX_NAME = "#CSTRIP [AIRWINDOWS CONSOLE]";
  FX_ADD: AddFxParams = { js: this.FX_IDENT };

  fx: TrackFX;
  volParam: FXParam;
  panParam: FXParam;

  private constructor(fx: TrackFX) {
    this.fx = fx;
    // values are in dB
    this.volParam = this.fx.getParameter(0);
    // ranges from -100.0 .. 100.0
    this.panParam = this.fx.getParameter(1);

    this.validate();
  }

  private create(track: Track) {
    const count = track.getFxCount();
    const newPos = track.addFx(this.FX_ADD, count);
    if (newPos === null) error("failed to create gain plugin");

    const fx = track.getFx(newPos);
    return new CStripFx(fx);
  }

  getOrCreate(track: Track): CStripFx {
    for (const fx of track.getAllFx().reverse()) {
      if (fx.getIdent() === this.FX_IDENT && fx.getName() === this.FX_NAME) {
        return new CStripFx(fx);
      }
    }
    return this.create(track);
  }

  validate() {
    const fxName = this.fx.getName();
    const fxIdent = this.fx.getIdent();
    assert(fxName === this.FX_NAME);
    assert(fxIdent === this.FX_IDENT);
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
    return this.volParam.getValue().cur;
  }

  /** @param gain Gain amount in dB */
  setGain(gain: number) {
    const rv = this.volParam.setValue(gain);
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

class ConsoleTrack {
  track: Track;

  constructor(track: Track) {
    this.track = track;
  }

  setup() {
    for (const fx of this.track.getAllFx()) {
      // // ensure fx is at end of chain
      // const fxcount = track.getFxCount();
      // if (fx.fxidx !== fxcount - 1) {
      //   reaper.TrackFX_CopyToTrack(
      //     track.obj,
      //     fx.fxidx,
      //     track.obj,
      //     fxcount - 1,
      //     true,
      //   );
      // }
    }
    reaper.TrackFX_SetNamedConfigParm;
    // this.track.addFx({js: 'utility/volume'});
  }
}

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  log(
    inspect(
      Track.getSelected()[0]
        .getAllFx()
        .map((x) => ({
          ident: x.getIdent(),
          name: x.getName(),
          mapping: (() => {
            const tr = x.track;
            const idx = x.fxidx;
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
                in1a === out1a &&
                in1b === out1b &&
                in1c === out1c &&
                in1d === out1d;
              const inOut2IsTheSame =
                in2a === out2a &&
                in2b === out2b &&
                in2c === out2c &&
                in2d === out2d;
              if (!inOut1IsTheSame || !inOut2IsTheSame) {
                error(`input and output differs`);
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
                    error(`more than 1 pin is set for pin1`);
                  }
                }
                const pin2isSet = (pin2[i] & (1 << j)) !== 0;
                if (pin2isSet) {
                  if (pin2channel === null) {
                    pin2channel = channelIdx;
                  } else {
                    // more than 1 pin is set
                    error(`more than 1 pin is set for pin2`);
                  }
                }
              }
            }
            if (pin1channel === null) error("failed to find set pin for pin1");
            if (pin2channel === null) error("failed to find set pin for pin2");

            // input/output channels should be different
            if (pin1channel === pin2channel)
              error("pin channels are different");

            // input/output channels should be sequential
            if (!(pin1channel + 1 === pin2channel))
              error("pin channels are not sequential");

            return [pin1channel, pin2channel];
          })(),
          params: x.getParameters().map((p) => ({
            getValue: p.getValue(),
            getIdent: p.getIdent(),
            getName: p.getName(),
          })),
        })),
    ),
  );
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
