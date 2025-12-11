export interface GameState {
  playerPos: { row: number; col: number };
  revealedCells: Set<string>;
  moves: number;
  gameOver: boolean;
  won: boolean;
  pathTextures: Map<string, { image: string; rotation: number }>;
  inventory: { [key: string]: number };
  defeatedEnemies: string[];
  clearedObstacles: string[];
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

const calculatePathTextures = (level: Level): Map<string, { image: string; rotation: number }> => {
  const textures = new Map<string, { image: string; rotation: number }>();
  const isPath = (r: number, c: number) => {
    const cell = level.grid[r][c];
    return cell === "C" || cell === "S" || cell === "E"; // Considérer aussi start et exit comme chemins
  };

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      if (!isPath(row, col)) continue;

      const connections = {
        top: row > 0 && isPath(row - 1, col),
        bottom: row < level.rows - 1 && isPath(row + 1, col),
        left: col > 0 && isPath(row, col - 1),
        right: col < level.cols - 1 && isPath(row, col + 1),
      };

      const blocked = {
        top: row === 0,
        bottom: row === level.rows - 1,
        left: col === 0,
        right: col === level.cols - 1,
      };

      const revealedCount = Object.values(connections).filter(Boolean).length;
      const blockedCount = Object.values(blocked).filter(Boolean).length;
      
      // Une ligne droite = 2 connexions OPPOSÉES (haut-bas ou gauche-droite)
      const isStraight = 
        (connections.top && connections.bottom) || 
        (connections.left && connections.right);
      
      // Si on a seulement 2 vraies connexions et pas une ligne = angle
      const isAngle = revealedCount === 2 && !isStraight;
      
      let imageName = "cul_de_sac";
      if (revealedCount === 1) {
        imageName = "cul_de_sac"; // Dead-end
      } else if (revealedCount === 2) {
        if (isStraight) {
          imageName = "ligne"; // Straight line
        } else {
          imageName = "angle2"; // Corner
        }
      } else if (revealedCount === 3) {
        imageName = "angle3"; // T-junction
      } else if (revealedCount === 4) {
        imageName = "angle4"; // Cross
      }

      let rotation = 0;
      if (revealedCount === 1) {
        // Dead-end: rotation 90° dans le sens horaire
        if (connections.right) rotation = 180;
        else if (connections.bottom) rotation = 270;
        else if (connections.left) rotation = 0;
        else rotation = 90; // top
      } else if (revealedCount === 2) {
        if (isStraight) {
          // Straight line: vertical = 90°, horizontal = 0°
          if (connections.top && connections.bottom) {
            rotation = 90;
          } else {
            rotation = 0;
          }
        } else {
          // Corner: rotation 90° sens horaire + 90°
          if (connections.top && connections.left) rotation = 90;
          else if (connections.top && connections.right) rotation = 180;
          else if (connections.bottom && connections.right) rotation = 270;
          else if (connections.bottom && connections.left) rotation = 0;
        }
      } else if (revealedCount === 3) {
        // T-junction: rotation 90° sens anti-horaire
        if (!connections.right) rotation = 270; // manque right
        else if (!connections.bottom) rotation = 0; // manque bottom
        else if (!connections.left) rotation = 90; // manque left
        else if (!connections.top) rotation = 180; // manque top
      } else if (revealedCount === 4) {
        rotation = 0; // Cross
      }

      textures.set(`${row}-${col}`, { image: imageName, rotation });
    }
  }

  return textures;
};



