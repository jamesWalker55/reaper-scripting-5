type Span = {
  source: string;
  start: number;
  end: number;
};

type Result<T = Span> =
  | {
      ok: true;
      out: T;
      rest: Span;
    }
  | { ok: false };

type Parser<T> = (i: Span) => Result<T>;

const Err = { ok: false } as const;

function clone(i: Span): Span {
  return {
    source: i.source,
    start: i.start,
    end: i.end,
  };
}

function alt<A, B>(...parsers: Parser<A | B>[]): Parser<A | B> {
  return (span) => {
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const result = parser(span);
      if (result.ok) return result;
    }
    return Err;
  };
}

function preceded<A, B>(a: Parser<A>, b: Parser<B>): Parser<B> {
  return (span) => {
    const lhs = a(span);
    if (!lhs.ok) return Err;
    span = lhs.rest;

    return b(span);
  };
}

function delimited<A, T, B>(
  parserA: Parser<A>,
  parserT: Parser<T>,
  parserB: Parser<B>,
): Parser<T> {
  return (rest) => {
    const lhs = parserA(rest);
    if (!lhs.ok) return Err;
    rest = lhs.rest;

    const mid = parserT(rest);
    if (!mid.ok) return Err;
    rest = mid.rest;

    const rhs = parserB(rest);
    if (!rhs.ok) return Err;
    rest = rhs.rest;

    return {
      ok: true,
      out: mid.out,
      rest,
    };
  };
}

function many0<T>(parser: Parser<T>): Parser<T[]> {
  return (span) => {
    const firstElement = parser(span);
    if (!firstElement.ok) return { ok: true, out: [], rest: span };
    const result: T[] = [firstElement.out];
    span = firstElement.rest;

    while (true) {
      const nextElement = parser(span);
      if (!nextElement.ok) return { ok: true, out: result, rest: span };
      result.push(nextElement.out);
      span = nextElement.rest;
    }
  };
}

function manyTill<A, B>(
  parserA: Parser<A>,
  parserB: Parser<B>,
): Parser<[A[], B]> {
  return (rest) => {
    const result: A[] = [];

    while (true) {
      const ending = parserB(rest);
      if (ending.ok) {
        rest = ending.rest;
        return { ok: true, out: [result, ending.out], rest };
      } else {
        const element = parserA(rest);
        if (!element.ok) return Err;
        result.push(element.out);
        rest = element.rest;
      }
    }
  };
}

export function space0(rest: Span): Result {
  const originalStart = rest.start;
  rest = clone(rest);

  while (rest.start < rest.end) {
    const stringChar = rest.source.charAt(rest.start);
    if (stringChar !== " " && stringChar !== "\t") {
      break;
    }
    rest.start += 1;
  }

  return {
    ok: true,
    out: {
      source: rest.source,
      start: originalStart,
      end: rest.start,
    },
    rest,
  };
}

export function space1(rest: Span): Result {
  const originalStart = rest.start;
  rest = clone(rest);

  while (rest.start < rest.end) {
    const stringChar = rest.source.charAt(rest.start);
    if (stringChar !== " " && stringChar !== "\t") {
      break;
    }
    rest.start += 1;
  }
  // must consume one char or fail
  if (rest.start === originalStart) return Err;

  return {
    ok: true,
    out: {
      source: rest.source,
      start: originalStart,
      end: rest.start,
    },
    rest,
  };
}

export function multispace0(rest: Span): Result {
  const originalStart = rest.start;
  rest = clone(rest);

  while (rest.start < rest.end) {
    const stringChar = rest.source.charAt(rest.start);
    if (
      stringChar !== " " &&
      stringChar !== "\t" &&
      stringChar !== "\r" &&
      stringChar !== "\n"
    ) {
      break;
    }
    rest.start += 1;
  }

  return {
    ok: true,
    out: {
      source: rest.source,
      start: originalStart,
      end: rest.start,
    },
    rest,
  };
}

/**
 * Matches '\n' or '\r\n'.
 * @param rest
 */
