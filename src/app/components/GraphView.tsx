"use client";

import * as UI from "@@ui";
import { convertTextToGraph } from "@@utils";
import ELK, {
  ElkEdgeSection,
  ElkExtendedEdge,
  ElkNode,
} from "elkjs/lib/elk.bundled.js";
import _ from "lodash";
import panzoom from "panzoom";
import React from "react";
import { RawGraph } from "../utils/types";

const elk = new ELK();

// Elk has a *huge* amount of options to configure.
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html

// ChakraUI based color scheme for use when highlighting Nodes and Edges.
const colorScheme = "blue";

/**
 * A function that takes in the minimal RawGraph data structure and produces a complete ElkNode graph.
 */
const convertRawGraphToElk = (graph: RawGraph) => {
  return elk
    .layout({
      id: "root",
      layoutOptions: {
        "elk.direction": "DOWN",
        "elk.algorithm": "layered", // recommend "layered' or "mrtree"
        "elk.layered.spacing.nodeNodeBetweenLayers": "40",
        "elk.spacing.nodeNode": "40",
      },
      children: graph.nodes.map((node) => ({
        ...node,
        labels: node.label ? [{ text: node.label }] : undefined,
        // Set a standard size for Nodes
        width: 150,
        height: 40,
      })),
      edges: graph.edges.map((edge) => {
        return {
          ...edge,
          labels: edge.label
            ? [
                {
                  text: edge.label,
                  // Set a standard size for Edge labels.
                  width: 80,
                  height: 28,
                  // Position the label centered, overlaid on the line.
                  layoutOptions: {
                    inline: "true",
                    placement: "CENTER",
                  },
                },
              ]
            : undefined,
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
        };
      }),
    })
    .catch(console.error);
};

/**
 * A component for rendering a graph as an SVG element, and capture interaction events on the elements.
 */
export const GraphView: React.FC<
  {
    graphText: string;
    highlightIds?: string[];
    onElementPress?: (id: string) => void;
  } & UI.BoxProps
> = ({ graphText, highlightIds, onElementPress, ...props }) => {
  // The ELK based graph that will be used to render the SVG.
  const [graph, setGraph] = React.useState<ElkNode>();
  // An element ref for binding the main SVG group element to panning and zooming.
  const draggableRootRef = React.useRef<SVGGElement>(null);

  // When the string based graphText changes (or on mount), convert it to an ELK graph and store in state.
  React.useLayoutEffect(() => {
    const rawGraph = convertTextToGraph(graphText);
    convertRawGraphToElk(rawGraph).then((v: any) => {
      setGraph(v);
    });
  }, [graphText]);

  // Bind the panzoom behavior to the main SVG group element ref.
  React.useEffect(() => {
    if (graph && draggableRootRef.current) {
      panzoom(draggableRootRef.current);
    }
  }, [graph]);

  if (!graph) {
    return null;
  }

  console.log(graphText);

  return (
    <UI.Box
      key="svg-element-root"
      as="svg"
      w="full"
      // @ts-ignore
      preserveAspectRatio="xMidYMid"
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      {...props}
    >
      <g key="panzoom-svg-group" ref={draggableRootRef}>
        {graph.children?.map((node, i: number) => (
          <GraphNodeView
            key={i}
            node={node}
            highlighted={highlightIds?.includes(node.id)}
            onLabelPress={() => onElementPress?.(node.id)}
          />
        ))}
        {graph.edges?.map((edge, i) => {
          return (
            <GraphEdgeView
              key={i}
              edge={edge}
              highlighted={highlightIds?.includes(edge.id)}
              onLabelPress={() => onElementPress?.(edge.id)}
              sourceNodeHighlighted={highlightIds?.includes(edge.sources[0])}
              targetNodeHighlighted={highlightIds?.includes(edge.targets[0])}
            />
          );
        })}
      </g>
    </UI.Box>
  );
};

/**
 * A component for rendering a Node as an HTML element embedded in the SVG, and capturing interaction events.
 */
const GraphNodeView: React.FC<{
  node: ElkNode;
  highlighted?: boolean;
  onLabelPress?: (node: ElkNode) => any;
}> = ({ node, highlighted, onLabelPress }) => {
  // Extra space around the element must exist or the shadow will be clipped.
  const margin = 20;

  return (
    <foreignObject
      width={(node.width || 0) + margin * 2}
      height={(node.height || 0) + margin * 2}
      // @ts-ignore
      x={(node.x || 0) - margin}
      y={(node.y || 0) - margin}
    >
      <UI.Box key="padded-node-container" p={px(margin)}>
        <UI.Stack
          key="node-card-surface"
          bg={highlighted ? `${colorScheme}.600` : "gray.700"}
          borderRadius="5px"
          w={px(node.width)}
          h={px(node.height)}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          onClick={() => onLabelPress?.(node)}
          cursor="pointer"
          boxShadow={
            highlighted
              ? `0 0 20px var(--chakra-colors-${colorScheme}-600)`
              : undefined
          }
        >
          <UI.Box
            key="node-label-text"
            color="white"
            fontSize="sm"
            fontWeight="bold"
          >
            {node.labels?.map((label) => label.text).join(" ")}
          </UI.Box>
        </UI.Stack>
      </UI.Box>
    </foreignObject>
  );
};

/**
 * A component for rendering an Edge in SVG, and capturing interaction events.
 */
