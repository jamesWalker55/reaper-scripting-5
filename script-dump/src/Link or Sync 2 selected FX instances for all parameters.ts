AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { getSelectedFx } from "reaper-api/selectedFx";
import { errorHandler, msgBox, undoBlock } from "reaper-api/utils";
// import { generateTomlText, LAST_TOUCHED_FX_PARAM } from "./util";

function main() {
  const selectedFx = getSelectedFx();
  if (selectedFx.length !== 2) {
    msgBox("Error", "Please select exactly 2 FX!");
    return;
  }

  const [a, b] = selectedFx;
  if (a.getIdent() !== b.getIdent()) {
    msgBox(
      "Error",
      `The two FX have different identifiers!\nA: ${a.getIdent()}\nB: ${b.getIdent()}`,
    );
    return;
  }
  if (a.getParameterCount() !== b.getParameterCount()) {
    msgBox(
      "Error",
      `The two FX have different parameter counts!\nA: ${a.getParameterCount()}\nB: ${b.getParameterCount()}`,
    );
    return;
  }
  const paramCount = b.getParameterCount();
  undoBlock(
    "Link / Sync 2 selected FX instances for all parameters",
    -1,
    () => {
      for (let i = 0; i < paramCount; i++) {
        const pb = b.getParameter(i);
        pb.setModulation({
          baseline: 0.0,
          plink: {
            fxidx: a.fxidx,
            param: pb.param,
            offset: 0.0,
            scale: 1.0,
          },
        });
      }
    },
  );
}

errorHandler(main);
