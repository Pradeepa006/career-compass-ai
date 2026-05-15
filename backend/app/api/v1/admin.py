"""Admin Dashboard API Routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.user import User
from app.models.resume import Resume
from app.models.career import CareerAnalysis

router = APIRouter()


@router.get("/stats")
async def get_platform_stats(
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    """Get platform-wide statistics."""
    total_users = await db.scalar(select(func.count(User.id)))
    active_users = await db.scalar(select(func.count(User.id)).where(User.is_active == True))
    total_resumes = await db.scalar(select(func.count(Resume.id)))
    total_analyses = await db.scalar(select(func.count(CareerAnalysis.id)))

    # Plan distribution
    pro_users = await db.scalar(select(func.count(User.id)).where(User.plan == "pro"))

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_resumes": total_resumes,
        "total_analyses": total_analyses,
        "pro_users": pro_users,
        "free_users": (active_users or 0) - (pro_users or 0),
        "conversion_rate": round(((pro_users or 0) / max(active_users or 1, 1)) * 100, 2),
    }


@router.get("/users")
async def list_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    """List all users with pagination."""
    offset = (page - 1) * limit
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).offset(offset).limit(limit)
    )
    users = result.scalars().all()
    total = await db.scalar(select(func.count(User.id)))

    return {
        "users": [
            {
                "id": str(u.id),
                "email": u.email,
                "username": u.username,
                "full_name": u.full_name,
                "plan": u.plan,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat(),
                "last_login": u.last_login.isoformat() if u.last_login else None,
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit if total else 1,
    }


@router.get("/trending-careers")
async def get_trending_careers(
    db: AsyncSession = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    """Get most predicted career paths on the platform."""
    result = await db.execute(
        select(CareerAnalysis.primary_career, func.count(CareerAnalysis.id).label("count"))
        .group_by(CareerAnalysis.primary_career)
        .order_by(func.count(CareerAnalysis.id).desc())
        .limit(10)
    )
    return [{"career": row[0], "count": row[1]} for row in result.all()]
