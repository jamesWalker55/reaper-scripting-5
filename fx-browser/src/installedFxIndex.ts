import { loadInstalledFX } from "reaper-api/installedFx";
import { InstalledFxNameInfo } from "./categoryTypes";

/**
 * Builds a map from FX ident to its parsed display info.
 *
 * REAPER reports installed FX display names either as a bare name, or as
 * "Prefix: Name" (e.g. "VSTi: Serum"). This splits the prefix off so it can
 * be used separately (e.g. to detect instruments, or show an FX type badge).
 */
export function buildInstalledFxIndex(
  installedFx: ReturnType<typeof loadInstalledFX>,
): Record<string, InstalledFxNameInfo | undefined> {
  const index: Record<string, InstalledFxNameInfo | undefined> = {};

  for (const fx of installedFx) {
    const colonIndex = fx.displayName.indexOf(": ");
    if (colonIndex === -1) {
      index[fx.ident] = {
        name: fx.displayName,
        prefix: null,
      };
    } else {
      index[fx.ident] = {
        name: fx.displayName.slice(colonIndex + 2, fx.displayName.length),
        prefix: fx.displayName.slice(0, colonIndex),
      };
    }
  }

  return index;
}
