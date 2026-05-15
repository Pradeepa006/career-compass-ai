"""Skill Analysis Service"""
import logging
from typing import List, Optional, Dict, Any
logger = logging.getLogger(__name__)

SKILL_DATABASE = {
    "Programming Languages": ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "Swift", "Kotlin", "R"],
    "Frontend": ["React", "Vue.js", "Angular", "Next.js", "HTML", "CSS", "Tailwind CSS", "SASS", "Redux"],
    "Backend": ["Node.js", "FastAPI", "Django", "Flask", "Spring Boot", "Express.js", "NestJS"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite", "Cassandra"],
    "Cloud & DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Jenkins", "GitHub Actions"],
    "AI/ML": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "NLP", "Computer Vision", "Pandas", "NumPy"],
    "Mobile": ["React Native", "Flutter", "iOS", "Android", "Expo", "Xcode"],
    "Security": ["Penetration Testing", "OWASP", "Cryptography", "Network Security", "SIEM", "SOC"],
    "Data": ["SQL", "Data Analysis", "Tableau", "Power BI", "Spark", "Hadoop", "BigQuery"],
    "Tools": ["Git", "GitHub", "Figma", "Jira", "Confluence", "Postman", "VS Code"],
}

ROLE_REQUIRED_SKILLS = {
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "PostgreSQL", "REST API", "Git", "HTML", "CSS", "TypeScript"],
    "ML Engineer": ["Python", "Machine Learning", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "SQL", "Docker"],
    "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Statistics", "Pandas", "Tableau", "NumPy"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Python", "Git"],
    "Cloud Architect": ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Networking", "Security", "Docker"],
    "Frontend Developer": ["React", "TypeScript", "HTML", "CSS", "Tailwind CSS", "JavaScript", "Redux", "Next.js"],
    "Backend Developer": ["Python", "Node.js", "PostgreSQL", "REST API", "Docker", "SQL", "FastAPI", "Git"],
    "Cybersecurity Engineer": ["Network Security", "Python", "Penetration Testing", "Linux", "OWASP", "Cryptography"],
    "Mobile Developer": ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Git"],
    "Product Manager": ["Agile", "Scrum", "SQL", "Figma", "Jira", "Data Analysis", "User Research"],
}


class SkillService:
    def analyze_gap(self, current_skills: List[str], target_role: str, experience: float) -> Dict:
        required = ROLE_REQUIRED_SKILLS.get(target_role, ROLE_REQUIRED_SKILLS.get("Full Stack Developer"))
        current_lower = [s.lower() for s in current_skills]
        present = [r for r in required if r.lower() in current_lower or any(r.lower() in c for c in current_lower)]
        missing = [r for r in required if r not in present]
        match_pct = (len(present) / len(required) * 100) if required else 0

        if experience < 1:
            months = len(missing) * 6
        elif experience < 3:
            months = len(missing) * 3
        else:
            months = len(missing) * 2

        return {
            "target_role": target_role,
            "match_percentage": round(match_pct, 1),
            "present_skills": present,
            "missing_skills": missing,
            "recommended_learning_order": missing[:8],
            "estimated_time_to_ready": f"{months}-{months+3} months",
            "resources": [{"skill": s, "resource": f"Learn {s} via Udemy/Coursera", "url": "#"} for s in missing[:5]],
        }

    def get_trending_skills(self, limit: int = 20, category: str = None) -> List[Dict]:
        demand_map = {
            "Python": 98, "JavaScript": 96, "TypeScript": 90, "React": 92, "AWS": 91,
            "Docker": 88, "Kubernetes": 85, "Machine Learning": 87, "Next.js": 83,
            "Go": 79, "Rust": 72, "FastAPI": 75, "TensorFlow": 80, "PyTorch": 82,
            "PostgreSQL": 86, "Redis": 78, "GraphQL": 73, "Terraform": 81, "Figma": 77, "Flutter": 74,
        }
        skills = []
        for cat, skill_list in SKILL_DATABASE.items():
            if category and cat.lower() != category.lower():
                continue
            for skill in skill_list:
                skills.append({
                    "skill": skill,
                    "category": cat,
                    "demand_score": demand_map.get(skill, 65 + len(skill) % 20),
                    "growth": f"+{10 + len(skill) % 30}%",
                })
        skills.sort(key=lambda x: x["demand_score"], reverse=True)
        return skills[:limit]

    def get_categories(self) -> List[str]:
        return list(SKILL_DATABASE.keys())

    async def extract_skills(self, text: str) -> List[str]:
        from app.services.resume_service import ResumeService
        return ResumeService().extract_skills(text)
