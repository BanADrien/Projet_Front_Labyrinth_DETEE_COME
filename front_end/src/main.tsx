import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Home from "./home"; // <-- page d'accueil

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />   {/* Page d'accueil */}
        <Route path="/app" element={<App />} /> {/* Page App */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
