AddCwdToImportPaths();

import { Section } from "reaper-api/extstate";
import * as Path from "reaper-api/path/path";
import { Item, Source, Take, Track } from "reaper-api/track";
import {
  errorHandler,
  readFile,
  runMainAction,
  undoBlock,
} from "reaper-api/utils";
import { splitlines } from "reaper-api/utilsLua";

const config = Section("jw55-m3u8-import");
const PREV_DIR_KEY = "prevfolder";

const ACTION_BUILD_MISSING_PEAKS = 40047;

const NULL = string.char(0);

function projectDir() {
  const path = reaper.GetProjectPath();
  return Path.split(path)[0];
}

function insertItem(track: Track, path: string) {
  const item = new Item(reaper.AddMediaItemToTrack(track.obj));
  const take = new Take(reaper.AddTakeToMediaItem(item.obj));
  const source = reaper.PCM_Source_CreateFromFile(path);
  reaper.SetMediaItemTake_Source(take.obj, source);

  take.name = Path.split(path)[1];

  const length = new Source(source).getLength();
  item.length = length;

  return { item, take };
}

function locatePlaylistFile() {
  // browse to playlist file
  const initialFolder = config.get(PREV_DIR_KEY) || projectDir();

  const [rv, path] = reaper.JS_Dialog_BrowseForOpenFiles(
    "Open playlist file",
    initialFolder,
    "",
    `Playlist files (.m3u8)${NULL}*.m3u8${NULL}${NULL}`,
    false,
  );
  if (rv <= 0) return null;

  const playlistDir = Path.split(path)[0];
  config.set(PREV_DIR_KEY, playlistDir);
  // log([rv, path]);

  return path;
}

function readPlaylistFiles(path: string) {
  const playlistDir = Path.split(path)[0];

  const contents = readFile(path);
  // log(contents);

  const audioPaths = splitlines(contents)
    .map((x) => x.trim())
    .filter((x) => x.length !== 0 && !x.startsWith("#"))
    .map((x) => Path.join(playlistDir, x));

  return audioPaths;
}

function main() {
  const track = Track.getLastTouched();
  if (track === null) return;

  const playlistPath = locatePlaylistFile();
  if (playlistPath === null) return;

  const files = readPlaylistFiles(playlistPath);

  undoBlock("Insert playlist items", 4, () => {
    let insertPos = reaper.GetCursorPosition();
    for (const path of files) {
      const { item, take } = insertItem(track, path);
      item.position = insertPos;
      insertPos += item.length;
    }
  });

  runMainAction(ACTION_BUILD_MISSING_PEAKS);
}

errorHandler(main);
