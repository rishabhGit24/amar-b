"""
LangGraph workflow state definitions and validation functions
Contains WorkflowState TypedDict and related validation logic
Validates: Requirements 14.1, 14.4, 14.5
"""

from typing import Dict, List, Optional, TypedDict, Any
from datetime import datetime

from .core import Plan, TestResults


class WorkflowState(TypedDict):
    """
    LangGraph workflow state schema with all required fields
    
    This state is passed between all agents in the workflow, preserving
    context and enabling proper error handling and retry logic.
    
    Validates: Requirements 14.1, 14.4, 14.5
    """
    # Core workflow data
    user_input: str
    session_id: str
    
    # Agent outputs (preserved across transitions)
    plan: Optional[Dict]
    generated_files: Optional[Dict[str, str]]
    test_results: Optional[Dict]
    deployment_url: Optional[str]
    
    # Error handling and retry logic
    errors: List[str]
    retry_count: int
    
    # Workflow management
    current_agent: str
    workflow_status: str  # 'running' | 'completed' | 'failed'
    
    # Timestamps and metadata
    started_at: str
    last_updated: str
    execution_time_ms: Optional[int]
    
    # Agent-specific context (preserved across all transitions)
    agent_context: Dict[str, Any]


def validate_workflow_state(state: WorkflowState) -> bool:
    """
    Validate that workflow state contains all required fields
    Returns True if valid, raises ValueError if invalid
    """
    required_fields = [
        'user_input', 'session_id', 'errors', 'retry_count', 
        'current_agent', 'workflow_status', 'started_at', 
        'last_updated', 'agent_context'
    ]
    
    for field in required_fields:
        if field not in state:
            raise ValueError(f"Missing required field in workflow state: {field}")
    
    # Validate field types and constraints
    if not isinstance(state['user_input'], str) or not state['user_input'].strip():
        raise ValueError("user_input must be a non-empty string")
    
    if not isinstance(state['session_id'], str):
        raise ValueError("session_id must be a string")
    
    if not isinstance(state['errors'], list):
        raise ValueError("errors must be a list")
    
    if not isinstance(state['retry_count'], int) or state['retry_count'] < 0:
        raise ValueError("retry_count must be a non-negative integer")
    
    if state['workflow_status'] not in ['running', 'completed', 'failed']:
        raise ValueError("workflow_status must be 'running', 'completed', or 'failed'")
    
    if not isinstance(state['agent_context'], dict):
        raise ValueError("agent_context must be a dictionary")
    
    return True


def create_initial_workflow_state(user_input: str, session_id: str) -> WorkflowState:
    """
    Create initial workflow state from user input
    
    Initializes all required fields with proper defaults, ensuring
    the state is ready for the workflow execution.
    
    Args:
        user_input: User's application description
        session_id: Unique session identifier
        
    Returns:
        Initialized WorkflowState ready for execution
        
    Validates: Requirements 14.4
    """
    now = datetime.now().isoformat()
    
    return WorkflowState(
        user_input=user_input,
        session_id=session_id,
        plan=None,
        generated_files=None,
        test_results=None,
        deployment_url=None,
        errors=[],
        retry_count=0,
        current_agent='supervisor',
        workflow_status='running',
        started_at=now,
        last_updated=now,
        execution_time_ms=None,
        agent_context={}
    )


def update_workflow_state(
    state: WorkflowState, 
    agent: str, 
    updates: Dict[str, Any]
) -> WorkflowState:
    """
    Update workflow state with new data from an agent
    
    Preserves all existing context and adds new information, ensuring
    that previous agent outputs and decisions are maintained across
    agent transitions.
    
    Args:
        state: Current workflow state
        agent: Name of the agent making the update
        updates: Dictionary of fields to update
        
    Returns:
        Updated WorkflowState with preserved context
        
    Validates: Requirements 14.5
    """
    # Create a copy to avoid mutating the original
    new_state = state.copy()
    
    # Update core fields
    new_state['current_agent'] = agent
    new_state['last_updated'] = datetime.now().isoformat()
    
    # Apply updates while preserving existing data
    for key, value in updates.items():
        if key in new_state:
            # Special handling for agent_context to merge instead of replace
            if key == 'agent_context':
                existing_context = new_state.get('agent_context', {})
                new_state['agent_context'] = {**existing_context, **value}
            else:
                new_state[key] = value
        else:
            # Store unknown fields in agent_context
            if 'agent_context' not in new_state:
                new_state['agent_context'] = {}
            new_state['agent_context'][key] = value
    
    # Validate the updated state
    validate_workflow_state(new_state)
    
    return new_state


def add_error_to_state(state: WorkflowState, error: str, agent: str) -> WorkflowState:
    """
    Add an error to the workflow state with proper formatting
    """
    error_entry = {
        'agent': agent,
        'error': error,
        'timestamp': datetime.now().isoformat(),
        'retry_count': state['retry_count']
    }
    
    new_state = state.copy()
    new_state['errors'].append(str(error_entry))
    new_state['last_updated'] = datetime.now().isoformat()
    
    return new_state


