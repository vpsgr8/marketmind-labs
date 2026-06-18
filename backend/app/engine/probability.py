import math
from typing import Dict, Tuple


class ProbabilityEngine:
    def __init__(self):
        self.weights = {
            "candle_strength": 0.30,
            "bull_force": 0.20,
            "momentum": 0.20,
            "trend": 0.15,
            "volatility": 0.10,
            "gann": 0.05,
        }

    def calculate(self, open_p: float, high: float, low: float, close: float) -> Dict:
        candle_strength = self._candle_strength(open_p, high, low, close)
        bull_force = self._bull_force(open_p, high, low, close)
        bear_force = self._bear_force(open_p, high, low, close)
        momentum = self._momentum(open_p, high, low, close)
        trend = self._trend(open_p, high, low, close)
        volatility = self._volatility(open_p, high, low, close)
        gann = self._gann_factor(high, low)

        # Raw directional bias, 0-100 (50 = perfectly balanced)
        bull_score = (
            self.weights["candle_strength"] * candle_strength
            + self.weights["bull_force"] * bull_force
            + self.weights["momentum"] * momentum
            + self.weights["trend"] * trend
            + self.weights["volatility"] * volatility
            + self.weights["gann"] * gann
        )
        bull_score = min(100, max(0, bull_score))

        # Bull, bear and sideways are mutually exclusive outcomes and MUST sum to 100.
        # Sideways grows when the bias is near neutral and the candle body is small.
        total_range = high - low
        body_ratio = abs(close - open_p) / total_range if total_range > 0 else 0
        neutrality = max(0.0, 1 - abs(bull_score - 50) / 50)
        sideways_prob = round(neutrality * (1 - body_ratio) * 40, 2)

        directional = 100 - sideways_prob
        bull_prob = round(directional * (bull_score / 100), 2)
        bear_prob = round(100 - sideways_prob - bull_prob, 2)

        confidence = min(100, 50 + abs(bull_score - 50) + volatility * 0.3)

        signal = self._get_signal(bull_score)

        return {
            "bull_probability": bull_prob,
            "bear_probability": bear_prob,
            "sideways_probability": sideways_prob,
            "confidence_score": round(confidence, 2),
            "signal": signal,
            "components": {
                "candle_strength": round(candle_strength, 2),
                "bull_force": round(bull_force, 2),
                "bear_force": round(bear_force, 2),
                "momentum": round(momentum, 2),
                "trend": round(trend, 2),
                "volatility": round(volatility, 2),
                "gann": round(gann, 2),
            },
        }

    def _candle_strength(self, o, h, l, c):
        body = abs(c - o)
        wick_top = h - max(o, c)
        wick_bottom = min(o, c) - l
        total_range = h - l
        if total_range == 0:
            return 50
        body_ratio = body / total_range
        bullish = c > o
        strength = body_ratio * 100
        return strength * (1 if bullish else 0.6)

    def _bull_force(self, o, h, l, c):
        range_p = h - l
        if range_p == 0:
            return 50
        upper_wick = h - max(o, c)
        lower_wick = min(o, c) - l
        close_position = (c - l) / range_p * 100
        force = close_position * 0.6 + (100 - (upper_wick / range_p * 100)) * 0.4
        return min(100, max(0, force))

    def _bear_force(self, o, h, l, c):
        range_p = h - l
        if range_p == 0:
            return 50
        upper_wick = h - max(o, c)
        lower_wick = min(o, c) - l
        bear_position = (h - c) / range_p * 100
        force = bear_position * 0.6 + (100 - (lower_wick / range_p * 100)) * 0.4
        return min(100, max(0, force))

    def _momentum(self, o, h, l, c):
        body = c - o
        range_p = h - l
        if range_p == 0:
            return 50
        momentum_val = (body / range_p) * 100
        normalized = 50 + momentum_val * 0.5
        return min(100, max(0, normalized))

    def _trend(self, o, h, l, c):
        position = (c - l) / (h - l) * 100 if (h - l) > 0 else 50
        return min(100, max(0, position))

    def _volatility(self, o, h, l, c):
        range_p = h - l
        avg = (o + h + l + c) / 4
        if avg == 0:
            return 50
        vol_pct = (range_p / avg) * 100
        return min(100, vol_pct * 10)

    def _gann_factor(self, h, l):
        range_p = h - l
        gann_level = (h + l) / 2
        proximity = abs(range_p) / (gann_level + 1) * 100
        return min(100, proximity * 50)

    def _get_signal(self, score: float) -> str:
        if score <= 40:
            return "SELL"
        elif score <= 60:
            return "NEUTRAL"
        elif score <= 80:
            return "BUY"
        else:
            return "STRONG_BUY"
