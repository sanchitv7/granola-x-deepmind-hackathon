# GEMINI.md - Instructional Context

This file provides comprehensive context and instructions for AI agents (like Gemini) interacting with the **Agentic Recruiter Platform** codebase.

## 🚀 Project Overview

The **Agentic Recruiter Platform** is an AI-powered recruitment assistant designed to automate candidate sourcing, matching, personalized outreach, and tracking. It employs a genuine multi-agent system orchestrated sequentially to handle the recruitment workflow efficiently.

### 🏗️ Architecture: Multi-Agent Sequential Pipeline

The system consists of four specialized agents communicating via shared database state (SQLite):

1.  **Sourcing Agent:** Generates realistic candidate profiles based on job requirements (Title, Company, Description, Skills, etc.).
2.  **Matching Agent:** Ranks candidates with AI-powered fit scoring (0-100) and providing detailed reasoning.
3.  **Pitch Writer Agent:** Creates personalized outreach emails for high-scoring candidates.
4.  **Outreach Agent:** Manages email delivery (SMTP) and tracking.

**Batching Optimization:** The pipeline processes candidates in batches (default: 5) to ensure the UI starts showing results quickly while processing continues in the background.

## 🛠️ Tech Stack

-   **Backend:** FastAPI (Python), aiosqlite (Async SQLite), Google Gemini SDK (`google-genai`), `python-dotenv`.
-   **Frontend:** React 18, Vite, Tailwind CSS, React Context, Axios, Framer Motion (for animations).
-   **Alternative Frontend:** `frontend-neo` features a **neobrutalist** design with skeuomorphic animations and a horizontal layout.

## 🏗️ Building and Running

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Gemini API Key (set as `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `backend/.env`)

### Fast Start
Run the root `start.sh` script to launch both backend and frontend (Neo) simultaneously:
```bash
./start.sh
```

### Manual Execution

#### Backend
```bash
cd backend
# Setup venv and install dependencies (e.g., using uv)
source .venv/bin/activate
uvicorn main:app --reload
```
Runs at: http://localhost:8000 | API Docs: http://localhost:8000/docs

#### Frontend (Neo)
```bash
cd frontend-neo
npm install
npm run dev
```
Runs at: http://localhost:5174

## 📜 Development Conventions

### Agent Implementation Pattern
- Agents are classes in `backend/agents.py`.
- They use `client.aio.models.generate_content` for async Gemini calls.
- Structured outputs are enforced using `response_json_schema`.
- Prompts are the primary driver of agent behavior and should be updated to refine decision-making.

### State Management
- **Backend:** Shared SQLite database (`recruiter.db`). Schema defined in `backend/schema.sql`.
- **Frontend:** Global state managed via `AppContext.jsx`.

### UI/UX (Neo Frontend)
- **Design Style:** Neobrutalist (thick borders, hard shadows, vibrant colors, "Space Grotesk" font).
- **Animations:** Skeuomorphic card swipes using `framer-motion`.
- **Layout:** Strictly horizontal, fitting within a single screen pane.
- **Shortcuts:** `←`/`X` to reject, `→`/`Enter` to accept.

### API and Background Tasks
- Long-running agent pipelines are executed as FastAPI `BackgroundTasks`.
- Polling is used in the frontend to refresh stats and fetch newly matched candidates.

## 🧪 Testing
Run agent verification script to test API key and core agent logic:
```bash
cd backend
python test_agents.py
```

## 📂 Key Files
- `backend/main.py`: API endpoints and agent orchestration logic.
- `backend/agents.py`: Implementations of the four AI agents.
- `backend/database.py`: Async database CRUD operations.
- `frontend-neo/src/context/AppContext.jsx`: Frontend state and API interaction.
- `frontend-neo/src/components/CandidateSwiper.jsx`: Main swipe-style review interface.
