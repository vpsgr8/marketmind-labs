from fastapi import APIRouter
from pydantic import BaseModel

from app.engine.gann import GannEngine

router = APIRouter(prefix="/api/gann", tags=["GANN Intelligence"])
engine = GannEngine()


class SquareOf9Input(BaseModel):
    price: float


class TimeCycleInput(BaseModel):
    swing_high_date: str
    swing_low_date: str


@router.post("/square-of-9")
def square_of_9(data: SquareOf9Input):
    return engine.square_of_9(data.price)


@router.post("/time-cycle")
def time_cycle(data: TimeCycleInput):
    return engine.time_cycle_calc(data.swing_high_date, data.swing_low_date)
