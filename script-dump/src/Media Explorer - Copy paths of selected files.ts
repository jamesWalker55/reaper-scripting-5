AddCwdToImportPaths();

import { copy } from "reaper-api/clipboard";
import { errorHandler, log } from "reaper-api/utils";

const mx = reaper.OpenMediaExplorer("", false) as unknown as identifier;

/**
 * Logic copied from:
 * https://raw.githubusercontent.com/iliaspoulakis/Reaper-Tools/4196c77139ca2a90246c7222c1406dd718f9a868/ReaSamplOmatic5000/Link%20media%20explorer%20to%20active%20sample%20player.lua
 */
function getSelectedPathsInMediaExplorer() {
  let show_full_path = reaper.GetToggleCommandStateEx(32063, 42026) === 1;
  const show_leading_path = reaper.GetToggleCommandStateEx(32063, 42134) === 1;
  let forced_full_path = false;

  const path_hwnd = reaper.JS_Window_FindChildByID(mx, 1002)!;
  const path = reaper.JS_Window_GetTitle(path_hwnd);

  const mx_list_view = reaper.JS_Window_FindChildByID(mx, 1001)!;
  const sel_indexes = reaper.JS_ListView_ListAllSelItems(mx_list_view)[1];

  const sep = _G.package.config.slice(0, 1);
  const sel_files = [];

  for (const [sel_index] of string.gmatch(sel_indexes, "[^,]+")) {
    const index = tonumber(sel_index)!;
    let file_name = reaper.JS_ListView_GetItem(mx_list_view, index, 0)[0];
    // File name might not include extension, due to MX option
    const ext = reaper.JS_ListView_GetItem(mx_list_view, index, 3)[0];
    if (ext !== "" && !file_name.endsWith(`.${ext}`)) {
      file_name = `${file_name}.${ext}`;
    }
    // Check if file_name is valid path itself (for searches and DBs)
    if (!reaper.file_exists(file_name)) {
      file_name = `${path}${sep}${file_name}`;
    }

    // If file does not exist, try enabling option that shows full path
    if (!show_full_path && !reaper.file_exists(file_name)) {
      show_full_path = true;
      forced_full_path = true;

      // Browser: Show full path in databases and searches
      reaper.JS_WindowMessage_Send(mx, "WM_COMMAND", 42026, 0, 0, 0);

      file_name = reaper.JS_ListView_GetItem(mx_list_view, index, 0)[0];
      if (ext !== "" && !file_name.endsWith(`.${ext}`)) {
        file_name = `${file_name}.${ext}`;
      }
    }
    sel_files.push(file_name);
  }

  // Restore previous settings
  if (forced_full_path) {
    // Browser: Show full path in databases and searches
    reaper.JS_WindowMessage_Send(mx, "WM_COMMAND", 42026, 0, 0, 0);

    if (show_leading_path) {
      // Browser: Show leading path in databases and searches
      reaper.JS_WindowMessage_Send(mx, "WM_COMMAND", 42134, 0, 0, 0);
    }
  }

  return sel_files;
}

function main() {
  const paths = getSelectedPathsInMediaExplorer();
  copy(paths.join("\n"));
}

errorHandler(main);
