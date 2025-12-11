import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameGrid from "./GameGrid";
import GameHUD from "./GameHUD";
import type { Level, GameState } from "./gameLogic";
import { initializeGame, handleCellClick } from "./gameLogic";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleNextLevel = () => {
    if (!gameState?.won) return;
    const next = levelId + 1;
    if (next <= 4) {
      navigate("/app", { state: { value: next } });
    } else {
      navigate("/");
    }
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  if (!level || !gameState) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <GameHUD
        level={level}
        gameState={gameState}
        onReset={handleReset}
        onNextLevel={handleNextLevel}
        onBackToMenu={handleBackToMenu}
      />
      <div className="game-stage">
        <div style={{ display: "flex", justifyContent: "center" }}>
        <GameGrid level={level} gameState={gameState} onCellClick={handleCellClickWrapper} />
        </div>
      </div>
    </div>
  );
}

export default App;
