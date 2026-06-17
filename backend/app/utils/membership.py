from datetime import datetime, timezone

from app.models.user import User, PlanEnum


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def is_premium(user: User) -> bool:
    if user.plan == PlanEnum.ADMIN:
        return True
    now = utcnow()
    if user.trial_ends_at and _ensure_aware(user.trial_ends_at) > now:
        return True
    if user.premium_expires_at and _ensure_aware(user.premium_expires_at) > now:
        return True
    if user.plan == PlanEnum.PREMIUM:
        return user.premium_expires_at is None or _ensure_aware(user.premium_expires_at) > now
    return False


def trial_days_remaining(user: User) -> int:
    if not user.trial_ends_at:
        return 0
    delta = _ensure_aware(user.trial_ends_at) - utcnow()
    return max(0, delta.days + (1 if delta.seconds > 0 else 0))


def is_trial_active(user: User) -> bool:
    if not user.trial_ends_at:
        return False
    return _ensure_aware(user.trial_ends_at) > utcnow() and user.plan != PlanEnum.PREMIUM


def user_membership_payload(user: User) -> dict:
    premium = is_premium(user)
    trial_active = is_trial_active(user)
    return {
        "plan": user.plan.value,
        "is_premium": premium,
        "is_trial_active": trial_active,
        "trial_ends_at": user.trial_ends_at.isoformat() if user.trial_ends_at else None,
        "premium_expires_at": user.premium_expires_at.isoformat() if user.premium_expires_at else None,
        "trial_days_remaining": trial_days_remaining(user) if trial_active else 0,
        "subscription_amount_inr": 999,
    }


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt
