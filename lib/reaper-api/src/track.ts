import {
  AddFxParams,
  FX,
  generateFxidx,
  parseFxidx,
  stringifyAddFxParams,
} from "./fx";
import { inspect } from "./inspect";

export type RazorEditExt = {
  // Start time in seconds
  start: number;
  // End time in seconds
  end: number;
  // Envelope GUID if this edit is in an envelope lane
  envGUID?: string;
  // Y-positioning if this is fixed-item-lane or free-item-positioning track, between 0.0--1.0
  // E.g. 0.0
  yTop: number;
  // Y-positioning if this is fixed-item-lane or free-item-positioning track, between 0.0--1.0
  // E.g. 1.0
  yBottom: number;
};
export type RazorEditMin = Omit<RazorEditExt, "yTop" | "yBottom">;
export type RazorEdit = RazorEditMin | RazorEditExt;

function parseRazorEditsExt(data: string): RazorEdit[] {
  if (data.length === 0) return [];

  const rv: RazorEditExt[] = [];

  for (const item of data.split(",")) {
    const [start, end, envGUID, yTop, yBottom] = string.match(
      item,
      `(%d+%.%d+)%s+(%d+%.%d+)%s+"([^"]*)"%s+(%d+%.%d+)%s+(%d+%.%d+)`,
    );
    if (start === undefined) {
      // matching failed
      throw new Error(`failed to parse razor edit data: ${inspect(item)}`);
    }

    rv.push({
      start: parseFloat(start),
      end: parseFloat(end),
      envGUID: envGUID.length === 0 ? undefined : envGUID,
      yTop: parseFloat(yTop),
      yBottom: parseFloat(yBottom),
    });
  }

  return rv.map((x) =>
    x.yTop === 0.0 && x.yBottom === 1.0
      ? {
          start: x.start,
          end: x.end,
          envGUID: x.envGUID,
        }
      : x,
  );
}

function serializeRazorEditsExt(edits: RazorEdit[]): string {
  const parts: string[] = [];

  for (const x of edits) {
    const row = string.format(
      `%.14f %.14f "%s" %f %f`,
      x.start,
      x.end,
      x.envGUID || "",
      "yTop" in x ? x.yTop : 0.0,
      "yBottom" in x ? x.yBottom : 1.0,
    );
    parts.push(row);
  }

  return parts.join(",");
}

export enum FolderCompact {
  Normal = 0,
  Collapsed = 1,
  FullyCollapsed = 2,
}

export class Track {
  obj: MediaTrack;

  constructor(track: MediaTrack) {
    this.obj = track;
  }

  static getLastTouched() {
    const obj = reaper.GetLastTouchedTrack();
    if (obj === null) return null;
    return new Track(obj);
  }

  static getMaster() {
    return new Track(reaper.GetMasterTrack(0));
  }

  static count() {
    return reaper.CountTracks(0);
  }

  static getByIdx(idx: number) {
    const obj = reaper.GetTrack(0, idx);
    if (obj === null) throw new Error(`failed to get track with index ${idx}`);
    return new Track(obj);
  }

  static getSelected() {
    const tracks = [];
    let i = 0;
    while (true) {
      const t = reaper.GetSelectedTrack2(0, i, true);
      if (t === null) return tracks;

      tracks.push(new Track(t));
      i += 1;
    }
  }

  static *iterAll() {
    const count = Track.count();
    for (let i = 0; i < count; i++) {
      yield Track.getByIdx(i);
    }
  }

