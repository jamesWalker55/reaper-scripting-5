import { ensureAPI } from "reaper-api/utils";

export function setIntersection<T extends AnyNotNil>(
  mutable: LuaSet<T>,
  other: LuaSet<T>,
) {
  for (const x of mutable) {
    if (!other.has(x)) {
      mutable.delete(x);
    }
  }
}

export function setClone<T extends AnyNotNil>(value: LuaSet<T>): LuaSet<T> {
  const result: LuaSet<T> = new LuaSet();
  for (const x of value) {
    result.add(x);
  }
  return result;
}

export function getScreenViewport() {
  ensureAPI("SWS Extensions", "JS_Window_GetViewportFromRect");

  // get mouse position
  const [mouseX, mouseY] = reaper.GetMousePosition();

  // find the monitor where the mouse lies
  const [left, top, right, bottom] = reaper.JS_Window_GetViewportFromRect(
    mouseX,
    mouseY,
    1,
    1,
    true,
  );

  return {
    left,
    top,
    right,
    bottom,
  };
}
