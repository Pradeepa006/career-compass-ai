"""
Application Configuration - Environment Variables & Settings
"""

from pydantic_settings import BaseSettings
from pydantic import validator
from typing import List, Optional
import secrets
import os


class Settings(BaseSettings):
    # ============================================
    # APP SETTINGS
    # ============================================
    APP_NAME: str = "CareerCompass AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ============================================
    # DATABASE
    # ============================================
    DATABASE_URL: str = "postgresql://careercompass:password@localhost:5432/careercompass_db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # ============================================
    # REDIS
    # ============================================
    REDIS_URL: str = "redis://localhost:6379"

    # ============================================
    # SECURITY
    # ============================================
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_MIN_LENGTH: int = 8

    # ============================================
    # CORS
    # ============================================
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://careercompassai.com",
        "https://www.careercompassai.com",
    ]

    # ============================================
    # AI SERVICES
    # ============================================
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-pro"
    AI_PROVIDER: str = "openai"  # "openai" or "gemini"

    # ============================================
    # FILE UPLOAD
    # ============================================
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "doc", "txt"]
    UPLOAD_DIR: str = "uploads"

    # ============================================
    # GITHUB
    # ============================================
    GITHUB_API_TOKEN: Optional[str] = None
    GITHUB_API_BASE_URL: str = "https://api.github.com"

    # ============================================
    # EMAIL
    # ============================================
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: str = "noreply@careercompassai.com"
    EMAILS_FROM_NAME: str = "CareerCompass AI"

    # ============================================
    # STORAGE
    # ============================================
    STORAGE_TYPE: str = "local"  # "local" or "s3"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"

    # ============================================
    # RATE LIMITING
    # ============================================
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds

    # ============================================
    # PAGINATION
    # ============================================
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
