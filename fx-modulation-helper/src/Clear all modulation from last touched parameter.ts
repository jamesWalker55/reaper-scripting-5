AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { LAST_TOUCHED_FX_PARAM } from "./util";

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

  param.setModulation(null);
}

errorHandler(main);
