"""
Tests for Rate Limiting Service
Validates: Requirements 10.1, 10.2, 10.4, 10.5
"""

import pytest
import time
from hypothesis import given, strategies as st, settings
from backend.services.rate_limiter import (
    SessionRateLimiter,
    ExponentialBackoff,
    RateLimitExceeded,
    get_rate_limiter
)


class TestSessionRateLimiter:
    """Test suite for SessionRateLimiter"""
    
    def test_initial_request_count_is_zero(self):
        """Test that new sessions start with zero requests"""
        limiter = SessionRateLimiter(max_requests=50)
        session_id = "test-session-1"
        
        assert limiter.get_request_count(session_id) == 0
        assert limiter.get_remaining_requests(session_id) == 50
    
    def test_check_and_increment_increases_count(self):
        """Test that check_and_increment increases request count"""
        limiter = SessionRateLimiter(max_requests=50)
        session_id = "test-session-2"
        
        limiter.check_and_increment(session_id)
        assert limiter.get_request_count(session_id) == 1
        assert limiter.get_remaining_requests(session_id) == 49
        
        limiter.check_and_increment(session_id)
        assert limiter.get_request_count(session_id) == 2
        assert limiter.get_remaining_requests(session_id) == 48
    
    def test_rate_limit_exceeded_raises_exception(self):
        """
        Test that exceeding rate limit raises RateLimitExceeded
        Validates: Requirements 10.2
        """
        limiter = SessionRateLimiter(max_requests=3)
        session_id = "test-session-3"
        
        # First 3 requests should succeed
        limiter.check_and_increment(session_id)
        limiter.check_and_increment(session_id)
        limiter.check_and_increment(session_id)
        
        # 4th request should raise exception
        with pytest.raises(RateLimitExceeded) as exc_info:
            limiter.check_and_increment(session_id)
        
        assert "Rate limit exceeded" in str(exc_info.value)
        assert "test-session-3" in str(exc_info.value)
    
    def test_reset_session_clears_count(self):
        """Test that reset_session clears the request count"""
        limiter = SessionRateLimiter(max_requests=50)
        session_id = "test-session-4"
        
        # Make some requests
        limiter.check_and_increment(session_id)
        limiter.check_and_increment(session_id)
        assert limiter.get_request_count(session_id) == 2
        
        # Reset session
        limiter.reset_session(session_id)
        assert limiter.get_request_count(session_id) == 0
        assert limiter.get_remaining_requests(session_id) == 50
    
    def test_get_session_info_returns_correct_data(self):
        """Test that get_session_info returns accurate information"""
        limiter = SessionRateLimiter(max_requests=10)
        session_id = "test-session-5"
        
        # Make some requests
        limiter.check_and_increment(session_id)
        limiter.check_and_increment(session_id)
        limiter.check_and_increment(session_id)
        
        info = limiter.get_session_info(session_id)
        
        assert info['session_id'] == session_id
        assert info['request_count'] == 3
        assert info['max_requests'] == 10
        assert info['remaining_requests'] == 7
        assert info['limit_exceeded'] is False
        assert info['last_request_time'] is not None
    
    def test_multiple_sessions_independent(self):
        """Test that different sessions have independent rate limits"""
        limiter = SessionRateLimiter(max_requests=5)
        session_1 = "test-session-6"
        session_2 = "test-session-7"
        
        # Make requests for session 1
        limiter.check_and_increment(session_1)
        limiter.check_and_increment(session_1)
        
        # Make requests for session 2
        limiter.check_and_increment(session_2)
        
        assert limiter.get_request_count(session_1) == 2
        assert limiter.get_request_count(session_2) == 1
        assert limiter.get_remaining_requests(session_1) == 3
        assert limiter.get_remaining_requests(session_2) == 4


