AddCwdToImportPaths();

import { paste } from "reaper-api/clipboard";
import { getLastTouchedFx } from "reaper-api/fx";
import { assertUnreachable, msgBox, undoBlock } from "reaper-api/utils";

function main() {
  const actionName = "Paste chunk data to last-focused FX";

  undoBlock(() => {
    const chunk = paste();
    if (chunk.length === 0) {
      msgBox("Error", "Clipboard is empty!");
      return { desc: actionName, flags: 0 };
    }

    const fx = getLastTouchedFx();
    if (!fx) {
      msgBox("Error", "Please focus on an FX before running this script");
      return { desc: actionName, flags: 0 };
    }

    if (fx.isOffline()) {
      msgBox("Error", "Unable to set chunk data of offline FX");
      return { desc: actionName, flags: 0 };
    }

    const fxType = fx.getType();

    let success: boolean;
    if (fxType.includes("VST")) {
      success = fx.SetNamedConfigParm("vst_chunk", chunk);
    } else if (fxType.includes("CLAP")) {
      success = fx.SetNamedConfigParm("clap_chunk", chunk);
    } else {
      msgBox("Error", "This FX type does not have FX chunks");
      return { desc: actionName, flags: 0 };
    }

    if (!success) {
      msgBox(
        "Error",
        "Unknown error: Failed to set FX chunk, please contact the developer!",
      );
      return { desc: actionName, flags: 0 };
    }

    if (fx.type === "track") {
      return { desc: actionName, flags: 2 };
    } else if (fx.type === "take") {
      return { desc: actionName, flags: 4 };
    } else {
      msgBox(
        "Error",
        "Unknown error: Unknown target type, please contact the developer!",
      );
      if (true as any) {
        return { desc: actionName, flags: -1 };
      }
      assertUnreachable(fx);
    }
  });
}

main();
