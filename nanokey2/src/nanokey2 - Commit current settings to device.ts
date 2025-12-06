AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { commitDeviceScene } from "./lib";

errorHandler(() => {
  commitDeviceScene();
});
