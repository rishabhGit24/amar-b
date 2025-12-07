"""
Rate Limiting Service for AMAR MVP
Tracks and enforces rate limits for LLM API calls per session
Validates: Requirements 10.1, 10.2
"""

import time
from datetime import datetime, timedelta
from typing import Dict, Optional
from threading import Lock


class RateLimitExceeded(Exception):
    """Exception raised when rate limit is exceeded"""
    pass


class SessionRateLimiter:
    """
    Rate limiter for tracking LLM API calls per session
    
    Enforces maximum request limits per session and provides
    request tracking and validation.
    
    Validates: Requirements 10.1, 10.2
    """
    
    def __init__(self, max_requests: int = 50):
        """
        Initialize rate limiter
        
        Args:
            max_requests: Maximum number of requests allowed per session
        """
        self.max_requests = max_requests
        self._session_counts: Dict[str, int] = {}
        self._session_timestamps: Dict[str, datetime] = {}
        self._lock = Lock()
    
    def check_and_increment(self, session_id: str) -> None:
        """
        Check if request is allowed and increment counter
        
        Args:
            session_id: Session identifier
            
        Raises:
            RateLimitExceeded: If session has exceeded rate limit
            
        Validates: Requirements 10.1, 10.2
        """
        with self._lock:
            # Get current count for session
            current_count = self._session_counts.get(session_id, 0)
            
            # Check if limit exceeded
            if current_count >= self.max_requests:
                raise RateLimitExceeded(
                    f"Rate limit exceeded for session {session_id}. "
                    f"Maximum {self.max_requests} requests allowed per session."
                )
            
            # Increment counter
            self._session_counts[session_id] = current_count + 1
            self._session_timestamps[session_id] = datetime.now()
    
    def get_remaining_requests(self, session_id: str) -> int:
        """
        Get number of remaining requests for session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Number of remaining requests
        """
        with self._lock:
            current_count = self._session_counts.get(session_id, 0)
            return max(0, self.max_requests - current_count)
    
    def get_request_count(self, session_id: str) -> int:
        """
        Get current request count for session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Current request count
        """
        with self._lock:
            return self._session_counts.get(session_id, 0)
    
    def reset_session(self, session_id: str) -> None:
        """
        Reset rate limit counter for session
        
        Args:
            session_id: Session identifier
        """
        with self._lock:
            if session_id in self._session_counts:
                del self._session_counts[session_id]
            if session_id in self._session_timestamps:
                del self._session_timestamps[session_id]
    
    def get_session_info(self, session_id: str) -> Dict[str, any]:
        """
        Get rate limit information for session
        
        Args:
            session_id: Session identifier
            
        Returns:
            Dictionary with session rate limit info
        """
        with self._lock:
            current_count = self._session_counts.get(session_id, 0)
            timestamp = self._session_timestamps.get(session_id)
            
            return {
                'session_id': session_id,
                'request_count': current_count,
                'max_requests': self.max_requests,
                'remaining_requests': max(0, self.max_requests - current_count),
                'limit_exceeded': current_count >= self.max_requests,
                'last_request_time': timestamp.isoformat() if timestamp else None
            }


class ExponentialBackoff:
    """
    Exponential backoff strategy for API retries
    
    Implements exponential backoff with configurable base delay
    and maximum retry attempts.
    
    Validates: Requirements 10.4, 10.5
    """
    
    def __init__(self, base_delay: float = 1.0, max_retries: int = 3):
        """
        Initialize exponential backoff
        
        Args:
            base_delay: Base delay in seconds (default 1.0)
            max_retries: Maximum number of retry attempts (default 3)
        """
        self.base_delay = base_delay
        self.max_retries = max_retries
    
    def get_delay(self, attempt: int) -> float:
        """
        Calculate delay for given attempt number
        
        Args:
            attempt: Attempt number (0-indexed)
            
        Returns:
            Delay in seconds
            
        Validates: Requirements 10.4
        """
        if attempt >= self.max_retries:
            raise ValueError(f"Attempt {attempt} exceeds max retries {self.max_retries}")
        
        # Exponential backoff: base_delay * (2 ^ attempt)
        return self.base_delay * (2 ** attempt)
    
    def should_retry(self, attempt: int) -> bool:
        """
        Check if retry should be attempted
        
        Args:
            attempt: Current attempt number (0-indexed)
            
        Returns:
            True if retry should be attempted, False otherwise
            
        Validates: Requirements 10.5
        """
        return attempt < self.max_retries
    
    def wait(self, attempt: int) -> None:
        """
        Wait for calculated delay period
        
        Args:
            attempt: Attempt number (0-indexed)
        """
        if self.should_retry(attempt):
            delay = self.get_delay(attempt)
            time.sleep(delay)


# Global rate limiter instance
_rate_limiter: Optional[SessionRateLimiter] = None


def get_rate_limiter(max_requests: int = 50) -> SessionRateLimiter:
    """
    Get global rate limiter instance
    
    Args:
        max_requests: Maximum requests per session
        
    Returns:
        SessionRateLimiter instance
    """
    global _rate_limiter
    
    if _rate_limiter is None:
        _rate_limiter = SessionRateLimiter(max_requests=max_requests)
    
    return _rate_limiter



def retry_with_backoff(func, max_retries: int = 3, base_delay: float = 1.0, 
                       retry_on_exceptions: tuple = (Exception,)):
    """
    Decorator/wrapper for retrying functions with exponential backoff
    
    Args:
        func: Function to retry
        max_retries: Maximum number of retry attempts
        base_delay: Base delay in seconds for exponential backoff
        retry_on_exceptions: Tuple of exception types to retry on
        
    Returns:
        Wrapped function with retry logic
        
    Validates: Requirements 10.4, 10.5
    """
    def wrapper(*args, **kwargs):
        backoff = ExponentialBackoff(base_delay=base_delay, max_retries=max_retries)
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                return func(*args, **kwargs)
            except retry_on_exceptions as e:
                last_exception = e
                
                # If this was the last attempt, raise the exception
                if attempt >= max_retries:
                    raise
                
                # Wait before retrying
                if backoff.should_retry(attempt):
                    backoff.wait(attempt)
        
        # Should never reach here, but raise last exception if we do
        if last_exception:
            raise last_exception
    
    return wrapper
