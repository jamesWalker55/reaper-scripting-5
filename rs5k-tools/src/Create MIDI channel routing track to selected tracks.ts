AddCwdToImportPaths();

import { Track } from "reaper-api/track";
import { errorHandler, msgBox, undoBlock } from "reaper-api/utils";

const SCRIPT_NAME = "Create MIDI channel routing track to selected tracks";

function main() {
  const selectedTracks = Track.getSelected();

  if (selectedTracks.length === 0) {
    msgBox("Error", "Please select a few tracks before running this script!");
    return;
  }

  if (selectedTracks.length > 16) {
    msgBox(
      "Error",
      "This script only supports a maximum of 16 tracks (due to MIDI only having 16 tracks)",
    );
    return;
  }

  // sort tracks by index
  selectedTracks.sort((a, b) => a.getIdx() - b.getIdx());

  undoBlock(() => {
    const srcTrackIdx = selectedTracks[0].getIdx();
    reaper.InsertTrackInProject(0, srcTrackIdx, 0);
    const srcTrack = Track.getByIdx(srcTrackIdx);

    srcTrack.setName("MIDI Router");

    for (let i = 0; i < selectedTracks.length; i++) {
      const destTrack = selectedTracks[i];

      const sendIdx = reaper.CreateTrackSend(srcTrack.obj, destTrack.obj);

      // disable audio send
      {
        const rv = reaper.SetTrackSendInfo_Value(
          srcTrack.obj,
          0,
          sendIdx,
          "I_SRCCHAN",
          -1,
        );
        if (!rv) throw new Error("failed to disable audio send");
      }

      // enable MIDI send from channel X to same channel X
      {
        const midiChannel = i + 1; // index from 1 for "I_MIDIFLAGS"
        const rv = reaper.SetTrackSendInfo_Value(
          srcTrack.obj,
          0,
          sendIdx,
          "I_MIDIFLAGS",
          midiChannel | (midiChannel << 5),
        );
        if (!rv) throw new Error("failed to enable MIDI send");
      }
    }

    return { desc: SCRIPT_NAME, flags: -1 };
  }, SCRIPT_NAME);
}

errorHandler(main);
