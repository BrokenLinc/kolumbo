"use client";

import * as UI from "@@ui";
import { convertTextToGraph } from "@@utils";
import ELK, { ElkEdgeSection, ElkNode } from "elkjs/lib/elk.bundled.js";
import panzoom from "panzoom";
import React from "react";
import { RawGraph } from "../utils/types";

const elk = new ELK();

// Elk has a *huge* amount of options to configure.
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html

const convertRawGraphToElk = (graph: RawGraph) => {
  return elk
    .layout({
      id: "root",
      layoutOptions: {
        "elk.direction": "DOWN",
        "elk.algorithm": "layered", // recommend "layered' or "mrtree"
        "elk.layered.spacing.nodeNodeBetweenLayers": "80",
        "elk.spacing.nodeNode": "40",
      },
      /* @ts-ignore */
      children: graph.nodes.map((node) => ({
        ...node,
        labels: node.label ? [{ text: node.label }] : undefined,
        width: 150,
        height: 40,
      })),
      /* @ts-ignore */
      edges: graph.edges.map((edge) => {
        return {
          ...edge,
          labels: edge.label
            ? [{ text: edge.label, width: 80, height: 20 }]
            : undefined,
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        };
      }),
    })
    .catch(console.error);
};

export const GraphView: React.FC<
  { graphText: string; highlightIds?: string[] } & UI.BoxProps
> = ({ graphText, highlightIds, ...props }) => {
  const [graph, setGraph] = React.useState<ElkNode>();
  const draggableRootRef = React.useRef<SVGGElement>(null);

  React.useLayoutEffect(() => {
    const rawGraph = convertTextToGraph(graphText);
    convertRawGraphToElk(rawGraph).then((v: any) => {
      setGraph(v);
    });
  }, [graphText]);

  React.useEffect(() => {
    if (graph && draggableRootRef.current) {
      panzoom(draggableRootRef.current);
    }
  }, [graph]);

  if (!graph) {
    return null;
  }

  return (
    <UI.Box
      as="svg"
      w="full"
      // @ts-ignore
      preserveAspectRatio="xMidYMid"
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      {...props}
    >
      <g ref={draggableRootRef}>
        {graph.children?.map((node, i: number) => (
          <UI.Box
            key={i}
            as="foreignObject"
            w={`${node.width}px`}
            h={`${node.height}px`}
            // @ts-ignore
            x={`${node.x}px`}
            y={`${node.y}px`}
          >
            <UI.Stack
              bg={highlightIds?.includes(node.id) ? "green.600" : "gray.700"}
              borderRadius="5px"
              w={`${node.width}px`}
              h={`${node.height}px`}
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <UI.Box color="white" fontSize="sm" fontWeight="bold">
                {node.labels?.map((label) => label.text).join(" ")}
              </UI.Box>
            </UI.Stack>
          </UI.Box>
        ))}
        {graph.edges?.map((edge, i) => {
          return (
            <React.Fragment key={i}>
              <React.Fragment>
                {edge.sections?.map((section, i: number) => {
                  return (
                    <UI.Box
                      key={i}
                      as="path"
                      fill="none"
                      stroke={
                        highlightIds?.includes(edge.id)
                          ? "green.700"
                          : "gray.800"
                      }
                      strokeWidth="3px"
                      // @ts-ignore
                      d={getPathDataFromEdgeSection(section)}
                    />
                  );
                })}
              </React.Fragment>
              <React.Fragment>
                {edge.labels?.map((label, i) => {
                  return (
                    <UI.Box
                      key={i}
                      as="foreignObject"
                      w={`${label.width}px`}
                      h={`${label.height}px`}
                      // @ts-ignore
                      x={`${label.x}px`}
                      y={`${label.y}px`}
                    >
                      <UI.Stack
                        bg={
                          highlightIds?.includes(edge.id)
                            ? "green.700"
                            : "gray.800"
                        }
                        borderRadius="5px"
                        w={`${label.width}px`}
                        h={`${label.height}px`}
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                      >
                        <UI.Box color="white" fontSize="xs" fontWeight="bold">
                          {label.text}
                        </UI.Box>
                      </UI.Stack>
                    </UI.Box>
                  );
                })}
              </React.Fragment>
            </React.Fragment>
          );
        })}
      </g>
    </UI.Box>
  );
};

const getPathDataFromEdgeSection = (
  section: ElkEdgeSection,
  cornerRadius = 10
) => {
  const points = [
    section.startPoint,
    ...(section.bendPoints || []),
    section.endPoint,
  ];
  let d = "M";

  points.forEach((point, i) => {
    if (i === 0) {
      d += [point.x, point.y].join(" ");
      d += ", ";
    } else if (i === points.length - 1) {
      d += "L ";
      d += [point.x, point.y].join(" ");
      d += ", ";
    } else {
      const backPoint = {
        x: point.x - Math.sign(point.x - points[i - 1].x) * cornerRadius,
        y: point.y - Math.sign(point.y - points[i - 1].y) * cornerRadius,
      };
      const forwardPoint = {
        x: point.x + Math.sign(points[i + 1].x - point.x) * cornerRadius,
        y: point.y + Math.sign(points[i + 1].y - point.y) * cornerRadius,
      };
      d += "L ";
      d += [backPoint.x, backPoint.y].join(" ");
      d += ", ";
      d += "Q ";
      d += [point.x, point.y].join(" ");
      d += ", ";
      d += [forwardPoint.x, forwardPoint.y].join(" ");
      d += ", ";
    }
  });

  return d;
};

// const getPolylinePointsFromEdgeSection = (section: ElkEdgeSection) => {
//   const points = [
//     section.startPoint,
//     ...(section.bendPoints || []),
//     section.endPoint,
//   ];
//   // Create polyline svg data simply connecting straight, perpendicular line segments
//   return points
//     .map((point) => {
//       return [point.x, point.y].join(",");
//     })
//     .join(" ");
// };
