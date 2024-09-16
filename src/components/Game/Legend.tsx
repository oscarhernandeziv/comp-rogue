import React from "react";

export const Legend: React.FC = () => {
  const legends = [
    { symbol: "@", color: "text-cyan-300", label: "Player 1 (WASD)" },
    { symbol: "@", color: "text-green-300", label: "Player 2 (Arrows)" },
    { symbol: "E", color: "text-red-300", label: "Enemy" },
    { symbol: "X", color: "text-yellow-300", label: "Exit" },
    { symbol: "#", color: "text-gray-500", label: "Wall" },
    { symbol: "·", color: "text-gray-700", label: "Floor" },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
      {legends.map((legend, index) => (
        <div key={index}>
          <span className={`${legend.color} mr-2`}>{legend.symbol}</span>
          {legend.label}
        </div>
      ))}
    </div>
  );
};
