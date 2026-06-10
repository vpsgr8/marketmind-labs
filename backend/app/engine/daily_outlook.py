from typing import Dict, List, Optional
from datetime import datetime


class DailyOutlookEngine:
    def __init__(self):
        self.risk_levels = ["LOW", "MODERATE", "HIGH", "EXTREME"]

    def generate(self, candles: List[Dict], market: str = "NIFTY") -> Dict:
        if not candles:
            return self._default_outlook(market)

        last = candles[-1]
        prev = candles[-2] if len(candles) >= 2 else last

        o, h, l, c = last["open"], last["high"], last["low"], last["close"]
        prev_c = prev["close"]

        direction, prob = self._direction_and_prob(o, h, l, c, prev_c)
        expected_range = self._expected_range(candles)
        risk = self._risk_level(h, l, c)

        from app.engine.probability import ProbabilityEngine
        pe = ProbabilityEngine()
        prob_data = pe.calculate(o, h, l, c)

        return {
            "market": market,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "direction": direction,
            "probability": prob,
            "bullish_probability": prob_data["bull_probability"],
            "bearish_probability": prob_data["bear_probability"],
            "sideways_probability": prob_data["sideways_probability"],
            "expected_range": expected_range,
            "risk_level": risk,
            "open": o,
            "high": h,
            "low": l,
            "close": c,
            "signal": prob_data["signal"],
            "confidence_score": prob_data["confidence_score"],
            "key_levels": self._key_levels(o, h, l, c),
            "suggested_strategy": self._suggested_strategy(direction, risk, prob),
        }

    def _direction_and_prob(self, o: float, h: float, l: float, c: float, prev_c: float) -> tuple:
        bullish = c > o and c > prev_c and (h - l) > 0
        bearish = c < o and c < prev_c and (h - l) > 0
        if bullish:
            strength = min(100, ((c - o) / (h - l)) * 100 + 50)
            return "BULLISH", round(strength, 1)
        elif bearish:
            strength = min(100, ((o - c) / (h - l)) * 100 + 50)
            return "BEARISH", round(strength, 1)
        else:
            body = abs(c - o)
            range_p = h - l
            if range_p > 0:
                strength = 50 + (body / range_p) * 20
            else:
                strength = 50
            return "SIDEWAYS", round(strength, 1)

    def _expected_range(self, candles: List[Dict]) -> Dict:
        ranges = [c["high"] - c["low"] for c in candles[-10:]]
        if not ranges:
            return {"min": 0, "max": 0, "average": 0}
        avg = sum(ranges) / len(ranges)
        return {
            "min": round(avg * 0.7, 2),
            "max": round(avg * 1.3, 2),
            "average": round(avg, 2),
        }

    def _risk_level(self, h: float, l: float, c: float) -> str:
        range_p = h - l
        avg = (h + l + c) / 3
        if avg == 0:
            return "MODERATE"
        vol_pct = (range_p / avg) * 100
        if vol_pct > 2.0:
            return "EXTREME"
        elif vol_pct > 1.2:
            return "HIGH"
        elif vol_pct > 0.6:
            return "MODERATE"
        return "LOW"

    def _key_levels(self, o: float, h: float, l: float, c: float) -> Dict:
        return {
            "pivot": round((h + l + c) / 3, 2),
            "resistance_1": round(2 * ((h + l + c) / 3) - l, 2),
            "support_1": round(2 * ((h + l + c) / 3) - h, 2),
            "resistance_2": round((h + l + c) / 3 + (h - l), 2),
            "support_2": round((h + l + c) / 3 - (h - l), 2),
        }

    def _suggested_strategy(self, direction: str, risk: str, prob: float) -> str:
        if risk == "EXTREME":
            return "Avoid trading. Wait for better setup."
        if direction == "BULLISH" and prob > 70:
            return "Consider buying on dips. Look for call options."
        elif direction == "BEARISH" and prob > 70:
            return "Consider selling on rallies. Look for put options."
        elif direction == "SIDEWAYS":
            return "Range-bound market. Consider strangle strategies."
        return "Wait for confirmation. Maintain cash."

    def _default_outlook(self, market: str) -> Dict:
        return {
            "market": market,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "direction": "NEUTRAL",
            "probability": 50,
            "bullish_probability": 50,
            "bearish_probability": 50,
            "sideways_probability": 50,
            "expected_range": {"min": 0, "max": 0, "average": 0},
            "risk_level": "MODERATE",
            "open": 0,
            "high": 0,
            "low": 0,
            "close": 0,
            "signal": "NEUTRAL",
            "confidence_score": 0,
            "key_levels": {},
            "suggested_strategy": "Insufficient data.",
        }
