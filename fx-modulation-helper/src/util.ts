import { getLastTouchedFxParam, ModulationInfo } from "reaper-api/fx";
import { msgBox } from "reaper-api/utils";

export const LAST_TOUCHED_FX_PARAM = (() => {
  const fx = getLastTouchedFxParam();
  if (!fx) {
    msgBox(
      "No last touched FX",
      "No last touched FX. Please adjust a FX parameter before running this script",
    );
    throw new Error("Failed to get last touched FX param");
  }
  return fx;
})();

export function generateTomlText(
  x: ModulationInfo,
  paramInfo?: { name: string; desc: string },
): string {
  const lines: string[] = [];

  lines.push("# Base value, between 0.0 -- 1.0");
  lines.push(`baseline = ${x.baseline}`);
  lines.push("");
  lines.push("");

  if ("plink" in x && x.plink) {
    lines.push("[plink] # Link to MIDI or other FX parameter");
    lines.push(`offset = ${x.plink.offset} # between -1.0 -- 1.0`);
    lines.push(`scale = ${x.plink.scale} # between 0.0 -- 1.0`);
    lines.push("");
    if (paramInfo) {
      lines.push(`# ${paramInfo.name}`);
      lines.push(`# ${paramInfo.desc}`);
      lines.push(`#`);
    }
    lines.push("# If linked to MIDI, set `fxidx` to -100");
    lines.push(`fxidx = ${x.plink.fxidx}`);
    lines.push(
      "param" in x.plink ? `param = ${x.plink.param || 0}` : `# param = 0`,
    );
    lines.push("");
    if ("midi_bus" in x.plink) {
      lines.push("# Set these if `fxidx` is set to -100");
      lines.push(`midi_bus = ${x.plink.midi_bus}`);
      lines.push(`midi_chan = ${x.plink.midi_chan}`);
      lines.push(`midi_msg = ${x.plink.midi_msg}`);
      lines.push(`midi_msg2 = ${x.plink.midi_msg2}`);
    } else {
      lines.push("# # Set these if `fxidx` is set to -100");
      lines.push("# midi_bus = 0");
      lines.push("# midi_chan = 0");
      lines.push("# midi_msg = 176  # Mod wheel");
      lines.push("# midi_msg2 = 129");
    }
  } else {
    lines.push("# [plink] # Link to MIDI or other FX parameter");
    lines.push("# offset = 0.0 # between -1.0 -- 1.0");
    lines.push("# scale = 1.0 # between 0.0 -- 1.0");
    lines.push("#");
    lines.push("# # If linked to MIDI, set `fxidx` to -100");
    lines.push("# fxidx = 0");
    lines.push("# param = 0");
    lines.push("#");
    lines.push("# # Set these if `fxidx` is set to -100");
    lines.push("# midi_bus = 0");
    lines.push("# midi_chan = 0");
    lines.push("# midi_msg = 176  # Mod wheel");
    lines.push("# midi_msg2 = 129");
  }

  lines.push("");
  lines.push("");

  if ("lfo" in x && x.lfo) {
    lines.push("[lfo]");
    lines.push("# 0 = Sine");
    lines.push("# 1 = Square");
    lines.push("# 2 = Saw L");
    lines.push("# 3 = Saw R");
    lines.push("# 4 = Triangle");
    lines.push("# 5 = Random");
    lines.push(`shape = ${x.lfo.shape}`);
    lines.push(
      `dir = ${x.lfo.dir}  # 1 = positive, 0 = centered, -1 = negative`,
    );
    lines.push("");
    lines.push(`tempoSync = ${x.lfo.tempoSync}`);
    lines.push(`phase = ${x.lfo.phase} # between 0.0 -- 1.0`);
    lines.push(`speed = ${x.lfo.speed} # Hz (maximum 8 Hz)`);
    lines.push(`strength = ${x.lfo.strength} # between 0.0 -- 1.0`);
    lines.push("");
    lines.push("# false = Phase reset on seek/loop (deterministic output)");
    lines.push("# true = Free-running (non-deterministic output)");
    lines.push(`free = ${x.lfo.free}`);
  } else {
    lines.push("# [lfo]");
    lines.push("# # 0 = Sine");
    lines.push("# # 1 = Square");
    lines.push("# # 2 = Saw L");
    lines.push("# # 3 = Saw R");
    lines.push("# # 4 = Triangle");
    lines.push("# # 5 = Random");
    lines.push("# shape = 0");
    lines.push("# dir = 1  # 1 = positive, 0 = centered, -1 = negative");
    lines.push("#");
    lines.push("# tempoSync = false");
    lines.push("# phase = 0.0 # between 0.0 -- 1.0");
    lines.push("# speed = 1.0 # Hz (maximum 8 Hz)");
    lines.push("# strength = 1.0 # between 0.0 -- 1.0");
    lines.push("#");
    lines.push("# # false = Phase reset on seek/loop (deterministic output)");
    lines.push("# # true = Free-running (non-deterministic output)");
    lines.push("# free = false");
  }

  lines.push("");
  lines.push("");

  if ("acs" in x && x.acs) {
    lines.push(`[acs] # Audio control signal`);
    lines.push(`chan = ${x.acs.chan}`);
    lines.push(`stereo = ${x.acs.stereo}`);
    lines.push("");
    lines.push(`attack = ${x.acs.attack} # ms`);
    lines.push(`release = ${x.acs.release} # ms`);
    lines.push("");
    lines.push(`minVol = ${x.acs.minVol} # dB`);
    lines.push(`maxVol = ${x.acs.maxVol} # db`);
    lines.push(`strength = ${x.acs.strength} # between 0.0 -- 1.0`);
    lines.push(
      `dir = ${x.acs.dir}  # 1 = positive, 0 = centered, -1 = negative`,
    );
    lines.push("");
    lines.push(`# the curve point control`);
    lines.push(`x2 = ${x.acs.x2}`);
    lines.push(`y2 = ${x.acs.y2}`);
  } else {
    lines.push(`# [acs] # Audio control signal`);
    lines.push(`# # Channels 1+2`);
    lines.push(`# chan = 0`);
    lines.push(`# stereo = true`);
    lines.push("#");
    lines.push(`# attack = 300 # ms`);
    lines.push(`# release = 300 # ms`);
    lines.push("#");
    lines.push(`# minVol = -24 # dB`);
    lines.push(`# maxVol = 0 # db`);
    lines.push(`# strength = 1.0 # between 0.0 -- 1.0`);
    lines.push(`# dir = 1  # 1 = positive, 0 = centered, -1 = negative`);
    lines.push("#");
    lines.push(`# # the curve point control`);
    lines.push(`# x2 = 0.5`);
    lines.push(`# y2 = 0.5`);
  }

  return lines.join("\n");
}
