"""Simple in-memory IP-based rate limiter."""

import time
from collections import defaultdict
from fastapi import HTTPException


class RateLimiter:
    def __init__(self):
        self._requests = defaultdict(list)

    def check(self, action: str, ip: str, limit: int, window: int):
        """Raise 429 if IP exceeds limit within window (seconds)."""
        key = f"{action}:{ip}"
        now = time.time()
        # Prune old entries
        self._requests[key] = [t for t in self._requests[key] if now - t < window]
        if len(self._requests[key]) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
        self._requests[key].append(now)
