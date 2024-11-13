import { inspect } from "./inspect";
import { assertUnreachable, log } from "./utils";

/**
 * See documentation for `reaper.MIDI_GetAllEvts`
 * 1. offset from previous event
 * 2. "flag"
 * 2. MIDI message
 */
function parseEvent(
  buf: string,
  pos: number,
): [number, number, string, number] {
  const [offset, flags, msg, newPos] = string.unpack("i4Bs4", buf, pos);

  return [offset, flags, msg, newPos];
}

enum CCShape {
  // None = 0,
  Linear = 0b0001,
  SlowStartEnd = 0b0010,
  FastStart = 0b0011,
  FastEnd = 0b0100,
  Bezier = 0b0101,
}

type MidiEvent = {
  tickPos: number;
  flags: { selected: boolean; muted: boolean; ccShape: CCShape };
} & (
  | ({ channel: number } & (
      | { noteoff: { note: number; velocity: number } }
      | { noteon: { note: number; velocity: number } }
      | { midi: [number, number, number] }
    ))
  | { bezier: string }
);

export function parseBuf(buf: string) {
  let bufPos = 1; // index from 1
  const bufLength = buf.length;

  let tickPos = 0; // MIDI PPQ position of current event

  const result: MidiEvent[] = [];

  while (bufPos <= bufLength) {
    const [offset, flags, rawMsg, newBufPos] = parseEvent(buf, bufPos);
    bufPos = newBufPos;
    tickPos += offset;

    // parse flags
    const selected = (flags & 1) !== 0;
    const muted = (flags & 2) !== 0;
    const ccShape: CCShape = flags >>> 4; // may be 0

    // parse msg
    if (rawMsg.length === 3) {
      // is normal MIDI event
      const kind = string.byte(rawMsg, 1) >>> 4;
      const channel = string.byte(rawMsg, 1) & 0b1111;
      const data1 = string.byte(rawMsg, 2);
      const data2 = string.byte(rawMsg, 3);

      if (kind === 8) {
        // note off
        result.push({
          tickPos,
          flags: { selected, muted, ccShape },
          channel,
          noteoff: {
            note: data1,
            velocity: data2,
          },
        });
      } else if (kind === 9) {
        // note on
        result.push({
          tickPos,
          flags: { selected, muted, ccShape },
          channel,
          noteon: {
            note: data1,
            velocity: data2,
          },
        });
      } else {
        result.push({
          tickPos,
          flags: { selected, muted, ccShape },
          channel,
          midi: [kind, data1, data2],
        });
      }
    } else if (rawMsg.length === 0) {
      // is MIDI continuation event, for notes that are too long and if the tick offset doesn't fit in 1 byte
      // do nothing, don't append to midi event list
    } else {
      // must be reaper's bezier CCBZ event
      const correctHeader =
        string.byte(rawMsg, 1) === 0xff &&
        string.byte(rawMsg, 2) === 0x0f &&
        rawMsg.slice(2, 7) === "CCBZ ";
      if (!correctHeader)
        throw new Error(`Unexpected event: ${inspect(rawMsg)}`);

      const bezierData = rawMsg.slice(7, 12);
      assert(bezierData.length === 5);

      result.push({
        tickPos,
        flags: { selected, muted, ccShape },
        bezier: bezierData,
      });
    }
  }

  return result;
}

export function serialiseBuf(events: MidiEvent[]) {
  // sort events to be ascending in time
  events = events.toSorted((a, b) => a.tickPos - b.tickPos);

  const buf: string[] = [];
  let prevTickPos = 0;

  for (const evt of events) {
    let tickOffset = evt.tickPos - prevTickPos;
    prevTickPos = evt.tickPos;

    const flag =
      (evt.flags.ccShape << 4) |
      (evt.flags.selected ? 1 : 0) |
      (evt.flags.muted ? 2 : 0);

    // if event is offset too far (can't fit in a signed 32-bit integer), add null events
    while (tickOffset > 0x7fffffff) {
      tickOffset -= 0x7fffffff;
      buf.push(string.pack("i4Bs4", 0x7fffffff, 0, ""));
    }

    if ("bezier" in evt) {
      // is reaper bezier event
      buf.push(string.pack("i4Bs4", tickOffset, flag, evt.bezier));
    } else {
      // is midi event
      if ("noteon" in evt) {
        const header = evt.channel | 0x90;
        buf.push(
          string.pack(
            "i4Bi4BBB",
            tickOffset,
            flag,
            3,
            header,
            evt.noteon.note,
            evt.noteon.velocity,
          ),
        );
      } else if ("noteoff" in evt) {
        const header = evt.channel | 0x80;
        buf.push(
          string.pack(
            "i4Bi4BBB",
            tickOffset,
            flag,
            3,
            header,
            evt.noteoff.note,
            evt.noteoff.velocity,
          ),
        );
      } else if ("midi" in evt) {
        buf.push(
          string.pack(
            "i4Bi4BBB",
            tickOffset,
            flag,
            3,
            evt.midi[0],
            evt.midi[1],
            evt.midi[2],
          ),
        );
      } else {
        assertUnreachable(evt);
      }
    }
  }

  return table.concat(buf);
}
