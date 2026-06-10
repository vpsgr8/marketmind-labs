from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class Candle:
    open: float
    high: float
    low: float
    close: float


class MasterCandleEngine:
    def __init__(self, threshold_pct: float = 1.5):
        self.threshold_pct = threshold_pct

    def detect(self, candles: List[Dict]) -> Dict:
        if len(candles) < 5:
            return {"found": False, "error": "Need at least 5 candles"}

        typed = [Candle(**c) for c in candles]
        master_idx = self._find_master_candle(typed)

        if master_idx is None or master_idx + 4 >= len(typed):
            return {"found": False, "error": "No master candle found"}

        master = typed[master_idx]
        inside_candles = typed[master_idx + 1: master_idx + 5]

        inside_check = self._check_inside_candles(master, inside_candles)
        if not inside_check:
            return {
                "found": True,
                "master_candle": master_idx,
                "master_high": master.high,
                "master_low": master.low,
                "inside_complete": False,
                "breakout": None,
                "swish_signal": None,
                "swish_probability": 0,
            }

        breakout = self._detect_breakout(inside_candles[-1], master)
        swish = self._swish_signal(inside_candles, master, breakout)

        return {
            "found": True,
            "master_candle": master_idx,
            "master_open": master.open,
            "master_high": master.high,
            "master_low": master.low,
            "master_close": master.close,
            "master_range": round(master.high - master.low, 2),
            "inside_complete": True,
            "inside_count": len(inside_candles),
            "breakout": breakout,
            "swish_signal": swish.get("signal"),
            "swish_probability": swish.get("probability"),
            "target": swish.get("target"),
            "risk": swish.get("risk"),
        }

    def _find_master_candle(self, candles: List[Candle]) -> Optional[int]:
        for i in range(len(candles) - 4):
            c = candles[i]
            range_pct = ((c.high - c.low) / ((c.high + c.low) / 2)) * 100
            if range_pct >= self.threshold_pct:
                return i
        return None

    def _check_inside_candles(self, master: Candle, inside: List[Candle]) -> bool:
        for c in inside:
            if c.high > master.high or c.low < master.low:
                return False
        return True

    def _detect_breakout(self, last_inside: Candle, master: Candle) -> Optional[Dict]:
        above = last_inside.close > master.high
        below = last_inside.close < master.low
        if above:
            return {
                "direction": "BULLISH",
                "price": last_inside.close,
                "breakout_level": master.high,
            }
        elif below:
            return {
                "direction": "BEARISH",
                "price": last_inside.close,
                "breakout_level": master.low,
            }
        return None

    def _swish_signal(self, inside: List[Candle], master: Candle, breakout: Optional[Dict]) -> Dict:
        if not breakout:
            return {"signal": None, "probability": 0, "target": None, "risk": None}

        master_range = master.high - master.low
        if master_range == 0:
            return {"signal": None, "probability": 0, "target": None, "risk": None}

        inside_compression = sum(
            (c.high - c.low) for c in inside
        ) / (master_range * len(inside))
        confidence = max(0, min(100, (1 - inside_compression) * 100))

        if breakout["direction"] == "BULLISH":
            target = round(master.high + master_range * 0.618, 2)
            risk = round(master.low, 2)
        else:
            target = round(master.low - master_range * 0.618, 2)
            risk = round(master.high, 2)

        return {
            "signal": "SWISH_" + breakout["direction"],
            "probability": round(confidence, 2),
            "target": target,
            "risk": risk,
        }
