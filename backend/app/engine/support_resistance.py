from typing import Dict, List, Tuple
from dataclasses import dataclass
import statistics


@dataclass
class Candle:
    open: float
    high: float
    low: float
    close: float


class SupportResistanceEngine:
    def __init__(self, lookback: int = 50, cluster_pct: float = 0.3):
        self.lookback = lookback
        self.cluster_pct = cluster_pct

    def calculate(self, candles: List[Dict]) -> Dict:
        typed = [Candle(**c) for c in candles]
        if len(typed) < 10:
            return {"error": "Need at least 10 candles"}

        typed = typed[-min(self.lookback, len(typed)):]
        levels = self._find_levels(typed)
        pivots = self._find_pivot_points(typed)

        current_price = typed[-1].close
        s1, s2, r1, r2 = self._nearest_levels(levels + pivots, current_price)

        return {
            "immediate_support": s1,
            "major_support": s2,
            "immediate_resistance": r1,
            "major_resistance": r2,
            "pivot_points": {
                "pivot": pivots[0] if pivots else None,
                "s1": pivots[1] if len(pivots) > 1 else None,
                "s2": pivots[2] if len(pivots) > 2 else None,
                "r1": pivots[3] if len(pivots) > 3 else None,
                "r2": pivots[4] if len(pivots) > 4 else None,
            },
            "current_price": current_price,
            "range_high": max(c.high for c in typed),
            "range_low": min(c.low for c in typed),
        }

    def _find_levels(self, candles: List[Candle]) -> List[float]:
        levels = []
        for c in candles:
            levels.append(c.high)
            levels.append(c.low)
        return self._cluster_levels(levels)

    def _cluster_levels(self, levels: List[float]) -> List[float]:
        if not levels:
            return []
        sorted_l = sorted(levels)
        clustered = []
        i = 0
        while i < len(sorted_l):
            group = [sorted_l[i]]
            j = i + 1
            while j < len(sorted_l) and (sorted_l[j] - sorted_l[i]) / (sorted_l[i] + 1) * 100 < self.cluster_pct:
                group.append(sorted_l[j])
                j += 1
            clustered.append(round(statistics.median(group), 2))
            i = j
        return clustered

    def _find_pivot_points(self, candles: List[Candle]) -> List[float]:
        if len(candles) < 3:
            return []
        pivots = []
        for i in range(1, len(candles) - 1):
            prev, curr, next_c = candles[i - 1], candles[i], candles[i + 1]
            if curr.high > prev.high and curr.high > next_c.high:
                pivots.append(curr.high)
            if curr.low < prev.low and curr.low < next_c.low:
                pivots.append(curr.low)
        return self._cluster_levels(pivots)

    def _nearest_levels(self, levels: List[float], price: float) -> Tuple[float, float, float, float]:
        below = sorted([l for l in levels if l < price], reverse=True)
        above = sorted([l for l in levels if l > price])

        s1 = below[0] if len(below) >= 1 else None
        s2 = below[1] if len(below) >= 2 else below[0] if below else None
        r1 = above[0] if len(above) >= 1 else None
        r2 = above[1] if len(above) >= 2 else above[0] if above else None

        return s1, s2, r1, r2