  static getAll() {
    const count = Track.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(Track.getByIdx(i));
    }
    return result;
  }

  static createAtLastPosition() {
    reaper.InsertTrackInProject(0, -1, 0);
    const totalTracks = reaper.CountTracks(0);
    return Track.getByIdx(totalTracks - 1);
  }

  static createAtIdx(idx: number) {
    const totalTracks = reaper.CountTracks(0);
    if (!(0 <= idx && idx < totalTracks))
      throw new Error(`Track index out of bounds (${totalTracks}): ${idx}`);

    // create at index
    reaper.InsertTrackInProject(0, idx, 0);
    return Track.getByIdx(idx);
  }

  guid(): string {
    return reaper.GetTrackGUID(this.obj);
  }

  isMaster() {
    return this.getIdx() === -1;
  }

  /**
   * For top-level tracks, this returns the master track.
   * For the master track, this returns null.
   */
  getParent() {
    const obj = reaper.GetParentTrack(this.obj);
    if (obj === null) {
      if (this.isMaster()) return null;

      return Track.getMaster();
    }
    return new Track(obj);
  }

  getChildren() {
    let idx = this.getIdx();
    const isMaster = idx === -1;
    if (!isMaster) {
      const rootNextTrackDepth = this.getRawFolderDepth();
      if (rootNextTrackDepth <= 0) return [];
    }

    const children: Track[] = [];
    let currentDepth = 0;

    while (currentDepth >= 0) {
      idx++;

      let child: Track | null;
      try {
        child = Track.getByIdx(idx);
      } catch (e) {
        // assume we have reached end of project track list
        child = null;
      }
      if (child === null) break;

      if (currentDepth === 0) children.push(child);

      currentDepth += child.getRawFolderDepth();
    }

    return children;
  }

  /** Returns new position if success, otherwise return nil */
  addFx(
    fx: AddFxParams,
    position?: number | { path: number[]; flags: number },
  ) {
    const fxname = stringifyAddFxParams(fx);

    const pos = (() => {
      if (position === undefined) return null;

      if (typeof position === "number") {
        const obj = parseFxidx({ track: this.obj, fxidx: position });
        return { ...obj, fxidxNoFlags: position & 0x0ffffff };
      } else {
        const obj = { path: [...position.path], flags: position.flags };
        const fxidxNoFlags =
          generateFxidx({ track: this.obj, ...position }) & 0x0ffffff;
        return { ...obj, fxidxNoFlags };
      }
    })();

    // handle flags fuckery, TrackFX_AddByName processes flags differently than others
    let rv;
    if (pos === null) {
      rv = reaper.TrackFX_AddByName(this.obj, fxname, false, -1);
    } else {
      rv = reaper.TrackFX_AddByName(
        this.obj,
        fxname,
        (pos.flags & 0x1000000) !== 0 ? true : false,
        // TODO: Check if adding flags is correct
        -1000 - (pos.fxidxNoFlags + (pos.flags - (pos.flags & 0x1000000))),
      );
    }
    if (rv === -1) return null;

    // rv is fx index WITHIN container / fxchain, does not have container index
    const newSubposition = rv;
    if (pos === null) {
      // no position specified, so it must be root fxchain position
      return newSubposition;
    } else {
      pos.path = [...pos.path]; // clone array
      pos.path[pos.path.length - 1] = newSubposition;
      return generateFxidx({ track: this.obj, ...pos });
    }
  }

  getFxCount() {
    return reaper.TrackFX_GetCount(this.obj);
  }

  getAllFx() {
    const count = this.getFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new FX({ track: this.obj }, i));
    }
    return result;
  }

  getFx(idx: number) {
    return new FX({ track: this.obj }, idx);
  }

  /** Number of recording FX. For master track, returns monitoring FX instead. */
  getRecFxCount() {
    return reaper.TrackFX_GetRecCount(this.obj);
  }

  /** Return all recording FX. For master track, returns monitoring FX instead. */
  getAllRecFx() {
    const count = this.getRecFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new FX({ track: this.obj }, i + 0x1000000));
    }
    return result;
  }

  getRecFx(idx: number) {
    return new FX({ track: this.obj }, idx + 0x1000000);
  }

  /**
   * Raw folder depth value from Reaper's API. Value indicates the change
   * in depth in folder structure. E.g. '1' means next track will be a folder
   * down. '-2' means next track will be 2 folders up.
   *
   * Original documentation:
   *
   * ---
   *
   * folder depth change,
   * - 0=normal,
   * - 1=track is a folder parent,
   * - -1=track is the last in the innermost folder,
   * - -2=track is the last in the innermost and next-innermost folders, etc
   */
  getRawFolderDepth() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "I_FOLDERDEPTH");
  }

  getSends(includeParent: boolean = false) {
    const category = TrackRoutingCategory.Send;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    if (includeParent) {
      const info = TrackRouting.getParentInfo(this.obj);
      if (info.audio !== null || info.midi !== null) {
        let parentTrack = reaper.GetMediaTrackInfo_Value(
          this.obj,
          "P_PARTRACK",
        ) as MediaTrack | 0;
        // for some reason, 'P_PARTRACK' will just return a 0 (number) for the master track
        if (parentTrack === 0) {
          parentTrack = reaper.GetMasterTrack(0);
        }

        result.push({
          ...info,
          src: new Track(this.obj),
          dst: new Track(parentTrack),
        });
      }
    }

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      const { src, dst } = TrackRouting.getTargetTracks(this.obj, category, i);
      result.push({ src, dst, ...info });
    }

    return result;
  }

  /** Value is scalar, 0..1..inf */
  get volume() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_VOL");
  }
  set volume(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_VOL", val);
    if (!ok) throw new Error("failed to set volume");
  }

  /** Value in range -1..0..1 */
  get pan() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_PAN");
  }
  set pan(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_PAN", val);
    if (!ok) throw new Error("failed to set pan");
  }

  /** Value in range -1..0..1 */
  get width() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_WIDTH");
  }
  set width(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_WIDTH", val);
    if (!ok) throw new Error("failed to set width");
  }

  /** pan law of track, <0=project default, 0.5=-6dB, 0.707..=-3dB, 1=+0dB, 1.414..=-3dB with gain compensation, 2=-6dB with gain compensation, etc */
  get panLaw() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "D_PANLAW");
  }
  set panLaw(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "D_PANLAW", val);
    if (!ok) throw new Error("failed to set pan law");
  }

  get muted() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "B_MUTE") === 1;
  }
  set muted(val: boolean) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "B_MUTE", val ? 1 : 0);
    if (!ok) throw new Error("failed to set muted");
  }

  get phaseInverted() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "B_PHASE") === 1;
  }
  set phaseInverted(val: boolean) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "B_PHASE", val ? 1 : 0);
    if (!ok) throw new Error("failed to set phase inverted");
  }

  /** pan mode, 0=classic 3.x, 3=new balance, 5=stereo pan, 6=dual pan */
  get panmode() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "I_PANMODE");
  }
  set panmode(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "I_PANMODE", val);
    if (!ok) throw new Error("failed to set panmode");
  }

  get color() {
    const x = reaper.GetMediaTrackInfo_Value(this.obj, "I_CUSTOMCOLOR");
    if (x === 0) return null;
    const [r, g, b] = reaper.ColorFromNative(x);
    return { r, g, b };
  }
  set color(x: { r: number; g: number; b: number } | null) {
    let rv: boolean;
    if (x === null) {
      rv = reaper.SetMediaTrackInfo_Value(this.obj, "I_CUSTOMCOLOR", 0);
    } else {
      const color = reaper.ColorToNative(x.r, x.g, x.b);
      rv = reaper.SetMediaTrackInfo_Value(
        this.obj,
        "I_CUSTOMCOLOR",
        0x1000000 | color,
      );
    }
    if (!rv) throw new Error(`failed to set item color to ${inspect(x)}`);
  }

  get folderCompact() {
    return reaper.GetMediaTrackInfo_Value(
      this.obj,
      "I_FOLDERCOMPACT",
    ) as FolderCompact;
  }
  set folderCompact(val: FolderCompact) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "I_FOLDERCOMPACT", val);
    if (!ok) throw new Error("failed to set folder compact");
  }

  getReceives() {
    const category = TrackRoutingCategory.Receive;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      const { src, dst } = TrackRouting.getTargetTracks(this.obj, category, i);
      result.push({ src, dst, ...info });
    }

    return result;
  }

  getHWOutputs() {
    const category = TrackRoutingCategory.HWOutput;

    const count = reaper.GetTrackNumSends(this.obj, category);
    const result = [];

    for (let i = 0; i < count; i++) {
      const info = TrackRouting.getInfo(this.obj, category, i);
      result.push(info);
    }

    return result;
  }

  get name() {
    const [ok, val] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_NAME",
      "",
      false,
    );
    if (!ok) {
      // will always fail on master track, check if we are on master track
      if (this.getIdx() === -1) return "";

      throw new Error("failed to get track name");
    }
    return val;
  }
  set name(name: string) {
    const [ok, val] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_NAME",
      name,
      true,
    );
    if (!ok) {
      // will always fail on master track, check if we are on master track
      if (this.getIdx() === -1) return;

      throw new Error("failed to set track name");
    }
  }

  /** number of track channels, 2-128, even numbers only */
  get channelCount() {
    return reaper.GetMediaTrackInfo_Value(this.obj, "I_NCHAN");
  }
  set channelCount(val: number) {
    const ok = reaper.SetMediaTrackInfo_Value(this.obj, "I_NCHAN", val);
    if (!ok) throw new Error(`failed to set channelCount to ${val}`);
  }

  getRazorEdits() {
    const [ok, rv] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_RAZOREDITS_EXT",
      "",
      false,
    );
    if (!ok) throw new Error("failed to get razor edits");

    return parseRazorEditsExt(rv);
  }

  setRazorEdits(edits: RazorEdit[]) {
    const editsText = serializeRazorEditsExt(edits);
    const [ok, _] = reaper.GetSetMediaTrackInfo_String(
      this.obj,
      "P_RAZOREDITS_EXT",
      editsText,
      true,
    );
    if (!ok) throw new Error("failed to set razor edits");
  }

  delete() {
    reaper.DeleteTrack(this.obj);
  }

  /** Returns 0-based index of track. Master track returns -1. */
  getIdx() {
    const tracknumber = reaper.GetMediaTrackInfo_Value(
      this.obj,
      "IP_TRACKNUMBER",
    );
    if (tracknumber === 0) throw new Error("failed to get track number");
    if (tracknumber === -1) return -1;

    // convert the float to an integer
    return Math.round(tracknumber - 1);
  }

  *iterItems() {
    const count = reaper.CountTrackMediaItems(this.obj);
    for (let i = 0; i < count; i++) {
      const item = reaper.GetTrackMediaItem(this.obj, i);
      yield new Item(item);
    }
  }

  allItems() {
    const result = [];
    for (const item of this.iterItems()) {
      result.push(item);
    }
    return result;
  }
}

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

  /**
   * Split the item at the position. Current item will become left
   * item, and the right item will be returned.
   */
  split(pos: number): Item {
    const rightItem = reaper.SplitMediaItem(this.obj, pos);
    if (rightItem === null)
      throw new Error(`failed to split item at position ${pos}s`);
    return new Item(rightItem);
  }

  delete() {
    const track = this.getTrack();
    const rv = reaper.DeleteTrackMediaItem(track.obj, this.obj);
    if (!rv) throw new Error("failed to delete item");
  }

  get color() {
    const x = reaper.GetMediaItemInfo_Value(this.obj, "I_CUSTOMCOLOR");
    if (x === 0) return null;
    const [r, g, b] = reaper.ColorFromNative(x);
    return { r, g, b };
  }
  set color(x: { r: number; g: number; b: number } | null) {
    let rv: boolean;
    if (x === null) {
      rv = reaper.SetMediaItemInfo_Value(this.obj, "I_CUSTOMCOLOR", 0);
    } else {
      const color = reaper.ColorToNative(x.r, x.g, x.b);
      rv = reaper.SetMediaItemInfo_Value(
        this.obj,
        "I_CUSTOMCOLOR",
        0x1000000 | color,
      );
    }
    if (!rv) throw new Error(`failed to set item color to ${inspect(x)}`);
  }

  /** Item position in seconds. */
  get position() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_POSITION");
  }
  set position(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_POSITION", x);
    if (!rv) throw new Error(`failed to set item position`);
  }

  /** Item snapOffset in seconds. */
  get snapOffset() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_SNAPOFFSET");
  }
  set snapOffset(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_SNAPOFFSET", x);
    if (!rv) throw new Error(`failed to set item snap offset`);
  }

  /** Item length in seconds. */
  get length() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_LENGTH");
  }
  set length(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_LENGTH", x);
    if (!rv) throw new Error(`failed to set item length`);
  }

  get volume() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_VOL");
  }
  set volume(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_VOL", x);
    if (!rv) throw new Error(`failed to set item volume`);
  }

  /** Fade-in length in seconds. */
  get fadeInLength() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_FADEINLEN");
  }
  set fadeInLength(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_FADEINLEN", x);
    if (!rv) throw new Error(`failed to set item fade-in length`);
  }

  /** Fade-out length in seconds. */
  get fadeOutLength() {
    return reaper.GetMediaItemInfo_Value(this.obj, "D_FADEOUTLEN");
  }
  set fadeOutLength(x: number) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "D_FADEOUTLEN", x);
    if (!rv) throw new Error(`failed to set item fade-out length`);
  }

  get muted() {
    return reaper.GetMediaItemInfo_Value(this.obj, "B_MUTE_ACTUAL") !== 0;
  }
  set muted(x: boolean) {
    const rv = reaper.SetMediaItemInfo_Value(
      this.obj,
      "B_MUTE_ACTUAL",
      x ? 1 : 0,
    );
    if (!rv) throw new Error(`failed to set item muted`);
  }

  get loop() {
    return reaper.GetMediaItemInfo_Value(this.obj, "B_LOOPSRC") !== 0;
  }
  set loop(x: boolean) {
    const rv = reaper.SetMediaItemInfo_Value(this.obj, "B_LOOPSRC", x ? 1 : 0);
    if (!rv) throw new Error(`failed to set item loop`);
  }

  get selected() {
    return reaper.IsMediaItemSelected(this.obj);
  }
  set selected(x: boolean) {
    reaper.SetMediaItemSelected(this.obj, x);
  }

  getTrack(): Track {
    const obj = reaper.GetMediaItemTrack(this.obj);
    return new Track(obj);
  }
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

  asTypedTake(): MidiTake | AudioTake {
    if (this.isMidi()) {
      return new MidiTake(this.obj);
    } else {
      return new AudioTake(this.obj);
    }
  }

  getSource() {
    return new Source(reaper.GetMediaItemTake_Source(this.obj));
  }

  getFxCount() {
    return reaper.TakeFX_GetCount(this.obj);
  }

  getAllFx() {
    const count = this.getFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new FX({ take: this.obj }, i));
    }
    return result;
  }

  getFx(idx: number) {
    return new FX({ take: this.obj }, idx);
  }

  /** Returns new position if success, otherwise return nil */
  addFx(
    fx: AddFxParams,
    position?: number | { path: number[]; flags: number },
  ) {
    const fxname = stringifyAddFxParams(fx);

    // will be null if `position` is not given
    let positionNum: number | null = null;
    let positionObj: { path: number[]; flags: number } | null = null;
    if (position !== undefined) {
      if (typeof position === "number") {
        positionObj = parseFxidx({ take: this.obj, fxidx: position });
        positionNum = position;
      } else {
        positionObj = { path: [...position.path], flags: position.flags };
        positionNum = generateFxidx({ take: this.obj, ...position });
      }
    }

    const rv = reaper.TakeFX_AddByName(
      this.obj,
      fxname,
      positionNum === null ? -1 : -1000 - positionNum,
    );
    if (rv === -1) return null;

    // rv is fx index WITHIN container / fxchain, does not have container index
    const newSubposition = rv;
    if (positionObj === null) {
      // no position specified, so it must be root fxchain position
      return newSubposition;
    } else {
      positionObj.path[positionObj.path.length - 1] = newSubposition;
      return generateFxidx({ take: this.obj, ...positionObj });
    }
  }

  getItem(): Item {
    const obj = reaper.GetMediaItemTake_Item(this.obj);
    return new Item(obj);
  }

  getTrack(): Track {
    const obj = reaper.GetMediaItemTake_Track(this.obj);
    return new Track(obj);
  }

  getStretchMarkerCount() {
    return reaper.GetTakeNumStretchMarkers(this.obj);
  }

  get name() {
    const [ok, rv] = reaper.GetSetMediaItemTakeInfo_String(
      this.obj,
      "P_NAME",
      "",
      false,
    );
    if (!ok) throw new Error("failed to get take name");
    return rv;
  }
  set name(x: string) {
    const [ok, rv] = reaper.GetSetMediaItemTakeInfo_String(
      this.obj,
      "P_NAME",
      x,
      true,
    );
    if (!ok) throw new Error("failed to set take name");
  }

  /** Start offset in source media, in seconds */
  get sourceStartOffset() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_STARTOFFS");
    return x;
  }
  set sourceStartOffset(x: number) {
    const ok = reaper.SetMediaItemTakeInfo_Value(this.obj, "D_STARTOFFS", x);
    if (!ok) throw new Error("failed to set take source start offset");
  }

  get volume() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_VOL");
    return x;
  }
  set volume(x: number) {
    const ok = reaper.SetMediaItemTakeInfo_Value(this.obj, "D_VOL", x);
    if (!ok) throw new Error("failed to set take volume");
  }

  get pan() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_PAN");
    return x;
  }
  set pan(x: number) {
    const ok = reaper.SetMediaItemTakeInfo_Value(this.obj, "D_PAN", x);
    if (!ok) throw new Error("failed to set take pan");
  }

  get playrate() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_PLAYRATE");
    return x;
  }
  set playrate(x: number) {
    const ok = reaper.SetMediaItemTakeInfo_Value(this.obj, "D_PLAYRATE", x);
    if (!ok) throw new Error("failed to set take playrate");
  }

  get pitch() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_PITCH");
    return x;
  }
  set pitch(x: number) {
    const ok = reaper.SetMediaItemTakeInfo_Value(this.obj, "D_PITCH", x);
    if (!ok) throw new Error("failed to set take pitch");
  }

  get preservePitch() {
    const x = reaper.GetMediaItemTakeInfo_Value(this.obj, "D_PITCH") !== 0;
    return x;
  }
  set preservePitch(x: boolean) {
    const ok = reaper.SetMediaItemTakeInfo_Value(
      this.obj,
      "D_PITCH",
      x ? 1 : 0,
    );
    if (!ok) throw new Error("failed to set take preserve pitch");
  }
}

