import { isMacOS } from "./utils";

// all properties on the `reaper` object
type ReaperKey = keyof typeof reaper;

type RemoveImguiPrefix<T> = T extends `ImGui_${infer U}` ? U : never;
function removeImguiPrefix<T extends ReaperKey>(
  x: T,
): RemoveImguiPrefix<T> | null {
  if (x.startsWith("ImGui_")) {
    return x.slice("ImGui_".length, x.length) as RemoveImguiPrefix<T>;
  } else {
    return null;
  }
}

// list of attributes that just return a number (i.e. must be a flag)
type ReaperImguiFlag = {
  [K in ReaperKey as RemoveImguiPrefix<K>]: (typeof reaper)[K] extends () => number
    ? K
    : never;
}[RemoveImguiPrefix<ReaperKey>];
const REAPER_IMGUI_FLAGS: Record<ReaperImguiFlag, true> = {
  ImGui_ButtonFlags_MouseButtonLeft: true,
  ImGui_ButtonFlags_MouseButtonMiddle: true,
  ImGui_ButtonFlags_MouseButtonRight: true,
  ImGui_ButtonFlags_None: true,
  ImGui_ChildFlags_AlwaysAutoResize: true,
  ImGui_ChildFlags_AlwaysUseWindowPadding: true,
  ImGui_ChildFlags_AutoResizeX: true,
  ImGui_ChildFlags_AutoResizeY: true,
  ImGui_ChildFlags_Border: true,
  ImGui_ChildFlags_FrameStyle: true,
  ImGui_ChildFlags_NavFlattened: true,
  ImGui_ChildFlags_None: true,
  ImGui_ChildFlags_ResizeX: true,
  ImGui_ChildFlags_ResizeY: true,
  ImGui_Col_Border: true,
  ImGui_Col_BorderShadow: true,
  ImGui_Col_Button: true,
  ImGui_Col_ButtonActive: true,
  ImGui_Col_ButtonHovered: true,
  ImGui_Col_CheckMark: true,
  ImGui_Col_ChildBg: true,
  ImGui_Col_DockingEmptyBg: true,
  ImGui_Col_DockingPreview: true,
  ImGui_Col_DragDropTarget: true,
  ImGui_Col_FrameBg: true,
  ImGui_Col_FrameBgActive: true,
  ImGui_Col_FrameBgHovered: true,
  ImGui_Col_Header: true,
  ImGui_Col_HeaderActive: true,
  ImGui_Col_HeaderHovered: true,
  ImGui_Col_MenuBarBg: true,
  ImGui_Col_ModalWindowDimBg: true,
  ImGui_Col_NavHighlight: true,
  ImGui_Col_NavWindowingDimBg: true,
  ImGui_Col_NavWindowingHighlight: true,
  ImGui_Col_PlotHistogram: true,
  ImGui_Col_PlotHistogramHovered: true,
  ImGui_Col_PlotLines: true,
  ImGui_Col_PlotLinesHovered: true,
  ImGui_Col_PopupBg: true,
  ImGui_Col_ResizeGrip: true,
  ImGui_Col_ResizeGripActive: true,
  ImGui_Col_ResizeGripHovered: true,
  ImGui_Col_ScrollbarBg: true,
  ImGui_Col_ScrollbarGrab: true,
  ImGui_Col_ScrollbarGrabActive: true,
  ImGui_Col_ScrollbarGrabHovered: true,
  ImGui_Col_Separator: true,
  ImGui_Col_SeparatorActive: true,
  ImGui_Col_SeparatorHovered: true,
  ImGui_Col_SliderGrab: true,
  ImGui_Col_SliderGrabActive: true,
  ImGui_Col_Tab: true,
  ImGui_Col_TabDimmed: true,
  ImGui_Col_TabDimmedSelected: true,
  ImGui_Col_TabDimmedSelectedOverline: true,
  ImGui_Col_TabHovered: true,
  ImGui_Col_TabSelected: true,
  ImGui_Col_TabSelectedOverline: true,
  ImGui_Col_TableBorderLight: true,
  ImGui_Col_TableBorderStrong: true,
  ImGui_Col_TableHeaderBg: true,
  ImGui_Col_TableRowBg: true,
  ImGui_Col_TableRowBgAlt: true,
  ImGui_Col_Text: true,
  ImGui_Col_TextDisabled: true,
  ImGui_Col_TextSelectedBg: true,
  ImGui_Col_TitleBg: true,
  ImGui_Col_TitleBgActive: true,
  ImGui_Col_TitleBgCollapsed: true,
  ImGui_Col_WindowBg: true,
  ImGui_ColorEditFlags_AlphaBar: true,
  ImGui_ColorEditFlags_AlphaPreview: true,
  ImGui_ColorEditFlags_AlphaPreviewHalf: true,
  ImGui_ColorEditFlags_DisplayHSV: true,
  ImGui_ColorEditFlags_DisplayHex: true,
  ImGui_ColorEditFlags_DisplayRGB: true,
  ImGui_ColorEditFlags_Float: true,
  ImGui_ColorEditFlags_InputHSV: true,
  ImGui_ColorEditFlags_InputRGB: true,
  ImGui_ColorEditFlags_NoAlpha: true,
  ImGui_ColorEditFlags_NoBorder: true,
  ImGui_ColorEditFlags_NoDragDrop: true,
  ImGui_ColorEditFlags_NoInputs: true,
  ImGui_ColorEditFlags_NoLabel: true,
  ImGui_ColorEditFlags_NoOptions: true,
  ImGui_ColorEditFlags_NoPicker: true,
  ImGui_ColorEditFlags_NoSidePreview: true,
  ImGui_ColorEditFlags_NoSmallPreview: true,
  ImGui_ColorEditFlags_NoTooltip: true,
  ImGui_ColorEditFlags_None: true,
  ImGui_ColorEditFlags_PickerHueBar: true,
  ImGui_ColorEditFlags_PickerHueWheel: true,
  ImGui_ColorEditFlags_Uint8: true,
  ImGui_ComboFlags_HeightLarge: true,
  ImGui_ComboFlags_HeightLargest: true,
  ImGui_ComboFlags_HeightRegular: true,
  ImGui_ComboFlags_HeightSmall: true,
  ImGui_ComboFlags_NoArrowButton: true,
  ImGui_ComboFlags_NoPreview: true,
  ImGui_ComboFlags_None: true,
  ImGui_ComboFlags_PopupAlignLeft: true,
  ImGui_ComboFlags_WidthFitPreview: true,
  ImGui_Cond_Always: true,
  ImGui_Cond_Appearing: true,
  ImGui_Cond_FirstUseEver: true,
  ImGui_Cond_Once: true,
  ImGui_ConfigFlags_DockingEnable: true,
  ImGui_ConfigFlags_NavEnableKeyboard: true,
  ImGui_ConfigFlags_NavEnableSetMousePos: true,
  ImGui_ConfigFlags_NavNoCaptureKeyboard: true,
  ImGui_ConfigFlags_NoKeyboard: true,
  ImGui_ConfigFlags_NoMouse: true,
  ImGui_ConfigFlags_NoMouseCursorChange: true,
  ImGui_ConfigFlags_NoSavedSettings: true,
  ImGui_ConfigFlags_None: true,
  ImGui_ConfigVar_DebugBeginReturnValueLoop: true,
  ImGui_ConfigVar_DebugBeginReturnValueOnce: true,
  ImGui_ConfigVar_DockingNoSplit: true,
  ImGui_ConfigVar_DockingTransparentPayload: true,
  ImGui_ConfigVar_DockingWithShift: true,
  ImGui_ConfigVar_DragClickToInputText: true,
  ImGui_ConfigVar_Flags: true,
  ImGui_ConfigVar_HoverDelayNormal: true,
  ImGui_ConfigVar_HoverDelayShort: true,
  ImGui_ConfigVar_HoverFlagsForTooltipMouse: true,
  ImGui_ConfigVar_HoverFlagsForTooltipNav: true,
  ImGui_ConfigVar_HoverStationaryDelay: true,
  ImGui_ConfigVar_InputTextCursorBlink: true,
  ImGui_ConfigVar_InputTextEnterKeepActive: true,
  ImGui_ConfigVar_InputTrickleEventQueue: true,
  ImGui_ConfigVar_KeyRepeatDelay: true,
  ImGui_ConfigVar_KeyRepeatRate: true,
  ImGui_ConfigVar_MacOSXBehaviors: true,
  ImGui_ConfigVar_MouseDoubleClickMaxDist: true,
  ImGui_ConfigVar_MouseDoubleClickTime: true,
  ImGui_ConfigVar_MouseDragThreshold: true,
  ImGui_ConfigVar_ViewportsNoDecoration: true,
  ImGui_ConfigVar_WindowsMoveFromTitleBarOnly: true,
  ImGui_ConfigVar_WindowsResizeFromEdges: true,
  ImGui_Dir_Down: true,
  ImGui_Dir_Left: true,
  ImGui_Dir_None: true,
  ImGui_Dir_Right: true,
  ImGui_Dir_Up: true,
  ImGui_DragDropFlags_AcceptBeforeDelivery: true,
  ImGui_DragDropFlags_AcceptNoDrawDefaultRect: true,
  ImGui_DragDropFlags_AcceptNoPreviewTooltip: true,
  ImGui_DragDropFlags_AcceptPeekOnly: true,
  ImGui_DragDropFlags_None: true,
  ImGui_DragDropFlags_PayloadAutoExpire: true,
  ImGui_DragDropFlags_SourceAllowNullID: true,
  ImGui_DragDropFlags_SourceExtern: true,
  ImGui_DragDropFlags_SourceNoDisableHover: true,
  ImGui_DragDropFlags_SourceNoHoldToOpenOthers: true,
  ImGui_DragDropFlags_SourceNoPreviewTooltip: true,
  ImGui_DrawFlags_Closed: true,
  ImGui_DrawFlags_None: true,
  ImGui_DrawFlags_RoundCornersAll: true,
  ImGui_DrawFlags_RoundCornersBottom: true,
  ImGui_DrawFlags_RoundCornersBottomLeft: true,
  ImGui_DrawFlags_RoundCornersBottomRight: true,
  ImGui_DrawFlags_RoundCornersLeft: true,
  ImGui_DrawFlags_RoundCornersNone: true,
  ImGui_DrawFlags_RoundCornersRight: true,
  ImGui_DrawFlags_RoundCornersTop: true,
  ImGui_DrawFlags_RoundCornersTopLeft: true,
  ImGui_DrawFlags_RoundCornersTopRight: true,
  ImGui_FocusedFlags_AnyWindow: true,
  ImGui_FocusedFlags_ChildWindows: true,
  ImGui_FocusedFlags_DockHierarchy: true,
  ImGui_FocusedFlags_NoPopupHierarchy: true,
  ImGui_FocusedFlags_None: true,
  ImGui_FocusedFlags_RootAndChildWindows: true,
  ImGui_FocusedFlags_RootWindow: true,
  ImGui_FontFlags_Bold: true,
  ImGui_FontFlags_Italic: true,
  ImGui_FontFlags_None: true,
  ImGui_HoveredFlags_AllowWhenBlockedByActiveItem: true,
  ImGui_HoveredFlags_AllowWhenBlockedByPopup: true,
  ImGui_HoveredFlags_AllowWhenDisabled: true,
  ImGui_HoveredFlags_AllowWhenOverlapped: true,
  ImGui_HoveredFlags_AllowWhenOverlappedByItem: true,
  ImGui_HoveredFlags_AllowWhenOverlappedByWindow: true,
  ImGui_HoveredFlags_AnyWindow: true,
  ImGui_HoveredFlags_ChildWindows: true,
  ImGui_HoveredFlags_DelayNone: true,
  ImGui_HoveredFlags_DelayNormal: true,
  ImGui_HoveredFlags_DelayShort: true,
  ImGui_HoveredFlags_DockHierarchy: true,
  ImGui_HoveredFlags_ForTooltip: true,
  ImGui_HoveredFlags_NoNavOverride: true,
  ImGui_HoveredFlags_NoPopupHierarchy: true,
  ImGui_HoveredFlags_NoSharedDelay: true,
  ImGui_HoveredFlags_None: true,
  ImGui_HoveredFlags_RectOnly: true,
  ImGui_HoveredFlags_RootAndChildWindows: true,
  ImGui_HoveredFlags_RootWindow: true,
  ImGui_HoveredFlags_Stationary: true,
  ImGui_InputFlags_None: true,
  ImGui_InputFlags_Repeat: true,
  ImGui_InputFlags_RouteActive: true,
  ImGui_InputFlags_RouteAlways: true,
  ImGui_InputFlags_RouteFocused: true,
  ImGui_InputFlags_RouteFromRootWindow: true,
  ImGui_InputFlags_RouteGlobal: true,
  ImGui_InputFlags_RouteOverActive: true,
  ImGui_InputFlags_RouteOverFocused: true,
  ImGui_InputFlags_RouteUnlessBgFocused: true,
  ImGui_InputFlags_Tooltip: true,
  ImGui_InputTextFlags_AllowTabInput: true,
  ImGui_InputTextFlags_AlwaysOverwrite: true,
  ImGui_InputTextFlags_AutoSelectAll: true,
  ImGui_InputTextFlags_CallbackAlways: true,
  ImGui_InputTextFlags_CallbackCharFilter: true,
  ImGui_InputTextFlags_CallbackCompletion: true,
  ImGui_InputTextFlags_CallbackEdit: true,
  ImGui_InputTextFlags_CallbackHistory: true,
  ImGui_InputTextFlags_CharsDecimal: true,
  ImGui_InputTextFlags_CharsHexadecimal: true,
  ImGui_InputTextFlags_CharsNoBlank: true,
  ImGui_InputTextFlags_CharsScientific: true,
  ImGui_InputTextFlags_CharsUppercase: true,
  ImGui_InputTextFlags_CtrlEnterForNewLine: true,
  ImGui_InputTextFlags_DisplayEmptyRefVal: true,
  ImGui_InputTextFlags_EnterReturnsTrue: true,
  ImGui_InputTextFlags_EscapeClearsAll: true,
  ImGui_InputTextFlags_NoHorizontalScroll: true,
  ImGui_InputTextFlags_NoUndoRedo: true,
  ImGui_InputTextFlags_None: true,
  ImGui_InputTextFlags_ParseEmptyRefVal: true,
  ImGui_InputTextFlags_Password: true,
  ImGui_InputTextFlags_ReadOnly: true,
  ImGui_Key_0: true,
  ImGui_Key_1: true,
  ImGui_Key_2: true,
  ImGui_Key_3: true,
  ImGui_Key_4: true,
  ImGui_Key_5: true,
  ImGui_Key_6: true,
  ImGui_Key_7: true,
  ImGui_Key_8: true,
  ImGui_Key_9: true,
  ImGui_Key_A: true,
  ImGui_Key_Apostrophe: true,
  ImGui_Key_AppBack: true,
  ImGui_Key_AppForward: true,
  ImGui_Key_B: true,
  ImGui_Key_Backslash: true,
  ImGui_Key_Backspace: true,
  ImGui_Key_C: true,
  ImGui_Key_CapsLock: true,
  ImGui_Key_Comma: true,
  ImGui_Key_D: true,
  ImGui_Key_Delete: true,
  ImGui_Key_DownArrow: true,
  ImGui_Key_E: true,
  ImGui_Key_End: true,
  ImGui_Key_Enter: true,
  ImGui_Key_Equal: true,
  ImGui_Key_Escape: true,
  ImGui_Key_F: true,
  ImGui_Key_F1: true,
  ImGui_Key_F10: true,
  ImGui_Key_F11: true,
  ImGui_Key_F12: true,
  ImGui_Key_F13: true,
  ImGui_Key_F14: true,
  ImGui_Key_F15: true,
  ImGui_Key_F16: true,
  ImGui_Key_F17: true,
  ImGui_Key_F18: true,
  ImGui_Key_F19: true,
  ImGui_Key_F2: true,
  ImGui_Key_F20: true,
  ImGui_Key_F21: true,
  ImGui_Key_F22: true,
  ImGui_Key_F23: true,
  ImGui_Key_F24: true,
  ImGui_Key_F3: true,
  ImGui_Key_F4: true,
  ImGui_Key_F5: true,
  ImGui_Key_F6: true,
  ImGui_Key_F7: true,
  ImGui_Key_F8: true,
  ImGui_Key_F9: true,
  ImGui_Key_G: true,
  ImGui_Key_GraveAccent: true,
  ImGui_Key_H: true,
  ImGui_Key_Home: true,
  ImGui_Key_I: true,
  ImGui_Key_Insert: true,
  ImGui_Key_J: true,
  ImGui_Key_K: true,
  ImGui_Key_Keypad0: true,
  ImGui_Key_Keypad1: true,
  ImGui_Key_Keypad2: true,
  ImGui_Key_Keypad3: true,
  ImGui_Key_Keypad4: true,
  ImGui_Key_Keypad5: true,
  ImGui_Key_Keypad6: true,
  ImGui_Key_Keypad7: true,
  ImGui_Key_Keypad8: true,
  ImGui_Key_Keypad9: true,
  ImGui_Key_KeypadAdd: true,
  ImGui_Key_KeypadDecimal: true,
  ImGui_Key_KeypadDivide: true,
  ImGui_Key_KeypadEnter: true,
  ImGui_Key_KeypadEqual: true,
  ImGui_Key_KeypadMultiply: true,
  ImGui_Key_KeypadSubtract: true,
  ImGui_Key_L: true,
  ImGui_Key_LeftAlt: true,
  ImGui_Key_LeftArrow: true,
  ImGui_Key_LeftBracket: true,
  ImGui_Key_LeftCtrl: true,
  ImGui_Key_LeftShift: true,
  ImGui_Key_LeftSuper: true,
  ImGui_Key_M: true,
  ImGui_Key_Menu: true,
  ImGui_Key_Minus: true,
  ImGui_Key_MouseLeft: true,
  ImGui_Key_MouseMiddle: true,
  ImGui_Key_MouseRight: true,
  ImGui_Key_MouseWheelX: true,
  ImGui_Key_MouseWheelY: true,
  ImGui_Key_MouseX1: true,
  ImGui_Key_MouseX2: true,
  ImGui_Key_N: true,
  ImGui_Key_NumLock: true,
  ImGui_Key_O: true,
  ImGui_Key_P: true,
  ImGui_Key_PageDown: true,
  ImGui_Key_PageUp: true,
  ImGui_Key_Pause: true,
  ImGui_Key_Period: true,
  ImGui_Key_PrintScreen: true,
  ImGui_Key_Q: true,
  ImGui_Key_R: true,
  ImGui_Key_RightAlt: true,
  ImGui_Key_RightArrow: true,
  ImGui_Key_RightBracket: true,
  ImGui_Key_RightCtrl: true,
  ImGui_Key_RightShift: true,
  ImGui_Key_RightSuper: true,
  ImGui_Key_S: true,
  ImGui_Key_ScrollLock: true,
  ImGui_Key_Semicolon: true,
  ImGui_Key_Slash: true,
  ImGui_Key_Space: true,
  ImGui_Key_T: true,
  ImGui_Key_Tab: true,
  ImGui_Key_U: true,
  ImGui_Key_UpArrow: true,
  ImGui_Key_V: true,
  ImGui_Key_W: true,
  ImGui_Key_X: true,
  ImGui_Key_Y: true,
  ImGui_Key_Z: true,
  ImGui_Mod_Alt: true,
  ImGui_Mod_Ctrl: true,
  ImGui_Mod_None: true,
  ImGui_Mod_Shift: true,
  ImGui_Mod_Super: true,
  ImGui_MouseButton_Left: true,
  ImGui_MouseButton_Middle: true,
  ImGui_MouseButton_Right: true,
  ImGui_MouseCursor_Arrow: true,
  ImGui_MouseCursor_Hand: true,
  ImGui_MouseCursor_None: true,
  ImGui_MouseCursor_NotAllowed: true,
  ImGui_MouseCursor_ResizeAll: true,
  ImGui_MouseCursor_ResizeEW: true,
  ImGui_MouseCursor_ResizeNESW: true,
  ImGui_MouseCursor_ResizeNS: true,
  ImGui_MouseCursor_ResizeNWSE: true,
  ImGui_MouseCursor_TextInput: true,
  ImGui_PopupFlags_AnyPopup: true,
  ImGui_PopupFlags_AnyPopupId: true,
  ImGui_PopupFlags_AnyPopupLevel: true,
  ImGui_PopupFlags_MouseButtonLeft: true,
  ImGui_PopupFlags_MouseButtonMiddle: true,
  ImGui_PopupFlags_MouseButtonRight: true,
  ImGui_PopupFlags_NoOpenOverExistingPopup: true,
  ImGui_PopupFlags_NoOpenOverItems: true,
  ImGui_PopupFlags_NoReopen: true,
  ImGui_PopupFlags_None: true,
  ImGui_SelectableFlags_AllowDoubleClick: true,
  ImGui_SelectableFlags_AllowOverlap: true,
  ImGui_SelectableFlags_Disabled: true,
  ImGui_SelectableFlags_DontClosePopups: true,
  ImGui_SelectableFlags_None: true,
  ImGui_SelectableFlags_SpanAllColumns: true,
  ImGui_SliderFlags_AlwaysClamp: true,
  ImGui_SliderFlags_Logarithmic: true,
  ImGui_SliderFlags_NoInput: true,
  ImGui_SliderFlags_NoRoundToFormat: true,
  ImGui_SliderFlags_None: true,
  ImGui_SliderFlags_WrapAround: true,
  ImGui_SortDirection_Ascending: true,
  ImGui_SortDirection_Descending: true,
  ImGui_SortDirection_None: true,
  ImGui_StyleVar_Alpha: true,
  ImGui_StyleVar_ButtonTextAlign: true,
  ImGui_StyleVar_CellPadding: true,
  ImGui_StyleVar_ChildBorderSize: true,
  ImGui_StyleVar_ChildRounding: true,
  ImGui_StyleVar_DisabledAlpha: true,
  ImGui_StyleVar_FrameBorderSize: true,
  ImGui_StyleVar_FramePadding: true,
  ImGui_StyleVar_FrameRounding: true,
  ImGui_StyleVar_GrabMinSize: true,
  ImGui_StyleVar_GrabRounding: true,
  ImGui_StyleVar_IndentSpacing: true,
  ImGui_StyleVar_ItemInnerSpacing: true,
  ImGui_StyleVar_ItemSpacing: true,
  ImGui_StyleVar_PopupBorderSize: true,
  ImGui_StyleVar_PopupRounding: true,
  ImGui_StyleVar_ScrollbarRounding: true,
  ImGui_StyleVar_ScrollbarSize: true,
  ImGui_StyleVar_SelectableTextAlign: true,
  ImGui_StyleVar_SeparatorTextAlign: true,
  ImGui_StyleVar_SeparatorTextBorderSize: true,
  ImGui_StyleVar_SeparatorTextPadding: true,
  ImGui_StyleVar_TabBarBorderSize: true,
  ImGui_StyleVar_TabBorderSize: true,
  ImGui_StyleVar_TabRounding: true,
  ImGui_StyleVar_TableAngledHeadersAngle: true,
  ImGui_StyleVar_TableAngledHeadersTextAlign: true,
  ImGui_StyleVar_WindowBorderSize: true,
  ImGui_StyleVar_WindowMinSize: true,
  ImGui_StyleVar_WindowPadding: true,
  ImGui_StyleVar_WindowRounding: true,
  ImGui_StyleVar_WindowTitleAlign: true,
  ImGui_TabBarFlags_AutoSelectNewTabs: true,
  ImGui_TabBarFlags_DrawSelectedOverline: true,
  ImGui_TabBarFlags_FittingPolicyResizeDown: true,
  ImGui_TabBarFlags_FittingPolicyScroll: true,
  ImGui_TabBarFlags_NoCloseWithMiddleMouseButton: true,
  ImGui_TabBarFlags_NoTabListScrollingButtons: true,
  ImGui_TabBarFlags_NoTooltip: true,
  ImGui_TabBarFlags_None: true,
  ImGui_TabBarFlags_Reorderable: true,
  ImGui_TabBarFlags_TabListPopupButton: true,
  ImGui_TabItemFlags_Leading: true,
  ImGui_TabItemFlags_NoAssumedClosure: true,
  ImGui_TabItemFlags_NoCloseWithMiddleMouseButton: true,
  ImGui_TabItemFlags_NoPushId: true,
  ImGui_TabItemFlags_NoReorder: true,
  ImGui_TabItemFlags_NoTooltip: true,
  ImGui_TabItemFlags_None: true,
  ImGui_TabItemFlags_SetSelected: true,
  ImGui_TabItemFlags_Trailing: true,
  ImGui_TabItemFlags_UnsavedDocument: true,
  ImGui_TableBgTarget_CellBg: true,
  ImGui_TableBgTarget_None: true,
  ImGui_TableBgTarget_RowBg0: true,
  ImGui_TableBgTarget_RowBg1: true,
  ImGui_TableColumnFlags_AngledHeader: true,
  ImGui_TableColumnFlags_DefaultHide: true,
  ImGui_TableColumnFlags_DefaultSort: true,
  ImGui_TableColumnFlags_Disabled: true,
  ImGui_TableColumnFlags_IndentDisable: true,
  ImGui_TableColumnFlags_IndentEnable: true,
  ImGui_TableColumnFlags_IsEnabled: true,
  ImGui_TableColumnFlags_IsHovered: true,
  ImGui_TableColumnFlags_IsSorted: true,
  ImGui_TableColumnFlags_IsVisible: true,
  ImGui_TableColumnFlags_NoClip: true,
  ImGui_TableColumnFlags_NoHeaderLabel: true,
  ImGui_TableColumnFlags_NoHeaderWidth: true,
  ImGui_TableColumnFlags_NoHide: true,
  ImGui_TableColumnFlags_NoReorder: true,
  ImGui_TableColumnFlags_NoResize: true,
  ImGui_TableColumnFlags_NoSort: true,
  ImGui_TableColumnFlags_NoSortAscending: true,
  ImGui_TableColumnFlags_NoSortDescending: true,
  ImGui_TableColumnFlags_None: true,
  ImGui_TableColumnFlags_PreferSortAscending: true,
  ImGui_TableColumnFlags_PreferSortDescending: true,
  ImGui_TableColumnFlags_WidthFixed: true,
  ImGui_TableColumnFlags_WidthStretch: true,
  ImGui_TableFlags_Borders: true,
  ImGui_TableFlags_BordersH: true,
  ImGui_TableFlags_BordersInner: true,
  ImGui_TableFlags_BordersInnerH: true,
  ImGui_TableFlags_BordersInnerV: true,
  ImGui_TableFlags_BordersOuter: true,
  ImGui_TableFlags_BordersOuterH: true,
  ImGui_TableFlags_BordersOuterV: true,
  ImGui_TableFlags_BordersV: true,
  ImGui_TableFlags_ContextMenuInBody: true,
  ImGui_TableFlags_Hideable: true,
  ImGui_TableFlags_HighlightHoveredColumn: true,
  ImGui_TableFlags_NoClip: true,
  ImGui_TableFlags_NoHostExtendX: true,
  ImGui_TableFlags_NoHostExtendY: true,
  ImGui_TableFlags_NoKeepColumnsVisible: true,
  ImGui_TableFlags_NoPadInnerX: true,
  ImGui_TableFlags_NoPadOuterX: true,
  ImGui_TableFlags_NoSavedSettings: true,
  ImGui_TableFlags_None: true,
  ImGui_TableFlags_PadOuterX: true,
  ImGui_TableFlags_PreciseWidths: true,
  ImGui_TableFlags_Reorderable: true,
  ImGui_TableFlags_Resizable: true,
  ImGui_TableFlags_RowBg: true,
  ImGui_TableFlags_ScrollX: true,
  ImGui_TableFlags_ScrollY: true,
  ImGui_TableFlags_SizingFixedFit: true,
  ImGui_TableFlags_SizingFixedSame: true,
  ImGui_TableFlags_SizingStretchProp: true,
  ImGui_TableFlags_SizingStretchSame: true,
  ImGui_TableFlags_SortMulti: true,
  ImGui_TableFlags_SortTristate: true,
  ImGui_TableFlags_Sortable: true,
  ImGui_TableRowFlags_Headers: true,
  ImGui_TableRowFlags_None: true,
  ImGui_TreeNodeFlags_AllowOverlap: true,
  ImGui_TreeNodeFlags_Bullet: true,
  ImGui_TreeNodeFlags_CollapsingHeader: true,
  ImGui_TreeNodeFlags_DefaultOpen: true,
  ImGui_TreeNodeFlags_FramePadding: true,
  ImGui_TreeNodeFlags_Framed: true,
  ImGui_TreeNodeFlags_Leaf: true,
  ImGui_TreeNodeFlags_NoAutoOpenOnLog: true,
  ImGui_TreeNodeFlags_NoTreePushOnOpen: true,
  ImGui_TreeNodeFlags_None: true,
  ImGui_TreeNodeFlags_OpenOnArrow: true,
  ImGui_TreeNodeFlags_OpenOnDoubleClick: true,
  ImGui_TreeNodeFlags_Selected: true,
  ImGui_TreeNodeFlags_SpanAllColumns: true,
  ImGui_TreeNodeFlags_SpanAvailWidth: true,
  ImGui_TreeNodeFlags_SpanFullWidth: true,
  ImGui_TreeNodeFlags_SpanTextWidth: true,
  ImGui_WindowFlags_AlwaysAutoResize: true,
  ImGui_WindowFlags_AlwaysHorizontalScrollbar: true,
  ImGui_WindowFlags_AlwaysVerticalScrollbar: true,
  ImGui_WindowFlags_HorizontalScrollbar: true,
  ImGui_WindowFlags_MenuBar: true,
  ImGui_WindowFlags_NoBackground: true,
  ImGui_WindowFlags_NoCollapse: true,
  ImGui_WindowFlags_NoDecoration: true,
  ImGui_WindowFlags_NoDocking: true,
  ImGui_WindowFlags_NoFocusOnAppearing: true,
  ImGui_WindowFlags_NoInputs: true,
  ImGui_WindowFlags_NoMouseInputs: true,
  ImGui_WindowFlags_NoMove: true,
  ImGui_WindowFlags_NoNav: true,
  ImGui_WindowFlags_NoNavFocus: true,
  ImGui_WindowFlags_NoNavInputs: true,
  ImGui_WindowFlags_NoResize: true,
  ImGui_WindowFlags_NoSavedSettings: true,
  ImGui_WindowFlags_NoScrollWithMouse: true,
  ImGui_WindowFlags_NoScrollbar: true,
  ImGui_WindowFlags_NoTitleBar: true,
  ImGui_WindowFlags_None: true,
  ImGui_WindowFlags_TopMost: true,
  ImGui_WindowFlags_UnsavedDocument: true,
};
function isReaperImguiFlag(x: ReaperKey): x is ReaperImguiFlag {
  return x in REAPER_IMGUI_FLAGS;
}

