import { inspect } from "./inspect";
import * as path from "./path/path";

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

export function deferLoop(
  func: (stop: () => void) => void,
  cleanup?: () => void,
) {
  let shouldStop = false;
  function stop() {
    shouldStop = true;
  }

  function inner(this: void) {
    try {
      errorHandler(() => func(stop));
    } catch (e) {
      // errorHandler should handle the error and log to console
      // al we need to do is stop the script, so `return`
      return;
    }

    if (shouldStop) {
      if (cleanup !== undefined) {
        try {
          errorHandler(() => cleanup());
        } catch (e) {
          // errorHandler should handle the error and log to console
          // al we need to do is stop the script, so `return`
          return;
        }
      }
      return;
    }

    reaper.defer(inner);
  }
  inner();
}

export function deferAsync(): Promise<void> {
  return new Promise((resolve) => reaper.defer(() => resolve(undefined)));
}

export function msgBox(title: string, msg: string) {
  reaper.ShowMessageBox(msg, title, 0);
}

export function confirmBox(title: string, msg: string) {
  const rv = reaper.ShowMessageBox(msg, title, 4);
  return rv === 6;
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
export function undoBlock(
  desc: string,
  flags: number,
  func: () => { desc?: string; flags?: number } | void,
) {
  reaper.Undo_BeginBlock2(0);
  reaper.PreventUIRefresh(1);

  let error = null;
  try {
    const config = func();
    if (config && config.desc !== undefined) {
      desc = config.desc;
    }
    if (config && config.flags !== undefined) {
      flags = config.flags;
    }
  } catch (e) {
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

export function getReaperVersion() {
  const match = string.match(reaper.GetAppVersion(), "^(%d+).(%d+)");
  if (match.length === 0) return null;

  const [major, minor] = match;
  return { major: parseInt(major), minor: parseInt(minor) };
}

export function getReaperDataFile(filename?: string) {
  const parentDir = reaper.GetResourcePath();
  if (filename) {
    return path.normpath(path.join(parentDir, filename));
  } else {
    return path.normpath(parentDir);
  }
}

export function runMainAction(action: number | string, project?: ReaProject) {
  if (typeof action === "string") action = reaper.NamedCommandLookup(action);

  reaper.Main_OnCommandEx(action, 0, project || 0);
}

export function runMidiAction(
  action: number | string,
  target?: { hwnd: HWND } | { listview: boolean },
) {
  if (typeof action === "string") action = reaper.NamedCommandLookup(action);

  if (target !== undefined && "hwnd" in target) {
    reaper.MIDIEditor_OnCommand(target.hwnd, action);
  } else {
    reaper.MIDIEditor_LastFocused_OnCommand(action, target?.listview || false);
  }
}

export function getActionContext() {
  const [
    is_new_value,
    filename,
    sectionID,
    cmdID,
    mode,
    resolution,
    val,
    contextstr,
  ] = reaper.get_action_context();

  const action =
    sectionID === -1
      ? null
      : {
          sectionID,
          cmdID,
        };

  return { filename, action };
}
