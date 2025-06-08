import React from "react";

type ChatLogEntry = { author: string; message: string };

export const useChatLog = () => {
  // The history of chat messages sent to and from the agent
  const [entries, setEntries] = React.useState<ChatLogEntry[]>([]);

  const addEntry = (newEntry: ChatLogEntry) => {
    setEntries((prev) => [...prev, newEntry]);
  };

  const clear = () => {
    setEntries([]);
  };

  return {
    addEntry,
    clear,
    entries,
  };
};
