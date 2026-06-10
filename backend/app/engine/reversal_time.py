from typing import Dict, List
from datetime import datetime, time


class ReversalTimeEngine:
    def __init__(self):
        self.times = [
            "09:15", "10:18", "11:42",
            "13:18", "14:24", "15:06",
        ]
        self.market_open = time(9, 15)
        self.market_close = time(15, 30)

    def calculate(self, reference_price: float = None, trend: str = "neutral") -> Dict:
        now = datetime.now().time()
        current_index = self._current_time_index(now)

        return {
            "market_open": "09:15",
            "market_close": "15:30",
            "reversal_times": self._get_reversal_times(now, reference_price, trend),
            "current_time_index": current_index,
            "next_reversal": self._next_reversal(now),
            "is_market_open": self._is_market_open(now),
            "time_until_close": self._time_until_close(now),
        }

    def get_default_times(self) -> Dict:
        analysis = []
        base_price = reference = 19500.0
        for i, t in enumerate(self.times):
            hour, minute = map(int, t.split(":"))
            total_min = hour * 60 + minute
            angle = (total_min - 555) * 0.5
            gann_factor = (angle / 360) * reference * 0.01
            price_level = round(base_price + gann_factor * (1 if i % 2 == 0 else -1), 2)
            analysis.append({
                "time": t,
                "angle_deg": round(angle, 1),
                "price_level": price_level,
                "significance": self._significance(angle),
            })
        return {"times": self.times, "analysis": analysis}

    def _current_time_index(self, now: time) -> int:
        now_min = now.hour * 60 + now.minute
        for i, t in enumerate(self.times):
            h, m = map(int, t.split(":"))
            tm = h * 60 + m
            if now_min < tm:
                return i
        return len(self.times)

    def _get_reversal_times(self, now: time, price: float = None, trend: str = "neutral") -> List[Dict]:
        result = []
        base_price = price or 19500.0
        for i, t in enumerate(self.times):
            h, m = map(int, t.split(":"))
            tm = time(h, m)
            elapsed = (h * 60 + m) - 555
            angle = elapsed * 0.5
            price_shift = (angle / 360) * base_price * 0.01
            price_level = base_price + price_shift * (1 if i % 2 == 0 else -1)
            result.append({
                "time": t,
                "is_past": tm < now,
                "price_level": round(price_level, 2),
                "angle_deg": round(angle, 1),
            })
        return result

    def _next_reversal(self, now: time) -> Dict:
        for t in self.times:
            h, m = map(int, t.split(":"))
            if time(h, m) > now:
                return {"time": t, "minutes_until": (h * 60 + m) - (now.hour * 60 + now.minute)}
        return {"time": "09:15", "minutes_until": "next_day"}

    def _is_market_open(self, now: time) -> bool:
        return self.market_open <= now <= self.market_close

    def _time_until_close(self, now: time) -> str:
        if now > self.market_close:
            return "0"
        mins = (self.market_close.hour * 60 + self.market_close.minute) - (now.hour * 60 + now.minute)
        return f"{mins // 60}h {mins % 60}m"

    def _significance(self, angle: float) -> str:
        a = abs(angle)
        if a % 90 < 5:
            return "MAJOR"
        elif a % 45 < 3:
            return "MODERATE"
        return "MINOR"
