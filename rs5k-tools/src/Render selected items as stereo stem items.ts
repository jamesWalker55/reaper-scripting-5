AddCwdToImportPaths();

import { Item, Track } from "reaper-api/track";
import { errorHandler, log, runMainAction, undoBlock } from "reaper-api/utils";
import { setTimeSelection, withSavedTimeSelection } from "./utils";

const SCRIPT_NAME = "Render selected items as stereo stem items";

function main() {
  undoBlock(() => {
    withSavedTimeSelection(() => {
      const trackItems: LuaTable<MediaTrack, Item[]> = new LuaTable();

      for (const item of Item.getSelected()) {
        const track = item.getTrack();

        if (trackItems.get(track.obj) === null) trackItems.set(track.obj, []);
        const items = trackItems.get(track.obj);

        items.push(item);
      }

      for (const [trackObj, items] of trackItems) {
        const track = new Track(trackObj);
        const trackWasMuted = track.getMuted();

        let outputTrack: Track | null = null;

        log(`Processing track ${track.getIdx()}`);

        for (const item of items) {
          // save current state
          // select item
          const pos = item.getPosition();
          const len = item.getLength();
          setTimeSelection(pos, pos + len);

          log(`  item at ${pos}s:`);

          // render stem for time selection
          reaper.SetOnlyTrackSelected(track.obj);
          track.setMuted(false);
          runMainAction("_SWS_AWRENDERSTEREOSMART");
          const renderedTrackIdx = track.getIdx() - 1;
          log(`    rendered track idx = ${renderedTrackIdx}`);

          // get the rendered item (should be on a new track)
          const renderedTrack = Track.getByIdx(renderedTrackIdx);
          let renderedItem: Item | null = null;
          {
            // check if this is the new track it rendered to
            for (const x of renderedTrack.iterItems()) {
              if (renderedItem !== null)
                throw new Error(
                  `Expected track ${renderedTrackIdx} to contain exactly 1 item`,
                );
              renderedItem = x;
            }
            if (renderedItem === null)
              throw new Error(
                `Expected track ${renderedTrackIdx} to contain exactly 1 item`,
              );

            const isMidiItem = renderedItem.activeTake()?.isMidi();
            if (isMidiItem === true || isMidiItem === undefined)
              throw new Error(
                `Expected item on track ${renderedTrackIdx} to be audio`,
              );
          }
          log(`    rendered item pos = ${renderedItem.getPosition()}`);

          if (outputTrack === null) {
            // keep this track
            outputTrack = renderedTrack;
            log(`    set output track = ${renderedTrackIdx}`);
          } else {
            log(`    output track = ${outputTrack.getIdx()}`);
            log(`    rendered track = ${renderedTrack.getIdx()}`);
            assert(
              outputTrack.obj !== renderedTrack.obj,
              "output track should be different from rendered track",
            );

            // move item to the previously-used track, and delete this track
            const rv = reaper.MoveMediaItemToTrack(
              renderedItem.obj,
              outputTrack.obj,
            );
            if (!rv)
              throw new Error(
                `Failed to move item from track ${renderedTrackIdx} to ${outputTrack.getIdx()}`,
              );

            renderedTrack.delete();
          }
        }

        track.setMuted(trackWasMuted);
      }
    });

    reaper.UpdateArrange();

    return { desc: SCRIPT_NAME, flags: -1 };
  }, SCRIPT_NAME);
}

errorHandler(main);