export class MidiTake extends Take {
  TYPE = "MIDI" as const;

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

  *iterNotes() {
    let i = 0;
    while (true) {
      let [rv, selected, muted, startTick, endTick, chan, pitch, vel] =
        reaper.MIDI_GetNote(this.obj, i);
      if (!rv) break;

      yield { selected, muted, startTick, endTick, chan, pitch, vel };

      i += 1;
    }
  }

  allNotes() {
    const result = [];
    for (const note of this.iterNotes()) {
      result.push(note);
    }
    return result;
  }

  tickToProjectTime(tick: number): number {
    return reaper.MIDI_GetProjTimeFromPPQPos(this.obj, tick);
  }
}

/** TODO */
export class AudioTake extends Take {
  TYPE = "AUDIO" as const;
}

export class Source {
  obj: PCM_source;

  constructor(obj: PCM_source) {
    this.obj = obj;
  }

  type() {
    return reaper.GetMediaSourceType(this.obj);
  }

  /**
   * Get the filename. If the item is reversed / is a section, this will error.
   * Use `getParent()` to get the root source first.
   */
  getFilename() {
    const name = reaper.GetMediaSourceFileName(this.obj);
    if (name.length === 0) throw new Error("failed to get PCM_source filename");

    return name;
  }

  /** Return the length in seconds. Errors if source is beat-based. */
  getLength() {
    const [length, isQuarterNotes] = reaper.GetMediaSourceLength(this.obj);
    if (isQuarterNotes)
      throw new Error("source is beat-based, does not have length in seconds");
    return length;
  }

