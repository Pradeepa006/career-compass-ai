"""Career Prediction & Analysis API Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.career import CareerAnalysis
from app.schemas.schemas import CareerPredictionRequest, CareerPredictionResponse
from app.services.career_service import CareerService

router = APIRouter()
career_service = CareerService()


@router.post("/predict", response_model=CareerPredictionResponse)
async def predict_career(
    data: CareerPredictionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Predict best career paths based on user profile."""
    result = await career_service.predict_career_paths(
        skills=data.skills,
        experience=data.years_of_experience,
        education=data.education_level,
        interests=data.interests,
        current_role=data.current_role,
        target_role=data.target_role,
    )

    # Save analysis
    analysis = CareerAnalysis(
        user_id=current_user.id,
        predicted_careers=result["predicted_careers"],
        primary_career=result["primary_career"],
        confidence_score=result["confidence_score"],
        skill_gap=result.get("skill_gap", {}),
        missing_skills=result.get("missing_skills", []),
        recommended_skills=result.get("recommended_skills", []),
        market_demand=result.get("market_demand", {}),
        salary_prediction=result.get("salary_prediction", {}),
        roadmap=result.get("roadmap", {}),
        ai_insights=result.get("ai_insights"),
        input_skills=data.skills,
        input_experience=data.years_of_experience,
        input_education=data.education_level,
        input_interests=data.interests or [],
    )
    db.add(analysis)

    # Update user score
    current_user.career_readiness_score = result.get("readiness_score", 0)
    current_user.total_analyses = (current_user.total_analyses or 0) + 1

    await db.flush()

    return CareerPredictionResponse(**result)


@router.get("/history")
async def get_career_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's career analysis history."""
    result = await db.execute(
        select(CareerAnalysis)
        .where(CareerAnalysis.user_id == current_user.id)
        .order_by(CareerAnalysis.created_at.desc())
        .limit(10)
    )
    analyses = result.scalars().all()
    return [
        {
            "id": str(a.id),
            "primary_career": a.primary_career,
            "confidence_score": a.confidence_score,
            "created_at": a.created_at.isoformat(),
        }
        for a in analyses
    ]


@router.get("/roadmap/{career}")
async def get_career_roadmap(
    career: str,
    current_user: User = Depends(get_current_user),
):
    """Get detailed learning roadmap for a specific career."""
    roadmap = await career_service.generate_roadmap(
        career=career,
        current_skills=current_user.skills or [],
        experience=current_user.years_of_experience or 0,
    )
    return roadmap


@router.get("/industries/trending")
async def get_trending_industries(current_user: User = Depends(get_current_user)):
    """Get trending tech industries and demand data."""
    return career_service.get_industry_trends()


@router.get("/interview-questions/{career}")
async def get_interview_questions(
    career: str,
    level: str = "intermediate",
    current_user: User = Depends(get_current_user),
):
    """Generate AI-powered interview questions for a career path."""
    questions = await career_service.generate_interview_questions(career, level)
    return {"career": career, "level": level, "questions": questions}
