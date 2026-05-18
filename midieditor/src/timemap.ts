import { inspect } from "reaper-api/inspect";

export function dividedBpmAtTime(proj: ReaProject, pos: number): number {
  return reaper.TimeMap2_GetDividedBpmAtTime(proj, pos);
}

/** Return null if no more markers after the given position */
export function nextChangeTime(
  proj: ReaProject,
  afterPos: number,
): number | null {
  const time = reaper.TimeMap2_GetNextChangeTime(proj, afterPos);
  if (time === -1) return null;
  return time;
}

export function qnToTime(proj: ReaProject, qn: number): number {
  return reaper.TimeMap2_QNToTime(proj, qn);
}

export function timeToQn(proj: ReaProject, time: number): number {
  return reaper.TimeMap2_timeToQN(proj, time);
}

/** measures must be integer */
export function beatsToTime(
  proj: ReaProject,
  beats: number,
  measures?: number,
): number {
  return reaper.TimeMap2_beatsToTime(proj, beats, measures);
}

export function timeToBeats(proj: ReaProject, time: number) {
  const [beats, measures, timesig_num, fullbeats, timesig_denom] =
    reaper.TimeMap2_timeToBeats(proj, time);

  // documentation says all params may be null but i don't know when
  if (
    measures === null ||
    timesig_num === null ||
    fullbeats === null ||
    timesig_denom === null
  ) {
    throw new Error(
      `failed to convert time to beats reaper.TimeMap2_timeToBeats(${inspect(proj)}, ${inspect(time)})`,
    );
  }

  return { beats, measures, timesig_num, fullbeats, timesig_denom };
}
