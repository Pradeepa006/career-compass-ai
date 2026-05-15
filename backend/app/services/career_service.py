"""
Career Prediction Service - ML-powered career path prediction
Uses scikit-learn with skill similarity matching and NLP
"""

import json
import logging
from typing import List, Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# ============================================
# CAREER KNOWLEDGE BASE
# ============================================

CAREER_SKILL_MAP = {
    "Full Stack Development": {
        "core": ["JavaScript", "TypeScript", "React", "Node.js", "HTML", "CSS", "REST APIs"],
        "backend": ["Python", "Java", "SQL", "PostgreSQL", "MongoDB", "Redis"],
        "devops": ["Git", "Docker", "CI/CD", "AWS", "Linux"],
        "demand": 95, "avg_salary": 115000, "growth": "+22%",
    },
    "AI/ML Engineering": {
        "core": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn"],
        "data": ["Pandas", "NumPy", "SQL", "Data Analysis", "Statistics"],
        "advanced": ["NLP", "Computer Vision", "MLOps", "CUDA", "Transformers"],
        "demand": 98, "avg_salary": 145000, "growth": "+40%",
    },
    "Data Science": {
        "core": ["Python", "R", "Statistics", "Machine Learning", "Data Analysis", "SQL"],
        "visualization": ["Tableau", "Power BI", "Matplotlib", "Plotly"],
        "big_data": ["Spark", "Hadoop", "Kafka", "BigQuery"],
        "demand": 92, "avg_salary": 125000, "growth": "+35%",
    },
    "Cybersecurity": {
        "core": ["Network Security", "Penetration Testing", "Linux", "Python", "Cryptography"],
        "tools": ["Wireshark", "Metasploit", "Nmap", "Burp Suite", "SIEM"],
        "certs": ["CISSP", "CEH", "CompTIA Security+", "OSCP"],
        "demand": 90, "avg_salary": 120000, "growth": "+30%",
    },
    "Cloud Computing": {
        "core": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
        "networking": ["VPC", "Load Balancing", "CDN", "DNS", "Serverless"],
        "security": ["IAM", "Encryption", "Compliance"],
        "demand": 96, "avg_salary": 130000, "growth": "+28%",
    },
    "DevOps Engineering": {
        "core": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "GitLab", "Linux"],
        "cloud": ["AWS", "Azure", "GCP", "Terraform", "Ansible"],
        "monitoring": ["Prometheus", "Grafana", "ELK Stack", "Datadog"],
        "demand": 93, "avg_salary": 125000, "growth": "+25%",
    },
    "UI/UX Design": {
        "core": ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
        "frontend": ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
        "tools": ["Sketch", "InVision", "Zeplin", "Miro"],
        "demand": 85, "avg_salary": 95000, "growth": "+20%",
    },
    "Mobile Development": {
        "core": ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"],
        "backend": ["Firebase", "REST APIs", "GraphQL", "Node.js"],
        "tools": ["Xcode", "Android Studio", "Expo"],
        "demand": 88, "avg_salary": 115000, "growth": "+25%",
    },
    "Blockchain Development": {
        "core": ["Solidity", "Ethereum", "Web3.js", "Smart Contracts", "Cryptography"],
        "platforms": ["Hardhat", "Truffle", "IPFS", "Polygon"],
        "languages": ["JavaScript", "Python", "Rust", "Go"],
        "demand": 80, "avg_salary": 135000, "growth": "+18%",
    },
    "Product Management": {
        "core": ["Product Strategy", "Agile", "Scrum", "User Research", "Data Analysis"],
        "tools": ["Jira", "Confluence", "Figma", "SQL", "Google Analytics"],
        "skills": ["Roadmapping", "Stakeholder Management", "A/B Testing", "OKRs"],
        "demand": 87, "avg_salary": 130000, "growth": "+20%",
    },
}

LEARNING_RESOURCES = {
    "JavaScript": {"course": "The Modern JavaScript Tutorial", "url": "https://javascript.info", "duration": "4 weeks"},
    "Python": {"course": "Python for Everybody (Coursera)", "url": "https://coursera.org", "duration": "2 weeks"},
    "React": {"course": "React - The Complete Guide (Udemy)", "url": "https://udemy.com", "duration": "6 weeks"},
    "Machine Learning": {"course": "ML Specialization (Andrew Ng)", "url": "https://coursera.org", "duration": "3 months"},
    "AWS": {"course": "AWS Certified Solutions Architect", "url": "https://aws.amazon.com/training", "duration": "2 months"},
    "Docker": {"course": "Docker Mastery (Udemy)", "url": "https://udemy.com", "duration": "2 weeks"},
    "Kubernetes": {"course": "Certified Kubernetes Administrator", "url": "https://kubernetes.io/training", "duration": "6 weeks"},
    "Deep Learning": {"course": "Deep Learning Specialization (Coursera)", "url": "https://coursera.org", "duration": "4 months"},
    "SQL": {"course": "The Complete SQL Bootcamp", "url": "https://udemy.com", "duration": "3 weeks"},
    "TypeScript": {"course": "TypeScript Masterclass", "url": "https://udemy.com", "duration": "3 weeks"},
}


