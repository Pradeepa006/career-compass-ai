"""Salary Prediction API Routes"""
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.schemas import SalaryPredictionRequest, SalaryPredictionResponse
from app.services.salary_service import SalaryService

router = APIRouter()
salary_service = SalaryService()


@router.post("/predict", response_model=SalaryPredictionResponse)
async def predict_salary(
    data: SalaryPredictionRequest,
    current_user: User = Depends(get_current_user),
):
    return await salary_service.predict(
        role=data.role,
        skills=data.skills,
        experience=data.years_of_experience,
        location=data.location,
        education=data.education_level,
    )


@router.get("/benchmarks/{role}")
async def get_salary_benchmarks(role: str, current_user: User = Depends(get_current_user)):
    return salary_service.get_benchmarks(role)


@router.get("/top-paying-skills")
async def get_top_paying_skills(current_user: User = Depends(get_current_user)):
    return salary_service.get_top_paying_skills()
