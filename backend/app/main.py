from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional
import io

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.utils.pdf import generate_report_pdf

from app.api import (
    probability, gann, master_candle, swish,
    reversal_time, support_resistance, daily_outlook,
    reports, alerts,
)
from app.auth import routes as auth_routes

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Probability & Market Structure Analysis Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(probability.router)
app.include_router(gann.router)
app.include_router(master_candle.router)
app.include_router(swish.router)
app.include_router(reversal_time.router)
app.include_router(support_resistance.router)
app.include_router(daily_outlook.router)
app.include_router(reports.router)
app.include_router(alerts.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/health",
        "frontend": settings.FRONTEND_URL,
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": settings.APP_VERSION, "app": settings.APP_NAME}


class PDFExportInput(BaseModel):
    report_type: str
    market: str = "NIFTY"
    output: dict
    input_data: Optional[dict] = None


@app.post("/api/export/pdf")
def export_pdf(data: PDFExportInput):
    try:
        buf = generate_report_pdf(data.model_dump())
        return StreamingResponse(
            buf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="marketmind-report-{data.report_type.lower()}.pdf"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")


@app.get("/api/ads/config")
def ad_config():
    return {
        "client": settings.AD_CLIENT,
        "slots": {
            "probability": settings.AD_SLOT_PROBABILITY,
            "sidebar": settings.AD_SLOT_SIDEBAR,
        },
    }
