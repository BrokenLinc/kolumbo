"use client";

import { ChatInput, Graph } from "@@components";
import * as UI from "@@ui";
import { callAI, convertTextToGraph } from "@@utils";
import React from "react";

export const GraphChat: React.FC = () => {
  const [graphText, setGraphText] = React.useState("");
  const [chatInputValue, setChatInputValue] = React.useState("");

  const handleSendButtonClick = async () => {
    const response = await callAI(chatInputValue);
    console.log(response);
    setGraphText(response);
  };

  const graph = React.useMemo(() => convertTextToGraph(graphText), [graphText]);

  return (
    <UI.Stack w="100vw" h="100vh">
      <ChatInput
        value={chatInputValue}
        onValueChange={setChatInputValue}
        onSendButtonClick={handleSendButtonClick}
      />
      {graphText ? (
        <Graph key={graphText} graph={graph} flex={1} color="black" />
      ) : null}
    </UI.Stack>
  );
};
