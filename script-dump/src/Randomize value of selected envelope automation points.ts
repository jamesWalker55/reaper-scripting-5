AddCwdToImportPaths();

import { errorHandler, undoBlock } from "reaper-api/utils";

function main() {
  undoBlock("Randomize value of selected envelope/automation points", 1, () => {
    const env = reaper.GetSelectedEnvelope(0);
    for (
      let autoItemIdx = -1;
      autoItemIdx < reaper.CountAutomationItems(env);
      autoItemIdx++
    ) {
      const pointCount = reaper.CountEnvelopePointsEx(
        env,
        autoItemIdx | 0x10000000,
      );
      for (let i = 0; i < pointCount; i++) {
        const [retval, time, value, shape, tension, selected] =
          reaper.GetEnvelopePointEx(env, autoItemIdx | 0x10000000, i);
        if (!retval)
          throw new Error(
            `Failed to get point ${i} in automation item ${autoItemIdx}`,
          );
        if (!selected) continue;

        const newValue = math.random();
        reaper.SetEnvelopePointEx(
          env,
          autoItemIdx,
          i,
          undefined,
          newValue,
          undefined,
          undefined,
          undefined,
          true,
        );
      }
      reaper.Envelope_SortPointsEx(env, autoItemIdx);
    }
  });
}

errorHandler(main);
