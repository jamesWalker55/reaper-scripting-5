AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { getProjectRoutingInfo, Track } from "./track";
import { copy } from "./clipboard";
import { Item } from "./item";
import * as Chunk from "./chunk";
import * as ArrChunk from "./arrchunk";
import { errorHandler } from "./utils";

function log(msg: string, end?: string) {
  if (msg !== "") {
    reaper.ShowConsoleMsg(msg);
  }
  if (end !== "") {
    reaper.ShowConsoleMsg(end === undefined ? "\n" : end);
  }
}

function main() {
  const track = Track.getSelected()[0];
  const allSource = [];
  for (const item of track.iterItems()) {
    const children = ArrChunk.fromChunk(Chunk.item(item.obj));
    let source: string | null = null;
    for (const child of children) {
      if (typeof child === "string") continue;
      const tag = child[0];
      if (typeof tag !== "string") continue;
      if (tag !== "SOURCE WAVE") continue;
      const file = child[1];
      if (typeof file !== "string") continue;
      if (!file.startsWith("FILE")) continue;
      source = file;
    }
    if (source === null) error("SOURCE not found in item");

    allSource.push(source);
  }
  copy(allSource.join("\n"));

  // const allVolpan = [];
  // for (const item of track.iterItems()) {
  //   const children = ArrChunk.fromChunk(Chunk.item(item.obj));
  //   let volpan: string | null = null;
  //   for (const child of children) {
  //     if (typeof child !== "string") continue;
  //     if (!child.startsWith("VOLPAN")) continue;
  //     volpan = child;
  //   }
  //   if (volpan === null) error("VOLPAN not found in item");

  //   allVolpan.push(volpan);
  // }
  // copy(allVolpan.join("\n"));

  // const { sends, receives } = getProjectRoutingInfo({midi: true});

  // const count = Track.count();

  // log("receive - send:");
  // for (let i = 0; i < count; i++) {
  //   const track = Track.getByIdx(i);
  //   const selected = !sends.has(i) && receives.has(i);
  //   reaper.SetTrackSelected(track.obj, selected);
  //   if (selected) log(i.toString(), ", ");
  // }
  // log("")

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

errorHandler(main);
