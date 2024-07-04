/** @noSelfInFile **/

export const _version: string;

export type Level = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export let level: Level;
export let outfile: string;
export let usecolor: boolean;

export function trace(...x: any[]): void;
export function debug(...x: any[]): void;
export function info(...x: any[]): void;
export function warn(...x: any[]): void;
export function error(...x: any[]): void;
export function fatal(...x: any[]): void;
