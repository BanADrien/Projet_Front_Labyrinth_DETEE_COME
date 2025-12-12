import React from "react";
import type { Level, GameState } from "./gameLogic";
import Inventory from "./Inventory";

interface GameHUDProps {
  level: Level;
  gameState: GameState;
  onReset: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ level, gameState, onReset, onNextLevel, onBackToMenu }) => {
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
      </div>

      <Inventory inventory={gameState.inventory} />

      {gameState.won && (
        <div className="victory-message">
          🎉 Victoire en {gameState.moves} coups!
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onBackToMenu}
              style={{
                padding: "10px 18px",
                fontSize: "1rem",
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Menu principal
            </button>
            <button
              onClick={onNextLevel}
              style={{
                padding: "10px 18px",
                fontSize: "1rem",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Niveau suivant ➡️
            </button>
            <button
              onClick={onReset}
              style={{
                padding: "10px 18px",
                fontSize: "1rem",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Recommencer
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
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={onReset}
            style={{
              padding: "10px 18px",
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Recommencer
          </button>
          <button
            onClick={onBackToMenu}
            style={{
              padding: "10px 18px",
              fontSize: "1rem",
              backgroundColor: "#555",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Menu principal
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
