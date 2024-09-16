export type Position = {
  x: number;
  y: number;
};

export type Player = {
  position: Position;
  id: PlayerID;
};

export enum PlayerID {
  Player1 = "player1",
  Player2 = "player2",
}

export type Turn = PlayerID | "enemies";

export type GameState = {
  dungeon: string[][];
  players: Player[];
  enemies: Position[];
  gameOver: boolean;
  winner: PlayerID | null;
  currentTurn: Turn;
  actionsRemaining: number;
};
