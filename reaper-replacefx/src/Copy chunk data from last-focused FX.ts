AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { getLastTouchedFx } from "reaper-api/fx";
import { msgBox } from "reaper-api/utils";

function main() {
  const fx = getLastTouchedFx();
  if (!fx) {
    msgBox("Error", "Please focus on an FX before running this script");
    return;
  }

  const chunk = fx.getData();
  if (chunk === null) {
    msgBox(
      "Error",
      `This plugin type '${fx.getType()}' does not support FX chunks`,
    );
    return;
  }

  copy(chunk);
}

main();
