import { useState, useCallback } from "react";
import {
  WIDTH,
  HEIGHT,
  WALL,
  FLOOR,
  EXIT,
  PlayerID,
  ACTIONS_PER_TURN,
} from "./constants";
import { generateDungeon } from "../../utils/dungeon";
import { Position, Player, GameState, Turn } from "../../types";

// Initialize Game Function
function initializeGame(): GameState {
  const dungeon = generateDungeon(); // Generates a new dungeon layout

  const players: Player[] = [
    { position: { x: 1, y: 1 }, id: PlayerID.Player1 },
    { position: { x: WIDTH - 2, y: HEIGHT - 2 }, id: PlayerID.Player2 },
  ];

  // Place enemies in random floor tiles
  const enemies: Position[] = [];
  while (enemies.length < 3) {
    const x = Math.floor(Math.random() * (WIDTH - 2)) + 1;
    const y = Math.floor(Math.random() * (HEIGHT - 2)) + 1;
    if (
      dungeon[y][x] === FLOOR && // Ensure the tile is floor
      !players.some(
        (player) => player.position.x === x && player.position.y === y
      ) // Ensure no player is on this tile
    ) {
      enemies.push({ x, y });
    }
  }

  return {
    dungeon,
    players,
    enemies,
    gameOver: false,
    winner: null,
    currentTurn: PlayerID.Player1, // Start with Player 1
    actionsRemaining: ACTIONS_PER_TURN, // Set initial actions
  };
}

// Custom Hook
export function useGameState() {
  const [state, setState] = useState<GameState>(initializeGame);

  // Move Player Function
  const movePlayer = useCallback(
    (playerId: PlayerID, dx: number, dy: number) => {
      setState((prevState) => {
        if (prevState.gameOver) return prevState;

        // Only allow movement if it's the player's turn and they have actions remaining
        if (
          prevState.currentTurn !== playerId ||
          prevState.actionsRemaining <= 0
        ) {
          return prevState;
        }

        // Find the player
        const playerIndex = prevState.players.findIndex(
          (p) => p.id === playerId
        );
        if (playerIndex === -1) return prevState;
        const player = prevState.players[playerIndex];

        const newX = player.position.x + dx;
        const newY = player.position.y + dy;

        // Boundary and wall collision
        if (
          newX < 0 ||
          newX >= WIDTH ||
          newY < 0 ||
          newY >= HEIGHT ||
          prevState.dungeon[newY][newX] === WALL
        ) {
          return prevState;
        }

        // Exit condition
        if (prevState.dungeon[newY][newX] === EXIT) {
          return { ...prevState, gameOver: true, winner: playerId };
        }

        // Update player position
        const updatedPlayers = prevState.players.map((p, idx) =>
          idx === playerIndex ? { ...p, position: { x: newX, y: newY } } : p
        );

        // Decrement actions remaining
        let actionsRemaining = prevState.actionsRemaining - 1;
        let currentTurn: Turn = prevState.currentTurn;

        // If actions are depleted, switch turns
        if (actionsRemaining === 0) {
          if (prevState.currentTurn === PlayerID.Player1) {
            currentTurn = PlayerID.Player2;
            actionsRemaining = ACTIONS_PER_TURN;
          } else if (prevState.currentTurn === PlayerID.Player2) {
            currentTurn = "enemies";
            actionsRemaining = 0; // Enemies don't use actions
          }
        }

        return {
          ...prevState,
          players: updatedPlayers,
          actionsRemaining,
          currentTurn,
        };
      });
    },
    []
  );

  // Move Enemies Function
  const moveEnemies = useCallback(() => {
    setState((prevState) => {
      if (prevState.gameOver) return prevState;

      const updatedEnemies: Position[] = prevState.enemies.map((enemy) => {
        // Simple AI: move towards the nearest player
        const targetPlayer = prevState.players.reduce(
          (closest, player) => {
            const distance =
              Math.abs(enemy.x - player.position.x) +
              Math.abs(enemy.y - player.position.y);
            return distance < closest.distance ? { player, distance } : closest;
          },
          { player: prevState.players[0], distance: Infinity }
        ).player;

        const dx =
          targetPlayer.position.x > enemy.x
            ? 1
            : targetPlayer.position.x < enemy.x
            ? -1
            : 0;
        const dy =
          targetPlayer.position.y > enemy.y
            ? 1
            : targetPlayer.position.y < enemy.y
            ? -1
            : 0;

        const newX = enemy.x + dx;
        const newY = enemy.y + dy;

        // Avoid walls
        if (prevState.dungeon[newY][newX] !== WALL) {
          return { x: newX, y: newY };
        }

        // If blocked, stay in place
        return enemy;
      });

      return { ...prevState, enemies: updatedEnemies };
    });
  }, []);

  // Check Collisions Function
  const checkCollisions = useCallback(() => {
    setState((prevState) => {
      if (prevState.gameOver) return prevState;

      const collidedPlayers = prevState.players.filter((player) =>
        prevState.enemies.some(
          (enemy) =>
            enemy.x === player.position.x && enemy.y === player.position.y
        )
      );

      if (collidedPlayers.length > 0) {
        const remainingPlayers = prevState.players.filter(
          (player) => !collidedPlayers.includes(player)
        );

        if (remainingPlayers.length === 0) {
          return { ...prevState, gameOver: true, winner: null };
        } else if (remainingPlayers.length === 1) {
          return {
            ...prevState,
            gameOver: true,
            winner: remainingPlayers[0].id,
          };
        } else {
          return { ...prevState, players: remainingPlayers };
        }
      }

      return prevState;
    });
  }, []);

  // Process Enemy Turn Function
  const processEnemyTurn = useCallback(() => {
    moveEnemies();
    checkCollisions();

    // After enemies move, switch back to Player 1
    setState((prevState) => ({
      ...prevState,
      currentTurn: PlayerID.Player1,
      actionsRemaining: ACTIONS_PER_TURN,
    }));
  }, [moveEnemies, checkCollisions]);

  // Reset Game Function
  const resetGame = useCallback(() => {
    setState(initializeGame());
  }, []);

  return {
    state,
    movePlayer,
    processEnemyTurn,
    resetGame,
  };
}
