import { log } from "reaper-api/utils";
import { keyToPitches } from "./resolve";
import { Key, Mode, ModeAlt, Pitch, ScaleNote, wrapPitch } from "./types";

const PITCHES_NORMAL = {
  [Pitch.C]: "C",
  [Pitch.D]: "D",
  [Pitch.E]: "E",
  [Pitch.F]: "F",
  [Pitch.G]: "G",
  [Pitch.A]: "A",
  [Pitch.B]: "B",
};
type NormalPitch = keyof typeof PITCHES_NORMAL;
type AbnormalPitch = Exclude<Pitch, NormalPitch>;
const PITCHES_SHARP: Record<AbnormalPitch, string> = {
  [Pitch.CS]: "C#",
  [Pitch.DS]: "D#",
  [Pitch.FS]: "F#",
  [Pitch.GS]: "G#",
  [Pitch.AS]: "A#",
};
const PITCHES_FLAT: Record<AbnormalPitch, string> = {
  [Pitch.CS]: "Db",
  [Pitch.DS]: "Eb",
  [Pitch.FS]: "Gb",
  [Pitch.GS]: "Ab",
  [Pitch.AS]: "Bb",
};
const MODES: Record<Mode, string> = {
  [Mode.Ionian]: "",
  [Mode.Dorian]: " Dorian",
  [Mode.Phrygian]: " Phrygian",
  [Mode.Lydian]: " Lydian",
  [Mode.Mixolydian]: " Mixolydian",
  [Mode.Aeolian]: "m",
  [Mode.Locrian]: " Locrian",
};

function altToString(modeAlt: ModeAlt): string {
  const parts: string[] = [];
  for (let i = 0; i <= 7; i++) {
    const amt = modeAlt[i as ScaleNote] || 0;
    if (amt === 0) continue;

    const char = amt > 0 ? "#" : "b";
    parts.push(`${char.repeat(Math.abs(amt))}${i}`);
  }
  return parts.join(" ");
}

/** if the start pitch is sharp, then it will be skipped */
function* iterNonSharpPitches(start: Pitch) {
  for (let i = 0; i < 12; i++) {
    const pitch = wrapPitch(start + i);
    if (pitch in PITCHES_NORMAL) {
      yield pitch;
    }
  }
}

function zipNonSharpPitches(start: Pitch, zip: Pitch[]) {
  if (zip.length !== 7)
    throw new Error("expected exactly 7 pitches in a scale");

  const nonSharp = [];
  for (const p of iterNonSharpPitches(start)) {
    nonSharp.push(p);
  }
  if (nonSharp.length !== 7)
    throw new Error("expected exactly 7 non-sharp pitches");

  return nonSharp.map((nonsharp, i) => ({ nonsharp, zip: zip[i]! }));
}

/**
 * basically, check each letter and see which letter will produce the least sharp/flats in the scale note names
 *
 * https://en.wikipedia.org/wiki/Letter_notation#Choice_of_note_names
 */
function tonicToStringDiatonic(tonic: Pitch, pitches: Pitch[]): string {
  if (tonic in PITCHES_NORMAL) return PITCHES_NORMAL[tonic as NormalPitch];

  type AltCount = { total: number; max: number };

  // try sharp notation "<P-1>#"
  const sharpInfo: AltCount = { total: 0, max: 0 };
  for (const { nonsharp, zip } of zipNonSharpPitches(
    wrapPitch(tonic - 1),
    pitches,
  )) {
    const distance = Math.abs(nonsharp - zip);
    sharpInfo.total += distance;
    sharpInfo.max = Math.max(sharpInfo.max, distance);
  }

  // try flat notation "<P+1>b"
  const flatInfo: AltCount = { total: 0, max: 0 };
  for (const { nonsharp, zip } of zipNonSharpPitches(
    wrapPitch(tonic + 1),
    pitches,
  )) {
    const distance = Math.abs(nonsharp - zip);
    flatInfo.total += distance;
    flatInfo.max = Math.max(flatInfo.max, distance);
  }

  log(sharpInfo, flatInfo);

  if (sharpInfo.max > flatInfo.max) {
    return PITCHES_FLAT[tonic as AbnormalPitch];
  } else if (sharpInfo.max < flatInfo.max) {
    return PITCHES_SHARP[tonic as AbnormalPitch];
  } else if (sharpInfo.total > flatInfo.total) {
    return PITCHES_FLAT[tonic as AbnormalPitch];
  } else if (sharpInfo.total < flatInfo.total) {
    return PITCHES_SHARP[tonic as AbnormalPitch];
  } else {
    return PITCHES_SHARP[tonic as AbnormalPitch];
  }
}

export function stringifyKey(key: Key): string {
  const tonic = tonicToStringDiatonic(key.tonic, keyToPitches(key));
  const mode = MODES[key.mode];
  const alt = key.alt ? ` ${altToString(key.alt)}` : "";
  return `${tonic}${mode}${alt}`;
}
