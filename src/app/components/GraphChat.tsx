"use client";

import { ChatInput, GraphView } from "@@components";
import * as UI from "@@ui";
import {
  createAuthoringResponse,
  createHighlightingResponse,
  test_animals,
  test_family,
  test_snacks,
} from "@@utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const TESTING = true;
const initialGraphText = TESTING ? JSON.stringify(test_animals) : "";

const examples = [
  { id: "Animals", graph: test_animals },
  { id: "Family", graph: test_family },
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
  // The IDs of the currently selected Nodes and Edges to highlight.
  const [highlightIds, setHighlightIds] = React.useState<string[]>([]);
  // The current active mode can be "authoring" or "creating".
  const [isAuthoring, setIsAuthoring] = React.useState(false);
  // The string value bound to the primary textarea input.
  const [chatInputValue, setChatInputValue] = React.useState("");

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

  console.log(graphText);

  // Callback for the chat-style form's submit button being pressed.
  const handleSendButtonClick = async () => {
    if (isAuthoring) {
      // Send the user's text input, and receive response text from the "authoring" AI service.
      const response = await createAuthoringResponse(chatInputValue);
      // console.log(response);
      setGraphText(response);
    } else {
      // Send the user's text input, and receive response text from the "highlighting" AI service.
      const response = await createHighlightingResponse(
        [chatInputValue, graphText].join(" ")
      );
      // console.log(response);
      try {
        const ids = JSON.parse(response) as string[];
        setHighlightIds(ids);
      } catch (e) {
        console.error(e);
      }
    }
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
        {projects.list
          .sort((p) => p.createdAt)
          .reverse()
          .map((project) => (
            <UI.Button
              key={project.id}
              variant="subtle"
              textAlign="left"
              justifyContent="start"
              size="sm"
              onClick={() => {
                setGraphText(project.graphText);
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
                  setGraphText(JSON.stringify(example.graph));
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
        {graphText ? (
          <UI.Flex position="relative" flex={1} h={0} alignItems="stretch">
            <UI.Flex flex={1} alignItems="stretch" p={4}>
              <GraphView
                key={graphText}
                graphText={graphText}
                highlightIds={highlightIds}
                onElementPress={handleElementPress}
              />
            </UI.Flex>
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
        <ChatInput
          value={chatInputValue}
          onValueChange={setChatInputValue}
          onSendButtonClick={handleSendButtonClick}
          controls={
            <UI.Switch.Root
              colorPalette="green"
              checked={isAuthoring}
              onCheckedChange={(e) => setIsAuthoring(e.checked)}
            >
              <UI.Switch.HiddenInput />
              <UI.Switch.Label>Highlight</UI.Switch.Label>
              <UI.Switch.Control>
                <UI.Switch.Thumb />
              </UI.Switch.Control>
              <UI.Switch.Label>Create</UI.Switch.Label>
            </UI.Switch.Root>
          }
        />
      </UI.Stack>
    </UI.HStack>
  );
};
