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
    reports, alerts, payments,
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
app.include_router(payments.router)


def _run_lightweight_migrations() -> dict:
    """Add columns that were introduced after a table was first created.

    Base.metadata.create_all only creates missing tables, not new columns on
    existing ones, so we add them idempotently here. Works on Postgres and SQLite.
    """
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    is_pg = engine.dialect.name == "postgresql"
    ts = "TIMESTAMP WITH TIME ZONE" if is_pg else "TIMESTAMP"

    wanted = {
        "users": {
            "mobile": "VARCHAR(20)",
            "trial_ends_at": ts,
            "premium_expires_at": ts,
        },
        "subscriptions": {
            "razorpay_subscription_id": "VARCHAR(255)",
            "razorpay_payment_id": "VARCHAR(255)",
            "started_at": ts,
            "expires_at": ts,
        },
    }

    applied = []
    tables = set(inspector.get_table_names())
    for table, cols in wanted.items():
        if table not in tables:
            continue
        existing = {c["name"] for c in inspector.get_columns(table)}
        for col, ddl in cols.items():
            if col not in existing:
                with engine.begin() as conn:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {ddl}"))
                applied.append(f"{table}.{col}")
    return {"applied": applied}


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    try:
        _run_lightweight_migrations()
    except Exception:
        # Never block startup on a best-effort migration.
        pass


@app.exception_handler(Exception)
async def _debug_exception_handler(request, exc):
    # Temporary: surface real error details to diagnose 500s.
    import traceback

    return JSONResponse(
        status_code=500,
        content={"detail": f"{type(exc).__name__}: {exc}", "trace": traceback.format_exc()[-1500:]},
    )


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


@app.get("/api/debug/migrate")
def debug_migrate():
    """Temporary: apply lightweight column migrations and report schema."""
    from sqlalchemy import inspect

    out: dict = {}
    try:
        out["migration"] = _run_lightweight_migrations()
        inspector = inspect(engine)
        out["user_columns"] = [c["name"] for c in inspector.get_columns("users")]
        out["subscription_columns"] = [c["name"] for c in inspector.get_columns("subscriptions")]
    except Exception as e:
        out["error"] = f"{type(e).__name__}: {e}"
    return out


@app.get("/api/ads/config")
def ad_config():
    return {
        "client": settings.AD_CLIENT,
        "slots": {
            "probability": settings.AD_SLOT_PROBABILITY,
            "sidebar": settings.AD_SLOT_SIDEBAR,
            "footer": settings.AD_SLOT_FOOTER,
        },
        "amazon": {
            "tag": settings.AMAZON_AFFILIATE_TAG,
            "region": settings.AMAZON_AFFILIATE_REGION,
        },
        "subscription": {
            "trial_days": settings.TRIAL_DAYS,
            "monthly_amount_inr": settings.SUBSCRIPTION_AMOUNT_INR,
            "razorpay_key_id": settings.RAZORPAY_KEY_ID or "",
        },
    }
