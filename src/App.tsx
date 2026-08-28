import { useEffect, useState } from "react";
import "./App.css";
import {
  createDefaultRequest,
  initAgari,
  isLoaded,
  scoreHand,
  type ScoreResponse,
} from "./wasm/agari.ts";

export function App() {
  const [ready, setReady] = useState(false);
  const [hand, setHand] = useState("123m456p789s11122z");
  const [result, setResult] = useState<ScoreResponse | null>(null);

  // Initialize WASM once on mount
  useEffect(() => {
    initAgari().then(() => setReady(isLoaded()));
  }, []);

  const handleScore = () => {
    const req = createDefaultRequest(hand);
    req.is_tsumo = true;
    req.is_riichi = true;
    req.winning_tile = "2m";
    req.dora_indicators = ["1m"];
    const res = scoreHand(req);
    setResult(res);
  };

  if (!ready) return <div>Loading scoring engine…</div>;

  return (
    <div>
      <input value={hand} onChange={(e) => setHand(e.target.value)} />
      <button onClick={handleScore}>Score</button>
      {result?.success && result.result && (
        <div>
          <p>Han: {result.result.han} · Fu: {result.result.fu}</p>
          <p>Score: {result.result.payment.total} points</p>
          <p>Level: {result.result.score_level}</p>
          <ul>
            {result.result.yaku.map((y, i) => (
              <li key={i}>{y.name} ({y.han} han)</li>
            ))}
          </ul>
        </div>
      )}
      {result?.error && <p>Error: {result.error}</p>}
    </div>
  );
}
