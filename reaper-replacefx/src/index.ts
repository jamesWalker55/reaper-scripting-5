AddCwdToImportPaths();

import { encode } from "json";
import { createContext, microUILoop, Option } from "reaper-microui";
import { getLastTouchedFx } from "reaper-api/fx";

function main() {
  gfx.init("My window", 260, 450);
  gfx.setfont(1, "Arial", 16);

  const ctx = createContext();

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

        fx.getParameters().forEach((param, i) => {
          const title = `${i}. ${param.getName()} (${param.getIdentifier()})`;

          if (ctx.header(title)) {
            const info = param.getModulationInfo();
            if (!info) {
              ctx.layoutRow([-1], 0);
              ctx.label("null");
              return;
            }

            ctx.layoutRow([60, -1], 0);

            Object.entries(info).forEach(([k, v]) => {
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
