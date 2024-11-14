AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as Path from "reaper-api/path/path";
import {
  assertUnreachable,
  confirmBox,
  errorHandler,
  getReaperDataFile,
  log,
  readFile,
  writeFile,
} from "reaper-api/utils";
import {
  ColorId,
  createContext,
  IconId,
  microUILoop,
  MouseButton,
  Option,
  ReaperContext,
  rect,
  Response,
} from "reaper-microui";

// relative to this current script
const MENU_SCRIPT_PATH = "plain-text-menu.lua";
const DEST_MENU_DIR = "Plain Text Menus";

enum Section {
  Main = 0,
  MainAlt = 100,
  Midi = 32060,
  MidiEventlist = 32061,
  Explorer = 32063,
}

enum SectionGroup {
  Main,
  Midi,
  Explorer,
}

const SECTION_GROUP_DISPLAY_NAME: Record<SectionGroup, string> = {
  [SectionGroup.Main]: "Main section",
  [SectionGroup.Midi]: "MIDI section",
  [SectionGroup.Explorer]: "Explorer section",
};

const VirtualKeyboard = (() => {
  const MAIN_SECTION_ID = 0;
  const ACTION_SEND_TO_VKB = 40637;
  const ACTION_SHOW_VKB = 40377;

  return {
    isSendToVKB() {
      const state = reaper.GetToggleCommandStateEx(
        MAIN_SECTION_ID,
        ACTION_SEND_TO_VKB,
      );
      return state === 1;
    },
    isVKBVisible() {
      const state = reaper.GetToggleCommandStateEx(
        MAIN_SECTION_ID,
        ACTION_SHOW_VKB,
      );
      return state === 1;
    },
    toggleSendToVKB() {
      reaper.Main_OnCommand(ACTION_SEND_TO_VKB, 0);
    },
    toggleVKBVisible() {
      reaper.Main_OnCommand(ACTION_SHOW_VKB, 0);
    },
  };
})();

function getMenuScriptPath() {
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

  const scriptDir = Path.split(filename)[0];
  const scriptPath = Path.join(scriptDir, MENU_SCRIPT_PATH);

  if (!reaper.file_exists(scriptPath))
    throw new Error(
      `Failed to find menu base script file, expected it to be here: ${scriptPath}`,
    );

  return scriptPath;
}

function getDestDir() {
  const destDir = Path.join(getReaperDataFile("Scripts"), DEST_MENU_DIR);
  reaper.RecursiveCreateDirectory(destDir, 1);
  return destDir;
}

function getDestPath(destDir: string, menuName: string) {
  const luaPath = Path.join(destDir, `${menuName}.lua`);
  const txtPath = Path.join(destDir, `${menuName}.txt`);
  return { lua: luaPath, txt: txtPath };
}

function radio(
  ctx: ReaperContext,
  options: string[],
  selected: string,
): string | null {
  function radioSub(label: string, checked: boolean): boolean {
    let clicked = false;
    let res: false | Response = false;
    const id = ctx.getId(label);
    const r = ctx.layoutNext();
    const box = rect(r.x, r.y, r.h, r.h);
    ctx.updateControl(id, r, 0);
    /* handle click */
    if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
      clicked = true;
      checked = !checked;
    }
    /* draw */
    ctx.drawControlFrame(id, box, ColorId.Base, 0);
    if (checked) {
      ctx.drawIcon(IconId.Check, box, ctx.style.colors[ColorId.Text]);
    }
    const r2 = rect(r.x + box.w, r.y, r.w - box.w, r.h);
    ctx.drawControlText(label, r2, ColorId.Text, 0);
    return clicked;
  }

  let clickedOption: string | null = null;
  for (const opt of options) {
    const clicked = radioSub(opt, opt === selected);
    if (clicked) clickedOption = opt;
  }

  return clickedOption;
}

