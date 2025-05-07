import { RawGraph } from "./types";

export const convertTextToGraph = (graphText: string): RawGraph => {
  if (!graphText.trim()) {
    return { nodes: [], edges: [] };
  }
  try {
    return JSON.parse(graphText);
  } catch (e) {
    return { nodes: [], edges: [] };
  }
};
