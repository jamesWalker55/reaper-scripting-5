AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { Item, Track } from "reaper-api/track";
import {
  errorHandler,
  getActionContext,
  getScriptPath,
  log,
  msgBox,
  undoBlock,
} from "reaper-api/utils";
import * as path from "reaper-api/path/path";

const SCRIPT_NAME = getScriptPath().stem;

function getItemSourcePath(item: Item) {
  const take = item.activeTake();
  if (take === null)
    throw new Error("selected item does not contain any takes");
  if (take.isMidi()) throw new Error("selected item is a MIDI item");

  // get the parent source of this take
  let source = take.getSource();
  while (true) {
    const parent = source.getParent();
    if (parent === null) break;

    source = parent;
  }

  const sourcePath = source.getFilename();
  return sourcePath;
}

function removeMSSTSuffixOnce(name: string): [boolean, string] {
  let anythingRemoved = false;

  if (name.endsWith("_noreverb")) {
    name = name.slice(0, -"_noreverb".length);
    anythingRemoved = true;
  }
  if (name.endsWith("_reverb")) {
    name = name.slice(0, -"_reverb".length);
    anythingRemoved = true;
  }
  if (name.endsWith("_vocals")) {
    name = name.slice(0, -"_vocals".length);
    anythingRemoved = true;
  }
  if (name.endsWith("_inst")) {
    name = name.slice(0, -"_inst".length);
    anythingRemoved = true;
  }

  return [anythingRemoved, name];
}

function removeMSSTSuffix(name: string): string {
  while (true) {
    const rv = removeMSSTSuffixOnce(name);
    const anythingRemoved = rv[0];
    name = rv[1];

    if (!anythingRemoved) return name;
  }
}

function main() {
  const items = Item.getSelected();
  if (items.length === 0) {
    msgBox("Error", "No items selected!");
    return;
  }

  // assert all the items are on the same track
  {
    const itemTrackIndexes = new Set(items.map((x) => x.getTrack().getIdx()));
    if (itemTrackIndexes.size > 1) {
      log("This script only works when all items are on the same track.");
      log("Selected items are spread across multiple tracks, aborting...");
      throw new Error("multiple tracks detected for selected items");
    }
  }

  // sort items by position
  items.sort((a, b) => a.position - b.position);

  // group items by their source
  const regionPoints1: { source: string; pos: number }[] = [];
  {
    // intentional empty string
    //
    // since item source paths are non-empty, this will cause the first loop to always create a new region
    let prevSource = "";

    // append region start points
    for (const item of items) {
      const currentSource = getItemSourcePath(item);
      if (prevSource !== currentSource) {
        // this item has a new source, different from the previous item.
        // start a new region
        regionPoints1.push({ source: currentSource, pos: item.position });
      }

      prevSource = currentSource;
    }

    // append region ending point
    const lastItem = items[items.length - 1];
    const lastRegionEndPos = lastItem.position + lastItem.length;
    regionPoints1.push({ source: "EOR", pos: lastRegionEndPos });
  }

  // change source names to be better
  const regionPoints2 = regionPoints1.map(({ source, pos }) => {
    // extract stem from absolute path
    let name = path.splitext(path.split(source)[1])[0];

    // remove msst stem separator naming
    name = removeMSSTSuffix(name);

    return { name, pos };
  });

  undoBlock(SCRIPT_NAME, 8, () => {
    // delete all regions first
    {
      const [ok, markerCount, regionCount] = reaper.CountProjectMarkers(0);
      if (!ok) throw new Error("failed to get marker/region count");
      for (let i = regionCount - 1; i >= 0; i--) {
        const ok = reaper.DeleteProjectMarkerByIndex(0, i);
        if (!ok) throw new Error(`failed to delete region #${i}`);
      }
    }

    // create regions
    const regionIndexes: number[] = [];
    for (let i = 0; i < regionPoints2.length - 1; i++) {
      const name = regionPoints2[i].name;
      const start = regionPoints2[i].pos;
      const end = regionPoints2[i + 1].pos;

      const regionIdx = reaper.AddProjectMarker2(
        0,
        true,
        start,
        end,
        name,
        -1,
        0,
      );
      if (regionIdx === -1) {
        const info = { name, start, end };
        throw new Error(`failed to create region ${encode(info)}`);
      }
      regionIndexes.push(regionIdx);
    }

    // update region render matrix
    for (const idx of regionIndexes) {
      reaper.SetRegionRenderMatrix(0, idx, Track.getMaster().obj, 1);
    }
  });
}

errorHandler(main);
