"use client";

import React, { useEffect } from "react";
import { useGameState } from "./useGameState";
import { Cell } from "./Cell";
import { Legend } from "./Legend";
import { Message } from "./Message";
import { PlayerID, BOX_DRAWINGS, FLOOR, WALL, EXIT } from "./constants";

export const Game: React.FC = () => {
  const { state, movePlayer, processEnemyTurn, resetGame } = useGameState();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: {
        [key: string]: { dx: number; dy: number; playerId: PlayerID };
      } = {
        // Player 1 controls
        w: { dx: 0, dy: -1, playerId: PlayerID.Player1 },
        s: { dx: 0, dy: 1, playerId: PlayerID.Player1 },
        a: { dx: -1, dy: 0, playerId: PlayerID.Player1 },
        d: { dx: 1, dy: 0, playerId: PlayerID.Player1 },
        // Player 2 controls
        ArrowUp: { dx: 0, dy: -1, playerId: PlayerID.Player2 },
        ArrowDown: { dx: 0, dy: 1, playerId: PlayerID.Player2 },
        ArrowLeft: { dx: -1, dy: 0, playerId: PlayerID.Player2 },
        ArrowRight: { dx: 1, dy: 0, playerId: PlayerID.Player2 },
      };

      const action = keyMap[e.key];
      if (action && action.playerId === state.currentTurn) {
        movePlayer(action.playerId, action.dx, action.dy);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePlayer, state.currentTurn]);

  useEffect(() => {
    if (state.currentTurn === "enemies" && !state.gameOver) {
      processEnemyTurn();
    }
  }, [state.currentTurn, processEnemyTurn, state.gameOver]);

  const renderGame = () => {
    const width = state.dungeon[0].length;

    return (
      <div className="inline-block font-mono text-sm leading-none">
        {/* Top Border */}
        <div>
          {BOX_DRAWINGS.topLeft +
            BOX_DRAWINGS.horizontal.repeat(width) +
            BOX_DRAWINGS.topRight}
        </div>

        {/* Grid */}
        {state.dungeon.map((row, y) => (
          <div key={y}>
            {BOX_DRAWINGS.vertical}
            {row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                type={getCellType(x, y)}
                content={getCellContent(x, y)}
              />
            ))}
            {BOX_DRAWINGS.vertical}
          </div>
        ))}

        {/* Bottom Border */}
        <div>
          {BOX_DRAWINGS.bottomLeft +
            BOX_DRAWINGS.horizontal.repeat(width) +
            BOX_DRAWINGS.bottomRight}
        </div>
      </div>
    );
  };

  const getCellType = (x: number, y: number): string => {
    const player = state.players.find(
      (p) => p.position.x === x && p.position.y === y
    );
    if (player) {
      return player.id === PlayerID.Player1 ? "player1" : "player2";
    }
    if (state.enemies.some((enemy) => enemy.x === x && enemy.y === y)) {
      return "enemy";
    }
    const cell = state.dungeon[y][x];
    switch (cell) {
      case WALL:
        return "wall";
      case FLOOR:
        return "floor";
      case EXIT:
        return "exit";
      default:
        return "floor";
    }
  };

  const getCellContent = (x: number, y: number): string => {
    const player = state.players.find(
      (p) => p.position.x === x && p.position.y === y
    );
    if (player) {
      return "@";
    }
    if (state.enemies.some((enemy) => enemy.x === x && enemy.y === y)) {
      return "E";
    }
    return state.dungeon[y][x] === FLOOR ? "·" : state.dungeon[y][x];
  };

  return (
    <div className="bg-black p-8 rounded-lg shadow-2xl border border-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-400">
        Terminal Roguelike
      </h1>

      {/* Turn Info */}
      <div className="text-lg mb-4 text-white">
        {state.currentTurn !== "enemies" ? (
          <>
            <p>
              Current Turn:{" "}
              <span className="font-bold">{state.currentTurn}</span>
            </p>
            <p>
              Actions Remaining:{" "}
              <span className="font-bold">{state.actionsRemaining}</span>
            </p>
          </>
        ) : (
          <p className="font-bold">Enemies are moving...</p>
        )}
      </div>

      <div className="mb-6">{renderGame()}</div>
      <Message gameOver={state.gameOver} winner={state.winner} />
      <Legend />
      <button
        className="mt-6 px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={resetGame}
        aria-label="Reset Game"
      >
        Reset Game
      </button>
    </div>
  );
};
