"use client";

import React from "react";
import { GameInterface } from "./GameInterface";
import { GameStateProvider } from "./GameState";

export const Game: React.FC = () => {
  return (
    <GameStateProvider>
      <GameInterface />
    </GameStateProvider>
  );
};
