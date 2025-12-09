import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const goToApp = () => {
    navigate("/app");
  };

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
      <button
        onClick={goToApp}
        style={{
          padding: "20px 40px",
          fontSize: "1.5rem",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
        }}
      >
        Entrer dans l'application
      </button>
    </div>
  );
};

export default Home;
