AddCwdToImportPaths();

import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import { FX } from "reaper-api/fx";
import { RS5K } from "reaper-api/rs5k";
import { Item, Track } from "reaper-api/track";
import {
  deferAsync,
  deferLoop,
  ensureAPI,
  errorHandler,
  log,
  runMainAction,
  undoBlock,
} from "reaper-api/utils";
import { withSavedTimeSelection } from "./utils";

const SCRIPT_NAME = "Render selected items as stereo stem items";

// number of MIDI ticks for a quarter note
const QN_TICKS = 960;

function main() {
  const toReplace = [];
  for (const item of Item.getSelected()) {
    const take = item.activeTake();
    if (!take) continue;
    if (take.isMidi()) continue;

    const source = take.getSource();
    const sourceFilename = source.getFilename();
    const sourceLength = source.getLength();

    const startRatio = take.sourceStartOffset / sourceLength;
    const endRatio =
      (take.sourceStartOffset + item.length / take.playrate) /
      sourceLength;

    const effectivePitch =
      take.pitch + (take.preservePitch ? Math.log2(take.playrate) * 12 : 0);
    const pitchOffset = effectivePitch - Math.log2(take.playrate) * 12;

    toReplace.push({
      take,
      sourceLength,
      sourceFilename,
      startRatio,
      endRatio,
      pitchOffset,
    })

    const rs = new RS5K(new FX({ track: Track.getSelected()[0].obj }, 0));
    rs.noteOffReleaseEnabled = true;
    rs.sampleStartOffset = startRatio;
    rs.sampleEndOffset = endRatio;
    rs.pitchOffset = pitchOffset;
    rs.modifyFiles((m) => {
      m.deleteAllFiles();
      m.addFile(0, sourceFilename);
    });
  }

  toReplace
}

errorHandler(main);
