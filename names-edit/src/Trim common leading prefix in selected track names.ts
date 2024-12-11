AddCwdToImportPaths();

import { Track } from "reaper-api/track";
import { errorHandler } from "reaper-api/utils";
import { strip } from "reaper-api/utilsLua";

function commonPrefixLength(names: string[]): number {
  // sort names, then check first and last name for prefix length comparison
  names = [...names];
  names.sort();

  const firstName = names[0];
  const lastName = names[names.length - 1];

  const maxPrefixLength = math.min(firstName.length, lastName.length);

  for (let i = 0; i < maxPrefixLength; i++) {
    const a = firstName[i];
    const b = lastName[i];
    if (a !== b) return i;
  }
  return maxPrefixLength;
}

function main() {
  const selectedTracks = Track.getSelected();
  if (0 <= selectedTracks.length && selectedTracks.length <= 1) return;

  const trackNames = selectedTracks.map((x) => strip(x.name));

  // find common prefix among non-empty track names
  const prefixLength = commonPrefixLength(
    trackNames.filter((x) => x.length > 0),
  );

  // for each track, remove the prefix
  for (let i = 0; i < selectedTracks.length; i++) {
    const track = selectedTracks[i];
    const name = trackNames[i];

    const newName = name.slice(prefixLength, name.length);

    track.name = newName;
  }
}

errorHandler(main);
