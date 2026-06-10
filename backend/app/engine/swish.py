from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class Candle:
    open: float
    high: float
    low: float
    close: float


class SwishEngine:
    def __init__(self, lookback: int = 20, compression_pct: float = 30):
        self.lookback = lookback
        self.compression_pct = compression_pct

    def scan(self, candles: List[Dict]) -> List[Dict]:
        typed = [Candle(**c) for c in candles]
        results = []

        for i in range(max(5, self.lookback // 4), len(typed)):
            window = typed[max(0, i - self.lookback): i + 1]
            swish = self._detect_swish(window)
            if swish:
                results.append(swish)

        results.sort(key=lambda x: x["probability"], reverse=True)
        return results[:10]

    def analyze(self, candles: List[Dict]) -> Dict:
        typed = [Candle(**c) for c in candles]
        latest = typed[-1] if typed else None
        if not latest:
            return {"found": False}

        recent = typed[-min(self.lookback, len(typed)):]
        if len(recent) < 5:
            return {"found": False}

        total_range = sum(c.high - c.low for c in recent)
        avg_range = total_range / len(recent)

        compressed = self._is_compressed(recent)
        if not compressed:
            near_master = self._find_near_master_candle(recent)
            if not near_master:
                return {"found": False, "compressed": False}

        return self._build_swish_output(latest, recent, avg_range)

    def _detect_swish(self, candles: List[Candle]) -> Optional[Dict]:
        if len(candles) < 5:
            return None
        recent = candles[-5:]
        master_idx = self._find_master(recent)
        if master_idx is None:
            return None
        master = recent[master_idx]
        inside = [c for c in recent[master_idx + 1:]]
        if len(inside) < 3:
            return None
        if any(c.high > master.high or c.low < master.low for c in inside):
            return None
        last = inside[-1]
        breakout = last.close > master.high or last.close < master.low
        if not breakout:
            return None
        direction = "BULLISH" if last.close > master.high else "BEARISH"
        prob = self._swish_probability(master, inside, direction)
        target, risk = self._target_risk(master, direction, last.close)
        return {
            "index": candles.index(recent[-1]),
            "swish_high": master.high,
            "swish_low": master.low,
            "direction": direction,
            "probability": prob,
            "target": target,
            "risk": risk,
        }

    def _find_master(self, candles: List[Candle]) -> Optional[int]:
        for i in range(len(candles) - 3):
            c = candles[i]
            r = ((c.high - c.low) / (c.high + c.low + 1)) * 200
            if r > self.compression_pct:
                return i
        return None

    def _is_compressed(self, candles: List[Candle]) -> bool:
        if len(candles) < 3:
            return False
        ranges = [c.high - c.low for c in candles[-3:]]
        avg_r = sum(ranges) / len(ranges)
        total_r = max(c.high for c in candles) - min(c.low for c in candles)
        if total_r == 0:
            return False
        return (avg_r / total_r) < 0.4

    def _find_near_master_candle(self, candles: List[Candle]) -> Optional[Candle]:
        for c in candles[-10:]:
            r = ((c.high - c.low) / (c.high + c.low + 1)) * 200
            if r > self.compression_pct:
                return c
        return None

    def _swish_probability(self, master: Candle, inside: List[Candle], direction: str) -> float:
        mr = master.high - master.low
        if mr == 0:
            return 50
        total_inside = sum(c.high - c.low for c in inside)
        compression = 1 - (total_inside / (mr * len(inside)))
        base = 50 + compression * 50
        return round(min(100, max(0, base)), 2)

    def _target_risk(self, master: Candle, direction: str, close: float) -> tuple:
        mr = master.high - master.low
        if direction == "BULLISH":
            target = round(close + mr * 0.618, 2)
            risk = round(master.low, 2)
        else:
            target = round(close - mr * 0.618, 2)
            risk = round(master.high, 2)
        return target, risk

    def _build_swish_output(self, latest: Candle, recent: List[Candle], avg_range: float) -> Dict:
        direction = "BULLISH" if latest.close > latest.open else "BEARISH"
        return {
            "found": True,
            "swish_high": max(c.high for c in recent),
            "swish_low": min(c.low for c in recent),
            "direction": direction,
            "probability": round(65 + (avg_range / (latest.high - latest.low + 1)) * 10, 2),
            "target": round(latest.close + avg_range * 0.618 if direction == "BULLISH" else latest.close - avg_range * 0.618, 2),
            "risk": round(min(c.low for c in recent) if direction == "BULLISH" else max(c.high for c in recent), 2),
        }
