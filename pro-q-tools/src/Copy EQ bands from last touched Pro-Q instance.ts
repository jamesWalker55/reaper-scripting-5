AddCwdToImportPaths();

import { encode } from "json";
import { copy } from "reaper-api/clipboard";
import { getLastTouchedFx } from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { errorHandler, msgBox } from "reaper-api/utils";
import { coerceVSTType, getBands, getProQType } from "./proq";

function main() {
  const fx = getLastTouchedFx();
  if (fx === null) return;

  const ident = fx.getIdent();
  const type = coerceVSTType(fx.getType());
  const proq = getProQType(ident);
  if (proq === null) {
    msgBox(
      "Error",
      `Last touched FX is not a Pro-Q instance!\n\nDebug info:\n${inspect(
        ident,
      )}\n${inspect(fx.getType())}`,
    );
    return;
  }
  if (type === null) {
    msgBox(
      "Error",
      `Unsupported plugin type for last touched Pro-Q instance.\n\nDebug info:\n${inspect(
        ident,
      )}\n${inspect(fx.getType())}`,
    );
    return;
  }

  copy(encode(getBands(fx, proq)));
}

errorHandler(main);
