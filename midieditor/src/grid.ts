import { HASH_INITIAL, hashObject } from "./hash";
import { getTimeMarkers, TimeMarker } from "./timechanges";
import { qnToTime, timeToQn } from "./timemap";
import { currentProject } from "./utils";
import * as json from "reaper-api/json";

type Store = {
  timeMarkers: TimeMarker[];
  timeMarkersHash: number;
};

let STORE: Store | null = null;

// hashObject();
//
export function asdqf(proj: ReaProject, start: number, stop: number) {
  const asd = qnToTime(proj, Math.floor(timeToQn(proj, start)));

  const markers = getTimeMarkers(0);
  const markersHash = hashObject(HASH_INITIAL, markers);
  if (STORE === null) {
    // STORE =
  }
  // if (markersHash !== STORE)
}

reaper.GetTrackEnvelopeByName(reaper.GetMasterTrack(0), "Tempo map")

reaper.GetTrackEnvelopeByChunkName(reaper.GetMasterTrack(0), "TEMPOENVEX")
reaper.GetEnvelopePointEx(reaper.GetTrackEnvelopeByName(reaper.GetMasterTrack(0), "Tempo map"), -1, 0)