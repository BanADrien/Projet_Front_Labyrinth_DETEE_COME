import React from "react";
import { useNavigate } from "react-router-dom";

interface NavButtonProps {
  value: number;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ value, label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/app", { state: { value } });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "20px 40px",
        fontSize: "1.5rem",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "white",
        margin: "0 10px",
      }}
    >
      {label}
    </button>
  );
};

const Home: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      {/* Plusieurs boutons avec des valeurs différentes */}
      <NavButton value={1} label="Labyrinthe 1" />
      <NavButton value={2} label="Labyrinthe 2" />
      <NavButton value={3} label="Labyrinthe 3" />
      <NavButton value={4} label="Labyrinthe 4" />
    </div>
  );
};

export default Home;
