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
  return "white";
}

function App() {
  const location = useLocation();
  const value = location.state?.value ?? 1; // valeur reçue  du bouton, défaut 1
  const navPseudo = location.state?.pseudo as string | undefined;
  const [pseudo, setPseudo] = useState<string | null>(null);
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

  useEffect(() => {
    if (navPseudo) {
      setPseudo(navPseudo);
      localStorage.setItem("pseudo", navPseudo);
    } else {
      const stored = localStorage.getItem("pseudo");
      if (stored) setPseudo(stored);
    }
  }, [navPseudo]);

  if (!level) return <p className="muted">Chargement du niveau...</p>;

  return (
    <div className="app-root">
      {pseudo && <p className="greeting">Bonjour  , {pseudo} — bonne partie !</p>}
      <h1>Niveau : {level.name}</h1>
      <p className="muted">{level.description}</p>

      <h2>Grille :</h2>
      <div
        className="grid-wrap"
        style={{ gridTemplateColumns: `repeat(${level.cols}, 40px)` }}
      >
        {level.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              style={{ background: getCellColor(cell) }}
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