// simplified imgui accessor
type Imgui = {
  [K in ReaperKey as RemoveImguiPrefix<K>]: K extends ReaperImguiFlag
    ? number
    : (typeof reaper)[K];
};

type ReaperWithoutImgui = {
  [K in ReaperKey as K extends `ImGui_${string}`
    ? never
    : K]: (typeof reaper)[K];
};
export const r: ReaperWithoutImgui = reaper;

export const im = (() => {
  const im: Partial<Imgui> = {};

  for (const _key of Object.keys(reaper)) {
    const key = _key as ReaperKey;

    if (isReaperImguiFlag(key)) {
      const imguiKey = removeImguiPrefix(key);
      if (imguiKey === null)
        throw new Error(`error processing imgui flag: ${key}`);

      im[imguiKey] = reaper[key]();
    } else {
      const imguiKey = removeImguiPrefix(key);
      if (imguiKey === null) continue;

      im[imguiKey] = reaper[key] as any;
    }
  }

  return im as Imgui;
})();

export enum WindowFlags {
  AlwaysAutoResize = im.WindowFlags_AlwaysAutoResize,
  AlwaysHorizontalScrollbar = im.WindowFlags_AlwaysHorizontalScrollbar,
  AlwaysVerticalScrollbar = im.WindowFlags_AlwaysVerticalScrollbar,
  HorizontalScrollbar = im.WindowFlags_HorizontalScrollbar,
  MenuBar = im.WindowFlags_MenuBar,
  NoBackground = im.WindowFlags_NoBackground,
  NoCollapse = im.WindowFlags_NoCollapse,
  NoDecoration = im.WindowFlags_NoDecoration,
  NoDocking = im.WindowFlags_NoDocking,
  NoFocusOnAppearing = im.WindowFlags_NoFocusOnAppearing,
  NoInputs = im.WindowFlags_NoInputs,
  NoMouseInputs = im.WindowFlags_NoMouseInputs,
  NoMove = im.WindowFlags_NoMove,
  NoNav = im.WindowFlags_NoNav,
  NoNavFocus = im.WindowFlags_NoNavFocus,
  NoNavInputs = im.WindowFlags_NoNavInputs,
  NoResize = im.WindowFlags_NoResize,
  NoSavedSettings = im.WindowFlags_NoSavedSettings,
  NoScrollWithMouse = im.WindowFlags_NoScrollWithMouse,
  NoScrollbar = im.WindowFlags_NoScrollbar,
  NoTitleBar = im.WindowFlags_NoTitleBar,
  None = im.WindowFlags_None,
  TopMost = im.WindowFlags_TopMost,
  UnsavedDocument = im.WindowFlags_UnsavedDocument,
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
  Alt = im.Mod_Alt,
  Ctrl = isMacOS ? im.Mod_Super : im.Mod_Ctrl,
  Shift = im.Mod_Shift,
  Cmd = isMacOS ? im.Mod_Ctrl : im.Mod_Super,
}