class TestExponentialBackoff:
    """Test suite for ExponentialBackoff"""
    
    def test_get_delay_calculates_correctly(self):
        """
        Test that get_delay calculates exponential backoff correctly
        Validates: Requirements 10.4
        """
        backoff = ExponentialBackoff(base_delay=1.0, max_retries=3)
        
        # Attempt 0: 1.0 * (2^0) = 1.0
        assert backoff.get_delay(0) == 1.0
        
        # Attempt 1: 1.0 * (2^1) = 2.0
        assert backoff.get_delay(1) == 2.0
        
        # Attempt 2: 1.0 * (2^2) = 4.0
        assert backoff.get_delay(2) == 4.0
    
    def test_get_delay_with_custom_base(self):
        """Test exponential backoff with custom base delay"""
        backoff = ExponentialBackoff(base_delay=2.0, max_retries=3)
        
        # Attempt 0: 2.0 * (2^0) = 2.0
        assert backoff.get_delay(0) == 2.0
        
        # Attempt 1: 2.0 * (2^1) = 4.0
        assert backoff.get_delay(1) == 4.0
        
        # Attempt 2: 2.0 * (2^2) = 8.0
        assert backoff.get_delay(2) == 8.0
    
    def test_get_delay_raises_on_max_retries(self):
        """Test that get_delay raises error when exceeding max retries"""
        backoff = ExponentialBackoff(base_delay=1.0, max_retries=3)
        
        with pytest.raises(ValueError) as exc_info:
            backoff.get_delay(3)
        
        assert "exceeds max retries" in str(exc_info.value)
    
    def test_should_retry_returns_correct_value(self):
        """
        Test that should_retry correctly determines retry eligibility
        Validates: Requirements 10.5
        """
        backoff = ExponentialBackoff(base_delay=1.0, max_retries=3)
        
        # Attempts 0, 1, 2 should allow retry
        assert backoff.should_retry(0) is True
        assert backoff.should_retry(1) is True
        assert backoff.should_retry(2) is True
        
        # Attempt 3 should not allow retry (max_retries = 3)
        assert backoff.should_retry(3) is False
        assert backoff.should_retry(4) is False
    
    def test_wait_delays_execution(self):
        """Test that wait actually delays execution"""
        backoff = ExponentialBackoff(base_delay=0.1, max_retries=3)
        
        start_time = time.time()
        backoff.wait(0)  # Should wait 0.1 seconds
        elapsed = time.time() - start_time
        
        # Allow some tolerance for timing
        assert elapsed >= 0.09  # At least 90% of expected delay
        assert elapsed < 0.2    # But not too much more
    
    def test_wait_with_exponential_increase(self):
        """Test that wait delays increase exponentially"""
        backoff = ExponentialBackoff(base_delay=0.1, max_retries=3)
        
        # Test first wait (0.1 seconds)
        start_time = time.time()
        backoff.wait(0)
        elapsed_0 = time.time() - start_time
        
        # Test second wait (0.2 seconds)
        start_time = time.time()
        backoff.wait(1)
        elapsed_1 = time.time() - start_time
        
        # Second wait should be approximately twice as long
        assert elapsed_1 >= elapsed_0 * 1.8  # Allow some tolerance


class TestGlobalRateLimiter:
    """Test suite for global rate limiter instance"""
    
    def test_get_rate_limiter_returns_singleton(self):
        """Test that get_rate_limiter returns the same instance"""
        limiter1 = get_rate_limiter(max_requests=50)
        limiter2 = get_rate_limiter(max_requests=50)
        
        assert limiter1 is limiter2
    
    def test_get_rate_limiter_with_custom_max_requests(self):
        """Test that get_rate_limiter returns a limiter instance"""
        # Note: The global limiter is a singleton, so it uses the first
        # max_requests value it was initialized with
        limiter = get_rate_limiter(max_requests=50)
        
        session_id = "test-session-global"
        # Should have the default max_requests from first initialization
        assert limiter.get_remaining_requests(session_id) == 50


