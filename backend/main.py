"""
AMAR MVP Backend - FastAPI Application
Main entry point for the multi-agent web application
Validates: Requirements 1.3, 9.1
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uvicorn
import os
import logging
from typing import Optional, Dict, Any
import uuid
import json
from datetime import datetime
from pydantic import ValidationError
import asyncio

# Configure clean logging - only show phase transitions
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',  # Simple format without timestamps for cleaner output
    handlers=[logging.StreamHandler()]
)

# Suppress verbose library logs
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("google").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)

from models import UserRequest
from services.rag_service import get_rag_service
from services.error_handler import (
    get_error_handler,
    UserInputError,
    SystemError as AmarSystemError
)
from services.graceful_failure import get_graceful_failure_handler
from config import get_settings

# Get application settings
settings = get_settings()

app = FastAPI(
    title="AMAR MVP Backend",
    description="Multi-agent web application for autonomous React app generation",
    version="1.0.0"
)

# Configure CORS with dynamic origins
cors_origins = settings.cors_origins_list
if settings.is_production:
    # In production, add the deployed frontend URL if available
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url and frontend_url not in cors_origins:
        cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for sessions (will be replaced with proper storage later)
sessions: Dict[str, Dict[str, Any]] = {}
active_connections: Dict[str, WebSocket] = {}
workflow_tasks: Dict[str, asyncio.Task] = {}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors and return 400 status code"""
    # Check if the error is related to our UserRequest description validation
    for error in exc.errors():
        if error.get('type') == 'value_error' and 'Description cannot be empty' in str(error.get('ctx', {})):
            return JSONResponse(
                status_code=400,
                content={"detail": "Description cannot be empty"}
            )
    
    # For other validation errors, return the default 422
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )


from pydantic import BaseModel

class GenerateResponse(BaseModel):
    """Response model for /api/generate endpoint"""
    session_id: str
    message: str
    status: str


class ProgressUpdate(BaseModel):
    """Model for progress update messages sent via WebSocket"""
    agent: str
    status: str  # 'running' | 'completed' | 'failed'
    message: str
    details: Optional[str] = None
    timestamp: str


class DeploymentResult(BaseModel):
    """Model for final deployment result"""
    success: bool
    url: Optional[str] = None
    error: Optional[str] = None
    execution_time_ms: Optional[int] = None
    project_summary: Optional[Dict[str, Any]] = None


@app.get("/")
async def root():
    """
    Health check endpoint
    Returns basic status information about the API including resource status
    
    Validates: Requirements 8.3
    """
    rag_service = get_rag_service()
    graceful_failure = get_graceful_failure_handler()
    
    # Get resource status
    resource_status = graceful_failure.get_resource_status()
    
    # Determine overall health
    memory_status = resource_status.get('memory', {}).get('status', 'unknown')
    disk_status = resource_status.get('disk', {}).get('status', 'unknown')
    
    overall_status = "healthy"
    if memory_status == 'critical' or disk_status == 'critical':
        overall_status = "critical"
    elif memory_status == 'warning' or disk_status == 'warning':
        overall_status = "degraded"
    
    return {
        "message": "AMAR MVP Backend is running",
        "status": overall_status,
        "version": "1.0.0",
        "active_sessions": len(sessions),
        "active_connections": len(active_connections),
        "rag_enabled": rag_service.is_enabled,
        "resources": resource_status
    }


@app.get("/health")
async def health_check():
    """
    Dedicated health check endpoint for deployment platforms
    
    This endpoint provides a simple health check for Railway, Heroku, and other
    deployment platforms. It returns 200 OK if the service is running and healthy,
    or 503 Service Unavailable if there are critical issues.
    
    Validates: Requirements 8.1
    
    Returns:
        JSON with status and basic health information
    """
    graceful_failure = get_graceful_failure_handler()
    
    # Get resource status
    resource_status = graceful_failure.get_resource_status()
    
    # Determine overall health
    memory_status = resource_status.get('memory', {}).get('status', 'unknown')
    disk_status = resource_status.get('disk', {}).get('status', 'unknown')
    
    is_healthy = memory_status != 'critical' and disk_status != 'critical'
    
    response = {
        "status": "healthy" if is_healthy else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "checks": {
            "memory": memory_status,
            "disk": disk_status
        }
    }
    
    if is_healthy:
        return response
    else:
        return JSONResponse(status_code=503, content=response)


