export const HEIGHT = 220;

export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type Color = RGB | RGBA;

export function color(x: number): RGB {
  return [(x >>> 16) & 255, (x >>> 8) & 255, x & 255];
}

export function rgb(r: number, g: number, b: number): RGB {
  return [r, g, b];
}

export function rgba(r: number, g: number, b: number, a: number): RGBA {
  return [r, g, b, a];
}

export function withAlpha(color: RGB, a: number): RGBA {
  return [...color, a];
}

type Expr = number | string; // can be an evaluated expression

const DEFAULT_PRIMITIVE_COLOR: RGBA = rgba(60, 60, 60, 0.5);

type CircleDrawing = {
  type: "circle";
  color: Color;
  radius: Expr;
  x: Expr;
  y: Expr;
};
const defaultCircleDrawing = (): CircleDrawing => ({
  type: "circle",
  color: DEFAULT_PRIMITIVE_COLOR,
  radius: 32,
  x: 0,
  y: 0,
});

type PieDrawing = {
  type: "pie";
  color: Color;
  angle_min: Expr;
  angle_max: Expr;
  radius_outer: Expr;
  radius_inner: Expr;
  x: Expr;
  y: Expr;
};
const defaultPieDrawing = (): PieDrawing => ({
  type: "pie",
  color: DEFAULT_PRIMITIVE_COLOR,
  angle_min: 0.75,
  angle_max: 2.25,
  radius_outer: 32,
  radius_inner: 16,
  x: 0,
  y: 0,
});

type RectDrawing = {
  type: "rect";
  color: Color;
  width: Expr;
  height: Expr;
  rounding: Expr;
  x: Expr;
  y: Expr;
};
const defaultRectDrawing = (): RectDrawing => ({
  type: "rect",
  color: DEFAULT_PRIMITIVE_COLOR,
  width: 32,
  height: 24,
  rounding: 3,
  x: 0,
  y: 0,
});

type Drawing = CircleDrawing | PieDrawing | RectDrawing;

type FontSettings = {
  size: number;
  family: string;
  weight: "normal" | "bold";
};

type Side =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topleft"
  | "topright"
  | "bottomleft"
  | "bottomright";

type ParameterValue = {
  anchor: Side;
  position: Side;
  x: Expr;
  y: Expr;
  format: string;
} & { [K in keyof FontSettings as `font_${K}`]: FontSettings[K] };

type ParameterLabel = {
  anchor: Side;
  position: Side;
  x: Expr;
  y: Expr;
} & { [K in keyof FontSettings as `font_${K}`]: FontSettings[K] };

type WidgetType = "knob";

type Parameter = {
  // for matching the param
  fx_id: number;
  fx_name: string;

  x: number;
  y: number;
  w: number;
  h: number;

  widget_type: WidgetType;
  hide_widget: boolean;

  value: ParameterValue;
  label: ParameterLabel;

  drawings: Drawing[];
};

type FXLayout = {
  panel: {
    width: number;
    color: Color;
  };
  title: {
    width: number;
    color: Color;
    name: string | null;
  };
  parameters: Parameter[];
};
const defaultFXLayout = (): FXLayout => ({
  panel: {
    width: 160,
    color: rgb(45, 45, 45),
  },
  title: {
    width: 160,
    color: rgb(60, 60, 60),
    name: null,
  },
  parameters: [],
});
