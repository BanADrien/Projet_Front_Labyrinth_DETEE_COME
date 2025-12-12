import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameGrid from "./GameGrid";
import GameHUD from "./GameHUD";
import type { Level, GameState } from "./gameLogic";
import { initializeGame, handleCellClick } from "./gameLogic";

type ScoreEntry = {
  pseudo: string;
  level: number;
  moves: number;
  timeSeconds: number;
  score: number;
  timestamp: number;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const levelId = location.state?.value ?? 1;
  const pseudo = location.state?.pseudo || localStorage.getItem("pseudo") || "Anonyme";
  const [level, setLevel] = useState<Level | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false);
  const [bestScore, setBestScore] = useState<ScoreEntry | null>(null);

  // Charger le niveau
  useEffect(() => {
    const loadLevel = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/levels/${levelId}`);
        const json: Level = await response.json();
        setLevel(json);
        setGameState(initializeGame(json));
        setElapsedSeconds(0);
        setTimerStarted(false);
        setHasSavedScore(false);

        // Charger le meilleur score du niveau
        const bestRaw = localStorage.getItem("bestScores");
        if (bestRaw) {
          const parsed = JSON.parse(bestRaw);
          const best = parsed[levelId];
          setBestScore(best || null);
        } else {
          setBestScore(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du niveau :", error);
      }
    };
    loadLevel();
  }, [levelId]);

  const handleCellClickWrapper = (row: number, col: number) => {
    if (!level || !gameState) return;
    // Démarrer le timer au premier clic
    if (!timerStarted) {
      setTimerStarted(true);
    }
    const newState = handleCellClick(level, gameState, row, col);
    setGameState(newState);
  };

  const handleReset = () => {
    if (level) {
      setGameState(initializeGame(level));
      setElapsedSeconds(0);
      setTimerStarted(false);
      setHasSavedScore(false);
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

  // Timer : incrémente chaque seconde tant que la partie est active
  useEffect(() => {
    if (!gameState || !timerStarted || gameState.gameOver || gameState.won) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState?.gameOver, gameState?.won, timerStarted]);

  const computeScore = useMemo(() => {
    const moves = gameState?.moves ?? 0;
    const seconds = elapsedSeconds;
    // Score décroît avec les coups et le temps, plancher à 0
    return Math.max(0, 5000 - moves * 25 - seconds * 20);
  }, [gameState?.moves, elapsedSeconds]);

  // Sauvegarde du score une seule fois à la victoire
  useEffect(() => {
    if (!gameState || !gameState.won || hasSavedScore) return;

    const entry: ScoreEntry = {
      pseudo,
      level: levelId,
      moves: gameState.moves,
      timeSeconds: elapsedSeconds,
      score: computeScore,
      timestamp: Date.now(),
    };

    const existingRaw = localStorage.getItem("scores");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(entry);
    localStorage.setItem("scores", JSON.stringify(existing));

    // Mettre à jour le meilleur score du niveau
    const bestRaw = localStorage.getItem("bestScores");
    const bestMap = bestRaw ? JSON.parse(bestRaw) : {};
    const currentBest = bestMap[levelId] as ScoreEntry | undefined;
    const isBetter = !currentBest || entry.score > currentBest.score ||
      (entry.score === currentBest.score && (entry.moves < currentBest.moves || (entry.moves === currentBest.moves && entry.timeSeconds < currentBest.timeSeconds)));
    if (isBetter) {
      bestMap[levelId] = entry;
      localStorage.setItem("bestScores", JSON.stringify(bestMap));
      setBestScore(entry);
    }

    setHasSavedScore(true);
  }, [gameState, hasSavedScore, elapsedSeconds, computeScore, levelId, pseudo]);

  if (!level || !gameState) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <GameHUD
        level={level}
        gameState={gameState}
        elapsedSeconds={elapsedSeconds}
        score={computeScore}
        bestScore={bestScore}
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