def increment_retry_count(state: WorkflowState) -> WorkflowState:
    """
    Increment retry count in workflow state
    """
    new_state = state.copy()
    new_state['retry_count'] += 1
    new_state['last_updated'] = datetime.now().isoformat()
    
    return new_state


def finalize_workflow_state(
    state: WorkflowState, 
    status: str, 
    execution_time_ms: int
) -> WorkflowState:
    """
    Finalize workflow state when workflow completes or fails
    
    Sets the final status and execution time, preparing the state
    for return to the user.
    
    Args:
        state: Current workflow state
        status: Final status ('completed' or 'failed')
        execution_time_ms: Total execution time in milliseconds
        
    Returns:
        Finalized WorkflowState ready for return
        
    Validates: Requirements 14.4
    """
    new_state = state.copy()
    new_state['workflow_status'] = status
    new_state['execution_time_ms'] = execution_time_ms
    new_state['last_updated'] = datetime.now().isoformat()
    
    return new_state



def get_agent_output(state: WorkflowState, agent: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve output from a specific agent stored in the workflow state
    
    Args:
        state: Current workflow state
        agent: Name of the agent whose output to retrieve
        
    Returns:
        Agent output dictionary or None if not found
        
    Validates: Requirements 14.5
    """
    agent_context = state.get('agent_context', {})
    return agent_context.get(f'{agent}_output')


def store_agent_output(
    state: WorkflowState, 
    agent: str, 
    output: Dict[str, Any]
) -> WorkflowState:
    """
    Store agent output in workflow state for future reference
    
    Args:
        state: Current workflow state
        agent: Name of the agent storing output
        output: Output data to store
        
    Returns:
        Updated WorkflowState with stored output
        
    Validates: Requirements 14.5
    """
    new_state = state.copy()
    
    if 'agent_context' not in new_state:
        new_state['agent_context'] = {}
    
    new_state['agent_context'][f'{agent}_output'] = output
    new_state['last_updated'] = datetime.now().isoformat()
    
    return new_state


def get_workflow_summary(state: WorkflowState) -> Dict[str, Any]:
    """
    Generate a summary of the workflow state for logging and display
    
    Args:
        state: Current workflow state
        
    Returns:
        Dictionary with workflow summary information
    """
    return {
        'session_id': state['session_id'],
        'current_agent': state['current_agent'],
        'workflow_status': state['workflow_status'],
        'retry_count': state['retry_count'],
        'has_plan': state.get('plan') is not None,
        'has_generated_files': state.get('generated_files') is not None,
        'has_test_results': state.get('test_results') is not None,
        'has_deployment_url': state.get('deployment_url') is not None,
        'error_count': len(state.get('errors', [])),
        'execution_time_ms': state.get('execution_time_ms'),
        'started_at': state['started_at'],
        'last_updated': state['last_updated']
    }


def is_terminal_state(state: WorkflowState) -> bool:
    """
    Check if workflow has reached a terminal state
    
    Args:
        state: Current workflow state
        
    Returns:
        True if workflow is in terminal state, False otherwise
        
    Validates: Requirements 14.4
    """
    return state['workflow_status'] in ['completed', 'failed']


def has_errors(state: WorkflowState) -> bool:
    """
    Check if workflow state contains any errors
    
    Args:
        state: Current workflow state
        
    Returns:
        True if errors exist, False otherwise
    """
    return len(state.get('errors', [])) > 0


def can_retry(state: WorkflowState, max_retries: int = 3) -> bool:
    """
    Check if workflow can retry based on retry count
    
    Args:
        state: Current workflow state
        max_retries: Maximum number of retries allowed
        
    Returns:
        True if retry is possible, False otherwise
        
    Validates: Requirements 5.4
    """
    return state['retry_count'] < max_retries


def preserve_context_across_transition(
    from_state: WorkflowState,
    to_state: WorkflowState
) -> WorkflowState:
    """
    Ensure all context is preserved when transitioning between states
    
    This function explicitly validates that no data is lost during
    state transitions, which is critical for workflow correctness.
    
    Args:
        from_state: Previous workflow state
        to_state: New workflow state
        
    Returns:
        Validated state with all context preserved
        
    Validates: Requirements 14.5
    """
    # Verify critical fields are preserved
    critical_fields = [
        'user_input', 'session_id', 'started_at', 
        'plan', 'generated_files', 'agent_context'
    ]
    
    for field in critical_fields:
        if from_state.get(field) is not None:
            if to_state.get(field) is None:
                # Context was lost, restore it
                to_state[field] = from_state[field]
    
    # Ensure errors are accumulated, not replaced
    from_errors = from_state.get('errors', [])
    to_errors = to_state.get('errors', [])
    
    # Merge errors if new ones were added
    if len(to_errors) < len(from_errors):
        to_state['errors'] = from_errors
    
    return to_state
