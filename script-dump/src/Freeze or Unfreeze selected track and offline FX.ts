AddCwdToImportPaths();

import { Item, Take, Track } from "reaper-api/track";
import {
  errorHandler,
  msgBox,
  runMainAction,
  undoBlock,
} from "reaper-api/utils";
import * as Chunk from "reaper-api/chunk";
import { copy } from "reaper-api/clipboard";

const ACTION_FREEZE_TO_STEREO = 41223;
const ACTION_UNFREEZE = 41644;
const ACTION_UNSELECT_ALL_TRACKS = 40297;
const ACTION_SELECT_TRACK_CHILDREN = "_SWS_SELCHILDREN2";
const ACTION_TRACK_FX_OFFLINE = 40535;
const ACTION_TRACK_FX_ONLINE = 40536;

function main() {
  // get the selected track
  const track = (() => {
    const selected = Track.getSelected();
    if (selected.length !== 1) {
      msgBox("Usage", "Select exactly one track!");
      return null;
    }

    return selected[0]!;
  })();
  if (track === null) return;

  // check if track is frozen or not
  const chunk = Chunk.track(track.obj);
  const isFrozen = Chunk.findElement(chunk, "FREEZE") !== null;

  if (isFrozen) {
    // unfreeze and online all fx

    // TODO: check if there are any already-online fx first, and warn

    undoBlock(
      "Unfreeze selected track and set all children FX online",
      -1,
      () => {
        runMainAction(ACTION_UNFREEZE);
        runMainAction(ACTION_SELECT_TRACK_CHILDREN);
        runMainAction(ACTION_TRACK_FX_ONLINE);
        // reselect track
        runMainAction(ACTION_UNSELECT_ALL_TRACKS);
        reaper.SetTrackSelected(track.obj, true);
      },
    );
  } else {
    // freeze and offline all fx

    // TODO: check if there are any already-offline fx first, and warn

    undoBlock(
      "Freeze selected track and set all children FX offline",
      -1,
      () => {
        runMainAction(ACTION_FREEZE_TO_STEREO);
        runMainAction(ACTION_SELECT_TRACK_CHILDREN);
        runMainAction(ACTION_TRACK_FX_OFFLINE);
        // reselect track
        runMainAction(ACTION_UNSELECT_ALL_TRACKS);
        reaper.SetTrackSelected(track.obj, true);
      },
    );
  }
}

errorHandler(main);
