AddCwdToImportPaths();

import * as Path from "reaper-api/path/path";
import { Item, Take, Track } from "reaper-api/track";
import { errorHandler, log, runMainAction, undoBlock } from "reaper-api/utils";

const MSST_OUTPUT_DIR = "D:/Audio Samples/_Acapella/MSST";
const ACTION_BUILD_MISSING_PEAKS = 40047;

function getTakeFileStem(take: Take) {
  const source = take.getSource().findRootParent();
  const filePath = source.getFilename();
  return Path.splitext(Path.split(filePath)[1])[0];
}

function setStemTrackItem(origin: Item, track: Track, stemPath: string) {
  // clear existing items in track
  {
    const start = origin.position;
    const end = origin.position + origin.length;
    for (const item of track.allItems()) {
      const a = item.position;
      const b = item.position + item.length;
      if (a < start && b > start) {
        item.delete();
      } else if (start <= a && a < end) {
        item.delete();
      } else if (end <= a) {
        // not in range
      }
    }
  }

  const originTake = origin.activeTake()!;

  const item = new Item(reaper.AddMediaItemToTrack(track.obj));
  const take = new Take(reaper.AddTakeToMediaItem(item.obj));
  const source = reaper.PCM_Source_CreateFromFile(stemPath);
  reaper.SetMediaItemTake_Source(take.obj, source);

  take.name = Path.split(stemPath)[1];
  take.pan = originTake.pan;
  take.pitch = originTake.pitch;
  take.playrate = originTake.playrate;
  take.preservePitch = originTake.preservePitch;
  take.sourceStartOffset = originTake.sourceStartOffset;
  take.volume = originTake.volume;

  item.color = origin.color;
  item.fadeInLength = origin.fadeInLength;
  item.fadeOutLength = origin.fadeOutLength;
  item.length = origin.length;
  item.loop = origin.loop;
  item.position = origin.position;
  item.snapOffset = origin.snapOffset;
  item.volume = origin.volume;
}

function main() {
  undoBlock("Insert MSST stems for selected items", 4, () => {
    const items = Item.getSelected();

    for (const item of items) {
      const take = item.activeTake();
      if (take === null) {
        log("item has no take, skipping");
        continue;
      }
      const name = getTakeFileStem(take);

      // get stem tracks
      let drumsTrack: Track | null = null;
      let vocalsTrack: Track | null = null;
      let otherTrack: Track | null = null;
      let residualTrack: Track | null = null;
      let bassTrack: Track | null = null;
      {
        const itemTrack = item.getTrack().getIdx();

        for (let i = itemTrack + 1; i <= itemTrack + 5; i++) {
          const track = Track.getByIdx(i);
          if (track.name.includes("drum")) {
            drumsTrack = track;
          } else if (track.name.includes("vocal")) {
            vocalsTrack = track;
          } else if (track.name.includes("other")) {
            otherTrack = track;
          } else if (track.name.includes("residual")) {
            residualTrack = track;
          } else if (track.name.includes("bass")) {
            bassTrack = track;
          }
        }
        if (drumsTrack === null) {
          log("failed to find drum track, skipping");
          continue;
        }
        if (vocalsTrack === null) {
          log("failed to find vocal track, skipping");
          continue;
        }
        if (otherTrack === null) {
          log("failed to find other track, skipping");
          continue;
        }
        if (residualTrack === null) {
          log("failed to find residual track, skipping");
          continue;
        }
        if (bassTrack === null) {
          log("failed to find bass track, skipping");
          continue;
        }
      }

      // get msst stem locations
      const drumsPath = Path.join(MSST_OUTPUT_DIR, `${name}_drums.flac`);
      const vocalsPath = Path.join(MSST_OUTPUT_DIR, `${name}_vocals.flac`);
      const otherPath = Path.join(MSST_OUTPUT_DIR, `${name}_other.flac`);
      const residualPath = Path.join(MSST_OUTPUT_DIR, `${name}_residual.flac`);
      const bassPath = Path.join(MSST_OUTPUT_DIR, `${name}_bass.flac`);
      // ensure paths exist
      {
        if (!reaper.file_exists(drumsPath)) {
          log("drums stem does not exist:", drumsPath);
          log(`skipping ${name}`);
          continue;
        }
        if (!reaper.file_exists(vocalsPath)) {
          log("vocals stem does not exist:", vocalsPath);
          log(`skipping ${name}`);
          continue;
        }
        if (!reaper.file_exists(otherPath)) {
          log("other stem does not exist:", otherPath);
          log(`skipping ${name}`);
          continue;
        }
        if (!reaper.file_exists(residualPath)) {
          log("residual stem does not exist:", residualPath);
          log(`skipping ${name}`);
          continue;
        }
        if (!reaper.file_exists(bassPath)) {
          log("bass stem does not exist:", bassPath);
          log(`skipping ${name}`);
          continue;
        }
      }

      setStemTrackItem(item, drumsTrack, drumsPath);
      setStemTrackItem(item, vocalsTrack, vocalsPath);
      setStemTrackItem(item, otherTrack, otherPath);
      setStemTrackItem(item, residualTrack, residualPath);
      setStemTrackItem(item, bassTrack, bassPath);
    }
  });

  runMainAction(ACTION_BUILD_MISSING_PEAKS);
}

errorHandler(main);
