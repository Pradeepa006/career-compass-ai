"""Job Recommendations API Routes"""
from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from app.core.security import get_current_user
from app.models.user import User
from app.services.job_service import JobService

router = APIRouter()
job_service = JobService()


@router.get("/recommendations")
async def get_job_recommendations(
    limit: int = Query(default=10, le=50),
    current_user: User = Depends(get_current_user),
):
    """Get personalized job recommendations based on user profile."""
    return await job_service.get_recommendations(
        skills=current_user.skills or [],
        experience=current_user.years_of_experience or 0,
        target_role=current_user.target_role,
        location=current_user.location,
    )


@router.get("/search")
async def search_jobs(
    query: str = "",
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
):
    """Search for jobs with filters."""
    return await job_service.search_jobs(
        query=query,
        location=location,
        job_type=job_type,
        experience_level=experience_level,
        page=page,
        limit=limit,
    )


@router.get("/match-score/{job_id}")
async def get_job_match_score(
    job_id: str,
    current_user: User = Depends(get_current_user),
):
    """Calculate how well user matches a specific job."""
    return await job_service.calculate_match_score(
        job_id=job_id,
        user_skills=current_user.skills or [],
        experience=current_user.years_of_experience or 0,
    )
