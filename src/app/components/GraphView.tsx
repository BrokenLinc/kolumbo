"use client";

import * as UI from "@@ui";
import ELKSvg from "elkjs-svg";
import ELK, { LayoutOptions } from "elkjs/lib/elk.bundled.js";
import React from "react";
import { RawGraph } from "../utils/types";

const elk = new ELK();

// Elk has a *huge* amount of options to configure.
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html

const convertRawGraphToSvg = (graph: RawGraph, options: LayoutOptions = {}) => {
  return elk
    .layout({
      id: "root",
      layoutOptions: options,
      /* @ts-ignore */
      children: graph.nodes.map((node) => ({
        ...node,
        width: 150,
        height: 40,
      })),
      /* @ts-ignore */
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
      const renderer = new ELKSvg.Renderer();
      return renderer.toSvg(
        layoutedGraph,
        `
          rect {
            opacity: 1;
            fill: #4466dd;
            stroke-width: 0;
            stroke: #222222;
            rx: 6;
            ry: 6;
          }
          rect.port {
            opacity: 1;
            fill: #4466dd;
          }
          text {
            font-size: 10px;
            font-family: sans-serif;
            /* in elk's coordinates "hanging" would be the correct value" */
            dominant-baseline: hanging;
            text-align: left;
          }
          g.port > text {
            font-size: 8px;
          }
          polyline {
            opacity: 0.6;
            fill: none;
            stroke: #4466dd;
            stroke-width: 4;
            stroke-linejoin: round;
          }
          path {
            fill: none;
            stroke: black;
            stroke-width: 1;
          }
        `,
        `
          <marker id="arrow" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
            <path d="M0,7 L10,4 L0,1 L0,7" style="fill: #000000;"></path>
          </marker>
        `
      );
    })
    .catch(console.error);
};

const LayoutFlowInner: React.FC<{ rawGraph: RawGraph }> = ({ rawGraph }) => {
  const [svgHtml, setSvgHtml] = React.useState("");

  React.useLayoutEffect(() => {
    convertRawGraphToSvg(rawGraph, {
      "elk.direction": "DOWN",
      "elk.algorithm": "layered", // recommend "layered' or "mrtree"
      "elk.layered.spacing.nodeNodeBetweenLayers": "80",
      "elk.spacing.nodeNode": "40",
    }).then((svg: any) => {
      setSvgHtml(svg);
    });
  }, [rawGraph]);

  return <UI.Box dangerouslySetInnerHTML={{ __html: svgHtml }} />;
};

export const GraphView: React.FC<{ graph: any } & UI.BoxProps> = ({
  graph,
  ...props
}) => (
  <UI.Box {...props}>
    <LayoutFlowInner rawGraph={graph} />
  </UI.Box>
);
