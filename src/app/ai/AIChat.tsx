"use client";

import * as UI from "@ui";
import React from "react";
import { callAISample } from ".";

export const AIChat: React.FC<{ onResponse: (v: string) => any }> = ({
  onResponse,
}) => {
  const [message, setMessage] = React.useState("");

  const handleButtonClick = async () => {
    const response = await callAISample(message);
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
        size="xs"
      >
        Send
      </UI.Button>
    </UI.Flex>
  );
};
