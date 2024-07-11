import * as ArrChunk from "./arrchunk";
import * as Base64 from "./base64";
import * as Chunk from "./chunk";
import { msgBox } from "./utils";

function parseLittleEndianInteger(bytes: string): number {
  let result: number = 0;
  for (let i = 0; i < bytes.length; i++) {
    let byte = string.byte(bytes, i + 1); // lua indexes start from 1
    result += byte << (i * 8);
  }
  return result;
}

abstract class BaseFX {
  abstract readonly type: "track" | "take";
  abstract readonly fxidx: number;
  abstract GetNamedConfigParm(name: string): string | null;
  abstract SetNamedConfigParm(name: string, value: string): boolean;
  protected abstract GetNumParams(): number;
  abstract GetParamIdent(param: number): string | null;
  abstract GetParamName(param: number): string | null;
  protected abstract GetFXGUID(): string | null;
  protected abstract GetOffline(): boolean;

  guid() {
    const guid = this.GetFXGUID();
    if (!guid) error("failed to get FX GUID");
    return guid;
  }

  abstract getParameter(param: number): FXParam;

  getParameters() {
    const totalCount = this.GetNumParams();
    const result = [];
    for (let i = 0; i < totalCount; i++) {
      result.push(this.getParameter(i));
    }
    return result;
  }

  /** Return the plugin name as seen by the user, might be renamed by the user */
  abstract getName(): string;

  /** Return the "true" plugin name, ignoring the user renamed title */
  getOriginalName() {
    const name = this.GetNamedConfigParm("fx_name");
    if (!name) error("failed to get FX name");
    return name;
  }

  getIdent() {
    const ident = this.GetNamedConfigParm("fx_ident");
    if (!ident) error("failed to get FX ident");
    return ident;
  }

  getType() {
    const type = this.GetNamedConfigParm("fx_type");
    if (!type) error("failed to get FX type");
    return type;
  }

  getPDCLatency() {
    const pdc = this.GetNamedConfigParm("pdc");
    if (!pdc) error("failed to get FX pdc");
    return pdc;
  }

  /** 0x1000000 is used to indicate flags and shit, so remove that part */
  decipherFxidx() {
    const actualIdx = 0x0ffffff & this.fxidx;
    const isRecInputOrHardwareOutput = (this.fxidx & 0x1000000) !== 0;
    const isInContainer = (this.fxidx & 0x2000000) !== 0;

    if (isInContainer) {
      // the rules are fucking insane, i'm not doing this
      return {
        // actualIdx, // not actual idx
        isRecInputOrHardwareOutput,
        isInContainer,
      };
    } else {
      return {
        actualIdx,
        isRecInputOrHardwareOutput,
        isInContainer,
      };
    }
  }

  protected abstract getArrChunk(): ArrChunk.ArrChunk;

