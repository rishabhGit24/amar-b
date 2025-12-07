"""
Quick test script for error handling functionality
"""

import sys
import os

# Add parent directory to path to allow imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from backend.services.error_handler import (
    get_error_handler,
    UserInputError,
    LLMAPIError,
    DeploymentError,
    SystemError as AmarSystemError
)
from backend.services.graceful_failure import get_graceful_failure_handler


def test_error_handler():
    """Test error handler functionality"""
    print("Testing Error Handler...")
    
    error_handler = get_error_handler()
    
    # Test 1: User input validation
    print("\n1. Testing user input validation...")
    is_valid, error_msg = error_handler.validate_user_input("")
    assert not is_valid, "Empty input should be invalid"
    assert "cannot be empty" in error_msg.lower()
    print("   ✓ Empty input validation works")
    
    is_valid, error_msg = error_handler.validate_user_input("short")
    assert not is_valid, "Short input should be invalid"
    assert "too short" in error_msg.lower()
    print("   ✓ Short input validation works")
    
    is_valid, error_msg = error_handler.validate_user_input("This is a valid description for testing")
    assert is_valid, "Valid input should pass"
    assert error_msg is None
    print("   ✓ Valid input validation works")
    
    # Test 2: Error handling
    print("\n2. Testing error handling...")
    try:
        raise UserInputError("Test user input error")
    except UserInputError as e:
        user_msg, details = error_handler.handle_error(e, context={'test': True})
        assert "Test user input error" in user_msg
        assert details['category'] == 'user_input'
        print("   ✓ UserInputError handling works")
    
    try:
        raise LLMAPIError("Test LLM API error")
    except LLMAPIError as e:
        user_msg, details = error_handler.handle_error(e, context={'test': True})
        assert "Test LLM API error" in user_msg
        assert details['category'] == 'llm_api'
        print("   ✓ LLMAPIError handling works")
    
    # Test 3: System resource checking
    print("\n3. Testing system resource checking...")
    is_healthy, error_msg = error_handler.check_system_resources()
    print(f"   System health: {is_healthy}")
    if error_msg:
        print(f"   Warning: {error_msg}")
    else:
        print("   ✓ System resources are healthy")
    
    print("\n✅ All error handler tests passed!")


def test_graceful_failure():
    """Test graceful failure handler functionality"""
    print("\nTesting Graceful Failure Handler...")
    
    graceful_failure = get_graceful_failure_handler()
    
    # Test 1: Resource checking
    print("\n1. Testing resource checking...")
    can_continue, error_msg = graceful_failure.check_and_handle_resources()
    print(f"   Can continue: {can_continue}")
    if error_msg:
        print(f"   Warning: {error_msg}")
    else:
        print("   ✓ Resources are healthy")
    
    # Test 2: Resource status
    print("\n2. Testing resource status...")
    status = graceful_failure.get_resource_status()
    print(f"   Memory: {status['memory']['percent_used']:.1f}% used, Status: {status['memory']['status']}")
    print(f"   Disk: {status['disk']['percent_used']:.1f}% used, Status: {status['disk']['status']}")
    print("   ✓ Resource status retrieval works")
    
    # Test 3: Deployment platform unavailable message
    print("\n3. Testing deployment platform unavailable message...")
    message = graceful_failure.handle_deployment_platform_unavailable(
        ['vercel', 'netlify'],
        {'vercel': 'Token not configured', 'netlify': 'CLI not installed'}
    )
    assert 'vercel' in message.lower()
    assert 'netlify' in message.lower()
    assert 'solutions' in message.lower()
    print("   ✓ Deployment platform unavailable message works")
    
    # Test 4: User-friendly error messages
    print("\n4. Testing user-friendly error messages...")
    message = graceful_failure.create_user_friendly_error_message(
        'deployment',
        {'message': 'Deployment failed', 'details': {'platform': 'vercel'}}
    )
    assert 'vercel' in message.lower()
    assert 'deployment' in message.lower()
    print("   ✓ User-friendly error messages work")
    
    print("\n✅ All graceful failure tests passed!")


if __name__ == '__main__':
    try:
        test_error_handler()
        test_graceful_failure()
        print("\n" + "="*50)
        print("🎉 ALL TESTS PASSED!")
        print("="*50)
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
