const MAIN_SECTION_ID = 0;
const ACTION_SEND_TO_VKB = 40637;
const ACTION_SHOW_VKB = 40377;

/** Wraps REAPER's on-screen virtual keyboard toggle actions. */
export const VirtualKeyboard = {
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
