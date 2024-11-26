import { isMacOS } from "./utils";

export enum WindowFlags {
  AlwaysAutoResize = reaper.ImGui_WindowFlags_AlwaysAutoResize(),
  AlwaysHorizontalScrollbar = reaper.ImGui_WindowFlags_AlwaysHorizontalScrollbar(),
  AlwaysVerticalScrollbar = reaper.ImGui_WindowFlags_AlwaysVerticalScrollbar(),
  HorizontalScrollbar = reaper.ImGui_WindowFlags_HorizontalScrollbar(),
  MenuBar = reaper.ImGui_WindowFlags_MenuBar(),
  NoBackground = reaper.ImGui_WindowFlags_NoBackground(),
  NoCollapse = reaper.ImGui_WindowFlags_NoCollapse(),
  NoDecoration = reaper.ImGui_WindowFlags_NoDecoration(),
  NoDocking = reaper.ImGui_WindowFlags_NoDocking(),
  NoFocusOnAppearing = reaper.ImGui_WindowFlags_NoFocusOnAppearing(),
  NoInputs = reaper.ImGui_WindowFlags_NoInputs(),
  NoMouseInputs = reaper.ImGui_WindowFlags_NoMouseInputs(),
  NoMove = reaper.ImGui_WindowFlags_NoMove(),
  NoNav = reaper.ImGui_WindowFlags_NoNav(),
  NoNavFocus = reaper.ImGui_WindowFlags_NoNavFocus(),
  NoNavInputs = reaper.ImGui_WindowFlags_NoNavInputs(),
  NoResize = reaper.ImGui_WindowFlags_NoResize(),
  NoSavedSettings = reaper.ImGui_WindowFlags_NoSavedSettings(),
  NoScrollWithMouse = reaper.ImGui_WindowFlags_NoScrollWithMouse(),
  NoScrollbar = reaper.ImGui_WindowFlags_NoScrollbar(),
  NoTitleBar = reaper.ImGui_WindowFlags_NoTitleBar(),
  None = reaper.ImGui_WindowFlags_None(),
  TopMost = reaper.ImGui_WindowFlags_TopMost(),
  UnsavedDocument = reaper.ImGui_WindowFlags_UnsavedDocument(),
}

// /** Return a boolean indicating `open` or not */
// export function window(
//   ctx: ImGui_Context,
//   name: string,
//   config: {
//     p_open?: boolean;
//     flagsIn?: number;
//   },
//   func: () => void,
// ) : boolean {
//   const [visible, open] = reaper.ImGui_Begin(
//     ctx,
//     name,
//     config.p_open,
//     config.flagsIn,
//   );
//   if (!open) {
//     if (visible) {
//       reaper.ImGui_End(ctx);
//     }
//     return false;
//   }

//   let error = null;
//   try {
//     func();
//   } catch (e) {
//     error = e;
//   }

//   if (visible) {
//     reaper.ImGui_End(ctx);
//   }

//   if (error !== null) throw error;

//   return true;
// }

/**
 * Cmd and Ctrl are swapped on MacOS
 */
export enum Mod {
  Alt = reaper.ImGui_Mod_Alt(),
  Ctrl = isMacOS ? reaper.ImGui_Mod_Super() : reaper.ImGui_Mod_Ctrl(),
  Shift = reaper.ImGui_Mod_Shift(),
  Cmd = isMacOS ? reaper.ImGui_Mod_Ctrl() : reaper.ImGui_Mod_Super(),
}