export enum MouseButton {
  Left = im.MouseButton_Left,
  Middle = im.MouseButton_Middle,
  Right = im.MouseButton_Right,
}

export enum Color {
  Border = im.Col_Border,
  BorderShadow = im.Col_BorderShadow,
  Button = im.Col_Button,
  ButtonActive = im.Col_ButtonActive,
  ButtonHovered = im.Col_ButtonHovered,
  CheckMark = im.Col_CheckMark,
  ChildBg = im.Col_ChildBg,
  DockingEmptyBg = im.Col_DockingEmptyBg,
  DockingPreview = im.Col_DockingPreview,
  DragDropTarget = im.Col_DragDropTarget,
  FrameBg = im.Col_FrameBg,
  FrameBgActive = im.Col_FrameBgActive,
  FrameBgHovered = im.Col_FrameBgHovered,
  Header = im.Col_Header,
  HeaderActive = im.Col_HeaderActive,
  HeaderHovered = im.Col_HeaderHovered,
  MenuBarBg = im.Col_MenuBarBg,
  ModalWindowDimBg = im.Col_ModalWindowDimBg,
  NavHighlight = im.Col_NavHighlight,
  NavWindowingDimBg = im.Col_NavWindowingDimBg,
  NavWindowingHighlight = im.Col_NavWindowingHighlight,
  PlotHistogram = im.Col_PlotHistogram,
  PlotHistogramHovered = im.Col_PlotHistogramHovered,
  PlotLines = im.Col_PlotLines,
  PlotLinesHovered = im.Col_PlotLinesHovered,
  PopupBg = im.Col_PopupBg,
  ResizeGrip = im.Col_ResizeGrip,
  ResizeGripActive = im.Col_ResizeGripActive,
  ResizeGripHovered = im.Col_ResizeGripHovered,
  ScrollbarBg = im.Col_ScrollbarBg,
  ScrollbarGrab = im.Col_ScrollbarGrab,
  ScrollbarGrabActive = im.Col_ScrollbarGrabActive,
  ScrollbarGrabHovered = im.Col_ScrollbarGrabHovered,
  Separator = im.Col_Separator,
  SeparatorActive = im.Col_SeparatorActive,
  SeparatorHovered = im.Col_SeparatorHovered,
  SliderGrab = im.Col_SliderGrab,
  SliderGrabActive = im.Col_SliderGrabActive,
  Tab = im.Col_Tab,
  TabDimmed = im.Col_TabDimmed,
  TabDimmedSelected = im.Col_TabDimmedSelected,
  TabDimmedSelectedOverline = im.Col_TabDimmedSelectedOverline,
  TabHovered = im.Col_TabHovered,
  TabSelected = im.Col_TabSelected,
  TabSelectedOverline = im.Col_TabSelectedOverline,
  TableBorderLight = im.Col_TableBorderLight,
  TableBorderStrong = im.Col_TableBorderStrong,
  TableHeaderBg = im.Col_TableHeaderBg,
  TableRowBg = im.Col_TableRowBg,
  TableRowBgAlt = im.Col_TableRowBgAlt,
  Text = im.Col_Text,
  TextDisabled = im.Col_TextDisabled,
  TextSelectedBg = im.Col_TextSelectedBg,
  TitleBg = im.Col_TitleBg,
  TitleBgActive = im.Col_TitleBgActive,
  TitleBgCollapsed = im.Col_TitleBgCollapsed,
  WindowBg = im.Col_WindowBg,
}

