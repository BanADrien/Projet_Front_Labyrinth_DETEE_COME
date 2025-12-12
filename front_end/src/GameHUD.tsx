import React from "react";
import type { Level, GameState } from "./gameLogic";
import Inventory from "./Inventory";

type ScoreEntry = {
  pseudo: string;
  level: number;
  moves: number;
  timeSeconds: number;
  score: number;
  timestamp: number;
};

interface GameHUDProps {
  level: Level;
  gameState: GameState;
  elapsedSeconds: number;
  score: number;
  bestScore: ScoreEntry | null;
  onReset: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const GameHUD: React.FC<GameHUDProps> = ({ level, gameState, elapsedSeconds, score, bestScore, onReset, onNextLevel, onBackToMenu }) => {
  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h1 className="game-title">{level.name}</h1>
      <p className="game-description">{level.description}</p>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Coups:</span> <span className="stat-value">{gameState.moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Position:</span> <span className="stat-value">({gameState.playerPos.row}, {gameState.playerPos.col})</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Révélées:</span> <span className="stat-value">{gameState.revealedCells.size}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Temps:</span> <span className="stat-value">{formatTime(elapsedSeconds)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Score:</span> <span className="stat-value">{score}</span>
        </div>
        {bestScore && (
          <div className="stat-item">
            <span className="stat-label">Meilleur:</span>
            <span className="stat-value">
              {bestScore.score} ({formatTime(bestScore.timeSeconds)}, {bestScore.moves} coups)
            </span>
          </div>
        )}
      </div>

      <Inventory inventory={gameState.inventory} />

      {gameState.won && (
        <div className="victory-message">
          🎉 Victoire en {gameState.moves} coups et {formatTime(elapsedSeconds)} — Score {score}
          <div className="game-buttons-row">
            <button onClick={onBackToMenu} className="game-btn game-btn-menu">
              🏠 Menu
            </button>
            <button onClick={onNextLevel} className="game-btn game-btn-next">
              ➡️ Suivant
            </button>
            <button onClick={onReset} className="game-btn game-btn-restart">
              🔄 Rejouer
            </button>
          </div>
        </div>
      )}

      {gameState.gameOver && !gameState.won && (
        <div className="gameover-message">
          ❌ Jeu terminé
        </div>
      )}

      {!gameState.won && (
        <div className="game-buttons-row">
          <button onClick={onReset} className="game-btn game-btn-restart">
            🔄 Recommencer
          </button>
          <button onClick={onBackToMenu} className="game-btn game-btn-menu">
            🏠 Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
