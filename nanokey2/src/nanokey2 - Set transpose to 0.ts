AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { loadScene, pushSceneToDevice, saveScene } from "./lib";

errorHandler(() => {
  const scene = loadScene();
  scene.transpose = 64 + 0;
  saveScene(scene);
  pushSceneToDevice(scene);
});
