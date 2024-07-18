AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { getProjectRoutingInfo, Track } from "./track";
import { copy } from "./clipboard";

function log(msg: string, end?: string) {
  if (msg !== "") {
    reaper.ShowConsoleMsg(msg);
  }
  if (end !== "") {
    reaper.ShowConsoleMsg(end === undefined ? "\n" : end);
  }
}

function main() {
  const { sends, receives } = getProjectRoutingInfo({midi: true});

  const count = Track.count();

  log("receive - send:");
  for (let i = 0; i < count; i++) {
    const track = Track.getByIdx(i);
    const selected = !sends.has(i) && receives.has(i);
    reaper.SetTrackSelected(track.obj, selected);
    if (selected) log(i.toString(), ", ");
  }
  log("")

  // log(inspect(Track.getByIdx(75).getSends(true)))
  // log("Sends:");
  // for (const [idx, sendsTo] of sends) {
  //   log(`${idx}: ${encode(sendsTo)}`);
  // }
  // log("");
  // log("Receives:");
  // for (const [idx, receivesTo] of receives) {
  //   log(`${idx}: ${encode(receivesTo)}`);
  // }
}

main();
