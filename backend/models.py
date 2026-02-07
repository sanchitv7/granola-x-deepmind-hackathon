"""Pydantic models for API requests and responses."""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    experience_level: str
    location: str


class Job(JobCreate):
    id: int
    created_at: datetime


class Candidate(BaseModel):
    id: int
    job_id: int
    name: str
    current_role: str
    current_company: str
    years_experience: int
    skills: List[str]
    location: str
    email: str
    linkedin_summary: str
    status: str
    created_at: datetime


class Match(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    score: int
    key_highlights: List[str]
    fit_reasoning: str
    rank_position: int
    created_at: datetime


class CandidateWithMatch(BaseModel):
    candidate: Candidate
    match: Match


class Outreach(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    subject: str
    body: str
    sent_at: Optional[datetime]
    delivery_status: str
    error_message: Optional[str]
    created_at: datetime


class StatsResponse(BaseModel):
    total: int
    pending: int
    viewed: int
    accepted: int
    rejected: int
    contacted: int
