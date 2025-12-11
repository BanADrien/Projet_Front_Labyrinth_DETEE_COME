import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Home from "./Home"; // <-- page d'accueil
import Score from "./Score"; // <-- page scores
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />   {/* Page d'accueil */}
        <Route path="/app" element={<App />} /> {/* Page App */}
        <Route path="/scores" element={<Score />} /> {/* Page Scores */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
