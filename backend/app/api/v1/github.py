"""GitHub Profile Analysis API Routes"""
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.schemas import GitHubAnalysisResponse
from app.services.github_service import GitHubService

router = APIRouter()
github_service = GitHubService()


@router.get("/analyze/{username}", response_model=GitHubAnalysisResponse)
async def analyze_github_profile(
    username: str,
    current_user: User = Depends(get_current_user),
):
    """Analyze a GitHub profile and extract tech insights."""
    result = await github_service.analyze_profile(username)
    if not result:
        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
    return result


@router.get("/my-analysis", response_model=GitHubAnalysisResponse)
async def analyze_my_github(current_user: User = Depends(get_current_user)):
    """Analyze the current user's connected GitHub profile."""
    if not current_user.github_username:
        raise HTTPException(status_code=400, detail="No GitHub username connected to your profile")
    result = await github_service.analyze_profile(current_user.github_username)
    if not result:
        raise HTTPException(status_code=404, detail="Could not fetch GitHub data")
    return result


@router.get("/trending-repos")
async def get_trending_repos(
    language: str = None,
    current_user: User = Depends(get_current_user),
):
    """Get trending GitHub repositories for learning."""
    return await github_service.get_trending_repos(language=language)
