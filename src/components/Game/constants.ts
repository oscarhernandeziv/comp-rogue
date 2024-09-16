// Dungeon Dimensions
export const WIDTH = 20;
export const HEIGHT = 10;

// Player Identifiers
export enum PlayerID {
  Player1 = "player1",
  Player2 = "player2",
}

// Actions Per Turn
export const ACTIONS_PER_TURN = 3;

// Entity Symbols
export const PLAYER = "@";
export const ENEMY = "E";
export const WALL = "#";
export const FLOOR = "·";
export const EXIT = "X";

// Box Drawing Characters
export const BOX_DRAWINGS = {
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  horizontal: "─",
  vertical: "│",
  teeRight: "├",
  teeLeft: "┤",
  teeDown: "┬",
  teeUp: "┴",
  cross: "┼",
};