export enum StyleVar {
  Alpha = im.StyleVar_Alpha,
  ButtonTextAlign = im.StyleVar_ButtonTextAlign,
  CellPadding = im.StyleVar_CellPadding,
  ChildBorderSize = im.StyleVar_ChildBorderSize,
  ChildRounding = im.StyleVar_ChildRounding,
  DisabledAlpha = im.StyleVar_DisabledAlpha,
  FrameBorderSize = im.StyleVar_FrameBorderSize,
  FramePadding = im.StyleVar_FramePadding,
  FrameRounding = im.StyleVar_FrameRounding,
  GrabMinSize = im.StyleVar_GrabMinSize,
  GrabRounding = im.StyleVar_GrabRounding,
  IndentSpacing = im.StyleVar_IndentSpacing,
  ItemInnerSpacing = im.StyleVar_ItemInnerSpacing,
  ItemSpacing = im.StyleVar_ItemSpacing,
  PopupBorderSize = im.StyleVar_PopupBorderSize,
  PopupRounding = im.StyleVar_PopupRounding,
  ScrollbarRounding = im.StyleVar_ScrollbarRounding,
  ScrollbarSize = im.StyleVar_ScrollbarSize,
  SelectableTextAlign = im.StyleVar_SelectableTextAlign,
  SeparatorTextAlign = im.StyleVar_SeparatorTextAlign,
  SeparatorTextBorderSize = im.StyleVar_SeparatorTextBorderSize,
  SeparatorTextPadding = im.StyleVar_SeparatorTextPadding,
  TabBarBorderSize = im.StyleVar_TabBarBorderSize,
  TabBorderSize = im.StyleVar_TabBorderSize,
  TabRounding = im.StyleVar_TabRounding,
  TableAngledHeadersAngle = im.StyleVar_TableAngledHeadersAngle,
  TableAngledHeadersTextAlign = im.StyleVar_TableAngledHeadersTextAlign,
  WindowBorderSize = im.StyleVar_WindowBorderSize,
  WindowMinSize = im.StyleVar_WindowMinSize,
  WindowPadding = im.StyleVar_WindowPadding,
  WindowRounding = im.StyleVar_WindowRounding,
  WindowTitleAlign = im.StyleVar_WindowTitleAlign,
}

export function withStyle<T>(
  ctx: ImGui_Context,
  styles: (
    | { var: StyleVar; a: number; b?: number }
    | { color: Color; rgba: number }
  )[],
  func: () => T,
): T {
  let varCount = 0;
  let colorCount = 0;

  for (const style of styles) {
    if ("var" in style) {
      if ("b" in style) {
        im.PushStyleVar(ctx, style.var, style.a, style.b);
      } else {
        im.PushStyleVar(ctx, style.var, style.a);
      }
      varCount += 1;
    } else {
      im.PushStyleColor(ctx, style.color, style.rgba);
      colorCount += 1;
    }
  }

  const rv = func();

  if (colorCount > 0) im.PopStyleColor(ctx, colorCount);
  if (varCount > 0) im.PopStyleVar(ctx, varCount);

  return rv;
}
