AddCwdToImportPaths();

import { paste } from "reaper-api/clipboard";
import { checkModulationInfo, ModulationInfo } from "reaper-api/fx";
import { errorHandler, log, msgBox } from "reaper-api/utils";
import * as toml from "./toml";
import { LAST_TOUCHED_FX_PARAM } from "./util";

function pasteModulationInfo():
  | { ok: ModulationInfo | null }
  | { err: string } {
  let rv: unknown;
  try {
    // add some newlines to the end
    // the `toml` module will bug and infinite loop if there is no newline at end
    const text = paste() + "\n\n";

    if (text.trim().toLowerCase() === "null") return { ok: null };

    rv = toml.parse(text);
  } catch (e) {
    return { err: `Failed to parse clipboard as TOML:\n${e}` };
  }

  const check = checkModulationInfo(rv);
  if ("err" in check) {
    return { err: `Clipboard has invalid modulation info:\n${check.err}` };
  }

  return { ok: check.ok };
}

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  const mod = pasteModulationInfo();
  if ("err" in mod) {
    return msgBox("Invalid modulation info", mod.err);
  }

  log(mod.ok);

  param.setModulation(mod.ok);
}

errorHandler(main);
