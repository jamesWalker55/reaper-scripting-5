import * as json from "json";
import { Section } from "reaper-api/extstate";
import { inspect } from "reaper-api/inspect";
import { errorHandler, log } from "reaper-api/utils";

const MIDI_OUTPUT_NAME = "nanoKEY2";
const SECTION = Section("nanoKEY2");

function getOutputPort() {
  for (let i = 0; i < reaper.GetNumMIDIOutputs(); i++) {
    const [ok, name] = reaper.GetMIDIOutputName(i, "");
    if (name !== MIDI_OUTPUT_NAME) continue;

    if (!ok) log(`WARN: Device ${inspect(MIDI_OUTPUT_NAME)} is inactive`);
    return i;
  }

  throw new Error("failed to get midi output port");
}

function bytestring(bytes: number[]): string {
  const rv: string[] = [];

  bytes.forEach((x, i) => {
    let char;
    try {
      char = string.char(x);
    } catch (e) {
      throw new Error(
        `failed to encode bytestring, byte at ${i} is out of range: ${x}`,
      );
    }
    rv.push(char);
  });

  return rv.join("");
}

export enum ButtonSpeed {
  Immediate = 0,
  Fast = 1,
  Normal = 2,
  Slow = 3,
}

export enum VelocityCurve {
  Light = 0,
  Normal = 1,
  Heavy = 2,
  Const = 3,
}

export enum ButtonBehaviour {
  Momentary = 0,
  Toggle = 1,
}

export const DEFAULT_SCENE = {
  midiChannel: 0,
  pitchBendSpeed: ButtonSpeed.Normal,
  transpose: 64, // 64 +/- 12
  velocityCurve: VelocityCurve.Normal,
  velocityConstantValue: 100,
  modEnable: 1,
  modCC: 1, // mod wheel
  modBehaviour: ButtonBehaviour.Momentary,
  modOff: 0,
  modOn: 127,
  modSpeed: ButtonSpeed.Normal,
  sustainEnable: 1,
  sustainCC: 64, // sustain
  sustainBehaviour: ButtonBehaviour.Momentary,
  sustainOff: 0,
  sustainOn: 127,
  sustainSpeed: ButtonSpeed.Normal,
};
export type Scene = typeof DEFAULT_SCENE;

/** Get scene data stored in Reaper's extdata */
export function loadScene(): Scene {
  const data = SECTION.get("scene");
  if (data === null) return { ...DEFAULT_SCENE };
  if (data.length === 0) return { ...DEFAULT_SCENE };

  try {
    const scene = json.decode(data);
    serializeScene(scene as any); // try to make it error
    return scene as Scene;
  } catch (e) {
    log(`malformed scene in extdata: ${e}`);
    return { ...DEFAULT_SCENE };
  }
}

/** Store scene data to Reaper's extdata */
export function saveScene(x: Scene) {
  SECTION.set("scene", json.encode(x));
}

function between(x: number, min: number, max: number) {
  if (min <= x && x <= max) return x;
  throw new Error(`input ${x} is out of range ${min}..=${max}`);
}

