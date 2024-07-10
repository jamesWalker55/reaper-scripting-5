/** @noSelfInFile **/

/**
 * Parse a given ini file to a table.
 * Returns `{null, (error message)}` if the input file is invalid
 * @param path path to the ini file
 * @param allowComments defaults to false
 */
export function parseIni(
  path: string,
  allowComments?: boolean,
):
  | Record<string, Record<string, string | undefined> | undefined>
  | LuaMultiReturn<[null, string]>;
