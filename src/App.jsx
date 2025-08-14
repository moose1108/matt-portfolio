import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StationRoulette from "./components/StationRoulette";

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/roulette">Station Roulette</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div style={{ padding: 16 }}>Home</div>} />
        <Route path="/roulette" element={<StationRoulette />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
