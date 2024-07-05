import { ensureAPI } from "./utils";

ensureAPI("SWS Extensions", "CF_SetClipboard");
ensureAPI("SWS Extensions", "CF_GetClipboard");

export function copy(text: string) {
  reaper.CF_SetClipboard(text);
}

export function paste() {
  return reaper.CF_GetClipboard();
}
