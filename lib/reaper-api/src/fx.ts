import * as Base64 from "./base64";
import * as Chunk from "./chunk";
import { Element, parse } from "./element";
import { inspect } from "./inspect";
import { assertUnreachable, msgBox } from "./utils";

function parseLittleEndianInteger(bytes: string): number {
  let result: number = 0;
  for (let i = 0; i < bytes.length; i++) {
    let byte = string.byte(bytes, i + 1); // lua indexes start from 1
    result += byte << (i * 8);
  }
  return result;
}

export type AddFxParams =
  | { vst3: string }
  | { vst2: string }
  | { vst: string }
  | { au: string }
  | { js: string }
  | { dx: string }
  | { clap: string }
  | { fxchain: string }
  | { browser: true | { max: number } | { exactly: number } }
  | string;

export function stringifyAddFxParams(params: AddFxParams): string {
  if (typeof params === "string") {
    return params;
  }

  if ("vst3" in params) {
    return `VST3: ${params.vst3}`;
  } else if ("vst2" in params) {
    return `VST2: ${params.vst2}`;
  } else if ("vst" in params) {
    return `VST: ${params.vst}`;
  } else if ("au" in params) {
    return `AU: ${params.au}`;
  } else if ("js" in params) {
    return `JS: ${params.js}`;
  } else if ("dx" in params) {
    return `DX: ${params.dx}`;
  } else if ("clap" in params) {
    return `CLAP: ${params.clap}`;
  } else if ("fxchain" in params) {
    return `${params.fxchain}.rfxchain`;
  } else if ("browser" in params) {
    const browser = params.browser;
    if (browser === true) {
      return "FXADD:";
    } else if ("max" in browser) {
      return `FXADD:${browser.max}`;
    } else if ("exactly" in browser) {
      return `FXADD:${browser.exactly}e`;
    } else {
      assertUnreachable(browser);
    }
  } else {
    assertUnreachable(params);
  }
}

// container indexing functions from:
// https://forum.cockos.com/showthread.php?p=2714770#post2714770
// does not work with recFX
export function parseTrackContainerFxidx(
  track: MediaTrack,
  fxidx: number,
): number[] {
  const isContainerFxidx = (fxidx & 0x2000000) !== 0;
  if (!isContainerFxidx) return [fxidx];

  const ret = [];
  let n = reaper.TrackFX_GetCount(track);
  let curidx = (fxidx - 0x2000000) % (n + 1);
  let remain = math.floor((fxidx - 0x2000000) / (n + 1));
  if (curidx < 1) {
    error("bad container address");
  }

  let addr = curidx + 0x2000000;
  let addr_sc = n + 1;
  while (true) {
    const [ccok, cc] = reaper.TrackFX_GetNamedConfigParm(
      track,
      addr,
      "container_count",
    );
    if (!ccok) {
      error("bad container address: not a container");
    }
    ret.push(curidx - 1);
    n = parseInt(cc);
    if (remain <= n) {
      if (remain > 0) {
        ret.push(remain - 1);
      }
      return ret;
    }
    curidx = remain % (n + 1);
    remain = math.floor(remain / (n + 1));
    if (curidx < 1) {
      error("bad container address");
    }
    addr = addr + addr_sc * curidx;
    addr_sc = addr_sc * (n + 1);
  }
}
export function generateTrackContainerFxidx(
  track: MediaTrack,
  allidx: number[],
): number {
  if (allidx.length <= 0)
    throw new Error("container index must be at least length 1");
  let sc = reaper.TrackFX_GetCount(track) + 1;
  let rv = 0x2000000 + allidx[0] + 1;
  for (let i = 1; i < allidx.length; i++) {
    const v = allidx[i] + 1;

    const [ccok, cc] = reaper.TrackFX_GetNamedConfigParm(
      track,
      rv,
      "container_count",
    );
    if (!ccok) {
      error("bad container address: container does not exist");
    }
    rv = rv + sc * v;
    sc = sc * (1 + parseInt(cc));
  }
  return rv;
}
export function parseTakeContainerFxidx(
  take: MediaItem_Take,
  fxidx: number,
): number[] {
  const isContainerFxidx = (fxidx & 0x2000000) !== 0;
  if (!isContainerFxidx) return [fxidx];

  const ret = [];
  let n = reaper.TakeFX_GetCount(take);
  let curidx = (fxidx - 0x2000000) % (n + 1);
  let remain = math.floor((fxidx - 0x2000000) / (n + 1));
  if (curidx < 1) {
    error("bad container address");
  }

  let addr = curidx + 0x2000000;
  let addr_sc = n + 1;
  while (true) {
    const [ccok, cc] = reaper.TakeFX_GetNamedConfigParm(
      take,
      addr,
      "container_count",
    );
    if (!ccok) {
      error("bad container address: not a container");
    }
    ret.push(curidx - 1);
    n = parseInt(cc);
    if (remain <= n) {
      if (remain > 0) {
        ret.push(remain - 1);
      }
      return ret;
    }
    curidx = remain % (n + 1);
    remain = math.floor(remain / (n + 1));
    if (curidx < 1) {
      error("bad container address");
    }
    addr = addr + addr_sc * curidx;
    addr_sc = addr_sc * (n + 1);
  }
}
export function generateTakeContainerFxidx(
  take: MediaItem_Take,
  allidx: number[],
): number {
  if (allidx.length <= 0)
    throw new Error("container index must be at least length 1");
  let sc = reaper.TakeFX_GetCount(take) + 1;
  let rv = 0x2000000 + allidx[0] + 1;
  for (let i = 1; i < allidx.length; i++) {
    const v = allidx[i] + 1;

    const [ccok, cc] = reaper.TakeFX_GetNamedConfigParm(
      take,
      rv,
      "container_count",
    );
    if (!ccok) {
      error("bad container address: container does not exist");
    }
    rv = rv + sc * v;
    sc = sc * (1 + parseInt(cc));
  }
  return rv;
}

