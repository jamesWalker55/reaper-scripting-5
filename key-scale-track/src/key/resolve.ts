import { Key, Mode, Pitch, ScaleNote, wrapPitch } from "./types";

const SCALE_NOTE_INTERVALS: Record<
  Mode,
  [number, number, number, number, number, number]
> = {
  [Mode.Ionian]: [2, 2, 1, 2, 2, 2],
  [Mode.Dorian]: [2, 1, 2, 2, 2, 1],
  [Mode.Phrygian]: [1, 2, 2, 2, 1, 2],
  [Mode.Lydian]: [2, 2, 2, 1, 2, 2],
  [Mode.Mixolydian]: [2, 2, 1, 2, 2, 1],
  [Mode.Aeolian]: [2, 1, 2, 2, 1, 2],
  [Mode.Locrian]: [1, 2, 2, 1, 2, 2],
};

/** The 1st pitch in the list is the root, 2nd pitch is 2nd scale note, etc */
export function keyToPitches(key: Key): Pitch[] {
  const rootPitch = key.tonic;
  const pitches = SCALE_NOTE_INTERVALS[key.mode].reduce(
    (acc, interval) => {
      const nextPitch = wrapPitch(acc[acc.length - 1]! + interval);
      acc.push(nextPitch);
      return acc;
    },
    [rootPitch],
  );
  if (key.alt !== undefined) {
    for (let i = 0; i < 7; i++) {
      const amt = key.alt[i as ScaleNote] || 0;
      pitches[i as ScaleNote] = wrapPitch((pitches[i as ScaleNote] || 0) + amt);
    }
  }
  return pitches;
}
