"""AI Mentor Chatbot API Routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.career import ChatSession
from app.schemas.schemas import ChatMessage, ChatResponse
from app.services.chatbot_service import ChatbotService

router = APIRouter()
chatbot_service = ChatbotService()


@router.post("/message", response_model=ChatResponse)
async def send_message(
    data: ChatMessage,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a message to the AI Career Mentor."""
    # Get or create session
    session = None
    if data.session_id:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == data.session_id,
                ChatSession.user_id == current_user.id,
            )
        )
        session = result.scalar_one_or_none()

    if not session:
        session = ChatSession(
            user_id=current_user.id,
            session_type=data.context_type or "general",
            messages=[],
            title=data.content[:50] + "..." if len(data.content) > 50 else data.content,
        )
        db.add(session)
        await db.flush()
        await db.refresh(session)

    # Build user context
    user_context = {
        "name": current_user.display_name,
        "skills": current_user.skills or [],
        "experience": current_user.years_of_experience,
        "current_role": current_user.current_role,
        "target_role": current_user.target_role,
        "education": current_user.education_level,
    }

    # Generate AI response
    response_text, suggestions = await chatbot_service.generate_response(
        user_message=data.content,
        conversation_history=session.messages or [],
        user_context=user_context,
        context_type=data.context_type or "general",
    )

    # Update session messages
    from datetime import datetime, timezone
    messages = list(session.messages or [])
    messages.append({"role": "user", "content": data.content, "timestamp": datetime.now(timezone.utc).isoformat()})
    messages.append({"role": "assistant", "content": response_text, "timestamp": datetime.now(timezone.utc).isoformat()})
    session.messages = messages
    session.total_messages = len(messages)
    await db.flush()

    return ChatResponse(
        message=response_text,
        session_id=str(session.id),
        suggestions=suggestions,
    )


@router.get("/sessions")
async def get_chat_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's chat sessions."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(20)
    )
    sessions = result.scalars().all()
    return [
        {
            "id": str(s.id),
            "title": s.title,
            "session_type": s.session_type,
            "total_messages": s.total_messages,
            "created_at": s.created_at.isoformat(),
            "updated_at": s.updated_at.isoformat(),
        }
        for s in sessions
    ]


@router.get("/sessions/{session_id}")
async def get_session_messages(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get messages for a specific chat session."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "messages": session.messages or []}
