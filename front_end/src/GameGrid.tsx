import React from "react";
import type { Level, GameState } from "./gameLogic";
import { getCellDisplay } from "./gameLogic";
import cul_de_sac from "./assets/chemins/cul_de_sac.png";
import angle2 from "./assets/chemins/angle2.png";
import ligne from "./assets/chemins/ligne.png";
import angle3 from "./assets/chemins/angle3.png";
import angle4 from "./assets/chemins/angle4.png";

interface GameGridProps {
  level: Level;
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ level, gameState, onCellClick }) => {
  const cellSize = 50;
  const gap = 0;

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

  
  const getPathTextureAndRotation = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const textureData = gameState.pathTextures.get(cellKey);
    if (!textureData) return { image: null, rotation: 0 };

    const imageMap = { cul_de_sac, angle2, ligne, angle3, angle4 };
    const image = imageMap[textureData.image as keyof typeof imageMap];
    return { image, rotation: textureData.rotation };
  };
  const getWallEdges = (row: number, col: number) => {
    const edges: string[] = [];
    const isWall = level.grid[row][col] === "W";
    if (!isWall) return edges;

    const topIsWall = row > 0 && level.grid[row - 1][col] === "W";
    const bottomIsWall = row < level.rows - 1 && level.grid[row + 1][col] === "W";
    const leftIsWall = col > 0 && level.grid[row][col - 1] === "W";
    const rightIsWall = col < level.cols - 1 && level.grid[row][col + 1] === "W";

    if (!topIsWall) edges.push("wall-edge-top");
    if (!bottomIsWall) edges.push("wall-edge-bottom");
    if (!leftIsWall) edges.push("wall-edge-left");
    if (!rightIsWall) edges.push("wall-edge-right");

    return edges;
  };

  const resolveKind = (row: number, col: number, isRevealed: boolean, isPlayer: boolean) => {
    if (isPlayer) return "player";
    if (!isRevealed) return "fog";

    const cell = level.grid[row][col];
    if (cell === "S") return "start";
    if (cell === "E") return "exit";
    if (cell === "W") return "wall";
    if (cell === "C") return "path";
    if (cell.startsWith("M:")) return "monster";
    if (cell.startsWith("K:")) return "key";
    if (cell.startsWith("D:")) return "door";
    if (cell.startsWith("I:")) return "item";
    if (cell.startsWith("O:")) return "obstacle";
    return "path";
  };

  return (
    <div
      className="grid-frame"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${level.cols}, ${cellSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {level.grid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const display = getCellDisplay(rowIndex, colIndex, level, gameState);
          const playerKey = `${gameState.playerPos.row}-${gameState.playerPos.col}`;
          const adjacentCells = getAdjacentCells(gameState.playerPos.row, gameState.playerPos.col);
          const cellKey = `${rowIndex}-${colIndex}`;
          const isRevealed = gameState.revealedCells.has(cellKey);
          const isAdjacent = adjacentCells.includes(cellKey);
          const isClickable = !gameState.gameOver && !gameState.won && isAdjacent && cellKey !== playerKey;
          const isPlayer = cellKey === playerKey;
          const kind = resolveKind(rowIndex, colIndex, isRevealed, isPlayer);
          const wallEdges = kind === "wall" ? getWallEdges(rowIndex, colIndex) : [];
          
          // Texture basée sur la vraie cellule, pas affectée par le joueur
          const cellContent = level.grid[rowIndex][colIndex];
          const isPathLike = (cellContent === "C" || cellContent === "S" || cellContent === "E" ||
                             cellContent.startsWith("M:") || cellContent.startsWith("O:") || 
                             cellContent.startsWith("I:") || cellContent.startsWith("K:") ||
                             cellContent.startsWith("D:")) && isRevealed;
          const pathTexture = isPathLike ? getPathTextureAndRotation(rowIndex, colIndex) : null;

          const classNames = [
            "cell",
            `cell-${kind}`,
            isAdjacent ? "cell-adjacent" : "",
            isClickable ? "" : "cell-disabled",
            ...wallEdges,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={!isClickable}
              className={classNames}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                ...(pathTexture && pathTexture.image ? ({
                  backgroundImage: `url(${pathTexture.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transform: `rotate(${pathTexture.rotation}deg)`,
                } as React.CSSProperties) : {}),
              }}
            >
              <span style={{ transform: (pathTexture && pathTexture.image) ? `rotate(${-pathTexture.rotation}deg)` : 'none', display: 'inline-block' }}>
                {display}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
};

export default GameGrid;
