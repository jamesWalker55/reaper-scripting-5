/** @noSelfInFile **/

export type Ini = Record<
  string,
  Record<string, string | undefined> | undefined
>;
export function load(path: string): Ini;
export function save(path: string, data: Ini): void;
