import { ColorId, Context, MouseButton, Response } from "microui";

export function interactiveLabel<T>(
  ctx: Context<T>,
  labelid: string,
  label: string,
): Response | false {
  let res: Response | 0 = 0;

  const id = ctx.getId(labelid);
  const r = ctx.layoutNext();
  ctx.updateControl(id, r, 0);

  // handle click
  if (ctx.mousePressed === MouseButton.Left && ctx.focus === id) {
    res |= Response.Submit;
  }

  // draw
  const colorid =
    ctx.focus === id || ctx.hover === id ? ColorId.ButtonFocus : ColorId.Text;
  ctx.drawControlText(label, r, colorid, 0);

  return res === 0 ? false : res;
}
