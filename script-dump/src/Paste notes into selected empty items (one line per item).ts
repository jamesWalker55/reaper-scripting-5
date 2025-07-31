AddCwdToImportPaths();

import { encode } from "json";
import { paste } from "reaper-api/clipboard";
import { Item } from "reaper-api/track";
import { errorHandler, getScriptPath, undoBlock } from "reaper-api/utils";
import { splitlines } from "reaper-api/utilsLua";

function main() {
  const notes = splitlines(paste());
  const items = Item.getSelected()
    // only paste into empty items
    .filter((x) => x.activeTake() === null)
    // get useful info
    .map((x) => {
      const track = x.getTrack().getIdx();
      const pos = x.position;

      return { track, pos, item: x };
    })
    // sort by track and position
    .sort((a, b) => {
      const trackCmp = a.track - b.track;
      if (trackCmp !== 0) return trackCmp;

      return a.pos - b.pos;
    });
  if (items.length === 0) return;

  // set item notes
  undoBlock(getScriptPath().stem, 4, () => {
    for (let i = 0; i < items.length && i < notes.length; i++) {
      const { track, pos, item } = items[i];
      const note = notes[i];

      const [ok, _] = reaper.GetSetMediaItemInfo_String(
        item.obj,
        "P_NOTES",
        note,
        true,
      );
      if (!ok)
        throw new Error(
          `failed to get P_NOTES of item in track ${
            track + 1
          } at ${pos}s to ${encode(note)}`,
        );
    }
    reaper.UpdateArrange();
  });
}

errorHandler(main);
