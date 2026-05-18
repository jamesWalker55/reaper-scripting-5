export type TimeChange = {
  pos: number;
  bpm: number;
  timesig_num: number;
  newMeasure: boolean;
};

// /** First time marker is guaranteed to set BPM, but not time sig */
// export function getTimeMarkersInRange(
//   proj: ReaProject,
//   start: number,
//   stop: number,
// ): TimeChange[] {
//   const markers = getTimeMarkers(proj);
//   if (markers.length === 0) {
//     // no time sig markers, use project settings
//     const { bpm, timesig_num } = getDefault(proj);
//     return [{ pos: 0, bpm, timesig_num, newMeasure: true }];
//   }

//   if (markers[0]!.bpm === null) throw new Error("first time marker does not set the BPM");
//   if (markers[0]!.timesig === null) {
//     const { bpm, timesig_num } = getDefault(proj);
//     markers[0]!.timesig
//   }

//   const result: TimeChange[] = [];
//   // iterate until end of all markers OR we find marker that is out of range of our view
//   for (let i = firstIdx; i < count; i++) {
//     const marker = getTimeMarker(proj, i);
//     if (marker.timepos > stop) break;
//     reaper.CountTrackEnvelopes(reaper.GetMasterTrack(0));
//     reaper.GetTrackEnvelopeByName(reaper.GetMasterTrack(0), "Tempo map");
//     reaper.GetTrackEnvelope(reaper.GetMasterTrack(0), 0);
//     // marker is just before / within current view
//     result.push({
//       pos: marker.timepos,
//       bpm: marker.bpm,
//       timesig_num: marker.timesig,
//     });
//   }
//   // // getTimeMarker(proj, firstIdx);
//   // for (let i = 0; i < count; i++) {
//   //   result.push(marker);
//   // }
//   return result;
// }

/** First time marker is guaranteed to set BPM, but not time sig */
export function getTimeMarkers(proj: ReaProject): TimeMarker[] {
  const result: TimeMarker[] = [];

  const count = reaper.CountTempoTimeSigMarkers(proj);
  for (let i = 0; i < count; i++) {
    const marker = getTimeMarker(proj, i);
    result.push(marker);
  }
  return result;
}

export type TimeMarker = {
  timepos: number;
  /** always an integer */
  measurepos: number;
  beatpos: number;
  /** null if it doesnt update bpm */
  bpm: number | null;
  /** null if it doesnt update timesig */
  timesig: TimeSig | null;
  linearbpm: boolean;
};

/** e.g. [6, 8] is 6/8 */
export type TimeSig = [number, number];

export function getTimeMarker(proj: ReaProject, i: number): TimeMarker {
  const [
    ok,
    timepos,
    measurepos,
    beatpos,
    bpm,
    timesig_num,
    timesig_denom,
    linearbpm,
  ] = reaper.GetTempoTimeSigMarker(proj, i);
  if (!ok) throw new Error(`failed to get time sig marker #${i}`);

  // &1=sets time signature and starts new measure
  // &2=does not set tempo
  // &4=allow previous partial measure if starting new measure
  // &8=set new metronome pattern if starting new measure
  // &16=reset ruler grid if starting new measure
  const flags = reaper.GetSetTempoTimeSigMarkerFlag(proj, i, 0, false);
  const setOrUpdateBpm = (flags & 2) === 0;
  const setOrUpdateTimeSig = (flags & 1) !== 0;
  // TODO: handle partial measure
  const partialMeasure = (flags & 4) !== 0;

  const marker: TimeMarker = {
    timepos,
    measurepos,
    beatpos,
    linearbpm,
    bpm: null,
    timesig: null,
  };
  if (setOrUpdateBpm) {
    marker.bpm = bpm;
  }
  if (setOrUpdateTimeSig) {
    marker.timesig = [timesig_num, timesig_denom];
  }
  if (setOrUpdateBpm || setOrUpdateTimeSig) {
    return marker;
  } else {
    throw new Error(
      `time sig marker #${i} does not set or update anything, which should be impossible`,
    );
  }
}

export function getDefault(proj: ReaProject) {
  const [bpm, timesig_num] = reaper.GetProjectTimeSignature2(proj);
  return { bpm, timesig_num };
}

// integer reaper.FindTempoTimeSigMarker(ReaProject project, number time)
