AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { errorHandler } from "reaper-api/utils";
import { generateTomlText, LAST_TOUCHED_FX_PARAM } from "./util";

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  const text = generateTomlText(
    {
      baseline: 0.0,
      plink: {
        offset: 0.0,
        scale: 1.0,
        fxidx: param.getThisRelativeFxidx(),
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
