import { WIDTH, HEIGHT, WALL, FLOOR, EXIT } from "../components/Game/constants";

export function generateDungeon(): string[][] {
  const dungeon = Array.from({ length: HEIGHT }, () =>
    Array(WIDTH).fill(FLOOR)
  );

  // Randomly add walls with a 20% chance
  for (let y = 1; y < HEIGHT - 1; y++) {
    for (let x = 1; x < WIDTH - 1; x++) {
      if (Math.random() < 0.2) {
        dungeon[y][x] = WALL;
      }
    }
  }

  // Ensure players' starting positions are clear
  dungeon[1][1] = FLOOR; // Player 1 start position
  dungeon[HEIGHT - 2][WIDTH - 2] = FLOOR; // Player 2 start position

  // Place exit at a random floor tile
  let exitPlaced = false;
  while (!exitPlaced) {
    const exitX = Math.floor(Math.random() * (WIDTH - 2)) + 1;
    const exitY = Math.floor(Math.random() * (HEIGHT - 2)) + 1;
    if (dungeon[exitY][exitX] === FLOOR) {
      dungeon[exitY][exitX] = EXIT;
      exitPlaced = true;
    }
  }

  return dungeon;
}
