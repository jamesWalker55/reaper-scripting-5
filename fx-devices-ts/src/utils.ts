import { getActionContext } from "reaper-api/utils";

export const isMacOS = reaper.GetOS().includes("OSX");

export const setCommandState: (active: boolean) => void = (() => {
  const ctx = getActionContext();

  // if failed to detect action, just do no-op
  if (ctx.action === null) {
    return (_: boolean) => {};
  } else {
    return (active: boolean) => {
      const action = ctx.action!;

      reaper.SetToggleCommandState(
        action.sectionID,
        action.cmdID,
        active ? 1 : 0,
      );
      if (ctx.action) {
        reaper.RefreshToolbar2(ctx.action.sectionID, ctx.action.cmdID);
      }
    };
  }
})();
