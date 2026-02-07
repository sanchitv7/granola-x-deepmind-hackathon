"""AI agents for candidate sourcing, matching, pitch writing, and outreach."""

from google import genai
from google.genai import types
import json
import os
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


# Lazy client initialization
_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    """Get or create the Gemini client."""
    global _client
    if _client is None:
        # Try GEMINI_API_KEY first (standard), then fall back to GOOGLE_API_KEY
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")
        _client = genai.Client(api_key=api_key)
    return _client


# Pydantic models for structured outputs
class CandidateProfile(BaseModel):
    name: str
    current_role: str
    current_company: str
    years_experience: int
    skills: list[str]
    location: str
    email: str
    linkedin_summary: str


class CandidateMatch(BaseModel):
    candidate_index: int
    score: int
    key_highlights: list[str]
    fit_reasoning: str


class EmailPitch(BaseModel):
    subject: str
    body: str


class SourcingAgent:
    """Generates realistic mock candidate profiles."""

    def generate_candidates(self, job: Dict[str, Any], count: int = 25) -> List[Dict[str, Any]]:
        """Generate diverse candidate profiles for a job."""
        prompt = f"""Generate {count} realistic candidate profiles for this job:

Job Title: {job['title']}
Required Skills: {', '.join(json.loads(job['required_skills']))}
Experience Level: {job['experience_level']}
Location: {job['location']}

Create a diverse pool with varied fit levels:
- 40% strong fits (should have most required skills + relevant experience)
- 40% medium fits (have some skills, may lack others or less experience)
- 20% weak fits (missing key skills or wrong experience level)

Generate profiles with variety in:
- Career backgrounds (different companies, industries)
- Skill combinations (not everyone has the exact same skills)
- Years of experience (range appropriate for level)
- Locations (mix of on-site, remote, different cities)
- Company sizes (startups, mid-size, enterprise)

Return a JSON array with candidate profiles."""

        try:
            # Define schema for list of candidates
            list_schema = {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'name': {'type': 'string'},
                        'current_role': {'type': 'string'},
                        'current_company': {'type': 'string'},
                        'years_experience': {'type': 'integer'},
                        'skills': {'type': 'array', 'items': {'type': 'string'}},
                        'location': {'type': 'string'},
                        'email': {'type': 'string'},
                        'linkedin_summary': {'type': 'string'}
                    },
                    'required': ['name', 'current_role', 'current_company', 'years_experience',
                               'skills', 'location', 'email', 'linkedin_summary']
                }
            }

            response = get_client().models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_json_schema=list_schema
                )
            )

            candidates = json.loads(response.text)
            return candidates
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Gemini: {e}")
            print(f"Response: {response.text}")
            raise
        except Exception as e:
            print(f"Error generating candidates: {e}")
            raise


