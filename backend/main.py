"""FastAPI application for agentic recruiter platform."""

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from models import JobCreate, StatsResponse
from database import (
    init_db, create_job, get_job, create_candidate, create_match,
    get_next_candidate, update_candidate_status, get_candidate,
    create_outreach, update_outreach_status, get_job_stats
)
from agents import SourcingAgent, MatchingAgent, PitchWriterAgent, OutreachAgent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    await init_db()
    yield


app = FastAPI(title="Agentic Recruiter API", lifespan=lifespan)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Agent instances
sourcing_agent = SourcingAgent()
matching_agent = MatchingAgent()
pitch_writer_agent = PitchWriterAgent()
outreach_agent = OutreachAgent()


async def process_job_pipeline(job_id: int, count: int = 25):
    """Background task: Run sourcing and matching agents."""
    try:
        # Get job details
        job = await get_job(job_id)
        if not job:
            print(f"Job {job_id} not found")
            return

        print(f"Starting pipeline for job {job_id}: {job['title']}")

        # Step 1: Sourcing Agent - Generate candidates
        print(f"Sourcing {count} candidates...")
        candidates = sourcing_agent.generate_candidates(job, count=count)
        print(f"Generated {len(candidates)} candidates")

        # Save candidates to database
        candidate_ids = []
        for candidate in candidates:
            candidate_id = await create_candidate(
                job_id=job_id,
                name=candidate['name'],
                current_role=candidate['current_role'],
                current_company=candidate['current_company'],
                years_experience=candidate['years_experience'],
                skills=candidate['skills'],
                location=candidate['location'],
                email=candidate['email'],
                linkedin_summary=candidate['linkedin_summary']
            )
            candidate_ids.append(candidate_id)

        print(f"Saved {len(candidate_ids)} candidates to database")

        # Step 2: Matching Agent - Rank candidates
        print("Ranking candidates...")
        matches = matching_agent.rank_candidates(job, candidates)
        print(f"Ranked {len(matches)} candidates")

        # Save matches to database
        for match in matches:
            candidate_idx = match['candidate_index']

            # Validate index is within bounds
            if candidate_idx < 0 or candidate_idx >= len(candidate_ids):
                print(f"Warning: Invalid candidate index {candidate_idx}, skipping match")
                continue

            candidate_id = candidate_ids[candidate_idx]

            await create_match(
                job_id=job_id,
                candidate_id=candidate_id,
                score=match['score'],
                key_highlights=match['key_highlights'],
                fit_reasoning=match['fit_reasoning'],
                rank_position=match['rank_position']
            )

        print(f"Pipeline complete for job {job_id}")

    except Exception as e:
        print(f"Error in pipeline for job {job_id}: {e}")
        import traceback
        traceback.print_exc()


@app.post("/api/jobs")
async def create_job_endpoint(job_data: JobCreate, background_tasks: BackgroundTasks):
    """Create job and trigger candidate sourcing pipeline."""
    job_id = await create_job(
        title=job_data.title,
        description=job_data.description,
        required_skills=job_data.required_skills,
        experience_level=job_data.experience_level,
        location=job_data.location
    )

    # Start background pipeline
    background_tasks.add_task(process_job_pipeline, job_id, count=25)

    return {
        "job_id": job_id,
        "status": "processing",
        "message": "Job created. Generating candidates..."
    }


@app.post("/api/jobs/{job_id}/source-more")
async def source_more_candidates(job_id: int, background_tasks: BackgroundTasks):
    """Generate additional batch of candidates on demand."""
    job = await get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Generate smaller batch for "more" requests
    background_tasks.add_task(process_job_pipeline, job_id, count=15)

    return {
        "status": "sourcing",
        "message": "Generating new candidates..."
    }


