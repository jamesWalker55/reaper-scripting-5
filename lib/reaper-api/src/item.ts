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

export class Source {
  obj: PCM_source;

  constructor(obj: PCM_source) {
    this.obj = obj;
  }

  type() {
    return reaper.GetMediaSourceType(this.obj);
  }
}
