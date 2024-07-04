AddCwdToImportPaths();

import { encode } from "json";
import { createContext, microUILoop, Option } from "rpts-microui";
import { getLastTouchedFx } from "./lastFocusedFx";

function main() {
  gfx.init("My window", 260, 450);
  gfx.setfont(1, "Arial", 16);

  const ctx = createContext();

  const openParams: Record<number, boolean | undefined> = {};

  microUILoop(ctx, () => {
    const fx = getLastTouchedFx();

    ctx.begin();

    if (
      ctx.beginWindow(
        "Demo Window",
        { x: 0, y: 0, w: 0, h: 0 },
        Option.NoResize | Option.NoTitle | Option.NoClose,
      )
    ) {
      const win = ctx.getCurrentContainer();
      win.rect.w = gfx.w;
      win.rect.h = gfx.h;

      if (fx === null) {
        ctx.text("null");
      } else {
        ctx.text(encode({ type: fx.type, fxid: fx.fxidx }));

        ctx.layoutRow([80, -1], 0);

        ctx.label("Parent type");
        ctx.label(fx.type);

        ctx.label("FX index");
        ctx.label(fx.fxidx.toString());

        const parms: string[] = ["pdc", "fx_type", "fx_name", "fx_ident"];
        for (const parm of parms) {
          ctx.label(parm);
          ctx.label(fx.GetNamedConfigParm(parm) ?? "<FAILED>");
        }

        // const GetNumParams =
        //   fx.type === "track"
        //     ? (idx: number) => reaper.TrackFX_GetNumParams(fx.track, idx)
        //     : (idx: number) => reaper.TakeFX_GetNumParams(fx.take, idx);
        // const paramsCount = GetNumParams(fx.fxidx);

        // const GetParamIdent =
        //   fx.type === "track"
        //     ? (idx: number, param: number) =>
        //         reaper.TrackFX_GetParamIdent(fx.track, idx, param)
        //     : (idx: number, param: number) =>
        //         reaper.TakeFX_GetParamIdent(fx.take, idx, param);
        // const GetParamName =
        //   fx.type === "track"
        //     ? (idx: number, param: number) =>
        //         reaper.TrackFX_GetParamName(fx.track, idx, param)
        //     : (idx: number, param: number) =>
        //         reaper.TakeFX_GetParamName(fx.take, idx, param);

        fx.getParameters().forEach(({ ident, name }, i) => {
          const title = `${i}. ${name} (${ident})`;

          if (ctx.header(title)) {
            const modInfo = fx.getModInfo(i);
            if (!modInfo) {
              ctx.layoutRow([-1], 0);
              ctx.label("null");
              return;
            }

            ctx.layoutRow([60, -1], 0);

            Object.entries(modInfo).forEach(([k, v]) => {
              ctx.label(k);
              ctx.text(encode(v));
            });
          }
        });
      }

      ctx.endWindow();
    }

    ctx.end();
  });
}

main();
