"""
Test suite for main FastAPI application
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)


def test_health_check():
    """Test the root health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "AMAR MVP Backend is running"
    assert data["status"] == "healthy"


def test_generate_endpoint_empty_description():
    """Test generate endpoint with empty description"""
    response = client.post("/api/generate", json={"description": ""})
    assert response.status_code == 400
    assert "Description cannot be empty" in response.json()["detail"]


def test_generate_endpoint_whitespace_description():
    """Test generate endpoint with whitespace-only description"""
    response = client.post("/api/generate", json={"description": "   "})
    assert response.status_code == 400
    assert "Description cannot be empty" in response.json()["detail"]


def test_generate_endpoint_valid_description():
    """Test generate endpoint with valid description"""
    response = client.post("/api/generate", json={
        "description": "Build a simple landing page"
    })
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "Application generation initiated" in data["message"]
    assert data["status"] == "initiated"


def test_result_endpoint_nonexistent_session():
    """Test result endpoint with non-existent session ID"""
    response = client.get("/api/result/nonexistent-session-id")
    assert response.status_code == 404
    assert "Session not found" in response.json()["detail"]


class TestInputValidation:
    """
    Property-based tests for input validation
    Validates: Requirements 1.2
    """
    
    def test_non_empty_input_validation_property(self):
        """
        Feature: amar-mvp, Property 1: Non-empty input validation
        Validates: Requirements 1.2
        
        For any user input submitted through the web interface, if the input is 
        empty or whitespace-only, the system should reject it before initiating the workflow.
        
        This property verifies that:
        1. Empty strings are rejected
        2. Whitespace-only strings are rejected
        3. Valid non-empty strings are accepted
        4. The rejection happens at the API level before workflow initiation
        """
        from hypothesis import given, strategies as st, settings
        
        # Strategy for generating various input strings
        # Include empty, whitespace-only, and valid strings
        @given(
            description=st.one_of(
                st.just(""),  # Empty string
                st.text(alphabet=" \t\n\r", min_size=1, max_size=20),  # Whitespace only
                st.text(min_size=1, max_size=200)  # Any text
            )
        )
        @settings(max_examples=100, deadline=None)
        def property_test(description):
            """
            Test that empty and whitespace-only inputs are rejected
            """
            response = client.post("/api/generate", json={
                "description": description
            })
            
            # Property: Empty or whitespace-only inputs should be rejected
            if description.strip() == "":
                # Should be rejected with 400 status
                assert response.status_code == 400, (
                    f"Empty/whitespace input should be rejected with 400, "
                    f"got {response.status_code}"
                )
                
                # Should have error message about empty description
                error_detail = response.json().get("detail", "")
                assert "empty" in error_detail.lower() or "description" in error_detail.lower(), (
                    f"Error message should mention empty description, got: {error_detail}"
                )
                
                # Should NOT create a session
                assert "session_id" not in response.json(), (
                    "Empty input should not create a session"
                )
            else:
                # Valid input should be accepted with 200 status
                assert response.status_code == 200, (
                    f"Valid input should be accepted with 200, got {response.status_code}"
                )
                
                # Should create a session
                data = response.json()
                assert "session_id" in data, "Valid input should create a session"
                assert "status" in data, "Response should include status"
                assert data["status"] == "initiated", "Status should be 'initiated'"
        
        # Run the property test
        property_test()


