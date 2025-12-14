AddCwdToImportPaths();

import { copy, paste } from "reaper-api/clipboard";
import {
  getLastTouchedFxParam,
  isModulationInfo,
  ModulationInfo,
} from "reaper-api/fx";
import { errorHandler, log, msgBox } from "reaper-api/utils";
import { LAST_TOUCHED_FX_PARAM } from "./util";
import * as toml from "./toml";

// function generateParamTemplate(
//   fxidx: number,
//   param: number,
//   mod: ModulationInfo | null,
// ): string {
//   const parts: string[] = [];

//   const id = lookupParamIdentifier(fxidx, param);
//   if (id.preferIdent) {
//     parts.push(`[${id.ident}]  # ${id.name}`);
//   } else {
//     parts.push(`[${id.name}]`);
//   }

//   if (mod && mod.baseline > 0) {
//     parts.push(`  baseline = ${mod.baseline}`);
//   } else {
//     parts.push(`  # baseline = 0.0`);
//   }

//   if (mod && mod.plink && mod.plink.offset > 0.0 && mod.plink.scale !== 1.0) {
//     parts.push(`  offset = ${mod.plink.offset}`);
//     parts.push(`  scale = ${mod.plink.scale}`);
//   } else {
//     parts.push(`  # offset = 0.0`);
//     parts.push(`  # scale = 1.0`);
//   }

//   if (mod && mod.plink && mod.plink.fxidx >= 0) {
//     const targetId = lookupParamIdentifier(mod.plink.fxidx, mod.plink.param);

//     parts.push(`  fxidx = ${mod.plink.fxidx}`);
//     if (targetId.preferIdent) {
//       parts.push(`  param = "${targetId.ident}"  # ${targetId.name}`);
//     } else {
//       parts.push(`  param = "${targetId.name}"`);
//     }
//   } else {
//     parts.push(`  # fxidx = 0`);
//     parts.push(`  # param = "${id.preferIdent ? id.ident : id.name}"`);
//   }

//   return parts.join("\n");
// }

// type ModInfo = {};

function pasteModulationInfo(): ModulationInfo | null {
  let rv: unknown;
  try {
    // add some newlines to the end
    // the `toml` module will bug and infinite loop if there is no newline at end
    const text = paste() + "\n\n";
    rv = toml.parse(text);
  } catch (e) {
    msgBox(
      "Invalid modulation info",
      `Clipboard does not contain valid modulation info:\n${e}`,
    );
    return null;
  }

  // if (!isModulationInfo(rv)) {
  //   msgBox(
  //     "Invalid modulation info",
  //     `Clipboard does not contain valid modulation info:\nMissing/Invalid property for modulation info`,
  //   );
  //   return null;
  // }

  return rv as any;
}

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  log("prev");
  log(param.getModulation());

  const x = pasteModulationInfo();

  param.setModulation(x);

}

errorHandler(main);
