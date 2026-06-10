from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.engine.master_candle import MasterCandleEngine

router = APIRouter(prefix="/api/master-candle", tags=["Master Candle"])
engine = MasterCandleEngine()


class CandleData(BaseModel):
    open: float
    high: float
    low: float
    close: float


class MasterCandleInput(BaseModel):
    candles: List[CandleData]


@router.post("/detect")
def detect_master_candle(data: MasterCandleInput):
    return engine.detect([c.model_dump() for c in data.candles])
