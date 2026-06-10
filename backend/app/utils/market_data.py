from typing import Dict, Optional
import httpx
import json


class MarketDataService:
    def __init__(self):
        self.nse_base = "https://www.nseindia.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }

    async def fetch_nifty(self) -> Optional[Dict]:
        try:
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
                resp = await client.get(
                    f"{self.nse_base}/api/equity-stockIndices?index=NIFTY%2050",
                    timeout=10,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data
        except Exception:
            pass
        return None

    async def fetch_banknifty(self) -> Optional[Dict]:
        try:
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
                resp = await client.get(
                    f"{self.nse_base}/api/equity-stockIndices?index=NIFTY%20BANK",
                    timeout=10,
                )
                if resp.status_code == 200:
                    return resp.json()
        except Exception:
            pass
        return None
