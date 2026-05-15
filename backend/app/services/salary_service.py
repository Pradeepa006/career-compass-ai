"""Salary Prediction Service"""
from typing import List, Optional, Dict, Any

SALARY_DATA = {
    "Full Stack Developer": {"base": 115000, "min_mult": 0.75, "max_mult": 1.45},
    "ML Engineer": {"base": 145000, "min_mult": 0.80, "max_mult": 1.50},
    "Data Scientist": {"base": 125000, "min_mult": 0.78, "max_mult": 1.40},
    "DevOps Engineer": {"base": 125000, "min_mult": 0.80, "max_mult": 1.42},
    "Cloud Architect": {"base": 150000, "min_mult": 0.82, "max_mult": 1.55},
    "Frontend Developer": {"base": 100000, "min_mult": 0.75, "max_mult": 1.40},
    "Backend Developer": {"base": 115000, "min_mult": 0.78, "max_mult": 1.42},
    "Cybersecurity Engineer": {"base": 120000, "min_mult": 0.80, "max_mult": 1.48},
    "Mobile Developer": {"base": 115000, "min_mult": 0.78, "max_mult": 1.42},
    "Product Manager": {"base": 130000, "min_mult": 0.78, "max_mult": 1.50},
}

LOCATION_MULTIPLIERS = {
    "san francisco": 1.40, "new york": 1.30, "seattle": 1.25, "austin": 1.10,
    "boston": 1.20, "los angeles": 1.22, "chicago": 1.10, "denver": 1.08,
    "remote": 1.05, "india": 0.30, "uk": 0.85, "canada": 0.80, "germany": 0.90,
    "australia": 0.88, "singapore": 0.95, "dubai": 0.75,
}

HIGH_VALUE_SKILLS = [
    "Machine Learning", "Deep Learning", "Kubernetes", "AWS", "Rust", "Go",
    "TensorFlow", "PyTorch", "System Design", "Distributed Systems",
]

EDUCATION_MULTIPLIERS = {
    "phd": 1.20, "master": 1.12, "bachelor": 1.0, "associate": 0.92, "bootcamp": 0.88,
}


class SalaryService:
    def predict(self, role: str, skills: List[str], experience: float, location: str, education: Optional[str] = None) -> Dict:
        role_data = SALARY_DATA.get(role, {"base": 100000, "min_mult": 0.75, "max_mult": 1.40})
        base = role_data["base"]

        # Experience multiplier
        exp_mult = 1 + min(experience * 0.06, 0.60)

        # Location multiplier
        loc_lower = location.lower()
        loc_mult = 1.0
        for loc, mult in LOCATION_MULTIPLIERS.items():
            if loc in loc_lower:
                loc_mult = mult
                break

        # Education multiplier
        edu_mult = EDUCATION_MULTIPLIERS.get((education or "bachelor").lower(), 1.0)

        # Skills premium
        premium_count = sum(1 for s in skills if any(h.lower() in s.lower() for h in HIGH_VALUE_SKILLS))
        skills_mult = 1 + (premium_count * 0.03)

        salary = base * exp_mult * loc_mult * edu_mult * skills_mult
        salary_min = int(salary * role_data["min_mult"])
        salary_max = int(salary * role_data["max_mult"])
        salary_median = int(salary)

        confidence = min(0.95, 0.60 + (len(skills) * 0.02) + (min(experience, 5) * 0.03))

        top_skills = [s for s in skills if any(h.lower() in s.lower() for h in HIGH_VALUE_SKILLS)]

        return {
            "role": role,
            "location": location,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "salary_median": salary_median,
            "currency": "USD",
            "confidence": round(confidence, 2),
            "factors": {
                "experience_impact": f"+{int((exp_mult - 1) * 100)}%",
                "location_impact": f"{'+' if loc_mult >= 1 else ''}{int((loc_mult - 1) * 100)}%",
                "education_impact": f"+{int((edu_mult - 1) * 100)}%",
                "premium_skills_impact": f"+{int((skills_mult - 1) * 100)}%",
            },
            "market_comparison": {
                "below_market": salary_min,
                "market_rate": salary_median,
                "above_market": salary_max,
            },
            "top_paying_skills": top_skills[:5] or HIGH_VALUE_SKILLS[:5],
            "growth_outlook": "Strong - 20-35% growth expected in next 5 years" if role in SALARY_DATA else "Moderate",
        }

    def get_benchmarks(self, role: str) -> Dict:
        data = SALARY_DATA.get(role, {"base": 100000, "min_mult": 0.75, "max_mult": 1.40})
        base = data["base"]
        return {
            "role": role,
            "entry_level": int(base * 0.65),
            "mid_level": base,
            "senior_level": int(base * 1.35),
            "lead_level": int(base * 1.60),
            "currency": "USD",
        }

    def get_top_paying_skills(self) -> List[Dict]:
        return [
            {"skill": "Machine Learning", "salary_premium": "+$25,000", "demand": "Very High"},
            {"skill": "Kubernetes", "salary_premium": "+$18,000", "demand": "High"},
            {"skill": "AWS Architecture", "salary_premium": "+$20,000", "demand": "Very High"},
            {"skill": "Rust", "salary_premium": "+$22,000", "demand": "Growing"},
            {"skill": "Deep Learning", "salary_premium": "+$28,000", "demand": "Very High"},
            {"skill": "Go", "salary_premium": "+$15,000", "demand": "High"},
            {"skill": "System Design", "salary_premium": "+$20,000", "demand": "Essential"},
            {"skill": "Data Engineering", "salary_premium": "+$18,000", "demand": "High"},
        ]
