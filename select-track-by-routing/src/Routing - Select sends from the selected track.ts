AddCwdToImportPaths();

import { getProjectRoutingInfo, Track } from "reaper-api/track";

function main() {
  const { sends, receives } = getProjectRoutingInfo();

  const idxToSelect: LuaTable<number, boolean> = new LuaTable();
  for (const track of Track.getSelected()) {
    const i = track.getIdx();
    const destinations = sends.get(i) || [];
    for (const dstIdx of destinations) {
      idxToSelect.set(dstIdx, true);
    }
  }

  const count = Track.count();
  for (let i = 0; i < count; i++) {
    const track = Track.getByIdx(i);
    const selected = idxToSelect.has(i);
    reaper.SetTrackSelected(track.obj, selected);
  }
}

main();
