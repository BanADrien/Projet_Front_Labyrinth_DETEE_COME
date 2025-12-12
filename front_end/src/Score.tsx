import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ScoreEntry {
  pseudo: string;
  level: number;
  moves: number;
  timeSeconds: number;
  score: number;
  timestamp: number;
}

const Score: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const navigate = useNavigate();

  const computeScore = (moves: number, seconds: number) => Math.max(0, 5000 - moves * 25 - seconds * 2);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const savedScores = localStorage.getItem("scores");
    if (savedScores) {
      const parsed = JSON.parse(savedScores);
      const normalized = parsed.map((raw: any) => ({
        pseudo: raw.pseudo || "Anonyme",
        level: raw.level || 1,
        moves: raw.moves || 0,
        timeSeconds: raw.timeSeconds || 0,
        score: raw.score !== undefined ? raw.score : computeScore(raw.moves || 0, raw.timeSeconds || 0),
        timestamp: raw.timestamp || Date.now(),
      })) as ScoreEntry[];

      // Trier par score décroissant, puis par coups asc, temps asc, niveau asc
      normalized.sort((a: ScoreEntry, b: ScoreEntry) => {
        if (a.score !== b.score) return b.score - a.score;
        if (a.moves !== b.moves) return a.moves - b.moves;
        if (a.timeSeconds !== b.timeSeconds) return a.timeSeconds - b.timeSeconds;
        return a.level - b.level;
      });
      setScores(normalized);
    }
  }, []);

  const clearScores = () => {
    if (window.confirm("Voulez-vous vraiment effacer tous les scores ?")) {
      localStorage.removeItem("scores");
      setScores([]);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f2f2f2", 
      padding: "40px 20px" 
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        backgroundColor: "white", 
        borderRadius: "12px", 
        padding: "30px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "30px" 
        }}>
          <h1 style={{ margin: 0, color: "#333" }}>🏆 Tableau des Scores</h1>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Retour au menu
          </button>
        </div>

        {scores.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", fontSize: "1.2rem" }}>
            Aucun score enregistré pour le moment.
          </p>
        ) : (
          <>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              marginBottom: "20px" 
            }}>
              <thead>
                <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Pseudo</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Score</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Niveau</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Coups</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Temps</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      borderBottom: "1px solid #ddd"
                    }}
                  >
                    <td style={{ padding: "12px", color: "#333" }}>{score.pseudo}</td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold", color: "#333" }}>
                      {score.score}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#333" }}>
                      Labyrinthe {score.level}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold", color: "#333" }}>
                      {score.moves}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: "#333" }}>
                      {formatTime(score.timeSeconds)}
                    </td>
                    <td style={{ padding: "12px", color: "#333" }}>
                      {new Date(score.timestamp).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={clearScores}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Effacer tous les scores
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Score;
