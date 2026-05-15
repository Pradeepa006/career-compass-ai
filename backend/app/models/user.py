"""
User Model - Core user entity with profile information
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)
    website = Column(String(500), nullable=True)

    # Professional Info
    current_role = Column(String(200), nullable=True)
    years_of_experience = Column(Float, default=0.0)
    education_level = Column(String(100), nullable=True)  # high_school, bachelor, master, phd
    field_of_study = Column(String(200), nullable=True)
    university = Column(String(300), nullable=True)

    # Social Profiles
    github_username = Column(String(100), nullable=True)
    linkedin_url = Column(String(500), nullable=True)

    # Career Goals
    target_role = Column(String(200), nullable=True)
    target_industry = Column(String(200), nullable=True)
    career_interests = Column(JSON, default=list)  # list of interest areas

    # Skills (stored as JSON for flexibility)
    skills = Column(JSON, default=list)  # list of skill strings
    skill_levels = Column(JSON, default=dict)  # {skill: level (1-10)}

    # Platform Statistics
    career_readiness_score = Column(Integer, default=0)  # 0-100
    profile_completion = Column(Integer, default=0)  # 0-100
    total_analyses = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)

    # Account Status
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    plan = Column(String(50), default="free")  # free, pro, enterprise

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime(timezone=True), nullable=True)
    email_verified_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    career_analyses = relationship("CareerAnalysis", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"

    @property
    def display_name(self):
        return self.full_name or self.username