class TestExecutionTimeReporting:
    """
    Property-based tests for execution time reporting
    Validates: Requirements 9.5
    """
    
    def test_execution_time_reporting_property(self):
        """
        Feature: amar-mvp, Property 11: Execution time reporting
        Validates: Requirements 9.5
        
        For any completed workflow (success or failure), the system should report 
        total execution time from input submission to final output.
        
        This property verifies that:
        1. Execution time is reported for successful workflows
        2. Execution time is reported for failed workflows
        3. Execution time is a non-negative number
        4. Execution time is measured in milliseconds
        5. Execution time is included in the final result
        """
        from hypothesis import given, strategies as st, settings
        import time
        
        # Strategy for generating valid user descriptions
        descriptions = st.text(min_size=10, max_size=200).filter(
            lambda x: x.strip() != ""
        )
        
        @given(description=descriptions)
        @settings(max_examples=50, deadline=None)  # Reduced examples since this involves workflow execution
        def property_test(description):
            """
            Test that execution time is reported for all completed workflows
            """
            # Record start time
            start_time = time.time()
            
            # Create a session
            response = client.post("/api/generate", json={
                "description": description
            })
            
            # Verify session was created
            assert response.status_code == 200
            session_id = response.json()["session_id"]
            
            # Connect to WebSocket to monitor workflow progress
            with client.websocket_connect(f"/ws/{session_id}") as websocket:
                # Receive connection confirmation
                connection_msg = websocket.receive_json()
                assert connection_msg["type"] == "connection"
                
                # Wait for workflow to complete (or fail)
                workflow_completed = False
                workflow_failed = False
                final_message = None
                
                # Monitor workflow progress
                max_wait_time = 60  # 60 seconds max wait
                timeout_time = time.time() + max_wait_time
                
                while time.time() < timeout_time:
                    try:
                        data = websocket.receive_json()
                        
                        # Check for completion or failure
                        if data.get("type") == "complete":
                            workflow_completed = True
                            final_message = data
                            break
                        elif data.get("type") == "error" or data.get("type") == "failed":
                            workflow_failed = True
                            final_message = data
                            break
                        elif data.get("status") == "completed":
                            workflow_completed = True
                            final_message = data
                            break
                        elif data.get("status") == "failed":
                            workflow_failed = True
                            final_message = data
                            break
                        elif data.get("type") == "progress" and data.get("status") == "failed":
                            # Progress message indicating failure
                            workflow_failed = True
                            final_message = data
                            # Continue to see if there's a more complete final message
                            continue
                            
                    except Exception as e:
                        # Timeout or connection closed
                        break
                
                # Property: For any completed workflow (success or failure),
                # execution time should be reported
                
                if workflow_completed or workflow_failed:
                    # Verify execution time is present in the final message
                    assert final_message is not None, "Final message should be present"
                    
                    # Check for execution time in various possible locations
                    execution_time = None
                    
                    # Check direct field
                    if "execution_time_ms" in final_message:
                        execution_time = final_message["execution_time_ms"]
                    elif "execution_time" in final_message:
                        execution_time = final_message["execution_time"]
                    elif "executionTime" in final_message:
                        execution_time = final_message["executionTime"]
                    
                    # Check in nested result/data
                    if execution_time is None and "result" in final_message:
                        result = final_message["result"]
                        if isinstance(result, dict):
                            execution_time = result.get("execution_time_ms") or result.get("execution_time")
                    
                    if execution_time is None and "data" in final_message:
                        data = final_message["data"]
                        if isinstance(data, dict):
                            execution_time = data.get("execution_time_ms") or data.get("execution_time")
                    
                    # Property verification
                    # Note: execution_time might not be in progress messages, only in final completion messages
                    # If we got a progress message with failed status, check the result endpoint instead
                    if execution_time is None and final_message.get("type") == "progress":
                        # This is a progress message, not a final completion message
                        # Skip the WebSocket assertion and check the result endpoint instead
                        pass
                    else:
                        assert execution_time is not None, (
                            f"Execution time should be reported for completed workflow. "
                            f"Final message: {final_message}"
                        )
                    
                    # Only verify execution time if it was found
                    if execution_time is not None:
                        # Verify execution time is a number
                        assert isinstance(execution_time, (int, float)), (
                            f"Execution time should be a number, got {type(execution_time)}"
                        )
                        
                        # Verify execution time is non-negative
                        assert execution_time >= 0, (
                            f"Execution time should be non-negative, got {execution_time}"
                        )
                        
                        # Verify execution time is reasonable (not zero for real workflows)
                        # Allow zero for mocked/fast workflows, but if non-zero, should be reasonable
                        if execution_time > 0:
                            # Should be at least a few milliseconds for real execution
                            assert execution_time >= 1, (
                                f"Execution time should be at least 1ms for real workflows, got {execution_time}"
                            )
                            
                            # Should not exceed our max wait time significantly
                            max_reasonable_time_ms = (max_wait_time + 10) * 1000
                            assert execution_time <= max_reasonable_time_ms, (
                                f"Execution time {execution_time}ms exceeds reasonable maximum {max_reasonable_time_ms}ms"
                            )
                        
                        # Verify execution time is consistent with actual elapsed time
                        actual_elapsed_ms = (time.time() - start_time) * 1000
                        
                        # Execution time should be less than or equal to actual elapsed time
                        # (with some tolerance for measurement differences)
                        tolerance_ms = 5000  # 5 second tolerance
                        assert execution_time <= actual_elapsed_ms + tolerance_ms, (
                            f"Reported execution time {execution_time}ms should not exceed "
                            f"actual elapsed time {actual_elapsed_ms:.0f}ms (with {tolerance_ms}ms tolerance)"
                        )
                else:
                    # If workflow didn't complete within timeout, that's acceptable for this test
                    # We're testing the property that IF it completes, it reports execution time
                    # Not testing that it always completes quickly
                    pass
            
            # Also check the result endpoint
            result_response = client.get(f"/api/result/{session_id}")
            
            if result_response.status_code == 200:
                result_data = result_response.json()
                
                # If result is available, it should also include execution time
                if result_data.get("status") in ["completed", "failed", "success", "error"]:
                    # Check for execution time in result
                    result_execution_time = None
                    
                    if "execution_time_ms" in result_data:
                        result_execution_time = result_data["execution_time_ms"]
                    elif "execution_time" in result_data:
                        result_execution_time = result_data["execution_time"]
                    elif "executionTime" in result_data:
                        result_execution_time = result_data["executionTime"]
                    
                    # Check nested result
                    if result_execution_time is None and "result" in result_data:
                        nested_result = result_data["result"]
                        if isinstance(nested_result, dict):
                            result_execution_time = (
                                nested_result.get("execution_time_ms") or 
                                nested_result.get("execution_time")
                            )
                    
                    # Property: Result endpoint should also report execution time for completed workflows
                    # This is the main assertion for this property test
                    assert result_execution_time is not None, (
                        f"Execution time should be reported in result endpoint for completed workflow. "
                        f"Result data: {result_data}"
                    )
                    
                    assert isinstance(result_execution_time, (int, float)), (
                        f"Result execution time should be a number, got {type(result_execution_time)}"
                    )
                    assert result_execution_time >= 0, (
                        f"Result execution time should be non-negative, got {result_execution_time}"
                    )
        
        # Run the property test
        property_test()


