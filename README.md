# 🧭 CareerCompass AI

> AI-Powered Career Path Prediction & Skill Gap Analysis System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

CareerCompass AI is a production-ready SaaS platform that uses **GPT-4** and rule-based ML to help professionals:

- 🎯 Predict ideal career paths with confidence scores
- 📊 Analyze skill gaps for any target role
- 📄 Score resumes for ATS compatibility
- 🤖 Chat with an AI career mentor
- 💼 Get personalized job recommendations
- 🗺️ Follow step-by-step learning roadmaps
- 🐙 Analyze GitHub profiles for tech career signals
- 💰 Predict salaries with location + skill multipliers

---

## 📸 Screenshots

| Landing Page | Dashboard | Career Prediction |
|---|---|---|
| Hero with animated career cards | Analytics with Recharts | AI skill matching |

| AI Mentor | Resume Analysis | Skill Gap |
|---|---|---|
| GPT-4 chat interface | ATS score + roast mode | Visual gap tracker |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                   Nginx                      │
│            (Reverse Proxy + SSL)             │
└──────────┬───────────────────┬──────────────┘
           │                   │
    ┌──────▼──────┐     ┌─────▼──────┐
    │  Next.js 15  │     │  FastAPI   │
    │  (Frontend)  │     │  (Backend) │
    │  Port: 3000  │     │  Port: 8000│
    └─────────────┘     └─────┬──────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
       ┌──────▼──────┐ ┌─────▼────┐ ┌───────▼───────┐
       │ PostgreSQL   │ │  Redis   │ │  OpenAI/Gemini │
       │ (Database)   │ │ (Cache)  │ │  (AI Services) │
       └─────────────┘ └──────────┘ └───────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 18, TypeScript 5 |
