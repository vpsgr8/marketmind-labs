from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.engine.probability import ProbabilityEngine

router = APIRouter(prefix="/api/probability", tags=["Probability Calculator"])
engine = ProbabilityEngine()


class CandleInput(BaseModel):
    open: float
    high: float
    low: float
    close: float


@router.post("/nifty")
def nifty_probability(data: CandleInput):
    return engine.calculate(data.open, data.high, data.low, data.close)


@router.post("/banknifty")
def banknifty_probability(data: CandleInput):
    return engine.calculate(data.open, data.high, data.low, data.close)


@router.post("/sensex")
def sensex_probability(data: CandleInput):
    return engine.calculate(data.open, data.high, data.low, data.close)
