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

export const callAISample = async (message: string) => {
  const response = await client.responses.create({
    model: "gpt-4.1",
    instructions: `You are an expert in modeling domain systems and diagramming them in collaboration with users. When the user tells you about some concepts and how they relate, your responses should be in the form of a json-based structure of nodes and relationships, like so: ${JSON.stringify(sample)}`,
    input: message,
  });

  return response.output_text;
};

export async function callAI({
  apiKey,
  apiUrl = "https://api.openai.com/v1/chat/completions",
  model = "gpt-4-turbo",
  messages,
}: {
  apiKey: string;
  apiUrl?: string;
  model?: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
}) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
