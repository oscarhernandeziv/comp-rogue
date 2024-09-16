import React from "react";

interface CellProps {
  type: string;
  content: string;
}

export const Cell: React.FC<CellProps> = ({ type, content }) => {
  const getClassName = () => {
    switch (type) {
      case "player1":
        return "text-cyan-300";
      case "player2":
        return "text-green-300";
      case "enemy":
        return "text-red-300";
      case "wall":
        return "text-gray-500";
      case "floor":
        return "text-gray-700";
      case "exit":
        return "text-yellow-300";
      default:
        return "text-white";
    }
  };

  return <span className={getClassName()}>{content}</span>;
};
