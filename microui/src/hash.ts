import * as json from "./json";

// 32bit fnv-1a hash
export const HASH_INITIAL = 2166136261;

export function hashString(h: number, data: string): number {
  for (let i = 0; i < data.length; i++) {
    const byte = string.byte(data, i + 1);
    h = (h ^ byte) * 16777619;
  }
  return h;
}

/**
 * Generate a consistent hash based on an initial ID and some data.
 * The same ID-data pair should return the same hash.
 *
 * https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 */
export function hashObject(h: number, data: any): number {
  return hashString(h, json.encode(data));
}
