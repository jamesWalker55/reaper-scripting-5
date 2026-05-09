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

/** Relative position, mode independent, where 0 = <tonic note> */
export type OffsetNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Relative position, mode dependent, where 0 = <tonic note> */
export type ScaleNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum Mode {
  /** Major */
  Ionian,
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
