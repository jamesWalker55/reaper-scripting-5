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

      if (reversed) {
        // item lengths
        const oldItemLength = item.length;
        const newItemLength = (item.length * sourceBpm) / targetBpm;

        // find new item position
        const newItemPos = item.position + oldItemLength - newItemLength;

        // store item fades to restore later
        const fadeInLength = item.fadeInLength;
        const fadeOutLength = item.fadeOutLength;

        // split the item to trim the left side
        const rightItem = item.split(newItemPos);
        rightItem.fadeInLength = fadeInLength;
        rightItem.fadeOutLength = fadeOutLength;

        // delete left item
        item.delete();
      } else {
        item.length = (item.length * sourceBpm) / targetBpm;
      }
    }
  });

  reaper.UpdateArrange();
}
