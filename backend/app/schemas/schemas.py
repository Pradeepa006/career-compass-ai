"""
Pydantic Schemas - Request/Response validation models
"""

from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# ============================================
# AUTH SCHEMAS
# ============================================

class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username can only contain letters, numbers, hyphens, and underscores")
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ============================================
# USER SCHEMAS
# ============================================

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    current_role: Optional[str] = None
    years_of_experience: Optional[float] = 0.0
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    university: Optional[str] = None
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    target_role: Optional[str] = None
    target_industry: Optional[str] = None
    career_interests: Optional[List[str]] = []
    skills: Optional[List[str]] = []


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    current_role: Optional[str] = None
    years_of_experience: Optional[float] = None
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    university: Optional[str] = None
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    target_role: Optional[str] = None
    target_industry: Optional[str] = None
    career_interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    skill_levels: Optional[Dict[str, int]] = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    current_role: Optional[str] = None
    years_of_experience: float = 0.0
    education_level: Optional[str] = None
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    target_role: Optional[str] = None
    career_interests: List[str] = []
    skills: List[str] = []
    career_readiness_score: int = 0
    profile_completion: int = 0
    is_active: bool
    is_admin: bool
    plan: str = "free"
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# RESUME SCHEMAS
# ============================================

class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    ats_score: Optional[int] = None
    quality_score: Optional[int] = None
    extracted_skills: List[str] = []
    extracted_contact: Dict[str, Any] = {}
    ai_feedback: Optional[str] = None
    improvement_suggestions: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    analysis_status: str = "pending"
    is_primary: bool = False
    created_at: datetime
    analyzed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# CAREER SCHEMAS
# ============================================

class CareerPredictionRequest(BaseModel):
    skills: List[str]
    years_of_experience: float = 0.0
    education_level: Optional[str] = None
    interests: Optional[List[str]] = []
    current_role: Optional[str] = None
    target_role: Optional[str] = None


class CareerPredictionResponse(BaseModel):
    predicted_careers: List[Dict[str, Any]]
    primary_career: str
    confidence_score: float
    skill_gap: Dict[str, Any]
    missing_skills: List[str]
    recommended_skills: List[str]
    market_demand: Dict[str, Any]
    salary_prediction: Dict[str, Any]
    roadmap: Dict[str, Any]
    ai_insights: Optional[str] = None


# ============================================
# SKILL SCHEMAS
# ============================================

class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_role: str
    years_of_experience: float = 0.0


class SkillGapResponse(BaseModel):
    target_role: str
    match_percentage: float
    present_skills: List[str]
    missing_skills: List[str]
    recommended_learning_order: List[str]
    estimated_time_to_ready: str
    resources: List[Dict[str, Any]]


# ============================================
# CHATBOT SCHEMAS
# ============================================

class ChatMessage(BaseModel):
    content: str
    session_id: Optional[str] = None
    context_type: Optional[str] = "general"  # general, interview_prep, career_guidance


class ChatResponse(BaseModel):
    message: str
    session_id: str
    suggestions: Optional[List[str]] = []


# ============================================
# GITHUB SCHEMAS
# ============================================

class GitHubAnalysisResponse(BaseModel):
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    followers: int = 0
    following: int = 0
    public_repos: int = 0
    total_stars: int = 0
    languages: Dict[str, float] = {}  # {language: percentage}
    top_repositories: List[Dict[str, Any]] = []
    contribution_score: int = 0
    tech_stack: List[str] = []
    profile_strength: int = 0
    recommendations: List[str] = []
    career_matches: List[str] = []


# ============================================
# SALARY SCHEMAS
# ============================================

class SalaryPredictionRequest(BaseModel):
    role: str
    skills: List[str]
    years_of_experience: float
    location: str
    education_level: Optional[str] = None


class SalaryPredictionResponse(BaseModel):
    role: str
    location: str
    salary_min: float
    salary_max: float
    salary_median: float
    currency: str = "USD"
    confidence: float
    factors: Dict[str, Any]
    market_comparison: Dict[str, Any]
    top_paying_skills: List[str]
    growth_outlook: str


# ============================================
# PAGINATION
# ============================================

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int


# ============================================
# COMMON RESPONSE
# ============================================

class MessageResponse(BaseModel):
    message: str
    success: bool = True
