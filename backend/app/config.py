from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    APP_NAME: str = "MarketMind Labs"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "sqlite:///./marketmind.db"
    SECRET_KEY: str = "change-this-to-a-secure-random-key-in-production"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000,https://logictrade.site,https://www.logictrade.site,https://marketmind-frontend-s0zl.onrender.com"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"

    # Google AdSense
    AD_CLIENT: str = "ca-pub-xxxxxxxxxxxxxxxx"
    AD_SLOT_PROBABILITY: str = "1234567890"
    AD_SLOT_SIDEBAR: str = "1234567891"
    AD_SLOT_FOOTER: str = "1234567892"

    # Amazon Associates
    AMAZON_AFFILIATE_TAG: str = "yourtag-21"
    AMAZON_AFFILIATE_REGION: str = "in"

    # Razorpay subscription (₹999/month after 7-day trial)
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_PLAN_ID: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None
    SUBSCRIPTION_AMOUNT_INR: int = 999
    TRIAL_DAYS: int = 7

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