export const initializeGame = (level: Level): GameState => {
  const revealed = new Set<string>();
  const startKey = `${level.start.row}-${level.start.col}`;
  const endKey = `${level.end.row}-${level.end.col}`;
  revealed.add(startKey);
  revealed.add(endKey);
  const pathTextures = calculatePathTextures(level);

  return {
    playerPos: level.start,
    revealedCells: revealed,
    moves: 0,
    gameOver: false,
    won: false,
    pathTextures,
    inventory: {},
    defeatedEnemies: [],
    clearedObstacles: [],
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
  const newState: GameState = {
    playerPos: gameState.playerPos,
    revealedCells: new Set(revealedCells),
    moves: gameState.moves,
    gameOver: gameState.gameOver,
    won: gameState.won,
    pathTextures: gameState.pathTextures,
    inventory: { ...gameState.inventory },
    defeatedEnemies: [...gameState.defeatedEnemies],
    clearedObstacles: [...gameState.clearedObstacles],
  };

  // Révéler la cellule cliquée
  newState.revealedCells.add(cellKey);

  // Incrémenter le score
  newState.moves += 1;

  // Gérer les items
  if (cellContent.startsWith("I:")) {
    const itemId = cellContent.split(":")[1];
    newState.inventory[itemId] = (newState.inventory[itemId] || 0) + 1;
    return newState;
  }

  // Gérer les clés
  if (cellContent.startsWith("K:")) {
    const keyId = cellContent.split(":")[1];
    newState.inventory[`key_${keyId}`] = (newState.inventory[`key_${keyId}`] || 0) + 1;
    return newState;
  }

  // Gérer les portes
  if (cellContent.startsWith("D:")) {
    const doorColor = cellContent.split(":")[1];
    const keyId = `key_${doorColor}`;
    if (newState.inventory[keyId] && newState.inventory[keyId] > 0) {
      newState.inventory[keyId] -= 1;
      newState.playerPos = { row: targetRow, col: targetCol };
    }
    return newState;
  }

  // Gérer les monstres
  if (cellContent.startsWith("M:")) {
    const enemyType = cellContent.split(":")[1];
    const key = `${targetRow}-${targetCol}`;
    
    // Vérifier si on a une épée (pickaxe comme arme par défaut)
    if (newState.inventory["pickaxe"] && newState.inventory["pickaxe"] > 0) {
      newState.defeatedEnemies.push(key);
      newState.inventory["pickaxe"] -= 1;
      newState.playerPos = { row: targetRow, col: targetCol };
    }
    return newState;
  }

  // Gérer les obstacles
  if (cellContent.startsWith("O:")) {
    const obstacleType = cellContent.split(":")[1];
    const key = `${targetRow}-${targetCol}`;
    let itemNeeded = "";
    
    if (obstacleType === "fire") itemNeeded = "water_bucket";
    if (obstacleType === "rock") itemNeeded = "pickaxe";
    if (obstacleType === "water") itemNeeded = "swim_boots";
    
    if (newState.inventory[itemNeeded] && newState.inventory[itemNeeded] > 0) {
      newState.clearedObstacles.push(key);
      newState.playerPos = { row: targetRow, col: targetCol };
    }
    return newState;
  }
};

export const getCellDisplay = (
  row: number,
  col: number,
  level: Level,
  gameState: GameState
): string => {
  const cellKey = `${row}-${col}`;
  const { playerPos, revealedCells, defeatedEnemies, clearedObstacles } = gameState;

  // Si le joueur est ici
  if (playerPos.row === row && playerPos.col === col) {
    return "🏴‍☠️";
  }

  // Si pas révélé
  if (!revealedCells.has(cellKey)) {
    return "?";
  }

  // Cellule révélée
  const cell = level.grid[row][col];
  if (cell === "S") return "🟢";
  if (cell === "E") return "❌";
  if (cell === "W") return "";
  if (cell === "C") return "";
  if (cell.startsWith("M:") && !defeatedEnemies.includes(cellKey)) return "👹";
  if (cell.startsWith("K:")) return "🔑";
  if (cell.startsWith("D:")) return "🚪";
  if (cell.startsWith("I:")) return "💎";
  if (cell.startsWith("O:") && !clearedObstacles.includes(cellKey)) return "🧱";
  return "?";
};
