import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Level {
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

// 🎨 Fonction qui retourne la couleur selon le symbole
function getCellColor(cell: string) {
  if (cell === "W") return "#444";
  if (cell === "S") return "lightgreen";
  if (cell === "E") return "tomato";
  if (cell === "M") return "🟢";
  return "white";
}

function App() {
  const location = useLocation();
  const value = location.state?.value ?? 1; // valeur reçue du bouton, défaut 1
  const [level, setLevel] = useState<Level | null>(null);

  useEffect(() => {
    async function loadLevel() {
      try {
        const response = await fetch(`http://localhost:4000/api/levels/${value}`);
        const json: Level = await response.json();
        setLevel(json);
      } catch (error) {
        console.error("Erreur lors du chargement du niveau :", error);
      }
    }
    loadLevel();
  }, [value]); // ⚡ dépendance sur value pour recharger si elle change

  if (!level) return <p>Chargement du niveau...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Niveau : {level.name}</h1>
      <p>{level.description}</p>

      <h2>Grille :</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${level.cols}, 40px)`,
          gap: "4px",
        }}
      >
        {level.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "40px",
                height: "40px",
                border: "1px solid #333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: getCellColor(cell),
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
