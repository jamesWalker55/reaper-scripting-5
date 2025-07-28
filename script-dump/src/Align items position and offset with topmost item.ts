AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { Item, Track } from "reaper-api/track";
import { errorHandler, log, undoBlock } from "reaper-api/utils";

function main() {
  const items = Item.getSelected();
  if (items.length < 2) return;

  // sort items to get the topmost + leftmost item
  items.sort((a, b) => {
    const aTrack = a.getTrack().getIdx();
    const bTrack = b.getTrack().getIdx();
    if (aTrack < bTrack) return -1;
    if (aTrack > bTrack) return 1;

    const aPos = a.position;
    const bPos = b.position;
    if (aPos < bPos) return -1;
    if (aPos > bPos) return 1;

    return 0;
  });

  const referenceItem = items.shift()!;
  const referenceTake = referenceItem.activeTake();
  if (referenceTake === null)
    throw new Error("Topmost item does not contain any takes");

  undoBlock("Align items position and offset with topmost item", 4, () => {
    for (const item of items) {
      item.position = referenceItem.position;
      item.fadeInLength = referenceItem.fadeInLength;
      item.fadeOutLength = referenceItem.fadeOutLength;
      item.length = referenceItem.length;
      item.snapOffset = referenceItem.snapOffset;
      item.volume = referenceItem.volume;

      const take = item.activeTake();
      if (take === null) continue;

      take.pan = referenceTake.pan;
      take.pitch = referenceTake.pitch;
      take.playrate = referenceTake.playrate;
      take.preservePitch = referenceTake.preservePitch;
      take.sourceStartOffset = referenceTake.sourceStartOffset;
      take.volume = referenceTake.volume;
    }

    referenceItem.selected = false;
  });
}

errorHandler(main);
