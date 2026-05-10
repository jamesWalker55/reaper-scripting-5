import { encode } from "reaper-api/json";
import {
  cloneKey,
  Key,
  keyChangeModeKeepNotes,
  Mode,
  ModeAlt,
  ScaleNote,
  wrapPitch,
} from "./types";
import { walkCircle } from "./circle";

type Span = { buf: string; offset: number; length: number };
type Result<T> =
  | { ok: T; i: Span }
  | {
      /** Recoverable error */
      err: true;
    }
  | {
      /** Unrecoverable error */
      failure: string;
    };

const Span = {
  get({ buf, offset, length }: Span): string {
    return buf.slice(offset, offset + length);
  },
  split({ buf, offset, length }: Span, chars: number): [Span, Span] {
    if (chars < 0) throw new Error("negative chars in split()");

    chars = math.min(chars, length);
    const left: Span = { buf, offset, length: chars };
    const right: Span = { buf, offset: offset + chars, length: length - chars };
    return [left, right] as const;
  },
  consume({ buf, offset, length }: Span, chars: number): Span {
    if (chars < 0) throw new Error("negative chars in consume()");

    const newLength = length - chars;
    if (newLength < 0)
      throw new Error(
        `attempted to consume ${chars} chars in span: ${encode(buf)} offset=${offset} length=${length}`,
      );
    return { buf, offset: offset + chars, length: length - chars };
  },
  startsWith({ buf, offset, length }: Span, text: string): boolean {
    return buf.slice(offset, offset + text.length) === text;
  },
  startsWithIgnoreCase({ buf, offset, length }: Span, text: string): boolean {
    return (
      buf.slice(offset, offset + text.length).toLowerCase() ===
      text.toLowerCase()
    );
  },
};

function many0<T>(parser: (i: Span) => Result<T>): (i: Span) => Result<T[]> {
  return (i: Span) => {
    const results = [];
    while (true) {
      const res = parser(i);
      if ("ok" in res) {
        results.push(res.ok);
        i = res.i;
      } else if ("err" in res) {
        return { ok: results, i };
      } else {
        return res;
      }
    }
  };
}

function many1<T>(parser: (i: Span) => Result<T>): (i: Span) => Result<T[]> {
  return (i: Span) => {
    const results = [];
    while (true) {
      const res = parser(i);
      if ("ok" in res) {
        results.push(res.ok);
        i = res.i;
      } else if ("err" in res) {
        if (results.length === 0) return { err: true };
        return { ok: results, i };
      } else {
        return res;
      }
    }
  };
}

function preceded<T>(
  first: (i: Span) => Result<any>,
  second: (i: Span) => Result<T>,
): (i: Span) => Result<T> {
  return (i: Span) => {
    const res1 = first(i);
    if (!("ok" in res1)) return res1;

    const res2 = second(res1.i);
    if (!("ok" in res2)) return res2;

    return res2;
  };
}

function opt<T extends AnyNotNil>(
  parser: (i: Span) => Result<T>,
  def: T,
): (i: Span) => Result<T> {
  return (i: Span) => {
    const res = parser(i);
    if ("err" in res) {
      return { ok: def, i };
    } else {
      return res;
    }
  };
}

function map<Input, Output>(
  parser: (i: Span) => Result<Input>,
  mapper: (x: Input) => Output,
): (i: Span) => Result<Output> {
  return (i: Span) => {
    const res = parser(i);
    if ("ok" in res) {
      return { ok: mapper(res.ok), i: res.i };
    } else {
      return res;
    }
  };
}

function alt<T>(
  ...parsers: ((i: Span) => Result<T>)[]
): (i: Span) => Result<T> {
  return (i: Span) => {
    for (const p of parsers) {
      const res = p(i);
      if ("err" in res) {
        continue;
      } else {
        return res;
      }
    }
    return { err: true };
  };
}

function cut<T>(
  parser: (i: Span) => Result<T>,
  msg: string,
): (i: Span) => Result<T> {
  return (i: Span) => {
    const res = parser(i);
    if ("err" in res) {
      return { failure: msg };
    } else {
      return res;
    }
  };
}

function finalize<T>(res: Result<T>): { ok: T } | { err: string } {
  if ("ok" in res) {
    if (res.i.length !== 0) {
      // input not fully consumed, treat this as error
      return {
        err: `unknown text: ${encode(Span.get(res.i))}`,
      };
    }
    return { ok: res.ok };
  } else if ("err" in res) {
    return { err: "unhandled error" };
  } else if ("failure" in res) {
    return { err: res.failure };
  } else {
    res satisfies never;
    throw new Error("unreachable");
  }
}

