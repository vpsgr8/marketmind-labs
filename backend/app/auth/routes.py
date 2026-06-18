import re
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, PlanEnum
from app.config import settings
from app.auth.jwt import (
    verify_password, hash_password, create_access_token,
    get_current_user,
)
from app.utils.membership import user_membership_payload, utcnow

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    # Accepts an email address or a mobile number. `email` kept for backward compatibility.
    identifier: str | None = None
    email: str | None = None
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    mobile: str | None = None


def _normalize_mobile(mobile: str | None) -> str | None:
    if not mobile:
        return None
    digits = re.sub(r"[^\d]", "", mobile)
    if len(digits) < 10:
        raise HTTPException(status_code=400, detail="Enter a valid mobile number")
    return digits[-10:]


def _looks_like_mobile(value: str) -> bool:
    digits = re.sub(r"[^\d]", "", value)
    return "@" not in value and len(digits) >= 10


class GoogleLoginRequest(BaseModel):
    id_token: str
    email: str
    name: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    mobile: str | None = None
    plan: str
    is_premium: bool
    is_trial_active: bool
    trial_ends_at: str | None = None
    premium_expires_at: str | None = None
    trial_days_remaining: int = 0
    subscription_amount_inr: int = 999


def _user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        **user_membership_payload(user),
    }


def _start_trial(user: User) -> None:
    user.trial_ends_at = utcnow() + timedelta(days=settings.TRIAL_DAYS)


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    mobile = _normalize_mobile(req.mobile)
    if mobile:
        if db.query(User).filter(User.mobile == mobile).first():
            raise HTTPException(status_code=400, detail="Mobile number already registered")

    user = User(
        name=req.name,
        email=req.email,
        mobile=mobile,
        password_hash=hash_password(req.password),
        plan=PlanEnum.GUEST,
    )
    _start_trial(user)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=_user_dict(user))


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    identifier = (req.identifier or req.email or "").strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Enter your email or mobile number")

    if _looks_like_mobile(identifier):
        mobile = _normalize_mobile(identifier)
        user = db.query(User).filter(User.mobile == mobile).first()
    else:
        user = db.query(User).filter(User.email == identifier).first()

    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=_user_dict(user))


@router.post("/google", response_model=TokenResponse)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == req.email) | (User.google_id == req.email)
    ).first()

    if not user:
        user = User(
            name=req.name,
            email=req.email,
            google_id=req.email,
            plan=PlanEnum.GUEST,
        )
        _start_trial(user)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=_user_dict(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    payload = user_membership_payload(current_user)
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        mobile=current_user.mobile,
        **payload,
    )
