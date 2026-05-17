type TimeMarker = {
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
type TimeSig = [number, number];

/** First time marker is guaranteed to set BPM, but not time sig */
export function getTimeMarkers(proj: ReaProject): TimeMarker[] {
  const result: TimeMarker[] = [];

  const count = reaper.CountTempoTimeSigMarkers(proj);
  for (let i = 0; i < count; i++) {
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
      result.push(marker);
    }
  }
  return result;
}

export function getDefault(proj: ReaProject) {
  const [bpm, timesig_num] = reaper.GetProjectTimeSignature2(proj);
  return { bpm, timesig_num };
}

// integer reaper.FindTempoTimeSigMarker(ReaProject project, number time)