  /** NOTE: This returns raw byte strings! Please encode with base64 before copying to clipboard */
  private parseArrChunk(arr: ArrChunk.ArrChunk) {
    // first line should be tag line
    const tagLine = arr.shift();
    if (typeof tagLine !== "string") error("fx chunk is missing header line");
    if (!tagLine) error("fx chunk is missing header line");

    // find the base64 array
    if (tagLine.startsWith("VST")) {
      // vst, rest of the array must be strings
      for (const x of arr) {
        if (typeof x !== "string")
          error(
            `fx chunk should not contain sub-elements, but found an element: ${x[0]}`,
          );
      }
      const b64arr = arr as string[];

      // rest of 'arr' only contains base64 data
      // but it may be separated into "blocks", detect and separate these blocks first
      const b64arrBlocks = b64arr.reduce(
        (acc, line) => {
          // add line to current block
          acc[acc.length - 1].push(line);

          if (line.endsWith("=")) {
            // end of current block, create a new block now
            acc.push([]);
          }

          return acc;
        },
        [[]] as string[][],
      );
      if (b64arrBlocks[b64arrBlocks.length - 1].length === 0) {
        // remove final empty block if exists
        b64arrBlocks.pop();
      }
      // join each block into strings
      const b64blocks = b64arrBlocks.map((lines) => lines.join(""));
      // decode from base64 and join all of them
      let alldata = b64blocks.map((b) => Base64.decode(b)).join("");

      // parse header and footer
      // https://forum.cockos.com/showthread.php?t=292773
      // https://forum.cockos.com/showthread.php?t=168478
      // https://forum.cockos.com/showthread.php?t=240523

      const vstid = alldata.slice(0, 4);
      const magic = alldata.slice(4, 8);

      let i = 8;

      const inputCount = parseLittleEndianInteger(alldata.slice(i, i + 4));
      i += 4;
      i += inputCount * 8;

      const outputCount = parseLittleEndianInteger(alldata.slice(i, i + 4));
      i += 4;
      i += outputCount * 8;

      const fxdataLength = parseLittleEndianInteger(alldata.slice(i, i + 4));
      i += 4;

      const magicEnd = alldata.slice(i, i + 8);
      i += 8;

      // log(`b64blocks.length = ${inspect(b64blocks.length)}`);
      // log(`inputCount = ${inspect(inputCount)}`);
      // log(`outputCount = ${inspect(outputCount)}`);
      // log(`fxdataLength = ${inspect(fxdataLength)}`);
      // log(`i = ${inspect(i)}`);
      // log(`alldata.length = ${inspect(alldata.length)}`);
      // log(`vstid = ${inspect(vstid)}`);
      // log(`magic = ${inspect(magic)}`);
      // log(`magicEnd = ${inspect(magicEnd)}`);

      // This doesn't work due to transpilation issues:
      // https://github.com/TypeScriptToLua/TypeScriptToLua/issues/903
      // assert(
      //   magicEnd === "\x01\x00\x00\x00\x00\x00\x10\x00" ||
      //     magicEnd === "\x01\x00\x00\x00\xff\xff\x10\x00",
      //   `header end sequence is malformed: ${encode(magicEnd)}`,
      // );

      const fxdataStart = i;

      assert(
        fxdataStart + fxdataLength < alldata.length,
        "fxdata exceeds actual chunk size",
      );
      const headerdata = alldata.slice(0, fxdataStart);
      const fxdata = alldata.slice(fxdataStart, fxdataStart + fxdataLength);
      const footerdata = alldata.slice(
        fxdataStart + fxdataLength,
        alldata.length,
      );

      return {
        headerdata,
        fxdata,
        footerdata,
        inputCount,
        outputCount,
        fxdataLength,
        vstid,
        magic,
      };
    } else if (tagLine.startsWith("CLAP")) {
      // clap, find the subelement <STATE ...>
      const b64arr = (() => {
        for (const x of arr) {
          if (typeof x !== "string") {
            const stateTag = x[0];
            if (typeof stateTag !== "string")
              error("clap state chunk is missing header line");
            if (stateTag !== "STATE") continue;
            const state = x.slice(1, x.length);
            for (const x of state) {
              if (typeof x !== "string")
                error(
                  `clap state element should not contain sub-elements, but found an element: ${x[0]}`,
                );
            }
            return state as string[];
          }
        }
        error(`failed to get CLAP plugin state: ${tagLine}`);
      })();

      // join the arr and decode it
      const fxdata = Base64.decode(b64arr.join(""));

      return { fxdata };
    } else {
      error(`this kind of fx chunk is not supported: ${tagLine}`);
    }
  }

