import * as win from "./win";

const OS = reaper.GetOS();

function isWindows() {
  return OS.toLowerCase().startsWith("win");
}

export type FXTarget =
  | {
      target: "track";
      track: MediaTrack;
      fxpath: { path: number[]; flags: number };
    }
  | {
      target: "take";
      track: MediaTrack;
      item: MediaItem;
      take: MediaItem_Take;
      fxpath: { path: number[]; flags: number };
    };

export function getFXTarget(): FXTarget | null {
  if (isWindows()) {
    return win.getFXTarget();
  }

  // fallback implementation
  // just insert to the last focused track
  const track = reaper.GetLastTouchedTrack();
  if (!track) return null;

  return {
    target: "track",
    track,
    fxpath: {
      path: [],
      flags: 0,
    },
  };
}
