import { useEffect, useMemo, useRef, useState } from "react";
import traRaw from "../data/stations.json";
import mrtRaw from "../data/MRT.json";

const SEGMENTS = 12;
const SPIN_MS = 4800;

function normalizeName(name) {
  return String(name)
    .replace(/台/g, "臺")
    .replace(/\s+/g, "")
    .replace(/（.*?）|\(.*?\)/g, "")
    .replace(/[A-Za-z].*$/, "")
    .trim();
}

function uniqueStations(raw) {
  return Array.from(new Set(raw.map(normalizeName).filter(Boolean)));
}

const DATASETS = {
  tra: {
    id: "tra",
    label: "台鐵",
    hint: "全台鐵路車站",
    mapsSuffix: "車站, 台灣",
    stations: uniqueStations(traRaw),
  },
  mrt: {
    id: "mrt",
    label: "捷運",
    hint: "台北捷運車站",
    mapsSuffix: "捷運站, 台北",
    stations: uniqueStations(mrtRaw),
  },
};

function pickWheelLabels(stations, count) {
  const winner = stations[Math.floor(Math.random() * stations.length)];
  const pool = stations.filter((s) => s !== winner);
  const others = [];
  const bag = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < count - 1 && i < bag.length; i++) others.push(bag[i]);

  while (others.length < count - 1) {
    others.push(bag[others.length % bag.length] || winner);
  }

  const winnerIndex = Math.floor(Math.random() * count);
  const labels = [...others];
  labels.splice(winnerIndex, 0, winner);
  return { labels: labels.slice(0, count), winner, winnerIndex };
}

function shortLabel(name) {
  if (name.length <= 5) return name;
  return `${name.slice(0, 4)}…`;
}

export default function StationRoulette() {
  const [mode, setMode] = useState("tra");
  const [labels, setLabels] = useState(() =>
    Array.from({ length: SEGMENTS }, (_, i) => DATASETS.tra.stations[i] || "—")
  );
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const spinTimer = useRef(null);
  const rotationRef = useRef(0);

  const dataset = DATASETS[mode];
  const slice = 360 / SEGMENTS;

  const wheelColors = useMemo(() => {
    const a = mode === "tra" ? "#0f6e6a" : "#1f4f8a";
    const b = mode === "tra" ? "#d4c4a8" : "#c5d4e8";
    const c = mode === "tra" ? "#f8fafb" : "#eef3f8";
    return Array.from({ length: SEGMENTS }, (_, i) => {
      if (i % 3 === 0) return a;
      if (i % 3 === 1) return b;
      return c;
    });
  }, [mode]);

  const conic = useMemo(() => {
    const parts = wheelColors.map((color, i) => {
      const start = i * slice;
      const end = (i + 1) * slice;
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from ${-slice / 2}deg, ${parts.join(", ")})`;
  }, [wheelColors, slice]);

  useEffect(() => () => {
    if (spinTimer.current) clearTimeout(spinTimer.current);
  }, []);

  const switchMode = (next) => {
    if (spinning || next === mode) return;
    setMode(next);
    setResult(null);
    const preview = DATASETS[next].stations.slice(0, SEGMENTS);
    setLabels(preview.length === SEGMENTS ? preview : [
      ...preview,
      ...Array.from({ length: SEGMENTS - preview.length }, () => "—"),
    ]);
  };

  const spin = () => {
    if (spinning || dataset.stations.length < 2) return;

    const { labels: nextLabels, winner, winnerIndex } = pickWheelLabels(
      dataset.stations,
      SEGMENTS
    );
    setLabels(nextLabels);
    setResult(null);
    setSpinning(true);

    const current = rotationRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    // Segment i is centered at i * slice (conic starts at -slice/2)
    const targetMod = (360 - ((winnerIndex * slice) % 360)) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const nextRotation = current + delta + 360 * 5;

    // Force style flush so transition always runs even if labels change
    requestAnimationFrame(() => {
      rotationRef.current = nextRotation;
      setRotation(nextRotation);
    });

    spinTimer.current = setTimeout(() => {
      setSpinning(false);
      setResult(winner);
    }, SPIN_MS);
  };

  const reset = () => {
    if (spinning) return;
    setResult(null);
    const preview = dataset.stations.slice(0, SEGMENTS);
    setLabels(preview);
  };

  const mapsUrl = result
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${result} ${dataset.mapsSuffix}`)}`
    : null;

  return (
    <div className="tech-bg">
      <div className="container wheel-page">
        <div className="wheel-intro">
          <div className="badge">{mode === "tra" ? "TRA" : "MRT"} · Roulette</div>
          <h1 className="h1-sm">車站轉盤</h1>
          <p className="sub">選台鐵或捷運，轉出下一站再去探險。</p>

          <div className="mode-switch" role="tablist" aria-label="車站系統">
            {Object.values(DATASETS).map((d) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={mode === d.id}
                className={`mode-btn ${mode === d.id ? "active" : ""}`}
                onClick={() => switchMode(d.id)}
                disabled={spinning}
              >
                <span className="mode-btn-label">{d.label}</span>
                <span className="mode-btn-hint">{d.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`wheel-stage ${mode}`}>
          <div className="wheel-pointer" aria-hidden="true" />
          <div
            className={`wheel ${spinning ? "is-spinning" : ""}`}
            style={{
              background: conic,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.08, 1)`
                : "none",
            }}
          >
            {labels.map((name, i) => {
              const angle = i * slice;
              const dark = i % 3 === 0;
              return (
                <div
                  key={`${name}-${i}`}
                  className={`wheel-slice-label ${dark ? "on-dark" : ""}`}
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span>{shortLabel(name)}</span>
                </div>
              );
            })}
            <div className="wheel-ring" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="wheel-hub"
            onClick={spin}
            disabled={spinning}
            aria-label="開始轉動"
          >
            {spinning ? "…" : "轉"}
          </button>
        </div>

        <div className="wheel-result" aria-live="polite">
          {spinning && <p className="sub">轉盤轉動中…</p>}
          {!spinning && !result && (
            <p className="sub">按中間的「轉」抽出下一站</p>
          )}
          {!spinning && result && (
            <>
              <p className="mono">下一站</p>
              <p className="wheel-winner">{result}</p>
            </>
          )}
        </div>

        <div className="wheel-actions">
          <button className="btn primary" onClick={spin} disabled={spinning}>
            {spinning ? "轉動中" : "再轉一次"}
          </button>
          <button className="btn" onClick={reset} disabled={spinning}>
            Reset
          </button>
          {result && mapsUrl && (
            <a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