class ReaperFXChain {
  readonly obj:
    | { type: "track"; track: MediaTrack }
    | { type: "take"; take: MediaItem_Take };

  constructor(params: { track: MediaTrack } | { take: MediaItem_Take }) {
    if ("track" in params) {
      this.obj = { type: "track", track: params.track };
    } else {
      this.obj = { type: "take", take: params.take };
    }
  }

  GetNamedConfigParm(fxidx: number, name: string): string | null {
    switch (this.obj.type) {
      case "track": {
        const [ok, value] = reaper.TrackFX_GetNamedConfigParm(
          this.obj.track,
          fxidx,
          name,
        );
        return ok ? value : null;
      }
      case "take": {
        const [ok, value] = reaper.TakeFX_GetNamedConfigParm(
          this.obj.take,
          fxidx,
          name,
        );
        return ok ? value : null;
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  SetNamedConfigParm(fxidx: number, name: string, value: string): boolean {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_SetNamedConfigParm(
          this.obj.track,
          fxidx,
          name,
          value,
        );
      }
      case "take": {
        return reaper.TakeFX_SetNamedConfigParm(
          this.obj.take,
          fxidx,
          name,
          value,
        );
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetNumParams(fxidx: number): number {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_GetNumParams(this.obj.track, fxidx);
      }
      case "take": {
        return reaper.TakeFX_GetNumParams(this.obj.take, fxidx);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetParamIdent(fxidx: number, param: number): string | null {
    switch (this.obj.type) {
      case "track": {
        const [ok, value] = reaper.TrackFX_GetParamIdent(
          this.obj.track,
          fxidx,
          param,
        );
        return ok ? value : null;
      }
      case "take": {
        const [ok, value] = reaper.TakeFX_GetParamIdent(
          this.obj.take,
          fxidx,
          param,
        );
        return ok ? value : null;
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetParamName(fxidx: number, param: number): string | null {
    switch (this.obj.type) {
      case "track": {
        const [ok, value] = reaper.TrackFX_GetParamName(
          this.obj.track,
          fxidx,
          param,
        );
        return ok ? value : null;
      }
      case "take": {
        const [ok, value] = reaper.TakeFX_GetParamName(
          this.obj.take,
          fxidx,
          param,
        );
        return ok ? value : null;
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetParamEx(fxidx: number, param: number): [number, number, number, number] {
    switch (this.obj.type) {
      case "track": {
        const [rv, min, max, mid] = reaper.TrackFX_GetParamEx(
          this.obj.track,
          fxidx,
          param,
        );
        if (min === null) error("failed to get param value");
        return [rv, min, max, mid] as [number, number, number, number];
      }
      case "take": {
        const [rv, min, max, mid] = reaper.TakeFX_GetParamEx(
          this.obj.take,
          fxidx,
          param,
        );
        if (min === null) error("failed to get param value");
        return [rv, min, max, mid] as [number, number, number, number];
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  SetParam(fxidx: number, param: number, value: number): boolean {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_SetParam(this.obj.track, fxidx, param, value);
      }
      case "take": {
        return reaper.TakeFX_SetParam(this.obj.take, fxidx, param, value);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetFXGUID(fxidx: number): string | null {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_GetFXGUID(this.obj.track, fxidx);
      }
      case "take": {
        return reaper.TakeFX_GetFXGUID(this.obj.take, fxidx);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  GetOffline(fxidx: number): boolean {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_GetOffline(this.obj.track, fxidx);
      }
      case "take": {
        return reaper.TakeFX_GetOffline(this.obj.take, fxidx);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  Delete(fxidx: number): boolean {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_Delete(this.obj.track, fxidx);
      }
      case "take": {
        return reaper.TakeFX_Delete(this.obj.take, fxidx);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  EndParamEdit(fxidx: number, param: number): boolean {
    switch (this.obj.type) {
      case "track": {
        return reaper.TrackFX_EndParamEdit(this.obj.track, fxidx, param);
      }
      case "take": {
        return reaper.TakeFX_EndParamEdit(this.obj.take, fxidx, param);
      }
      default:
        assertUnreachable(this.obj);
    }
  }
}

export class FX {
  readonly fxidx: number;
  readonly obj:
    | { type: "track"; track: MediaTrack }
    | { type: "take"; take: MediaItem_Take };
  readonly chain: ReaperFXChain;

  constructor(
    params: { track: MediaTrack } | { take: MediaItem_Take },
    fxidx: number,
  ) {
    if ("track" in params) {
      this.obj = { type: "track", track: params.track };
      this.chain = new ReaperFXChain({ track: params.track });
    } else {
      this.obj = { type: "take", take: params.take };
      this.chain = new ReaperFXChain({ take: params.take });
    }
    this.fxidx = fxidx;
  }

  guid() {
    const guid = this.chain.GetFXGUID(this.fxidx);
    if (!guid) error("failed to get FX GUID");
    return guid;
  }

  private getParameterUnchecked(param: number): FXParam {
    switch (this.obj.type) {
      case "track": {
        return new FXParam({ track: this.obj.track }, this.fxidx, param);
      }
      case "take": {
        return new FXParam({ take: this.obj.take }, this.fxidx, param);
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  getParameter(param: number): FXParam {
    const totalCount = this.chain.GetNumParams(this.fxidx);
    if (!(0 <= param && param < totalCount))
      throw new Error(`Param index ${param} out of bounds of ${totalCount}`);

    return this.getParameterUnchecked(param);
  }

  getParameters() {
    const totalCount = this.chain.GetNumParams(this.fxidx);
    const result = [];
    for (let i = 0; i < totalCount; i++) {
      result.push(this.getParameterUnchecked(i));
    }
    return result;
  }

  /** Return the plugin name as seen by the user, might be renamed by the user */
  getName(): string {
    switch (this.obj.type) {
      case "track": {
        const [ok, value] = reaper.TrackFX_GetFXName(
          this.obj.track,
          this.fxidx,
        );
        if (!ok) error("failed to get FX name");
        return value;
      }
      case "take": {
        const [ok, value] = reaper.TakeFX_GetFXName(this.obj.take, this.fxidx);
        if (!ok) error("failed to get FX name");
        return value;
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  rename(name: string): void {
    switch (this.obj.type) {
      case "track": {
        reaper.TrackFX_SetNamedConfigParm(
          this.obj.track,
          this.fxidx,
          "renamed_name",
          name,
        );
        break;
      }
      case "take": {
        reaper.TakeFX_SetNamedConfigParm(
          this.obj.take,
          this.fxidx,
          "renamed_name",
          name,
        );
        break;
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  /** Return the "true" plugin name, ignoring the user renamed title */
  getOriginalName() {
    const name = this.chain.GetNamedConfigParm(this.fxidx, "fx_name");
    if (!name) error("failed to get FX name");
    return name;
  }

  getIdent() {
    const ident = this.chain.GetNamedConfigParm(this.fxidx, "fx_ident");
    if (!ident) error("failed to get FX ident");
    return ident;
  }

  getType() {
    const type = this.chain.GetNamedConfigParm(this.fxidx, "fx_type");
    if (!type) error("failed to get FX type");
    return type;
  }

  getPDCLatency() {
    const pdc = this.chain.GetNamedConfigParm(this.fxidx, "pdc");
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

  protected getElement(): Element {
    switch (this.obj.type) {
      case "track": {
        const track = this.obj.track;

        const decipher = this.decipherFxidx();
        // fuck containers
        if (decipher.isInContainer)
          error("unable to get chunk data from FX in containers");

        let fxchainTag: string;
        if (decipher.isRecInputOrHardwareOutput) {
          const masterTrack = reaper.GetMasterTrack(0);
          const isMasterTrack = track === masterTrack;
          if (isMasterTrack) {
            // is hardware output
            // TODO: no idea where to find this
            error("unable to get chunk data from FX in monitor FX");
          } else {
            // is rec input fx
            fxchainTag = "FXCHAIN_REC";
          }
        } else {
          const totalFxCount = reaper.TrackFX_GetCount(track);
          if (decipher.actualIdx >= totalFxCount)
            throw new Error(
              `FX index of ${decipher.actualIdx} exceeds track FX count of ${totalFxCount}`,
            );

          fxchainTag = "FXCHAIN";
        }

        const chunk = Chunk.track(track);
        const element = parse(chunk);
        let fxchainarr: Element | null = null;
        for (const child of element.children) {
          if (!("tag" in child)) continue;

          if (child.tag === fxchainTag) {
            fxchainarr = child;
            break;
          }
        }
        if (fxchainarr === null)
          error(`failed to find <${fxchainTag}> element in track chunk data`);

        const fxchunks = fxchainarr.children.filter((x) => "tag" in x);

        // TODO: There is extra data added to the beginning and end of the chunk data
        // Find a way to remove it
        // https://forum.cockos.com/showthread.php?t=292773

        return fxchunks[decipher.actualIdx];
      }
      case "take": {
        throw new Error("TODO: Implement parsing chunk data of items");
      }
      default:
        assertUnreachable(this.obj);
    }
  }

  /** NOTE: This returns raw byte strings! Please encode with base64 before copying to clipboard */
  private parse(element: Element) {
    // find the base64 array
    if (element.tag.startsWith("VST")) {
      // vst, rest of the array must be strings
      for (const x of element.children) {
        if ("tag" in x)
          throw new Error(
            `fx chunk should not contain sub-elements, but found an element: ${inspect(
              x,
            )}`,
          );
        if (x.length !== 1)
          throw new Error(
            `fx chunk line should only have 1 element: ${inspect(x)}`,
          );
      }
      const b64arr = element.children.map(
        (x) => (x as string[])[0],
      ) as string[];

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

      if (!(fxdataStart + fxdataLength < alldata.length)) {
        throw new Error("fxdata exceeds actual chunk size");
      }
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
    } else if (element.tag.startsWith("CLAP")) {
      // clap, find the subelement <STATE ...>
      const b64arr = (() => {
        for (const x of element.children) {
          if ("tag" in x && x.tag === "STATE") {
            for (const y of x.children) {
              if ("tag" in y)
                throw new Error(
                  `clap state element should not contain sub-elements, but found an element: ${inspect(
                    y,
                  )}`,
                );
              if (y.length !== 1)
                throw new Error(
                  `fx chunk line should only have 1 element: ${inspect(y)}`,
                );
            }
            return x.children.map((x) => (x as string[])[0]) as string[];
          }
        }
        error(`failed to get CLAP plugin state: ${inspect(element)}`);
      })();

      // join the arr and decode it
      const fxdata = Base64.decode(b64arr.join(""));

      return { fxdata };
    } else {
      error(`this kind of fx chunk is not supported: ${inspect(element)}`);
    }
  }

  /** Return the base64-encoded chunk data if the plugin supports chunks. Otherwise, return null; */
  getData(): string | null {
    const type = this.getType().toUpperCase();
    let chunk: string | null = null;
    if (type.includes("VST")) {
      chunk = this.chain.GetNamedConfigParm(this.fxidx, "vst_chunk");
    } else if (type.includes("CLAP")) {
      chunk = this.chain.GetNamedConfigParm(this.fxidx, "clap_chunk");
    } else {
      // plugin type doesn't support chunks
      return null;
    }
    // failsafe testing
    if (chunk !== null) {
      const arrchunk = this.getElement();
      const { fxdata } = this.parse(arrchunk);
      const testchunk = Base64.encode(fxdata);
      if (chunk !== testchunk) {
        msgBox(
          "Debug",
          "Successfully got chunk data the normal way!\nHowever, the alternative FX chunk parser would have given different output, please debug this!",
        );
      }
    }
    // if null, plugin supports chunks, but we can't get it for some reason
    // try getting it manually
    if (chunk === null) {
      const arrchunk = this.getElement();
      const { fxdata } = this.parse(arrchunk);
      chunk = Base64.encode(fxdata);
    }
    return chunk;
  }

  isOffline() {
    return this.chain.GetOffline(this.fxidx);
  }
}

export class FXParam {
  readonly fxidx: number;
  readonly param: number;
  readonly chain: ReaperFXChain;

  constructor(
    target: { track: MediaTrack } | { take: MediaItem_Take },
    fxidx: number,
    param: number,
  ) {
    if ("track" in target) {
      this.chain = new ReaperFXChain({ track: target.track });
    } else {
      this.chain = new ReaperFXChain({ take: target.take });
    }
    this.fxidx = fxidx;
    this.param = param;
  }

  /** A wrapper for the FX's GetNamedConfigParm() to parse it as a number. */
  private _parseParamConfig(name: string, fallback: number) {
    const text = this.chain.GetNamedConfigParm(
      this.fxidx,
      `param.${this.param}.${name}`,
    );
    if (!text) return fallback;

    const result = tonumber(text);
    if (result === undefined)
      error("failed to parse named config parm as number");

    return result;
  }

  /** A wrapper for the FX's SetNamedConfigParm() to allow number / bool arguments. */
  private _setParamConfig(name: string, value: number | boolean) {
    const key = `param.${this.param}.${name}`;
    if (typeof value === "number") {
      this.chain.SetNamedConfigParm(this.fxidx, key, value.toString());
    } else {
      this.chain.SetNamedConfigParm(this.fxidx, key, value ? "1" : "0");
    }
  }

  getIdent() {
    const rv = this.chain.GetParamIdent(this.fxidx, this.param);
    if (!rv) error("param object is no longer valid");
    return rv;
  }

  getName() {
    const rv = this.chain.GetParamName(this.fxidx, this.param);
    if (!rv) error("param object is no longer valid");
    return rv;
  }

  getValue() {
    const [cur, min, max, mid] = this.chain.GetParamEx(this.fxidx, this.param);
    return { cur, min, max, mid };
  }

  setValue(value: number) {
    return this.chain.SetParam(this.fxidx, this.param, value);
  }

  modulationActive(): boolean {
    return this._parseParamConfig(`mod.active`, 0) === 1;
  }

  getModulation(): ModulationInfo | null {
    const modActive = this._parseParamConfig(`mod.active`, 0) === 1;
    if (!modActive) return null;

    const modInfo: ModulationInfo = {
      baseline: this._parseParamConfig(`mod.baseline`, 0),
      acs: null,
      lfo: null,
      plink: null,
    };

    const lfoActive = this._parseParamConfig(`lfo.active`, 0) === 1;
    if (lfoActive) {
      modInfo.lfo = {
        dir: this._parseParamConfig(`lfo.dir`, 1) as -1 | 0 | 1,
        phase: this._parseParamConfig(`lfo.phase`, 0),
        speed: this._parseParamConfig(`lfo.speed`, 1),
        strength: this._parseParamConfig(`lfo.strength`, 1),
        tempoSync: this._parseParamConfig(`lfo.temposync`, 0) === 1,
        free: this._parseParamConfig(`lfo.free`, 0) === 1,
        shape: this._parseParamConfig(`lfo.shape`, 0),
      };
    }

    const acsActive = this._parseParamConfig(`acs.active`, 0) === 1;
    if (acsActive) {
      modInfo.acs = {
        dir: this._parseParamConfig(`acs.dir`, 1) as -1 | 0 | 1,
        strength: this._parseParamConfig(`acs.strength`, 1),
        attack: this._parseParamConfig(`acs.attack`, 300),
        release: this._parseParamConfig(`acs.release`, 300),
        minVol: this._parseParamConfig(`acs.dblo`, -24),
        maxVol: this._parseParamConfig(`acs.dbhi`, 0),
        chan: this._parseParamConfig(`acs.chan`, -1),
        stereo: this._parseParamConfig(`acs.stereo`, 0) === 1,
        x2: this._parseParamConfig(`acs.x2`, 0.5),
        y2: this._parseParamConfig(`acs.y2`, 0.5),
      };
    }

    const plinkActive = this._parseParamConfig(`plink.active`, 0) === 1;
    if (plinkActive) {
      modInfo.plink = {
        scale: this._parseParamConfig(`plink.scale`, 1),
        offset: this._parseParamConfig(`plink.offset`, 0),
        fxidx: this._parseParamConfig(`plink.effect`, -1),
        param: this._parseParamConfig(`plink.param`, -1),
        midi_bus: this._parseParamConfig(`plink.midi_bus`, 0),
        midi_chan: this._parseParamConfig(`plink.midi_chan`, 0),
        midi_msg: this._parseParamConfig(`plink.midi_msg`, 0),
        midi_msg2: this._parseParamConfig(`plink.midi_msg2`, 0),
      };
    }

    return modInfo;
  }

  setModulation(modInfo: ModulationInfo | null) {
    this._setParamConfig(`mod.active`, modInfo !== null);
    if (modInfo === null) return;

    this._setParamConfig(`mod.baseline`, modInfo.baseline);

    this._setParamConfig(`lfo.active`, modInfo.lfo !== null);
    if (modInfo.lfo !== null) {
      this._setParamConfig(`lfo.dir`, modInfo.lfo.dir);
      this._setParamConfig(`lfo.phase`, modInfo.lfo.phase);
      this._setParamConfig(`lfo.speed`, modInfo.lfo.speed);
      this._setParamConfig(`lfo.strength`, modInfo.lfo.strength);
      this._setParamConfig(`lfo.temposync`, modInfo.lfo.tempoSync);
      this._setParamConfig(`lfo.free`, modInfo.lfo.free);
      this._setParamConfig(`lfo.shape`, modInfo.lfo.shape);
    }

    this._setParamConfig(`acs.active`, modInfo.acs !== null);
    if (modInfo.acs !== null) {
      this._setParamConfig(`acs.dir`, modInfo.acs.dir);
      this._setParamConfig(`acs.strength`, modInfo.acs.strength);
      this._setParamConfig(`acs.attack`, modInfo.acs.attack);
      this._setParamConfig(`acs.release`, modInfo.acs.release);
      this._setParamConfig(`acs.dblo`, modInfo.acs.minVol);
      this._setParamConfig(`acs.dbhi`, modInfo.acs.maxVol);
      this._setParamConfig(`acs.chan`, modInfo.acs.chan);
      this._setParamConfig(`acs.stereo`, modInfo.acs.stereo);
      this._setParamConfig(`acs.x2`, modInfo.acs.x2);
      this._setParamConfig(`acs.y2`, modInfo.acs.y2);
    }

    this._setParamConfig(`plink.active`, modInfo.plink !== null);
    if (modInfo.plink) {
      this._setParamConfig(`plink.scale`, modInfo.plink.scale);
      this._setParamConfig(`plink.offset`, modInfo.plink.offset);
      this._setParamConfig(`plink.effect`, modInfo.plink.fxidx);
      this._setParamConfig(`plink.param`, modInfo.plink.param);
      this._setParamConfig(`plink.midi_bus`, modInfo.plink.midi_bus);
      this._setParamConfig(`plink.midi_chan`, modInfo.plink.midi_chan);
      this._setParamConfig(`plink.midi_msg`, modInfo.plink.midi_msg);
      this._setParamConfig(`plink.midi_msg2`, modInfo.plink.midi_msg2);
    }

    return modInfo;
  }
}

export type ModulationInfo = {
  // active: boolean; // let presence of hash indicate active/inactive
  // visible: boolean, // whether the modulation window is shown, i don't care
  /** range from 0.0 to 1.0 */
  baseline: number;
  /** audio control signal */
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
  /** parameter link (to midi or other fx param) */
  plink: {
    offset: number;
    scale: number;

    /**
     * 'effect', will be '-100' if linked to MIDI
     *
     * set when target is FX
     */
    fxidx: number; // 'effect', will be '-100' if linked to MIDI
    /**
     * param idx
     *
     * set when target is FX
     */
    param: number; // param idx

    /** set when target is MIDI */
    midi_bus: number;
    /** set when target is MIDI */
    midi_chan: number;
    /** set when target is MIDI */
    midi_msg: number;
    /** set when target is MIDI */
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
  if (track === null)
    error(
      `failed to get track belonging to last-touched fx: track ${trackidx}`,
    );

  if (itemidx === -1) {
    return new FX({ track }, fxidx);
  } else {
    const item = reaper.GetTrackMediaItem(track, itemidx);
    const take = reaper.GetTake(item, takeidx);
    return new FX({ take }, fxidx);
  }
}
