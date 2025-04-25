"use client";

import * as UI from "@ui";
import React from "react";
import { useGameState } from "./GameState";

export const GameInterface: React.FC = () => {
  const game = useGameState();
  return (
    <UI.Button onClick={() => game.setCounter((v) => v + 1)}>
      counter: {game.counter}
    </UI.Button>
  );
};
