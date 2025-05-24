export type RawGraphNode = {
  id: string;
  label: string;
  parentId?: string;
};

export type RawGraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  arrow?: "none" | "source-to-target" | "target-to-source" | "two-way";
};

export type RawGraph = {
  nodes: RawGraphNode[];
  edges: RawGraphEdge[];
};
