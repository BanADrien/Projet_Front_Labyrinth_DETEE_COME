export interface GameState {
  playerPos: { row: number; col: number };
  revealedCells: Set<string>;
  moves: number;
  gameOver: boolean;
  won: boolean;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  rows: number;
  cols: number;
  difficulty: string;
  hasCombat: boolean;
  hasKeys: boolean;
  hasObstacles: boolean;
  start: { row: number; col: number };
  end: { row: number; col: number };
  grid: string[][];
  enemies: any[];
  obstacles: any[];
  items: any[];
}

export const initializeGame = (level: Level): GameState => {
  const revealed = new Set<string>();
  const startKey = `${level.start.row}-${level.start.col}`;
  revealed.add(startKey);

  return {
    playerPos: level.start,
    revealedCells: revealed,
    moves: 0,
    gameOver: false,
    won: false,
  };
};

export const getAdjacentCells = (
  row: number,
  col: number,
  rows: number,
  cols: number
): Array<{ row: number; col: number }> => {
  const adjacent = [];
  const directions = [
    [-1, 0], // haut
    [1, 0],  // bas
    [0, -1], // gauche
    [0, 1],  // droite
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      adjacent.push({ row: newRow, col: newCol });
    }
  }
  return adjacent;
};

export const isWalkable = (cell: string): boolean => {
  return cell === "C" || cell === "S" || cell === "E";
};

export const handleCellClick = (
  level: Level,
  gameState: GameState,
  targetRow: number,
  targetCol: number
): GameState => {
  if (gameState.gameOver || gameState.won) return gameState;

  const { playerPos, revealedCells } = gameState;
  const cellKey = `${targetRow}-${targetCol}`;
  const cellContent = level.grid[targetRow][targetCol];

  // Vérifier si c'est adjacent
  const adjacent = getAdjacentCells(playerPos.row, playerPos.col, level.rows, level.cols);
  const isAdjacent = adjacent.some((a) => a.row === targetRow && a.col === targetCol);

  // Si pas adjacent, ignorer le clic
  if (!isAdjacent) {
    return gameState;
  }

  // Créer une copie du state
  const newState = {
    ...gameState,
    revealedCells: new Set(revealedCells),
  };

  // Révéler la cellule cliquée
  newState.revealedCells.add(cellKey);

  // Incrémenter le score
  newState.moves += 1;

  // Si c'est marchable, se déplacer
  if (isWalkable(cellContent)) {
    newState.playerPos = { row: targetRow, col: targetCol };

    // Vérifier la victoire
    if (targetRow === level.end.row && targetCol === level.end.col) {
      newState.won = true;
      newState.gameOver = true;
    }
  }

  return newState;
};

export const getCellDisplay = (
  row: number,
  col: number,
  level: Level,
  gameState: GameState
): string => {
  const cellKey = `${row}-${col}`;
  const { playerPos, revealedCells } = gameState;

  // Si le joueur est ici
  if (playerPos.row === row && playerPos.col === col) {
    return "🤡";
  }

  // Si pas révélé
  if (!revealedCells.has(cellKey)) {
    return "?";
  }

  // Cellule révélée
  const cell = level.grid[row][col];
  if (cell === "S") return "🟢";
  if (cell === "E") return "🏁";
  if (cell === "W") return "⬛";
  if (cell === "C") return "⬜";
  if (cell.startsWith("M:")) return "👹";
  if (cell.startsWith("K:")) return "🔑";
  if (cell.startsWith("D:")) return "🚪";
  return "?";
};
