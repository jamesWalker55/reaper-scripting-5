AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";

function main() {
  const selectedTracks = Track.getSelected();
  if (selectedTracks.length === 0) return;

  const trackNames = selectedTracks.map((x) => x.getName());

  copy(trackNames.join("\n"));
}

errorHandler(main);
