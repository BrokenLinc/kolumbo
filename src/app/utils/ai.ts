"use server";

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sampleGraph = {
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

const sample = {
  graph: sampleGraph,
  highlightIds: ["2", "3", "e35", "5", "7"],
};

export const createGraphingResponse = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `
      You are an expert in modeling domain systems, diagramming them in collaboration with users, and facilitating understanding with users.
      You are familiar with a reading and writing standardized json-based structure of nodes and relationships called a "graph",
      as well as an array of connected node ids, parent node ids, and edge ids that are most relevant to the user's question, called "highlightIds".
      
      Whenever the user sends you a message, it may contain a graph json artifact for reference.
      Their message may represent an intent to create or modify a graph,
      or an intent to simply better understand the existing graph.
      
      When you respond to the user, it should be purely in json, using the format below,
      including a graph if the user intend to create or modify, or highlightIds if there is questioning intent.

      In the following example, the user may have provided a graph describing a system of fruit trees, and then asked "Does food grow on apple trees?"

      ${JSON.stringify(sample)}
    `,
    input: message,
  });

  return response.output_text;
};
