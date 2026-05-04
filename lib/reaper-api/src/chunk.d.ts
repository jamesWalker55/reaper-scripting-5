/** @noSelfInFile **/

/** get/set state chunk for a track. argument `chunk` is optional */
export function track(track: MediaTrack): string;
export function track(track: MediaTrack, chunk: string): void;

/** get/set state chunk for a item. argument `chunk` is optional */
export function item(item: MediaItem): string;
export function item(item: MediaItem, chunk: string): void;

/** get/set state chunk for an envelope. argument `chunk` is optional */
export function envelope(envelope: TrackEnvelope): string;
export function envelope(envelope: TrackEnvelope, chunk: string): void;

/** escape a string to be used in a state chunk */
export function escape_string(name: string): string;

/**
 * find the next element with the given tag, return the character position in the chunk
 * `tag` can be an array of tags to match
 */
export function findElement(
  chunk: string,
  tag: string | string[],
  search_pos?: number,
): number | null;

/**
 * this splits a text like:
 * ```plain
 * VST "VSTi: IL Harmor (Image-Line)" "IL Harmor.dll" 0 `d " s ' b '` 1229483375<56535449486D6F696C206861726D6F72> ""
 * ```
 * this assumes the first item doesn't start with a quote
 */
export function splitLine(
  line: string,
): LuaMultiReturn<[string[]] | [null, string]>;

/** remove quotes from a string if it exists, return as-is if no quotes found */
export function removeStringQuotes(text: string): string;
