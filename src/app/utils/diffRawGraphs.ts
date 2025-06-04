import { cloneDeep, find, isEqual, unionBy } from "lodash";
import { DiffType, RawGraph, RawGraphEdge, RawGraphNode } from "./types";

/**
 * Takes two raw graphs and merges them into a new one with diff notation.
 */
export const diffRawGraphs = (
  originalRawGraph: RawGraph,
  newRawGraph: RawGraph
): RawGraph => {
  const diffedGraph = {
    nodes: diffRawGraphEntities(originalRawGraph.nodes, newRawGraph.nodes),
    edges: diffRawGraphEntities(originalRawGraph.edges, newRawGraph.edges),
  };

  return diffedGraph;
};

const diffRawGraphEntities = <T extends RawGraphNode | RawGraphEdge>(
  originalRawGraphEntities: T[],
  newRawGraphEntities: T[]
): T[] => {
  const diffedRawGraphEntities = unionBy(
    cloneDeep(newRawGraphEntities),
    cloneDeep(originalRawGraphEntities),
    "id"
  ).map(({ ...entity }) => {
    let diffType: DiffType | undefined;
    const originalEntity = find(originalRawGraphEntities, { id: entity.id });
    const newEntity = find(newRawGraphEntities, { id: entity.id });
    const isSame = isEqual(originalEntity, newEntity);
    if (originalEntity && !newEntity) {
      diffType = "remove";
    } else if (!originalEntity && newEntity) {
      diffType = "add";
    } else if (originalEntity && newEntity && !isSame) {
      diffType = "change";
    }
    // console.log(diffType);
    return {
      ...entity,
      data: { diffType },
    };
  });

  return diffedRawGraphEntities;
};