  /** Return the base64-encoded chunk data if the plugin supports chunks. Otherwise, return null; */
  getData(): string | null {
    const type = this.getType().toUpperCase();
    let chunk: string | null = null;
    if (type.includes("VST")) {
      chunk = this.GetNamedConfigParm("vst_chunk");
    } else if (type.includes("CLAP")) {
      chunk = this.GetNamedConfigParm("clap_chunk");
    } else {
      // plugin type doesn't support chunks
      return null;
    }
    // failsafe testing
    if (chunk !== null) {
      const arrchunk = this.getArrChunk();
      const { fxdata } = this.parseArrChunk(arrchunk);
      const testchunk = Base64.encode(fxdata);
      if (chunk !== testchunk) {
        msgBox(
          "Debug",
          "Successfully got chunk data the normal way!\nHowever, the alternative FX chunk parser would have given different output, please debug this!",
        );
      }
    }
    // handle offline FX chunk data
    if (chunk === null && this.isOffline()) {
      const arrchunk = this.getArrChunk();
      const { fxdata } = this.parseArrChunk(arrchunk);
      chunk = Base64.encode(fxdata);
    }
    // if null, plugin supports chunks, but we can't get it for some reason
    if (chunk === null) error("failed to get FX chunk");
    return chunk;
  }

  isOffline() {
    return this.GetOffline();
  }
}

export class TrackFX extends BaseFX {
  type = "track" as const;
  track: MediaTrack;
  fxidx: number;

  constructor(track: MediaTrack, fxidx: number) {
    super();
    this.track = track;
    this.fxidx = fxidx;
  }

  GetNamedConfigParm(name: string) {
    const [ok, value] = reaper.TrackFX_GetNamedConfigParm(
      this.track,
      this.fxidx,
      name,
    );
    return ok ? value : null;
  }

  SetNamedConfigParm(name: string, value: string) {
    return reaper.TrackFX_SetNamedConfigParm(
      this.track,
      this.fxidx,
      name,
      value,
    );
  }

  protected GetNumParams() {
    return reaper.TrackFX_GetNumParams(this.track, this.fxidx);
  }

  GetParamIdent(param: number) {
    const [ok, value] = reaper.TrackFX_GetParamIdent(
      this.track,
      this.fxidx,
      param,
    );
    return ok ? value : null;
  }

  GetParamName(param: number) {
    const [ok, value] = reaper.TrackFX_GetParamName(
      this.track,
      this.fxidx,
      param,
    );
    return ok ? value : null;
  }

  protected GetFXGUID() {
    return reaper.TrackFX_GetFXGUID(this.track, this.fxidx);
  }

  protected GetOffline() {
    return reaper.TrackFX_GetOffline(this.track, this.fxidx);
  }

  getParameter(param: number): FXParam {
    return new FXParam({ track: this.track }, this.fxidx, param);
  }

  getName() {
    const [ok, value] = reaper.TrackFX_GetFXName(this.track, this.fxidx);
    if (!ok) error("failed to get FX name");
    return value;
  }

  protected getArrChunk(): ArrChunk.ArrChunk {
    const decipher = this.decipherFxidx();
    // fuck containers
    if (decipher.isInContainer)
      error("unable to get chunk data from FX in containers");

    let fxchainTag: string;
    if (decipher.isRecInputOrHardwareOutput) {
      const masterTrack = reaper.GetMasterTrack(0);
      const isMasterTrack = this.track === masterTrack;
      if (isMasterTrack) {
        // is hardware output
        // TODO: no idea where to find this
        error("unable to get chunk data from FX in monitor FX");
      } else {
        // is rec input fx
        fxchainTag = "FXCHAIN_REC";
      }
    } else {
      const totalFxCount = reaper.TrackFX_GetCount(this.track);
      assert(
        decipher.actualIdx < totalFxCount,
        `FX index of ${decipher.actualIdx} exceeds track FX count of ${totalFxCount}`,
      );
      fxchainTag = "FXCHAIN";
    }

    const chunk = Chunk.track(this.track);
    if (!ArrChunk._testChunk(chunk))
      error("failsafe - error when parsing track chunk data");
    const arrchunk = ArrChunk.fromChunk(chunk);
    let fxchainarr: ArrChunk.ArrChunk | null = null;
    for (const child of arrchunk) {
      if (typeof child === "string") continue;

      const tag = child[0];
      if (tag === fxchainTag) {
        fxchainarr = child;
        break;
      }
    }
    if (fxchainarr === null)
      error(`failed to find <${fxchainTag}> element in track chunk data`);

    const fxchunks = fxchainarr.filter((x) => typeof x !== "string");

    // TODO: There is extra data added to the beginning and end of the chunk data
    // Find a way to remove it
    // https://forum.cockos.com/showthread.php?t=292773

    return fxchunks[decipher.actualIdx];
  }
}

