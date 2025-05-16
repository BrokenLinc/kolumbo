import { RawGraph } from "./types";

/**
 * Attempt to parse JSON from the raw text response from the AI response.
 */
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
