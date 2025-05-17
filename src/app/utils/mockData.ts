import { RawGraph } from "./types";

const position = { x: 0, y: 0 };

export const test_animals: RawGraph = {
  nodes: [
    { id: "1", label: "Zebra" },
    { id: "2", label: "Horse" },
    { id: "3", label: "Mammal" },
    { id: "4", label: "Animal" },
  ],
  edges: [
    {
      id: "e13",
      source: "1",
      target: "3",
      label: "is a",
      arrow: "source-to-target",
    },
    {
      id: "e23",
      source: "2",
      target: "3",
      label: "is a",
      arrow: "target-to-source",
    },
    { id: "e34", source: "3", target: "4", label: "is a", arrow: "two-way" },
  ],
};

export const test_snacks: RawGraph = {
  nodes: [
    { id: "1", label: "Snack" },
    { id: "2", label: "Chips" },
    { id: "3", label: "Candy" },
    { id: "4", label: "Doritos" },
    { id: "5", label: "Lays" },
  ],
  edges: [
    { id: "e21", source: "2", target: "1", label: "is a" },
    { id: "e31", source: "3", target: "1", label: "is a" },
    { id: "e42", source: "4", target: "2", label: "is a" },
    { id: "e52", source: "5", target: "2", label: "is a" },
  ],
};

export const test_family: RawGraph = {
  nodes: [
    { id: "1", label: "John D. Sr." },
    { id: "2", label: "John D. Jr." },
    { id: "3", label: "Nelson" },
    { id: "4", label: "David Rockefeller" },
    { id: "5", label: "John D. III" },
    { id: "6", label: "David Jr." },
    { id: "7", label: "Jay Rockefeller" },
  ],
  edges: [
    { id: "e12", source: "1", target: "2", label: "father" },
    { id: "e23", source: "2", target: "3", label: "father" },
    { id: "e24", source: "2", target: "4", label: "father" },
    { id: "e25", source: "2", target: "5", label: "father" },
    { id: "e46", source: "4", target: "6", label: "father" },
    { id: "e57", source: "5", target: "7", label: "father" },
  ],
};
