import React from "react";

interface MessageProps {
  gameOver: boolean;
  winner: string | null;
}

export const Message: React.FC<MessageProps> = ({ gameOver, winner }) => {
  if (!gameOver) return null;

  if (winner) {
    return (
      <div className="text-xl font-bold text-green-300">
        Player {winner} Wins!
      </div>
    );
  } else {
    return (
      <div className="text-xl font-bold text-red-300">
        Game Over! Both players lost.
      </div>
    );
  }
};
