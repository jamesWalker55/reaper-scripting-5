import { inspect } from "./inspect";

export function ensureAPI(source: string, functionName: string) {
  if (reaper.APIExists(functionName)) return;

  const msg = `${source} is required for this script to work! (missing function: ${functionName})`;
  msgBox("Missing extensions", msg);
  error(msg);
}

export function log(msg: any) {
  if (typeof msg !== "string") {
    msg = inspect(msg);
  }

  if (msg === "") {
    // do nothing, just print the newline below
  } else {
    reaper.ShowConsoleMsg(msg);
  }

  reaper.ShowConsoleMsg("\n");
}

export function clearConsole() {
  reaper.ShowConsoleMsg("");
}

export function deferLoop(func: (stop: () => void) => void) {
  let shouldStop = false;
  function stop() {
    shouldStop = true;
  }

  function inner(this: void) {
    func(stop);

    if (shouldStop) return;

    reaper.defer(inner);
  }
  inner();
}

export function msgBox(title: string, msg: string) {
  return reaper.ShowMessageBox(msg, title, 0);
}

/**
 * flags: (from https://forum.cockos.com/showthread.php?t=185118)
 * ```plain
 * -1: All undo info
 * 0: ???? When only calling actions via OnCommand, since these create their own undo points
 * 1: track configurations (track/master vol/pan/routing, ALL envelopes (master included))
 * 2: track/master FX
 * 4: track items
 * 8: project states (loop selection, markers, regions)
 * 16: freeze states
 * ```
 */
export function undoBlock(func: () => { desc: string; flags: number }) {
  reaper.Undo_BeginBlock2(0);
  reaper.PreventUIRefresh(1);
  const config = func();
  reaper.PreventUIRefresh(-1);
  reaper.Undo_EndBlock2(0, config.desc, config.flags);
}

/**
 * return a path relative to the current Reaper data folder. Example:
 * ```
 * absPath("reaper-fxfolders.ini")
 * // C:\Users\Bob\AppData\Roaming\REAPER\reaper-fxfolders.ini
 * ```
 * @param relPath
 */
export function absPath(relPath?: string) {
  if (relPath?.length === 0) relPath = undefined;

  const reaperIniPath = reaper.get_ini_file();
  // assume base dir is parent directory of ini path
  const reaperBaseDir = string.match(reaperIniPath, `^(.+[\\/])`)[0];
  return `${reaperBaseDir}${relPath}`;
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export function errorHandler(func: () => void) {
  function stringOrInspect(obj: unknown): string {
    if (typeof obj === "string") {
      return obj;
    } else {
      return inspect(obj);
    }
  }

  try {
    func();
  } catch (e) {
    let name = "error";
    let msg: string | null = null;
    let stack: string | null = null;
    if (typeof e === "object" && e !== null) {
      if ("message" in e) msg = stringOrInspect(e.message);
      if ("name" in e) name = stringOrInspect(e.name);
      if ("stack" in e) stack = stringOrInspect(e.stack);
    } else {
      msg = stringOrInspect(e);
    }

    if (msg === null) {
      log(`error: ${name}`);
    } else {
      log(`${name}: ${msg}`);
    }

    if (stack !== null) {
      log(stack);
    }

    if (msg === null) {
      error(`error: ${name}`);
    } else {
      error(`${name}: ${msg}`);
    }
  }
}
