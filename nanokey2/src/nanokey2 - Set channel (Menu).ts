AddCwdToImportPaths();

import { errorHandler, log } from "reaper-api/utils";
import { loadScene, pushSceneToDevice, saveScene, VelocityCurve } from "./lib";
import { MenuItemKind, showMenu } from "reaper-api/menu";

const CHANNELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

errorHandler(() => {
  const scene = loadScene();

  const choice = showMenu<{ channel: number }>(
    CHANNELS.map((x) => ({
      kind: MenuItemKind.Normal,
      name: `Channel ${x + 1}`,
      checked: x === scene.midiChannel,
      channel: x,
    })),
  );
  if (choice === null) return;

  scene.midiChannel = choice.channel;
  saveScene(scene);
  pushSceneToDevice(scene);
});
