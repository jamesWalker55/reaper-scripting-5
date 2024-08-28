AddCwdToImportPaths();

// import { encode } from "json";
import * as asdasf from "reaper-api"
import { MouseCap, OSType } from "reaper-api/ffi";
import { deferAsync, ensureAPI, errorHandler, log } from "reaper-api/utils";

const MOUSE_ACTION_IDENTIFIER = "jw_mouse_action";

function asdasdas(){

}

/**
 * Return a map from pitch to ppq position
 */
function asd(
  startPitch: number,
  startPpq: number,
  endPitch: number,
  endPpq: number,
): LuaTable<number, number> {

  // const tick =
  //   startPpq +
  //   ((endPpq - startPpq) * (pitch - startPitch)) / (endPitch - startPitch);
  reaper.MIDI_GetGrid()
  // local tick = mouseOrigPPQPos
  //     + (mouseNewPPQPos - mouseOrigPPQPos)
  //         * (pitch - mouseOrigPitch)
  //         / (mouseNewPitch - mouseOrigPitch)
  // if isInline then
  //     local timePos = reaper.MIDI_GetProjTimeFromPPQPos(activeTake, tick)
  //     local snappedTimePos = reaper.SnapToGrid(0, timePos) -- If snap-to-grid is not enabled, will return timePos unchanged
  //     tick = reaper.MIDI_GetPPQPosFromProjTime(activeTake, snappedTimePos)
  // elseif isSnapEnabled then --and pitch ~= mouseOrigPitch and pitch ~= mouseNewPitch then
  //     -- Note that the line snaps to closest grid, not the floor grid
  //     local QNpos = reaper.MIDI_GetProjQNFromPPQPos(activeTake, tick)
  //     local roundGridQN = math.floor(QNpos / QNperGrid + 0.5) * QNperGrid
  //     tick = reaper.MIDI_GetPPQPosFromProjQN(activeTake, roundGridQN)
  // end
  // tick = math.floor(tick + 0.5)
  // tableCutPPQPos[pitch] = tick
  // t = t + 1
  // tableLineMIDI[t] =
  //     s_pack("i4Bi4BBB", (tick - thicknessTicks / 2) - lastPPQPos, 3, 3, 0x90 | activeChannel, pitch, 1)
  // t = t + 1
  // tableLineMIDI[t] = s_pack("i4Bi4BBB", thicknessTicks, 3, 3, 0x80 | activeChannel, pitch, 0)
  // lastPPQPos = tick + thicknessTicks / 2
}

function splitNotes(take: MediaItem_Take) {
  // To find each note-ons matching note-off, the info of note-ons will temporarily be stored in tableNoteOns.
  type Pitch = number;
  type NoteOn = { ppqpos: number; msg: string };
  const tableNoteOns: LuaTable<
    number,
    LuaTable<number, LuaTable<Pitch, NoteOn>>
  > = new LuaTable();
  for (let flags = 0; flags <= 3; flags++) {
    tableNoteOns.set(flags, new LuaTable());
    for (let chan = 0; flags <= 15; chan++) {
      tableNoteOns.get(flags).set(chan, new LuaTable());
    }
  }

  // All the parsed and cut MIDI events will be stored in tableEvents
  const t = 0;

  // local stringPos = 1 -- Position in MIDIString while parsing
  // local runningPPQPos = 0 -- PPQ position of event parsed
  // local MIDIlen = MIDIString:len()
  // while stringPos < MIDIlen do
  //     local hasAlreadyInsertedEvent = false
  //     local offset, flags, msg
  //     offset, flags, msg, stringPos = s_unpack("i4Bs4", MIDIString, stringPos)
  //     runningPPQPos = runningPPQPos + offset
  //     if flags & 1 == 1 or notOnlySelected then
  //         if msg:len() == 3 and (editAllChannels or msg:byte(1) & 0x0F == activeChannel) then
  //             local eventType = msg:byte(1) >> 4
  //             if eventType == 9 and not (msg:byte(3) == 0) then
  //                 local channel = msg:byte(1) & 0x0F
  //                 local pitch = msg:byte(2)
  //                 if tableNoteOns[flags][channel][pitch] then
  //                     reaper.MIDI_SetAllEvts(activeTake, MIDIString) -- Restore original MIDI
  //                     reaper.MB(
  //                         "The script has encountered overlapping notes."
  //                             .. "\n\nSuch notes are not legal MIDI data, and their lengths can not be parsed.",
  //                         "ERROR",
  //                         0
  //                     )
  //                     dontSlice = true
  //                     break
  //                 else
  //                     tableNoteOns[flags][channel][pitch] = { notePPQ = runningPPQPos, noteMsg = msg }
  //                 end
  //             elseif eventType == 8 or (eventType == 9 and msg:byte(3) == 0) then
  //                 local channel = msg:byte(1) & 0x0F
  //                 local pitch = msg:byte(2)
  //                 if tableNoteOns[flags][channel][pitch] then -- Is there a matching note-on waiting?
  //                     if tableCutPPQPos[pitch] then -- Does this pitch fall within the cutting line's pitch range?
  //                         if
  //                             tableCutPPQPos[pitch] > tableNoteOns[flags][channel][pitch].notePPQ
  //                             and tableCutPPQPos[pitch] < runningPPQPos
  //                         then
  //                             t = t + 1
  //                             tableEvents[t] =
  //                                 s_pack("i4Bs4", offset - runningPPQPos + tableCutPPQPos[pitch], flags, msg)
  //                             t = t + 1
  //                             if splitOrTrim == "trim" then
  //                                 -- The only difference between trimming and splitting is that the former does not insert a new note.
  //                                 -- Instead, it simply inserts an empty event as 'spacer' to update the running PPQ position:
  //                                 tableEvents[t] =
  //                                     s_pack("i4Bs4", runningPPQPos - tableCutPPQPos[pitch], flags, "")
  //                             else -- mode == "split"
  //                                 tableEvents[t] =
  //                                     s_pack("i4Bs4", 0, flags, tableNoteOns[flags][channel][pitch].noteMsg)
  //                                 t = t + 1
  //                                 tableEvents[t] =
  //                                     s_pack("i4Bs4", runningPPQPos - tableCutPPQPos[pitch], flags, msg)
  //                             end
  //                             hasAlreadyInsertedEvent = true
  //                         end
  //                     end
  //                 end
  //                 tableNoteOns[flags][channel][pitch] = nil
  //             end
  //         end -- if msg:len() == 3
  //     end -- if flags&1 == 1 or not onlySliceSelectedNotes
  //     if not hasAlreadyInsertedEvent then
  //         t = t + 1
  //         tableEvents[t] = s_pack("i4Bs4", offset, flags, msg)
  //     end
  // end -- while stringPos < MIDIlen

  // if
  //     not (
  //         type(tableEvents[#tableEvents]) == "string"
  //         and tableEvents[#tableEvents]:sub(-8) == MIDIString:sub(-8)
  //     )
  // then
  //     dontSlice = true
  // end

  // if dontSlice then
  //     reaper.MIDI_SetAllEvts(activeTake, MIDIString)
  //     return false
  // else
  //     reaper.MIDI_SetAllEvts(activeTake, table.concat(tableEvents))
  //     return true
  // end
}

