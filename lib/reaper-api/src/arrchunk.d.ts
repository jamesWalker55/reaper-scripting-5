/** @noSelfInFile **/

export type ArrChunk = (string | ArrChunk)[];

export function fromChunk(chunk: string): ArrChunk;
export function toChunk(array: ArrChunk): string;
export function _testChunk(chunk: string): boolean;
export function _tagLines(array: ArrChunk): ArrChunk;