export class TakeFX extends BaseFX {
  type = "take" as const;
  take: MediaItem_Take;
  fxidx: number;

  constructor(take: MediaItem_Take, fxidx: number) {
    super();
    this.take = take;
    this.fxidx = fxidx;
  }

  GetNamedConfigParm(name: string) {
    const [ok, value] = reaper.TakeFX_GetNamedConfigParm(
      this.take,
      this.fxidx,
      name,
    );
    return ok ? value : null;
  }

  SetNamedConfigParm(name: string, value: string) {
    return reaper.TakeFX_SetNamedConfigParm(this.take, this.fxidx, name, value);
  }

  protected GetNumParams() {
    return reaper.TakeFX_GetNumParams(this.take, this.fxidx);
  }

  GetParamIdent(param: number) {
    const [ok, value] = reaper.TakeFX_GetParamIdent(
      this.take,
      this.fxidx,
      param,
    );
    return ok ? value : null;
  }

  GetParamName(param: number) {
    const [ok, value] = reaper.TakeFX_GetParamName(
      this.take,
      this.fxidx,
      param,
    );
    return ok ? value : null;
  }

  protected GetFXGUID() {
    return reaper.TakeFX_GetFXGUID(this.take, this.fxidx);
  }

  protected GetOffline() {
    return reaper.TakeFX_GetOffline(this.take, this.fxidx);
  }

  getParameter(param: number): FXParam {
    return new FXParam({ take: this.take }, this.fxidx, param);
  }

  getName() {
    const [ok, value] = reaper.TakeFX_GetFXName(this.take, this.fxidx);
    if (!ok) error("failed to get FX name");
    return value;
  }

  protected getArrChunk(): ArrChunk.ArrChunk {
    error("TODO: Implement parsing chunk data of items");
  }
}

export type FX = TrackFX | TakeFX;

export class FXParam {
  fx: FX;
  param: number;

  constructor(
    target: { track: MediaTrack } | { take: MediaItem_Take },
    fxidx: number,
    param: number,
  ) {
    if ("track" in target) {
      this.fx = new TrackFX(target.track, fxidx);
    } else {
      this.fx = new TakeFX(target.take, fxidx);
    }
    this.param = param;
  }

  /** A wrapper for the FX's GetNamedConfigParm() to parse it as a number. */
  private _parseFXConfig(name: string, fallback: number) {
    const text = this.fx.GetNamedConfigParm(name);
    if (!text) return fallback;

    const result = tonumber(text);
    if (result === undefined)
      error("failed to parse named config parm as number");

    return result;
  }

  /** A wrapper for the FX's SetNamedConfigParm() to allow number / bool arguments. */
  private _setFXConfig(name: string, value: number | boolean) {
    if (typeof value === "number") {
      this.fx.SetNamedConfigParm(name, value.toString());
    } else {
      this.fx.SetNamedConfigParm(name, value ? "1" : "0");
    }
  }

  getIdent() {
    const rv = this.fx.GetParamIdent(this.param);
    if (!rv) error("param object is no longer valid");
    return rv;
  }

  getName() {
    const rv = this.fx.GetParamName(this.param);
    if (!rv) error("param object is no longer valid");
    return rv;
  }

  modulationActive(): boolean {
    return this._parseFXConfig(`param.${this.param}.mod.active`, 0) === 1;
  }

