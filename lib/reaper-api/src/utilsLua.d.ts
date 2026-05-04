/** @noSelfInFile **/

export function split(text: string, separator: string): string[];

/**
 * robust method to split by lines, this handles both "\n" and "\r\n" sequences
 */
export function splitlines(text: string): string[];

export function strip(text: string): string;
