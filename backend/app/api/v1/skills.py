"""Skills Analysis API Routes"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.schemas import SkillGapRequest, SkillGapResponse
from app.services.skill_service import SkillService

router = APIRouter()
skill_service = SkillService()


@router.post("/gap-analysis", response_model=SkillGapResponse)
async def analyze_skill_gap(
    data: SkillGapRequest,
    current_user: User = Depends(get_current_user),
):
    return await skill_service.analyze_gap(data.current_skills, data.target_role, data.years_of_experience)


@router.get("/trending")
async def get_trending_skills(
    limit: int = 20,
    category: str = None,
    current_user: User = Depends(get_current_user),
):
    return skill_service.get_trending_skills(limit=limit, category=category)


@router.get("/categories")
async def get_skill_categories(current_user: User = Depends(get_current_user)):
    return skill_service.get_categories()


@router.post("/extract")
async def extract_skills_from_text(
    text: str,
    current_user: User = Depends(get_current_user),
):
    skills = await skill_service.extract_skills(text)
    return {"skills": skills}
