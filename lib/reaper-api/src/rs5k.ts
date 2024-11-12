import { FX } from "./fx";

export enum RS5KMode {
  FreelyConfigurableShifted = "0",
  // ignores MIDI note
  Sample = "1",
  // semitone shifted
  NoteSemitoneShifted = "2",
}

enum Param {
  Volume = 0,
  Pan = 1,
  MinVolume = 2,
  NoteRangeStart = 3,
  NoteRangeEnd = 4,
  PitchForStartNote = 5,
  PitchForEndNote = 6,
  MIDIChannel = 7,
  MaxVoices = 8,
  Attack = 9,
  Release = 10,
  ObeyNoteOffs = 11,
  Loop = 12,
  SampleStartOffset = 13,
  SampleEndOffset = 14,
  PitchAdjust = 15,
  PitchbendRange = 16,
  MinimumVelocity = 17,
  MaximumVelocity = 18,
  ProbabilityOfHitting = 19,
  RoundRobinMode = 20,
  FilterPlayedNotes = 21,
  CrossfadeLoopLength = 22,
  LoopStartOffset = 23,
  Decay = 24,
  Sustain = 25,
  ReleaseNoteOff = 26,
  UseNoteOffReleaseOverride = 27,
  LegacyVoiceReUseMode = 28,
  Portamento = 29,
  Bypass = 30,
  Wet = 31,
  Delta = 32,
}

export class RS5K {
  fx: FX;
  constructor(fx: FX) {
    this.fx = fx;
  }

  /** Check if this is really a ReaSamplomatic5000 instance or not */
  isValid(): boolean {
    let ident: string;
    try {
      ident = this.fx.getIdent();
    } catch (error) {
      // invalid FX index
      return false;
    }

    // only works on windows for now
    const os = reaper.GetOS();
    if (!os.startsWith("Win")) {
      throw new Error(
        `RS5K validity check not implemented for this OS: ${os} (fxident: ${ident})`,
      );
    }

    return ident.includes("reasamplomatic.dll");
  }

  /**
   * Return the list of files loaded in this sampler.
   * If a sample slot is empty (no sample loaded), it will give an empty string
   */
  getFiles() {
    let i = 0;
    const files: (string | null)[] = [];
    while (true) {
      const filename = this.fx.chain.GetNamedConfigParm(
        this.fx.fxidx,
        `FILE${i}`,
      );
      if (filename === null) return files;

      if (filename.length === 0) {
        // explicitly handle empty strings here
        // this indicates an empty slot
        files.push("");
      } else {
        files.push(filename);
      }

      i += 1;
    }
  }

  get mode() {
    const mode = this.fx.chain.GetNamedConfigParm(this.fx.fxidx, "MODE");
    if (mode === null) throw new Error("Failed to get RS5K mode");
    return mode as RS5KMode;
  }
  set mode(x: RS5KMode) {
    const rv = this.fx.chain.SetNamedConfigParm(this.fx.fxidx, "MODE", x);
    if (!rv) throw new Error(`Failed to set RS5K mode`);
  }

  /**
   * Returns an integer (but formatted as string). "-1" indicates "(project default)".
   */
  get resampleMode() {
    const mode = this.fx.chain.GetNamedConfigParm(this.fx.fxidx, "RSMODE");
    if (mode === null) throw new Error("Failed to get RS5K resample mode");
    return mode;
  }
  set resampleMode(x: string) {
    const rv = this.fx.chain.SetNamedConfigParm(this.fx.fxidx, "RSMODE", x);
    if (!rv) throw new Error(`Failed to set RS5K resample mode`);
  }

