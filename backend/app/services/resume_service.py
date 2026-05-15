"""
Resume Analysis Service - Parse, analyze, and score resumes using AI
"""

import os
import re
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Common tech skills for extraction
TECH_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin",
    "React", "Vue.js", "Angular", "Next.js", "Node.js", "FastAPI", "Django", "Flask", "Spring Boot",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "NLP",
    "Git", "GitHub", "GitLab", "CI/CD", "Agile", "Scrum", "REST API", "GraphQL",
    "HTML", "CSS", "Tailwind", "Bootstrap", "SASS", "Figma",
    "Pandas", "NumPy", "SQL", "R", "Tableau", "Power BI",
    "Linux", "Bash", "PowerShell", "Networking", "Security",
    "React Native", "Flutter", "iOS", "Android", "Expo",
    "Solidity", "Web3.js", "Blockchain", "Ethereum",
    "Microservices", "Serverless", "API Gateway", "Lambda",
]

SOFT_SKILLS = [
    "Leadership", "Communication", "Problem Solving", "Team Work", "Critical Thinking",
    "Project Management", "Agile", "Scrum", "Mentoring", "Collaboration",
]

ATS_KEYWORDS = {
    "developer": ["software development", "coding", "programming", "engineering"],
    "data": ["data analysis", "analytics", "visualization", "insights"],
    "ai": ["artificial intelligence", "machine learning", "neural network"],
    "cloud": ["cloud infrastructure", "scalability", "deployment", "devops"],
}


