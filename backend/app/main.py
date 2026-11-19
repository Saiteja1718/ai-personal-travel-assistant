
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Phase 2
from app.routers.travel import (
    router as travel_router,
)

# Phase 3
from app.routers.recommendations import (
    router as recommendations_router,
)

# Phase 4
from app.routers.trip_planner import (
    router as trip_planner_router,
)

# Phase 5
from app.routers.parallel_data import (
    router as parallel_data_router,
)


# ==========================================
# Environment configuration
# ==========================================

BACKEND_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BACKEND_DIR / ".env")

FRONTEND_ORIGIN = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173",
)


# ==========================================
# FastAPI application
# ==========================================

app = FastAPI(
    title="AI Personal Travel Assistant",
    description="Backend API for the travel assistant",
    version="0.5.0",
)


# ==========================================
# CORS configuration
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ==========================================
# Register API routers
# ==========================================

app.include_router(travel_router)
app.include_router(recommendations_router)
app.include_router(trip_planner_router)
app.include_router(parallel_data_router)


# ==========================================
# Health check
# ==========================================

class HealthResponse(BaseModel):
    status: str
    service: str


@app.get(
    "/health",
    response_model=HealthResponse,
)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="AI Personal Travel Assistant API",
    )
