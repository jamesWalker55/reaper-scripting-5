/** @noSelfInFile **/

export function splitext(p: string): LuaMultiReturn<[string, string]>;
export function splitdrive(path: string): LuaMultiReturn<[string, string]>;
export function join(p1: string, ...p2: string[]): string;
export function normpath(path: string): string;
export function split(p: string): LuaMultiReturn<[string, string]>;
export function isabs(path: string): boolean;
export function abspath(path: string): string;
export function normcase(s: string): string;
export function relpath(path: string, start: string): string;

// /** @noSelfInFile **/

// export const mod: {
//     path: {
//       splitext: (p: string) => LuaMultiReturn<[string, string]>;
//       splitdrive: (path: string) => LuaMultiReturn<[string, string]>;
//       join: (p1: string, ...p2: string[]) => string;
//       normpath: (path: string) => string;
//       split: (p: string) => LuaMultiReturn<[string, string]>;
//       isabs: (path: string) => boolean;
//       abspath: (path: string) => string;
//       normcase: (s: string) => string;
//       relpath: (path: string, start: string) => string;
//     };
//   };