class ResumeService:
    """Handles resume parsing, analysis, and AI-powered feedback."""

    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using pdfplumber."""
        try:
            import pdfplumber
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            return ""

    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX using python-docx."""
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join([para.text for para in doc.paragraphs if para.text]).strip()
        except Exception as e:
            logger.error(f"DOCX extraction error: {e}")
            return ""

    def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from resume file."""
        if file_type == "pdf":
            return self._extract_text_from_pdf(file_path)
        elif file_type in ["docx", "doc"]:
            return self._extract_text_from_docx(file_path)
        elif file_type == "txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        return ""

    def extract_skills(self, text: str) -> List[str]:
        """Extract technical and soft skills from resume text."""
        text_lower = text.lower()
        found_skills = []
        for skill in TECH_SKILLS + SOFT_SKILLS:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        return list(set(found_skills))

    def extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information from resume."""
        contact = {}
        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact["email"] = emails[0]
        # Phone
        phone_pattern = r'(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact["phone"] = phones[0]
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/([A-Za-z0-9_-]+)'
        linkedin = re.findall(linkedin_pattern, text)
        if linkedin:
            contact["linkedin"] = f"https://linkedin.com/in/{linkedin[0]}"
        # GitHub
        github_pattern = r'github\.com/([A-Za-z0-9_-]+)'
        github = re.findall(github_pattern, text)
        if github:
            contact["github"] = f"https://github.com/{github[0]}"
        return contact

    def calculate_ats_score(self, text: str) -> Tuple[int, Dict]:
        """Calculate ATS compatibility score."""
        score = 0
        feedback = {}

        # Check for key sections
        sections = {
            "contact": ["email", "phone", "linkedin"],
            "experience": ["experience", "work history", "employment"],
            "education": ["education", "university", "degree", "bachelor", "master"],
            "skills": ["skills", "technologies", "tools", "expertise"],
            "summary": ["summary", "objective", "profile", "about"],
        }
        text_lower = text.lower()
        section_scores = {}
        for section, keywords in sections.items():
            found = any(k in text_lower for k in keywords)
            section_scores[section] = found
            if found:
                score += 15

        # Check formatting indicators
        has_dates = bool(re.search(r'\b(20\d\d|19\d\d)\b', text))
        has_bullet_indicators = text.count("•") + text.count("-") + text.count("*") > 5
        word_count = len(text.split())

        if has_dates:
            score += 5
        if has_bullet_indicators:
            score += 5
        if 300 <= word_count <= 1000:
            score += 10
        elif word_count > 1000:
            score += 5  # Too long

        # Skill density
        extracted_skills = self.extract_skills(text)
        skill_score = min(15, len(extracted_skills) * 2)
        score += skill_score

        score = min(100, score)
        feedback = {
            "sections_present": section_scores,
            "has_dates": has_dates,
            "word_count": word_count,
            "skills_found": len(extracted_skills),
            "recommendations": self._generate_ats_recommendations(section_scores, word_count, extracted_skills),
        }
        return score, feedback

    def _generate_ats_recommendations(self, sections, word_count, skills):
        recs = []
        if not sections.get("summary"):
            recs.append("Add a professional summary or objective at the top")
        if not sections.get("skills"):
            recs.append("Add a dedicated Skills section with relevant technologies")
        if word_count < 300:
            recs.append("Your resume seems too short. Expand your experience descriptions")
        if word_count > 1000:
            recs.append("Consider condensing to 1-2 pages for better ATS parsing")
        if len(skills) < 5:
            recs.append("Add more relevant technical skills throughout your resume")
        recs.append("Use action verbs to start bullet points (e.g., Developed, Implemented, Led)")
        recs.append("Quantify achievements with numbers and percentages where possible")
        return recs

    def calculate_quality_score(self, text: str, skills: List[str]) -> int:
        """Calculate overall resume quality score."""
        score = 30  # Base score
        # Length
        words = len(text.split())
        if 400 <= words <= 800:
            score += 20
        elif 200 <= words < 400 or 800 < words <= 1200:
            score += 10
        # Skills breadth
        score += min(20, len(skills) * 2)
        # Has quantifiable achievements
        if re.search(r'\d+%|\$\d+|\d+ (users|clients|projects|team|people)', text, re.I):
            score += 15
        # Has clear sections
        section_count = sum(1 for kw in ["experience", "education", "skills", "projects"]
                            if kw in text.lower())
        score += section_count * 3
        return min(100, score)

    def generate_ai_feedback(self, text: str, skills: List[str], ats_score: int) -> str:
        """Generate AI-style feedback without API (rule-based fallback)."""
        strengths = []
        improvements = []

        if len(skills) >= 8:
            strengths.append("strong technical skill set")
        if re.search(r'\d+%', text):
            strengths.append("quantified achievements")
        if "github" in text.lower() or "portfolio" in text.lower():
            strengths.append("portfolio/GitHub presence")

        if ats_score < 60:
            improvements.append("improve ATS optimization with better keyword usage")
        if len(text.split()) < 300:
            improvements.append("expand experience descriptions with more detail")
        if not re.search(r'(led|built|developed|implemented|architected)', text, re.I):
            improvements.append("use stronger action verbs to begin bullet points")

        strength_text = f"Your resume shows {', '.join(strengths[:2])}. " if strengths else ""
        improvement_text = f"Consider these improvements: {'; '.join(improvements[:3])}." if improvements else "Great job overall!"

        return f"{strength_text}{improvement_text} ATS compatibility score is {ats_score}/100."

    async def check_ats_compatibility(self, resume_text: str, job_description: str) -> Dict:
        """Check how well resume matches a specific job description."""
        if not resume_text or not job_description:
            return {"error": "Both resume text and job description are required"}

        # Extract keywords from job description
        jd_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', job_description.lower()))
        resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', resume_text.lower()))

        # Common stop words to exclude
        stop_words = {"that", "this", "with", "from", "your", "will", "have", "been", "they", "more"}
        jd_keywords = jd_words - stop_words
        found_keywords = jd_keywords & resume_words
        missing_keywords = jd_keywords - resume_words

        match_pct = (len(found_keywords) / len(jd_keywords) * 100) if jd_keywords else 0

        # Filter to meaningful missing skills
        missing_skills = [k for k in list(missing_keywords)[:15] if len(k) > 4]

        return {
            "match_percentage": round(match_pct, 1),
            "found_keywords": list(found_keywords)[:20],
            "missing_keywords": missing_skills,
            "recommendation": (
                "Strong match! Tailor a few bullet points to include missing keywords."
                if match_pct >= 70
                else "Moderate match. Add missing keywords naturally throughout your resume."
                if match_pct >= 40
                else "Low match. Significantly customize your resume for this role."
            ),
        }

    async def roast_resume(self, resume_text: str) -> str:
        """Generate brutally honest AI feedback on resume."""
        issues = []
        word_count = len(resume_text.split())
        skills = self.extract_skills(resume_text)

        if word_count < 200:
            issues.append("Your resume is thinner than my patience - barely 200 words? A LinkedIn post has more substance.")
        if len(skills) < 5:
            issues.append("5 skills listed? Even a bootcamp grad lists more. Expand your technical repertoire.")
        if not re.search(r'\d+%|\$\d+', resume_text):
            issues.append("Not a single number or metric? 'Improved performance' means nothing without data. How much? How many users? $$$?")
        if not re.search(r'github|portfolio|project', resume_text, re.I):
            issues.append("No GitHub or portfolio link? In tech, if you can't show your work, it doesn't exist.")
        if re.search(r'responsible for|worked on|helped with', resume_text, re.I):
            issues.append("'Responsible for' and 'worked on' are resume red flags. Use IMPACT verbs: Built, Architected, Led, Scaled.")

        if not issues:
            issues.append("Actually... this is decent. Now make it exceptional by adding metrics and a killer summary.")

        roast = "🔥 CAREER ROAST MODE ACTIVATED:\n\n"
        roast += "\n\n".join(f"• {issue}" for issue in issues)
        roast += "\n\n💡 The good news? These are all fixable. Start with metrics and stronger action verbs."
        return roast

    async def analyze_resume_background(self, resume_id: str, file_path: str, file_type: str):
        """Background task: Full resume analysis pipeline."""
        from app.core.database import AsyncSessionLocal
        from app.models.resume import Resume
        from sqlalchemy import select
        from datetime import datetime, timezone

        async with AsyncSessionLocal() as db:
            try:
                result = await db.execute(select(Resume).where(Resume.id == resume_id))
                resume = result.scalar_one_or_none()
                if not resume:
                    return

                # Extract text
                text = self.extract_text(file_path, file_type)
                if not text:
                    resume.analysis_status = "failed"
                    await db.commit()
                    return

                # Run analysis
                skills = self.extract_skills(text)
                contact = self.extract_contact_info(text)
                ats_score, ats_feedback = self.calculate_ats_score(text)
                quality_score = self.calculate_quality_score(text, skills)
                ai_feedback = self.generate_ai_feedback(text, skills, ats_score)

                # Update resume record
                resume.raw_text = text
                resume.extracted_skills = skills
                resume.extracted_contact = contact
                resume.ats_score = ats_score
                resume.ats_feedback = ats_feedback
                resume.quality_score = quality_score
                resume.ai_feedback = ai_feedback
                resume.missing_keywords = ats_feedback.get("recommendations", [])[:5]
                resume.strengths = [f"Found {len(skills)} technical skills"]
                resume.weaknesses = ats_feedback.get("recommendations", [])[:3]
                resume.analysis_status = "completed"
                resume.analyzed_at = datetime.now(timezone.utc)

                await db.commit()
                logger.info(f"Resume {resume_id} analyzed successfully")

            except Exception as e:
                logger.error(f"Resume analysis failed for {resume_id}: {e}")
                try:
                    result = await db.execute(select(Resume).where(Resume.id == resume_id))
                    resume = result.scalar_one_or_none()
                    if resume:
                        resume.analysis_status = "failed"
                        await db.commit()
                except Exception:
                    pass
