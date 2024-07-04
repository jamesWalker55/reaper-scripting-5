abstract class BaseFX {
  abstract readonly type: "track" | "take";
  abstract GetNamedConfigParm(name: string): string | null;
  abstract SetNamedConfigParm(name: string, value: string): boolean;
  abstract GetNumParams(): number;
  abstract GetParamIdent(param: number): string | null;
  abstract GetParamName(param: number): string | null;
  abstract GetFXGUID(): string | null;

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

  GetNamedConfigParmAsNumber(name: string, fallback: number) {
    const text = this.GetNamedConfigParm(name);
    if (!text) return fallback;

    const result = tonumber(text);
    if (result === undefined)
      error("failed to parse named config parm as number");

    return result;
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

  GetNumParams() {
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

  GetFXGUID() {
    return reaper.TrackFX_GetFXGUID(this.track, this.fxidx);
  }

  getParameter(param: number): FXParam {
    return new FXParam({ track: this.track }, this.fxidx, param);
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

  GetNumParams() {
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

  GetFXGUID() {
    return reaper.TakeFX_GetFXGUID(this.take, this.fxidx);
  }

  getParameter(param: number): FXParam {
    return new FXParam({ take: this.take }, this.fxidx, param);
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

  getIdentifier() {
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
    return (
      this.fx.GetNamedConfigParmAsNumber(
        `param.${this.param}.mod.active`,
        0,
      ) === 1
    );
  }

  getModulationInfo(): ModulationInfo | null {
    const param = this.param;

    const modActive =
      this.fx.GetNamedConfigParmAsNumber(`param.${param}.mod.active`, 0) === 1;
    if (!modActive) return null;

    const modInfo: ModulationInfo = {
      baseline: this.fx.GetNamedConfigParmAsNumber(
        `param.${param}.mod.baseline`,
        0,
      ),
      acs: null,
      lfo: null,
      plink: null,
    };

    const lfoActive =
      this.fx.GetNamedConfigParmAsNumber(`param.${param}.lfo.active`, 0) === 1;
    if (lfoActive) {
      modInfo.lfo = {
        dir: this.fx.GetNamedConfigParmAsNumber(`param.${param}.lfo.dir`, 1) as
          | -1
          | 0
          | 1,
        phase: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.lfo.phase`,
          0,
        ),
        speed: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.lfo.speed`,
          1,
        ),
        strength: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.lfo.strength`,
          1,
        ),
        tempoSync:
          this.fx.GetNamedConfigParmAsNumber(
            `param.${param}.lfo.temposync`,
            0,
          ) === 1,
        free:
          this.fx.GetNamedConfigParmAsNumber(`param.${param}.lfo.free`, 0) ===
          1,
        shape: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.lfo.shape`,
          0,
        ),
      };
    }

    const acsActive =
      this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.active`, 0) === 1;
    if (acsActive) {
      modInfo.acs = {
        dir: this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.dir`, 1) as
          | -1
          | 0
          | 1,
        strength: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.acs.strength`,
          1,
        ),
        attack: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.acs.attack`,
          300,
        ),
        release: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.acs.release`,
          300,
        ),
        minVol: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.acs.dblo`,
          -24,
        ),
        maxVol: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.acs.dbhi`,
          0,
        ),
        chan: this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.chan`, -1),
        stereo:
          this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.stereo`, 0) ===
          1,
        x2: this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.x2`, 0.5),
        y2: this.fx.GetNamedConfigParmAsNumber(`param.${param}.acs.y2`, 0.5),
      };
    }

    const plinkActive =
      this.fx.GetNamedConfigParmAsNumber(`param.${param}.plink.active`, 0) ===
      1;
    if (plinkActive) {
      modInfo.plink = {
        scale: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.scale`,
          1,
        ),
        offset: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.offset`,
          0,
        ),
        fxidx: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.effect`,
          -1,
        ),
        param: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.param`,
          -1,
        ),
        midi_bus: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_bus`,
          0,
        ),
        midi_chan: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_chan`,
          0,
        ),
        midi_msg: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_msg`,
          0,
        ),
        midi_msg2: this.fx.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_msg2`,
          0,
        ),
      };
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
