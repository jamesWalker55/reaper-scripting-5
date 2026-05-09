import { MidiEvent } from "reaper-api/midibuf";
import { Key, parseKey } from "./key";
import { parseKeyOrTranspose } from "./key/parse";
import { keyToPitches } from "./key/resolve";
import { hashKey } from "./key/types";

/**
 * An item that may / may not define a key.
 *
 * If user input is invalid or malformed, then it does not define a key.
 *
 * Empty string is also allowed so the user can set the range of the section.
 */
export type TextItem = {
  text: string;
  pos: number;
};

export type KeySection = {
  key: Key;
  pos: number;
};

export type Error = {
  msg: string;
  pos: number;
};

/** items MUST be sorted */
export function parseKeySections(items: TextItem[]): {
  sections: KeySection[];
  errors: Error[];
} {
  const sections: KeySection[] = [];
  const errors: Error[] = [];

  let prevKey: Key | null = null;

  for (const item of items) {
    // parse key
    const res: ReturnType<typeof parseKey> =
      prevKey === null
        ? parseKey(item.text)
        : parseKeyOrTranspose(item.text, prevKey);
    if ("err" in res) {
      errors.push({ msg: res.err, pos: item.pos });
      continue;
    }
    const key: Key = res.ok;

    sections.push({ key, pos: item.pos });

    prevKey = key;
  }

  return { sections, errors };
}

export function hashKeySections(sections: KeySection[]): string {
  return sections
    .map((x) => {
      const keyhash = hashKey(x.key);
      return string.format("%.4f=%s", x.pos, keyhash);
    })
    .join("\n");
}

export function keyToMidiEvents(key: Key, endTick: number): MidiEvent[] {
  const nonRootPitches = keyToPitches(key);
  const rootPitch = nonRootPitches.shift()!;

  // generate basic notes
  let notes: { note: number; vel: number; ch: number }[] = [];

  for (let octave = 0; octave < 11; octave++) {
    notes.push({ note: 12 * octave + rootPitch, vel: 127, ch: 1 });
    for (const p of nonRootPitches) {
      notes.push({ note: 12 * octave + p, vel: 16, ch: 2 });
    }
  }

  notes = notes.filter((x) => 0 <= x.note && x.note <= 127);

  // generate events
  const events: MidiEvent[] = [];
  for (const x of notes) {
    events.push({
      tickPos: 0,
      flags: { selected: false, muted: false, ccShape: 0 },
      channel: x.ch,
      noteon: { note: x.note, velocity: x.vel },
    });
  }
  for (const x of notes) {
    events.push({
      tickPos: endTick,
      flags: { selected: false, muted: false, ccShape: 0 },
      channel: x.ch,
      noteoff: { note: x.note, velocity: x.vel },
    });
  }

  return events;
}
