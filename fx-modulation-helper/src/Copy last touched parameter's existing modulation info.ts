AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { errorHandler } from "reaper-api/utils";
import { generateTomlText, LAST_TOUCHED_FX_PARAM } from "./util";

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  const mod = param.getModulation();
  if (mod === null) {
    copy("null");
    return;
  }

  const text = generateTomlText(mod, {
    name: param.getFx().getName(),
    desc: param.getName(),
  });

  copy(text);
}

errorHandler(main);
