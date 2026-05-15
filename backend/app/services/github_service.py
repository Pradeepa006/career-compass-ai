"""GitHub Profile Analysis Service"""
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class GitHubService:
    BASE_URL = "https://api.github.com"

    def _get_headers(self) -> Dict:
        headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "CareerCompassAI/1.0"}
        if settings.GITHUB_API_TOKEN:
            headers["Authorization"] = f"token {settings.GITHUB_API_TOKEN}"
        return headers

    async def analyze_profile(self, username: str) -> Optional[Dict]:
        """Fetch and analyze a GitHub profile."""
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Fetch user data
                resp = await client.get(f"{self.BASE_URL}/users/{username}", headers=self._get_headers())
                if resp.status_code == 404:
                    return None
                resp.raise_for_status()
                user_data = resp.json()

                # Fetch repos
                repos_resp = await client.get(
                    f"{self.BASE_URL}/users/{username}/repos",
                    headers=self._get_headers(),
                    params={"sort": "stars", "per_page": 30},
                )
                repos = repos_resp.json() if repos_resp.status_code == 200 else []

                return self._analyze_data(user_data, repos)
        except httpx.RequestError as e:
            logger.error(f"GitHub API request error: {e}")
            return None

    def _analyze_data(self, user: Dict, repos: List[Dict]) -> Dict:
        # Language analysis
        lang_counts = {}
        total_stars = 0
        for repo in repos:
            if repo.get("language"):
                lang_counts[repo["language"]] = lang_counts.get(repo["language"], 0) + 1
            total_stars += repo.get("stargazers_count", 0)

        total_repos_with_lang = sum(lang_counts.values()) or 1
        languages = {lang: round(count / total_repos_with_lang * 100, 1) for lang, count in lang_counts.items()}
        languages = dict(sorted(languages.items(), key=lambda x: x[1], reverse=True)[:8])

        # Top repositories
        top_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[:6]
        top_repos_data = [
            {
                "name": r["name"],
                "description": r.get("description", ""),
                "stars": r.get("stargazers_count", 0),
                "language": r.get("language", ""),
                "url": r.get("html_url", ""),
                "forks": r.get("forks_count", 0),
            }
            for r in top_repos
        ]

        # Contribution score (0-100)
        contrib_score = min(100, (
            min(30, user.get("public_repos", 0)) +
            min(20, user.get("followers", 0) // 2) +
            min(30, total_stars // 5) +
            (10 if user.get("blog") else 0) +
            (10 if user.get("bio") else 0)
        ))

        # Tech stack from languages
        tech_stack = list(languages.keys())

        # Career matches based on languages
        career_matches = self._infer_career_matches(languages)

        # Profile strength
        profile_strength = min(100, (
            (20 if user.get("bio") else 0) +
            (15 if user.get("blog") else 0) +
            (15 if user.get("company") else 0) +
            (20 if user.get("public_repos", 0) > 5 else 0) +
            (15 if user.get("followers", 0) > 10 else 0) +
            (15 if total_stars > 5 else 0)
        ))

        recommendations = []
        if not user.get("bio"):
            recommendations.append("Add a compelling bio describing your expertise")
        if not user.get("blog"):
            recommendations.append("Link your portfolio website or LinkedIn")
        if user.get("public_repos", 0) < 10:
            recommendations.append("Create more public repositories to showcase your work")
        if total_stars < 5:
            recommendations.append("Star your own repos and contribute to popular projects")
        recommendations.append("Add README files to all repositories")

        return {
            "username": user.get("login"),
            "name": user.get("name"),
            "bio": user.get("bio"),
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "public_repos": user.get("public_repos", 0),
            "total_stars": total_stars,
            "languages": languages,
            "top_repositories": top_repos_data,
            "contribution_score": contrib_score,
            "tech_stack": tech_stack,
            "profile_strength": profile_strength,
            "recommendations": recommendations[:5],
            "career_matches": career_matches,
        }

    def _infer_career_matches(self, languages: Dict) -> List[str]:
        matches = []
        lang_names = [l.lower() for l in languages.keys()]
        if any(l in lang_names for l in ["javascript", "typescript", "html", "css"]):
            matches.append("Full Stack Development")
        if any(l in lang_names for l in ["python", "jupyter notebook"]):
            matches.extend(["AI/ML Engineering", "Data Science"])
        if any(l in lang_names for l in ["solidity"]):
            matches.append("Blockchain Development")
        if any(l in lang_names for l in ["kotlin", "swift", "dart"]):
            matches.append("Mobile Development")
        if any(l in lang_names for l in ["go", "rust"]):
            matches.append("Cloud/Systems Engineering")
        return list(set(matches))[:4]

    async def get_trending_repos(self, language: str = None) -> List[Dict]:
        """Get trending GitHub repos (returns curated list as GitHub API doesn't expose trending)."""
        # Return curated learning resources as GitHub doesn't have a trending API
        trending = [
            {"name": "awesome-python", "stars": 220000, "description": "A curated list of Python resources", "language": "Python"},
            {"name": "system-design-primer", "stars": 270000, "description": "System design interview prep", "language": "Python"},
            {"name": "freeCodeCamp", "stars": 400000, "description": "Learn to code for free", "language": "JavaScript"},
            {"name": "next.js", "stars": 125000, "description": "The React Framework", "language": "JavaScript"},
            {"name": "tensorflow", "stars": 185000, "description": "Machine learning framework", "language": "Python"},
            {"name": "docker-compose", "stars": 32000, "description": "Multi-container Docker applications", "language": "Go"},
        ]
        if language:
            trending = [r for r in trending if r.get("language", "").lower() == language.lower()]
        return trending
