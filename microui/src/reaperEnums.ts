export enum Mode {
  Default = 0,
  AdditiveBlend = 1,
  DisableSourceAlpha = 2,
  DisableFilterings = 4,
}

export enum MouseCap {
  None = 0,
  LeftMouse = 1,
  RightMouse = 2,
  CommandKey = 4,
  ShiftKey = 8,
  OptionKey = 16,
  ControlKey = 32,
  MiddleMouse = 64,
}

export enum DrawStrFlags {
  None = 0,
  CenterHorizontally = 1,
  JustifyRight = 2,
  CenterVertically = 4,
  JustifyBottom = 8,
  /** ignore right/bottom, otherwise text is clipped to (gfx.x, gfx.y, right, bottom) */
  Unbounded = 256,
}
