import { TypedSection } from "reaper-api/extstate";

const CONFIG = TypedSection("JW_FX_Browser", {
  window_width: "number",
  window_height: "number",
  fxfolders_separator: "string",
  fxfolders_favourite_folder: "string",
  fxfolders_ignored_folders: "json",
  fxfolders_default_category: "string",
});

export function get<T extends keyof typeof CONFIG>(
  key: T,
  def: NonNullable<(typeof CONFIG)[T]>,
): NonNullable<(typeof CONFIG)[T]> {
  const rv = CONFIG[key];
  if (rv === null) {
    CONFIG[key] = def;
    return def;
  } else {
    return rv;
  }
}

export function set<T extends keyof typeof CONFIG>(
  key: T,
  val: NonNullable<(typeof CONFIG)[T]>,
) {
  CONFIG[key] = val;
}

export function getIgnoredFolders(def: string[]): string[] {
  const val = CONFIG.fxfolders_ignored_folders as unknown;
  if (!Array.isArray(val)) {
    CONFIG.fxfolders_ignored_folders = def;
    return def;
  }
  const rv: string[] = [];
  let anyConverted = false;
  for (const x of val) {
    if (typeof x === "string") {
      rv.push(x);
    } else {
      anyConverted = true;
      rv.push(String(x));
    }
  }
  if (anyConverted) {
    CONFIG.fxfolders_ignored_folders = rv;
  }
  return rv;
}
export function setIgnoredFolders(val: string[]) {
  CONFIG.fxfolders_ignored_folders = val;
}