  /** Return the length in beats. Errors if source is seconds-based. */
  getBeatLength() {
    const [length, isQuarterNotes] = reaper.GetMediaSourceLength(this.obj);
    if (!isQuarterNotes)
      throw new Error("source is seconds-based, does not have length in beats");
    return length;
  }

  /** Find the highest parent of this source. If no parent, just return current source */
  findRootParent() {
    let source: Source = this;
    while (true) {
      const parent = source.getParent();
      if (parent === null) return source;

      source = parent;
    }
  }

  /** Get parent of this source, returns null if no parent */
  getParent() {
    const parent = reaper.GetMediaSourceParent(this.obj);
    if (parent === null) return null;

    return new Source(parent);
  }

  getSectionInfo() {
    const [isSection, offset, length, reversed] =
      reaper.PCM_Source_GetSectionInfo(this.obj);
    return { isSection, offset, length, reversed };
  }
}

/**
 * ================================================================
 *
 * Track routing functions
 *
 * ================================================================
 */

export enum TrackRoutingCategory {
  Receive = -1,
  Send = 0,
  HWOutput = 1,
}

export enum TrackSendMode {
  PostFader = 0,
  PreFx = 1,
  PostFxDeprecated = 2,
  PostFx = 3,
}

export enum TrackSendAutomationMode {
  TrackDefault = -1,
  Trim = 0,
  Read = 1,
  Touch = 2,
  Write = 3,
  Latch = 4,
}

