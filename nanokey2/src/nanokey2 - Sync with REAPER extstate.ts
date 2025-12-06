AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { loadScene, pushSceneToDevice, saveScene } from "./lib";

errorHandler(() => {
  const scene = loadScene();
  saveScene(scene);
  pushSceneToDevice(scene);
});
