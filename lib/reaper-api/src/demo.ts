AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { getProjectRoutingInfo, Item, MidiTake, Track } from "./track";
import { copy } from "./clipboard";
import * as Chunk from "./chunk";
import * as Element from "./element";
import {
  clearConsole,
  deferAsync,
  errorHandler,
  log,
  readFile,
  undoBlock,
  writeFile,
} from "./utils";
import * as path from "./path/path";
import { splitlines } from "./utilsLua";
import { RS5K, RS5KMode } from "./rs5k";
import { FX, getLastTouchedFxParam } from "./fx";
import { parseBuf } from "./midibuf";

function measureTime<T>(func: () => T): [number, T] {
  const startTime = os.clock();
  const rv = func();
  const endTime = os.clock();
  return [endTime - startTime, rv];
}

async function main() {
  undoBlock("Randomize value of selected envelope/automation points", 1, () => {
    const env = reaper.GetSelectedEnvelope(0);
    for (
      let autoItemIdx = -1;
      autoItemIdx < reaper.CountAutomationItems(env);
      autoItemIdx++
    ) {
      const pointCount = reaper.CountEnvelopePointsEx(
        env,
        autoItemIdx | 0x10000000,
      );
      for (let i = 0; i < pointCount; i++) {
        const [retval, time, value, shape, tension, selected] =
          reaper.GetEnvelopePointEx(env, autoItemIdx | 0x10000000, i);
        if (!retval)
          throw new Error(
            `Failed to get point ${i} in automation item ${autoItemIdx}`,
          );
        if (!selected) continue;

        const newValue = math.random();
        reaper.SetEnvelopePointEx(
          env,
          autoItemIdx,
          i,
          undefined,
          newValue,
          undefined,
          undefined,
          undefined,
          true,
        );
      }
      reaper.Envelope_SortPointsEx(env, autoItemIdx);
    }
  });

  // reaper.GetSetAutomationItemInfo;

  // const lyrics = [];
  // for (const item of Item.getSelected()) {
  //   const [_, notes] = reaper.GetSetMediaItemInfo_String(
  //     item.obj,
  //     "P_NOTES",
  //     "",
  //     false,
  //   );
  //   const qnStart = reaper.TimeMap2_timeToQN(0, item.position);
  //   const qnEnd = reaper.TimeMap2_timeToQN(0, item.position + item.length);
  //   const trackIdx = item.getTrack().getIdx();

  //   lyrics.push({ notes, qnStart, qnEnd, trackIdx });
  // }
  // lyrics.sort((a, b) => a.qnStart - b.qnStart);

  // for (const x of lyrics) {
  //   log(x);
  // }

  // copy(encode(lyrics))

  // // log("Hello world!")
  // const item = Item.getSelected()[0];
  // if (!item) throw new Error("No selected item");

  // const take = item.activeTake()?.asTypedTake();
  // if (!take) throw new Error("No selected MIDI take");
  // if (take.TYPE !== "MIDI") throw new Error("No selected MIDI take");

  // clearConsole();
  // for (const note of take.iterNotes()) {
  //   const startTime = take.tickToProjectTime(note.startTick);
  //   const endTime = take.tickToProjectTime(note.endTick);

  //   // log(`startTick = ${note.startTick}`);
  //   // log(`endTick = ${note.endTick}`);
  //   // log(`startTime = ${startTime} s`);
  //   // log(`endTime = ${endTime} s`);
  //   log(`pitch = ${note.pitch}`);
  // }
  // log();
  // log(inspect(buf))

  // const rs = new RS5K(new FX({ track: Track.getSelected()[0].obj }, 0));
  // rs.portamento = 342.4;
  // rs.modifyFiles((m) => {
  //   m.deleteAllFiles();
  //   const path1 =
  //     "d:\\Audio Samples\\Packs\\MusicRadar - Guitar Bass Samples\\Guitar Loops\\Gentle Riffs\\Sharp_Strummin.wav";
  //   m.addFile(5, path1);
  //   const path2 =
  //     "d:\\Audio Samples\\Packs\\MusicRadar - Guitar Bass Samples\\Guitar Loops\\Gentle Riffs\\Real_Nice_Strum_A.wav";
  //   m.addFile(5, path2);
  // });

  // while (true) {
  //   for (let i = -80; i <= 80; i++) {
  //     await deferAsync();

  //     for (const track of Track.getSelected()) {
  //       log(`id: ${track.getIdx()}`);

  //       const rs = new RS5K(new FX({ track: track.obj }, 0));
  //       if (!rs.isValid())
  //         log(`Invalid RS5K instance: Track ${track.getIdx()}, FX ${0}`);

  //       // log(rs.pitchOffset);
  //       log(rs.temp());

  //       // rs.pitchStart = i;
  //       // assert(rs.pitchStart === i)

  //       // for (const param of track.getFx(0).getParameters()) {
  //       //   log(`param ${param.param}:`)
  //       //   log(inspect(param.getIdent()));
  //       //   log(inspect(param.getName()));
  //       //   log(inspect(param.getValue()));
  //       //   log();
  //       // }
  //     }
  //   }
  //   log();
  // }

  // while (true) {
  //   await deferAsync();

  //   const take = MidiTake.active();
  //   log("take", take);
  //   if (take === null) continue;

  //   const grid = take.grid();
  //   log("  grid", grid);
  // }

  // splitlines("apple")
  // log(path.abspath("Hello, world.txt"));
  // log(`path.join("/", "apple", "foo", "a/")`);
  // log(path.join("/", "apple", "foo", "a/"));
  // for (const track of Track.getSelected()) {
  //   for (const item of track.iterItems()) {
  //     const element = Element.parse(Chunk.item(item.obj));
  //     copy(encode(element));
  //     break;
  //   }
  // }

  // const [elapsed, send] = measureTime(() =>
  //   track
  //     .getSends(true)
  //     .map((x) => ({
  //       audio: x.audio,
  //       midi: x.midi,
  //       src: x.src.getIdx(),
  //       dst: x.dst.getIdx(),
  //     })),
  // );
  // log("elapsed", elapsed);

  // writeFile(
  //   "D:\\Programming\\reaper-scripting-5\\lua_output.json",
  //   encode(send),
  // );

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