  getModulation(): ModulationInfo | null {
    const param = this.param;

    const modActive = this._parseFXConfig(`param.${param}.mod.active`, 0) === 1;
    if (!modActive) return null;

    const modInfo: ModulationInfo = {
      baseline: this._parseFXConfig(`param.${param}.mod.baseline`, 0),
      acs: null,
      lfo: null,
      plink: null,
    };

    const lfoActive = this._parseFXConfig(`param.${param}.lfo.active`, 0) === 1;
    if (lfoActive) {
      modInfo.lfo = {
        dir: this._parseFXConfig(`param.${param}.lfo.dir`, 1) as -1 | 0 | 1,
        phase: this._parseFXConfig(`param.${param}.lfo.phase`, 0),
        speed: this._parseFXConfig(`param.${param}.lfo.speed`, 1),
        strength: this._parseFXConfig(`param.${param}.lfo.strength`, 1),
        tempoSync: this._parseFXConfig(`param.${param}.lfo.temposync`, 0) === 1,
        free: this._parseFXConfig(`param.${param}.lfo.free`, 0) === 1,
        shape: this._parseFXConfig(`param.${param}.lfo.shape`, 0),
      };
    }

    const acsActive = this._parseFXConfig(`param.${param}.acs.active`, 0) === 1;
    if (acsActive) {
      modInfo.acs = {
        dir: this._parseFXConfig(`param.${param}.acs.dir`, 1) as -1 | 0 | 1,
        strength: this._parseFXConfig(`param.${param}.acs.strength`, 1),
        attack: this._parseFXConfig(`param.${param}.acs.attack`, 300),
        release: this._parseFXConfig(`param.${param}.acs.release`, 300),
        minVol: this._parseFXConfig(`param.${param}.acs.dblo`, -24),
        maxVol: this._parseFXConfig(`param.${param}.acs.dbhi`, 0),
        chan: this._parseFXConfig(`param.${param}.acs.chan`, -1),
        stereo: this._parseFXConfig(`param.${param}.acs.stereo`, 0) === 1,
        x2: this._parseFXConfig(`param.${param}.acs.x2`, 0.5),
        y2: this._parseFXConfig(`param.${param}.acs.y2`, 0.5),
      };
    }

    const plinkActive =
      this._parseFXConfig(`param.${param}.plink.active`, 0) === 1;
    if (plinkActive) {
      modInfo.plink = {
        scale: this._parseFXConfig(`param.${param}.plink.scale`, 1),
        offset: this._parseFXConfig(`param.${param}.plink.offset`, 0),
        fxidx: this._parseFXConfig(`param.${param}.plink.effect`, -1),
        param: this._parseFXConfig(`param.${param}.plink.param`, -1),
        midi_bus: this._parseFXConfig(`param.${param}.plink.midi_bus`, 0),
        midi_chan: this._parseFXConfig(`param.${param}.plink.midi_chan`, 0),
        midi_msg: this._parseFXConfig(`param.${param}.plink.midi_msg`, 0),
        midi_msg2: this._parseFXConfig(`param.${param}.plink.midi_msg2`, 0),
      };
    }

    return modInfo;
  }

