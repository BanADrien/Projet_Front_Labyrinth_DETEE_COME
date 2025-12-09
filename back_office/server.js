import express from "express";
import cors from "cors";
import levels from "./data/levels.js";
import highscores from "./data/highscores.js";
import enemiesCatalog from "./data/enemies.js";
import obstaclesCatalog from "./data/obstacles.js";
import itemsCatalog from "./data/items.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FlipLabyrinth API is running" });
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "FlipLabyrinth API is running" });
});

app.get("/api/levels", (req, res) => {
  const summary = levels.map(level => ({
    id: level.id,
    name: level.name,
    description: level.description,
    rows: level.rows,
    cols: level.cols,
    difficulty: level.difficulty,
    hasCombat: level.hasCombat,
    hasKeys: level.hasKeys,
    hasObstacles: level.hasObstacles
  }));
  res.json(summary);
});

app.get("/api/levels/:id", (req, res) => {
  const id = Number(req.params.id);
  const level = levels.find(l => l.id === id);
  if (!level) return res.status(404).json({ error: "Level not found" });
  res.json(level);
});

// GET /api/highscores?levelId=2&limit=10
app.get("/api/highscores", (req, res) => {
  const levelId = req.query.levelId ? Number(req.query.levelId) : null;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  let list = highscores;

  if (levelId) {
    list = list.filter(h => h.levelId === levelId);
  }

  // tri décroissant par score
  list = list.sort((a, b) => b.score - a.score);

  res.json(list.slice(0, limit));
});
// POST /api/highscores
// body : { playerName: string, score: number, levelId: number }
app.post("/api/highscores", (req, res) => {
  const { playerName, score, levelId } = req.body || {};

  if (!playerName || typeof score !== "number" || typeof levelId !== "number") {
    return res.status(400).json({ error: "playerName, score et levelId sont requis" });
  }

app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);
 // vérif que le niveau existe
  const levelExists = levels.some(l => l.id === levelId);
  if (!levelExists) {
    return res.status(400).json({ error: "levelId invalide" });
  }

  const newEntry = {
    id: highscores.length ? Math.max(...highscores.map(h => h.id)) + 1 : 1,
    playerName: String(playerName).slice(0, 30),
    score,
    levelId,
    createdAt: new Date().toISOString()
  };

  highscores.push(newEntry);

  // on garde au plus 20 meilleurs scores par niveau
  const perLevel = highscores
    .filter(h => h.levelId === levelId)
    .sort((a, b) => b.score - a.score);

  const toKeep = perLevel.slice(0, 20).map(h => h.id);
  highscores = highscores.filter(
    h => h.levelId !== levelId || toKeep.includes(h.id)
  );

  res.status(201).json(newEntry);
});



app.get("/api/enemies", (req, res) => res.json(enemiesCatalog));
app.get("/api/obstacles", (req, res) => res.json(obstaclesCatalog));
app.get("/api/items", (req, res) => res.json(itemsCatalog));

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
