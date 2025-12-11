import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home: React.FC = () => {
  const [pseudo, setPseudo] = useState<string>("");
  const [storedPseudo, setStoredPseudo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const existing = localStorage.getItem("pseudo");
    if (existing) setStoredPseudo(existing);
  }, []);

  const handleStart = (value: number) => {
    // envoie le pseudo dans l'état lors de la navigation
    navigate("/app", { state: { value, pseudo: storedPseudo || pseudo } });
  };

  const savePseudo = () => {
    const trimmed = pseudo.trim();
    if (!trimmed) return;
    localStorage.setItem("pseudo", trimmed);
    setStoredPseudo(trimmed);
  };

  const clearPseudo = () => {
    localStorage.removeItem("pseudo");
    setStoredPseudo(null);
    setPseudo("");
  };

  return (
    <div className="home-root">
      {/* Si pas de pseudo stocké, on affiche un prompt central */}
      {!storedPseudo && (
        <div className="prompt-card">
          <h2>Bienvenue — entrez votre pseudo</h2>
          <input
            className="prompt-input"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Votre pseudo..."
            onKeyDown={(e) => {
              if (e.key === "Enter") savePseudo();
            }}
          />
          <div className="prompt-actions">
            <button onClick={savePseudo} className="btn btn-primary">
              Valider
            </button>
          </div>
        </div>
      )}

      {/* Si pseudo présent, on montre les boutons de navigation */}
      {storedPseudo && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <h2 className="greeting-title" style={{ margin: 0 }}>Bonjour, {storedPseudo} !</h2>
            <button onClick={clearPseudo} className="btn btn-ghost" style={{ marginTop: 8 }}>
              Changer de pseudo
            </button>
          </div>

          <div className="nav-buttons">
            <button onClick={() => handleStart(1)} className="btn btn-primary">
              Chasse au trésor 1
            </button>
            <button onClick={() => handleStart(2)} className="btn btn-primary">
              Chasse au trésor 2
            </button>
            <button onClick={() => handleStart(3)} className="btn btn-primary">
              Chasse au trésor 3
            </button>
            <button onClick={() => handleStart(4)} className="btn btn-primary">
              Chasse au trésor 4
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