export function lineEnding(rest: Span): Result {
  const firstChar = rest.source.charAt(rest.start);
  if (firstChar === "\n") {
    return {
      ok: true,
      out: {
        source: rest.source,
        start: rest.start,
        end: rest.start + 1,
      },
      rest: {
        source: rest.source,
        start: rest.start + 1,
        end: rest.end,
      },
    };
  } else if (firstChar === "\r") {
    const secondChar = rest.source.charAt(rest.start + 1);
    if (secondChar === "\n") {
      return {
        ok: true,
        out: {
          source: rest.source,
          start: rest.start,
          end: rest.start + 2,
        },
        rest: {
          source: rest.source,
          start: rest.start + 2,
          end: rest.end,
        },
      };
    }
  }

  return { ok: false };
}

export function quotedString(rest: Span): Result {
  // one_of("\"'`")
  const quoteChar = rest.source.charAt(rest.start);
  if (!"\"'`".includes(quoteChar)) return Err;

  const originalStart = rest.start;
  rest = clone(rest);
  rest.start += 1;

  // take_till(|x| x == quote_char || x == '\n' || x == '\r')
  while (rest.start < rest.end) {
    const stringChar = rest.source.charAt(rest.start);
    if (
      stringChar === quoteChar ||
      stringChar === "\n" ||
      stringChar === "\r"
    ) {
      break;
    }
    rest.start += 1;
  }

  // char(quote_char)
  if (rest.source.charAt(rest.start) !== quoteChar) return Err;
  rest.start += 1;

  return {
    ok: true,
    out: {
      source: rest.source,
      start: originalStart,
      end: rest.start,
    },
    rest,
  };
}

export function unquotedString(rest: Span): Result {
  // none_of("\"'`")
  const quoteChar = rest.source.charAt(rest.start);
  if ("\"'`".includes(quoteChar)) return Err;

  const originalStart = rest.start;
  rest = clone(rest);

  // take_till1(|x| x == ' ' || x == '\n' || x == '\r')
  while (rest.start < rest.end) {
    const stringChar = rest.source.charAt(rest.start);
    if (stringChar === " " || stringChar === "\n" || stringChar === "\r") {
      break;
    }
    rest.start += 1;
  }
  // must consume one char or fail
  if (rest.start === originalStart) return Err;

  return {
    ok: true,
    out: {
      source: rest.source,
      start: originalStart,
      end: rest.start,
    },
    rest,
  };
}

export function parseString(rest: Span): Result {
  return alt(unquotedString, quotedString)(rest);
}

export function stringList(rest: Span): Result<Span[]> {
  const firstElement = parseString(rest);
  if (!firstElement.ok) return Err;
  const result = [firstElement.out];
  rest = firstElement.rest;

  while (true) {
    const nextElement = preceded(space1, parseString)(rest);
    if (!nextElement.ok) return { ok: true, out: result, rest: rest };
    result.push(nextElement.out);
    rest = nextElement.rest;
  }
}

export function elementStart(rest: Span): Result<null> {
  const firstChar = rest.source.charAt(rest.start);
  if (firstChar !== "<") return Err;
  rest = clone(rest);
  rest.start += 1;
  return { ok: true, out: null, rest };
}

export function elementEnd(rest: Span): Result<null> {
  const firstChar = rest.source.charAt(rest.start);
  if (firstChar !== ">") return Err;
  rest = clone(rest);
  rest.start += 1;
  return { ok: true, out: null, rest };
}

const elementTag = unquotedString;

export type Element<T> = {
  tag: T;
  attr: T[];
  children: (T[] | Element<T>)[];
};

