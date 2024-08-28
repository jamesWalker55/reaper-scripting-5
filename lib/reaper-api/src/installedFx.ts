import { encode } from "json";
import { parseIni } from "./ini";
import { inspect } from "./inspect";
import { log } from "./utils";
import { copy } from "./clipboard";
import { abspath } from "./path/path";

/**
 * NOTE: Only works on Windows (because the filename contains "win64.ini")
 */
function loadCLAPPlugins() {
  const [ini, msg] = parseIni(abspath("reaper-clap-win64.ini"));
  if (ini === null) {
    if (msg.startsWith("Given path does not exist")) {
      // assume no CLAP plugins are installed, hence INI is missing
      return {};
    }
    error(`reaper's CLAP plugin database is malformed - ${msg}`);
  }

  const result: Record<string, { identifier: string; displayName: string }> =
    {};

  for (const filename in ini) {
    const data = ini[filename];
    for (const key in data) {
      if (key === "_") continue;
      let identifier = key;
      let displayName = data[key];
      // name is prefixed with some weird number, remove it
      const prefixMatch = string.match(displayName, `^%d+|`);
      if (prefixMatch[0]) {
        displayName = displayName.slice(prefixMatch[0].length);
      }
      result[filename] = { identifier, displayName };
    }
  }

  return result;
}

/**
 * Includes VST2 and VST3 plugins.
 * NOTE: Only works on Windows (because the filename contains "64.ini")
 */
function loadVSTPlugins() {
  const [ini, msg] = parseIni(abspath("reaper-vstplugins64.ini"));
  if (ini === null) {
    if (msg.startsWith("Given path does not exist")) {
      // assume no VST plugins are installed, hence INI is missing
      return {};
    }
    error(`reaper's VST plugin database is malformed - ${msg}`);
  }
  if (!("vstcache" in ini)) {
    error(
      `reaper's VST plugin database is malformed - section 'vstcache' is missing`,
    );
  }

  const vstcache = ini["vstcache"];

  const result: Record<string, { displayName: string; isInstrument: boolean }> =
    {};

  for (const filename in vstcache) {
    const data = vstcache[filename];
    const match = string.match(data, `^[^,]+,[^,]+,(.+)$`)[0];
    if (!match) {
      // plugin failed to scan, e.g.:
      // iZRX9GuitarDe_noise.dll=00D83861E546D801
      continue;
    }

    let displayName = match;
    let isInstrument = false;
    if (displayName.endsWith("!!!VSTi")) {
      // e.g.:
      // Legend.vst3=00EC7E81AD71D901,988499895{A4FFC0A749EC4FCF89B8C590564830D3,The Legend (Synapse Audio)!!!VSTi
      displayName = displayName.slice(0, -"!!!VSTi".length);
      isInstrument = true;
    }

    result[filename] = { displayName, isInstrument };
  }

  return result;
}

/**
 * Example of returned data:
 * ```json
 * [{ "displayName": "VST: Wider (airwindows)", "ident": "C:\\Program Files\\Steinberg\\VstPlugins\\Airwindows\\Wider64.dll" },
 *  { "displayName": "VST3i: Skaka (Klevgrand)", "ident": "C:\\Program Files\\Common Files\\VST3\\KLVGR\\Skaka.vst3" },
 *  { "displayName": "CLAPi: Vital (Vital Audio)", "ident": "audio.vital.synth" },
 *  { "displayName": "JS: MIDI Polyphonic Splitter [downloaded/pcartwright MIDI Chord Splitter]", "ident": "downloaded/pcartwright MIDI Chord Splitter" },
 *  { "displayName": "ReWire: REAPER", "ident": "ReWire: REAPER" },
 *  { "displayName": "Container", "ident": "Container" },
 *  { "displayName": "Video processor", "ident": "Video processor" },
 *  ...]
 * ```
 */
function loadInstalledFX() {
  const result = [];
  let i = 0;
  while (true) {
    const [ok, displayName, ident] = reaper.EnumInstalledFX(i);
    if (!ok) return result;

    result.push({ displayName, ident });
    i += 1;
  }
}

export function main() {
  const result = loadInstalledFX();
  copy(encode(result));
  log(inspect(result));
}

function temp() {
  let temp;
  // // list of known CLAP plugins
  // temp = parseIni(abspath("reaper-clap-win64.ini"));
  // CLAP renames
  temp = parseIni(abspath("reaper-clap-rename-win64.ini"));
  // fx favourites folder
  temp = parseIni(abspath("reaper-fxfolders.ini"));
  // (not INI format) list of known JSFX plugins
  temp = abspath("reaper-jsfx.ini");
  // // list of known VST plugins
  // temp = parseIni(abspath("reaper-vstplugins64.ini"));
  // vst renames
  temp = parseIni(abspath("reaper-vstrenames64.ini"));
}
