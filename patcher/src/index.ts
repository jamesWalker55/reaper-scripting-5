import { encode } from "json";
import { OSType } from "reaper-api/ffi";
import {
  FX,
  getLastTouchedFx,
  parseTakeContainerFxidx,
  parseTrackContainerFxidx,
  parseFxidx,
  generateFxidx,
  FXParallel,
} from "reaper-api/fx";
import { Track } from "reaper-api/track";
import { deferAsync, errorHandler, log } from "reaper-api/utils";

/**
 * From the currently-focused FX, return what container we should be working on.
 *
 * If `location` is null, then that indicates root of track/item (i.e. no container)
 */
function getWorkingLocation() {
  const fx = getLastTouchedFx();
  if (fx === null) return null;

  if (fx.isContainer()) {
    return { location: fx, focus: null };
  }

  const parent = fx.parentContainer();
  if (parent === null) {
    return { location: null, focus: fx };
  }

  return { location: parent, focus: fx };
}

const BIT32_ODD = 0b01010101010101010101010101010101;
const BIT32_EVEN = 0b10101010101010101010101010101010;

// // prettier-ignore
// type Arr128<T> = [
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
//   T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
// ];

/**
 * 'src === null' indicates track's audio input (e.g. folder child tracks)
 */
type AudioSource = {
  /**
   * fx index, or null for incoming/outgoing audio
   */
  src: number | null;
  /**
   * channel pin number
   */
  ch: number;
};

type GraphNode = {
  /**
   * `inputs[ pin idx ][ multiple audio sources ]`
   */
  inputs: AudioSource[][];
  /**
   * `outputs[ pin idx ][ multiple audio sources ]`
   */
  outputs: AudioSource[][];
};
type Graph = GraphNode[];

function createGraph(location: FX | Track) {
  let allFx: FX[];
  let chCount: number;
  if ("fxidx" in location) {
    const rv = location.childrenFX();
    if (rv === null)
      throw new Error(`working location is not a container: ${location.fxidx}`);

    allFx = rv;
    chCount = location.getContainerChannelInfo().internal;
  } else {
    allFx = location.getAllFx();
    chCount = location.channelCount;
  }

  /**
   * array to keep track of which channel has audio from which source during iteration
   *
   *     ch[ channel index ][ multiple audio sources ]
   */
  const ch: AudioSource[][] = [];
  for (let i = 0; i < chCount; i++) {
    ch.push([{ src: null, ch: i }]);
  }

  // nodes are in list, index corresponding to fx list
  const graph: Graph = [];
  // node that represents the external audio
  // meanings are slightly complicated if you think too hard about it
  // * inputs: left side of the graph, before the first FX
  // * outputs: right side of the graph, after the last FX
  const extNode: GraphNode = { inputs: [], outputs: [] };
  for (let i = 0; i < chCount; i++) {
    extNode.inputs.push([]);
    extNode.outputs.push([]);
  }

  // for each FX, create node and build graph
  allFx.forEach((fx, i) => {
    // create node for this FX
    const node: GraphNode = { inputs: [], outputs: [] };
    graph.push(node);

    const io = fx.getIOInfo();
    const isParallel = fx.parallel !== FXParallel.None;
    const isInstrument = fx.isInstrument();

    // handle inputs
    for (let pin = 0; pin < io.inputPins; pin++) {
      const receivingSources: AudioSource[] = [];
      node.inputs.push(receivingSources);

      // todo: handle parallel shit
      // may need to make `ch` like `ch[ fx index ][ channel index ][ multiple audio sources ]
      if (isParallel) throw new Error("todo: handle parallel fx");

      const receivingChs = fx.getInputPinMappingsFor(pin);
      for (const receivingCh of receivingChs) {
        receivingSources.push(...ch[receivingCh]);

        // also update `output` of previous FX nodes
        for (const inputSource of ch[receivingCh]) {
          if (inputSource.src === null) {
            extNode.inputs[inputSource.ch].push({ src: i, ch: pin });
          } else {
            graph[inputSource.src].outputs[inputSource.ch].push({
              src: i,
              ch: pin,
            });
          }
        }
      }
    }

    // handle outputs
    for (let pin = 0; pin < io.outputPins; pin++) {
      // construct arrays, won't be populated until we iterate to later FXs
      const outputSources: AudioSource[] = [];
      node.outputs.push(outputSources);

      // update `ch` to track what sources are on what track
      const outputChs = fx.getOutputPinMappingsFor(pin);
      for (const targetCh of outputChs) {
        if (isParallel || isInstrument) {
          // will merge with previous output, append source
          ch[targetCh].push({ src: i, ch: pin });
        } else {
          // will replace previous output
          ch[targetCh] = [{ src: i, ch: pin }];
        }
      }
    }
  });

  // finally, iterate through channel sources and set output of nodes
  ch.forEach((sources, pin) => {
    // for FX, add external outputs
    for (const source of sources) {
      if (source.src === null) {
        extNode.inputs[source.ch].push({ src: null, ch: pin });
      } else {
        graph[source.src].outputs[source.ch].push({ src: null, ch: pin });
      }
    }

    // then, add all `ch` to the extNode output
    extNode.outputs[pin].push(...sources);
  });

  return { graph, ext: extNode };
}

