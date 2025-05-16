"use client";

import * as UI from "@@ui";
import React from "react";

/**
 * A component that renders a textarea with an overlaid control row containing a submit button.
 */
export const ChatInput: React.FC<{
  value: string;
  onValueChange: (v: string) => any;
  onSendButtonClick: () => any;
  controls?: React.ReactNode;
}> = ({ value, onValueChange, onSendButtonClick: onSendClick, controls }) => (
  <UI.Flex key="control-group" p={4} position="relative" alignItems="stretch">
    <UI.Textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      resize="none"
      h={40}
      bg="gray.900"
    />
    <UI.HStack
      key="control-group-footer"
      position="absolute"
      bottom={6}
      right={6}
      gap={8}
    >
      {controls}
      <UI.Button onClick={onSendClick}>Send</UI.Button>
    </UI.HStack>
  </UI.Flex>
);
