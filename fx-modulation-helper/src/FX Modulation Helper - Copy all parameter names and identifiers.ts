AddCwdToImportPaths();

import * as JSON from "json";
import { copy } from "reaper-api/clipboard";
import { errorHandler } from "reaper-api/utils";
import { LAST_TOUCHED_FX } from "./util";

function main() {
  copy(
    JSON.encode(
      LAST_TOUCHED_FX.getParameters().map((x) => [x.getName(), x.getIdent()]),
    ),
  );
}

errorHandler(main);
