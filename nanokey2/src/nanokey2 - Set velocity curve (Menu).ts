AddCwdToImportPaths();

import { errorHandler } from "reaper-api/utils";
import { loadScene, pushSceneToDevice, saveScene, VelocityCurve } from "./lib";
import { MenuItemKind, showMenu } from "reaper-api/menu";

errorHandler(() => {
  const scene = loadScene();

  const choice = showMenu<{ curve: VelocityCurve }>([
    {
      kind: MenuItemKind.Normal,
      name: "Light",
      checked: scene.velocityCurve === VelocityCurve.Light,
      curve: VelocityCurve.Light,
    },
    {
      kind: MenuItemKind.Normal,
      name: "Normal",
      checked: scene.velocityCurve === VelocityCurve.Normal,
      curve: VelocityCurve.Normal,
    },
    {
      kind: MenuItemKind.Normal,
      name: "Heavy",
      checked: scene.velocityCurve === VelocityCurve.Heavy,
      curve: VelocityCurve.Heavy,
    },
    {
      kind: MenuItemKind.Normal,
      name: "Const",
      checked: scene.velocityCurve === VelocityCurve.Const,
      curve: VelocityCurve.Const,
    },
  ]);
  if (choice === null) return;

  scene.velocityCurve = choice.curve;
  saveScene(scene);
  pushSceneToDevice(scene);
});
