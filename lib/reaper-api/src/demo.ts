AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { getProjectRoutingInfo, Track } from "./track";
import { copy } from "./clipboard";

function log(msg: string) {
  if (msg !== '') {
    reaper.ShowConsoleMsg(msg);
  }
  reaper.ShowConsoleMsg("\n");
}

function main() {
  const { sends, receives } = getProjectRoutingInfo();
  log("Sends:");
  for (const [idx, sendsTo] of sends) {
    log(`${idx}: ${encode(sendsTo)}`);
  }
  log("");
  log("Receives:");
  for (const [idx, receivesTo] of receives) {
    log(`${idx}: ${encode(receivesTo)}`);
  }
}

main();