@app.get("/api/jobs/{job_id}/candidates")
async def get_next_candidate_endpoint(job_id: int):
    """Get next candidate to review."""
    candidate = await get_next_candidate(job_id)

    if not candidate:
        return {
            "candidate": None,
            "message": "No more candidates available"
        }

    # Parse JSON fields
    skills = json.loads(candidate['skills']) if isinstance(candidate['skills'], str) else candidate['skills']
    key_highlights = json.loads(candidate['key_highlights']) if isinstance(candidate['key_highlights'], str) else candidate['key_highlights']

    # Get stats
    stats = await get_job_stats(job_id)

    return {
        "candidate": {
            "id": candidate['id'],
            "name": candidate['name'],
            "current_role": candidate['current_role'],
            "current_company": candidate['current_company'],
            "years_experience": candidate['years_experience'],
            "skills": skills,
            "location": candidate['location'],
            "email": candidate['email'],
            "linkedin_summary": candidate['linkedin_summary'],
            "status": candidate['status']
        },
        "match": {
            "id": candidate['match_id'],
            "score": candidate['score'],
            "key_highlights": key_highlights,
            "fit_reasoning": candidate['fit_reasoning'],
            "rank_position": candidate['rank_position']
        },
        "stats": stats
    }


@app.put("/api/candidates/{candidate_id}/accept")
async def accept_candidate(candidate_id: int):
    """Accept candidate and generate personalized pitch."""
    candidate = await get_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Update status to accepted
    await update_candidate_status(candidate_id, "accepted")

    # Get job and match details
    job = await get_job(candidate['job_id'])

    # Get match details (need to query separately)
    import aiosqlite
    from database import DB_PATH
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM matches WHERE candidate_id = ?",
            (candidate_id,)
        )
        match_row = await cursor.fetchone()
        match = dict(match_row) if match_row else None

    if not match:
        raise HTTPException(status_code=500, detail="Match data not found")

    # Parse JSON fields
    candidate['skills'] = json.loads(candidate['skills']) if isinstance(candidate['skills'], str) else candidate['skills']
    match['key_highlights'] = json.loads(match['key_highlights']) if isinstance(match['key_highlights'], str) else match['key_highlights']

    # Generate pitch with PitchWriterAgent
    print(f"Generating pitch for candidate {candidate_id}...")
    pitch = pitch_writer_agent.create_pitch(job, candidate, match)

    # Create outreach record
    outreach_id = await create_outreach(
        job_id=candidate['job_id'],
        candidate_id=candidate_id,
        subject=pitch['subject'],
        body=pitch['body'],
        delivery_status="pending"
    )

    # Send email with OutreachAgent
    success, message = outreach_agent.send_email(
        to_email=candidate['email'],
        subject=pitch['subject'],
        body=pitch['body']
    )

    # Update outreach status
    from datetime import datetime
    if success:
        await update_outreach_status(outreach_id, "sent", datetime.now())
        await update_candidate_status(candidate_id, "contacted")
    else:
        await update_outreach_status(outreach_id, "failed", error_message=message)

    return {
        "status": "success" if success else "failed",
        "pitch": pitch,
        "delivery_message": message
    }


@app.put("/api/candidates/{candidate_id}/reject")
async def reject_candidate(candidate_id: int):
    """Reject candidate."""
    candidate = await get_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    await update_candidate_status(candidate_id, "rejected")

    # Get next candidate
    next_candidate = await get_next_candidate(candidate['job_id'])

    if not next_candidate:
        return {
            "status": "success",
            "next_candidate": None,
            "message": "No more candidates available"
        }

    # Parse JSON fields
    skills = json.loads(next_candidate['skills']) if isinstance(next_candidate['skills'], str) else next_candidate['skills']
    key_highlights = json.loads(next_candidate['key_highlights']) if isinstance(next_candidate['key_highlights'], str) else next_candidate['key_highlights']

    return {
        "status": "success",
        "next_candidate": {
            "candidate": {
                "id": next_candidate['id'],
                "name": next_candidate['name'],
                "current_role": next_candidate['current_role'],
                "current_company": next_candidate['current_company'],
                "years_experience": next_candidate['years_experience'],
                "skills": skills,
                "location": next_candidate['location'],
                "email": next_candidate['email'],
                "linkedin_summary": next_candidate['linkedin_summary']
            },
            "match": {
                "score": next_candidate['score'],
                "key_highlights": key_highlights,
                "fit_reasoning": next_candidate['fit_reasoning'],
                "rank_position": next_candidate['rank_position']
            }
        }
    }


@app.get("/api/jobs/{job_id}/stats")
async def get_stats(job_id: int):
    """Get job statistics."""
    stats = await get_job_stats(job_id)
    return stats


@app.get("/")
async def root():
    """Health check."""
    return {"status": "ok", "message": "Agentic Recruiter API"}
