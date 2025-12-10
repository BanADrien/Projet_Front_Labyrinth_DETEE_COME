import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GameGrid from "./GameGrid";
import GameHUD from "./GameHUD";
import type { Level, GameState } from "./gameLogic";
import { initializeGame, handleCellClick } from "./gameLogic";

function App() {
  const location = useLocation();
  const levelId = location.state?.value ?? 1;
  const [level, setLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Charger le niveau
  useEffect(() => {
    const loadLevel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/levels/${levelId}`);
        const json: Level = await response.json();
        setLevel(json);
        setGameState(initializeGame(json));
      } catch (error) {
        console.error("Erreur lors du chargement du niveau :", error);
      }
    };
    loadLevel();
  }, [levelId]);

  const handleCellClickWrapper = (row: number, col: number) => {
    if (!level || !gameState) return;
    const newState = handleCellClick(level, gameState, row, col);
    setGameState(newState);
  };

  const handleReset = () => {
    if (level) {
      setGameState(initializeGame(level));
    }
  };

  if (!level || !gameState) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <GameHUD level={level} gameState={gameState} onReset={handleReset} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GameGrid level={level} gameState={gameState} onCellClick={handleCellClickWrapper} />
      </div>
    </div>
  );
}

export default App;
