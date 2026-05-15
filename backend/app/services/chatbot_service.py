"""AI Chatbot Service - OpenAI/Gemini powered career mentor"""
import logging
from typing import List, Tuple, Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are CareerCompass AI - an elite AI Career Mentor specialized in:
- Tech career guidance and path planning
- Skill gap analysis and learning roadmaps
- Interview preparation and mock interviews
- Resume review and optimization
- Salary negotiation strategies
- Industry trends and market insights

Personality: Professional yet approachable, encouraging, data-driven, concise.
Format: Use bullet points for lists. Keep responses under 300 words unless asked for more.
Always end with a follow-up question or actionable next step."""


class ChatbotService:
    """AI-powered career mentor chatbot."""

    async def _call_openai(self, messages: List[Dict]) -> str:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                max_tokens=600,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise

    async def _call_gemini(self, prompt: str) -> str:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(settings.GEMINI_MODEL)
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise

    def _fallback_response(self, user_message: str, user_context: Dict) -> str:
        """Rule-based fallback when AI APIs are unavailable."""
        msg_lower = user_message.lower()
        name = user_context.get("name", "there")

        if any(w in msg_lower for w in ["salary", "pay", "earn", "money"]):
            role = user_context.get("current_role", "software engineer")
            return (f"Great question, {name}! Salaries vary widely by role and location. "
                    f"For a {role}, expect $80k-$180k in the US depending on experience and skills. "
                    f"To maximize your salary: 1) Get certifications in high-demand areas, "
                    f"2) Contribute to open source, 3) Build a portfolio. "
                    f"What's your target role for salary guidance?")

        if any(w in msg_lower for w in ["interview", "prepare", "questions"]):
            return (f"Interview prep is key, {name}! Here's my top strategy:\n"
                    f"• Study data structures & algorithms (LeetCode Medium)\n"
                    f"• Practice system design (scalability, databases)\n"
                    f"• Prepare STAR stories for behavioral questions\n"
                    f"• Research the company deeply\n"
                    f"What role are you interviewing for? I'll give you targeted advice!")

        if any(w in msg_lower for w in ["resume", "cv", "portfolio"]):
            return (f"Your resume is your first impression! Key tips:\n"
                    f"• Add quantified achievements (e.g., 'Reduced load time by 40%')\n"
                    f"• Use ATS-optimized keywords from job descriptions\n"
                    f"• Keep it to 1-2 pages\n"
                    f"• Include GitHub/portfolio links\n"
                    f"Upload your resume for a detailed AI analysis!")

        if any(w in msg_lower for w in ["learn", "skill", "study", "course"]):
            skills = user_context.get("skills", [])
            target = user_context.get("target_role", "your target role")
            return (f"Learning roadmap for {target}:\n"
                    f"1. Master fundamentals first (don't skip basics)\n"
                    f"2. Build real projects (not just tutorials)\n"
                    f"3. Contribute to open source\n"
                    f"4. Network on LinkedIn and GitHub\n"
                    f"Current skills detected: {', '.join(skills[:5]) if skills else 'none listed yet'}.\n"
                    f"Run a Skill Gap Analysis to see exactly what to learn next!")

        return (f"Hi {name}! I'm your AI Career Mentor. I can help you with:\n"
                f"• Career path planning and predictions\n"
                f"• Skill gap analysis and learning roadmaps\n"
                f"• Interview preparation\n"
                f"• Resume optimization\n"
                f"• Salary negotiation\n\n"
                f"What aspect of your career would you like to focus on today?")

    def _get_suggestions(self, context_type: str) -> List[str]:
        suggestions = {
            "general": [
                "What skills should I learn for 2025?",
                "Analyze my resume",
                "What's my career readiness score?",
                "Which career path suits me?",
            ],
            "interview_prep": [
                "Give me a system design question",
                "Practice behavioral questions",
                "What are common React interview questions?",
                "How do I negotiate salary?",
            ],
            "career_guidance": [
                "Compare AI vs Full Stack careers",
                "How long to become job-ready?",
                "What certifications should I get?",
                "Review my LinkedIn profile",
            ],
        }
        return suggestions.get(context_type, suggestions["general"])

    async def generate_response(
        self,
        user_message: str,
        conversation_history: List[Dict],
        user_context: Dict,
        context_type: str = "general",
    ) -> Tuple[str, List[str]]:
        """Generate AI response for user message."""
        suggestions = self._get_suggestions(context_type)

        # Build context-aware system prompt
        user_context_str = f"""
User Profile:
- Name: {user_context.get('name', 'User')}
- Skills: {', '.join(user_context.get('skills', [])[:10])}
- Experience: {user_context.get('experience', 0)} years
- Current Role: {user_context.get('current_role', 'Not specified')}
- Target Role: {user_context.get('target_role', 'Not specified')}
- Education: {user_context.get('education', 'Not specified')}
"""
        full_system = SYSTEM_PROMPT + "\n\n" + user_context_str

        # Build message history for API
        messages = [{"role": "system", "content": full_system}]
        for msg in conversation_history[-6:]:  # Last 3 exchanges
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        # Try AI APIs
        response_text = None
        if settings.OPENAI_API_KEY:
            try:
                response_text = await self._call_openai(messages)
            except Exception:
                pass

        if not response_text and settings.GEMINI_API_KEY:
            try:
                full_prompt = f"{full_system}\n\nConversation:\n"
                for msg in conversation_history[-4:]:
                    full_prompt += f"{msg['role'].capitalize()}: {msg['content']}\n"
                full_prompt += f"User: {user_message}\nAssistant:"
                response_text = await self._call_gemini(full_prompt)
            except Exception:
                pass

        # Fallback to rule-based
        if not response_text:
            response_text = self._fallback_response(user_message, user_context)

        return response_text, suggestions
