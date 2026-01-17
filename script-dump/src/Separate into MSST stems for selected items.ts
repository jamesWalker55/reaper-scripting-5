AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as Path from "reaper-api/path/path";
import { Item, Take } from "reaper-api/track";
import { confirmBox, errorHandler, log, msgBox } from "reaper-api/utils";

const MSST_OUTPUT_DIR = "D:/Audio Samples/_Acapella/MSST";

function getTakeFileStem(take: Take) {
  const source = take.getSource().findRootParent();
  const filePath = source.getFilename();
  return Path.splitext(Path.split(filePath)[1])[0];
}

function getTakeFilePath(take: Take) {
  const source = take.getSource().findRootParent();
  const filePath = source.getFilename();
  return filePath;
}

function takeHasMSSTStems(take: Take): boolean {
  const name = getTakeFileStem(take);

  // get msst stem locations
  const drumsPath = Path.join(MSST_OUTPUT_DIR, `${name}_drums.flac`);
  const vocalsPath = Path.join(MSST_OUTPUT_DIR, `${name}_vocals.flac`);
  const otherPath = Path.join(MSST_OUTPUT_DIR, `${name}_other.flac`);
  const residualPath = Path.join(MSST_OUTPUT_DIR, `${name}_residual.flac`);
  const bassPath = Path.join(MSST_OUTPUT_DIR, `${name}_bass.flac`);

  // ensure paths exist
  if (!reaper.file_exists(drumsPath)) {
    return false;
  }
  if (!reaper.file_exists(vocalsPath)) {
    return false;
  }
  if (!reaper.file_exists(otherPath)) {
    return false;
  }
  if (!reaper.file_exists(residualPath)) {
    return false;
  }
  if (!reaper.file_exists(bassPath)) {
    return false;
  }

  return true;
}

/**
 * cmd has fucked up quoting rules, see:
 * https://docs.python.org/3/library/shlex.html
 *
 * in cmd, run:
 *
 *     pwsh -c "echo """a """"""b c d""" """q w e r""""
 *
 * @param x
 * @returns
 */
function nestedQuoteTerm(x: string) {
  if (x.includes('"'))
    throw new Error(
      `Cannot quote term that contains doublequote: ${inspect(x)}`,
    );

  return `"""${x}"""`;
}

function runMSST(paths: string[]) {
  // quote paths with "..."
  paths = paths.map((x) => nestedQuoteTerm(x));

  const cmd = `pwsh -c "msst demix ${paths.join(" ")}; pause"`;

  reaper.ExecProcess(cmd, -1);
}

function main() {
  const items = Item.getSelected();

  const paths = new Set<string>();

  // scan for items that need to be separated
  for (const item of items) {
    const take = item.activeTake();
    if (take === null) {
      log("item has no take, skipping");
      continue;
    }

    // skip if item already has msst stems
    if (takeHasMSSTStems(take)) continue;

    const path = getTakeFilePath(take);
    paths.add(path);
  }

  // Prompt user to continue or not
  if (paths.size === 0) {
    msgBox("Separate into MSST stems", "All items already have stems!");
    return;
  }
  if (
    !confirmBox(
      "Separate into MSST stems",
      `Will separate stems for ${paths.size} items.\nContinue?`,
    )
  ) {
    return;
  }

  // generate stems
  runMSST(Array.from(paths));
}

errorHandler(main);
