from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

from app.engine.daily_outlook import DailyOutlookEngine

router = APIRouter(prefix="/api/daily-outlook", tags=["Daily Outlook"])
engine = DailyOutlookEngine()


class CandleData(BaseModel):
    open: float
    high: float
    low: float
    close: float


class OutlookInput(BaseModel):
    candles: List[CandleData]
    market: str = "NIFTY"


@router.post("/generate")
def generate_outlook(data: OutlookInput):
    return engine.generate([c.model_dump() for c in data.candles], data.market)
