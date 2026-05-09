import { inspect } from "reaper-api/inspect";

/**
 * Find the min distance between `a` and `b`, where they are both
 * indexes in a wrapping array of length 12.
 *
 * E.g. Distance between pitch 1 and 11 is 2 (there are 12 pitches in total)
 */
export function wrap12arrDistance(a: number, b: number): number {
  // calculate distance, assuming no wrapping around array
  let distance = Math.abs(a - b);
  if (distance > 6) {
    // wrapping will give a shorter distance
    return 12 - distance;
  } else {
    return distance;
  }
}

/**
 * Find the min distance between two pitches.
 *
 * E.g. Distance between pitch 1 and 11 is 2
 */
export const pitchDistance = wrap12arrDistance;

export function assertSorted<T>(arr: T[], sortBy: (t: T) => number) {
  arr.reduce((prevKey: number | null, curr) => {
    const key = sortBy(curr);
    if (prevKey === null) {
      // first iteration, nothing to check
      return key;
    } else {
      if (prevKey > key)
        throw new Error(
          `list is not sorted (${prevKey} > ${key}): ${inspect(arr)}`,
        );
      return key;
    }
  }, null);
}
