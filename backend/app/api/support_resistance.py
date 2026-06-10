from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.engine.support_resistance import SupportResistanceEngine

router = APIRouter(prefix="/api/support-resistance", tags=["S&R Engine"])
engine = SupportResistanceEngine()


class CandleData(BaseModel):
    open: float
    high: float
    low: float
    close: float


class SRInput(BaseModel):
    candles: List[CandleData]


@router.post("/calculate")
def calculate_sr(data: SRInput):
    return engine.calculate([c.model_dump() for c in data.candles])
