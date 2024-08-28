import { inspect } from "./inspect";

export function ensureAPI(source: string, functionName: string) {
  if (reaper.APIExists(functionName)) return;

  const msg = `${source} is required for this script to work! (missing function: ${functionName})`;
  msgBox("Missing extensions", msg);
  error(msg);
}

export function log(...args: any[]) {
  for (let i = 0; i < args.length; i++) {
    if (i !== 0) {
      reaper.ShowConsoleMsg("\t");
    }

    let msg = args[i];

    if (typeof msg !== "string") {
      msg = inspect(msg);
    }

    if (msg === "") {
      // do nothing, just print the newline below
    } else {
      reaper.ShowConsoleMsg(msg);
    }
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

export function deferAsync() {
  return new Promise((resolve) => reaper.defer(() => resolve(undefined)));
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

  let desc;
  let flags;
  let error = null;
  try {
    const config = func();
    desc = config.desc;
    flags = config.flags;
  } catch (e) {
    desc = "";
    flags = -1;
    error = e;
  }

  reaper.PreventUIRefresh(-1);
  reaper.Undo_EndBlock2(0, desc, flags);

  if (error !== null) throw error;
}

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

export function errorHandler(func: () => void | Promise<void>) {
  function stringOrInspect(obj: unknown): string {
    if (typeof obj === "string") {
      return obj;
    } else {
      return inspect(obj);
    }
  }

  try {
    const rv = func();
    if (rv) {
      rv.catch((e) => {
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
      });
    }
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

export function readFile(path: string) {
  const [f, err] = io.open(path, "rb");
  if (f === undefined) throw new Error(err);
  const content = f.read("*all" as any);
  f.close();
  if (typeof content !== "string")
    throw new Error("file read returned nonstring value");
  return content;
}

export function writeFile(path: string, text: string) {
  const [f, err] = io.open(path, "w");
  if (f === undefined) throw new Error(err);
  f.write(text);
  f.close();
}
