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
  ticks = 150,      // 總跳動次數（越大→越久）
  baseDelay = 10,   // 起始延遲 ms（越小→前段越快）
  grow = 1.17,      // 每跳延遲乘數（>1→漸慢）
  maxDelay = 1000,  // 單跳最大延遲上限
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
    <div className="tech-bg">
      <div className="container">
        <div className="card edge section" style={{ marginTop: 16 }}>
          <div className="badge mono">TRA · Roulette</div>
          <h1 className="h1" style={{ margin: "8px 0 4px" }}>Station Roulette</h1>
          <p className="sub">抽出下一站，然後開地圖看看。</p>

          {/* 中央顯示 */}
          <div style={{ display: "grid", placeItems: "center", height: 140, margin: "12px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ opacity: .35, fontSize: 14, height: 20 }} />
              <div style={{ fontSize: done ? 34 : 30, fontWeight: 800, letterSpacing: .6 }}>
                {done ? `We are going to ${current}` : current}
              </div>
              <div style={{ opacity: .35, fontSize: 14, height: 20 }} />
            </div>
          </div>

          {/* 進度條 */}
          <div className="progress">
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>

          {/* 控制列 */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
            <button className="btn primary" onClick={start} disabled={running}>Start</button>
            <button className="btn" onClick={stop} disabled={!running}>Stop</button>
            <button className="btn" onClick={reset} disabled={running}>Reset</button>
            {done && (
              <a className="btn glow" href={mapsUrl} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
