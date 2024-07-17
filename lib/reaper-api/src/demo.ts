AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { Track } from "./track";
import { copy } from "./clipboard";

function log(msg: string) {
  reaper.ShowConsoleMsg(msg);
  reaper.ShowConsoleMsg("\n");
}

function main() {
  log("Hello world!");
}

main();
