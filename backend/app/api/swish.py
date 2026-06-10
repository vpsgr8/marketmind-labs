from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.engine.swish import SwishEngine

router = APIRouter(prefix="/api/swish", tags=["Swish Breakout"])
engine = SwishEngine()


class CandleData(BaseModel):
    open: float
    high: float
    low: float
    close: float


class SwishInput(BaseModel):
    candles: List[CandleData]


@router.post("/scan")
def scan_swish(data: SwishInput):
    return {"results": engine.scan([c.model_dump() for c in data.candles])}


@router.post("/analyze")
def analyze_swish(data: SwishInput):
    return engine.analyze([c.model_dump() for c in data.candles])