class MatchingAgent:
    """Ranks candidates with AI-powered fit scoring."""

    def rank_candidates(self, job: Dict[str, Any], candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Score and rank all candidates for a job."""
        # Format candidates for prompt (with 0-based indices)
        candidates_text = "\n\n".join([
            f"Candidate Index {i} (Name: {c['name']}):\n" +
            f"Role: {c['current_role']} at {c['current_company']}\n" +
            f"Experience: {c['years_experience']} years\n" +
            f"Skills: {', '.join(c['skills'])}\n" +
            f"Location: {c['location']}\n" +
            f"Summary: {c['linkedin_summary']}"
            for i, c in enumerate(candidates)
        ])

        prompt = f"""You are an expert recruiter. Analyze these candidates for this job and provide detailed matching scores.

Job Requirements:
Title: {job['title']}
Required Skills: {', '.join(json.loads(job['required_skills']))}
Experience Level: {job['experience_level']}
Location: {job['location']}

Candidates:
{candidates_text}

For each candidate, provide:
1. Overall fit score (0-100)
2. 3-4 key highlights (specific reasons why they're a good or bad fit)
3. Brief fit reasoning (2-3 sentences explaining the score)

Consider:
- Skill match (do they have required technical skills?)
- Experience level match (appropriate seniority?)
- Location compatibility
- Role relevance (is their current work similar?)
- Career trajectory (are they growing in the right direction?)

IMPORTANT: Use the exact candidate_index shown above (0-based indexing: 0, 1, 2, etc.)
Return a JSON array ordered by score (highest first)."""

        try:
            # Define schema for list of matches
            list_schema = {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'candidate_index': {'type': 'integer'},
                        'score': {'type': 'integer'},
                        'key_highlights': {'type': 'array', 'items': {'type': 'string'}},
                        'fit_reasoning': {'type': 'string'}
                    },
                    'required': ['candidate_index', 'score', 'key_highlights', 'fit_reasoning']
                }
            }

            response = get_client().models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_json_schema=list_schema
                )
            )

            matches = json.loads(response.text)

            # Add rank position
            for i, match in enumerate(matches):
                match['rank_position'] = i + 1

            return matches
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Gemini: {e}")
            print(f"Response: {response.text}")
            raise
        except Exception as e:
            print(f"Error ranking candidates: {e}")
            raise


class PitchWriterAgent:
    """Creates personalized outreach messages."""

    def create_pitch(self, job: Dict[str, Any], candidate: Dict[str, Any],
                    match: Dict[str, Any]) -> Dict[str, str]:
        """Generate personalized outreach email."""
        skills = json.loads(candidate['skills']) if isinstance(candidate['skills'], str) else candidate['skills']
        highlights = json.loads(match['key_highlights']) if isinstance(match['key_highlights'], str) else match['key_highlights']

        prompt = f"""Write a personalized recruiting email to reach out to this candidate.

Job:
Title: {job['title']}
Company: [Your Company Name]
Location: {job['location']}

Candidate:
Name: {candidate['name']}
Current Role: {candidate['current_role']} at {candidate['current_company']}
Experience: {candidate['years_experience']} years
Skills: {', '.join(skills)}
Background: {candidate['linkedin_summary']}

Why They're a Good Fit:
{chr(10).join(f'- {h}' for h in highlights)}

Match Score: {match['score']}/100

Write a compelling, personalized email that:
1. Addresses them by name
2. Shows you've researched their background (reference specific experience)
3. Explains why this role is a great fit for THEM specifically
4. Highlights 1-2 of their strengths that match the role
5. Keeps it concise (3-4 short paragraphs)
6. Sounds professional but friendly, not generic
7. Includes a clear call-to-action

Tone: Professional but warm. Adjust formality based on experience level.

Return a JSON object with 'subject' and 'body' fields."""

        try:
            response = get_client().models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    response_schema=EmailPitch
                )
            )

            pitch = json.loads(response.text)
            return pitch
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Gemini: {e}")
            print(f"Response: {response.text}")
            raise
        except Exception as e:
            print(f"Error creating pitch: {e}")
            raise


class OutreachAgent:
    """Sends emails via SMTP."""

    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")

    def send_email(self, to_email: str, subject: str, body: str) -> tuple[bool, str]:
        """Send email via SMTP."""
        # For demo purposes, log email instead of actually sending
        # Remove this and uncomment SMTP code below for production
        print("\n" + "="*80)
        print("EMAIL SENT (Demo Mode)")
        print("="*80)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"\n{body}")
        print("="*80 + "\n")
        return True, "Email logged (demo mode)"

        # Uncomment for actual SMTP sending:
        # import smtplib
        # from email.mime.text import MIMEText
        # from email.mime.multipart import MIMEMultipart
        #
        # if not self.smtp_username or not self.smtp_password:
        #     return False, "SMTP credentials not configured"
        #
        # try:
        #     msg = MIMEMultipart()
        #     msg['From'] = self.smtp_username
        #     msg['To'] = to_email
        #     msg['Subject'] = subject
        #     msg.attach(MIMEText(body, 'plain'))
        #
        #     with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
        #         server.starttls()
        #         server.login(self.smtp_username, self.smtp_password)
        #         server.send_message(msg)
        #
        #     return True, "Email sent successfully"
        # except Exception as e:
        #     return False, str(e)
