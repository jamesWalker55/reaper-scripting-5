AddCwdToImportPaths();

import { paste } from "reaper-api/clipboard";
import { Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";
import { splitlines, strip } from "reaper-api/utilsLua";

function main() {
  const selectedTracks = Track.getSelected();
  if (selectedTracks.length === 0) return;

  const clipboard = paste();
  const names = splitlines(clipboard);

  // zip track and clipboard names, whichever one is shorter
  for (let i = 0; i < selectedTracks.length; i++) {
    if (i >= names.length) break;

    const track = selectedTracks[i];
    const name = strip(names[i]);

    track.name;
  }
}

errorHandler(main);
