/** Absolute position, where 0 = C */
export enum Pitch {
  C = 0,
  CS,
  D,
  DS,
  E,
  F,
  FS,
  G,
  GS,
  A,
  AS,
  B,
}

/** Convert 0 to C, 1 to C#, 2 to D, ... */
export function wrapPitch(x: number): Pitch {
  while (x < 0) x += 12;
  x = Math.round(x % 12);
  return x as Pitch; // x should be 0..=11, so the same as `Note` type
}

/** Relative position, mode independent, where 0 = <tonic note> */
export type OffsetNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Relative position, mode dependent, where 0 = <tonic note> */
export type ScaleNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * right now everything is hard-coded assuming all scales have 7 notes.
 * i.e. this doesn't support blues scale (6 notes)
 *
 * TODO: rename Mode to Scale, and make scale interval info available at
 * `parsing.ts` to validate ModeAlt (rename it too)
 */
export enum Mode {
  /** Major */
  Ionian = 0, // number is tonic relative to major scale
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  /** Minor */
  Aeolian,
  Locrian,
}

/** modify a note in the scale, e.g. "lydian b7" */
export type ModeAlt = { [K in ScaleNote]?: number };

export type Key = {
  tonic: Pitch;
  mode: Mode;
  alt?: ModeAlt;
};
