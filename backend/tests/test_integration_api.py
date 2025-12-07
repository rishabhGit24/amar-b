"""
Integration tests for FastAPI backend with workflow
Tests the complete flow from API endpoint to workflow execution
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)


def test_websocket_connection():
    """Test WebSocket connection establishment"""
    # First create a session
    response = client.post("/api/generate", json={
        "description": "Build a simple landing page"
    })
    assert response.status_code == 200
    session_id = response.json()["session_id"]
    
    # Connect to WebSocket
    with client.websocket_connect(f"/ws/{session_id}") as websocket:
        # Receive connection confirmation
        data = websocket.receive_json()
        assert data["type"] == "connection"
        assert data["session_id"] == session_id
        assert "Connected to progress updates" in data["message"]


def test_websocket_nonexistent_session():
    """Test WebSocket connection with non-existent session"""
    with client.websocket_connect("/ws/nonexistent-session") as websocket:
        # Should receive error message
        data = websocket.receive_json()
        assert data["type"] == "error"
        assert "not found" in data["message"]


def test_result_endpoint_before_workflow():
    """Test result endpoint returns appropriate response before workflow completes"""
    # Create a session
    response = client.post("/api/generate", json={
        "description": "Build a simple landing page"
    })
    assert response.status_code == 200
    session_id = response.json()["session_id"]
    
    # Get result immediately (workflow hasn't started yet)
    result_response = client.get(f"/api/result/{session_id}")
    assert result_response.status_code == 200
    result_data = result_response.json()
    
    # Should indicate workflow not complete
    assert result_data["success"] is False
    assert "not yet started" in result_data["error"] or "in progress" in result_data["error"]


def test_health_check_shows_active_sessions():
    """Test health check endpoint shows active session count"""
    # Create a session
    response = client.post("/api/generate", json={
        "description": "Build a simple landing page"
    })
    assert response.status_code == 200
    
    # Check health endpoint
    health_response = client.get("/")
    assert health_response.status_code == 200
    health_data = health_response.json()
    
    assert "active_sessions" in health_data
    assert health_data["active_sessions"] >= 1


def test_websocket_ping_pong():
    """Test WebSocket keepalive with ping/pong"""
    # Create a session
    response = client.post("/api/generate", json={
        "description": "Build a simple landing page"
    })
    assert response.status_code == 200
    session_id = response.json()["session_id"]
    
    # Connect to WebSocket
    with client.websocket_connect(f"/ws/{session_id}") as websocket:
        # Receive connection confirmation
        data = websocket.receive_json()
        assert data["type"] == "connection"
        
        # Send ping
        websocket.send_text("ping")
        
        # Receive response (could be pong or progress update from workflow)
        response_data = websocket.receive_json()
        # Either pong or progress is acceptable since workflow may have started
        assert response_data["type"] in ["pong", "progress"]
        assert "timestamp" in response_data
