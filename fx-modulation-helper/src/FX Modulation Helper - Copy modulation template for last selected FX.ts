AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { ModulationInfo } from "reaper-api/fx";
import { errorHandler, log } from "reaper-api/utils";
import { LAST_TOUCHED_FX, lookupParamIdentifier } from "./util";

const TOML_TEMPLATE_HELP = `# Find the param with identifier "9:416"
[9:416]
  # baseline = 0.0  # 0.0 -- 1.0
  # offset = 0.0  # -1.0 -- 1.0
  # scale = 1.0  # 0.0 -- 1.0
  fxidx = 0  # The first FX
  param = "9:416"  # The parameter with identifier "9:416"`;

function generateParamTemplate(
  fxidx: number,
  param: number,
  mod: ModulationInfo | null,
): string {
  const parts: string[] = [];

  const id = lookupParamIdentifier(fxidx, param);
  if (id.preferIdent) {
    parts.push(`[${id.ident}]  # ${id.name}`);
  } else {
    parts.push(`[${id.name}]`);
  }

  if (mod && mod.baseline > 0) {
    parts.push(`  baseline = ${mod.baseline}`);
  } else {
    parts.push(`  # baseline = 0.0`);
  }

  if (mod && mod.plink && mod.plink.offset > 0.0 && mod.plink.scale !== 1.0) {
    parts.push(`  offset = ${mod.plink.offset}`);
    parts.push(`  scale = ${mod.plink.scale}`);
  } else {
    parts.push(`  # offset = 0.0`);
    parts.push(`  # scale = 1.0`);
  }

  if (mod && mod.plink && mod.plink.fxidx >= 0) {
    const targetId = lookupParamIdentifier(mod.plink.fxidx, mod.plink.param);

    parts.push(`  fxidx = ${mod.plink.fxidx}`);
    if (targetId.preferIdent) {
      parts.push(`  param = "${targetId.ident}"  # ${targetId.name}`);
    } else {
      parts.push(`  param = "${targetId.name}"`);
    }
  } else {
    parts.push(`  # fxidx = 0`);
    parts.push(`  # param = "${id.preferIdent ? id.ident : id.name}"`);
  }

  return parts.join("\n");
}

function main() {
  const parts: string[] = [];

  for (const param of LAST_TOUCHED_FX.getParameters()) {
    parts.push(
      generateParamTemplate(param.fxidx, param.param, param.getModulation()),
    );
  }

  copy(parts.join("\n\n"));

  log(TOML_TEMPLATE_HELP);
}

errorHandler(main);