@app.post("/api/rag/enable")
async def enable_rag(knowledge_base_path: str):
    """
    Enable RAG-FAISS system with specified knowledge base.
    
    This endpoint should be called once your friend's RAG-FAISS system
    is ready to be integrated.
    
    Args:
        knowledge_base_path: Path to the knowledge base
        
    Returns:
        Status message
    """
    rag_service = get_rag_service()
    rag_service.enable_rag(knowledge_base_path)
    return {
        "message": "RAG-FAISS enabled successfully",
        "knowledge_base_path": knowledge_base_path,
        "enabled": True
    }


@app.post("/api/rag/disable")
async def disable_rag():
    """
    Disable RAG-FAISS system (fallback to direct query processing).
    
    Returns:
        Status message
    """
    rag_service = get_rag_service()
    rag_service.disable_rag()
    return {
        "message": "RAG-FAISS disabled",
        "enabled": False
    }


@app.post("/api/generate", response_model=GenerateResponse)
async def generate_application(request: UserRequest):
    """
    Initiate application generation workflow
    
    This endpoint receives a user's application description and initiates
    the LangGraph workflow. It returns a session ID that can be used to
    track progress via WebSocket and retrieve final results.
    
    The workflow is executed asynchronously in the background, and progress
    updates are sent via WebSocket to connected clients.
    
    RAG-FAISS Integration Point:
    Before passing the user query to LangGraph, this endpoint calls the
    RAG service to retrieve relevant context from the knowledge base.
    This enriches the user query with relevant information.
    
    Validates: Requirements 1.2, 1.3, 1.4, 7.1, 11.1, 11.2, 11.3
    
    Args:
        request: UserRequest with application description
        
    Returns:
        GenerateResponse with session_id for tracking
        
    Raises:
        HTTPException: 400 if description is empty or invalid
    """
    error_handler = get_error_handler()
    graceful_failure = get_graceful_failure_handler()
    
    try:
        # Comprehensive input validation
        is_valid, error_msg = error_handler.validate_user_input(request.description)
        if not is_valid:
            raise UserInputError(error_msg, details={'description_length': len(request.description)})
        
        # Check system resources before starting workflow with graceful handling
        can_continue, resource_error = graceful_failure.check_and_handle_resources()
        if not can_continue:
            raise AmarSystemError(
                resource_error,
                details={'resource_check': 'failed'}
            )
    
    except (UserInputError, AmarSystemError) as e:
        user_message, error_details = error_handler.handle_error(
            e,
            context={'endpoint': '/api/generate', 'action': 'validation'}
        )
        raise HTTPException(status_code=400, detail=user_message)
    
    except Exception as e:
        user_message, error_details = error_handler.handle_error(
            e,
            context={'endpoint': '/api/generate', 'action': 'validation'}
        )
        raise HTTPException(status_code=500, detail=user_message)
    
    try:
        # Create new session
        session_id = request.session_id if request.session_id else str(uuid.uuid4())
        
        # RAG-FAISS Integration: Retrieve relevant context from knowledge base
        # This is the integration point for your friend's RAG-FAISS system
        rag_service = get_rag_service()
        
        try:
            rag_result = await rag_service.retrieve_context(
                user_query=request.description.strip(),
                top_k=3  # Retrieve top 3 relevant documents (reduced to limit token usage)
            )
            enriched_description = rag_result["enriched_query"]
        except Exception as rag_error:
            # Log RAG error but don't fail the request
            error_handler.handle_error(
                rag_error,
                context={'endpoint': '/api/generate', 'action': 'rag_retrieval'}
            )
            # Fallback to original description
            enriched_description = request.description.strip()
        
        # Initialize session data
        sessions[session_id] = {
            "description": request.description.strip(),
            "enriched_description": enriched_description,
            "rag_metadata": rag_result.get("metadata", {}) if 'rag_result' in locals() else {},
            "status": "initiated",
            "created_at": datetime.now().isoformat(),
            "progress": [],
            "result": None,
            "workflow_state": None
        }
        
        # Start workflow execution in background with enriched description
        task = asyncio.create_task(execute_workflow_background(session_id, enriched_description))
        workflow_tasks[session_id] = task
        
        return GenerateResponse(
            session_id=session_id,
            message="Application generation initiated. Connect to WebSocket for progress updates.",
            status="initiated"
        )
    
    except Exception as e:
        user_message, error_details = error_handler.handle_error(
            e,
            context={'endpoint': '/api/generate', 'action': 'session_creation'}
        )
        raise HTTPException(status_code=500, detail=user_message)


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time progress updates
    
    This endpoint provides real-time updates about agent activities during
    the workflow execution. Clients connect with a session_id and receive
    progress updates as agents transition and complete tasks.
    
    Validates: Requirements 9.1, 9.2, 9.3, 9.4
    
    Args:
        websocket: WebSocket connection
        session_id: Session identifier for tracking
        
    Message Format:
        {
            "type": "connection" | "progress" | "error" | "complete",
            "agent": "planner" | "builder" | "deployer" | "tester",
            "status": "running" | "completed" | "failed",
            "message": "Human-readable status message",
            "details": "Optional additional information",
            "timestamp": "ISO 8601 timestamp"
        }
    """
    await websocket.accept()
    active_connections[session_id] = websocket
    
    try:
        # Verify session exists
        if session_id not in sessions:
            await websocket.send_json({
                "type": "error",
                "message": f"Session {session_id} not found",
                "timestamp": datetime.now().isoformat()
            })
            await websocket.close()
            return
        
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connection",
            "message": "Connected to progress updates",
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        })
        
        # Send any existing progress updates
        session = sessions[session_id]
        for progress in session.get("progress", []):
            await websocket.send_json(progress)
        
        # Keep connection alive and listen for client messages
        while True:
            try:
                # Receive messages from client (for keepalive)
                data = await websocket.receive_text()
                
                # Echo back to confirm connection is alive
                if data == "ping":
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.now().isoformat()
                    })
                    
            except WebSocketDisconnect:
                break
            except Exception as e:
                # Log error but keep connection open
                await websocket.send_json({
                    "type": "error",
                    "message": f"Error processing message: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                })
            
    except WebSocketDisconnect:
        pass
    finally:
        # Clean up connection
        if session_id in active_connections:
            del active_connections[session_id]


@app.get("/api/result/{session_id}", response_model=DeploymentResult)
async def get_result(session_id: str):
    """
    Get final deployment result for a session
    
    This endpoint returns the final result of the workflow execution,
    including the deployment URL, execution time, and project summary.
    It should be called after the workflow completes (as indicated by
    WebSocket messages).
    
    Validates: Requirements 7.1, 7.2, 7.3
    
    Args:
        session_id: Session identifier
        
    Returns:
        DeploymentResult with URL and project information
        
    Raises:
        HTTPException: 404 if session not found
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    workflow_state = session.get("workflow_state")
    
    # Check if workflow has completed
    if not workflow_state:
        return DeploymentResult(
            success=False,
            error="Workflow not yet started or still in progress",
            execution_time_ms=None,
            project_summary=None
        )
    
    # Extract result information from workflow state
    status = workflow_state.get("workflow_status", "unknown")
    deployment_url = workflow_state.get("deployment_url")
    execution_time_ms = workflow_state.get("execution_time_ms")
    errors = workflow_state.get("errors", [])
    
    # Build project summary
    project_summary = None
    if workflow_state.get("plan"):
        plan = workflow_state["plan"]
        generated_files = workflow_state.get("generated_files", {})
        
        project_summary = {
            "page_count": len(plan.get("pages", [])),
            "component_count": len(plan.get("components", [])),
            "file_count": len(generated_files),
            "has_backend": plan.get("backend_logic") is not None
        }
    
    # Determine success
    success = status == "completed" and deployment_url is not None
    
    # Format error message if failed
    error_message = None
    if not success:
        if errors:
            error_message = "; ".join(errors[:3])  # Show first 3 errors
        elif status == "failed":
            error_message = "Workflow failed without specific error details"
        elif not deployment_url:
            error_message = "Deployment URL not available"
    
    return DeploymentResult(
        success=success,
        url=deployment_url,
        error=error_message,
        execution_time_ms=execution_time_ms,
        project_summary=project_summary
    )


