import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const levels = [
    { id: 1, label: "Labyrinthe 1" },
    { id: 2, label: "Labyrinthe 2" },
    { id: 3, label: "Labyrinthe 3" },
    { id: 4, label: "Labyrinthe 4" },
  ];

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" }}>
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => navigate("/app", { state: { value: level.id } })}
          style={{ padding: "20px 40px", fontSize: "1.5rem", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", margin: "0 10px" }}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
};

export default Home;
