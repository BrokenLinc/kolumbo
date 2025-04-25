"use server";

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sample = {
  nodes: [
    {
      id: "1",
      label: "Mom",
    },
    {
      id: "2",
      label: "Son",
    },
    {
      id: "3",
      label: "Daughter",
    },
  ],
  edges: [
    { id: "e12", source: "1", target: "2" },
    { id: "e13", source: "1", target: "3" },
  ],
};

export const callAI = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `You are an expert in modeling domain systems and diagramming them in collaboration with users. When the user tells you about some concepts and how they relate, your responses should be in the form of a json-based structure of nodes and relationships, like so: ${JSON.stringify(sample)}`,
    input: message,
  });

  return response.output_text;
};