class TestRateLimitIntegration:
    """Integration tests for rate limiting"""
    
    def test_rate_limit_enforcement_workflow(self):
        """
        Test complete rate limiting workflow
        Validates: Requirements 10.1, 10.2
        """
        limiter = SessionRateLimiter(max_requests=5)
        session_id = "test-integration-1"
        
        # Simulate making requests
        for i in range(5):
            limiter.check_and_increment(session_id)
            info = limiter.get_session_info(session_id)
            assert info['request_count'] == i + 1
            assert info['remaining_requests'] == 5 - (i + 1)
        
        # Next request should fail
        with pytest.raises(RateLimitExceeded):
            limiter.check_and_increment(session_id)
        
        # Verify final state
        info = limiter.get_session_info(session_id)
        assert info['limit_exceeded'] is True
        assert info['remaining_requests'] == 0
    
    def test_retry_with_backoff_workflow(self):
        """
        Test retry workflow with exponential backoff
        Validates: Requirements 10.4, 10.5
        """
        backoff = ExponentialBackoff(base_delay=0.05, max_retries=3)
        
        attempt_count = 0
        max_attempts = 3
        
        for attempt in range(max_attempts):
            if backoff.should_retry(attempt):
                attempt_count += 1
                if attempt < max_attempts - 1:
                    backoff.wait(attempt)
        
        assert attempt_count == 3



class TestRateLimitPropertyTests:
    """Property-based tests for rate limiting"""
    
    @given(
        max_requests=st.integers(min_value=1, max_value=100),
        request_count=st.integers(min_value=0, max_value=150)
    )
    @settings(max_examples=100)
    def test_rate_limit_enforcement_property(self, max_requests, request_count):
        """
        Feature: amar-mvp, Property 9: Rate limit enforcement
        Validates: Requirements 10.2
        
        For any session, if the LLM API request count exceeds the configured
        max_requests limit, subsequent requests should be rejected with a 
        rate limit error.
        
        This property verifies that:
        1. Requests up to max_requests are allowed
        2. Requests exceeding max_requests raise RateLimitExceeded
        3. The rate limiter correctly tracks request counts
        """
        # Create a rate limiter with the generated max_requests
        limiter = SessionRateLimiter(max_requests=max_requests)
        session_id = f"property-test-session-{max_requests}-{request_count}"
        
        # Track how many requests succeeded
        successful_requests = 0
        rate_limit_hit = False
        
        # Attempt to make request_count requests
        for i in range(request_count):
            try:
                limiter.check_and_increment(session_id)
                successful_requests += 1
            except RateLimitExceeded:
                rate_limit_hit = True
                # Once rate limit is hit, all subsequent requests should also fail
                # Verify this by checking remaining requests
                remaining = limiter.get_remaining_requests(session_id)
                assert remaining == 0, "Remaining requests should be 0 when rate limit is exceeded"
                
                # Verify that all subsequent requests also fail
                with pytest.raises(RateLimitExceeded):
                    limiter.check_and_increment(session_id)
                
                # Break after verifying the rate limit behavior
                break
        
        # Property verification:
        # If request_count <= max_requests, all requests should succeed
        if request_count <= max_requests:
            assert successful_requests == request_count, \
                f"All {request_count} requests should succeed when limit is {max_requests}"
            assert not rate_limit_hit, \
                "Rate limit should not be hit when request count is within limit"
            assert limiter.get_request_count(session_id) == request_count
            assert limiter.get_remaining_requests(session_id) == max_requests - request_count
        
        # If request_count > max_requests, exactly max_requests should succeed
        else:
            assert successful_requests == max_requests, \
                f"Exactly {max_requests} requests should succeed before rate limit"
            assert rate_limit_hit, \
                "Rate limit should be hit when request count exceeds limit"
            assert limiter.get_request_count(session_id) == max_requests
            assert limiter.get_remaining_requests(session_id) == 0
            
            # Verify session info reflects limit exceeded state
            info = limiter.get_session_info(session_id)
            assert info['limit_exceeded'] is True, \
                "Session info should indicate limit exceeded"
            assert info['request_count'] == max_requests, \
                f"Request count should be {max_requests}"
            assert info['remaining_requests'] == 0, \
                "Remaining requests should be 0"
