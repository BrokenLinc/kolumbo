"use client";

import * as UI from "@@ui";
import {
  addEdge,
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React from "react";

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

const getLayoutedElements = (nodes: any, edges: any, options: any = {}) => {
  const isHorizontal = options?.["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      // Adjust the target and source handle positions based on the layout
      // direction.
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",

      // Hardcode a width and height for elk to use when layouting.
      width: 150,
      height: 50,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children?.map((node) => ({
        ...node,
        // React Flow expects a position property on the node instead of `x`
        // and `y` fields.
        position: { x: node.x, y: node.y },
      })),

      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const LayoutFlowInner: React.FC<{ graph: any }> = ({ graph }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = React.useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds) as any),
    []
  );
  const onLayout = React.useCallback(
    ({ direction, useInitialNodes = false }: any) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const ns = useInitialNodes ? graph.nodes : nodes;
      const es = useInitialNodes ? graph.edges : edges;

      getLayoutedElements(ns, es, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }: any) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          fitView();
        }
      );
    },
    [nodes, edges]
  );

  // Calculate the initial layout on mount.
  React.useLayoutEffect(() => {
    onLayout({ direction: "DOWN", useInitialNodes: true });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right">
        <UI.HStack p={2}>
          <UI.Button
            variant="subtle"
            onClick={() => onLayout({ direction: "DOWN" })}
          >
            Vertical layout
          </UI.Button>
          <UI.Button
            variant="subtle"
            onClick={() => onLayout({ direction: "RIGHT" })}
          >
            Horizontal layout
          </UI.Button>
        </UI.HStack>
      </Panel>
      <Background />
    </ReactFlow>
  );
};

export const Graph: React.FC<{ graph: any } & UI.BoxProps> = ({
  graph,
  ...props
}) => (
  <UI.Box {...props}>
    <ReactFlowProvider>
      <LayoutFlowInner graph={graph} />
    </ReactFlowProvider>
  </UI.Box>
);
