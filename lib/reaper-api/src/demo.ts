AddCwdToImportPaths();

import { encode } from "json";
import { inspect } from "./inspect";
import { getProjectRoutingInfo, Track } from "./track";
import { copy } from "./clipboard";
import { Item, MidiTake } from "./item";
import * as Chunk from "./chunk";
import * as Element from "./element";
import { deferAsync, errorHandler, log, readFile, writeFile } from "./utils";
import { MenuItem, MenuItemKind, showMenu, showPlainTextMenu } from "./menu";

function measureTime<T>(func: () => T): [number, T] {
  const startTime = os.clock();
  const rv = func();
  const endTime = os.clock();
  return [endTime - startTime, rv];
}

const asd = `# Freeze selected tracks
To mono [40901]
To stereo [41223]
To multichannel [40877]
Unfreeze [41644]
Show details... [41654]
---
# Move to subproject
Selected items [41996]
Selected tracks [41997]
# Subproject...
Select all subproject items [_BR_SEL_ALL_ITEMS_PIP]
Options:
  Defer rendering of subprojects (render on tab switch rather than save) [41998]
  Synchronize any parent projects when playing back subproject [41994]
  Prompt before automatic render of subprojects [42334]
  Leave subprojects open in tab after automatic open and render [42012]
---
# Render tracks to stem tracks (SWS)
To mono, obeying time selection [_SWS_AWRENDERMONOSMART]
To stereo, obeying time selection [_SWS_AWRENDERSTEREOSMART]
More...:
  # Render selected tracks to stems (Post-fader)
  To mono [40537]
  To stereo [40405]
  To multichannel [40892]
  # Limit to selected area
  To mono (limit to selected area) [41718]
  To stereo (limit to selected area) [41716]
  To multichannel (limit to selected area) [41717]
  # Use 2nd pass render
  To mono (2nd pass render) [42415]
  To stereo (2nd pass render) [42413]
  To multichannel (2nd pass render) [42414]
---
# Render selected items (KAWA)
To stereo, obeying time selection [_kawa_MAIN2_Render_SelectedItems_ToNewTrack]`;

function main() {
  // const menu: MenuItem[] = [
  //   { kind: MenuItemKind.Normal, name: "first item, followed by separator" },
  //   { kind: MenuItemKind.Separator },
  //   { kind: MenuItemKind.Normal, name: "!second item, checked", checked: true },
  //   {
  //     kind: MenuItemKind.Submenu,
  //     name: ">third item which spawns a submenu",
  //     children: [
  //       {
  //         kind: MenuItemKind.Muted,
  //         name: "#first item in submenu, grayed out",
  //       },
  //       { kind: MenuItemKind.Normal, name: "<second and last item in submenu" },
  //     ],
  //   },
  //   { kind: MenuItemKind.Normal, name: "fourth item in top menu" },
  // ];
  // const selectedItem = showMenu(menu);
  // log(selectedItem);

  log(os.time());
  const [
    is_new_value,
    filename,
    sectionID,
    cmdID,
    mode,
    resolution,
    val,
    contextstr,
  ] = reaper.get_action_context();
  // log({
  //   // is_new_value,
  //   // filename,
  //   sectionID,
  //   cmdID,
  //   // mode,
  //   // resolution,
  //   // val,
  //   // contextstr,
  // });
  showPlainTextMenu(sectionID, asd.split("\n"));
}

errorHandler(main);

// async function main() {
//   while (true) {
//     await deferAsync();

//     const take = MidiTake.active();
//     log("take", take);
//     if (take === null) continue;

//     const grid = take.grid();
//     log("  grid", grid);
//   }

//   // for (const track of Track.getSelected()) {
//   //   for (const item of track.iterItems()) {
//   //     const element = Element.parse(Chunk.item(item.obj));
//   //     copy(encode(element));
//   //     break;
//   //   }
//   // }

//   // const [elapsed, send] = measureTime(() =>
//   //   track
//   //     .getSends(true)
//   //     .map((x) => ({
//   //       audio: x.audio,
//   //       midi: x.midi,
//   //       src: x.src.getIdx(),
//   //       dst: x.dst.getIdx(),
//   //     })),
//   // );
//   // log("elapsed", elapsed);

//   // writeFile(
//   //   "D:\\Programming\\reaper-scripting-5\\lua_output.json",
//   //   encode(send),
//   // );

//   // const allVolpan = [];
//   // for (const item of track.iterItems()) {
//   //   const children = ArrChunk.fromChunk(Chunk.item(item.obj));
//   //   let volpan: string | null = null;
//   //   for (const child of children) {
//   //     if (typeof child !== "string") continue;
//   //     if (!child.startsWith("VOLPAN")) continue;
//   //     volpan = child;
//   //   }
//   //   if (volpan === null) error("VOLPAN not found in item");

//   //   allVolpan.push(volpan);
//   // }
//   // copy(allVolpan.join("\n"));

//   // const { sends, receives } = getProjectRoutingInfo({midi: true});

//   // const count = Track.count();

//   // log("receive - send:");
//   // for (let i = 0; i < count; i++) {
//   //   const track = Track.getByIdx(i);
//   //   const selected = !sends.has(i) && receives.has(i);
//   //   reaper.SetTrackSelected(track.obj, selected);
//   //   if (selected) log(i.toString(), ", ");
//   // }
//   // log("")

//   // log(inspect(Track.getByIdx(75).getSends(true)))
//   // log("Sends:");
//   // for (const [idx, sendsTo] of sends) {
//   //   log(`${idx}: ${encode(sendsTo)}`);
//   // }
//   // log("");
//   // log("Receives:");
//   // for (const [idx, receivesTo] of receives) {
//   //   log(`${idx}: ${encode(receivesTo)}`);
//   // }
// }

// errorHandler(main);
