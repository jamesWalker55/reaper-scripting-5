/** @noSelfInFile **/

declare type Ini = Record<string, Record<string, string>>;

/**
 * Parse a given ini file to a table.
 * Returns `{null, (error message)}` if the input file is invalid
 * @param path path to the ini file
 * @param allowComments defaults to false
 */
export function parseIni(
  path: string,
  allowComments?: boolean,
): LuaMultiReturn<[Ini, null] | [null, string]>;
