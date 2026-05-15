"""
Resume Upload & Analysis API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import os
import uuid
import logging

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.resume import Resume
from app.schemas.schemas import ResumeResponse, MessageResponse
from app.services.resume_service import ResumeService

router = APIRouter()
logger = logging.getLogger(__name__)
resume_service = ResumeService()


@router.post("/upload", response_model=ResumeResponse, status_code=201)
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload and analyze a resume (PDF/DOCX)."""
    # Validate file type
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type .{ext} not allowed. Use PDF or DOCX.")

    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

    # Save file
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, str(current_user.id), unique_name)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(content)

    # Create resume record
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=len(content),
        file_type=ext,
        analysis_status="processing",
    )
    db.add(resume)
    await db.flush()
    await db.refresh(resume)

    # Trigger background analysis
    background_tasks.add_task(
        resume_service.analyze_resume_background,
        resume_id=str(resume.id),
        file_path=file_path,
        file_type=ext,
    )

    return resume


@router.get("/list", response_model=List[ResumeResponse])
async def list_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all resumes for current user."""
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific resume with full analysis."""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.post("/{resume_id}/roast")
async def roast_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get brutally honest AI feedback on resume (roast mode)."""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.raw_text:
        raise HTTPException(status_code=400, detail="Resume not yet analyzed")

    roast = await resume_service.roast_resume(resume.raw_text)
    resume.roast_feedback = roast
    await db.flush()

    return {"roast_feedback": roast, "resume_id": resume_id}


@router.post("/{resume_id}/ats-check")
async def check_ats(
    resume_id: str,
    job_description: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Check ATS compatibility against a job description."""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    ats_result = await resume_service.check_ats_compatibility(resume.raw_text, job_description)
    return ats_result


@router.delete("/{resume_id}", response_model=MessageResponse)
async def delete_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a resume."""
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Remove file
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)

    await db.delete(resume)
    return MessageResponse(message="Resume deleted successfully")
