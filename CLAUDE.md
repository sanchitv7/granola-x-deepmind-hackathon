# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI-powered recruiting assistant that demonstrates a genuine multi-agent system. The platform automates candidate sourcing, matching, personalized outreach, and tracking with a swipe-style UI. Built for a hackathon in ~2 hours to showcase agentic AI without heavyweight frameworks.

**Key Philosophy:** Simple agents (focused prompts + decision logic) orchestrated sequentially, not complex frameworks. Direct implementation over abstraction.

## Architecture

### Multi-Agent Sequential Pipeline

Four specialized agents communicate via shared database state (not direct messaging):

```
Job Created → Sourcing Agent (generates 25 candidates)
           ↓
           Matching Agent (ranks with 0-100 scores)
           ↓
           Database (stores candidates + matches)
           ↓
           User reviews via UI
           ↓
           Accept → Pitch Writer Agent (personalized email)
                 ↓
                 Outreach Agent (sends email)
```

**Why sequential?** Simpler to implement and debug than orchestrator pattern. Each agent completes before next starts.

**Why no framework?** At this scale (25 candidates), direct implementation is faster (20 min vs 60+ min for framework setup). Agents are just classes with focused prompts and Gemini API calls.

### Tech Stack

**Backend:**
- FastAPI with async/await throughout
- SQLite (file-based, zero config)
- Google Gemini API (`google-genai` SDK with `gemini-3-flash-preview` model)
- Background tasks via FastAPI for agent pipeline
- `python-dotenv` for environment variables

**Frontend:**
- React 18 + Vite
- Tailwind CSS v3 (stable)
- React Context for global state (simpler than Redux)
- Axios for API calls
- Keyboard shortcuts (← reject, → accept)

**Database Schema:**
- `jobs` - Role requirements
- `candidates` - AI-generated profiles with status tracking
- `matches` - Scores, highlights, reasoning per candidate
- `outreach` - Email delivery tracking

## Development Commands

### Backend

```bash
cd backend

# Install dependencies (only needed once)
uv sync

# Activate virtual environment
source .venv/bin/activate

# Run backend server (auto-reloads on changes)
uvicorn main:app --reload

# Test agents (verifies API key and agent functionality)
python test_agents.py
```

**Backend runs at:** http://localhost:8000
**API docs:** http://localhost:8000/docs

### Frontend

```bash
cd frontend

# Install dependencies (only needed once)
npm install

# Run dev server (auto-reloads on changes)
npm run dev

# Build for production
npm run build
```

**Frontend runs at:** http://localhost:5173

### Environment Setup

**Required:** `backend/.env` file with:
```bash
GEMINI_API_KEY=your_api_key_here
```

Get API key from: https://aistudio.google.com/apikey

**Note:** Code accepts both `GEMINI_API_KEY` (standard) and `GOOGLE_API_KEY` (legacy) for backward compatibility.

## Key Implementation Details

### Agent Implementation Pattern

Agents are simple classes that call Gemini with structured JSON schemas. No framework needed.

**Example structure:**
```python
class SourcingAgent:
    def generate_candidates(self, job, count=25):
        # 1. Construct focused prompt
        # 2. Define JSON schema
        # 3. Call Gemini with schema
        # 4. Return parsed JSON
```

**Critical:** Always use lazy client initialization (`get_client()`) to avoid API key errors during imports. The client is created only when first needed, after `.env` is loaded.

### Gemini API Usage

**Current SDK:** `google-genai` (the `google-generativeai` package is deprecated)

**Model:** `gemini-3-flash-preview` (experimental, latest)

**Structured outputs:** Use `response_json_schema` parameter for reliable JSON parsing:
```python
response = get_client().models.generate_content(
    model='gemini-3-flash-preview',
    contents=prompt,
    config=types.GenerateContentConfig(
        response_mime_type='application/json',
        response_json_schema=schema  # or Pydantic model
    )
)
```

This eliminates manual markdown cleanup and reduces parsing errors.

### FastAPI Background Tasks

The agent pipeline runs as a background task to avoid blocking the API response:

```python
@app.post("/api/jobs")
async def create_job(job_data: JobCreate, background_tasks: BackgroundTasks):
    job_id = await create_job(...)
    background_tasks.add_task(process_job_pipeline, job_id)
    return {"job_id": job_id, "status": "processing"}
```

User gets immediate response, agents run async. Monitor progress via backend console logs.

### React State Management

**Global state:** React Context (`AppContext.jsx`) holds:
- `jobId` - Current job being reviewed
- `currentCandidate` - Active candidate with match data
- `stats` - Progress tracking (accepted, rejected, etc.)
- `pitch` - Generated email when candidate accepted
- `loading` - UI loading state

**Why Context not Redux?** Simpler for single-job workflow. No need for complex action/reducer patterns.

### CORS Configuration

Backend allows ports 5173, 5174, and 3000. If frontend runs on different port, update `main.py` CORS middleware:

```python
allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
```

### Database Migrations

