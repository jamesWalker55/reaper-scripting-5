import { cloneKey, Key, Pitch, wrapPitch } from "./types";

const CIRCLE_POS: Record<Pitch, number> = {
  [Pitch.C]: 0,
  [Pitch.G]: 1,
  [Pitch.D]: 2,
  [Pitch.A]: 3,
  [Pitch.E]: 4,
  [Pitch.B]: 5,
  [Pitch.FS]: 6,
  [Pitch.CS]: 7,
  [Pitch.GS]: 8,
  [Pitch.DS]: 9,
  [Pitch.AS]: 10,
  [Pitch.F]: 11,
};

/** Resolve the tonic + mode combination to a single root pitch. E.g. Amin resolves to C */
function normalizeKeyMode(key: Key): Pitch {
  return wrapPitch(key.tonic - key.mode);
}

/**
 * Calculate the distance between the 2 keys on the circle of fifths.
 * Clockwise is +ve, anti-clockwise is -ve.
 */
export function circleSteps(first: Key, second: Key): number {
  const firstNorm = normalizeKeyMode(first);
  const secondNorm = normalizeKeyMode(second);

  const firstPos = CIRCLE_POS[firstNorm];
  const secondPos = CIRCLE_POS[secondNorm];

  // wrap circle, need to allow both positive and negative distance
  let diff = secondPos - firstPos;
  if (diff > 6) {
    diff = diff - 12;
  } else if (diff < -6) {
    diff = diff + 12;
  }

  return diff;
}

/** Change the tonic of a key by walking the circle, keeping the same mode. */
export function walkCircle(start: Key, distance: number): Key {
  const rv = cloneKey(start);
  rv.tonic = wrapPitch(start.tonic + 7 * Math.round(distance));
  return rv;
}
