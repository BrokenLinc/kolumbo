"use client";

import React from "react";

type GameState = {
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
};

const GameStateContext = React.createContext<GameState>({} as GameState);
export const useGameState = () => React.useContext(GameStateContext);

export const GameStateProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [counter, setCounter] = React.useState(0);

  const value = { counter, setCounter };

  return <GameStateContext.Provider value={value} {...props} />;
};

const scenario = {
  categories: ["people", "places", "weapons"],
  solution: [
    ["lincoln", "library", "candlestick"],
    ["kasey", "kitchen", "hammer"],
    ["blake", "den", "knife"],
    ["peter", "attic", "pistol"],
    ["mak", "cellar", "poker"],
  ],
  clues: [],
};
