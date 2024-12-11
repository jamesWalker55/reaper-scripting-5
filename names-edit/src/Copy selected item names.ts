AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { Item, Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";

function main() {
  const selectedItems = Item.getSelected();
  if (selectedItems.length === 0) return;

  const trackNames = selectedItems.map((x) => x.activeTake()?.name || "");

  copy(trackNames.join("\n"));
}

errorHandler(main);
