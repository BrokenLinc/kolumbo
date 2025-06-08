"use client";

import { ChatInput, GraphView } from "@@components";
import * as UI from "@@ui";
import {
  createGraphingResponse,
  test_animals,
  test_family,
  test_orchard,
  test_snacks,
} from "@@utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { diffRawGraphs } from "../utils/diffRawGraphs";

const TESTING = true;

const examples = [
  { id: "Animals", graph: test_animals },
  { id: "Family", graph: test_family },
  { id: "Orchard", graph: test_orchard },
  { id: "Snacks", graph: test_snacks },
];

type Project = {
  id: string;
  graphText: string;
  createdAt: number;
};

/**
 * A hook for reading and writing Projects to local storage.
 */
const useProjects = () => {
  const [projects, saveProjects] = useLocalStorage<Project[]>("projects", []);

  // Create a new Project and add it to the list.
  const add = (projectInput: Pick<Project, "graphText">) => {
    const newList = [
      ...projects,
      {
        id: uuidv4(),
        createdAt: Date.now(),
        ...projectInput,
      },
    ];
    saveProjects(newList);
  };

  const remove = (idToRemove: string) => {
    const newList = projects.filter((p) => {
      return p.id !== idToRemove;
    });
    saveProjects(newList);
  };

  return { list: projects, add, remove };
};

/**
 * The main component for working with Graph Projects.
 */
export const GraphChat: React.FC = () => {
  const projects = useProjects();
  // The current active graph text (a raw string containing JSON).
  const [graphText, setGraphText] = React.useState("");
  // The string value holding the proposed next graph iteration.
  const [stagedGraphText, setStagedGraphText] = React.useState("");
  // The IDs of the currently selected Nodes and Edges to highlight.
  const [highlightIds, setHighlightIds] = React.useState<string[]>([]);
  // The string value bound to the primary textarea input.
  const [chatInputValue, setChatInputValue] = React.useState("");

  // Ses graphText and also clears the highlights and proposed next version.
  // Used for completely loading a new graph.
  const loadGraphText = (newGraphText: string) => {
    setGraphText(newGraphText);
    setHighlightIds([]);
    setStagedGraphText("");
  };

  // Computed value: the current graphText with any changes merged.
  const mergedGraphText = stagedGraphText
    ? JSON.stringify(
        diffRawGraphs(JSON.parse(graphText), JSON.parse(stagedGraphText))
      )
    : graphText;

  // Callback when Nodes or Edges are pressed.
  const handleElementPress = (id: string) => {
    setHighlightIds((prev) => {
      // Toggle the ID's presence in the list.
      if (prev?.includes(id)) {
        // Remove the ID.
        return prev.filter((existingId) => existingId !== id);
      } else {
        // Add the ID.
        return [...(prev || []), id];
      }
    });
  };

  // console.log(zodTextFormat(aiGraphingResponseSchema, "aiGraphingResponse"));

  console.log("graphText", graphText);
  console.log("stagedGraphText", stagedGraphText);
  console.log("mergedGraphText", mergedGraphText);

  // Callback for the chat-style form's submit button being pressed.
  const handleSendButtonClick = async () => {
    // Send the user's text input, and receive response text from the "graphing" AI service.
    const response = await createGraphingResponse(
      [chatInputValue, graphText].join(" ")
    );
    if (!response) return;

    console.log(response);
    try {
      if (response.graph) {
        if (graphText) {
          // TODO: if yolo mode, setGraphText instead.
          setHighlightIds([]);
          setStagedGraphText(JSON.stringify(response.graph));
        } else {
          loadGraphText(JSON.stringify(response.graph));
        }
      }
      if (response.highlightIds) {
        setHighlightIds(response.highlightIds);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Callback for the "Accept all changes" button being clicked in merge mode.
  const handleAcceptAllChangesClick = () => {
    setGraphText(stagedGraphText);
    setStagedGraphText("");
  };

  // Callback for the "Reject all changes" button being clicked in merge mode.
  const handleRejectAllChangesClick = () => {
    setStagedGraphText("");
  };

  // Callback for the "Save" button being clicked on the current active project canvas.
  const handleSaveButtonClick = () => {
    projects.add({
      graphText,
    });
  };

  return (
    <UI.HStack
      key="viewport-container"
      w="100vw"
      h="100vh"
      alignItems="stretch"
    >
      <UI.Stack
        key="left-pane"
        w={64}
        overflowY="scroll"
        gap={0}
        borderRight="1px solid"
        borderColor="gray.800"
      >
        <UI.HStack key="projects-heading" justifyContent="space-between" p={4}>
          <UI.Box>Projects</UI.Box>
          <UI.Box color="gray.500">{projects.list.length}</UI.Box>
        </UI.HStack>
        {[...projects.list]
          .sort((p1, p2) => p2.createdAt - p1.createdAt)
          .map((project) => (
            <UI.Button
              key={project.id}
              variant="subtle"
              textAlign="left"
              justifyContent="start"
              size="sm"
              onClick={() => {
                loadGraphText(project.graphText);
                setHighlightIds([]);
              }}
            >
              {new Date(project.createdAt).toLocaleString()}
            </UI.Button>
          ))}
        {TESTING ? (
          <>
            <UI.HStack
              key="examples-heading"
              justifyContent="space-between"
              p={4}
            >
              <UI.Box>Examples</UI.Box>
              <UI.Box color="gray.500">{examples.length}</UI.Box>
            </UI.HStack>
            {examples.map((example) => (
              <UI.Button
                key={example.id}
                variant="subtle"
                textAlign="left"
                justifyContent="start"
                size="sm"
                onClick={() => {
                  loadGraphText(JSON.stringify(example.graph));
                  setHighlightIds([]);
                }}
              >
                {example.id}
              </UI.Button>
            ))}
          </>
        ) : null}
      </UI.Stack>
      <UI.Stack key="graph-canvas-area" alignItems="stretch" flex={1} gap={0}>
        <UI.Flex flex={1} position="relative" h={0} alignItems="stretch">
          {mergedGraphText ? (
            <UI.Flex flex={1} alignItems="stretch" p={4}>
              <GraphView
                key={mergedGraphText}
                graphText={mergedGraphText}
                highlightIds={highlightIds}
                onElementPress={handleElementPress}
              />
              <UI.Button
                position="absolute"
                top={4}
                right={4}
                onClick={handleSaveButtonClick}
              >
                Save new project
              </UI.Button>
            </UI.Flex>
          ) : null}
        </UI.Flex>
        <UI.Box position="relative">
          <ChatInput
            value={chatInputValue}
            onValueChange={setChatInputValue}
            onSendButtonClick={handleSendButtonClick}
          />
          {stagedGraphText ? (
            <UI.Flex
              position="absolute"
              bg="blackAlpha.800"
              alignItems="center"
              justifyContent="center"
              inset={0}
            >
              <UI.Stack>
                <UI.Stack direction="row">
                  <UI.Button
                    colorPalette="green"
                    onClick={handleAcceptAllChangesClick}
                    variant="outline"
                  >
                    Accept all changes
                  </UI.Button>
                  <UI.Button
                    colorPalette="red"
                    onClick={handleRejectAllChangesClick}
                    variant="outline"
                  >
                    Reject all changes
                  </UI.Button>
                </UI.Stack>
              </UI.Stack>
            </UI.Flex>
          ) : null}
        </UI.Box>
      </UI.Stack>
    </UI.HStack>
  );
};
