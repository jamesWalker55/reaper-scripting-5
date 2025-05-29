import { TypedSection } from "reaper-api/extstate";
import { Item } from "reaper-api/track";
import { undoBlock } from "reaper-api/utils";

export const config = TypedSection("bpm-helper", {
  windowX: "number",
  windowY: "number",
  windowW: "number",
  windowH: "number",
  windowDock: "number",
  sourceBpm: "number",
  targetBpm: "number",
});

function clamp(min: number, x: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

export function applyNewBpmToSelectedItems(
  sourceBpm: number,
  targetBpm: number,
  reversed: boolean,
) {
  undoBlock("Fix item length/positioning from BPM edits", 4, () => {
    for (const item of Item.getSelected()) {
      // only continue if this is an audio item
      {
        const take = item.activeTake()?.asTypedTake();
        if (!take) continue;
        if (take.TYPE !== "AUDIO") continue;
      }

      // store item fades to restore later
      const fadeInLength = item.fadeInLength;
      const fadeOutLength = item.fadeOutLength;

      // old item info
      const oldPos = item.position;
      const oldLength = item.length;
      const oldSnapOffset = item.snapOffset;
      const oldSnapPos = oldPos + oldSnapOffset;

      // calculate target position/length stuff
      const newLength = (oldLength * sourceBpm) / targetBpm;
      const newSnapOffset = clamp(
        0,
        reversed ? oldSnapOffset + newLength - oldLength : oldSnapOffset,
        newLength,
      );
      const newPos = oldSnapPos - newSnapOffset;
      item.position = newPos;
      item.length = newLength;
      item.snapOffset = newSnapOffset;

      // if the item is reversed, slide take audio to preserve end transient
      if (reversed) {
        for (const x of item.iterTakes()) {
          const take = x.asTypedTake();
          if (take.TYPE !== "AUDIO") continue;

          take.sourceStartOffset =
            take.sourceStartOffset + (oldLength - newLength) * take.playrate;
        }
      }

      // restore item fades
      item.fadeInLength = fadeInLength;
      item.fadeOutLength = fadeOutLength;
    }
  });

  reaper.UpdateArrange();
}
