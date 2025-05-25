"use server";

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sample = {
  nodes: [
    {
      id: "0",
      label: "Clerk",
    },
    {
      id: "1",
      label: "Customer",
    },
    {
      id: "2",
      label: "Food",
    },
    {
      id: "3",
      label: "Apple",
      parentId: "2",
    },
    {
      id: "4",
      label: "Orange",
      parentId: "2",
    },
    {
      id: "5",
      label: "Apple Tree",
      parentId: "7",
    },
    {
      id: "6",
      label: "Orange Tree",
      parentId: "7",
    },
    {
      id: "7",
      label: "Orchard",
    },
  ],
  edges: [
    {
      id: "e01",
      source: "0",
      target: "1",
      label: "talks with",
      arrow: "two-way",
    },
    {
      id: "e12",
      source: "1",
      target: "2",
      label: "purchases",
      arrow: "source-to-target",
    },
    {
      id: "e34",
      source: "3",
      target: "4",
      label: "is not",
      arrow: "none",
    },
    {
      id: "e35",
      source: "3",
      target: "5",
      label: "grows",
      arrow: "target-to-source",
    },
    {
      id: "e46",
      source: "4",
      target: "6",
      label: "grows",
      arrow: "target-to-source",
    },
  ],
};

export const createAuthoringResponse = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `You are an expert in modeling domain systems and diagramming them in collaboration with users. When the user tells you about some concepts and how they relate, your responses should be in the form of a json-based structure of nodes and relationships, like so: ${JSON.stringify(sample)}`,
    input: message,
  });

  return response.output_text;
};

export const createHighlightingResponse = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `You are an expert in modeling domain systems and facilitating understanding with users. When the user messages you about some concepts and how they relate, they will include a reference artifact form of a json-based structure of nodes and relationships. Your response should be in the form of a json-based array of node ids and edge ids that are most relevant to the user's question, like so: ["1","e12","2"].`,
    input: message,
  });

  return response.output_text;
};