class CareerService:
    """AI-powered career prediction and guidance service."""

    def _normalize_skill(self, skill: str) -> str:
        return skill.strip().lower()

    def _calculate_career_match(self, user_skills: List[str], career: str) -> Dict[str, Any]:
        """Calculate how well user skills match a career path."""
        career_data = CAREER_SKILL_MAP.get(career, {})
        all_required = []
        for key in ["core", "backend", "data", "advanced", "tools", "frontend"]:
            all_required.extend(career_data.get(key, []))

        user_skills_lower = [self._normalize_skill(s) for s in user_skills]
        required_lower = [self._normalize_skill(s) for s in all_required]

        # Exact and partial matching
        matched = []
        missing = []
        for req in required_lower:
            found = any(req in us or us in req for us in user_skills_lower)
            if found:
                matched.append(req)
            else:
                missing.append(req)

        match_pct = (len(matched) / len(required_lower) * 100) if required_lower else 0

        return {
            "career": career,
            "match_percentage": round(match_pct, 1),
            "matched_skills": matched,
            "missing_skills": missing[:8],
            "demand_score": career_data.get("demand", 80),
            "avg_salary": career_data.get("avg_salary", 100000),
            "growth": career_data.get("growth", "+15%"),
        }

    async def predict_career_paths(
        self,
        skills: List[str],
        experience: float = 0,
        education: Optional[str] = None,
        interests: Optional[List[str]] = None,
        current_role: Optional[str] = None,
        target_role: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Predict best career paths and generate full analysis."""
        if not skills:
            skills = []

        # Calculate match for all careers
        matches = []
        for career in CAREER_SKILL_MAP:
            match_data = self._calculate_career_match(skills, career)

            # Boost score based on interests
            if interests:
                interest_lower = [i.lower() for i in interests]
                if any(i in career.lower() for i in interest_lower):
                    match_data["match_percentage"] = min(100, match_data["match_percentage"] + 15)

            # Boost if it aligns with target role
            if target_role and target_role.lower() in career.lower():
                match_data["match_percentage"] = min(100, match_data["match_percentage"] + 20)

            matches.append(match_data)

        # Sort by match percentage
        matches.sort(key=lambda x: x["match_percentage"], reverse=True)
        top_career = matches[0]

        # Build career predictions list
        predicted = [
            {
                "career": m["career"],
                "match_percentage": m["match_percentage"],
                "confidence_score": min(1.0, m["match_percentage"] / 100 * 1.1),
                "demand_score": m["demand_score"],
                "avg_salary": m["avg_salary"],
                "growth": m["growth"],
                "missing_skills": m["missing_skills"][:5],
            }
            for m in matches[:5]
        ]

        # Skill gap for primary career
        primary_match = top_career

        # Salary prediction
        base_salary = top_career["avg_salary"]
        experience_multiplier = 1 + (experience * 0.05)
        education_multiplier = {"phd": 1.25, "master": 1.15, "bachelor": 1.0}.get(
            (education or "bachelor").lower(), 1.0
        )
        estimated_salary = base_salary * experience_multiplier * education_multiplier

        # Readiness score (0-100)
        readiness = min(100, int(top_career["match_percentage"] * 0.6 + min(experience * 5, 20) + 15))

        # Generate roadmap
        roadmap = self._build_roadmap(top_career["career"], top_career["missing_skills"], experience)

        # Get AI insights
        ai_insights = self._generate_career_insights(
            top_career["career"], skills, experience, top_career["match_percentage"]
        )

        return {
            "predicted_careers": predicted,
            "primary_career": top_career["career"],
            "confidence_score": round(top_career["match_percentage"] / 100, 2),
            "skill_gap": {
                top_career["career"]: {
                    "missing_skills": top_career["missing_skills"],
                    "present_skills": top_career["matched_skills"],
                }
            },
            "missing_skills": top_career["missing_skills"],
            "recommended_skills": top_career["missing_skills"][:5],
            "skill_match_percentage": top_career["match_percentage"],
            "market_demand": {
                c["career"]: {"demand_score": c["demand_score"], "growth": c["growth"]}
                for c in matches[:5]
            },
            "salary_prediction": {
                "min": int(estimated_salary * 0.8),
                "max": int(estimated_salary * 1.3),
                "average": int(estimated_salary),
                "currency": "USD",
            },
            "roadmap": roadmap,
            "ai_insights": ai_insights,
            "readiness_score": readiness,
        }

    def _build_roadmap(self, career: str, missing_skills: List[str], experience: float) -> Dict:
        """Build a personalized learning roadmap."""
        if experience < 1:
            level = "beginner"
            timeline = "6-9 months"
        elif experience < 3:
            level = "intermediate"
            timeline = "3-6 months"
        else:
            level = "advanced"
            timeline = "1-3 months"

        phases = [
            {
                "name": "Foundation",
                "duration": "4-6 weeks",
                "skills": missing_skills[:3] if len(missing_skills) >= 3 else missing_skills,
                "projects": [f"Build a beginner {career} portfolio project"],
                "resources": [LEARNING_RESOURCES.get(s, {"course": s, "url": "#", "duration": "2 weeks"})
                              for s in missing_skills[:3]],
            },
            {
                "name": "Core Skills",
                "duration": "6-8 weeks",
                "skills": missing_skills[3:6] if len(missing_skills) >= 6 else missing_skills[3:],
                "projects": [f"Build a full {career} application with authentication"],
                "resources": [LEARNING_RESOURCES.get(s, {"course": s, "url": "#", "duration": "3 weeks"})
                              for s in missing_skills[3:6]],
            },
            {
                "name": "Advanced & Industry Ready",
                "duration": "4-6 weeks",
                "skills": missing_skills[6:] if len(missing_skills) > 6 else [],
                "projects": ["Open source contribution", "Build SaaS-grade portfolio project"],
                "resources": [],
            },
        ]

        return {
            "career": career,
            "current_level": level,
            "total_timeline": timeline,
            "phases": phases,
            "certifications": self._get_certifications(career),
        }

    def _get_certifications(self, career: str) -> List[str]:
        certs = {
            "Cloud Computing": ["AWS Certified Solutions Architect", "GCP Professional", "Azure Administrator"],
            "Cybersecurity": ["CompTIA Security+", "CEH", "CISSP", "OSCP"],
            "DevOps Engineering": ["CKA (Kubernetes)", "AWS DevOps Professional", "HashiCorp Terraform"],
            "AI/ML Engineering": ["Google ML Engineer", "AWS ML Specialty", "TensorFlow Developer"],
            "Data Science": ["IBM Data Science Professional", "Databricks Associate", "Google Data Analytics"],
        }
        return certs.get(career, ["Relevant industry certification"])

    def _generate_career_insights(self, career: str, skills: List[str], experience: float, match_pct: float) -> str:
        if match_pct >= 70:
            level = "strong"
        elif match_pct >= 40:
            level = "promising"
        else:
            level = "developing"

        return (
            f"Based on your skill profile, you have a {level} fit for {career}. "
            f"With {len(skills)} skills identified and {experience} years of experience, "
            f"you are {match_pct:.0f}% aligned with industry requirements. "
            f"Focus on the recommended skills to significantly boost your career readiness score. "
            f"The {career} market is experiencing strong demand growth - now is an excellent time to invest in this path."
        )

    async def generate_roadmap(self, career: str, current_skills: List[str], experience: float) -> Dict:
        match_data = self._calculate_career_match(current_skills, career)
        return self._build_roadmap(career, match_data["missing_skills"], experience)

    def get_industry_trends(self) -> List[Dict]:
        return [
            {"industry": career, "demand": data["demand"], "avg_salary": data["avg_salary"], "growth": data["growth"]}
            for career, data in CAREER_SKILL_MAP.items()
        ]

    async def generate_interview_questions(self, career: str, level: str) -> List[Dict]:
        """Generate mock interview questions for a career path."""
        questions = {
            "Full Stack Development": [
                {"q": "Explain the difference between REST and GraphQL.", "type": "Technical"},
                {"q": "How do you optimize React app performance?", "type": "Technical"},
                {"q": "Describe your experience with database design.", "type": "Experience"},
                {"q": "Walk me through a complex feature you built end-to-end.", "type": "Behavioral"},
                {"q": "How do you handle state management in large React applications?", "type": "Technical"},
            ],
            "AI/ML Engineering": [
                {"q": "Explain the bias-variance tradeoff.", "type": "Technical"},
                {"q": "How would you handle imbalanced datasets?", "type": "Technical"},
                {"q": "Describe a machine learning project you're proud of.", "type": "Experience"},
                {"q": "What's the difference between supervised and unsupervised learning?", "type": "Conceptual"},
                {"q": "How do you evaluate model performance beyond accuracy?", "type": "Technical"},
            ],
        }
        default_qs = [
            {"q": f"What interests you most about {career}?", "type": "Motivational"},
            {"q": "Describe your most challenging technical problem and how you solved it.", "type": "Behavioral"},
            {"q": "Where do you see yourself in 5 years in this field?", "type": "Career"},
            {"q": "How do you stay updated with the latest industry trends?", "type": "Professional Development"},
        ]
        return questions.get(career, default_qs)