export function element(rest: Span): Result<Element<Span>> {
  // line starts with '<TAG'
  const startChar = elementStart(rest);
  if (!startChar.ok) return Err;
  rest = startChar.rest;

  const tag = elementTag(rest);
  if (!tag.ok) return Err;
  rest = tag.rest;

  // rest of line is attr
  // (consumes newline)
  const attr = many0(preceded(space1, parseString))(rest);
  if (!attr.ok) return Err;
  rest = attr.rest;

  // tuple((space0, line_ending))
  {
    const space = space0(rest);
    if (!space.ok) return Err;
    rest = space.rest;

    const newline = lineEnding(rest);
    if (!newline.ok) return Err;
    rest = newline.rest;
  }

  const children = manyTill(
    delimited(
      space0,
      alt<Element<Span>, Span[]>(element, stringList),
      preceded(space0, lineEnding),
    ),
    preceded(space0, elementEnd),
  )(rest);
  if (!children.ok) return Err;
  rest = children.rest;

  const out: Element<Span> = {
    tag: tag.out,
    attr: attr.out,
    children: children.out[0],
  };

  return {
    ok: true,
    out,
    rest,
  };
}

function spanToString(x: Span): string {
  return x.source.slice(x.start, x.end);
}

function spanElementToStringElement(ele: Element<Span>): Element<string> {
  return {
    tag: spanToString(ele.tag),
    attr: ele.attr.map((x) => spanToString(x)),
    children: ele.children.map((child) => {
      if ("tag" in child) {
        return spanElementToStringElement(child);
      } else {
        return child.map((x) => spanToString(x));
      }
    }),
  };
}

export function parseElement(input: string): Element<string> {
  let rest: Span = { source: input, start: 0, end: input.length };
  const result = delimited(multispace0, element, multispace0)(rest);
  if (!result.ok) throw new Error("Failed to parse element");
  // handle all_consuming
  if (result.rest.start !== input.length)
    throw new Error("Trailing data at end of input");

  // convert element span to strings
  return spanElementToStringElement(result.out);
}

export function serialiseTerm(text: string): string {
  if (text.length === 0) {
    return '""';
  }

  // backticks are not allowed in .rpp files, they are always replaced with single quotes
  text = text.replaceAll("`", "'");

  const firstChar = text.charAt(0);
  let needsToBeQuoted = firstChar == "'" || firstChar == '"';

  let hasDblQuote = false;
  let hasSglQuote = false;
  for (const [x] of string.gmatch(text, ".")) {
    if (x === " ") {
      needsToBeQuoted = true;
    } else if (x === "'") {
      hasSglQuote = true;
    } else if (x === '"') {
      hasDblQuote = true;
    }
  }

  if (!needsToBeQuoted) {
    return text;
  }

  let quoteChar: string;
  if (hasDblQuote && hasSglQuote) {
    quoteChar = "`";
  } else if (hasDblQuote) {
    quoteChar = "'";
  } else {
    quoteChar = '"';
  }

  return `${quoteChar}${text}${quoteChar}`;
}

/// Serialise an element back to a [String] following the RPP format.
export function serializeToString(element: Element<string>): string {
  let buf: string[] = [];
  serializeToStringSub(buf, element, 0);
  return buf.join("");
}

function serializeToStringSub(
  buf: string[],
  element: Element<string>,
  indentLevel: number,
) {
  // first line
  for (let i = 0; i < indentLevel; i++) {
    buf.push("  ");
  }
  buf.push("<");
  buf.push(element.tag);
  for (const x of element.attr) {
    buf.push(" ");
    buf.push(serialiseTerm(x));
  }
  buf.push("\n");
  for (const child of element.children) {
    if ("tag" in child) {
      // element
      serializeToStringSub(buf, child, indentLevel + 1);
      buf.push("\n");
    } else {
      // string list
      for (let i = 0; i < indentLevel + 1; i++) {
        buf.push("  ");
      }
      let isFirst = true;
      for (let x of child) {
        x = serialiseTerm(x);
        if (isFirst) {
          isFirst = false;
        } else {
          buf.push(" ");
        }
        buf.push(x);
      }
      buf.push("\n");
    }
  }
  // last line
  for (let i = 0; i < indentLevel; i++) {
    buf.push("  ");
  }
  buf.push(">");
}
