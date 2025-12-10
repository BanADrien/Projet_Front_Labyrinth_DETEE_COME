import React from "react";
import type { Level, GameState } from "./gameLogic";
import { getCellDisplay } from "./gameLogic";

interface GameGridProps {
  level: Level;
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ level, gameState, onCellClick }) => {
  const cellSize = 50;
  const gap = 2;

  const getAdjacentCells = (row: number, col: number) => {
    const adjacent = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < level.rows && newCol >= 0 && newCol < level.cols) {
        adjacent.push(`${newRow}-${newCol}`);
      }
    }
    return adjacent;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${level.cols}, ${cellSize}px)`,
        gap: `${gap}px`,
        padding: "20px",
        backgroundColor: "#222",
        borderRadius: "8px",
        width: "fit-content",
      }}
    >
      {level.grid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const display = getCellDisplay(rowIndex, colIndex, level, gameState);
          const playerKey = `${gameState.playerPos.row}-${gameState.playerPos.col}`;
          const adjacentCells = getAdjacentCells(gameState.playerPos.row, gameState.playerPos.col);
          const cellKey = `${rowIndex}-${colIndex}`;
          const isAdjacent = adjacentCells.includes(cellKey);
          const isClickable = !gameState.gameOver && !gameState.won && isAdjacent && cellKey !== playerKey;

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={!isClickable}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                border: isAdjacent ? "2px solid #4CAF50" : "1px solid #555",
                backgroundColor: "#333",
                color: "white",
                fontSize: "1.5rem",
                cursor: isClickable ? "pointer" : "not-allowed",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: isClickable ? 1 : 0.5,
              }}
            >
              {display}
            </button>
          );
        })
      )}
    </div>
  );
};

export default GameGrid;
