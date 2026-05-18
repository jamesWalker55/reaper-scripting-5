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

// reaper.GetTrackEnvelopeByName(reaper.GetMasterTrack(0), "Tempo map")

// reaper.GetTrackEnvelopeByChunkName(reaper.GetMasterTrack(0), "TEMPOENVEX")
// reaper.GetEnvelopePointEx(reaper.GetTrackEnvelopeByName(reaper.GetMasterTrack(0), "Tempo map"), -1, 0)

export type GridBasis = {
  /** e.g. 0.125 = 1/8 */
  size: number;
  modifier:
    | {
        // 0.0..=1.0
        swing: number;
      }
    | { triplet: true };
};

/**
 *
 * @param basis
 * @param division Additional divisions to perform. 0 = basis; 1 = subdivide 1; -1 = combine grid once
 */
function vhasbjdas(
  basis: GridBasis,
  division: number,
) {

}

function uijkabsdjask(
  basis: GridBasis,
  minBeatSpacing: number,
  beatStart: number,
  beatStop: number,
) {

}
