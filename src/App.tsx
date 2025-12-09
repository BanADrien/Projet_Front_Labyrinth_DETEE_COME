import { useEffect } from "react";
import "./App.css";

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

function App() {
  useEffect(() => {
    async function loadLevel() {
      const response = await fetch("http://localhost:4000/api/levels/1");
      const level: Level = await response.json();

      console.log("Grille du niveau 1 :");
      console.table(level.grid);
    }

    loadLevel();
  }, []);

  return (
    <>
      <h1>La console ?</h1>
    </>
  );
}

export default App;
