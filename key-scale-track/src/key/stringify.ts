import { Key, Mode, ModeAlt, Pitch, ScaleNote } from "./types";

function pitchToString(x: Pitch): string {
  switch (x) {
    case Pitch.C:
      return "C";
    case Pitch.CS:
      return "C#";
    case Pitch.D:
      return "D";
    case Pitch.DS:
      return "D#";
    case Pitch.E:
      return "E";
    case Pitch.F:
      return "F";
    case Pitch.FS:
      return "F#";
    case Pitch.G:
      return "G";
    case Pitch.GS:
      return "G#";
    case Pitch.A:
      return "A";
    case Pitch.AS:
      return "A#";
    case Pitch.B:
      return "B";
    default:
      x satisfies never;
      throw new Error("unreachable");
  }
}

function modeToString(x: Mode): string {
  switch (x) {
    case Mode.Ionian:
      return "";
    case Mode.Dorian:
      return " Dorian";
    case Mode.Phrygian:
      return " Phrygian";
    case Mode.Lydian:
      return " Lydian";
    case Mode.Mixolydian:
      return " Mixolydian";
    case Mode.Aeolian:
      return "m";
    case Mode.Locrian:
      return " Locrian";
    default:
      x satisfies never;
      throw new Error("unreachable");
  }
}

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

export function stringifyKey(key: Key): string {
  const tonic = pitchToString(key.tonic);
  const mode = modeToString(key.mode);
  const alt = key.alt ? ` ${altToString(key.alt)}` : "";
  return `${tonic}${mode}${alt}`;
}
