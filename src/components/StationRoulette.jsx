// src/pages/StationRouletteLite.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import stationsRaw from "../data/stations.json";

// 標準化站名：台→臺、去空白與括號
function normalizeName(name) {
  return String(name)
    .replace(/台/g, "臺")
    .replace(/\s+/g, "")
    .replace(/（.*?）|\(.*?\)/g, "");
}
const stations = Array.from(new Set(stationsRaw.map(normalizeName).filter(Boolean)));

function useRoulette(list, {
  ticks = 140,       // 總跳動次數（越大→越久）
  baseDelay = 12,    // 起始延遲 ms（越小→前段越快）
  grow = 1.16,       // 每跳延遲乘數（>1→漸慢），1.14~1.18 手感好
  maxDelay = 1000,   // 單跳最大延遲上限
} = {}) {
  const [current, setCurrent] = useState("Press Start to begin");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [finalTarget, setFinalTarget] = useState(null);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // 預先算好每一跳的延遲（漸慢）
  const delays = useMemo(() => {
    const arr = [];
    let d = baseDelay;
    for (let i = 0; i < ticks; i++) {
      arr.push(Math.min(d, maxDelay));
      d *= grow;
    }
    return arr;
  }, [ticks, baseDelay, grow, maxDelay]);

  // 產一副「轉盤序列」，最後一格鎖定目標
  const deck = useMemo(() => {
    if (!finalTarget) return [];
    const bag = [...list].sort(() => Math.random() - 0.5);
    if (!bag.includes(finalTarget)) bag[0] = finalTarget;
    while (bag.length < ticks) bag.push(...[...list].sort(() => Math.random() - 0.5));
    bag[ticks - 1] = finalTarget;
    return bag.slice(0, ticks);
  }, [list, ticks, finalTarget]);

  const start = () => {
    if (running) return;
    setFinalTarget(list[Math.floor(Math.random() * list.length)]);
    setIndex(0);
    setCurrent("…");
    setDone(false);
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const reset = () => {
    stop();
    setIndex(0);
    setCurrent("Press Start to begin");
    setDone(false);
    setFinalTarget(null);
  };

  useEffect(() => {
    if (!running || !finalTarget || deck.length === 0) return;
    const tick = () => {
      setCurrent(deck[index]);
      const next = index + 1;
      if (next >= deck.length) {
        setRunning(false);
        setDone(true);
        return;
      }
      setIndex(next);
      timerRef.current = setTimeout(tick, delays[next]);
    };
    timerRef.current = setTimeout(tick, delays[0]);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [running, finalTarget, deck, delays, index]);

  const progress = Math.min(1, (index + (done ? 1 : 0)) / ticks);
  return { current, done, running, progress, start, stop, reset };
}

export default function StationRouletteLite() {
  const { current, done, running, progress, start, stop, reset } =
    useRoulette(stations, { ticks: 150, baseDelay: 10, grow: 1.17 });

  const mapsUrl = useMemo(() => {
    if (!done) return null;
    const q = encodeURIComponent(`${current} 車站, 台灣`);
    return `https://www.google.com/maps?q=${q}`;
  }, [done, current]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", margin: "16px 0" }}>TRA Station Roulette</h1>

      {/* 「拉霸」視覺：上一個/當前/下一個 */}
      <div style={{ display: "grid", placeItems: "center", height: 140, marginBottom: 8 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ opacity: 0.35, fontSize: 18, height: 24 }}>{running ? "…" : ""}</div>
          <div style={{ fontSize: done ? 34 : 30, fontWeight: 700, letterSpacing: 0.5 }}>
            {done ? `We are going to ${current}` : current}
          </div>
          <div style={{ opacity: 0.35, fontSize: 18, height: 24 }}>{running ? "…" : ""}</div>
        </div>
      </div>

      {/* 進度條 */}
      <div style={{ height: 8, background: "#eee", borderRadius: 6, overflow: "hidden", margin: "8px 0 16px" }}>
        <div style={{ height: "100%", width: `${Math.round(progress * 100)}%`, background: "#4caf50" }} />
      </div>

      {/* 控制區 */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        <button onClick={start} disabled={running} style={{ padding: "8px 12px" }}>Start</button>
        <button onClick={stop} disabled={!running} style={{ padding: "8px 12px" }}>Stop</button>
        <button onClick={reset} disabled={running} style={{ padding: "8px 12px" }}>Reset</button>
        {done && (
          <a
            href={mapsUrl}
            target="_blank" rel="noreferrer"
            style={{ padding: "8px 12px", background: "#1a73e8", color: "#fff", borderRadius: 6, textDecoration: "none" }}
            title="在 Google Maps 開啟"
          >
            Open in Google Maps
          </a>
        )}
      </div>

      {/* 可選：把全部站名做成雲圖，抽中者加亮 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: 6, paddingTop: 8, color: "#666"
      }}>
        {stations.slice(0, 240).map((s) => (
          <div key={s}
            style={{
              padding: "6px 8px",
              borderRadius: 8,
              background: s === current ? "rgba(76,175,80,0.12)" : "transparent",
              fontWeight: s === current ? 700 : 400,
              color: s === current ? "#2e7d32" : "#666",
              textAlign: "center",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
