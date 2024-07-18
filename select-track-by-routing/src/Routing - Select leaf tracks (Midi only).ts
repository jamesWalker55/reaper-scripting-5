AddCwdToImportPaths();

import { getProjectRoutingInfo, Track } from "reaper-api/track";

function main() {
  const { sends, receives } = getProjectRoutingInfo({ midi: true });

  const count = Track.count();

  for (let i = 0; i < count; i++) {
    const track = Track.getByIdx(i);
    const selected = sends.has(i) && !receives.has(i);
    reaper.SetTrackSelected(track.obj, selected);
  }
}

main();
