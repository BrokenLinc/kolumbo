"use client";

import { AIChat, Graph } from "@@components";
import * as UI from "@@ui";
import { convertTextToGraph } from "@@utils";
import React from "react";

export const ChatGraph: React.FC = () => {
  const [graphText, setGraphText] = React.useState("");

  const graph = React.useMemo(() => convertTextToGraph(graphText), [graphText]);

  return (
    <UI.Stack w="100vw" h="100vh">
      <AIChat onResponse={setGraphText} />
      {graphText ? (
        <Graph key={graphText} graph={graph} flex={1} color="black" />
      ) : null}
    </UI.Stack>
  );
};
