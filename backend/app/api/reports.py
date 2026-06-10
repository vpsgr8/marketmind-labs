from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.database import get_db
from app.models.user import User
from app.models.report import Report
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])


class SaveReportInput(BaseModel):
    market: str
    report_type: str
    input_data: Optional[dict] = None
    output_data: dict
    probability_score: Optional[float] = None
    signal: Optional[str] = None


@router.post("/save")
def save_report(
    data: SaveReportInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = Report(
        user_id=current_user.id,
        market=data.market,
        report_type=data.report_type,
        input_data=data.input_data,
        output_data=data.output_data,
        probability_score=data.probability_score,
        signal=data.signal,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"id": report.id, "message": "Report saved"}


@router.get("/history")
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20,
    offset: int = 0,
):
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "market": r.market,
            "report_type": r.report_type,
            "probability_score": r.probability_score,
            "signal": r.signal,
            "created_at": r.created_at.isoformat(),
        }
        for r in reports
    ]
