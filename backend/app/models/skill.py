"""Skill and Job Models"""
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from app.core.database import Base


class SkillTrend(Base):
    __tablename__ = "skill_trends"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=True)
    demand_score = Column(Float, default=0.0)
    growth_rate = Column(Float, default=0.0)
    avg_salary_impact = Column(Float, default=0.0)
    job_postings_count = Column(Integer, default=0)
    related_careers = Column(JSON, default=list)
    resources = Column(JSON, default=list)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class JobListing(Base):
    __tablename__ = "job_listings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(300), nullable=False)
    company = Column(String(300), nullable=True)
    location = Column(String(300), nullable=True)
    job_type = Column(String(100), nullable=True)
    experience_level = Column(String(100), nullable=True)
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    salary_currency = Column(String(10), default="USD")
    required_skills = Column(JSON, default=list)
    nice_to_have_skills = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    benefits = Column(JSON, default=list)
    apply_url = Column(String(500), nullable=True)
    source = Column(String(100), nullable=True)
    is_remote = Column(Boolean, default=False)
    posted_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
