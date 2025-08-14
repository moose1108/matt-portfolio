// src/App.jsx
import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import StationRoulette from "./components/StationRoulette";
import "./theme.css"; // 科技感主題（若你已在別處引入，可刪這行）

function Home() {
  return (
    <main className="container">
      <div className="grid grid-2">
        {/* Left: Intro */}
        <section className="card edge section">
          <div className="badge mono">v{new Date().getFullYear()}</div>
          <h1 className="h1" style={{ marginTop: 8 }}>Hi, I'm Matt</h1>
          <p className="sub">
            Incoming M.S. in Electrical & Computer Engineering at UC San Diego ·
            B.S. in Computer Science & Atmospheric Science minor from NTU
          </p>
          <p style={{ marginTop: 12 }}>
            I build AI-driven systems at the intersection of <strong>climate science</strong>, 
            <strong> user experience</strong>, and <strong>machine learning</strong>.
          </p>
        </section>

        {/* Right: Highlights */}
        <section className="card edge section">
          <h2 style={{ margin: "0 0 8px" }}>Recent Work</h2>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>
              <strong>Regional Climate Downscaling</strong> 
            </li>
            <li>
              <strong>Generative AI Weather BOT</strong> 
            </li>
            <li>
              <strong>Trustworthy AI Research</strong> 
            </li>
          </ul>
          <div style={{ display: "flex", gap: 10 }}>
            {/* <Link className="btn primary glow" to="/roulette">
              Try Station Roulette
            </Link> */}
            <a className="btn" href="mailto:moosethegrad@gmail.com">Contact</a>
          </div>
        </section>
      </div>
    </main>
  );
}


export default function App() {
  return (
    <div className="tech-bg">
      <HashRouter>
        <header className="container">
          <div
            className="card edge"
            style={{
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="h1" style={{ fontSize: 22 }}>
              Matt<span style={{ color: "var(--primary)" }}>.</span>Portfolio
            </div>
            <nav style={{ display: "flex", gap: 10 }}>
              <Link className="btn" to="/">Home</Link>
              <Link className="btn" to="/roulette">Roulette</Link>
              <a
                className="btn"
                href="https://www.instagram.com/moose_the_guide/"
                target="_blank"
                rel="noreferrer"
              >
                IG
              </a>
            </nav>
          </div>
        </header>

        {/* 路由切換 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roulette" element={<StationRoulette />} />
        </Routes>

        <footer className="container">
          <div
            className="card edge section"
            style={{ textAlign: "center", color: "var(--muted)" }}
          >
            © {new Date().getFullYear()} Matt Tsai · Made with{" "}
            <span style={{ color: "var(--primary)" }}>React</span>
          </div>
        </footer>
      </HashRouter>
    </div>
  );
}
