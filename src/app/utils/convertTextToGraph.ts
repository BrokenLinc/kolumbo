import { Graph, GraphPosition } from "./types";

const defaultPosition: GraphPosition = { x: 0, y: 0 };

export const convertTextToGraph = (graphText: string): Graph => {
  if (!graphText.trim()) {
    return { nodes: [], edges: [] };
  }
  try {
    const object = JSON.parse(graphText);

    return {
      nodes: object.nodes.map(({ label, ...v }: any) => ({
        ...v,
        position: defaultPosition,
        data: { label: `${label} (${v.id})` },
      })),
      edges: object.edges.map((v: any) => ({
        ...v,
        label: `${v.label} (${v.id})`,
      })),
    };
  } catch (e) {
    return { nodes: [], edges: [] };
  }
};
