AddCwdToImportPaths();

import { paste } from "reaper-api/clipboard";
import { Item, Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";
import { splitlines, strip } from "reaper-api/utilsLua";

function main() {
  const selectedItems = Item.getSelected();
  if (selectedItems.length === 0) return;

  const clipboard = paste();
  const names = splitlines(clipboard);

  // zip track and clipboard names, whichever one is shorter
  for (let i = 0; i < selectedItems.length && i < names.length; i++) {
    const item = selectedItems[i];
    const take = item.activeTake();
    if (take === null) continue;

    const name = strip(names[i]);

    take.name = name;
  }
}

errorHandler(main);
