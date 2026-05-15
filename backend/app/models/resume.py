"""
Resume Model - Resume uploads and analysis results
"""

from sqlalchemy import Column, String, Text, Integer, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # File Information
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)  # bytes
    file_type = Column(String(50), nullable=True)  # pdf, docx

    # Parsed Content
    raw_text = Column(Text, nullable=True)
    parsed_sections = Column(JSON, default=dict)  # {contact, summary, experience, education, skills}

    # Extracted Data
    extracted_skills = Column(JSON, default=list)
    extracted_experience = Column(JSON, default=list)  # list of experience objects
    extracted_education = Column(JSON, default=list)
    extracted_contact = Column(JSON, default=dict)
    extracted_certifications = Column(JSON, default=list)
    extracted_projects = Column(JSON, default=list)

    # ATS Analysis
    ats_score = Column(Integer, nullable=True)  # 0-100
    ats_feedback = Column(JSON, default=dict)
    keyword_density = Column(JSON, default=dict)
    missing_keywords = Column(JSON, default=list)
    formatting_score = Column(Integer, nullable=True)

    # AI Analysis
    quality_score = Column(Integer, nullable=True)  # 0-100
    ai_feedback = Column(Text, nullable=True)
    roast_feedback = Column(Text, nullable=True)  # Harsh honest feedback
    improvement_suggestions = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)

    # Embedding for similarity search
    embedding = Column(JSON, nullable=True)  # vector representation

    # Status
    is_primary = Column(Boolean, default=False)  # Primary/active resume
    analysis_status = Column(String(50), default="pending")  # pending, processing, completed, failed

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    analyzed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="resumes")

    def __repr__(self):
        return f"<Resume {self.filename} for user {self.user_id}>"
