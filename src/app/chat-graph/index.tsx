"use client";

import * as UI from "@ui";
import React from "react";

import { AIChat } from "../ai/AIChat";
import { GraphExample } from "../graph";

export const ChatGraph: React.FC = () => {
  const [graph, setGraph] = React.useState("");

  return (
    <UI.Stack w="100vw" h="100vh">
      <AIChat onResponse={setGraph} />
      <GraphExample initialGraphText={graph} flex={1} color="black" />
    </UI.Stack>
  );
};