function space1(i: Span): Result<Span> {
  const text = Span.get(i);
  const [result] = string.match(text, `^%s+`);
  if (result === undefined) {
    // no space found
    return { err: true };
  } else {
    // found space
    const [left, right] = Span.split(i, result.length);
    return { ok: left, i: right };
  }
}

function space0(i: Span): Result<Span> {
  const text = Span.get(i);
  const [result] = string.match(text, `^%s*`);
  if (result === undefined) {
    // should be unreachable, it must at least match an empty string
    return { ok: { buf: i.buf, offset: i.offset, length: 0 }, i };
  } else {
    // found space
    const [left, right] = Span.split(i, result.length);
    return { ok: left, i: right };
  }
}

function tag(expected: string): (i: Span) => Result<Span> {
  return (i: Span) => {
    const text = Span.get(i);
    if (text.startsWith(expected)) {
      const [left, right] = Span.split(i, expected.length);
      return { ok: left, i: right };
    } else {
      return { err: true };
    }
  };
}

/** Parse an integer with max length of 2 digits */
function shortinteger(i: Span): Result<number> {
  const first3chars = Span.get(Span.split(i, 2)[0]);
  const [result] = string.match(first3chars, `^%d+`);
  if (result === undefined) {
    // no number found
    return { err: true };
  } else {
    // found number, check it is not multidigit and starts with 0xx
    if (result.length > 1 && result.startsWith("0")) {
      return { err: true };
    }
    const parsed = parseInt(result);
    return { ok: parsed, i: Span.consume(i, result.length) };
  }
}

/** Parse a single letter (e.g. "D") as the scale, case sensitive */
function parsePitchLetter(i: Span): Result<Key> {
  let left;
  [left, i] = Span.split(i, 1);

  const rootName = Span.get(left);

  let root: number;
  let mode: Mode;
  if (rootName === "C") {
    root = 0;
    mode = Mode.Ionian;
  } else if (rootName === "D") {
    root = 2;
    mode = Mode.Ionian;
  } else if (rootName === "E") {
    root = 4;
    mode = Mode.Ionian;
  } else if (rootName === "F") {
    root = 5;
    mode = Mode.Ionian;
  } else if (rootName === "G") {
    root = 7;
    mode = Mode.Ionian;
  } else if (rootName === "A") {
    root = 9;
    mode = Mode.Ionian;
  } else if (rootName === "B") {
    root = 11;
    mode = Mode.Ionian;
  } else if (rootName === "c") {
    root = 0;
    mode = Mode.Aeolian;
  } else if (rootName === "d") {
    root = 2;
    mode = Mode.Aeolian;
  } else if (rootName === "e") {
    root = 4;
    mode = Mode.Aeolian;
  } else if (rootName === "f") {
    root = 5;
    mode = Mode.Aeolian;
  } else if (rootName === "g") {
    root = 7;
    mode = Mode.Aeolian;
  } else if (rootName === "a") {
    root = 9;
    mode = Mode.Aeolian;
  } else if (rootName === "b") {
    root = 11;
    mode = Mode.Aeolian;
  } else {
    return { err: true };
  }
  return { ok: { tonic: root, mode }, i };
}

/** Parse `#` or `b`. Returns `true` sharp, `false` flat. */
function parseSharpFlat(i: Span): Result<boolean> {
  if (i.length === 0) {
    return { err: true };
  }

  let left;
  [left, i] = Span.split(i, 1);
  const char = Span.get(left);

  if (char === "#") {
    return { ok: true, i };
  } else if (char === "b") {
    return { ok: false, i };
  } else {
    return { err: true };
  }
}

