from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "MarketMind Labs"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql://marketmind:marketmind@localhost:5432/marketmind"
    SECRET_KEY: str = "change-this-to-a-secure-random-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"

    AD_CLIENT: str = "ca-pub-xxxxxxxxxxxxxxxx"
    AD_SLOT_PROBABILITY: str = "1234567890"
    AD_SLOT_SIDEBAR: str = "1234567891"

    class Config:
        env_file = ".env"


settings = Settings()
