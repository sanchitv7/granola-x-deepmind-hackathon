# ✅ Pre-Demo Checklist

## Before Hackathon Day

### Environment Setup
- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] uv package manager installed
- [ ] Google Gemini API key obtained
- [ ] API key added to `backend/.env`

### Backend Verification
- [ ] Virtual environment exists (`backend/.venv`)
- [ ] Dependencies installed (`uv sync` in backend/)
- [ ] Test script runs successfully (`python test_agents.py`)
- [ ] Backend starts without errors (`uvicorn main:app --reload`)
- [ ] API docs accessible at http://localhost:8000/docs

### Frontend Verification
- [ ] Dependencies installed (`npm install` in frontend/)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Application loads at http://localhost:5173
- [ ] No console errors in browser

### Full Integration Test
- [ ] Create a test job posting
- [ ] Wait for candidate generation (~30-60 seconds)
- [ ] See candidates appearing in UI
- [ ] Accept a candidate
- [ ] See personalized pitch generated
- [ ] Check backend console for email log
- [ ] Reject a candidate
- [ ] See next candidate load
- [ ] Check stats update correctly
- [ ] Click "Source More Candidates"
- [ ] Wait for new batch (~30-60 seconds)
- [ ] See new candidates appear

## Demo Preparation

### Content Ready
- [ ] Pre-written job description (save time during demo)
- [ ] Demo script memorized (see PROJECT_SUMMARY.md)
- [ ] Key talking points noted
- [ ] Backup plan if API fails (screenshots/video)

### Hardware Ready
- [ ] Laptop fully charged
- [ ] Reliable internet connection
- [ ] Browser tabs closed (only demo app)
- [ ] Terminal windows arranged (backend + frontend logs)
- [ ] Screen resolution set for projector

### Practice Runs
- [ ] Full demo practiced 3+ times
- [ ] Timing confirmed (3-5 minutes)
- [ ] Backup demo prepared (in case of issues)
- [ ] Q&A responses prepared

## Day of Hackathon

### Morning Setup (1 Hour Before)
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Verify both running
- [ ] Create one test job to warm up system
- [ ] Close all unnecessary applications
- [ ] Disable notifications
- [ ] Set "Do Not Disturb" mode

### 5 Minutes Before Demo
- [ ] Backend and frontend running
- [ ] Browser at job creation page
- [ ] Job description ready to paste
- [ ] Backend console visible (for email logs)
- [ ] Stats panel visible

### Demo Flow
- [ ] **Hook** (30s): Explain problem
- [ ] **Setup** (30s): Create job posting
- [ ] **Agent Explanation** (1m): Describe what's happening
- [ ] **Review** (1.5m): Show candidate cards, accept one
- [ ] **Source More** (1m): Generate new batch
- [ ] **Wrap-up** (30s): Show stats, explain extensibility

### Post-Demo
- [ ] Answer judge questions
- [ ] Show code architecture (if asked)
- [ ] Explain technical decisions
- [ ] Share GitHub repo (if allowed)

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
```bash
cd backend
source .venv/bin/activate
uv sync
uvicorn main:app --reload
```

### Issue: Frontend won't start
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Candidates not generating
**Check:**
- GOOGLE_API_KEY is set correctly in .env
- Backend console for error messages
- Internet connection is working
- API key hasn't exceeded quota

### Issue: Empty candidate list
**Solution:**
- Wait longer (can take 30-60 seconds)
- Check backend logs for errors
- Refresh frontend page
- Create new job if stuck

### Issue: Pitch not generating
**Check:**
- Accepted candidate shows in backend logs
- Check backend console for Gemini errors
- Verify API key is valid
- Try accepting a different candidate

## Presentation Tips

### Do:
✅ Speak clearly and confidently
✅ Point to specific UI elements
✅ Explain the "why" behind decisions
✅ Show enthusiasm for the problem space
✅ Emphasize multi-agent architecture
✅ Mention extensibility to production

### Don't:
❌ Apologize for missing features
❌ Dwell on technical limitations
❌ Rush through the demo
❌ Ignore questions to finish demo
❌ Get defensive about choices

## Backup Plan

If live demo fails:
1. **Screenshot walkthrough** (prepare beforehand)
2. **Video recording** (record successful run)
3. **Code walkthrough** (show architecture)
4. **Explain what would happen** (talk through flow)

## Key Metrics to Highlight

- **4 AI agents** working together
- **2 hours** implementation time
- **1,400 lines** of clean code
- **25 candidates** generated in 30 seconds
- **0-100 scoring** with explanations
- **Personalized emails** (not templates)

## Judge Questions - Prepared Answers

**"Why not use CrewAI or LangGraph?"**
- Direct implementation saved 60 minutes
- Cleaner, more maintainable code
- Same functionality, less overhead

**"How does matching work?"**
- Multi-factor analysis (skills, experience, location, trajectory)
- All candidates fit in single Gemini context (1M tokens)
- No RAG needed at this scale

**"What about production deployment?"**
- Add LinkedIn API integration
- Switch from SQLite to PostgreSQL
- Enable actual SMTP email sending
- Add authentication and multi-tenancy
- Deploy on AWS/GCP with auto-scaling

**"How is this agentic?"**
- Each agent makes independent decisions
- Sourcing decides candidate archetypes
- Matching weighs multiple factors
- Pitch Writer personalizes tone and content
- Not just filling templates - true reasoning

**"What's the cost?"**
- $0.02 per 1000 candidates with Gemini
- Extremely scalable and cheap
- Could handle 40,000 job postings with $20 credits

## Success Indicators

You've nailed it if:
- ✅ Judges understand the problem you're solving
- ✅ Multi-agent system is clear
- ✅ Demo runs smoothly without errors
- ✅ Judges ask follow-up questions (shows interest)
- ✅ Technical depth is appreciated
- ✅ Utility is obvious

## Post-Hackathon

If you win:
- [ ] Add to portfolio
- [ ] Write blog post about experience
- [ ] Share on LinkedIn/Twitter
- [ ] Clean up code for open source
- [ ] Consider building it further

If you don't win:
- [ ] Still add to portfolio (great project)
- [ ] Learn from feedback
- [ ] Connect with other participants
- [ ] Be proud of what you built!

---

**You've got this!** 🚀

Remember:
- Simple concept, ingenious execution
- Genuine agentic AI, not just prompts
- Solves real problems
- Production-quality thinking

**Go win that Best Project prize!** 🏆
