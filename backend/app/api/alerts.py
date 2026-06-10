from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.alert import Alert
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


class CreateAlertInput(BaseModel):
    alert_type: str
    market: str
    condition: Optional[str] = None
    threshold: Optional[float] = None


@router.post("/create")
def create_alert(
    data: CreateAlertInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alert = Alert(
        user_id=current_user.id,
        alert_type=data.alert_type,
        market=data.market,
        condition=data.condition,
        threshold=data.threshold,
        is_active=True,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return {"id": alert.id, "message": "Alert created"}


@router.get("/list")
def list_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alerts = (
        db.query(Alert)
        .filter(Alert.user_id == current_user.id)
        .order_by(Alert.created_at.desc())
        .all()
    )
    return [
        {
            "id": a.id,
            "alert_type": a.alert_type,
            "market": a.market,
            "condition": a.condition,
            "threshold": a.threshold,
            "is_active": a.is_active,
        }
        for a in alerts
    ]


@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted"}
