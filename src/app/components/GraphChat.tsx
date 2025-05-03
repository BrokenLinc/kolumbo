"use client";

import { ChatInput, GraphView } from "@@components";
import * as UI from "@@ui";
import { callAI, convertTextToGraph, test_animals, test_snacks } from "@@utils";
import React from "react";

const TESTING = true;
const initialGraphText = TESTING ? JSON.stringify(test_animals) : "";

export const GraphChat: React.FC = () => {
  const [graphText, setGraphText] = React.useState(initialGraphText);
  const [chatInputValue, setChatInputValue] = React.useState("");

  const handleSendButtonClick = async () => {
    const response = await callAI(chatInputValue);
    console.log(response);
    setGraphText(response);
  };

  const graph = React.useMemo(() => convertTextToGraph(graphText), [graphText]);

  return (
    <UI.Stack w="100vw" h="100vh">
      {TESTING ? (
        <UI.HStack gap={4} p={4} pb={0}>
          <UI.Button onClick={() => setGraphText(JSON.stringify(test_animals))}>
            Animals
          </UI.Button>
          <UI.Button onClick={() => setGraphText(JSON.stringify(test_snacks))}>
            Snacks
          </UI.Button>
        </UI.HStack>
      ) : null}
      <ChatInput
        value={chatInputValue}
        onValueChange={setChatInputValue}
        onSendButtonClick={handleSendButtonClick}
      />
      {graphText ? (
        <GraphView key={graphText} graph={graph} flex={1} color="black" />
      ) : null}
    </UI.Stack>
  );
};
