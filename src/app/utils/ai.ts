"use server";

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sampleGraph = {
  nodes: [
    {
      id: "clerk",
      label: "Clerk",
    },
    {
      id: "customer",
      label: "Customer",
    },
    {
      id: "food",
      label: "Food",
    },
    {
      id: "apple",
      label: "Apple",
      parentId: "food",
    },
    {
      id: "orange",
      label: "Orange",
      parentId: "food",
    },
    {
      id: "appleTree",
      label: "Apple Tree",
      parentId: "orchard",
    },
    {
      id: "orangeTree",
      label: "Orange Tree",
      parentId: "orchard",
    },
    {
      id: "orchard",
      label: "Orchard",
    },
  ],
  edges: [
    {
      id: "e-clerk-customer",
      source: "clerk",
      target: "customer",
      label: "talks with",
      arrow: "two-way",
    },
    {
      id: "e-customer-food",
      source: "customer",
      target: "food",
      label: "purchases",
      arrow: "source-to-target",
    },
    {
      id: "e-apple-orange",
      source: "apple",
      target: "orange",
      label: "is not",
      arrow: "none",
    },
    {
      id: "e-apple-appleTree",
      source: "apple",
      target: "appleTree",
      label: "grows",
      arrow: "target-to-source",
    },
    {
      id: "e-orange-orangeTree",
      source: "orange",
      target: "orangeTree",
      label: "grows",
      arrow: "target-to-source",
    },
  ],
};

const sample = {
  graph: sampleGraph,
  highlightIds: ["food", "apple", "e-apple-appleTree", "appleTree", "orchard"],
};

export const createGraphingResponse = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `
      # Your role
      You are an expert in modeling domain systems, diagramming them in collaboration with users, and facilitating understanding with users.
      You are familiar with a reading and writing standardized json-based structure of nodes and relationships called a "graph",
      as well as an array of connected node ids, parent node ids, and edge ids that are most relevant to the user's question, called "highlightIds".
      
      # How we work together
      Whenever the user sends you a message, it may contain a graph json artifact for reference.
      Their message may represent an intent to create or modify a graph,
      or an intent to simply better understand the existing graph.
      
      When you respond to the user, it should be purely in json, using the format below,
      including a graph if the user intend to create or modify, or highlightIds if there is questioning intent.
      If you provided a modified graph from the user,  try to maintain the original entity ids for easy comparison.

      # Additional guidelines:
      - Prefer using short, unique, memorable ids for node and edge ids.
      - Prefer using parent relationships for categorization, or hierarchical grouping.
      - Prefer using edge relationships for actions, logical rules, or non-hierarchical relationships.
      - Avoid creating edges that connect a node directly to its parent. The parent reference itself will suffice.

      In the following example response, the user may have provided a graph describing a system of fruit trees, and then asked "Does food grow on apple trees?"

      ${JSON.stringify(sample)}
    `,
    input: message,
  });

  return response.output_text;
};
