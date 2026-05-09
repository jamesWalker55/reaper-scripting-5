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
  // `%` works correctly in Lua, but not in real javascript.
  // negative numbers `-1` are handled correctly into `11`.
  x = Math.round(x) % 12;
  return x as Pitch; // x should be 0..=11, so the same as `Note` type
}

/** Relative position, mode independent, where 0 = <tonic note> */
export type OffsetNote = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Relative position, mode dependent, where 0 = <tonic note>
 *
 * Note that `b7` will be parsed as note 6, because we index from 0.
 */
export type ScaleNote = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  Dorian = 2,
  Phrygian = 4,
  Lydian = 5,
  Mixolydian = 7,
  /** Minor */
  Aeolian = 9,
  Locrian = 11,
}

/** modify a note in the scale, e.g. "lydian b7" */
export type ModeAlt = { [K in ScaleNote]?: number };

export type Key = {
  tonic: Pitch;
  mode: Mode;
  alt?: ModeAlt;
};

export function cloneKey(x: Key): Key {
  const rv: Key = {
    tonic: x.tonic,
    mode: x.mode,
  };
  if (x.alt !== undefined) {
    rv.alt = { ...x.alt };
  }
  return rv;
}

/** return a string that can be uniquely identify a key */
export function hashKey(x: Key): string {
  const main: number = ((x.mode & 0b1111) << 4) + (x.tonic & 0b1111);
  let alt: string[] = [];
  if (x.alt !== undefined) {
    for (let i = 0; i < 7; i++) {
      const amt = x.alt[i as ScaleNote] || 0;
      if (amt === 0) continue;

      alt.push(`${i}:${amt}`);
    }
  }
  if (alt.length === 0) {
    return `${main}`;
  } else {
    return `${main};${alt.join(";")}`;
  }
}
