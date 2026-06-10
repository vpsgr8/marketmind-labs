import math
from datetime import datetime, timedelta
from typing import Dict, List


class GannSquareOf9:
    def __init__(self):
        self.levels = [45, 90, 180, 270, 360]

    def calculate(self, price: float) -> Dict:
        result = {}
        for level in self.levels:
            rad = math.radians(level)
            increment = price * (math.sqrt(2) - 1) * (level / 360)
            result[f"{level}deg"] = round(price + increment, 2)
            result[f"{level}deg_support"] = round(price - increment, 2)
        return {
            "price": price,
            "levels": result,
            "cardinal_points": self._cardinal_points(price),
            "ordinal_points": self._ordinal_points(price),
        }

    def _cardinal_points(self, price):
        base = math.isqrt(int(price))
        if base % 2 == 0:
            base -= 1
        center = base ** 2
        next_center = (base + 2) ** 2
        step = (next_center - center) / 8
        return {
            "0deg": round(center, 2),
            "90deg": round(center + 2 * step, 2),
            "180deg": round(center + 4 * step, 2),
            "270deg": round(center + 6 * step, 2),
        }

    def _ordinal_points(self, price):
        base = math.isqrt(int(price))
        if base % 2 == 0:
            base -= 1
        center = base ** 2
        next_center = (base + 2) ** 2
        step = (next_center - center) / 8
        return {
            "45deg": round(center + 1 * step, 2),
            "135deg": round(center + 3 * step, 2),
            "225deg": round(center + 5 * step, 2),
            "315deg": round(center + 7 * step, 2),
        }


class GannTimeCycle:
    def __init__(self):
        self.cycles = [30, 45, 60, 90, 180, 360]

    def calculate(self, swing_high_date: str, swing_low_date: str) -> Dict:
        fmt = "%Y-%m-%d"
        high_date = datetime.strptime(swing_high_date, fmt)
        low_date = datetime.strptime(swing_low_date, fmt)

        diff = abs((high_date - low_date).days)
        result = {"swing_days": diff, "cycles": {}}

        for cycle in self.cycles:
            next_date = max(high_date, low_date) + timedelta(days=cycle)
            result["cycles"][f"{cycle}_days"] = next_date.strftime(fmt)

        result["current_cycle_degree"] = (diff % 360) if diff > 0 else 0
        result["harmonic_levels"] = self._harmonic_levels(diff)

        return result

    def _harmonic_levels(self, days):
        return {
            "0.236": round(days * 0.236, 1),
            "0.382": round(days * 0.382, 1),
            "0.5": round(days * 0.5, 1),
            "0.618": round(days * 0.618, 1),
            "0.786": round(days * 0.786, 1),
            "1.272": round(days * 1.272, 1),
            "1.618": round(days * 1.618, 1),
        }


class GannEngine:
    def __init__(self):
        self.square_of_9 = GannSquareOf9()
        self.time_cycle = GannTimeCycle()

    def square_of_9(self, price: float) -> Dict:
        return self.square_of_9.calculate(price)

    def time_cycle_calc(self, high_date: str, low_date: str) -> Dict:
        return self.time_cycle.calculate(high_date, low_date)
