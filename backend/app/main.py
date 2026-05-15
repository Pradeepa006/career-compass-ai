"""
CareerCompass AI - FastAPI Backend Application
Production-ready AI-powered career guidance platform
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
import time

from app.core.config import settings
from app.core.database import create_tables
from app.api.v1 import auth, users, resume, career, skills, jobs, chatbot, github, salary, admin

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    # Startup
    logger.info("🚀 Starting CareerCompass AI Backend...")
    await create_tables()
    logger.info("✅ Database tables initialized")
    logger.info("✅ CareerCompass AI Backend is ready!")
    yield
    # Shutdown
    logger.info("⏹️ Shutting down CareerCompass AI Backend...")


# Initialize FastAPI application
app = FastAPI(
    title="CareerCompass AI",
    description="AI-Powered Career Path Prediction and Skill Gap Analysis Platform",
    version="1.0.0",
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ============================================
# MIDDLEWARE CONFIGURATION
# ============================================

# CORS - Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count", "X-Request-ID"],
)

# Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Trusted hosts (production security)
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["careercompassai.com", "*.careercompassai.com", "localhost"],
    )


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = request.headers.get("X-Request-ID", "")
    return response


# ============================================
# STATIC FILES
# ============================================
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ============================================
# HEALTH CHECK
# ============================================
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for container orchestration."""
    return {
        "status": "healthy",
        "service": "CareerCompass AI Backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["Root"])
async def root():
    """API root endpoint."""
    return {
        "message": "Welcome to CareerCompass AI API",
        "docs": "/api/docs",
        "version": "1.0.0",
    }


# ============================================
# API ROUTES
# ============================================
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=f"{API_PREFIX}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{API_PREFIX}/users", tags=["Users"])
app.include_router(resume.router, prefix=f"{API_PREFIX}/resume", tags=["Resume Analysis"])
app.include_router(career.router, prefix=f"{API_PREFIX}/career", tags=["Career Prediction"])
app.include_router(skills.router, prefix=f"{API_PREFIX}/skills", tags=["Skill Analysis"])
app.include_router(jobs.router, prefix=f"{API_PREFIX}/jobs", tags=["Job Recommendations"])
app.include_router(chatbot.router, prefix=f"{API_PREFIX}/chatbot", tags=["AI Mentor Chatbot"])
app.include_router(github.router, prefix=f"{API_PREFIX}/github", tags=["GitHub Analysis"])
app.include_router(salary.router, prefix=f"{API_PREFIX}/salary", tags=["Salary Prediction"])
app.include_router(admin.router, prefix=f"{API_PREFIX}/admin", tags=["Admin Dashboard"])


# ============================================
# EXCEPTION HANDLERS
# ============================================
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "Resource not found", "path": str(request.url)},
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Please try again later."},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred."},
    )
