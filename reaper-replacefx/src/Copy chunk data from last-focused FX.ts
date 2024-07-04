AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { msgBox } from "reaper-api/utils";
import { getLastTouchedFxChunk } from "./fxChunk";
import { assertUnreachable } from "./utils";

function main() {
  const result = getLastTouchedFxChunk();
  if (!result.ok) {
    switch (result.name) {
      case "NoFocusedFX":
        msgBox("Error", "Please focus on an FX before running this script");
        return;
      case "FXHasNoChunk":
        msgBox("Error", "This FX type does not have FX chunks");
        return;
      case "FailedToGetFXChunk":
        msgBox(
          "Error",
          "Unknown error: Failed to get FX chunk, please contact the developer!",
        );
        return;
      default:
        assertUnreachable(result);
    }
  }

  copy(result.val);
}

main();
