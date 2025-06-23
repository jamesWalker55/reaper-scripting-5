AddCwdToImportPaths();

import { decode } from "json";
import { paste } from "reaper-api/clipboard";
import { getLastTouchedFx } from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { confirmBox, errorHandler, msgBox, undoBlock } from "reaper-api/utils";
import {
  coerceVSTType,
  convertQ3toQ4,
  convertQ4toQ3,
  getProQType,
  isQ3Band,
  isQ4Band,
  NOOP_Q3,
  NOOP_Q4,
  ProQType,
  Q3Band,
  Q4Band,
  Q4Feature,
  setQ3Band,
  setQ4Band,
} from "./proq";

function isListOfBands(x: unknown): x is (Q3Band | Q4Band)[] {
  if (!Array.isArray(x)) {
    return false;
  }

  for (const element of x) {
    if (!isQ3Band(element) && !isQ4Band(element)) return false;
  }

  return true;
}

function main() {
  const fx = getLastTouchedFx();
  if (fx === null) return;

  const ident = fx.getIdent();
  const type = coerceVSTType(fx.getType());
  const proq = getProQType(ident);
  if (proq === null) {
    msgBox(
      "Error",
      `Last touched FX is not a Pro-Q instance!\n\nDebug info:\n${inspect(
        ident,
      )}\n${inspect(fx.getType())}`,
    );
    return;
  }
  if (type === null) {
    msgBox(
      "Error",
      `Unsupported plugin type for last touched Pro-Q instance.\n\nDebug info:\n${inspect(
        ident,
      )}\n${inspect(fx.getType())}`,
    );
    return;
  }

  const data = decode(paste());
  if (!Array.isArray(data)) {
    msgBox("Error", "Clipboard does not contain Pro-Q bands data.");
    return;
  }
  if (!isListOfBands(data)) {
    msgBox(
      "Error",
      "Clipboard Pro-Q bands data is malformed, please check your clipboard text for errors.",
    );
    return;
  }

  // ensure there are 24 bands in total
  while (data.length < 24) {
    switch (proq) {
      case ProQType.Q3:
        data.push(NOOP_Q3);
        break;
      case ProQType.Q4:
        data.push(NOOP_Q4);
        break;
      default:
        proq satisfies never;
    }
  }
  while (data.length > 24) {
    data.pop();
  }

  const UNDO_NAME = `Paste EQ bands to last touched Pro-Q instance`;
  const UNDO_FLAG = 2;
  switch (proq) {
    case ProQType.Q3:
      {
        const convertedBatch = data.map((band) =>
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
            "These bands will be downgraded upon pasting into the selected Pro-Q3 instance. Proceed?",
          );

          if (!confirmBox("Some bands will be downgraded", msg.join("\n"))) {
            // stop processing
            return;
          }
        }

        // get the bands
        const bands: Q3Band[] = convertedBatch
          .map((x) => x.band)
          .filter((x) => x !== null);

        undoBlock(UNDO_NAME, UNDO_FLAG, () => {
          bands.forEach((band, i) => setQ3Band(fx, i, band));
        });
      }
      break;
    case ProQType.Q4:
      {
        const bands = data.map((band) =>
          band.version === 3 ? convertQ3toQ4(band) : band,
        );

        undoBlock(UNDO_NAME, UNDO_FLAG, () => {
          bands.forEach((band, i) => setQ4Band(fx, i, band));
        });
      }
      break;
    default:
      proq satisfies never;
  }
}

errorHandler(main);
