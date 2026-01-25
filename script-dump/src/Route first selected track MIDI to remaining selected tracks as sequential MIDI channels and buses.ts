AddCwdToImportPaths();

import { inspect } from "reaper-api/inspect";
import * as Path from "reaper-api/path/path";
import {
  Item,
  Take,
  Track,
  TrackRouting,
  TrackRoutingCategory,
} from "reaper-api/track";
import {
  confirmBox,
  errorHandler,
  log,
  msgBox,
  undoBlock,
} from "reaper-api/utils";

function main() {
  // get tracks
  const targetTracks = Track.getSelected();
  const sourceTrack = targetTracks.shift();
  if (sourceTrack === undefined) {
    msgBox(
      "Usage",
      "Not enough tracks selected.\nUsage: Select multiple tracks. The topmost track will be the MIDI source.",
    );
    return;
  }
  if (targetTracks.length === 0) {
    msgBox(
      "Usage",
      "Not enough tracks selected.\nUsage: Select multiple tracks. The topmost track will be the MIDI source.",
    );
    return;
  }

  undoBlock(
    "Route first selected track MIDI to remaining selected tracks as sequential MIDI channels and buses",
    1,
    () => {
      const targetTracksSet = new LuaSet<MediaTrack>();
      targetTracks.forEach((x) => targetTracksSet.add(x.obj));

      // remove any existing sends to target tracks
      let idx = 0;
      while (true) {
        if (
          idx >=
          reaper.GetTrackNumSends(sourceTrack.obj, TrackRoutingCategory.Send)
        )
          break;

        const routing = TrackRouting.getTargetTracks(
          sourceTrack.obj,
          TrackRoutingCategory.Send,
          idx,
        );
        if (targetTracksSet.has(routing.dst.obj)) {
          TrackRouting.removeSend(
            sourceTrack.obj,
            TrackRoutingCategory.Send,
            idx,
          );
        } else {
          idx += 1;
        }
      }

      // create sends
      targetTracks.forEach((target, i) => {
        const idx = TrackRouting.createSend(sourceTrack.obj, target.obj);
        TrackRouting.setInfo(sourceTrack.obj, TrackRoutingCategory.Send, idx, {
          audio: null,
          midi: {
            srcBus: Math.floor(i / 16),
            srcChannel: i % 16,
            dstBus: 0,
            dstChannel: 0,
            fadersSendMidiVolPan: false,
          },
        });
      });
    },
  );
}

errorHandler(main);
