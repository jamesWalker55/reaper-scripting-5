export class Item {
  obj: MediaItem;

  constructor(obj: MediaItem) {
    this.obj = obj;
  }

  *iterTakes() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    for (let i = 0; i < count; i++) {
      const take = reaper.GetMediaItemTake(this.obj, i);
      yield new Take(take);
    }
  }

  isEmpty() {
    const count = reaper.GetMediaItemNumTakes(this.obj);
    return count === 0;
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

  source() {
    return new Source(reaper.GetMediaItemTake_Source(this.obj));
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