/** Parse multiple `#`s or `b`s. Returns +1 sharp, -1 flat. */
function parseSharpFlatChain(i: Span): Result<number> {
  let res;

  res = parseSharpFlat(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const isSharp = res.ok;

  const firstChar = isSharp ? "#" : "b";

  res = many0(tag(firstChar))(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const extraCount = res.ok.length;

  if (isSharp) {
    return { ok: extraCount + 1, i };
  } else {
    return { ok: -extraCount - 1, i };
  }
}

/** Parse `m` or `M`. Returns `true` major, `false` minor. */
function parseModeLetter(i: Span): Result<Mode.Ionian | Mode.Aeolian> {
  let left;
  [left, i] = Span.split(i, 1);
  const letter = Span.get(left);

  if (letter === "m") {
    return { ok: Mode.Aeolian, i };
  } else if (letter === "M") {
    return { ok: Mode.Ionian, i };
  } else {
    return { err: true };
  }
}

/** Parse `major` or `ionian` */
function parseModeName(i: Span): Result<Mode> {
  if (Span.startsWithIgnoreCase(i, "major")) {
    return { ok: Mode.Ionian, i: Span.consume(i, "major".length) };
  } else if (Span.startsWithIgnoreCase(i, "minor")) {
    return { ok: Mode.Aeolian, i: Span.consume(i, "minor".length) };
  } else if (Span.startsWithIgnoreCase(i, "ionian")) {
    return { ok: Mode.Ionian, i: Span.consume(i, "ionian".length) };
  } else if (Span.startsWithIgnoreCase(i, "dorian")) {
    return { ok: Mode.Dorian, i: Span.consume(i, "dorian".length) };
  } else if (Span.startsWithIgnoreCase(i, "phrygian")) {
    return { ok: Mode.Phrygian, i: Span.consume(i, "phrygian".length) };
  } else if (Span.startsWithIgnoreCase(i, "lydian")) {
    return { ok: Mode.Lydian, i: Span.consume(i, "lydian".length) };
  } else if (Span.startsWithIgnoreCase(i, "mixolydian")) {
    return { ok: Mode.Mixolydian, i: Span.consume(i, "mixolydian".length) };
  } else if (Span.startsWithIgnoreCase(i, "aeolian")) {
    return { ok: Mode.Aeolian, i: Span.consume(i, "aeolian".length) };
  } else if (Span.startsWithIgnoreCase(i, "locrian")) {
    return { ok: Mode.Locrian, i: Span.consume(i, "locrian".length) };
  } else {
    return { err: true };
  }
}

/** Parse `maj` or `ion` */
function parseModeShortName(i: Span): Result<Mode> {
  let left;
  [left, i] = Span.split(i, 3);
  const name = Span.get(left).toLowerCase();

  if (name === "maj") {
    return { ok: Mode.Ionian, i };
  } else if (name === "min") {
    return { ok: Mode.Aeolian, i };
  } else if (name === "ion") {
    return { ok: Mode.Ionian, i };
  } else if (name === "dor") {
    return { ok: Mode.Dorian, i };
  } else if (name === "phr") {
    return { ok: Mode.Phrygian, i };
  } else if (name === "lyd") {
    return { ok: Mode.Lydian, i };
  } else if (name === "mix") {
    return { ok: Mode.Mixolydian, i };
  } else if (name === "aeo") {
    return { ok: Mode.Aeolian, i };
  } else if (name === "loc") {
    return { ok: Mode.Locrian, i };
  } else {
    return { err: true };
  }
}

/** Parse `7` in `lydian b7` into 6, limited to 0..7 (index from 0) */
function parseNoteNumber(i: Span): Result<ScaleNote> {
  let res;

  res = shortinteger(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const val = res.ok;

  if ([1, 2, 3, 4, 5, 6, 7].includes(val)) {
    return { ok: (val - 1) as ScaleNote, i };
  } else {
    return { err: true };
  }
}

/** Parse `b7` in `lydian b7` */
function parseModeAltTerm(i: Span): Result<{ note: ScaleNote; amt: number }> {
  let res;

  res = parseSharpFlatChain(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const altAmount = res.ok;

  res = parseNoteNumber(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const scaleNote = res.ok;

  return { ok: { note: scaleNote, amt: altAmount }, i };
}

/** Parse multiple `b7`s in `lydian b7` */
function parseModeAlt(i: Span): Result<ModeAlt> {
  let res;

  const result: ModeAlt = {};

  res = parseModeAltTerm(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const firstTerm = res.ok;

  result[firstTerm.note] = firstTerm.amt;

  while (true) {
    res = preceded(space1, parseModeAltTerm)(i);
    if ("err" in res) return { ok: result, i };
    if (!("ok" in res)) return res;
    i = res.i;
    const term = res.ok;

    result[term.note] = term.amt;
  }
}

/** parse `C#m` or `C# lydian b7` */
function parseKeyInternal(i: Span): Result<Key> {
  let res;

  // parse the initial root name "C"
  res = cut(parsePitchLetter, "expected note name")(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const key = res.ok;

  // parse any sharp or flats "#"
  res = opt(parseSharpFlatChain, 0)(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const rootAdjust = res.ok;

  // shift the tonic based on the sharp/flat
  key.tonic = wrapPitch(key.tonic + rootAdjust);

  // parse the "m" immediately after if any
  res = opt<Mode | "none">(alt(parseModeShortName, parseModeLetter), "none")(i);
  if (!("ok" in res)) return res;
  i = res.i;
  let explicitMode: Mode | null = res.ok === "none" ? null : res.ok;

  // mode is not specified explicitly yet, try to parse a whole keyword " lydian"
  if (!explicitMode) {
    res = opt<Mode | "none">(
      preceded(space1, alt(parseModeName, parseModeShortName, parseModeLetter)),
      "none",
    )(i);
    if (!("ok" in res)) return res;
    i = res.i;
    explicitMode = res.ok === "none" ? null : res.ok;
  }

  // assign the mode if set
  if (explicitMode !== null) {
    key.mode = explicitMode;
  }

  // parse any tweaks to the scale " b7"
  res = opt<ModeAlt | "none">(preceded(space1, parseModeAlt), "none")(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const modeAlt: ModeAlt | null = res.ok === "none" ? null : res.ok;

  if (modeAlt !== null) {
    key.alt = modeAlt;
  }

  return { ok: key, i };
}

export function parseKey(text: string): { ok: Key } | { err: string } {
  text = text.trim();
  const span: Span = { buf: text, offset: 0, length: text.length };
  return finalize(parseKeyInternal(span));
}

/** Parse a transpose `+1`, `-3` */
function parseShift(i: Span): Result<number> {
  let res, left;

  [left, i] = Span.split(i, 1);

  const firstChar = Span.get(left);
  const isPositive =
    firstChar === "+" ? true : firstChar === "-" ? false : null;
  if (isPositive === null) return { err: true };

  res = cut(shortinteger, "expected an integer")(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const amount = res.ok;

  return { ok: isPositive ? amount : -amount, i };
}

/** Parse a circle step `>1`, `<3` */
function parseStep(i: Span): Result<number> {
  let res, left;

  [left, i] = Span.split(i, 1);

  const firstChar = Span.get(left);
  const isPositive =
    firstChar === ">" ? true : firstChar === "<" ? false : null;
  if (isPositive === null) return { err: true };

  res = cut(shortinteger, "expected an integer")(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const amount = res.ok;

  return { ok: isPositive ? amount : -amount, i };
}

/** Parse a circle step `>1lyd`, `<3 minor` */
function parseStepWithMode(
  i: Span,
): Result<{ steps: number; mode: Mode | null }> {
  let res, left;

  res = parseStep(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const steps = res.ok;

  res = opt<Mode | "none">(
    preceded(space0, alt(parseModeName, parseModeShortName, parseModeLetter)),
    "none",
  )(i);
  if (!("ok" in res)) return res;
  i = res.i;
  const mode = res.ok === "none" ? null : res.ok;

  return { ok: { steps, mode }, i };
}

export function parseKeyOrTranspose(
  text: string,
  prevKey: Key,
): { ok: Key } | { err: string } {
  text = text.trim();
  const span: Span = { buf: text, offset: 0, length: text.length };

  // transpose key
  const shift = parseShift(span);
  if ("ok" in shift) {
    const checkAllConsumed = finalize(shift);
    if ("err" in checkAllConsumed) return { err: checkAllConsumed.err };

    const rv = cloneKey(prevKey);
    rv.tonic = wrapPitch(rv.tonic + shift.ok);
    return { ok: rv };
  } else if ("failure" in shift) {
    return { err: shift.failure };
  }

  // step in circle of fifths
  const step = parseStepWithMode(span);
  if ("ok" in step) {
    const checkAllConsumed = finalize(step);
    if ("err" in checkAllConsumed) return { err: checkAllConsumed.err };

    let rv = walkCircle(prevKey, step.ok.steps);
    if (step.ok.mode !== null) rv = keyChangeModeKeepNotes(rv, step.ok.mode);
    return { ok: rv };
  } else if ("failure" in step) {
    return { err: step.failure };
  }

  return finalize(parseKeyInternal(span));
}
