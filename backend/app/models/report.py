from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.sql import func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    market = Column(String(50), nullable=False)
    report_type = Column(String(50), nullable=False)
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=False)
    probability_score = Column(Float, nullable=True)
    signal = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
