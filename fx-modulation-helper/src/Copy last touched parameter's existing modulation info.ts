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
import { LAST_TOUCHED_FX_PARAM } from "./util";
import { FXParam, getLastTouchedFxParam } from "reaper-api/fx";
import * as toml from "./toml";

function main() {
  const param = LAST_TOUCHED_FX_PARAM;

}

errorHandler(main);
