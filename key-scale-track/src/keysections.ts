import { Key, parseKey } from "./key";
import { parseKeyOrTranspose } from "./key/parse";

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
