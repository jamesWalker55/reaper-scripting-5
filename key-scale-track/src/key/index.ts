import { Key, Tonic, Mode, ModeAlt, ScaleNote } from "./types";

export { parseKey } from "./parse";

function tonicToString(x: Tonic): string {
  switch (x) {
    case Tonic.C:
      return "C";
    case Tonic.CS:
      return "C#";
    case Tonic.D:
      return "D";
    case Tonic.DS:
      return "D#";
    case Tonic.E:
      return "E";
    case Tonic.F:
      return "F";
    case Tonic.FS:
      return "F#";
    case Tonic.G:
      return "G";
    case Tonic.GS:
      return "G#";
    case Tonic.A:
      return "A";
    case Tonic.AS:
      return "A#";
    case Tonic.B:
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
  for (let i = 0; i <= 11; i++) {
    const amt = modeAlt[i as ScaleNote] || 0;
    if (amt === 0) continue;

    const char = amt > 0 ? "#" : "b";
    parts.push(`${char.repeat(Math.abs(amt))}${i}`);
  }
  return parts.join(" ");
}

export function keyToString(key: Key): string {
  const tonic = tonicToString(key.tonic);
  const mode = modeToString(key.mode);
  const alt = key.alt ? ` ${altToString(key.alt)}` : "";
  return `${tonic}${mode}${alt}`;
}