  /**
   * Volume ranges from 0.0 to 3.98...:
   * * 0.0 => -inf dB
   * * 1.0 => 0.0 dB
   * * 1.992... => +6.0 dB
   */
  get volume() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Volume)[0];
  }
  set volume(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Volume, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Volume]}`);
  }

  /** Pan ranges from 0.0 to 1.0. */
  get pan() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Pan)[0];
  }
  set pan(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Pan, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Pan]}`);
  }

  /**
   * Also called "Gain for minimum velocity". Ranges from 0.0 to 3.98...:
   * * 0.0 => -inf dB
   * * 1.0 => 0.0 dB
   * * 1.992... => +6.0 dB
   */
  get minVolume() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.MinVolume)[0];
  }
  set minVolume(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.MinVolume, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.MinVolume]}`);
  }

  /** Ranges from 0 to 127, i.e. C-1 to G9. */
  get noteRangeStart() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.NoteRangeStart)[0] * 127,
    );
  }
  set noteRangeStart(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.NoteRangeStart,
      x / 127,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.NoteRangeStart]}`);
  }

  /** Ranges from 0 to 127, i.e. C-1 to G9. */
  get noteRangeEnd() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.NoteRangeEnd)[0] * 127,
    );
  }
  set noteRangeEnd(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.NoteRangeEnd,
      x / 127,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.NoteRangeEnd]}`);
  }

  /** Pitch amount (in semitones) at note range start. Ranges from -80 to 80. */
  get pitchStart() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.PitchForStartNote)[0] *
        160 -
        80,
    );
  }
  set pitchStart(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.PitchForStartNote,
      (x + 80) / 160,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.PitchForStartNote]}`);
  }

  /** Pitch amount (in semitones) at note range end. Ranges from -80 to 80. */
  get pitchEnd() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.PitchForEndNote)[0] * 160 -
        80,
    );
  }
  set pitchEnd(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.PitchForEndNote,
      (x + 80) / 160,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.PitchForEndNote]}`);
  }

  /** Ranges from 0 to 16. Use 0 for all MIDI channels. */
  get midiChannel() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.MIDIChannel)[0] * 16,
    );
  }
  set midiChannel(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.MIDIChannel, x / 16);
    if (!rv) throw new Error(`Failed to set ${Param[Param.MIDIChannel]}`);
  }

  /** Ranges from 1 to 64. */
  get maxVoices() {
    return Math.round(
      (this.fx.chain.GetParamEx(this.fx.fxidx, Param.MaxVoices)[0] / 4) * 63 +
        1,
    );
  }
  set maxVoices(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.MaxVoices,
      ((x - 1) / 63) * 4,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.MaxVoices]}`);
  }

  /** Attack in ms. Ranges from 0.0 ms to 2000.0 ms. */
  get attack() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.Attack)[0] * 2000,
    );
  }
  set attack(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Attack, x / 2000);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Attack]}`);
  }

  /** Release in ms. Ranges from 0.0 ms to 2000.0 ms. */
  get release() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.Release)[0] * 2000,
    );
  }
  set release(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Release, x / 2000);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Release]}`);
  }

  get obeyNoteOffs() {
    return (
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.ObeyNoteOffs)[0] >= 0.5
    );
  }
  set obeyNoteOffs(x: boolean) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.ObeyNoteOffs,
      x ? 1 : 0,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.ObeyNoteOffs]}`);
  }

  /** This requies obeyNoteOffs to be enabled */
  get loop() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Loop)[0] >= 0.5;
  }
  set loop(x: boolean) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Loop, x ? 1 : 0);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Loop]}`);
  }

  /** The sample start position. This is a ratio from 0.0 to 1.0 (from sample start to end). */
  get sampleStartOffset() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.SampleStartOffset)[0];
  }
  set sampleStartOffset(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.SampleStartOffset,
      x,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.SampleStartOffset]}`);
  }

  /** The sample end position. This is a ratio from 0.0 to 1.0 (from sample start to end). */
  get sampleEndOffset() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.SampleEndOffset)[0];
  }
  set sampleEndOffset(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.SampleEndOffset, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.SampleEndOffset]}`);
  }

  /** Pitch offset (in semitones). Ranges from -80.0 to 80.0. */
  get pitchOffset() {
    return (
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.PitchAdjust)[0] * 160 - 80
    );
  }
  set pitchOffset(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.PitchAdjust,
      (x + 80) / 160,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.PitchAdjust]}`);
  }

  /** Ranges from 0.0 to 12.0. */
  get pitchbendRange() {
    return (
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.PitchbendRange)[0] * 12
    );
  }
  set pitchbendRange(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.PitchbendRange,
      x / 12,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.PitchbendRange]}`);
  }

  /** Ranges from 0 to 127. */
  get minVelocity() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.MinimumVelocity)[0] * 127,
    );
  }
  set minVelocity(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.MinimumVelocity,
      x / 127,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.MinimumVelocity]}`);
  }

  /** Ranges from 0 to 127. */
  get maxVelocity() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.MaximumVelocity)[0] * 127,
    );
  }
  set maxVelocity(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.MaximumVelocity,
      x / 127,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.MaximumVelocity]}`);
  }

  /** Ranges from 0 to 100. */
  get probability() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.ProbabilityOfHitting)[0] *
        100,
    );
  }
  set probability(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.ProbabilityOfHitting,
      x / 100,
    );
    if (!rv)
      throw new Error(`Failed to set ${Param[Param.ProbabilityOfHitting]}`);
  }

  get roundRobin() {
    return (
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.RoundRobinMode)[0] >= 0.5
    );
  }
  set roundRobin(x: boolean) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.RoundRobinMode,
      x ? 1 : 0,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.RoundRobinMode]}`);
  }

  get removePlayedMIDINotes() {
    return (
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.FilterPlayedNotes)[0] >= 0.5
    );
  }
  set removePlayedMIDINotes(x: boolean) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.FilterPlayedNotes,
      x ? 1 : 0,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.FilterPlayedNotes]}`);
  }

  /** Crossfade overlap section length in ms. Ranges from 0.0 ms to 1000.0 ms. */
  get loopCrossfadeDuration() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.CrossfadeLoopLength)[0] *
        1000,
    );
  }
  set loopCrossfadeDuration(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.CrossfadeLoopLength,
      x / 1000,
    );
    if (!rv)
      throw new Error(`Failed to set ${Param[Param.CrossfadeLoopLength]}`);
  }

  /** Loop start position, offset from the sample start position. Ranges from 0.0 ms to 30000.0 ms. */
  get loopStartOffset() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.LoopStartOffset)[0] * 30000,
    );
  }
  set loopStartOffset(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.LoopStartOffset,
      x / 30000,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.LoopStartOffset]}`);
  }

  /** Ranges from 10.0 ms to 15000.0 ms. */
  get decay() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.Decay)[0] * 14990 + 10,
    );
  }
  set decay(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.Decay,
      (x - 10) / 14990,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.Decay]}`);
  }

  /**
   * Sustain ranges from 0.0 to 3.98...:
   * * 0.0 => -inf dB
   * * 1.0 => 0.0 dB
   * * 1.992... => +6.0 dB
   */
  get sustain() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Sustain)[0];
  }
  set sustain(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Sustain, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Sustain]}`);
  }

  /** Release (for note-off) ranges from 0.0 ms to 4000.0 ms. */
  get noteOffRelease() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.ReleaseNoteOff)[0] * 4000,
    );
  }
  set noteOffRelease(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.ReleaseNoteOff,
      x / 4000,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.ReleaseNoteOff]}`);
  }

  /** Also known as "Note-off release override" */
  get noteOffReleaseEnabled() {
    return (
      this.fx.chain.GetParamEx(
        this.fx.fxidx,
        Param.UseNoteOffReleaseOverride,
      )[0] >= 0.5
    );
  }
  set noteOffReleaseEnabled(x: boolean) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.UseNoteOffReleaseOverride,
      x ? 1 : 0,
    );
    if (!rv)
      throw new Error(
        `Failed to set ${Param[Param.UseNoteOffReleaseOverride]}`,
      );
  }

  /** Crossfade overlap section length in ms. Ranges from 0.0 ms to 1000.0 ms. */
  get portamento() {
    return Math.round(
      this.fx.chain.GetParamEx(this.fx.fxidx, Param.Portamento)[0] * 1000,
    );
  }
  set portamento(x: number) {
    const rv = this.fx.chain.SetParam(
      this.fx.fxidx,
      Param.Portamento,
      x / 1000,
    );
    if (!rv) throw new Error(`Failed to set ${Param[Param.Portamento]}`);
  }

  /** Generic FX bypass toggle */
  get bypass() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Bypass)[0] >= 0.5;
  }
  set bypass(x: boolean) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Bypass, x ? 1 : 0);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Bypass]}`);
  }

  /** Generic FX mix knob, ranges from 0.0 to 1.0 */
  get wet() {
    return Math.round(this.fx.chain.GetParamEx(this.fx.fxidx, Param.Wet)[0]);
  }
  set wet(x: number) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Wet, x);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Wet]}`);
  }

  /** Generic FX delta toggle */
  get delta() {
    return this.fx.chain.GetParamEx(this.fx.fxidx, Param.Delta)[0] >= 0.5;
  }
  set delta(x: boolean) {
    const rv = this.fx.chain.SetParam(this.fx.fxidx, Param.Delta, x ? 1 : 0);
    if (!rv) throw new Error(`Failed to set ${Param[Param.Delta]}`);
  }
}