namespace TrackRouting {
  export function parseMidiFlags(flags: number) {
    const first5bits = flags & 0b0000011111;
    const midiSendDisabled = first5bits === 0b11111;
    if (midiSendDisabled) return null;

    const next5bits = flags & 0b1111100000;
    const srcChannel = first5bits === 0 ? ("all" as const) : first5bits;
    const dstChannel = next5bits === 0 ? ("all" as const) : next5bits;

    // flag to indicate that the faders are controlling midi data
    // toggled with a button
    const fadersSendMidiVolPan = (flags & 1024) !== 0;

    const rawSrcBus = (flags >>> 14) & 255;
    const srcBus = rawSrcBus === 0 ? ("all" as const) : rawSrcBus;
    const rawDstBus = (flags >>> 22) & 255;
    const dstBus = rawDstBus === 0 ? ("all" as const) : rawDstBus;

    return {
      srcChannel,
      dstChannel,
      srcBus,
      dstBus,
      fadersSendMidiVolPan,
    };
  }

  export function generateMidiFlags(
    opt: ReturnType<typeof parseMidiFlags>,
  ): number {
    if (opt === null) return 0b11111;

    return (
      (opt.srcChannel === "all" ? 0 : opt.srcChannel) |
      ((opt.dstChannel === "all" ? 0 : opt.dstChannel) << 5) |
      ((opt.srcBus === "all" ? 0 : opt.srcBus) << 14) |
      ((opt.dstBus === "all" ? 0 : opt.dstBus) << 22) |
      (opt.fadersSendMidiVolPan ? 1024 : 0)
    );
  }

