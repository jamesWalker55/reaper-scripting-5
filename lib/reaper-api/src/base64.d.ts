/** @noSelfInFile **/

declare class Encoder {}
declare class Decoder {}

/**
 * Encodes `str` string using `encoder` table. By default uses table with `+` as
 * char for 62, `/` as char for 63 and `=` as padding char. You can specify custom
 * encoder. For this you could use `base64.makeencoder`. If you are encoding large
 * chunks of text (or another highly redundant data) it's possible to highly
 * increase performace (for text approx. x2 gain) by using `usecache = true`. For
 * binary data like images using cache decreasing performance.
 */
export function encode(
  str: string,
  encoder?: Encoder,
  usecache?: boolean,
): string;

/**
 * Decodes `str` string using `decoder` table. Default decoder uses same chars as
 * default encoder.
 */
export function decode(
  str: string,
  decoder?: Decoder,
  usecache?: boolean,
): string;

/** Make custom encoding table */
export function makeencoder(s62: string, s63: string, spad: string): Encoder;

/** Make custom decoding table */
export function makedecoder(s62: string, s63: string, spad: string): Decoder;
