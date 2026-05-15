"""
Career Analysis Model - Career prediction and analysis results
"""

from sqlalchemy import Column, String, Text, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from app.core.database import Base


class CareerAnalysis(Base):
    __tablename__ = "career_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Prediction Results
    predicted_careers = Column(JSON, default=list)  # [{career, confidence_score, match_percentage}]
    primary_career = Column(String(200), nullable=True)
    confidence_score = Column(Float, nullable=True)  # 0-1

    # Skill Gap Analysis
    skill_gap = Column(JSON, default=dict)  # {target_role: {missing_skills, present_skills}}
    missing_skills = Column(JSON, default=list)
    recommended_skills = Column(JSON, default=list)
    skill_match_percentage = Column(Float, nullable=True)

    # Market Analysis
    market_demand = Column(JSON, default=dict)  # demand data per career
    salary_prediction = Column(JSON, default=dict)  # {min, max, average, currency}
    job_opportunities = Column(JSON, default=list)

    # Learning Roadmap
    roadmap = Column(JSON, default=dict)  # {phases: [{name, duration, skills, resources}]}
    recommended_courses = Column(JSON, default=list)
    recommended_projects = Column(JSON, default=list)
    recommended_certifications = Column(JSON, default=list)

    # Profile Inputs Used
    input_skills = Column(JSON, default=list)
    input_experience = Column(Float, nullable=True)
    input_education = Column(String(100), nullable=True)
    input_interests = Column(JSON, default=list)

    # AI Generated Insights
    ai_insights = Column(Text, nullable=True)
    career_narrative = Column(Text, nullable=True)

    # Analysis metadata
    model_version = Column(String(50), default="v1.0")
    analysis_type = Column(String(50), default="full")  # full, quick, resume-based

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="career_analyses")

    def __repr__(self):
        return f"<CareerAnalysis {self.primary_career} for user {self.user_id}>"


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    title = Column(String(300), nullable=True)
    session_type = Column(String(50), default="general")  # general, interview_prep, career_guidance
    messages = Column(JSON, default=list)  # [{role, content, timestamp}]
    total_messages = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="chat_sessions")


# Import Boolean for ChatSession
from sqlalchemy import Boolean  # noqa: E402
