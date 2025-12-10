import React from "react";
import type { Level, GameState } from "./gameLogic";

interface GameHUDProps {
  level: Level;
  gameState: GameState;
  onReset: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ level, gameState, onReset }) => {
  return (
    <div style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>
      <h1>{level.name}</h1>
      <p>{level.description}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#eee",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "20px auto",
        }}
      >
        <div>
          <strong>Coups:</strong> {gameState.moves}
        </div>
        <div>
          <strong>Position:</strong> ({gameState.playerPos.row}, {gameState.playerPos.col})
        </div>
        <div>
          <strong>Révélées:</strong> {gameState.revealedCells.size}
        </div>
      </div>

      {gameState.won && (
        <div style={{ fontSize: "1.5rem", color: "green", marginTop: "20px" }}>
          🎉 Victoire en {gameState.moves} coups!
        </div>
      )}

      {gameState.gameOver && !gameState.won && (
        <div style={{ fontSize: "1.5rem", color: "red", marginTop: "20px" }}>
          ❌ Jeu terminé
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
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
  );
};

export default GameHUD;