async def send_progress_update(
    session_id: str,
    agent: str,
    status: str,
    message: str,
    details: Optional[str] = None
):
    """
    Helper function to send progress updates via WebSocket
    
    This function is called by the workflow to broadcast progress updates
    to connected clients. It stores the update in session history and
    sends it to any active WebSocket connections.
    
    Validates: Requirements 9.1, 9.2
    
    Args:
        session_id: Session identifier
        agent: Name of the agent sending the update
        status: Status of the agent ('running', 'completed', 'failed')
        message: Human-readable status message
        details: Optional additional details
    """
    if session_id not in sessions:
        return
    
    # Log clean phase transition
    phase_emoji = {
        "supervisor": "🎯",
        "planner": "📋",
        "builder": "🔨",
        "tester": "🧪",
        "deployer": "🚀",
        "finalize": "✅",
        "system": "⚠️"
    }
    emoji = phase_emoji.get(agent, "▶️")
    
    if status == "running":
        logging.info(f"{emoji} {agent.upper()}: {message}")
    elif status == "completed":
        logging.info(f"✓ {agent.upper()}: {message}")
    elif status == "failed":
        logging.error(f"✗ {agent.upper()}: {message}")
    
    # Create progress update
    update = {
        "type": "progress",
        "agent": agent,
        "status": status,
        "message": message,
        "details": details,
        "timestamp": datetime.now().isoformat()
    }
    
    # Store in session history
    sessions[session_id]["progress"].append(update)
    
    # Send to active WebSocket connection if exists
    if session_id in active_connections:
        try:
            await active_connections[session_id].send_json(update)
        except Exception as e:
            # Connection may have closed, remove it
            if session_id in active_connections:
                del active_connections[session_id]


