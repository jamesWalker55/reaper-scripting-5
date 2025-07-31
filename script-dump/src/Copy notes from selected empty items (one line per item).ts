AddCwdToImportPaths();

import { encode } from "json";
import { copy } from "reaper-api/clipboard";
import { Item } from "reaper-api/track";
import { confirmOrCancelBox, errorHandler } from "reaper-api/utils";

function main() {
  const items = Item.getSelected();
  if (items.length === 0) return;

  const itemNotes = items
    // only copy from empty items
    .filter((x) => x.activeTake() === null)
    // get useful info
    .map((x) => {
      const track = x.getTrack().getIdx();
      const pos = x.position;
      const [ok, notes] = reaper.GetSetMediaItemInfo_String(
        x.obj,
        "P_NOTES",
        "",
        false,
      );
      if (!ok)
        throw new Error(
          `failed to get P_NOTES of item in track ${track + 1} at ${pos}s`,
        );

      return { track, pos, notes };
    })
    // sort by track and position
    .sort((a, b) => {
      const trackCmp = a.track - b.track;
      if (trackCmp !== 0) return trackCmp;

      return a.pos - b.pos;
    });

  // handle multiline notes -> singleline
  {
    const multilineNote = itemNotes.find((x) => x.notes.includes("\n"));
    if (multilineNote !== undefined) {
      const choice = confirmOrCancelBox(
        "Multiline Notes Detected",
        `Some items contain multiline notes: ${encode(
          multilineNote.notes,
        )}\nWould you like to replace line breaks with the text '\n' instead?\n(Otherwise, only copy the first line)`,
      );
      switch (choice) {
        case true:
          itemNotes.forEach((x) => {
            x.notes = x.notes.replaceAll("\n", "\\n");
          });
          break;
        case false:
          itemNotes.forEach((x) => {
            x.notes = x.notes.split("\n")[0];
          });
          break;
        case null:
          return;
        default:
          choice satisfies never;
      }
    }
  }

  // concat and copy
  const text = itemNotes.map((x) => x.notes).join("\n");
  copy(text);
}

errorHandler(main);
