"use client";

import * as UI from "@@ui";
import { callAI } from "@@utils";
import React from "react";

export const AIChat: React.FC<{ onResponse: (v: string) => any }> = ({
  onResponse,
}) => {
  const [message, setMessage] = React.useState("");

  const handleButtonClick = async () => {
    const response = await callAI(message);
    console.log(response);
    onResponse(response);
  };

  return (
    <UI.Flex p={4} position="relative" alignItems="stretch">
      <UI.Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        resize="none"
        h={40}
        bg="gray.900"
      />
      <UI.Button
        position="absolute"
        bottom={6}
        right={6}
        onClick={handleButtonClick}
      >
        Send
      </UI.Button>
    </UI.Flex>
  );
};
