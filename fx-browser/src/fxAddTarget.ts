import { AddFxParams, generateFxidx } from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { Take, Track } from "reaper-api/track";
import { assertUnreachable } from "reaper-api/utils";
import { getFXTarget } from "./detectTarget";

export type FxTarget = {
  getDisplayName(): string;
  addFx(fx: AddFxParams): void;
};

/**
 * Wrapper for `detectTarget` to cache data (avoid repeated calls to reaper)
 * AND helper method to add FX to target.
 */
export function resolveFxAddTarget(): FxTarget {
  const fxTarget = getFXTarget();
  if (!fxTarget)
    throw new Error("Please click on a track before running this script!");

  const fxpathName =
    fxTarget.fxpath.path.length > 0
      ? ` > FX ${fxTarget.fxpath.path.map((x) => x + 1).join(" > ")}`
      : "";

  switch (fxTarget.target) {
    case "track": {
      const track = new Track(fxTarget.track);

      return {
        getDisplayName() {
          const trackIdx = track.getIdx() + 1;
          if (trackIdx === 0) {
            return `Master Track${fxpathName}`;
          } else {
            return `Track ${trackIdx} ${inspect(track.name)}${fxpathName}`;
          }
        },
        addFx(fx: AddFxParams) {
          const destpath = [...fxTarget.fxpath.path];

          // append FX count to the end of the path
          if (destpath.length === 0) {
            const count = track.getFxCount();
            destpath.push(count);
          } else {
            const destContainerFxid = generateFxidx({
              track: track.obj,
              path: fxTarget.fxpath.path,
              flags: fxTarget.fxpath.flags,
            });
            const [ok, count] = reaper.TrackFX_GetNamedConfigParm(
              track.obj,
              destContainerFxid,
              "container_count",
            );
            if (!ok)
              throw new Error(
                `failed to get container_count for ${inspect({
                  ...fxTarget.fxpath,
                  flags: `0x${fxTarget.fxpath.flags.toString(16)}`,
                  destContainerFxid: `0x${destContainerFxid.toString(16)}`,
                })}`,
              );

            destpath.push(parseInt(count));
          }

          const newPos = track.addFx(fx, {
            path: destpath,
            flags: fxTarget.fxpath.flags,
          });
          if (newPos === null) {
            throw new Error(
              `failed to add fx ${inspect(fx)} to dest ${destpath}`,
            );
          }

          // SetOpen doesn't work inside containers, only call this if the target is the root fxchain
          if (destpath.length === 1)
            reaper.TrackFX_SetOpen(track.obj, newPos, true);
        },
      };
    }
    case "take": {
      const track = new Track(fxTarget.track);
      const take = new Take(fxTarget.take);
      return {
        getDisplayName() {
          const trackIdx = track.getIdx() + 1;
          const takeName = take.name;
          return `Take ${inspect(
            takeName,
          )} (on Track ${trackIdx})${fxpathName}`;
        },
        addFx(fx: AddFxParams) {
          const destpath = [...fxTarget.fxpath.path];

          // append FX count to the end of the path
          if (destpath.length === 0) {
            const count = take.getFxCount();
            destpath.push(count);
          } else {
            const destContainerFxid = generateFxidx({
              take: take.obj,
              ...fxTarget.fxpath,
            });
            const [ok, count] = reaper.TakeFX_GetNamedConfigParm(
              take.obj,
              destContainerFxid,
              "container_count",
            );
            if (!ok)
              throw new Error(
                `failed to get container_count for ${inspect(fxTarget.fxpath)}`,
              );

            destpath.push(parseInt(count));
          }

          const newPos = take.addFx(fx, {
            path: destpath,
            flags: fxTarget.fxpath.flags,
          });
          if (newPos === null) {
            throw new Error(
              `failed to add fx ${inspect(fx)} to dest ${destpath}`,
            );
          }

          // SetOpen doesn't work inside containers, only call this if the target is the root fxchain
          if (destpath.length === 1)
            reaper.TakeFX_SetOpen(take.obj, newPos, true);
        },
      };
    }
    default:
      assertUnreachable(fxTarget);
  }
}