async function main() {
  ensureAPI("At least REAPER v5.974", "MIDI_DisableSort");
  ensureAPI("js_ReaScriptAPI", "JS_VKeys_GetDown");
  ensureAPI("SWS extension", "SN_FocusMIDIEditor");

  // reaper.atexit(() => {
  //   log("TODO: At exit");
  // });

  // // intercept keys as soon as possible
  // // you need to reverse this call on exit
  // {
  //   const interceptKeysOK = reaper.JS_VKeys_Intercept(-1, 1) > 0;
  //   if (!interceptKeysOK) {
  //     throw new Error("could not intercept keyboard input");
  //   }
  // }

  let mouseX, mouseY;
  let mustCalculate: boolean;
  while (true) {
    // stop script if mouse is released
    const leftMouseDown = reaper.JS_Mouse_GetState(MouseCap.LeftMouse) !== 0;
    // if (!leftMouseDown) break;

    // get mouse position and etc
    {
      const [newX, newY] = reaper.GetMousePosition();
      if (mouseX !== newX || mouseY !== newY) {
        mouseX = newX;
        mouseY = newY;
        mustCalculate = true;
      }
    }

    // set this script's state to 'on'
    {
      const [_rv, _fn, sectionID, commandID] = reaper.get_action_context();
      if (
        sectionID !== null &&
        commandID !== null &&
        sectionID !== -1 &&
        commandID !== -1
      ) {
        reaper.SetToggleCommandState(sectionID, commandID, 1);
        reaper.RefreshToolbar2(sectionID, commandID);
      }
    }

    // log(reaper.GetThingFromPoint(mouseX, mouseY));
    // reaper.JS_WindowMessage_Intercept
    // reaper.JS_VKeys_GetDown
    // reaper.BR_GetMouseCursorContext_MIDI

    reaper.MIDI_GetPPQPosFromProjTime;
    reaper.MIDI_SetAllEvts;

    // log("reaper.BR_GetMouseCursorContext()", reaper.BR_GetMouseCursorContext(), reaper.BR_GetMouseCursorContext_MIDI());

    await deferAsync();
  }

  // MouseCap
  // mouseState = reaper.JS_Mouse_GetState(0xFF)
  // mouseOrigX, mouseOrigY = reaper.GetMousePosition()
  // startTime = reaper.time_precise()
  // prevMouseTime = startTime + 0.5 -- In case mousewheel sends multiple messages, don't react to messages sent too closely spaced, so wait till little beyond startTime.
  // keyState = reaper.JS_VKeys_GetState(-2):sub(VKLow, VKHi)
}

errorHandler(main);
