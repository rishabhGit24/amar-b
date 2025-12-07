"""
AMAR MVP Data Models Package
Contains Pydantic models for data validation and serialization
"""

from .core import (
    UserRequest,
    Plan,
    PageSpec,
    ComponentSpec,
    RoutingConfig,
    BackendSpec,
    GeneratedProject,
    TestResults,
    AuditLogEntry,
    FileLineage,
    AgentResponse
)

from .workflow import (
    WorkflowState,
    validate_workflow_state,
    create_initial_workflow_state,
    update_workflow_state,
    add_error_to_state,
    increment_retry_count,
    finalize_workflow_state
)

__all__ = [
    'UserRequest',
    'Plan', 
    'PageSpec',
    'ComponentSpec',
    'RoutingConfig',
    'BackendSpec',
    'GeneratedProject',
    'TestResults',
    'AuditLogEntry',
    'FileLineage',
    'AgentResponse',
    'WorkflowState',
    'validate_workflow_state',
    'create_initial_workflow_state',
    'update_workflow_state',
    'add_error_to_state',
    'increment_retry_count',
    'finalize_workflow_state'
]