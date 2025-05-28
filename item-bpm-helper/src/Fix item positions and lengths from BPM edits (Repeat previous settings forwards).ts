AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { applyNewBpmToSelectedItems, config } from "./common";

errorHandler(() => {
  if (config.sourceBpm === 0)
    throw new Error("Source BPM is not set, please run the GUI first!");
  if (config.targetBpm === 0)
    throw new Error("Target BPM is not set, please run the GUI first!");

  applyNewBpmToSelectedItems(config.sourceBpm, config.targetBpm, false);
});
