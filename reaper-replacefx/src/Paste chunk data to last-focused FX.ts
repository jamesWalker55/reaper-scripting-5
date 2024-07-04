AddCwdToImportPaths();

import { paste } from "reaper-api/clipboard";
import { msgBox } from "reaper-api/utils";
import { setLastTouchedFxChunk } from "./fxChunk";
import { assertUnreachable } from "./utils";

function main() {
  const chunk = paste();
  if (chunk.length === 0) {
    msgBox("Error", "Clipboard is empty!");
    return;
  }

  reaper.Undo_BeginBlock2(0);
  reaper.PreventUIRefresh(1);

  const result = setLastTouchedFxChunk(chunk);
  if (!result.ok) {
    reaper.PreventUIRefresh(-1);
    reaper.Undo_EndBlock2(0, "Paste chunk data to last-focused FX", 0);

    switch (result.name) {
      case "NoFocusedFX":
        msgBox("Error", "Please focus on an FX before running this script");
        break;
      case "FXHasNoChunk":
        msgBox("Error", "This FX type does not have FX chunks");
        break;
      case "FailedToGetFXChunk":
        msgBox(
          "Error",
          "Unknown error: Failed to get FX chunk, please contact the developer!",
        );
        break;
      case "FailedToSetFXChunk":
        msgBox(
          "Error",
          "Unknown error: Failed to set FX chunk, please contact the developer!",
        );
        break;
      default:
        assertUnreachable(result);
    }
    return;
  }

  const fx = result.val;
  if (fx.type === "track") {
    reaper.PreventUIRefresh(-1);
    reaper.Undo_EndBlock2(0, "Paste chunk data to last-focused track FX", 2);
  } else if (fx.type === "take") {
    reaper.PreventUIRefresh(-1);
    reaper.Undo_EndBlock2(0, "Paste chunk data to last-focused take FX", 4);
  } else {
    msgBox(
      "Error",
      "Unknown error: Unknown target type, please contact the developer!",
    );
    reaper.PreventUIRefresh(-1);
    reaper.Undo_EndBlock2(0, "Paste chunk data to last-focused FX", -1);
    assertUnreachable(fx);
  }
}

main();
