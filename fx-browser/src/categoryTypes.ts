/** Minimal identity of an FX: its REAPER ident string plus its FXFolderItemType. */
export type FxInfo = { ident: string; type: number };

/** Returns a stable unique key for an FX, combining its type and ident. */
export function fxUid(fx: FxInfo): string {
  return `${fx.type}\n${fx.ident}`;
}

/** Parsed "Prefix: Name" info for an installed FX, as reported by REAPER. */
export type InstalledFxNameInfo = { prefix: string | null; name: string };

/**
 * A single FX folder, referenced by its folder id and display name (already
 * split from its category prefix - see splitFolderName).
 */
export type FolderRef = { id: string; name: string };

/** A named category grouping one or more FX folders. */
export type Category = { category: string; folders: FolderRef[] };

/** Fully resolved info for one FX known to fxfolders, keyed by fxUid(). */
export type FxEntry = {
  uid: string;
  ident: string;
  name: string;
  type: number;
  prefix: string | null;
  isInstrument: boolean | null;
};
