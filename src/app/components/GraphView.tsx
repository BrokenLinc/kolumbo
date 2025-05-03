"use client";

import * as UI from "@@ui";
import {
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import elkSvg from "elkjs-svg";
import ELK, { LayoutOptions } from "elkjs/lib/elk.bundled.js";
import React from "react";
import { RawGraph } from "../utils/types";

const elk = new ELK();

// Elk has a *huge* amount of options to configure.
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html

const convertRawGraphToReactFlow = (
  graph: RawGraph,
  options: LayoutOptions = {}
) => {
  return elk
    .layout({
      id: "root",
      layoutOptions: options,
      children: graph.nodes.map((node) => ({
        ...node,
        width: 150,
        height: 40,
      })),
      edges: graph.edges.map((edge) => {
        return {
          ...edge,
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        };
      }),
    })
    .then((layoutedGraph) => {
      console.log(layoutedGraph);
      return {
        nodes: layoutedGraph.children?.map((node) => ({
          ...node,
          position: { x: node.x, y: node.y },
        })),
        edges: layoutedGraph.edges,
      };
    })
    .catch(console.error);
};

const convertRawGraphToSvg = (graph: RawGraph, options: LayoutOptions = {}) => {
  return elk
    .layout({
      id: "root",
      layoutOptions: options,
      children: graph.nodes.map((node) => ({
        ...node,
        width: 150,
        height: 40,
      })),
      edges: graph.edges.map((edge) => {
        return {
          ...edge,
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        };
      }),
    })
    .then((layoutedGraph) => {
      const renderer = new elkSvg.Renderer();
      return renderer.toSvg(layoutedGraph);
    })
    .catch(console.error);
};

const LayoutFlowInner: React.FC<{ rawGraph: RawGraph }> = ({ rawGraph }) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [svgHtml, setSvgHtml] = React.useState("");
  const { fitView } = useReactFlow();

  React.useLayoutEffect(() => {
    convertRawGraphToReactFlow(rawGraph, {
      "elk.direction": "DOWN",
      "elk.algorithm": "layered", // recommend "layered' or "mrtree"
      "elk.layered.spacing.nodeNodeBetweenLayers": "80",
      "elk.spacing.nodeNode": "40",
    }).then((reactFlowGraph: any) => {
      setNodes(reactFlowGraph.nodes);
      setEdges(reactFlowGraph.edges);
      fitView();
    });
  }, [fitView, rawGraph, setEdges, setNodes]);

  React.useLayoutEffect(() => {
    convertRawGraphToSvg(rawGraph, {
      "elk.direction": "DOWN",
      "elk.algorithm": "layered", // recommend "layered' or "mrtree"
      "elk.layered.spacing.nodeNodeBetweenLayers": "80",
      "elk.spacing.nodeNode": "40",
    }).then((svg: any) => {
      setSvgHtml(svg);
    });
  }, [fitView, rawGraph, setEdges, setNodes]);

  return (
    <>
      <ReactFlow nodes={nodes} edges={edges} />
      <UI.Box bg="white" dangerouslySetInnerHTML={{ __html: svgHtml }} />
    </>
  );
};

export const GraphView: React.FC<{ graph: any } & UI.BoxProps> = ({
  graph,
  ...props
}) => (
  <UI.Box {...props}>
    <ReactFlowProvider>
      <LayoutFlowInner rawGraph={graph} />
    </ReactFlowProvider>
  </UI.Box>
);
