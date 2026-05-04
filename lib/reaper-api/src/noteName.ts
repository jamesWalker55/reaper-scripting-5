const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export function getNoteName(val: number) {
  // pitch in range 0 <= x < 12
  const pitch = val % 12;
  // octave in range -1 <= x <= 9
  const octave = Math.floor(val / 12) - 1;

  return `${NOTE_NAMES[pitch]}${string.format("%d", octave)}`;
}

export function parseNoteName(name: string) {
  // note name must have length 2-4
  if (!(2 <= name.length && name.length <= 4)) return null;

  // check first letter is A-G
  let firstLetterByte = name.charCodeAt(0);
  if (firstLetterByte > 90) firstLetterByte -= 32; // to uppercase
  if (!(65 <= firstLetterByte && firstLetterByte <= 71)) return null;

  // map letter to base pitch
  let basePitch: number;
  if (firstLetterByte === 67) {
    basePitch = 0; // C
  } else if (firstLetterByte === 68) {
    basePitch = 2; // D
  } else if (firstLetterByte === 69) {
    basePitch = 4; // E
  } else if (firstLetterByte === 70) {
    basePitch = 5; // F
  } else if (firstLetterByte === 71) {
    basePitch = 7; // G
  } else if (firstLetterByte === 65) {
    basePitch = 9; // A
  } else if (firstLetterByte === 66) {
    basePitch = 11; // B
  } else {
    throw new Error("should be unreachable");
  }

  const isSharp = name.slice(1, 2) === "#";
  if (isSharp) basePitch += 1;

  // look for the octave number
  const octaveSpan = string.find(name, "^%-?%d$", isSharp ? 3 : 2);
  if (octaveSpan.length === 0) return null;

  const octave = parseInt(string.sub(name, octaveSpan[0], octaveSpan[1]));

  const result = (octave + 1) * 12 + basePitch;

  // ensure it is in range 127 (prevents notes above G9)
  if (!(0 <= result && result <= 127)) return null;

  return result;
}