| **Styling** | Tailwind CSS 3.4, Framer Motion 11, Glass Morphism |
| **State** | Zustand (auth), TanStack Query v5 (server state) |
| **Backend** | FastAPI 0.110, Python 3.11, Pydantic v2 |
| **Database** | PostgreSQL 15, SQLAlchemy 2.0 (async), asyncpg |
| **Cache** | Redis 7 |
| **AI/ML** | OpenAI GPT-4 Turbo, Google Gemini, Rule-based fallback |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **DevOps** | Docker Compose, Nginx, Gunicorn + Uvicorn workers |

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) ≥ 4.0
- [Node.js](https://nodejs.org) ≥ 20 (for local development)
- [Python](https://python.org) ≥ 3.11 (for local development)

### 1. Clone & Configure

```bash
git clone https://github.com/yourusername/careercompass-ai.git
cd careercompass-ai
cp .env.example .env
```

Edit `.env` — **required** keys:

```env
SECRET_KEY=your-super-secret-key-change-this-in-production
OPENAI_API_KEY=sk-...                      # Get from platform.openai.com
DATABASE_URL=postgresql://postgres:postgres@db:5432/careercompass
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Optional (but recommended):
```env
GEMINI_API_KEY=...                         # Get from aistudio.google.com
GITHUB_TOKEN=...                           # GitHub Personal Access Token
```

### 2. Launch with Docker

```bash
docker compose up --build
```

That's it! Services start at:
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

### Demo Account
```
Email: demo@careercompassai.com
Password: Demo@1234
```

---

## 💻 Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download NLP models
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt stopwords

# Set environment variables (copy from root .env)
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careercompass
export SECRET_KEY=local-dev-secret

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
# Edit NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

### Database (local)

```bash
# Start just PostgreSQL via Docker
docker compose up db -d

# The backend auto-creates tables on startup via create_tables()
```

---

## 📁 Project Structure

```
careercompass-ai/
├── docker-compose.yml          # Full production orchestration
├── .env.example                # Environment variable template
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── init.sql                # DB extensions (uuid-ossp, pg_trgm)
│   └── app/
│       ├── main.py             # FastAPI app + middleware + routers
│       ├── core/
│       │   ├── config.py       # Pydantic Settings
│       │   ├── database.py     # Async SQLAlchemy engine
│       │   └── security.py     # JWT + bcrypt utilities
│       ├── models/             # SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── resume.py
│       │   ├── career.py
│       │   └── skill.py
│       ├── schemas/
│       │   └── schemas.py      # All Pydantic v2 schemas
│       ├── api/v1/             # REST API endpoints
│       │   ├── auth.py         # Register, login, refresh, logout
│       │   ├── users.py        # Profile CRUD
│       │   ├── resume.py       # Upload, analyze, roast, ATS check
│       │   ├── career.py       # Predict, roadmap, trending
│       │   ├── skills.py       # Gap analysis, trending, categories
│       │   ├── jobs.py         # Recommendations, search
│       │   ├── chatbot.py      # AI mentor chat
│       │   ├── github.py       # Profile analysis
│       │   ├── salary.py       # Prediction, benchmarks
│       │   └── admin.py        # Platform stats, user management
│       └── services/           # Business logic + ML
│           ├── career_service.py   # Career prediction ML
│           ├── resume_service.py   # PDF/DOCX parsing + ATS
│           ├── chatbot_service.py  # GPT-4 → Gemini → fallback
│           ├── skill_service.py    # Skill gap analysis
│           ├── github_service.py   # GitHub API integration
│           ├── salary_service.py   # Salary prediction
│           └── job_service.py      # Job recommendations
│
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    ├── next.config.js
    └── app/
        ├── layout.tsx           # Root layout + providers
        ├── page.tsx             # Landing page
        ├── globals.css          # Design system CSS
        ├── (auth)/
        │   ├── layout.tsx       # Split-panel auth layout
        │   ├── login/page.tsx
        │   └── register/page.tsx
        └── (dashboard)/
            ├── layout.tsx       # Protected layout + sidebar
            ├── dashboard/       # Analytics overview
            ├── career-prediction/
            ├── skill-gap/
            ├── resume/
            ├── ai-mentor/       # GPT-4 chat interface
            ├── jobs/
            ├── roadmap/
            ├── github-analysis/
            ├── salary/
            ├── profile/
            └── admin/           # Admin-only panel
```

---

## 🔌 API Reference

Full interactive docs at: `http://localhost:8000/docs`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login (returns JWT tokens) |
| POST | `/api/v1/career/predict` | AI career path prediction |
| POST | `/api/v1/skills/analyze-gap` | Skill gap analysis |
| POST | `/api/v1/resume/upload` | Upload + analyze resume |
| POST | `/api/v1/chatbot/chat` | Chat with AI mentor |
| GET | `/api/v1/github/analyze/{username}` | GitHub profile analysis |
| POST | `/api/v1/salary/predict` | Salary prediction |

### Authentication

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123"}'

# Use token
curl http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer <access_token>"
```

---

## 🌐 Deployment

### Option A: Full Docker (Recommended)

```bash
# Production build
docker compose -f docker-compose.yml up -d --build

# With Nginx + SSL (requires domain)
# Add your SSL certs to nginx/certs/
```

### Option B: Vercel + Render + Supabase (Free Tier)

**Frontend → Vercel**
```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your Render backend URL
```

**Backend → Render**
1. New Web Service → Connect GitHub repo
2. Root Directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`

**Database → Supabase**
1. Create project at supabase.com
2. Copy PostgreSQL connection string
3. Set `DATABASE_URL` in Render environment

### Option C: Railway (One-Click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Connect GitHub repo
2. Deploy both `backend/` and `frontend/` services
3. Add PostgreSQL + Redis addons
4. Configure environment variables

---

## ⚙️ Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | ✅ | JWT signing key (min 32 chars) |
| `DATABASE_URL` | ✅ | PostgreSQL connection URL |
| `OPENAI_API_KEY` | ⭐ | GPT-4 API key (degrades gracefully without) |
| `GEMINI_API_KEY` | Optional | Google Gemini fallback |
| `GITHUB_TOKEN` | Optional | GitHub API rate limit (5000/hr vs 60/hr) |
| `REDIS_URL` | Optional | Redis for caching (falls back to memory) |
| `SMTP_HOST` | Optional | Email notifications |
| `AWS_ACCESS_KEY_ID` | Optional | S3 for resume storage |

---

## 🧠 AI Features

### Career Prediction
- Compares your skills against a curated `CAREER_SKILL_MAP` (10 career paths, 50+ skills each)
- String similarity matching + interest weighting
- Returns confidence percentages, salary ranges, readiness score, immediate actions
- Gracefully works **without an OpenAI key** via rule-based scoring

### Resume Analysis
- Extracts text from PDF (pdfplumber) and DOCX (python-docx)
- Detects 60+ skills via regex pattern matching
- Calculates ATS score: section presence (40%) + formatting (30%) + content quality (30%)
- AI feedback via GPT-4 (falls back to rule-based if no API key)
- **Roast Mode**: Brutal honest feedback on resume weaknesses

### AI Mentor Chatbot
- System prompt: specialized career advisor persona
- Chain: GPT-4 → Gemini → rule-based fallback responses
- Context-aware: detects salary/interview/learning/resume query types
- Session persistence via database

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e  # Requires running app
```

---

## 🔒 Security

- **JWT tokens**: Access (30 min) + Refresh (7 days)
- **Passwords**: bcrypt with 12 rounds
- **CORS**: Configured per-environment via `ALLOWED_ORIGINS`
- **Rate limiting**: slowapi (100 req/min default)
- **Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Input validation**: Pydantic v2 with strict types
- **SQL injection**: SQLAlchemy ORM parameterized queries only

---

## 📊 Performance

- **Frontend**: Static generation for public pages, ISR for dynamic
- **Backend**: Async SQLAlchemy + asyncpg (non-blocking DB)
- **AI**: Background tasks for resume analysis (non-blocking uploads)
- **Caching**: React Query (60s stale time), Redis for repeated ML results

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Google](https://ai.google.dev) for Gemini API
- [Vercel](https://vercel.com) for Next.js and hosting
- [shadcn/ui](https://ui.shadcn.com) for component inspiration

---

<p align="center">
  Made with ❤️ for the next generation of tech professionals
  <br/>
  <a href="https://careercompassai.com">careercompassai.com</a>
</p>
