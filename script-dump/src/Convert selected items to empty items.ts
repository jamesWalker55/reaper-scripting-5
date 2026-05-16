AddCwdToImportPaths();

import { Item } from "reaper-api/track";
import { errorHandler, undoBlock } from "reaper-api/utils";

function main() {
  const items = Item.getSelected()
    .map((item) => {
      // skip already empty items
      const takeCount = reaper.GetMediaItemNumTakes(item.obj);
      if (takeCount === 0) return null;

      return { item, takeCount };
    })
    .filter((x) => x !== null);
  if (items.length === 0) return;

  undoBlock("Convert selected items to empty items", 4, () => {
    for (const { item, takeCount } of items) {
      for (let i = 0; i < takeCount; i++) {
        reaper.NF_DeleteTakeFromItem(item.obj, 0);
      }
    }
    reaper.UpdateArrange();
  });
}

errorHandler(main);
