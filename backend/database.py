"""Database connection and CRUD operations."""

import aiosqlite
import json
from typing import List, Optional, Dict, Any
from datetime import datetime
from pathlib import Path


DB_PATH = Path(__file__).parent / "recruiter.db"


async def init_db():
    """Initialize database with schema."""
    schema_path = Path(__file__).parent / "schema.sql"
    schema = schema_path.read_text()

    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript(schema)
        await db.commit()


async def create_job(title: str, description: str, required_skills: List[str],
                     experience_level: str, location: str) -> int:
    """Create a new job posting."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """INSERT INTO jobs (title, description, required_skills, experience_level, location)
               VALUES (?, ?, ?, ?, ?)""",
            (title, description, json.dumps(required_skills), experience_level, location)
        )
        await db.commit()
        return cursor.lastrowid


async def get_job(job_id: int) -> Optional[Dict[str, Any]]:
    """Get job by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return None


async def create_candidate(job_id: int, name: str, current_role: str, current_company: str,
                          years_experience: int, skills: List[str], location: str,
                          email: str, linkedin_summary: str) -> int:
    """Create a new candidate."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """INSERT INTO candidates
               (job_id, name, current_role, current_company, years_experience,
                skills, location, email, linkedin_summary)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (job_id, name, current_role, current_company, years_experience,
             json.dumps(skills), location, email, linkedin_summary)
        )
        await db.commit()
        return cursor.lastrowid


async def create_match(job_id: int, candidate_id: int, score: int,
                      key_highlights: List[str], fit_reasoning: str, rank_position: int) -> int:
    """Create a match record."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """INSERT INTO matches
               (job_id, candidate_id, score, key_highlights, fit_reasoning, rank_position)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (job_id, candidate_id, score, json.dumps(key_highlights), fit_reasoning, rank_position)
        )
        await db.commit()
        return cursor.lastrowid


async def get_next_candidate(job_id: int) -> Optional[Dict[str, Any]]:
    """Get the highest-ranked pending candidate and mark as viewed."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Get next pending candidate with highest rank
        cursor = await db.execute(
            """SELECT c.*, m.score, m.key_highlights, m.fit_reasoning, m.rank_position, m.id as match_id
               FROM candidates c
               JOIN matches m ON c.id = m.candidate_id
               WHERE c.job_id = ? AND c.status = 'pending'
               ORDER BY m.rank_position ASC
               LIMIT 1""",
            (job_id,)
        )
        row = await cursor.fetchone()

        if row:
            candidate = dict(row)
            # Mark as viewed
            await db.execute(
                "UPDATE candidates SET status = 'viewed' WHERE id = ?",
                (candidate['id'],)
            )
            await db.commit()
            return candidate

        return None


async def update_candidate_status(candidate_id: int, status: str):
    """Update candidate status."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "UPDATE candidates SET status = ? WHERE id = ?",
            (status, candidate_id)
        )
        await db.commit()


async def get_candidate(candidate_id: int) -> Optional[Dict[str, Any]]:
    """Get candidate by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,))
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return None


async def create_outreach(job_id: int, candidate_id: int, subject: str, body: str,
                         delivery_status: str = "pending", error_message: str = None) -> int:
    """Create outreach record."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """INSERT INTO outreach (job_id, candidate_id, subject, body, delivery_status, error_message)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (job_id, candidate_id, subject, body, delivery_status, error_message)
        )
        await db.commit()
        return cursor.lastrowid


async def update_outreach_status(outreach_id: int, status: str, sent_at: datetime = None,
                                error_message: str = None):
    """Update outreach delivery status."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """UPDATE outreach
               SET delivery_status = ?, sent_at = ?, error_message = ?
               WHERE id = ?""",
            (status, sent_at, error_message, outreach_id)
        )
        await db.commit()


async def get_job_stats(job_id: int) -> Dict[str, int]:
    """Get statistics for a job."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'viewed' THEN 1 ELSE 0 END) as viewed,
                SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted
               FROM candidates
               WHERE job_id = ?""",
            (job_id,)
        )
        row = await cursor.fetchone()
        return {
            "total": row[0] or 0,
            "pending": row[1] or 0,
            "viewed": row[2] or 0,
            "accepted": row[3] or 0,
            "rejected": row[4] or 0,
            "contacted": row[5] or 0
        }
