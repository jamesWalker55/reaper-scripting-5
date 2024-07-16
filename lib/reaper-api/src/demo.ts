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
  const allSends = [];
  for (const track of Track.iterAll()) {
    const sends = track.getSends();
    const parentSend = track.getParentSendInfo();
    if (parentSend !== null) {
      sends.push(parentSend);
    }
    allSends.push(sends);
  }

  log(inspect(allSends));

  const userdataMap: Record<any, number> = {};
  allSends.forEach((sends, i) => {
    for (const send of sends) {
      if (type(send.src) === "userdata") {
        userdataMap[send.src as any] = i + 1;
      }
    }
  });
  allSends.forEach((sends, i) => {
    for (const send of sends) {
      if (userdataMap[send.src as any] !== undefined) {
        send.src = `track ${userdataMap[send.src as any]}` as any;
      }
      if (userdataMap[send.dst as any] !== undefined) {
        send.dst = `track ${userdataMap[send.dst as any]}` as any;
      }
    }
  });
  copy(encode(allSends));
}

main();
