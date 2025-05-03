export type GraphPosition = {
  x: number;
  y: number;
};

export type GraphNode = {
  id: string;
  type: string;
  data: { label: string };
  position: GraphPosition;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type?: "smoothstep";
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

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
