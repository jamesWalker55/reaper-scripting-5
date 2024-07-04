abstract class BaseFX {
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

  getParameters() {
    const totalCount = this.GetNumParams();
    const result = [];
    for (let i = 0; i < totalCount; i++) {
      const ident = this.GetParamIdent(i);
      const name = this.GetParamName(i);
      if (!ident) error("failed to get parameters");
      if (!name) error("failed to get parameters");
      result.push({ ident, name });
    }
    return result;
  }

  private GetNamedConfigParmAsNumber(name: string, fallback: number) {
    const text = this.GetNamedConfigParm(name);
    if (!text) return fallback;

    const result = tonumber(text);
    if (result === undefined)
      error("failed to parse named config parm as number");

    return result;
  }

  getModInfo(param: number): ModInfo | null {
    const modActive =
      this.GetNamedConfigParmAsNumber(`param.${param}.mod.active`, 0) === 1;
    if (!modActive) return null;

    const modInfo: ModInfo = {
      baseline: this.GetNamedConfigParmAsNumber(
        `param.${param}.mod.baseline`,
        0,
      ),
      acs: null,
      lfo: null,
      plink: null,
    };

    const lfoActive =
      this.GetNamedConfigParmAsNumber(`param.${param}.lfo.active`, 0) === 1;
    if (lfoActive) {
      modInfo.lfo = {
        dir: this.GetNamedConfigParmAsNumber(`param.${param}.lfo.dir`, 1) as
          | -1
          | 0
          | 1,
        phase: this.GetNamedConfigParmAsNumber(`param.${param}.lfo.phase`, 0),
        speed: this.GetNamedConfigParmAsNumber(`param.${param}.lfo.speed`, 1),
        strength: this.GetNamedConfigParmAsNumber(
          `param.${param}.lfo.strength`,
          1,
        ),
        tempoSync:
          this.GetNamedConfigParmAsNumber(`param.${param}.lfo.temposync`, 0) ===
          1,
        free:
          this.GetNamedConfigParmAsNumber(`param.${param}.lfo.free`, 0) === 1,
        shape: this.GetNamedConfigParmAsNumber(`param.${param}.lfo.shape`, 0),
      };
    }

    const acsActive =
      this.GetNamedConfigParmAsNumber(`param.${param}.acs.active`, 0) === 1;
    if (acsActive) {
      modInfo.acs = {
        dir: this.GetNamedConfigParmAsNumber(`param.${param}.acs.dir`, 1) as
          | -1
          | 0
          | 1,
        strength: this.GetNamedConfigParmAsNumber(
          `param.${param}.acs.strength`,
          1,
        ),
        attack: this.GetNamedConfigParmAsNumber(
          `param.${param}.acs.attack`,
          300,
        ),
        release: this.GetNamedConfigParmAsNumber(
          `param.${param}.acs.release`,
          300,
        ),
        minVol: this.GetNamedConfigParmAsNumber(`param.${param}.acs.dblo`, -24),
        maxVol: this.GetNamedConfigParmAsNumber(`param.${param}.acs.dbhi`, 0),
        chan: this.GetNamedConfigParmAsNumber(`param.${param}.acs.chan`, -1),
        stereo:
          this.GetNamedConfigParmAsNumber(`param.${param}.acs.stereo`, 0) === 1,
        x2: this.GetNamedConfigParmAsNumber(`param.${param}.acs.x2`, 0.5),
        y2: this.GetNamedConfigParmAsNumber(`param.${param}.acs.y2`, 0.5),
      };
    }

    const plinkActive =
      this.GetNamedConfigParmAsNumber(`param.${param}.plink.active`, 0) === 1;
    if (plinkActive) {
      modInfo.plink = {
        scale: this.GetNamedConfigParmAsNumber(`param.${param}.plink.scale`, 1),
        offset: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.offset`,
          0,
        ),
        fxidx: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.effect`,
          -1,
        ),
        param: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.param`,
          -1,
        ),
        midi_bus: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_bus`,
          0,
        ),
        midi_chan: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_chan`,
          0,
        ),
        midi_msg: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_msg`,
          0,
        ),
        midi_msg2: this.GetNamedConfigParmAsNumber(
          `param.${param}.plink.midi_msg2`,
          0,
        ),
      };
    }

    return modInfo;
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
}

export type ModInfo = {
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

export type FX = TrackFX | TakeFX;
