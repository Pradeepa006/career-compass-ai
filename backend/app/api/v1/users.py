"""Users API Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.schemas import UserResponse, UserUpdate, MessageResponse

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    # Recalculate profile completion
    completion_fields = [
        "full_name", "bio", "location", "current_role",
        "github_username", "linkedin_url", "target_role",
        "education_level", "years_of_experience",
    ]
    completed = sum(1 for f in completion_fields if getattr(current_user, f))
    skills_filled = 1 if current_user.skills and len(current_user.skills) > 0 else 0
    interests_filled = 1 if current_user.career_interests and len(current_user.career_interests) > 0 else 0
    current_user.profile_completion = int(
        ((completed + skills_filled + interests_filled) / (len(completion_fields) + 2)) * 100
    )

    await db.flush()
    await db.refresh(current_user)
    return current_user


@router.get("/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    return {
        "career_readiness_score": current_user.career_readiness_score,
        "profile_completion": current_user.profile_completion,
        "total_analyses": current_user.total_analyses,
        "streak_days": current_user.streak_days,
        "skills_count": len(current_user.skills or []),
        "plan": current_user.plan,
    }


@router.delete("/account", response_model=MessageResponse)
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.is_active = False
    await db.flush()
    return MessageResponse(message="Account deactivated successfully")
