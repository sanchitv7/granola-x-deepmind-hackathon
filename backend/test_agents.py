"""Quick test script to verify agents are working."""

import os
from dotenv import load_dotenv
from agents import SourcingAgent, MatchingAgent

load_dotenv()

import os
import asyncio
from dotenv import load_dotenv
from agents import SourcingAgent, MatchingAgent

load_dotenv()

async def run_tests():
    # Verify API key is set
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("❌ Error: GEMINI_API_KEY not set in .env file")
        print("Please add your Gemini API key to backend/.env")
        return

    print("✓ API key found")

    # Test data
    test_job = {
        'title': 'Senior Full-Stack Engineer',
        'required_skills': '["React", "Node.js", "PostgreSQL", "AWS"]',
        'experience_level': 'Senior',
        'location': 'Remote (US)'
    }

    print("\n" + "="*80)
    print("Testing Sourcing Agent...")
    print("="*80)
    sourcing_agent = SourcingAgent()

    try:
        print("Generating 5 test candidates...")
        candidates = await sourcing_agent.generate_candidates(test_job, count=5)
        print(f"✓ Generated {len(candidates)} candidates")
        print(f"\nSample candidate:")
        print(f"  Name: {candidates[0]['name']}")
        print(f"  Role: {candidates[0]['current_role']} at {candidates[0]['current_company']}")
        print(f"  Skills: {', '.join(candidates[0]['skills'][:3])}...")
        print(f"  Location: {candidates[0]['location']}")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return

    print("\n" + "="*80)
    print("Testing Matching Agent...")
    print("="*80)
    matching_agent = MatchingAgent()

    try:
        print("Ranking candidates...")
        matches = await matching_agent.rank_candidates(test_job, candidates)
        print(f"✓ Ranked {len(matches)} candidates")
        print(f"\nTop match:")
        print(f"  Candidate: {candidates[matches[0]['candidate_index']]['name']}")
        print(f"  Score: {matches[0]['score']}/100")
        print(f"  Key Highlights:")
        for highlight in matches[0]['key_highlights'][:2]:
            print(f"    - {highlight}")
        print(f"  Reasoning: {matches[0]['fit_reasoning'][:100]}...")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return

    print("\n" + "="*80)
    print("✓ All agents working correctly!")
    print("="*80)
    print("\nYou're ready to start the application!")
    print("Run: uvicorn main:app --reload")

if __name__ == "__main__":
    asyncio.run(run_tests())