export enum Color {
  Border = reaper.ImGui_Col_Border(),
  BorderShadow = reaper.ImGui_Col_BorderShadow(),
  Button = reaper.ImGui_Col_Button(),
  ButtonActive = reaper.ImGui_Col_ButtonActive(),
  ButtonHovered = reaper.ImGui_Col_ButtonHovered(),
  CheckMark = reaper.ImGui_Col_CheckMark(),
  ChildBg = reaper.ImGui_Col_ChildBg(),
  DockingEmptyBg = reaper.ImGui_Col_DockingEmptyBg(),
  DockingPreview = reaper.ImGui_Col_DockingPreview(),
  DragDropTarget = reaper.ImGui_Col_DragDropTarget(),
  FrameBg = reaper.ImGui_Col_FrameBg(),
  FrameBgActive = reaper.ImGui_Col_FrameBgActive(),
  FrameBgHovered = reaper.ImGui_Col_FrameBgHovered(),
  Header = reaper.ImGui_Col_Header(),
  HeaderActive = reaper.ImGui_Col_HeaderActive(),
  HeaderHovered = reaper.ImGui_Col_HeaderHovered(),
  MenuBarBg = reaper.ImGui_Col_MenuBarBg(),
  ModalWindowDimBg = reaper.ImGui_Col_ModalWindowDimBg(),
  NavHighlight = reaper.ImGui_Col_NavHighlight(),
  NavWindowingDimBg = reaper.ImGui_Col_NavWindowingDimBg(),
  NavWindowingHighlight = reaper.ImGui_Col_NavWindowingHighlight(),
  PlotHistogram = reaper.ImGui_Col_PlotHistogram(),
  PlotHistogramHovered = reaper.ImGui_Col_PlotHistogramHovered(),
  PlotLines = reaper.ImGui_Col_PlotLines(),
  PlotLinesHovered = reaper.ImGui_Col_PlotLinesHovered(),
  PopupBg = reaper.ImGui_Col_PopupBg(),
  ResizeGrip = reaper.ImGui_Col_ResizeGrip(),
  ResizeGripActive = reaper.ImGui_Col_ResizeGripActive(),
  ResizeGripHovered = reaper.ImGui_Col_ResizeGripHovered(),
  ScrollbarBg = reaper.ImGui_Col_ScrollbarBg(),
  ScrollbarGrab = reaper.ImGui_Col_ScrollbarGrab(),
  ScrollbarGrabActive = reaper.ImGui_Col_ScrollbarGrabActive(),
  ScrollbarGrabHovered = reaper.ImGui_Col_ScrollbarGrabHovered(),
  Separator = reaper.ImGui_Col_Separator(),
  SeparatorActive = reaper.ImGui_Col_SeparatorActive(),
  SeparatorHovered = reaper.ImGui_Col_SeparatorHovered(),
  SliderGrab = reaper.ImGui_Col_SliderGrab(),
  SliderGrabActive = reaper.ImGui_Col_SliderGrabActive(),
  Tab = reaper.ImGui_Col_Tab(),
  TabDimmed = reaper.ImGui_Col_TabDimmed(),
  TabDimmedSelected = reaper.ImGui_Col_TabDimmedSelected(),
  TabDimmedSelectedOverline = reaper.ImGui_Col_TabDimmedSelectedOverline(),
  TabHovered = reaper.ImGui_Col_TabHovered(),
  TabSelected = reaper.ImGui_Col_TabSelected(),
  TabSelectedOverline = reaper.ImGui_Col_TabSelectedOverline(),
  TableBorderLight = reaper.ImGui_Col_TableBorderLight(),
  TableBorderStrong = reaper.ImGui_Col_TableBorderStrong(),
  TableHeaderBg = reaper.ImGui_Col_TableHeaderBg(),
  TableRowBg = reaper.ImGui_Col_TableRowBg(),
  TableRowBgAlt = reaper.ImGui_Col_TableRowBgAlt(),
  Text = reaper.ImGui_Col_Text(),
  TextDisabled = reaper.ImGui_Col_TextDisabled(),
  TextSelectedBg = reaper.ImGui_Col_TextSelectedBg(),
  TitleBg = reaper.ImGui_Col_TitleBg(),
  TitleBgActive = reaper.ImGui_Col_TitleBgActive(),
  TitleBgCollapsed = reaper.ImGui_Col_TitleBgCollapsed(),
  WindowBg = reaper.ImGui_Col_WindowBg(),
}

export function withStyleColor<T>(
  ctx: ImGui_Context,
  styles: { id: Color; rgba: number }[],
  func: () => T,
): T {
  for (const style of styles) {
    reaper.ImGui_PushStyleColor(ctx, style.id, style.rgba);
  }
  const rv = func();
  reaper.ImGui_PopStyleColor(ctx, styles.length);
  return rv;
}
