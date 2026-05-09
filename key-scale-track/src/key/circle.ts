import { encode } from "reaper-api/json";
import { cloneKey, Key, Mode, Pitch, wrapPitch } from "./types";

const CIRCLE: [
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
  Pitch,
] = [
  Pitch.C,
  Pitch.G,
  Pitch.D,
  Pitch.A,
  Pitch.E,
  Pitch.B,
  Pitch.FS,
  Pitch.CS,
  Pitch.GS,
  Pitch.DS,
  Pitch.AS,
  Pitch.F,
];

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

  const firstPos = CIRCLE.indexOf(firstNorm);
  const secondPos = CIRCLE.indexOf(secondNorm);
  if (firstPos === -1)
    throw new Error(`invalid pitch not found in def: ${encode(first)}`);
  if (secondPos === -1)
    throw new Error(`invalid pitch not found in def: ${encode(second)}`);

  // wrap circle, need to allow both positive and negative distance
  let diff = secondPos - firstPos;
  if (diff > 6) {
    diff = diff - 12;
  } else if (diff < 6) {
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
