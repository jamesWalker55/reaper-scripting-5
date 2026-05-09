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
export function circleDistance(first: Key, second: Key): number {
  const firstNorm = normalizeKeyMode(first);
  const secondNorm = normalizeKeyMode(second);

  const firstPos = CIRCLE.indexOf(firstNorm);
  const secondPos = CIRCLE.indexOf(secondNorm);
  if (firstPos === -1)
    throw new Error(`invalid pitch not found in def: ${encode(first)}`);
  if (secondPos === -1)
    throw new Error(`invalid pitch not found in def: ${encode(second)}`);

  let distance = secondPos - firstPos;
  // wrap circle
  if (distance > 6) {
    distance = distance - 12;
  } else if (distance < 6) {
    distance = distance + 12;
  }

  return distance;
}

/** Change the tonic of a key by walking the circle, keeping the same mode. */
export function walkCircle(start: Key, distance: number): Key {
  const startNorm = normalizeKeyMode(start);

  const startPos = CIRCLE.indexOf(startNorm);

  let endPos = Math.round(startPos + distance);
  while (endPos >= 12) endPos -= 12;
  while (endPos < 0) endPos += 12;

  const endNorm = CIRCLE[endPos]!;

  const rv = cloneKey(start);
  rv.tonic = wrapPitch(start.tonic - startNorm + endNorm);

  return rv;
}
