AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { getSelectedFx } from "reaper-api/selectedFx";
import { errorHandler, msgBox, undoBlock } from "reaper-api/utils";
// import { generateTomlText, LAST_TOUCHED_FX_PARAM } from "./util";

function main() {
  const selectedFx = getSelectedFx();
  if (selectedFx.length < 2) {
    msgBox("Error", "Please select at least 2 FXs!");
    return;
  }

  // check selected FX are the same plugin
  {
    const idents = selectedFx.map((x) => x.getIdent());
    for (const ident of idents) {
      if (ident !== idents[0]!) {
        msgBox(
          "Error",
          `The selected FX instances have different identifiers:\n\n${idents.map((x) => `- ${x}`).join("\n")}`,
        );
        return;
      }
    }

    const counts = selectedFx.map((x) => x.getParameterCount());
    for (const count of counts) {
      if (count !== counts[0]!) {
        msgBox(
          "Error",
          `The selected FX instances have parameter counts:\n\n${counts.join(", ")}`,
        );
        return;
      }
    }
  }

  const parent = selectedFx.shift()!;
  const paramCount = parent.getParameterCount();
  undoBlock(
    "Link all parameters for selected FX to first FX (Sync selected FX instances to first)",
    -1,
    () => {
      for (const child of selectedFx) {
        for (let i = 0; i < paramCount; i++) {
          const param = child.getParameter(i);
          param.setModulation({
            baseline: 0.0,
            plink: {
              fxidx: parent.fxidx,
              param: i,
              offset: 0.0,
              scale: 1.0,
            },
          });
        }
      }
    },
  );
}

errorHandler(main);