No migration system (it's SQLite with simple schema). To reset:
```bash
rm backend/recruiter.db
# Restart backend - database recreates automatically
```

Schema defined in `backend/schema.sql`, initialized on startup via `init_db()`.

## Common Workflows

### Adding a New Agent

1. Add agent class to `backend/agents.py`
2. Define Pydantic model for structured output
3. Call Gemini with `response_json_schema`
4. Instantiate agent in `main.py`
5. Integrate into pipeline or endpoint

### Modifying Agent Prompts

Agent behavior is primarily controlled by prompts, not code. To change output:
1. Edit prompt in agent class method
2. Adjust JSON schema if output structure changes
3. Test with `test_agents.py`

### Adding API Endpoints

Follow existing pattern in `main.py`:
- Use async/await
- Import database functions from `database.py`
- Return Pydantic models or dicts
- Add CORS if needed

### Updating UI Components

Components are in `frontend/src/components/`. State flows:
- App.jsx → AppContext → Components
- Use `useApp()` hook to access context
- Update context methods for new API calls

## Testing

**Backend agents:**
```bash
cd backend
source .venv/bin/activate
python test_agents.py
```

Tests Sourcing and Matching agents with sample job. Should complete in 10-20 seconds.

**API endpoints:**
- Use FastAPI docs: http://localhost:8000/docs
- Or curl: `curl http://localhost:8000/api/jobs/1/candidates`

**Full integration:**
1. Start both servers
2. Create job in UI
3. Wait 30-60 seconds for agent pipeline
4. Review candidates
5. Accept one to trigger pitch generation
6. Check backend console for email logs

## Troubleshooting

**"GEMINI_API_KEY not set"**
- Ensure `backend/.env` exists with valid API key
- Check `load_dotenv()` is called in `main.py` before imports
- Verify lazy client initialization in `agents.py`

**CORS errors**
- Check frontend port matches backend CORS config
- Frontend should be on 5173, 5174, or 3000

**No candidates generated**
- Check backend console for errors
- Verify API key is valid (test with `test_agents.py`)
- Ensure Gemini API quota not exceeded
- Pipeline takes 30-60 seconds - be patient

**Candidates not appearing in UI**
- Check backend logs for pipeline completion
- Refresh frontend page
- Verify `jobId` is set in React context
- Check browser console for errors

## Email Configuration

**Demo mode (default):** Emails logged to backend console, not sent.

**To enable SMTP:**
1. Add credentials to `backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```
2. Uncomment SMTP code in `agents.py` OutreachAgent.send_email()

**Note:** Gmail requires app-specific password, not regular password. Generate at: Google Account → Security → 2-Step Verification → App passwords

## Design Decisions

**Why SQLite?** Zero config, perfect for demo/hackathon. Upgrade to PostgreSQL for production.

**Why no RAG?** At 25-candidate scale, all fit in single Gemini context (1M tokens). RAG adds complexity without benefit. Only needed at 10,000+ candidates.

**Why sequential agents?** Easier to implement and debug than parallel/orchestrator patterns. Each step waits for previous. Good enough for 30-60 second pipeline.

**Why Tailwind v3?** v4 had PostCSS plugin issues. v3 is stable and well-supported.

**Why keyboard shortcuts?** Speeds up candidate review 3-5x. Critical for demo to show efficiency.

## Project Structure

```
backend/
├── main.py           # FastAPI app, routes, background pipeline
├── agents.py         # 4 agent classes with Gemini calls
├── database.py       # SQLite CRUD operations
├── models.py         # Pydantic schemas for API
├── schema.sql        # Database table definitions
├── test_agents.py    # Agent verification script
└── .env             # API keys (gitignored)

frontend/src/
├── App.jsx                    # Root component with routing
├── context/AppContext.jsx     # Global state management
├── components/
│   ├── JobForm.jsx           # Role requirements input
│   ├── CandidateCard.jsx     # Profile display
│   ├── CandidateSwiper.jsx   # Main review interface
│   ├── SwipeControls.jsx     # Accept/reject buttons
│   ├── PitchModal.jsx        # Email preview
│   └── StatsPanel.jsx        # Progress tracking
└── hooks/
    └── useKeyboardShortcuts.js
```

## Performance Notes

**Gemini API costs:**
- ~$0.02 per 1000 candidates generated
- Pipeline: ~25 candidates + matching + pitch = ~$0.001 per job
- Very cheap for demo/hackathon use

**Pipeline timing:**
- Sourcing 25 candidates: 15-30 seconds
- Matching all candidates: 10-20 seconds
- Pitch generation: 3-5 seconds per accept
- Total first load: 30-60 seconds

**Optimization opportunities (future):**
- Parallel agent calls where possible
- Cache common candidate patterns
- Batch pitch generation
- WebSockets for real-time progress

## Deployment Notes

This is a hackathon/demo project. For production:
- Switch SQLite → PostgreSQL
- Add authentication (user accounts, sessions)
- Enable real SMTP (not console logging)
- Add LinkedIn API integration (real profiles)
- Implement rate limiting
- Add proper error boundaries
- Set up monitoring/logging
- Deploy backend to AWS/GCP, frontend to Vercel/Netlify

## Additional Documentation

- `README.md` - Setup and usage instructions
- `PROJECT_SUMMARY.md` - Architecture deep dive and hackathon context
- `QUICKSTART.md` - 5-minute setup guide
- `CHECKLIST.md` - Pre-demo verification steps
- `UPDATED_API_NOTES.md` - Gemini API migration details
