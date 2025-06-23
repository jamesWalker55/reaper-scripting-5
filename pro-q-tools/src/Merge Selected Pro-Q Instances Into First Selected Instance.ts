AddCwdToImportPaths();

import { FX } from "reaper-api/fx";
import { getSelectedFx } from "reaper-api/selectedFx";
import { confirmBox, errorHandler, msgBox, undoBlock } from "reaper-api/utils";
import {
  coerceVSTType,
  convertQ3toQ4,
  convertQ4toQ3,
  getBands,
  getProQType,
  ProQType,
  Q3Band,
  Q4Band,
  Q4Feature,
  setQ3Band,
  setQ4Band,
} from "./proq";

function main() {
  const selectedFx = getSelectedFx();

  const proqs: {
    fx: FX;
    ident: string;
    type: "VST" | "VST3";
    proq: ProQType;
  }[] = [];
  for (const fx of selectedFx) {
    const ident = fx.getIdent();
    const type = coerceVSTType(fx.getType());
    const proq = getProQType(ident);
    if (proq === null) continue;
    if (type === null) continue;

    proqs.push({ fx, ident, type, proq });
  }
  // only proceed if multiple proq instances found
  if (proqs.length < 2) return;

  // first instance will be the target
  const targetProq = proqs.shift()!;
  const emptyBands = getBands(targetProq.fx, targetProq.proq)
    .map((x, i) => ({ band: x, idx: i }))
    .filter((x) => x.band.used < 0.5) // find bands that are unused
    .map((x) => x.idx);

  // find bands to be added to first instance
  const newBands = proqs.flatMap(({ fx, ident, type, proq }) =>
    getBands(fx, proq).filter((x) => x.used > 0.5 && x.enabled > 0.5),
  );
  if (newBands.length > emptyBands.length) {
    msgBox(
      "Failed to merge",
      `Too many bands across selected Pro-Q instances!\n\nPro-Q supports a maximum of 24 bands per FX, but the selected instances would add an additional ${newBands.length} bands to an instance with only ${emptyBands.length} empty slots left.`,
    );
    return;
  }

  // convert the bands to the target
  const UNDO_NAME = `Merge selected Pro-Q instances into first selected Pro-Q instance`;
  const UNDO_FLAG = 1 | 2;
  switch (targetProq.proq) {
    case ProQType.Q3:
      {
        const convertedBatch = newBands.map((band) =>
          band.version === 4 ? convertQ4toQ3(band) : { band, downgraded: null },
        );

        // count how many downgraded features there are in total
        const downgradedCount: Record<Q4Feature, number> = {
          [Q4Feature.AllPass]: 0,
          [Q4Feature.AttackRelease]: 0,
          [Q4Feature.ExternalSidechain]: 0,
          [Q4Feature.SidechainFiltering]: 0,
          [Q4Feature.Spectral]: 0,
        };
        for (const { downgraded } of convertedBatch) {
          if (downgraded === null) continue;

          if (downgraded.has(Q4Feature.AllPass))
            downgradedCount[Q4Feature.AllPass] += 1;
          if (downgraded.has(Q4Feature.AttackRelease))
            downgradedCount[Q4Feature.AttackRelease] += 1;
          if (downgraded.has(Q4Feature.ExternalSidechain))
            downgradedCount[Q4Feature.ExternalSidechain] += 1;
          if (downgraded.has(Q4Feature.SidechainFiltering))
            downgradedCount[Q4Feature.SidechainFiltering] += 1;
          if (downgraded.has(Q4Feature.Spectral))
            downgradedCount[Q4Feature.Spectral] += 1;
        }

        // if any are downgraded, show a warning
        if (Object.values(downgradedCount).some((x) => x > 0)) {
          let msg = ["Some bands were using Pro-Q4-exclusive features:", ""];

          if (downgradedCount[Q4Feature.AllPass] > 0)
            msg.push(
              `* All-pass bands X ${downgradedCount[Q4Feature.AllPass]}`,
            );
          if (downgradedCount[Q4Feature.AttackRelease] > 0)
            msg.push(
              `* Manual attack/release bands X ${
                downgradedCount[Q4Feature.AttackRelease]
              }`,
            );
          if (downgradedCount[Q4Feature.ExternalSidechain] > 0)
            msg.push(
              `* External sidechain bands X ${
                downgradedCount[Q4Feature.ExternalSidechain]
              }`,
            );
          if (downgradedCount[Q4Feature.SidechainFiltering] > 0)
            msg.push(
              `* Sidechain filtering bands X ${
                downgradedCount[Q4Feature.SidechainFiltering]
              }`,
            );
          if (downgradedCount[Q4Feature.Spectral] > 0)
            msg.push(
              `* Spectral bands X ${downgradedCount[Q4Feature.Spectral]}`,
            );

          msg.push(
            "",
            "These bands will be downgraded upon merging with the selected Pro-Q3 instance. Proceed?",
          );

          if (!confirmBox("Some bands will be downgraded", msg.join("\n"))) {
            // stop processing
            return;
          }
        }

        // get the bands
        const convertedBands: Q3Band[] = convertedBatch
          .map((x) => x.band)
          .filter((x) => x !== null);

        // apply bands to target
        undoBlock(UNDO_NAME, UNDO_FLAG, () => {
          // set bands in the instance
          for (const band of convertedBands) {
            const targetIdx = emptyBands.shift()!;

            setQ3Band(targetProq.fx, targetIdx, band);
          }

          // delete the remaining proq instances
          // reverse sort from back
          proqs.sort((a, b) => b.fx.fxidx - a.fx.fxidx);
          for (const proq of proqs) {
            proq.fx.chain.Delete(proq.fx.fxidx);
          }
        });
      }
      break;
    case ProQType.Q4:
      {
        const convertedBands: Q4Band[] = newBands.map((band) =>
          band.version === 3 ? convertQ3toQ4(band) : band,
        );

        // apply bands to target
        undoBlock(UNDO_NAME, UNDO_FLAG, () => {
          // set bands in the instance
          for (const band of convertedBands) {
            const targetIdx = emptyBands.shift()!;

            setQ4Band(targetProq.fx, targetIdx, band);
          }

          // delete the remaining proq instances
          // reverse sort from back
          proqs.sort((a, b) => b.fx.fxidx - a.fx.fxidx);
          for (const proq of proqs) {
            proq.fx.chain.Delete(proq.fx.fxidx);
          }
        });
      }
      break;
    default:
      targetProq.proq satisfies never;
  }
}

errorHandler(main);