function printGraph(graph: Graph, ext: GraphNode) {
  function srcToName(src: number | null) {
    if (typeof src === "number") {
      return `fx${src}`;
    } else {
      return `EXT`;
    }
  }

  function printNode(
    src: number | null,
    node: GraphNode,
    opt?: { reverseArrows?: boolean },
  ) {
    const name = srcToName(src);
    const inputs = node.inputs
      .map((sources, i) => {
        if (sources.length === 0) return null;

        const sourceNames = sources.map(
          (source) => `${srcToName(source.src)}>${source.ch}`,
        );
        if (opt?.reverseArrows === true) {
          return `  i${i} -> ${sourceNames.join(", ")}`;
        } else {
          return `  i${i} <- ${sourceNames.join(" + ")}`;
        }
      })
      .filter((x) => x !== null);
    const outputs = node.outputs
      .map((sources, i) => {
        if (sources.length === 0) return null;

        const sourceNames = sources.map(
          (source) => `${srcToName(source.src)}>${source.ch}`,
        );
        if (opt?.reverseArrows === true) {
          return `  o${i} <- ${sourceNames.join(" + ")}`;
        } else {
          return `  o${i} -> ${sourceNames.join(", ")}`;
        }
      })
      .filter((x) => x !== null);
    log(name);
    if (inputs.length > 0) log(inputs.join("\n"));
    if (outputs.length > 0) log(outputs.join("\n"));
  }

  graph.forEach((node, i) => {
    printNode(i, node);
  });
  printNode(null, ext, { reverseArrows: true });
}

function graphToMermaid(graph: Graph, ext: GraphNode) {
  function srcToName(src: number | null, isDest: boolean) {
    if (typeof src === "number") {
      return `fx${src}`;
    } else {
      if (isDest) {
        return `EXT_OUT`;
      } else {
        return `EXT_IN`;
      }
    }
  }

  // we only consider rightwards arrows

  // for normal nodes, inputs point rightwards

  log(`flowchart LR`);
  graph.forEach((node, src) => {
    const inputs = node.inputs.flatMap((sources, i) =>
      sources.map((source) => {
        const name = srcToName(src, true);
        const sourceName = srcToName(source.src, false);
        return `${sourceName} -->|ch${source.ch} -> ${i}| ${name}`;
      }),
    );

    for (const line of inputs) {
      log(line);
    }
  });

  // for ext node, outputs point rightwards

  const inputs = ext.outputs.flatMap((sources, i) =>
    sources.map((source) => {
      const name = srcToName(null, true);
      const sourceName = srcToName(source.src, false);
      return `${sourceName} -->|ch${source.ch} -> ${i}| ${name}`;
    }),
  );

  for (const line of inputs) {
    log(line);
  }
}

function checkGraphCorrectBidirectional(graph: Graph, ext: GraphNode) {
  function generateLinkId(from: AudioSource, to: AudioSource) {
    const fromName = from.src === null ? "extin" : `fxout${from.src}`;
    const toName = to.src === null ? "extout" : `fxin${to.src}`;
    return `${fromName}ch${from.ch}->${toName}${to.ch}`;
  }

  const from = new LuaSet();
  const to = new LuaSet();

  for (let src = 0; src < graph.length; src++) {
    const node = graph[src];
    // inputs -> this node
    for (let ch = 0; ch < node.inputs.length; ch++) {
      for (const input of node.inputs[ch]) {
        from.add(generateLinkId(input, { src, ch }));
      }
    }
    // this node -> outputs
    for (let ch = 0; ch < node.outputs.length; ch++) {
      for (const output of node.outputs[ch]) {
        to.add(generateLinkId({ src, ch }, output));
      }
    }
  }

  // ext node
  {
    // outputs -> ext
    for (let ch = 0; ch < ext.outputs.length; ch++) {
      for (const output of ext.outputs[ch]) {
        from.add(generateLinkId(output, { src: null, ch }));
      }
    }
    // ext -> inputs
    for (let ch = 0; ch < ext.inputs.length; ch++) {
      for (const input of ext.inputs[ch]) {
        to.add(generateLinkId({ src: null, ch }, input));
      }
    }
  }

  for (const x of from) {
    if (!to.has(x)) {
      log({ from, to });
      throw new Error("something wrong with graph generation!");
    }
  }
}

async function main() {
  while (true) {
    await deferAsync();
    log("==============================");

    const loc = getWorkingLocation()?.location || Track.getLastTouched();
    if (loc === null) {
      log("no location");
      continue;
    }
    const asd = createGraph(loc);
    // printGraph(asd.graph, asd.ext);
    // graphToMermaid(asd.graph, asd.ext);
    // log(checkGraphCorrectBidirectional(asd.graph, asd.ext));
  }
}

errorHandler(main);
