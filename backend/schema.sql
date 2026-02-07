-- Database schema for agentic recruiter platform

CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_website TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT NOT NULL,  -- JSON array
    experience_level TEXT NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    current_role TEXT NOT NULL,
    current_company TEXT NOT NULL,
    years_experience INTEGER NOT NULL,
    skills TEXT NOT NULL,  -- JSON array
    location TEXT NOT NULL,
    email TEXT NOT NULL,
    linkedin_summary TEXT NOT NULL,
    linkedin_url TEXT,
    company_website TEXT,
    status TEXT DEFAULT 'pending',  -- pending, viewed, accepted, rejected, contacted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    score INTEGER NOT NULL,  -- 0-100
    key_highlights TEXT NOT NULL,  -- JSON array
    fit_reasoning TEXT NOT NULL,
    rank_position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE TABLE IF NOT EXISTS outreach (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP,
    delivery_status TEXT,  -- sent, failed, pending
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);
