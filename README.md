# job-goblin

Recruiters spend most of their time on work that doesn't require human judgment — parsing resumes, writing first-touch emails, tracking who's been contacted. job-goblin automates that layer so recruiters can focus on the conversations that actually matter.

It runs a pipeline of four AI agents: one sources candidates, one scores them against the role, one drafts a personalized outreach email, and one sends it. The recruiter's job is just to swipe — accept the candidates worth pursuing, reject the rest.

## How it works

1. Create a job posting with title, skills, experience level, and location
2. The sourcing and matching agents run in the background (~30-60 seconds)
3. Review candidates one by one — `→` to accept, `←` to reject
4. On accept, the pitch writer generates a personalized email and the outreach agent sends it
5. Source more candidates on demand if the initial batch isn't enough

## Stack

- **Backend:** FastAPI, SQLite, Google Gemini API (`gemini-2.0-flash`)
- **Frontend:** React + Vite, Tailwind CSS v3, Framer Motion

## Setup

```bash
# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > backend/.env

# Run both servers
./start.sh
```

Or separately:

```bash
# Backend
cd backend && uv sync
.venv/bin/uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

Backend runs at `http://localhost:8000`, frontend at `http://localhost:5173`.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job and trigger pipeline |
| GET | `/api/jobs/{id}/candidates` | Next candidate to review |
| PUT | `/api/candidates/{id}/accept` | Accept and generate pitch |
| PUT | `/api/candidates/{id}/reject` | Reject |
| GET | `/api/jobs/{id}/stats` | Review stats |
| POST | `/api/jobs/{id}/source-more` | Generate more candidates |
| GET | `/api/jobs/{id}/pipeline-events` | SSE stream for pipeline progress |

## Notes

- Candidates are AI-generated profiles, not real people
- Email delivery logs to console by default; configure `SMTP_*` vars in `backend/.env` to send real emails
- Reset the database by deleting `backend/recruiter.db`
