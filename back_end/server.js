  const express = require("express");
  const cors = require("cors");

  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(cors());
  app.use(express.json());

  let highscores = [
    // Exemple : { id: 1, playerName: "Test", score: 100, levelId: 1, createdAt: "2025-01-01T10:00:00.000Z" }
  ];
  /* -------------------------------------------
    CATALOGUES ENNEMIS / OBSTACLES / ITEMS
  -------------------------------------------- */

  const enemiesCatalog = [
    { type: "goblin", name: "Gobelin des couloirs", hp: 14, attack: 3, description: "Rapide mais fragile.", icon: "🟢" },
    { type: "slime", name: "Slime visqueux", hp: 10, attack: 2, description: "Lent et collant.", icon: "🟣" },
    { type: "orc", name: "Orc brutal", hp: 20, attack: 5, description: "Très dangereux.", icon: "🔴" }
  ];

  const obstaclesCatalog = [
    { type: "fire", name: "Flammes", requiredItem: "water_bucket", description: "Flammes à éteindre.", icon: "🔥" },
    { type: "rock", name: "Rochers", requiredItem: "pickaxe", description: "Rochers à briser.", icon: "🪨" },
    { type: "water", name: "Eau profonde", requiredItem: "swim_boots", description: "Eau à traverser.", icon: "💧" }
  ];

  const itemsCatalog = [
    { id: "key_red", kind: "key", color: "red", name: "Clé rouge", description: "Ouvre porte rouge", icon: "🟥" },
    { id: "key_blue", kind: "key", color: "blue", name: "Clé bleue", description: "Ouvre porte bleue", icon: "🟦" },
    { id: "sword", kind: "weapon", name: "Épée", description: "Défait les monstres", icon: "⚔️" },
    { id: "water_bucket", kind: "item", name: "Seau d'eau", description: "Éteint le feu", icon: "🪣" },
    { id: "pickaxe", kind: "item", name: "Pioche", description: "Casse les rochers", icon: "⛏️" },
    { id: "swim_boots", kind: "item", name: "Bottes amphibies", description: "Traverse l'eau", icon: "🥾" }
  ];

  /* -------------------------------------------
    NIVEAUX
  -------------------------------------------- */

  const levels = [

    /* -------------------------------
      NIVEAU 1 (simple pour niveau 10)
    -------------------------------- */
    {
      id: 1,
      name: "Initiation",
      description: "Petit niveau pour tests.",
      rows: 6, cols: 6,
      difficulty: "easy",
      hasCombat: false,
      hasKeys: false,
      hasObstacles: false,
      start: { row: 0, col: 0 },
      end: { row: 5, col: 5 },
      grid: [
        ["S","C","C","W","C","C"],
        ["W","W","C","W","C","W"],
        ["C","C","C","C","C","C"],
        ["C","W","W","W","W","C"],
        ["C","C","C","C","C","C"],
        ["W","W","W","C","W","E"]
      ],
      enemies: [],
      obstacles: [],
      items: []
    },

    /* -------------------------------
      NIVEAU 2 (clés + combats)
    -------------------------------- */
    {
      id: 2,
      name: "Galerie des gobelins",
      description: "Introduction aux combats et aux clés.",
      rows: 8,
      cols: 8,
      difficulty: "medium",
      hasCombat: true,
      hasKeys: true,
      hasObstacles: false,
      start: { row: 0, col: 0 },
      end: { row: 7, col: 7 },
      grid: [
        ["S","C","C","M:goblin","C","C","W","C"],
        ["W","W","C","W","C","W","C","C"],
        ["C","C","C","C","C","C","C","W"],
        ["C","W","W","W","W","C","C","C"],
        ["C","C","C","K:red","C","W","M:slime","C"],
        ["W","W","C","W","D:red","I:sword","C","C"],
        ["C","C","C","C","C","C","W","C"],
        ["W","W","W","C","W","C","C","E"]
      ],
      enemies: [
        enemiesCatalog.find(e => e.type === "goblin"),
        enemiesCatalog.find(e => e.type === "slime")
      ],
      obstacles: [],
      items: [
        itemsCatalog.find(i => i.id === "key_red"),
        itemsCatalog.find(i => i.id === "sword")
      ]
    },

    /* -------------------------------
      NIVEAU 3 (mix combats + obstacles)
    -------------------------------- */
    {
      id: 3,
      name: "Donjon élémentaire",
      description: "Clés, portes, combats et obstacles.",
      rows: 10,
      cols: 10,
      difficulty: "hard",
      hasCombat: true,
      hasKeys: true,
      hasObstacles: true,
      start: { row: 0, col: 0 },
      end: { row: 9, col: 9 },
      grid: [
        ["S","C","W","K:red","C","M:goblin","C","W","O:fire","C"],
        ["C","W","W","C","D:red","C","C","W","C","C"],
        ["C","C","M:slime","C","C","I:pickaxe","W","C","C","W"],
        ["W","C","W","C","W","C","C","C","M:orc","C"],
        ["C","C","C","C","O:rock","W","C","W","C","C"],
        ["W","W","W","C","C","C","C","W","O:water","C"],
        ["C","C","C","W","C","I:swim_boots","C","W","C","C"],
        ["C","M:slime","C","C","C","C","C","C","C","C"],
        ["C","C","W","C","W","C","C","M:goblin","W","C"],
        ["W","C","C","C","W","C","C","C","W","E"]
      ],
      enemies: enemiesCatalog,
      obstacles: obstaclesCatalog,
      items: itemsCatalog
    },

    /* ------------------------------------------------
      ⭐⭐ NIVEAU 4 : LABYRINTHE TITANESQUE (20×20)
      EXTREME – Pour niveaux 16/18
    ------------------------------------------------- */
    {
      id: 4,
      name: "Labyrinthe Titanesque",
      description: "Un immense labyrinthe rempli d'ennemis, clés, portes et obstacles.",
      rows: 20,
      cols: 20,
      difficulty: "extreme",
      hasCombat: true,
      hasKeys: true,
      hasObstacles: true,
      start: { row: 0, col: 0 },
      end: { row: 19, col: 19 },

      grid: [
        ["S","C","C","W","C","M:goblin","C","C","W","C","C","C","O:rock","C","C","W","C","C","C","C"],
        ["W","W","C","W","C","W","C","W","C","C","W","C","C","W","C","C","C","W","M:slime","C"],
        ["C","C","C","C","C","C","C","C","W","C","C","W","C","C","W","C","W","C","C","C"],
        ["C","W","W","W","W","C","W","C","C","C","W","C","C","W","C","W","C","C","W","C"],
        ["C","C","C","C","O:fire","C","C","W","C","W","C","C","I:pickaxe","C","C","C","C","W","C","C"],
        ["W","W","W","C","C","C","C","W","C","O:water","C","W","C","W","C","W","C","W","C","C"],
        ["C","C","C","W","C","I:swim_boots","C","W","C","C","C","C","C","C","W","C","C","C","C","W"],
        ["C","M:slime","C","C","C","C","C","C","C","W","C","C","W","C","C","C","W","C","C","C"],
        ["C","C","W","C","W","C","C","M:goblin","W","C","C","C","W","C","W","C","C","C","W","C"],
        ["W","C","C","C","W","C","C","C","W","C","C","C","C","W","C","C","W","C","C","C"],
        ["C","W","C","C","C","C","W","C","D:red","W","C","C","M:orc","C","C","C","O:fire","C","W","C"],
        ["C","C","C","W","C","C","W","C","C","C","W","C","C","C","W","C","C","C","C","C"],
        ["C","W","C","C","K:red","C","C","W","C","C","C","W","C","W","C","C","W","C","M:goblin","C"],
        ["C","C","C","W","C","W","C","W","C","W","C","C","C","C","C","W","C","C","C","W"],
        ["W","W","C","C","C","C","C","C","C","C","W","C","O:rock","C","W","C","C","W","C","C"],
        ["C","C","C","W","C","M:slime","C","C","W","C","C","C","C","C","C","C","C","C","W","C"],
        ["C","W","C","W","C","C","W","C","C","W","W","W","C","W","C","W","C","C","C","C"],
        ["C","C","C","C","C","C","C","W","C","C","C","C","C","C","C","W","O:water","C","C","C"],
        ["W","C","W","C","I:water_bucket","C","C","C","C","W","C","W","W","C","C","C","C","C","W","C"],
        ["C","C","C","C","W","C","C","C","C","C","C","C","C","W","C","C","C","W","C","E"]
      ],

      enemies: enemiesCatalog,
      obstacles: obstaclesCatalog,
      items: itemsCatalog
    }

  ];

  /* -------------------------------------------
    ROUTES API
  -------------------------------------------- */

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