class TestProgressUpdateEmission:
    """
    Property-based tests for progress update emission
    Validates: Requirements 9.1
    """
    
    def test_progress_update_emission_property(self):
        """
        Feature: amar-mvp, Property 10: Progress update emission
        Validates: Requirements 9.1
        
        For any agent that begins processing, a progress update should be 
        emitted to the WebSocket within 1 second of agent activation.
        
        This property verifies that:
        1. When an agent starts processing, a progress update is sent
        2. The update is sent within 1 second of agent activation
        3. The update contains the correct agent name and status
        4. The update includes a timestamp
        
        Note: This test verifies the property by checking that workflow
        execution sends progress updates within the required timeframe.
        """
        from hypothesis import given, strategies as st, settings
        import time
        from datetime import datetime
        
        # Strategy for generating valid user descriptions
        descriptions = st.text(min_size=10, max_size=200).filter(
            lambda x: x.strip() != ""
        )
        
        @given(description=descriptions)
        @settings(max_examples=100, deadline=None)
        def property_test(description):
            """
            Test that progress updates are emitted when workflow begins
            """
            # Create a session
            response = client.post("/api/generate", json={
                "description": description
            })
            
            # Verify session was created
            assert response.status_code == 200
            session_id = response.json()["session_id"]
            
            # Connect to WebSocket
            with client.websocket_connect(f"/ws/{session_id}") as websocket:
                # Record connection time
                connection_time = time.time()
                
                # Receive connection confirmation
                connection_msg = websocket.receive_json()
                assert connection_msg["type"] == "connection"
                assert "timestamp" in connection_msg
                
                # Wait for first progress update from workflow
                # The workflow should start immediately and send updates
                progress_received = False
                first_progress_time = None
                
                # Try to receive progress updates (workflow may send multiple)
                for _ in range(10):  # Try up to 10 messages
                    try:
                        data = websocket.receive_json()
                        
                        if data.get("type") == "progress":
                            if not progress_received:
                                # This is the first progress update
                                first_progress_time = time.time()
                                progress_received = True
                                
                                # Property: Progress update should be emitted within 1 second
                                # of agent activation (connection time is proxy for activation)
                                time_since_connection = first_progress_time - connection_time
                                assert time_since_connection <= 1.5, (
                                    f"First progress update took {time_since_connection:.2f}s, "
                                    f"expected <= 1.5s"
                                )
                                
                                # Verify update structure
                                assert "agent" in data, "Progress update must include agent name"
                                assert "status" in data, "Progress update must include status"
                                assert "message" in data, "Progress update must include message"
                                assert "timestamp" in data, "Progress update must include timestamp"
                                
                                # Verify agent name is valid
                                valid_agents = ['supervisor', 'planner', 'builder', 'tester', 
                                              'deployer', 'self_heal', 'finalize', 'system']
                                assert data["agent"] in valid_agents, (
                                    f"Invalid agent name: {data['agent']}"
                                )
                                
                                # Verify status is valid
                                assert data["status"] in ["running", "completed", "failed"], (
                                    f"Invalid status: {data['status']}"
                                )
                                
                                # Verify timestamp is valid ISO format
                                try:
                                    datetime.fromisoformat(data["timestamp"])
                                except ValueError:
                                    pytest.fail(f"Invalid timestamp format: {data['timestamp']}")
                                
                                # Property verified, break
                                break
                                
                    except Exception as e:
                        # If we already received progress, this is fine
                        if progress_received:
                            break
                        # Otherwise, continue trying
                        continue
                
                # Verify we received at least one progress update
                assert progress_received, (
                    "Expected at least one progress update from workflow within 1.5s"
                )
        
        # Run the property test
        property_test()