AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  log("Hello, world!");

  const os = reaper.GetOS();
  log(`Your OS is: ${os}`);
  if (os === OSType.Win64) {
    log(`You are using Windows 64-bit!`);
  } else {
    log(`You are using an unknown OS`);
  }

  const hwnd = reaper.GetMainHwnd();
  log(`Main HWND is: ${hwnd}`);

  const info = reaper.get_action_context();
  log(`reaper.get_action_context() = ${encode(info)}`);
}

main();