const GraphEdgeView: React.FC<{
  edge: ElkExtendedEdge;
  highlighted?: boolean;
  onLabelPress?: (edge: ElkExtendedEdge) => any;
  sourceNodeHighlighted?: boolean;
  targetNodeHighlighted?: boolean;
}> = ({
  edge,
  highlighted,
  onLabelPress,
  sourceNodeHighlighted,
  targetNodeHighlighted,
}) => {
  return (
    <React.Fragment>
      {edge.sections?.map((section, i: number) => {
        return (
          <GraphEdgeSectionView
            key={i}
            section={section}
            highlighted={highlighted}
            sourceNodeHighlighted={sourceNodeHighlighted}
            targetNodeHighlighted={targetNodeHighlighted}
          />
        );
      })}
      <GraphEdgeLabelView
        edge={edge}
        highlighted={highlighted}
        onPress={onLabelPress}
      />
    </React.Fragment>
  );
};

/**
 * A component for rendering an Edge Section as SVG shapes.
 */
const GraphEdgeSectionView: React.FC<{
  section: ElkEdgeSection;
  highlighted?: boolean;
  sourceNodeHighlighted?: boolean;
  targetNodeHighlighted?: boolean;
}> = ({
  section,
  highlighted,
  sourceNodeHighlighted,
  targetNodeHighlighted,
}) => {
  return (
    <React.Fragment>
      <UI.Box
        key="source-start-point"
        as="circle"
        fill={highlighted ? `${colorScheme}.600` : "gray.700"}
        // @ts-ignore
        cx={px(section.startPoint.x)}
        cy={px(section.startPoint.y)}
        r="4px"
        strokeWidth="2px"
        stroke={sourceNodeHighlighted ? `${colorScheme}.900` : "black"}
      />
      {/* <UI.Box
        key="target-end-point"
        as="circle"
        fill={
          highlighted
            ? `${colorScheme}.600`
            : "gray.700"
        }
        // @ts-ignore
        cx={px(section.endPoint.x)`}
        cy={px(section.endPoint.y)`}
        r="4px"
        strokeWidth="2px"
        stroke={targetNodeHighlighted ? `${colorScheme}.900` : "black"}
      /> */}
      <UI.Box
        key="target-end-arrow"
        as="polygon"
        fill={highlighted ? `${colorScheme}.600` : "gray.700"}
        strokeWidth="2px"
        stroke={targetNodeHighlighted ? `${colorScheme}.900` : "black"}
        strokeLinejoin="round"
        transform={`translate(${px(section.endPoint.x)},${px(section.endPoint.y)})`}
        // @ts-ignore
        points="-8,-6 8,-6 0,4"
      />
      <UI.Box
        key="connecting-line"
        as="path"
        fill="none"
        stroke={highlighted ? `${colorScheme}.600` : "gray.700"}
        strokeWidth="2px"
        // @ts-ignore
        d={getPathDataFromEdgeSection(section)}
      />
    </React.Fragment>
  );
};
/**
 * A component for rendering an Edge Label as an HTML element embedded in SVG, and capturing interaction events.
 */
const GraphEdgeLabelView: React.FC<{
  edge: ElkExtendedEdge;
  highlighted?: boolean;
  onPress?: (edge: ElkExtendedEdge) => any;
}> = ({ edge, highlighted, onPress }) => {
  // Extra space around the element must exist or the shadow will be clipped.
  const margin = 10;

  return (
    <React.Fragment>
      {edge.labels?.map((label, i) => {
        return (
          <foreignObject
            key={i}
            width={(label.width || 0) + margin * 2}
            height={(label.height || 0) + margin * 2}
            // @ts-ignore
            x={(label.x || 0) - margin}
            y={(label.y || 0) - margin}
          >
            <UI.Box key="padded-container" p={px(margin)}>
              <UI.Stack
                key="edge-label-card-surface"
                border="2px solid"
                borderColor={highlighted ? `${colorScheme}.600` : "gray.700"}
                bg={highlighted ? `${colorScheme}.900` : "black"}
                borderRadius="5px"
                w={px(label.width)}
                h={px(label.height)}
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                onClick={() => onPress?.(edge)}
                cursor="pointer"
                boxShadow={
                  highlighted
                    ? `0 0 10px var(--chakra-colors-${colorScheme}-600)`
                    : undefined
                }
              >
                <UI.Box
                  key="edge-label-text"
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {label.text}
                </UI.Box>
              </UI.Stack>
            </UI.Box>
          </foreignObject>
        );
      })}
    </React.Fragment>
  );
};

/**
 * A function that generates SVG path data from an ELK Edge Section.
 * Corner radius causes arced curves to be applied at the bend points.
 */
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
      // First point
      d += [point.x, point.y].join(" ");
      d += ", ";
    } else if (i === points.length - 1) {
      // End point
      d += "L ";
      d += [point.x, point.y].join(" ");
      d += ", ";
    } else {
      // Extrapolate the earlier position along the segment between this point and the previous point.
      const backPoint = {
        x: point.x - Math.sign(point.x - points[i - 1].x) * cornerRadius,
        y: point.y - Math.sign(point.y - points[i - 1].y) * cornerRadius,
      };

      // Extrapolate the forward position along the segment between this point and the next point.
      const forwardPoint = {
        x: point.x + Math.sign(points[i + 1].x - point.x) * cornerRadius,
        y: point.y + Math.sign(points[i + 1].y - point.y) * cornerRadius,
      };

      // Draw a line to the earlier point.
      d += "L ";
      d += [backPoint.x, backPoint.y].join(" ");
      d += ", ";

      // Quadratic Bézier curveto through the bend point to the forward point.
      d += "Q ";
      d += [point.x, point.y].join(" ");
      d += ", ";
      d += [forwardPoint.x, forwardPoint.y].join(" ");
      d += ", ";
    }
  });

  return d;
};

/**
 * Input one or more numeric values, and return the sum with "px" suffix.
 */
const px = (input?: number | number[]) => {
  const value = _.sum(_.flatten([input]));
  return `${value || 0}px`;
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
