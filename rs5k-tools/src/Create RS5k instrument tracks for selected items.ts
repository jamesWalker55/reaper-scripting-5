AddCwdToImportPaths();

import { FX } from "reaper-api/fx";
import { inspect } from "reaper-api/inspect";
import { RS5K } from "reaper-api/rs5k";
import { Item, Track } from "reaper-api/track";
import { errorHandler, log, undoBlock } from "reaper-api/utils";

const SCRIPT_NAME = "Create RS5k instrument tracks for selected items";
const DEFAULT_NOTE = 60; // C4

function main() {
  undoBlock(() => {
    for (const item of Item.getSelected()) {
      const take = item.activeTake();
      if (!take) continue;
      if (take.isMidi()) continue;
      if (take.getStretchMarkerCount() > 0) {
        log(
          `Skipping item ${inspect(
            take.name,
          )}: Stretch markers are not supported`,
        );
        continue;
      }

      // get the source, and resolve any nested PCM_source section fuckery
      let source = take.getSource();
      let sourceOffset = 0;
      {
        let continueLoop = false;
        while (true) {
          const info = source.getSectionInfo();
          if (!info.isSection) break;

          if (info.reversed) {
            log(
              `Skipping item ${inspect(
                take.name,
              )}: Reversed items are not supported`,
            );
            continueLoop = true;
            break;
          }

          sourceOffset += info.offset;
          const parentSource = source.getParent();
          if (parentSource === null)
            throw new Error(
              "failed to get parent source of section PCM_source",
            );

          source = parentSource;
        }
        if (continueLoop) continue;
      }

      // audio sample info
      const sourceFilename = source.getFilename();
      const sourceLength = source.getLength();

      // sample section info
      const startRatio = (take.sourceStartOffset + sourceOffset) / sourceLength;
      const endRatio =
        (take.sourceStartOffset + sourceOffset + item.length * take.playrate) /
        sourceLength;

      // the pitch if you played the sample at it's current rate (without ReaPitch)
      const realtimePitch = Math.log2(take.playrate) * 12;
      // the pitch you currently hear when you play this item
      const effectivePitch =
        take.pitch + (take.preservePitch ? 0 : Math.log2(take.playrate) * 12);
      // ReaPitch pitch shifting needed to achieve the target pitch with the same sampler rate
      const extraPitch = effectivePitch - realtimePitch;

      // create instrument track
      {
        const targetTrackIdx = take.getTrack().getIdx();
        reaper.InsertTrackInProject(0, targetTrackIdx, 0);
        const targetTrack = Track.getByIdx(targetTrackIdx);

        targetTrack.setName(take.name);

        // add sampler for this item
        {
          const fxpos = targetTrack.addFx({ vst: "ReaSamplOmatic5000" });
          if (fxpos === null)
            throw new Error("failed to add samplomatic instance");
          const rs = new RS5K(new FX({ track: targetTrack.obj }, fxpos));
          rs.attack = item.fadeInLength * 1000;
          rs.release = item.fadeOutLength * 1000;
          rs.obeyNoteOffs = true;
          rs.sampleStartOffset = startRatio;
          rs.sampleEndOffset = endRatio;
          rs.pitchOffset = realtimePitch;
          rs.modifyFiles((m) => {
            m.deleteAllFiles();
            m.addFile(0, sourceFilename);
          });
        }

        // add ReaPitch to do additional pitching while keeping the item's rate
        if (extraPitch !== 0) {
          const fxpos = targetTrack.addFx({ vst: "ReaPitch" });
          if (fxpos === null)
            throw new Error("failed to add ReaPitch instance");
          const fx = targetTrack.getFx(fxpos);

          const shiftParam = fx.getParameters()[3];
          assert(
            shiftParam.getIdent() === "3:_1__Shift__full_range_",
            "expected param 3 to be shift parameter",
          );

          shiftParam.setValue((extraPitch + 24) / 48);
        }

        // add MIDI event at sample position
        {
          const midiItem = new Item(
            reaper.CreateNewMIDIItemInProj(
              targetTrack.obj,
              item.position,
              item.position + item.length,
              false,
            ),
          );
          const midiTake = midiItem.activeTake()!;
          const noteDurationTicks = reaper.MIDI_GetPPQPosFromProjTime(
            midiTake.obj,
            item.position + item.length,
          );
          reaper.MIDI_InsertNote(
            midiTake.obj,
            false,
            false,
            0,
            noteDurationTicks,
            0,
            DEFAULT_NOTE,
            127,
            false,
          );
        }
      }
    }

    return { desc: SCRIPT_NAME, flags: -1 };
  }, SCRIPT_NAME);
}

errorHandler(main);