function main() {
  const scriptPath = getMenuScriptPath();
  const destDir = getDestDir();

  // parameters
  let sectionGroup: SectionGroup = SectionGroup.Main;
  let menuName: string = "PlainTextMenu_";
  let clickedCreate: boolean = false;

  // gui code
  const ctx = createContext();
  gfx.init("Create plain-text menu", 260, 250);
  gfx.setfont(1, "Arial", 14);
  ctx.style.font = 1;

  // variables for disabling VKB input
  let firstLoop = true;
  let queryIsFocused = false;
  let initialSendToVKB = VirtualKeyboard.isSendToVKB();

  microUILoop(
    ctx,
    (stop) => {
      if (
        ctx.beginWindow(
          "Demo Window",
          { x: 0, y: 0, w: 0, h: 0 },
          Option.NoResize | Option.NoTitle | Option.NoClose,
        )
      ) {
        // resize inner window to base window
        {
          const win = ctx.getCurrentContainer();
          win.rect.w = gfx.w;
          win.rect.h = gfx.h;
        }

        ctx.layoutRow([-1], 0);

        // menu name input
        {
          const id = ctx.getId("menuName");
          if (firstLoop) {
            ctx.setFocus(id);
          }

          ctx.text("Name of the menu:");

          const [rv, newMenuName] = ctx.textbox("menuName", menuName);
          menuName = newMenuName;

          // virtual keyboard shit
          const oldQueryIsFocused = queryIsFocused;
          queryIsFocused = ctx.focus === id;
          if (oldQueryIsFocused !== queryIsFocused) {
            if (queryIsFocused) {
              // inputbox has been focused
              // turn off vkb send if it is on
              initialSendToVKB = VirtualKeyboard.isSendToVKB();
              if (initialSendToVKB) {
                VirtualKeyboard.toggleSendToVKB();
              }
            } else {
              // inputbox has been unfocused
              // turn on vkb send if it was on initially
              if (initialSendToVKB && !VirtualKeyboard.isSendToVKB()) {
                VirtualKeyboard.toggleSendToVKB();
              }
            }
          }
        }

        ctx.layoutNext();

        // section selection
        {
          ctx.text("The section to add it to:");

          const selected = radio(
            ctx,
            ["Main section", "MIDI section", "Explorer section"],
            sectionGroup === SectionGroup.Main
              ? "Main section"
              : sectionGroup === SectionGroup.Midi
              ? "MIDI section"
              : "Explorer section",
          );
          if (selected !== null) {
            if (selected === "Main section") {
              sectionGroup = SectionGroup.Main;
            } else if (selected === "MIDI section") {
              sectionGroup = SectionGroup.Midi;
            } else {
              sectionGroup = SectionGroup.Explorer;
            }
          }
        }

        ctx.layoutNext();

        if (ctx.button("Create menu")) {
          const destPaths = getDestPath(destDir, menuName);
          if (
            reaper.file_exists(destPaths.lua) ||
            reaper.file_exists(destPaths.txt)
          ) {
            const confirm = confirmBox(
              "Menu already exists",
              `The menu ${inspect(
                menuName,
              )} already exists, do you want to overwrite it?`,
            );

            if (confirm) {
              clickedCreate = true;
            } else {
              // don't overwrite
            }
          } else {
            clickedCreate = true;
          }
          if (clickedCreate) stop();
        }

        ctx.endWindow();

        firstLoop = false;
      }
    },
    () => {
      // on exit, ensure vkb send is reverted
      if (initialSendToVKB && !VirtualKeyboard.isSendToVKB()) {
        VirtualKeyboard.toggleSendToVKB();
      }

      // exit if we didn't click the create button
      if (!clickedCreate) return;

      const destPaths = getDestPath(destDir, menuName);

      // write the .lua file
      const menuScript = readFile(scriptPath);
      writeFile(destPaths.lua, menuScript);

      // write the .txt file only if it doesn't exist yet
      writeFile(destPaths.txt, "");

      // log to console for easy copy and pasting
      log("Created new menu at:");
      log(destPaths.txt);

      // add the menu to actions list
      switch (sectionGroup) {
        case SectionGroup.Main: {
          reaper.AddRemoveReaScript(true, Section.Main, destPaths.lua, false);
          reaper.AddRemoveReaScript(true, Section.MainAlt, destPaths.lua, true);
          break;
        }
        case SectionGroup.Midi: {
          reaper.AddRemoveReaScript(true, Section.Midi, destPaths.lua, false);
          reaper.AddRemoveReaScript(
            true,
            Section.MidiEventlist,
            destPaths.lua,
            true,
          );
          break;
        }
        case SectionGroup.Explorer: {
          reaper.AddRemoveReaScript(
            true,
            Section.Explorer,
            destPaths.lua,
            true,
          );
          break;
        }
        default:
          assertUnreachable(sectionGroup);
      }

      // reveal in explorer if you have CF extensions installed
      if (reaper.APIExists("CF_LocateInExplorer")) {
        reaper.CF_LocateInExplorer(destPaths.txt);
      }
    },
  );
}

errorHandler(main);
