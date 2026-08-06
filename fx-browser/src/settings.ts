import { get, set } from "reaper-api/extstate";
import * as JSON from "reaper-api/json";

function createSettings<T extends Record<string, unknown>>(
  section: string,
  defaults: T,
) {
  return {
    get<K extends keyof T & string>(key: K): T[K] {
      const text = get(section, key);
      if (text === null) return defaults[key];

      const rv = JSON.decode(text);
      return rv as T[K];
    },
    set<K extends keyof T & string>(key: K, val: T[K]) {
      set(section, key, JSON.encode(val), true);
    },
  };
}

export const SETTINGS = createSettings<{
  window_width: number;
  window_height: number;
  fxfolders_separator: string;
  fxfolders_favourite_folder: string;
  fxfolders_ignored_folders: string[];
  fxfolders_default_category: string;
}>("JW_FX_Browser", {
  window_width: 600,
  window_height: 702,
  fxfolders_separator: "\\",
  fxfolders_favourite_folder: "Favourites",
  fxfolders_ignored_folders: ["Ignored"],
  fxfolders_default_category: "Default",
});
