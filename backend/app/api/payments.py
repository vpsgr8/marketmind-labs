import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User, PlanEnum
from app.models.subscription import Subscription
from app.auth.jwt import get_current_user
from app.utils.membership import is_premium, utcnow

router = APIRouter(prefix="/api/payments", tags=["Payments"])


class VerifySubscriptionRequest(BaseModel):
    razorpay_subscription_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class ConsultationOrderRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    contact: str | None = None


class ConsultationVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


def _razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Payment gateway not configured")
    import razorpay

    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


def _activate_premium(user: User, db: Session, subscription_id: str, payment_id: str | None = None):
    now = utcnow()
    base = user.premium_expires_at if user.premium_expires_at and user.premium_expires_at > now else now
    user.plan = PlanEnum.PREMIUM
    user.premium_expires_at = base + timedelta(days=30)

    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == user.id, Subscription.is_active.is_(True))
        .first()
    )
    if not sub:
        sub = Subscription(user_id=user.id, plan="premium_monthly", amount=settings.SUBSCRIPTION_AMOUNT_INR)
        db.add(sub)
    sub.plan = "premium_monthly"
    sub.amount = settings.SUBSCRIPTION_AMOUNT_INR
    sub.is_active = True
    sub.razorpay_subscription_id = subscription_id
    if payment_id:
        sub.razorpay_payment_id = payment_id
    sub.started_at = now
    sub.expires_at = user.premium_expires_at
    db.commit()
    db.refresh(user)


@router.get("/plans")
def get_plans():
    return {
        "trial_days": settings.TRIAL_DAYS,
        "monthly_amount_inr": settings.SUBSCRIPTION_AMOUNT_INR,
        "currency": "INR",
        "plan_name": "Premium Monthly",
        "razorpay_configured": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_PLAN_ID),
    }


@router.get("/status")
def payment_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sub = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.id.desc())
        .first()
    )
    return {
        "is_premium": is_premium(current_user),
        "has_active_subscription": bool(sub and sub.is_active),
        "razorpay_subscription_id": sub.razorpay_subscription_id if sub else None,
        "expires_at": sub.expires_at.isoformat() if sub and sub.expires_at else None,
    }


@router.post("/create-subscription")
def create_subscription(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not settings.RAZORPAY_PLAN_ID:
        raise HTTPException(status_code=503, detail="Razorpay plan ID not configured")

    client = _razorpay_client()

    payload = {
        "plan_id": settings.RAZORPAY_PLAN_ID,
        "total_count": 120,
        "customer_notify": 1,
        "notes": {"user_id": str(current_user.id), "email": current_user.email},
    }

    # Delay first charge until trial ends if user still has trial time left
    if current_user.trial_ends_at:
        trial_end = current_user.trial_ends_at
        if trial_end.tzinfo is None:
            trial_end = trial_end.replace(tzinfo=timezone.utc)
        if trial_end > utcnow():
            payload["start_at"] = int(trial_end.timestamp())

    try:
        subscription = client.subscription.create(payload)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Razorpay error: {exc}") from exc

    sub = Subscription(
        user_id=current_user.id,
        plan="premium_monthly",
        amount=settings.SUBSCRIPTION_AMOUNT_INR,
        is_active=False,
        razorpay_subscription_id=subscription["id"],
    )
    db.add(sub)
    db.commit()

    return {
        "subscription_id": subscription["id"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "amount_inr": settings.SUBSCRIPTION_AMOUNT_INR,
        "trial_days": settings.TRIAL_DAYS,
        "user": {"name": current_user.name, "email": current_user.email},
    }


@router.get("/consultation")
def consultation_info():
    return {
        "fee_inr": settings.CONSULTATION_FEE_INR,
        "razorpay_configured": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
    }


@router.post("/consultation/create-order")
def create_consultation_order(data: ConsultationOrderRequest):
    client = _razorpay_client()
    amount_paise = settings.CONSULTATION_FEE_INR * 100
    try:
        order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {
                    "type": "consultation",
                    "name": data.name or "",
                    "email": data.email or "",
                    "contact": data.contact or "",
                },
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Razorpay error: {exc}") from exc

    return {
        "order_id": order["id"],
        "key_id": settings.RAZORPAY_KEY_ID,
        "amount": amount_paise,
        "amount_inr": settings.CONSULTATION_FEE_INR,
        "currency": "INR",
    }


@router.post("/consultation/verify")
def verify_consultation(data: ConsultationVerifyRequest):
    client = _razorpay_client()
    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid payment signature") from exc

    whatsapp = settings.CONSULTATION_WHATSAPP
    return {
        "status": "paid",
        "whatsapp": whatsapp,
        "whatsapp_link": f"https://wa.me/{whatsapp}",
        "email": settings.CONSULTATION_EMAIL,
        "message": "Payment received! Here are your private contact details.",
    }


@router.post("/verify")
def verify_subscription(
    data: VerifySubscriptionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client = _razorpay_client()
    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_subscription_id": data.razorpay_subscription_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid payment signature") from exc

    _activate_premium(current_user, db, data.razorpay_subscription_id, data.razorpay_payment_id)
    return {"status": "active", "message": "Premium subscription activated"}


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if settings.RAZORPAY_WEBHOOK_SECRET:
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = json.loads(body)
    event_type = event.get("event", "")
    payload = event.get("payload", {})

    if event_type in ("subscription.activated", "subscription.charged"):
        entity = payload.get("subscription", {}).get("entity") or payload.get("payment", {}).get("entity", {})
        sub_id = entity.get("id") or payload.get("subscription", {}).get("entity", {}).get("id")
        if not sub_id:
            sub_entity = payload.get("subscription", {}).get("entity", {})
            sub_id = sub_entity.get("id")

        payment_entity = payload.get("payment", {}).get("entity", {})
        payment_id = payment_entity.get("id")

        sub = db.query(Subscription).filter(Subscription.razorpay_subscription_id == sub_id).first()
        if sub:
            user = db.query(User).filter(User.id == sub.user_id).first()
            if user:
                _activate_premium(user, db, sub_id, payment_id)

    return {"status": "ok"}
