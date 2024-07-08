import { TrackFX } from "./fx";

export class Track {
  obj: MediaTrack;

  constructor(track: MediaTrack) {
    this.obj = track;
  }

  getFxCount() {
    return reaper.TrackFX_GetCount(this.obj);
  }

  getAllFx() {
    const count = this.getFxCount();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(new TrackFX(this.obj, i));
    }
    return result;
  }
}

export function getSelectedTracks() {
  const tracks = [];
  let i = 0;
  while (true) {
    const t = reaper.GetSelectedTrack2(0, i, true);
    if (t === null) return tracks;

    tracks.push(new Track(t));
    i += 1;
  }
}
