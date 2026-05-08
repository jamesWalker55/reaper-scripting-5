export { parseKey } from "./parse";

export enum Tonic {
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

export type ScaleNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** modify a note in the scale, e.g. "lydian b7" */
export type ModeAlt = { [K in ScaleNote]?: number };

export type Key = {
  tonic: Tonic;
  mode: Mode;
  alt?: ModeAlt;
};
