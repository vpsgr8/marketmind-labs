from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.engine.reversal_time import ReversalTimeEngine

router = APIRouter(prefix="/api/reversal-time", tags=["Intraday Reversal"])
engine = ReversalTimeEngine()


class ReversalTimeInput(BaseModel):
    reference_price: Optional[float] = None
    trend: str = "neutral"


@router.post("/calculate")
def calculate_reversal(data: ReversalTimeInput):
    return engine.calculate(data.reference_price, data.trend)


@router.get("/times")
def default_times():
    return engine.get_default_times()
