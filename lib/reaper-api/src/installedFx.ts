import { parseIni } from "./ini";
import { inspect } from "./inspect";
import { absPath, log } from "./utils";

/**
 * NOTE: Only works on Windows (because the filename contains "win64.ini")
 */
function loadCLAPPlugins() {
  const [ini, msg] = parseIni(absPath("reaper-clap-win64.ini"));
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
    let identifier: string | null = null;
    let displayName: string | null = null;
    for (const key in data) {
      if (key === "_") continue;
      identifier = key;
      displayName = data[key];
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

export function main() {
  log(inspect(loadCLAPPlugins()));
}

function temp() {
  let temp;
  // list of known CLAP plugins
  temp = parseIni(absPath("reaper-clap-win64.ini"));
  // CLAP renames
  temp = parseIni(absPath("reaper-clap-rename-win64.ini"));
  // fx favourites folder
  temp = parseIni(absPath("reaper-fxfolders.ini"));
  // (not INI format) list of known JSFX plugins
  temp = absPath("reaper-jsfx.ini");
  // list of known VST plugins
  temp = parseIni(absPath("reaper-vstplugins64.ini"));
  // vst renames
  temp = parseIni(absPath("reaper-vstrenames64.ini"));
}
