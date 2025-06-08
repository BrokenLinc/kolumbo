import {
  ElkEdgeSection,
  ElkExtendedEdge,
  ElkNode,
} from "elkjs/lib/elk.bundled.js";
import { z } from "zod";

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

export const rawGraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  parentId: z.string().nullish(),
});
export type RawGraphNode = z.infer<typeof rawGraphNodeSchema>;

export const rawGraphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().nullish(),
  arrow: z
    .enum(["none", "source-to-target", "target-to-source", "two-way"])
    .nullish(),
});
export type RawGraphEdge = z.infer<typeof rawGraphEdgeSchema>;

export const rawGraphSchema = z.object({
  nodes: z.array(rawGraphNodeSchema),
  edges: z.array(rawGraphEdgeSchema).nullish(),
});
export type RawGraph = z.infer<typeof rawGraphSchema>;

// https://platform.openai.com/docs/guides/structured-outputs#supported-schemas
export const aiGraphingResponseSchema = z.object({
  graph: rawGraphSchema.nullish(),
  highlightIds: z.array(z.string()).nullish(),
});
export type AiGraphingResponse = z.infer<typeof aiGraphingResponseSchema>;
