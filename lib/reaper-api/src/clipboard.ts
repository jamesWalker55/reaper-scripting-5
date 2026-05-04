import { ensureAPI } from "./utils";

let apiChecked = false;

function checkAPI() {
  if (apiChecked) return;

  ensureAPI("SWS Extensions", "CF_SetClipboard");
  ensureAPI("SWS Extensions", "CF_GetClipboard");

  apiChecked = true;
}

export function copy(text: string) {
  checkAPI();
  reaper.CF_SetClipboard(text);
}

export function paste() {
  checkAPI();
  return reaper.CF_GetClipboard();
}