  setModulation(modInfo: ModulationInfo | null) {
    const param = this.param;

    this._setFXConfig(`param.${param}.mod.active`, modInfo !== null);
    if (modInfo === null) return;

    this._setFXConfig(`param.${param}.mod.baseline`, modInfo.baseline);

    this._setFXConfig(`param.${param}.lfo.active`, modInfo.lfo !== null);
    if (modInfo.lfo !== null) {
      this._setFXConfig(`param.${param}.lfo.dir`, modInfo.lfo.dir);
      this._setFXConfig(`param.${param}.lfo.phase`, modInfo.lfo.phase);
      this._setFXConfig(`param.${param}.lfo.speed`, modInfo.lfo.speed);
      this._setFXConfig(`param.${param}.lfo.strength`, modInfo.lfo.strength);
      this._setFXConfig(`param.${param}.lfo.temposync`, modInfo.lfo.tempoSync);
      this._setFXConfig(`param.${param}.lfo.free`, modInfo.lfo.free);
      this._setFXConfig(`param.${param}.lfo.shape`, modInfo.lfo.shape);
    }

    this._setFXConfig(`param.${param}.acs.active`, modInfo.acs !== null);
    if (modInfo.acs !== null) {
      this._setFXConfig(`param.${param}.acs.dir`, modInfo.acs.dir);
      this._setFXConfig(`param.${param}.acs.strength`, modInfo.acs.strength);
      this._setFXConfig(`param.${param}.acs.attack`, modInfo.acs.attack);
      this._setFXConfig(`param.${param}.acs.release`, modInfo.acs.release);
      this._setFXConfig(`param.${param}.acs.dblo`, modInfo.acs.minVol);
      this._setFXConfig(`param.${param}.acs.dbhi`, modInfo.acs.maxVol);
      this._setFXConfig(`param.${param}.acs.chan`, modInfo.acs.chan);
      this._setFXConfig(`param.${param}.acs.stereo`, modInfo.acs.stereo);
      this._setFXConfig(`param.${param}.acs.x2`, modInfo.acs.x2);
      this._setFXConfig(`param.${param}.acs.y2`, modInfo.acs.y2);
    }

    this._setFXConfig(`param.${param}.plink.active`, modInfo.plink !== null);
    if (modInfo.plink) {
      this._setFXConfig(`param.${param}.plink.scale`, modInfo.plink.scale);
      this._setFXConfig(`param.${param}.plink.offset`, modInfo.plink.offset);
      this._setFXConfig(`param.${param}.plink.effect`, modInfo.plink.fxidx);
      this._setFXConfig(`param.${param}.plink.param`, modInfo.plink.param);
      this._setFXConfig(
        `param.${param}.plink.midi_bus`,
        modInfo.plink.midi_bus,
      );
      this._setFXConfig(
        `param.${param}.plink.midi_chan`,
        modInfo.plink.midi_chan,
      );
      this._setFXConfig(
        `param.${param}.plink.midi_msg`,
        modInfo.plink.midi_msg,
      );
      this._setFXConfig(
        `param.${param}.plink.midi_msg2`,
        modInfo.plink.midi_msg2,
      );
    }

    return modInfo;
  }
}

export type ModulationInfo = {
  // active: boolean; // let presence of hash indicate active/inactive
  // visible: boolean, // whether the modulation window is shown, i don't care
  baseline: number;
  // audio control signal
  acs: {
    chan: number;
    stereo: boolean;
    attack: number;
    release: number;
    minVol: number;
    maxVol: number;
    strength: number;
    dir: 1 | 0 | -1;
    // the curve point control
    x2: number;
    y2: number;
  } | null;
  lfo: {
    shape: number; // an enum in 0-5
    dir: 1 | 0 | -1;
    phase: number;
    tempoSync: boolean;
    speed: number;
    strength: number;
    free: boolean; // "Phase reset" in modulation window
  } | null;
  // parameter link (to midi or other fx param)
  plink: {
    offset: number;
    scale: number;
    // target is FX:
    fxidx: number; // 'effect', will be '-100' if linked to MIDI
    param: number; // param idx
    // target is MIDI:
    midi_bus: number;
    midi_chan: number;
    midi_msg: number;
    midi_msg2: number;
  } | null;
  // MIDI/OSC Learn
  // I don't have a MIDI controller so I can't test this
  // learn: {
  //   midi1: number;
  //   midi2: number;
  //   osc: number;
  //   mode: number;
  //   flags: number;
  // };
};

export function getLastTouchedFx() {
  const [retval, trackidx, itemidx, takeidx, fxidx, parm] =
    reaper.GetTouchedOrFocusedFX(1);
  if (!retval) return null;

  const isMaster = trackidx === -1;
  const track = isMaster
    ? reaper.GetMasterTrack(0)
    : reaper.GetTrack(0, trackidx);

  if (itemidx === -1) {
    return new TrackFX(track, fxidx);
  } else {
    const item = reaper.GetTrackMediaItem(track, itemidx);
    const take = reaper.GetTake(item, takeidx);
    return new TakeFX(take, fxidx);
  }
}