async def execute_workflow_background(session_id: str, user_input: str):
    """
    Execute LangGraph workflow in background and stream progress updates
    
    This function runs the complete workflow from user input to deployment,
    sending progress updates via WebSocket as agents transition and complete
    their tasks.
    
    Validates: Requirements 1.4, 5.1, 6.5, 7.1, 7.3, 8.3, 9.1, 9.2, 9.3, 9.4
    
    Args:
        session_id: Session identifier for tracking
        user_input: User's application description
    """
    error_handler = get_error_handler()
    graceful_failure = get_graceful_failure_handler()
    
    try:
        # Check system resources before starting with graceful handling
        can_continue, resource_error = graceful_failure.check_and_handle_resources()
        if not can_continue:
            raise AmarSystemError(
                resource_error,
                details={'session_id': session_id, 'phase': 'pre_workflow'}
            )
        
        # Import orchestrator
        from workflow.orchestrator import get_orchestrator
        
        # Update session status
        sessions[session_id]["status"] = "running"
        
        # Send initial progress update
        await send_progress_update(
            session_id,
            "supervisor",
            "running",
            "Workflow initiated, starting planning phase",
            None
        )
        
        # Get orchestrator instance
        orchestrator = get_orchestrator()
        
        # Create progress callback that wraps send_progress_update
        async def progress_callback(agent: str, status: str, message: str, details: str = None):
            await send_progress_update(session_id, agent, status, message, details)
        
        # Execute workflow with progress callback
        try:
            final_state = await orchestrator.execute_workflow(user_input, session_id, progress_callback)
        except Exception as workflow_error:
            # Handle workflow execution errors
            user_message, error_details = error_handler.handle_error(
                workflow_error,
                context={
                    'session_id': session_id,
                    'phase': 'workflow_execution',
                    'user_input': user_input[:100]  # First 100 chars for context
                }
            )
            
            # Create failed state
            final_state = {
                'workflow_status': 'failed',
                'errors': [user_message],
                'error_details': error_details
            }
        
        # Store final state in session
        sessions[session_id]["workflow_state"] = final_state
        
        # Determine final status
        if final_state.get("workflow_status") == "completed":
            sessions[session_id]["status"] = "completed"
            
            # Send completion update
            await send_progress_update(
                session_id,
                "finalize",
                "completed",
                "Application deployed successfully!",
                f"Deployment URL: {final_state.get('deployment_url', 'N/A')}"
            )
            
            # Send final complete message
            if session_id in active_connections:
                try:
                    await active_connections[session_id].send_json({
                        "type": "complete",
                        "message": "Workflow completed successfully",
                        "deployment_url": final_state.get("deployment_url"),
                        "execution_time_ms": final_state.get("execution_time_ms"),
                        "timestamp": datetime.now().isoformat()
                    })
                except Exception as ws_error:
                    # Log WebSocket error but don't fail the workflow
                    error_handler.handle_error(
                        ws_error,
                        context={'session_id': session_id, 'phase': 'websocket_send'}
                    )
        else:
            sessions[session_id]["status"] = "failed"
            
            # Send failure update
            errors = final_state.get("errors", [])
            error_msg = errors[0] if errors else "Unknown error occurred"
            
            await send_progress_update(
                session_id,
                "finalize",
                "failed",
                "Workflow failed",
                error_msg
            )
            
            # Send final error message
            if session_id in active_connections:
                try:
                    await active_connections[session_id].send_json({
                        "type": "error",
                        "message": "Workflow failed",
                        "error": error_msg,
                        "timestamp": datetime.now().isoformat()
                    })
                except Exception as ws_error:
                    # Log WebSocket error but don't fail the workflow
                    error_handler.handle_error(
                        ws_error,
                        context={'session_id': session_id, 'phase': 'websocket_send'}
                    )
        
    except AmarSystemError as system_error:
        # Handle system-level errors
        user_message, error_details = error_handler.handle_error(
            system_error,
            context={'session_id': session_id, 'phase': 'system_check'}
        )
        
        sessions[session_id]["status"] = "failed"
        sessions[session_id]["workflow_state"] = {
            'workflow_status': 'failed',
            'errors': [user_message],
            'error_details': error_details
        }
        
        # Send error update
        await send_progress_update(
            session_id,
            "system",
            "failed",
            "System error occurred",
            user_message
        )
        
        # Send final error message
        if session_id in active_connections:
            try:
                await active_connections[session_id].send_json({
                    "type": "error",
                    "message": "System error occurred",
                    "error": user_message,
                    "timestamp": datetime.now().isoformat()
                })
            except:
                pass  # Ignore WebSocket errors at this point
    
    except Exception as e:
        # Handle unexpected errors
        user_message, error_details = error_handler.handle_error(
            e,
            context={'session_id': session_id, 'phase': 'unexpected'}
        )
        
        sessions[session_id]["status"] = "failed"
        sessions[session_id]["workflow_state"] = {
            'workflow_status': 'failed',
            'errors': [user_message],
            'error_details': error_details
        }
        
        # Send error update
        await send_progress_update(
            session_id,
            "system",
            "failed",
            "Unexpected error occurred",
            user_message
        )
        
        # Send final error message
        if session_id in active_connections:
            try:
                await active_connections[session_id].send_json({
                    "type": "error",
                    "message": "Unexpected error occurred",
                    "error": user_message,
                    "timestamp": datetime.now().isoformat()
                })
            except:
                pass  # Ignore WebSocket errors at this point
    
    finally:
        # Clean up workflow task
        if session_id in workflow_tasks:
            del workflow_tasks[session_id]


if __name__ == "__main__":
    # Use settings for configuration
    reload = not settings.is_production
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=reload,
        log_level=settings.log_level.lower()
    )