AddCwdToImportPaths();

import * as JSON from "json";
import { copy, paste } from "reaper-api/clipboard";
import {
  clearConsole,
  deferAsync,
  errorHandler,
  log,
  msgBox,
} from "reaper-api/utils";
import { generateTomlText, LAST_TOUCHED_FX_PARAM } from "./util";
import { FXParam, getLastTouchedFxParam } from "reaper-api/fx";
import * as toml from "./toml";

// // This should be TOML parsed into a ModulationInfo
// const TOML_TEMPLATE = `
// # Base value, between 0.0 -- 1.0
// baseline = 0.0

// [plink] # Link to MIDI or other FX parameter
// offset = 0.0 # between -1.0 -- 1.0
// scale = 1.0 # between 0.0 -- 1.0

// # {name}
// # {desc}
// #
// # If linked to MIDI, set this to -100
// fxidx = {fxidx}
// param = {param}

// # # Set these if \`fxidx\` is set to -100
// # midi_bus = 0
// # midi_chan = 0
// # # Mod wheel:
// # midi_msg = 176
// # midi_msg2 = 129

// # [lfo]
// # # 0 = Sine
// # # 1 = Square
// # # 2 = Saw L
// # # 3 = Saw R
// # # 4 = Triangle
// # # 5 = Random
// # shape = 0
// # dir = 1  # 1 = positive, 0 = centered, -1 = negative

// # tempoSync = false
// # phase = 0.0 # between 0.0 -- 1.0
// # speed = 1.0 # Hz (maximum 8 Hz)
// # strength = 1.0 # between 0.0 -- 1.0

// # # false = Phase reset on seek/loop (deterministic output)
// # # true = Free-running (non-deterministic output)
// # free = false

// # [acs] # Audio control signal
// # # Channels 1+2
// # chan = 0
// # stereo = true

// # attack = 300 # ms
// # release = 300 # ms

// # minVol = -24 # dB
// # maxVol = 0 # db
// # strength = 1.0 # between 0.0 -- 1.0
// # dir = 1  # 1 = positive, 0 = centered, -1 = negative

// # # the curve point control
// # x2 = 0.5
// # y2 = 0.5
// `.slice(1, -1);

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  const text = generateTomlText(
    {
      baseline: 0.0,
      plink: {
        offset: 0.0,
        scale: 1.0,
        fxidx: param.fxidx,
        param: param.param,
      },
    },
    {
      name: param.getFx().getName(),
      desc: param.getName(),
    },
  );

  copy(text);
}

errorHandler(main);