  export function getAudioInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
  ) {
    const GTSI_V = (param: string) => {
      return reaper.GetTrackSendInfo_Value(track, category, idx, param);
    };
    const I_SRCCHAN = GTSI_V("I_SRCCHAN");
    if (I_SRCCHAN === -1) {
      return null;
    }

    const srcChannelOffset = I_SRCCHAN & 0b1111111111;
    let channelCount: number;
    switch (I_SRCCHAN >>> 10) {
      case 0:
        channelCount = 2;
        break;
      case 1:
        channelCount = 1;
        break;
      default:
        channelCount = (I_SRCCHAN >>> 10) * 2;
        break;
    }

    const I_DSTCHAN = GTSI_V("I_DSTCHAN");
    const dstChannelOffset = I_DSTCHAN & 0b01111111111;
    // idk what this is
    const mixToMono = (I_DSTCHAN & 0b10000000000) !== 0;

    const muted = GTSI_V("B_MUTE") === 1;
    const phaseInverted = GTSI_V("B_PHASE") === 1;
    const mono = GTSI_V("B_MONO") === 1;
    const volume = GTSI_V("D_VOL");
    const pan = GTSI_V("D_PAN");
    const D_PANLAW = GTSI_V("D_PANLAW");
    const panLaw = D_PANLAW === -1 ? null : D_PANLAW;
    const sendMode = GTSI_V("I_SENDMODE") as TrackSendMode;
    const automationMode = GTSI_V("I_AUTOMODE") as TrackSendAutomationMode;

    return {
      channelCount,
      srcChannelOffset,
      dstChannelOffset,
      muted,
      phaseInverted,
      mono,
      volume,
      pan,
      panLaw,
      sendMode,
      automationMode,
      mixToMono,
    };
  }

  export function setAudioInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
    opt: ReturnType<typeof getAudioInfo>,
  ) {
    const STSI_V = (param: string, val: number) => {
      const ok = reaper.SetTrackSendInfo_Value(
        track,
        category,
        idx,
        param,
        val,
      );
      if (!ok)
        throw new Error(
          `Failed to update track audio send info:\nreaper.SetTrackSendInfo_Value(track, ${
            TrackRoutingCategory[category]
          }, ${idx}, ${inspect(param)}, ${val})`,
        );
    };

    if (opt === null) {
      STSI_V("I_SRCCHAN", -1);
      return;
    }

    // set I_SRCCHAN
    {
      let I_SRCCHAN = 0;
      I_SRCCHAN += opt.srcChannelOffset & 0b1111111111;
      switch (opt.channelCount) {
        case 2:
          I_SRCCHAN += 0 << 10;
          break;
        case 1:
          I_SRCCHAN += 1 << 10;
          break;
        default:
          I_SRCCHAN += (opt.channelCount / 2) << 10;
          break;
      }
      STSI_V("I_SRCCHAN", I_SRCCHAN);
    }

    // set I_DSTCHAN
    {
      let I_DSTCHAN = 0;
      I_DSTCHAN += opt.dstChannelOffset & 0b01111111111;
      I_DSTCHAN += opt.mixToMono ? 0b10000000000 : 0;
      STSI_V("I_DSTCHAN", I_DSTCHAN);
    }

    STSI_V("B_MUTE", opt.muted ? 1 : 0);
    STSI_V("B_PHASE", opt.phaseInverted ? 1 : 0);
    STSI_V("B_MONO", opt.mono ? 1 : 0);
    STSI_V("D_VOL", opt.volume);
    STSI_V("D_PAN", opt.pan);
    STSI_V("D_PANLAW", opt.panLaw === null ? -1 : opt.panLaw);
    STSI_V("I_SENDMODE", opt.sendMode);
    STSI_V("I_AUTOMODE", opt.automationMode);
  }

  export function getInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
  ) {
    const audio = TrackRouting.getAudioInfo(track, category, idx);

    const midiFlags = reaper.GetTrackSendInfo_Value(
      track,
      category,
      idx,
      "I_MIDIFLAGS",
    );
    const midi = TrackRouting.parseMidiFlags(midiFlags);

    return { audio, midi };
  }

  export function setInfo(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
    opt: ReturnType<typeof getInfo>,
  ) {
    TrackRouting.setAudioInfo(track, category, idx, opt.audio);
    const midiFlags = TrackRouting.generateMidiFlags(opt.midi);
    const ok = reaper.SetTrackSendInfo_Value(
      track,
      category,
      idx,
      "I_MIDIFLAGS",
      midiFlags,
    );
    if (!ok) throw new Error("Failed to set track send MIDI flags");
  }

  export function getTargetTracks(
    track: MediaTrack,
    category: TrackRoutingCategory.Send | TrackRoutingCategory.Receive,
    idx: number,
  ) {
    const dst: MediaTrack = reaper.GetTrackSendInfo_Value(
      track,
      category,
      idx,
      "P_DESTTRACK",
    );
    const src: MediaTrack = reaper.GetTrackSendInfo_Value(
      track,
      category,
      idx,
      "P_SRCTRACK",
    );
    return { dst: new Track(dst), src: new Track(src) };
  }

  export function getParentAudioInfo(
    track: MediaTrack,
  ): ReturnType<typeof getAudioInfo> {
    const sendsAudioToParent =
      reaper.GetMediaTrackInfo_Value(track, "B_MAINSEND") === 1;

    if (!sendsAudioToParent) return null;

    const trackChannelCount = reaper.GetMediaTrackInfo_Value(track, "I_NCHAN");
    const dstChannelOffset = reaper.GetMediaTrackInfo_Value(
      track,
      "C_MAINSEND_OFFS",
    );
    const rawSendChannelCount = reaper.GetMediaTrackInfo_Value(
      track,
      "C_MAINSEND_NCH",
    );
    const sendChannelCount =
      rawSendChannelCount === 0 ? trackChannelCount : rawSendChannelCount;

    return {
      channelCount: sendChannelCount,
      srcChannelOffset: 0, // always 0, no way to send with src offset
      dstChannelOffset: dstChannelOffset,
      // Hard-code values here instead of actually using fader values.
      // Because this should be in line with how the other sends behave.
      //
      // Imagine the fx audio flow looks like this:
      //
      //              +->Info-->Track1 (post-fade send)
      //              |
      //  FX-+->Fader-+->XXXX-->Parent
      //     |
      //     +->Info-->Track2 (pre-fade send)
      //
      // The 'Fader' is where the volume slider, pan, etc actually happens.
      // The 'Info' is what's being returned by these routing functions.
      // The 'XXXX' is what this function returns. It doesn't really exist
      // in Reaper's audio chain but this is a useful abstraction for me.
      muted: false,
      phaseInverted: false,
      mono: false,
      volume: 1,
      pan: 0,
      panLaw: null, // null means project default
      sendMode: TrackSendMode.PostFader, // post fader is the default
      automationMode: TrackSendAutomationMode.TrackDefault, // i'm lazy so i'll just set this as default for now
      mixToMono: false, // no idea what this is
    };
  }

  export function getParentMidiInfo(
    track: MediaTrack,
  ): ReturnType<typeof parseMidiFlags> {
    const sendsAudioToParent =
      reaper.GetMediaTrackInfo_Value(track, "B_MAINSEND") === 1;

    // this also includes midi I think
    if (!sendsAudioToParent) return null;

    const I_MIDI_CTL_CHAN = reaper.GetMediaTrackInfo_Value(
      track,
      "I_MIDI_CTL_CHAN",
    );
    let faderLinkedChannel: number | "all" | null;
    switch (I_MIDI_CTL_CHAN) {
      case 16:
        faderLinkedChannel = "all" as const;
        break;
      case -1:
        faderLinkedChannel = null;
        break;
      default:
        faderLinkedChannel = I_MIDI_CTL_CHAN + 1;
        break;
    }

    return {
      // there's no documentation on how to get these
      // so i'll assume all are send
      srcChannel: "all",
      dstChannel: "all",
      srcBus: "all",
      dstBus: "all",
      fadersSendMidiVolPan: faderLinkedChannel !== null,
    };
  }

  export function getParentInfo(track: MediaTrack): ReturnType<typeof getInfo> {
    const audio = TrackRouting.getParentAudioInfo(track);
    const midi = TrackRouting.getParentMidiInfo(track);
    return { audio, midi };
  }

  export function createSend(src: MediaTrack, dst: MediaTrack | null): number {
    const idx = reaper.CreateTrackSend(src, dst);
    if (idx < 0)
      throw new Error(
        `failed to create track send from Track ${new Track(src).getIdx()} to ${
          dst === null ? "HW" : "Track " + new Track(dst).getIdx()
        }`,
      );

    return idx;
  }

  export function removeSend(
    track: MediaTrack,
    category: TrackRoutingCategory,
    idx: number,
  ) {
    const ok = reaper.RemoveTrackSend(track, category, idx);
    if (!ok)
      throw new Error(
        `failed to remove track ${
          TrackRoutingCategory[category]
        } #${idx} from Track ${new Track(track).getIdx()}`,
      );
  }
}

