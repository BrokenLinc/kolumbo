"use client";

import * as UI from "@@ui";
import React from "react";

export const ChatInput: React.FC<{
  value: string;
  onValueChange: (v: string) => any;
  onSendButtonClick: () => any;
}> = ({ value, onValueChange, onSendButtonClick: onSendClick }) => (
  <UI.Flex p={4} position="relative" alignItems="stretch">
    <UI.Textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      resize="none"
      h={40}
      bg="gray.900"
    />
    <UI.Button position="absolute" bottom={6} right={6} onClick={onSendClick}>
      Send
    </UI.Button>
  </UI.Flex>
);
