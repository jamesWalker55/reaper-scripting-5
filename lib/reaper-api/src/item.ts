import {
  AddFxParams,
  generateTakeContainerFxidx,
  parseTakeContainerFxidx,
  stringifyAddFxParams,
} from "./fx";
import { inspect } from "./inspect";

export class Item {
  obj: MediaItem;

  constructor(obj: MediaItem) {
    this.obj = obj;
  }

  static getSelected(): Item[] {
    const count = reaper.CountSelectedMediaItems(0);
    const result: Item[] = [];
    for (let i = 0; i < count; i++) {
      const obj = reaper.GetSelectedMediaItem(0, i);
      result.push(new Item(obj));
    }
    return result;
  }

  *iterTakes() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    for (let i = 0; i < count; i++) {
      const take = reaper.GetMediaItemTake(this.obj, i);
      yield new Take(take);
    }
  }

  activeTake() {
    const take = reaper.GetActiveTake(this.obj);
    if (!take) return null;

    return new Take(take);
  }

  isEmpty() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    return count === 0;
  }

  getColor(): { r: number; g: number; b: number } | null {
    const color = reaper.GetMediaItemInfo_Value(this.obj, "I_CUSTOMCOLOR");
    if (color === 0) return null;

    const [r, g, b] = reaper.ColorFromNative(color);
    return { r, g, b };
  }

  setColor(color: { r: number; g: number; b: number } | null) {
    const newColor: number =
      color !== null
        ? reaper.ColorToNative(color.r, color.g, color.b) | 0x01000000
        : 0;
    const rv = reaper.SetMediaItemInfo_Value(
      this.obj,
      "I_CUSTOMCOLOR",
      newColor,
    );
    if (!rv) throw new Error(`failed to set item color to ${inspect(color)}`);
  }

  getPosition(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_POSITION");
  }

  getSnapOffset(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_SNAPOFFSET");
  }

  getLength(): number {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_LENGTH");
  }

  // getTrack(): Track {
  //   const obj = reaper.GetMediaItemTrack(this.obj);
  //   return new Track(obj);
  // }
}

export class Take {
  obj: MediaItem_Take;

  constructor(obj: MediaItem_Take) {
    this.obj = obj;
  }

  type() {
    const source = reaper.GetMediaItemTake_Source(this.obj);
    return reaper.GetMediaSourceType(source);
  }

  isMidi() {
    const type = this.type();
    return type === "MIDI" || type === "MIDIPOOL";
  }

  source() {
    return new Source(reaper.GetMediaItemTake_Source(this.obj));
  }

  getName(): string {
    const [ok, rv] = reaper.GetSetMediaItemTakeInfo_String(
      this.obj,
      "P_NAME",
      "",
      false,
    );
    if (!ok) throw new Error("failed to get name of take");
    return rv;
  }

  getFxCount() {
    return reaper.TakeFX_GetCount(this.obj);
  }

  /** Returns new position if success, otherwise return nil */
  addFx(fx: AddFxParams, position?: number | number[]) {
    const fxname = stringifyAddFxParams(fx);

    let positionNum: number | null = null;
    let positionArr: number[] | null = null;
    if (position !== undefined) {
      if (typeof position === "number") {
        positionArr = parseTakeContainerFxidx(this.obj, position);
        positionNum = position;
      } else {
        positionArr = [...position];
        positionNum = generateTakeContainerFxidx(this.obj, position);
      }
    }

    const rv = reaper.TakeFX_AddByName(
      this.obj,
      fxname,
      positionNum === null ? -1 : -1000 - positionNum,
    );
    if (rv === -1) {
      return null;
    }

    // rv is fx index WITHIN container / fxchain, does not have container index
    const newSubposition = rv;
    if (positionArr === null) {
      // no position specified, so it must be root fxchain position
      return newSubposition;
    } else {
      positionArr[positionArr.length - 1] = newSubposition;
      return generateTakeContainerFxidx(this.obj, positionArr);
    }

    // const fxname = stringifyAddFxParams(fx);
    // if (position !== undefined && typeof position !== "number") {
    //   position = generateTakeContainerFxidx(this.obj, position);
    // }

    // const rv = reaper.TakeFX_AddByName(
    //   this.obj,
    //   fxname,
    //   position === undefined ? -1 : -1000 - position,
    // );
    // if (rv === -1) {
    //   return null;
    // }
    // // rv is fx index WITHIN container / fxchain, does not have container index
    // const newSubposition = rv;
    // if (position === undefined) {
    //   // no position specified, so it must be root fxchain position
    //   return newSubposition;
    // } else {
    //   const parsedPos = parseTakeContainerFxidx(this.obj, position);
    //   parsedPos.pop();
    //   parsedPos.push(newSubposition);
    //   return generateTakeContainerFxidx(this.obj, parsedPos);
    // }
  }
}

export class MidiTake {
  obj: MediaItem_Take;

  constructor(obj: MediaItem_Take) {
    this.obj = obj;
  }

  /** Return the active MIDI take that's being edited in the open MIDI editor (if open) */
  static active(): MidiTake | null {
    const hwnd = reaper.MIDIEditor_GetActive();
    if (hwnd === null) return null;

    const take = reaper.MIDIEditor_GetTake(hwnd);
    return new MidiTake(take);
  }

  /**
   * Returns the grid info of this MIDI editor take
   * - `beats`: Grid size in beats (there are 4 beats in a measure)
   * - `swing`: From -1.0 .. 0.0 .. 1.0
   * - `noteLengthOverride`: Length of inputted notes, will be null if following grid size
   */
  grid() {
    const [beats, swing, noteBeats] = reaper.MIDI_GetGrid(this.obj);
    return {
      beats,
      swing,
      noteLengthOverride: noteBeats === 0 ? null : noteBeats,
    };
  }
}

export class Source {
  obj: PCM_source;

  constructor(obj: PCM_source) {
    this.obj = obj;
  }

  type() {
    return reaper.GetMediaSourceType(this.obj);
  }
}