/**
 * Iterates through all tracks in the project, then returns maps for sending and receiving
 * tracks. This includes the default routing to folder parents.
 *
 * - `sends`: Maps from `trackIdx` to a list of `trackIdx` which this track sends to
 * - `receives`: Maps from `trackIdx` to a list of `trackIdx` sends to this track
 *
 * Note: The `receives` map contains `-1` which represent the master track.
 *
 * @param opt Specify what kind of routing to filter for. E.g. If you only care about audio
 *            routing, specify `{ audio: true }`
 */
export function getProjectRoutingInfo(
  opt: {
    audio?: boolean;
    midi?: boolean;
  } = { audio: true, midi: true },
) {
  const count = Track.count();

  const sends: LuaTable<number, number[]> = new LuaTable();
  const receives: LuaTable<number, number[]> = new LuaTable();

  for (let srcIdx = 0; srcIdx < count; srcIdx++) {
    const track = Track.getByIdx(srcIdx);

    for (const send of track.getSends(true)) {
      if (opt.audio && opt.midi) {
        if (!(send.audio || send.midi)) continue;
      } else if (opt.audio) {
        if (!send.audio) continue;
      } else if (opt.midi) {
        if (!send.midi) continue;
      }

      const dstIdx = send.dst.getIdx();

      if (!sends.has(srcIdx)) sends.set(srcIdx, []);
      sends.get(srcIdx).push(dstIdx);

      if (!receives.has(dstIdx)) receives.set(dstIdx, []);
      receives.get(dstIdx).push(srcIdx);
    }
  }

  return { sends, receives };
}
