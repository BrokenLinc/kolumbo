export type RawGraphNode = {
  id: string;
  label: string;
};

export type RawGraphEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type RawGraph = {
  nodes: RawGraphNode[];
  edges: RawGraphEdge[];
};
