AddCwdToImportPaths();

import { encode } from "json";
import { copy, paste } from "reaper-api/clipboard";
import { inspect } from "reaper-api/inspect";
import { loadInstalledFX } from "reaper-api/installedFx";
import { Item } from "reaper-api/track";
import { errorHandler, getScriptPath, log, undoBlock } from "reaper-api/utils";
import { splitlines } from "reaper-api/utilsLua";

function main() {
  enum ChannelType {
    Mono,
    Stereo,
    Quad,
    C50,
    C51,
    C71,
    Unknown,
  }
  function parseChannelType(x: string): ChannelType {
    switch (x) {
      case "Mono":
        return ChannelType.Mono;
      case "Stereo":
        return ChannelType.Stereo;
      case "Quad":
        return ChannelType.Quad;
      case "5.0":
        return ChannelType.C50;
      case "5.1":
        return ChannelType.C51;
      case "7.1":
        return ChannelType.C71;
      default:
        log(`Unknown channel type: ${x}`);
        return ChannelType.Unknown;
    }
  }

  function lastIndexOf(base: string, x: string): number {
    for (let i = base.length - 1; i >= 0; i--) {
      if (base[i] === x) return i;
    }
    throw new Error(`lastIndexOf failed base = "${base}" x = "${x}"`);
  }

  function assert2tuple(x: string[]): [string, string] {
    if (x.length === 2) {
      return x as [string, string];
    } else {
      throw new Error("not an array of 2 strings");
    }
  }
  function parseWavesName(name: string): {
    name: string;
    channel: ChannelType | [ChannelType, ChannelType];
  } {
    let [pluginType, rest] = assert2tuple(name.split(":", 2));

    let channelMapping;
    [rest, channelMapping] = rest.split("(Waves)", 2);

    rest = rest.trim();

    let channelType: ChannelType | [ChannelType, ChannelType];
    {
      const spaceIdx = lastIndexOf(rest, " ");

      const channelTypeStr = rest.slice(spaceIdx + 1);
      rest = rest.slice(0, spaceIdx);
      const result = channelTypeStr
        .split("/", 2)
        .map((x) => parseChannelType(x)) as
        | [ChannelType]
        | [ChannelType, ChannelType];

      if (result.length === 2) {
        channelType = result;
      } else {
        channelType = result[0];
      }
    }

    rest = rest.trim();

    return {
      name: rest,
      channel: channelType,
    };
  }

  const wavesFx = loadInstalledFX()
    .map((x) => x.displayName)
    .filter((x) => x.includes("(Waves)"))
    .map((x) => parseWavesName(x));

  const wavesFxMap: Record<
    string,
    (ChannelType | [ChannelType, ChannelType])[]
  > = {};
  for (const fx of wavesFx) {
    wavesFxMap[fx.name] ||= [];
    wavesFxMap[fx.name].push(fx.channel);
  }

  function stringifyCT(ct: ChannelType | [ChannelType, ChannelType]) {
    if (Array.isArray(ct)) {
      return `Map`;
    } else {
      return ChannelType[ct];
    }
  }

  const result: string[] = [];
  for (const [name, channels] of Object.entries(wavesFxMap)) {
    // if (channels.includes(ChannelType.Stereo)) continue;

    result.push(`${name} | ${channels.map((x) => stringifyCT(x)).join(" ")}`);
  }

  copy(result.join("\n"));
}

errorHandler(main);
