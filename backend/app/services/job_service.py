"""Job Recommendations Service"""
from typing import List, Optional, Dict, Any
import random

SAMPLE_JOBS = [
    {"id": "1", "title": "Senior Full Stack Engineer", "company": "TechCorp Inc.", "location": "San Francisco, CA", "type": "Full-time", "level": "Senior", "salary_min": 140000, "salary_max": 190000, "required_skills": ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"], "is_remote": True, "posted": "2 days ago", "logo": "🏢"},
    {"id": "2", "title": "ML Engineer - NLP", "company": "AI Startup", "location": "Remote", "type": "Full-time", "level": "Mid", "salary_min": 130000, "salary_max": 170000, "required_skills": ["Python", "PyTorch", "NLP", "TensorFlow", "Docker"], "is_remote": True, "posted": "1 day ago", "logo": "🤖"},
    {"id": "3", "title": "Cloud Solutions Architect", "company": "FinTech Global", "location": "New York, NY", "type": "Full-time", "level": "Senior", "salary_min": 160000, "salary_max": 220000, "required_skills": ["AWS", "Kubernetes", "Terraform", "Python", "Docker"], "is_remote": False, "posted": "3 days ago", "logo": "☁️"},
    {"id": "4", "title": "DevOps Engineer", "company": "ScaleUp Solutions", "location": "Austin, TX", "type": "Full-time", "level": "Mid", "salary_min": 115000, "salary_max": 155000, "required_skills": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"], "is_remote": True, "posted": "5 days ago", "logo": "⚙️"},
    {"id": "5", "title": "Frontend Engineer - React", "company": "Product Studio", "location": "Remote", "type": "Full-time", "level": "Mid", "salary_min": 100000, "salary_max": 140000, "required_skills": ["React", "TypeScript", "Next.js", "CSS", "GraphQL"], "is_remote": True, "posted": "1 day ago", "logo": "🎨"},
    {"id": "6", "title": "Data Scientist", "company": "Analytics Co.", "location": "Seattle, WA", "type": "Full-time", "level": "Senior", "salary_min": 135000, "salary_max": 175000, "required_skills": ["Python", "Machine Learning", "SQL", "Pandas", "Tableau"], "is_remote": True, "posted": "4 days ago", "logo": "📊"},
    {"id": "7", "title": "Mobile Engineer (React Native)", "company": "App Factory", "location": "Remote", "type": "Contract", "level": "Mid", "salary_min": 110000, "salary_max": 145000, "required_skills": ["React Native", "JavaScript", "iOS", "Android", "Firebase"], "is_remote": True, "posted": "2 days ago", "logo": "📱"},
    {"id": "8", "title": "Cybersecurity Analyst", "company": "SecureNet Inc.", "location": "Washington, DC", "type": "Full-time", "level": "Senior", "salary_min": 125000, "salary_max": 165000, "required_skills": ["Network Security", "Python", "SIEM", "Linux", "Penetration Testing"], "is_remote": False, "posted": "1 week ago", "logo": "🔐"},
    {"id": "9", "title": "Product Manager - AI/ML", "company": "AI Platform Corp.", "location": "Remote", "type": "Full-time", "level": "Senior", "salary_min": 140000, "salary_max": 190000, "required_skills": ["Product Strategy", "Agile", "Data Analysis", "AI/ML", "Jira"], "is_remote": True, "posted": "3 days ago", "logo": "🚀"},
    {"id": "10", "title": "Blockchain Developer", "company": "Web3 Ventures", "location": "Remote", "type": "Full-time", "level": "Mid", "salary_min": 120000, "salary_max": 170000, "required_skills": ["Solidity", "Web3.js", "Ethereum", "JavaScript", "Python"], "is_remote": True, "posted": "2 days ago", "logo": "⛓️"},
]


class JobService:
    def _calculate_match(self, user_skills: List[str], required_skills: List[str]) -> Dict:
        user_lower = [s.lower() for s in user_skills]
        matched = [r for r in required_skills if r.lower() in user_lower or any(r.lower() in u for u in user_lower)]
        missing = [r for r in required_skills if r not in matched]
        pct = (len(matched) / len(required_skills) * 100) if required_skills else 0
        return {"percentage": round(pct, 0), "matched": matched, "missing": missing}

    async def get_recommendations(self, skills: List[str], experience: float, target_role: Optional[str], location: Optional[str]) -> List[Dict]:
        jobs = []
        for job in SAMPLE_JOBS:
            match = self._calculate_match(skills, job["required_skills"])
            job_copy = {**job, "match_score": match["percentage"], "matched_skills": match["matched"], "missing_skills": match["missing"]}
            jobs.append(job_copy)
        jobs.sort(key=lambda j: j["match_score"], reverse=True)
        return jobs[:8]

    async def search_jobs(self, query: str, location: Optional[str], job_type: Optional[str], experience_level: Optional[str], page: int, limit: int) -> Dict:
        filtered = SAMPLE_JOBS.copy()
        if query:
            q_lower = query.lower()
            filtered = [j for j in filtered if q_lower in j["title"].lower() or q_lower in j["company"].lower() or any(q_lower in s.lower() for s in j["required_skills"])]
        if location:
            loc_lower = location.lower()
            filtered = [j for j in filtered if loc_lower in j["location"].lower() or (loc_lower == "remote" and j["is_remote"])]
        if job_type:
            filtered = [j for j in filtered if j["type"].lower() == job_type.lower()]
        if experience_level:
            filtered = [j for j in filtered if j["level"].lower() == experience_level.lower()]

        total = len(filtered)
        start = (page - 1) * limit
        return {
            "jobs": filtered[start:start + limit],
            "total": total,
            "page": page,
            "pages": max(1, (total + limit - 1) // limit),
        }

    async def calculate_match_score(self, job_id: str, user_skills: List[str], experience: float) -> Dict:
        job = next((j for j in SAMPLE_JOBS if j["id"] == job_id), None)
        if not job:
            return {"error": "Job not found"}
        match = self._calculate_match(user_skills, job["required_skills"])
        return {
            "job_id": job_id,
            "job_title": job["title"],
            "match_score": match["percentage"],
            "matched_skills": match["matched"],
            "missing_skills": match["missing"],
            "recommendation": "Apply now - strong match!" if match["percentage"] >= 70 else "Upskill first, then apply" if match["percentage"] >= 40 else "Significant skills gap",
        }
