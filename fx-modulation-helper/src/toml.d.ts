/** @noSelfInFile **/

/** denotes the current supported TOML version */
export const version = 0.4;

/**
 * sets whether the parser should follow the TOML spec strictly
 *
 * currently, no errors are thrown for the following rules if strictness is turned off:
 *
 * - tables having mixed keys
 * - redefining a table
 * - redefining a key within a table
 */
export const strict = true;

/** converts TOML data into a lua table */
export function parse(toml: string, options?: { strict?: boolean }): object;

export function encode(tbl: object): string;
