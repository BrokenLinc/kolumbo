import {
  ElkEdgeSection,
  ElkExtendedEdge,
  ElkNode,
} from "elkjs/lib/elk.bundled.js";

export type DiffType = "add" | "remove" | "change";

export type EdgeData = { diffType?: DiffType };
export type NodeData = { diffType?: DiffType };

export type GraphEdgeSection = ElkEdgeSection & {};
export type GraphExtendedEdge = ElkExtendedEdge & {
  data?: EdgeData;
};
export type GraphNode = ElkNode & { data?: NodeData };

export type RawGraphEntity = {
  id: string;
};

export type RawGraphNode = RawGraphEntity & {
  data?: NodeData;
  label: string;
  parentId?: string;
};

export type RawGraphEdge = RawGraphEntity & {
  data?: EdgeData;
  source: string;
  target: string;
  label?: string;
  arrow?: "none" | "source-to-target" | "target-to-source" | "two-way";
};

export type RawGraph = {
  nodes: RawGraphNode[];
  edges: RawGraphEdge[];
};
