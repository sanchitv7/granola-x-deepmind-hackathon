# 🚀 Quick Start Guide

## Prerequisites

- Python 3.11+ (with uv installed)
- Node.js 18+ (with npm)
- Google Gemini API key

## Setup (5 Minutes)

### 1. Get Your Gemini API Key

Visit: https://aistudio.google.com/apikey

- Click "Get API Key" or "Create API Key"
- Copy the API key (starts with "AIza...")

### 2. Configure Environment

Edit `backend/.env` and add your API key:

```bash
GOOGLE_API_KEY=AIza...your_actual_key_here
```

### 3. Start the Application

#### Option A: Use the Start Script (Recommended)

```bash
./start.sh
```

This will start both backend and frontend servers.

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Open the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Usage

### Create a Job

1. Fill out the job form:
   - **Title**: e.g., "Senior Full-Stack Engineer"
   - **Description**: Brief role description
   - **Skills**: e.g., "React, Node.js, PostgreSQL, AWS"
   - **Experience Level**: Senior
   - **Location**: e.g., "Remote (US)"

2. Click "Create Job & Start Sourcing"

3. Wait 30-60 seconds for agents to generate candidates

### Review Candidates

- Use **keyboard shortcuts**:
  - `←` or `X` to reject
  - `→` or `Enter` to accept
- Or click the **on-screen buttons**

### Accept a Candidate

When you accept:
1. Pitch Writer Agent creates personalized email
2. Modal shows the generated email
3. Email is sent (in demo mode, logged to console)
4. Candidate marked as "contacted"

### Source More Candidates

When running low on candidates:
- Click "Source More Candidates" button
- Wait 30-60 seconds for new batch
- Continue reviewing

## Testing the Backend

```bash
cd backend
source .venv/bin/activate
python test_agents.py
```

This will verify:
- Gemini API key is working
- Sourcing Agent can generate candidates
- Matching Agent can rank candidates

## Troubleshooting

### "GOOGLE_API_KEY not configured"

Make sure you've:
1. Created `backend/.env` (copy from `.env.example`)
2. Added your actual Gemini API key
3. API key starts with "AIza..."

### Backend won't start

```bash
cd backend
source .venv/bin/activate
uv sync  # Reinstall dependencies if needed
```

### Frontend won't start

```bash
cd frontend
npm install  # Reinstall dependencies
npm run dev
```

### Database issues

Delete the database and restart:
```bash
rm backend/recruiter.db
# Restart backend - database will be recreated
```

### API errors

Check backend logs in terminal for detailed error messages.

## Demo Tips

1. **Prepare a good job description** beforehand
2. **Let the sourcing finish** before demo (30-60 seconds)
3. **Show keyboard shortcuts** - fast reviewing impresses
4. **Accept one candidate** to show pitch generation
5. **Use "Source More"** to show agents working multiple times
6. **Check console** for email logs

## Architecture

```
Frontend (React)
    ↓ HTTP
Backend (FastAPI)
    ↓ Async
Agents (Gemini)
    ↓ Data
Database (SQLite)
```

## Files to Check

- `backend/main.py` - API routes
- `backend/agents.py` - AI agents
- `frontend/src/App.jsx` - Main UI
- `frontend/src/components/CandidateSwiper.jsx` - Review interface

## Next Steps

After basic setup works:

1. **Test the full flow** (create job → review → accept)
2. **Read PROJECT_SUMMARY.md** for architecture details
3. **Practice the demo** (aim for 3-5 minutes)
4. **Customize job descriptions** for your target audience

## Support

- Check `README.md` for detailed documentation
- See `PROJECT_SUMMARY.md` for architecture deep dive
- Backend API docs: http://localhost:8000/docs

---

**Ready to demo?** 🎉

1. Start servers (`./start.sh`)
2. Open http://localhost:5173
3. Create a job
4. Review candidates
5. Show off the multi-agent magic!