function serializeScene(x: Scene): number[] {
  // initialise empty array
  const data = [];
  for (let i = 0; i < 64; i++) data.push(0xff);

  data[0] = between(x.midiChannel, 0, 15);
  data[2] = between(x.pitchBendSpeed, 0, 3);
  data[8] = between(x.transpose, 64 - 12, 64 + 12);
  data[9] = between(x.velocityCurve, 0, 3);
  data[10] = between(x.velocityConstantValue, 1, 127);
  data[16] = between(x.modEnable, 0, 1);
  data[17] = between(x.modCC, 0, 127);
  data[18] = between(x.modBehaviour, 0, 1);
  data[19] = between(x.modOff, 0, 127);
  data[20] = between(x.modOn, 0, 127);
  data[21] = between(x.modSpeed, 0, 3);
  data[24] = between(x.sustainEnable, 0, 1);
  data[25] = between(x.sustainCC, 0, 127);
  data[26] = between(x.sustainBehaviour, 0, 1);
  data[27] = between(x.sustainOff, 0, 127);
  data[28] = between(x.sustainOn, 0, 127);
  data[29] = between(x.sustainSpeed, 0, 3);

  log("data", data);

  // convert data format to midi
  const midiData = [];
  // process first 63 bytes
  for (let i = 0; i < 7 * 9; i += 7) {
    const b1 =
      ((data[i + 0] & 0b10000000) !== 0 ? 0b00000001 : 0) +
      ((data[i + 1] & 0b10000000) !== 0 ? 0b00000010 : 0) +
      ((data[i + 2] & 0b10000000) !== 0 ? 0b00000100 : 0) +
      ((data[i + 3] & 0b10000000) !== 0 ? 0b00001000 : 0) +
      ((data[i + 4] & 0b10000000) !== 0 ? 0b00010000 : 0) +
      ((data[i + 5] & 0b10000000) !== 0 ? 0b00100000 : 0) +
      ((data[i + 6] & 0b10000000) !== 0 ? 0b01000000 : 0);
    midiData.push(b1);
    midiData.push(data[i + 0] & 0b01111111);
    midiData.push(data[i + 1] & 0b01111111);
    midiData.push(data[i + 2] & 0b01111111);
    midiData.push(data[i + 3] & 0b01111111);
    midiData.push(data[i + 4] & 0b01111111);
    midiData.push(data[i + 5] & 0b01111111);
    midiData.push(data[i + 6] & 0b01111111);
  }
  // it should have 72 bytes now
  if (midiData.length !== 72) throw new Error("midiData validation error");
  // last byte into 2 bytes
  {
    const b = data[63];
    midiData.push((b & 0b10000000) !== 0 ? 0b00000001 : 0);
    midiData.push(b & 0b01111111);
  }
  // it should have 72 bytes now

  log("midiData", midiData);

  return midiData;
}

function createSceneDataDumpMessage(x: Scene, channel: number = 0): number[] {
  const msg = [];

  // Exclusive Header  g;Global Channel  [Hex]
  msg.push(0xf0, 0x42, 0x40 + channel);
  // Software Project (nanoKEY2: 000111H, Sub ID: 01)
  msg.push(0x00, 0x01, 0x11, 0x01);
  // Data Dump Command  (Host<->Controller, Variable Format)
  msg.push(0x7f);
  // Num of Data (1+74 Bytes : 1001011)
  msg.push(0x4b);
  // Scene Data Dump
  msg.push(0x40);
  // Data
  msg.push(...serializeScene(x));
  // End of Exclusive (EOX)
  msg.push(0xf7);

  return msg;
}

/** Update the device to use the scene */
export function pushSceneToDevice(x: Scene) {
  const msg = createSceneDataDumpMessage(x);

  const port = getOutputPort();

  reaper.SendMIDIMessageToHardware(port, bytestring(msg));
}

/** Save whatever setting is on device as default */
export function commitDeviceScene(channel: number = 0) {
  const msg = [];

  // Exclusive Header  g;Global Channel  [Hex]
  msg.push(0xf0, 0x42, 0x40 + channel);
  // Software Project (nanoKEY2: 000111H, Sub ID: 01)
  msg.push(0x00, 0x01, 0x11, 0x01);
  // Data Dump Command  (Host->Controller, 2Bytes Format)
  msg.push(0x1f);
  // Scene Data Write Request
  msg.push(0x11);
  //
  msg.push(0x00);
  // End of Exclusive (EOX)
  msg.push(0xf7);

  const port = getOutputPort();

  reaper.SendMIDIMessageToHardware(port, bytestring(msg));
}

/** Restore state to whatever setting was saved in device memory */
export function restoreDeviceScene(channel: number = 0) {
  const msg = [];

  // Exclusive Header  g;Global Channel  [Hex]
  msg.push(0xf0, 0x42, 0x40 + channel);
  // Software Project (nanoKEY2: 000111H, Sub ID: 01)
  msg.push(0x00, 0x01, 0x11, 0x01);
  // Data Dump Command  (Host->Controller, 2Bytes Format)
  msg.push(0x1f);
  // Scene Change Request
  msg.push(0x14);
  //
  msg.push(0x00);
  // End of Exclusive (EOX)
  msg.push(0xf7);

  const port = getOutputPort();

  reaper.SendMIDIMessageToHardware(port, bytestring(msg));
}
