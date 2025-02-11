import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { FX, getLastTouchedFx } from "reaper-api/fx";
import { errorHandler, log, msgBox } from "reaper-api/utils";

function main() {
  const fx = getLastTouchedFx();
  if (!fx) {
    msgBox("No FX selected", "Failed to get last touched FX");
    return;
  }

  fx.getParameters().forEach((param, i) => {
    log(i, param.getIdent());
    const mod = param.getModulation();
    // fx.getParameters;
  });

  // fx.getParameters().map(param => {param.})

  // log("Hello, world!");

  // const os = reaper.GetOS();
  // log(`Your OS is: ${os}`);
  // if (os === OSType.Win64) {
  //   log(`You are using Windows 64-bit!`);
  // } else {
  //   log(`You are using an unknown OS`);
  // }

  // const hwnd = reaper.GetMainHwnd();
  // log(`Main HWND is: ${hwnd}`);

  // const info = reaper.get_action_context();
  // log(`reaper.get_action_context() = ${encode(info)}`);
}

errorHandler(main);
