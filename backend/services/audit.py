"""
Audit Logging System for AMAR MVP
Provides comprehensive logging for agent decisions, file operations, and errors
with lineage tracking and async performance
Validates: Requirements 8.1, 8.2, 8.3, 8.5
"""

import asyncio
import json
import logging
import traceback
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from uuid import uuid4
from concurrent.futures import ThreadPoolExecutor

from pydantic import BaseModel, Field

from models.core import AuditLogEntry, FileLineage


class AuditLogger:
    """
    Comprehensive audit logging system with JSON formatting and async performance
    
    Logs agent decisions, file operations, errors with full context and lineage tracking.
    Ensures async logging for performance (Requirements 8.5).
    
    Validates: Requirements 8.1, 8.2, 8.3, 8.5
    """
    
    def __init__(self, session_id: str, log_dir: Optional[str] = None):
        """
        Initialize audit logger for a specific session
        
        Args:
            session_id: Unique session identifier
            log_dir: Directory to store log files (optional)
        """
        self.session_id = session_id
        self.log_dir = Path(log_dir) if log_dir else Path("logs")
        self.log_dir.mkdir(exist_ok=True)
        
        # In-memory storage for fast access
        self.entries: List[AuditLogEntry] = []
        self.file_lineage: Dict[str, FileLineage] = {}
        
        # Async logging setup
        self.executor = ThreadPoolExecutor(max_workers=2)
        self.pending_writes: List[asyncio.Task] = []
        
        # Performance tracking
        self.start_time = datetime.now()
        self.operation_count = 0
        
        # Setup JSON logger
        self._setup_json_logger()
    
    def _setup_json_logger(self):
        """Setup structured JSON logger for file output"""
        self.logger = logging.getLogger(f"audit_{self.session_id}")
        self.logger.setLevel(logging.INFO)
        
        # Remove existing handlers to avoid duplicates
        self.logger.handlers.clear()
        
        # JSON file handler
        log_file = self.log_dir / f"audit_{self.session_id}.jsonl"
        handler = logging.FileHandler(log_file)
        handler.setLevel(logging.INFO)
        
        # JSON formatter
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        
        self.logger.addHandler(handler)
        self.logger.propagate = False
    
    async def log_agent_decision(
        self,
        agent: str,
        action: str,
        details: Dict[str, Any],
        duration_ms: Optional[int] = None,
        importance: float = 1.0
    ) -> str:
        """
        Log an agent decision with full context
        
        Args:
            agent: Name of the agent making the decision
            action: Type of action/decision being made
            details: Structured details about the decision
            duration_ms: Time taken for the operation
            importance: Importance level for future analysis
            
        Returns:
            Entry ID for reference
        """
        entry = AuditLogEntry(
            timestamp=datetime.now().isoformat(),
            session_id=self.session_id,
            agent=agent,
            action=action,
            details=details,
            duration_ms=duration_ms
        )
        
        # Add to in-memory storage
        self.entries.append(entry)
        self.operation_count += 1
        
        # Async write to file
        await self._async_write_entry(entry, "agent_decision", importance)
        
        return f"{agent}_{action}_{len(self.entries)}"
    
    async def log_file_operation(
        self,
        agent: str,
        operation: str,  # 'create' | 'modify' | 'delete'
        file_path: str,
        reason: str,
        content_preview: Optional[str] = None,
        duration_ms: Optional[int] = None
    ) -> str:
        """
        Log file operations with lineage tracking
        
        Args:
            agent: Agent performing the operation
            operation: Type of file operation
            file_path: Path to the file
            reason: Reason for the operation
            content_preview: Optional preview of file content
            duration_ms: Time taken for the operation
            
        Returns:
            Entry ID for reference
        """
        # Update file lineage
        if operation == 'create':
            lineage = FileLineage(
                file_path=file_path,
                created_by=agent,
                created_at=datetime.now().isoformat(),
                modified_by=[],
                reason=reason
            )
            self.file_lineage[file_path] = lineage
        elif operation == 'modify' and file_path in self.file_lineage:
            self.file_lineage[file_path].modified_by.append(agent)
        
        # Create audit entry
        details = {
            'operation': operation,
            'file_path': file_path,
            'reason': reason,
            'file_size_bytes': len(content_preview) if content_preview else None,
            'content_preview': content_preview[:200] if content_preview else None,
            'lineage': self.file_lineage.get(file_path, {}).model_dump() if file_path in self.file_lineage else None
        }
        
        entry = AuditLogEntry(
            timestamp=datetime.now().isoformat(),
            session_id=self.session_id,
            agent=agent,
            action=f"file_{operation}",
            details=details,
            duration_ms=duration_ms
        )
        
        self.entries.append(entry)
        self.operation_count += 1
        
        # Async write with high importance for file operations
        await self._async_write_entry(entry, "file_operation", 0.9)
        
        return f"file_{operation}_{file_path}_{len(self.entries)}"
    
    async def log_error(
        self,
        agent: str,
        error: Union[Exception, str],
        context: Dict[str, Any],
        stack_trace: Optional[str] = None,
        duration_ms: Optional[int] = None
    ) -> str:
        """
        Log errors with full context and stack trace
        
        Args:
            agent: Agent where error occurred
            error: Exception or error message
            context: Additional context about the error
            stack_trace: Optional stack trace
            duration_ms: Time taken before error occurred
            
        Returns:
            Entry ID for reference
        """
        # Extract error details
        if isinstance(error, Exception):
            error_type = type(error).__name__
            error_message = str(error)
            if not stack_trace:
                stack_trace = traceback.format_exc()
        else:
            error_type = "GenericError"
            error_message = str(error)
        
        details = {
            'error_type': error_type,
            'error_message': error_message,
            'stack_trace': stack_trace,
            'context': context,
            'retry_count': context.get('retry_count', 0),
            'agent_state': context.get('agent_state', {})
        }
        
        entry = AuditLogEntry(
            timestamp=datetime.now().isoformat(),
            session_id=self.session_id,
            agent=agent,
            action="error",
            details=details,
            duration_ms=duration_ms
        )
        
        self.entries.append(entry)
        self.operation_count += 1
        
        # Async write with highest importance for errors
        await self._async_write_entry(entry, "error", 1.0)
        
        return f"error_{agent}_{len(self.entries)}"
    
    async def log_workflow_transition(
        self,
        from_agent: str,
        to_agent: str,
        reason: str,
        state_data: Dict[str, Any],
        duration_ms: Optional[int] = None
    ) -> str:
        """
        Log workflow transitions between agents
        
        Args:
            from_agent: Agent transitioning from
            to_agent: Agent transitioning to
            reason: Reason for the transition
            state_data: Workflow state data
            duration_ms: Time taken for transition
            
        Returns:
            Entry ID for reference
        """
        details = {
            'from_agent': from_agent,
            'to_agent': to_agent,
            'reason': reason,
            'state_summary': {
                'retry_count': state_data.get('retry_count', 0),
                'errors_count': len(state_data.get('errors', [])),
                'workflow_status': state_data.get('workflow_status', 'unknown')
            },
            'preserved_context': list(state_data.keys())
        }
        
        entry = AuditLogEntry(
            timestamp=datetime.now().isoformat(),
            session_id=self.session_id,
            agent="orchestrator",
            action="workflow_transition",
            details=details,
            duration_ms=duration_ms
        )
        
        self.entries.append(entry)
        self.operation_count += 1
        
        await self._async_write_entry(entry, "workflow", 0.8)
        
        return f"transition_{from_agent}_{to_agent}_{len(self.entries)}"
    
    async def _async_write_entry(self, entry: AuditLogEntry, category: str, importance: float):
        """
        Asynchronously write entry to log file for performance
        Ensures logging doesn't block agent execution (Requirements 8.5)
        """
        async def write_task():
            try:
                # Create enhanced log entry with metadata
                log_data = {
                    **entry.model_dump(),
                    'category': category,
                    'importance': importance,
                    'operation_number': self.operation_count
                }
                
                # Write to JSON log file
                json_line = json.dumps(log_data, default=str)
                self.logger.info(json_line)
                
            except Exception as e:
                # Fallback logging to prevent audit failures from breaking the system
                print(f"Audit logging error: {e}")
        
        # Schedule async write
        task = asyncio.create_task(write_task())
        self.pending_writes.append(task)
        
        # Clean up completed tasks
        self.pending_writes = [t for t in self.pending_writes if not t.done()]
    
    async def flush_pending_writes(self):
        """
        Wait for all pending async writes to complete
        """
        if self.pending_writes:
            await asyncio.gather(*self.pending_writes, return_exceptions=True)
            self.pending_writes.clear()
    
    def get_file_lineage(self, file_path: str) -> Optional[FileLineage]:
        """
        Get lineage information for a specific file
        
        Args:
            file_path: Path to the file
            
        Returns:
            FileLineage object or None if not found
        """
        return self.file_lineage.get(file_path)
    
    def get_all_file_lineage(self) -> Dict[str, FileLineage]:
        """
        Get lineage information for all tracked files
        
        Returns:
            Dictionary mapping file paths to lineage objects
        """
        return self.file_lineage.copy()
    
    def get_entries_by_agent(self, agent: str) -> List[AuditLogEntry]:
        """
        Get all audit entries for a specific agent
        
        Args:
            agent: Agent name to filter by
            
        Returns:
            List of audit entries for the agent
        """
        return [entry for entry in self.entries if entry.agent == agent]
    
    def get_entries_by_action(self, action: str) -> List[AuditLogEntry]:
        """
        Get all audit entries for a specific action type
        
        Args:
            action: Action type to filter by
            
        Returns:
            List of audit entries for the action
        """
        return [entry for entry in self.entries if entry.action == action]
    
    def get_error_entries(self) -> List[AuditLogEntry]:
        """
        Get all error entries
        
        Returns:
            List of error audit entries
        """
        return [entry for entry in self.entries if entry.action == "error"]
    
    async def generate_audit_trail(self) -> Dict[str, Any]:
        """
        Generate complete audit trail JSON for the session
        
        Returns:
            Complete audit trail with summary and all entries
        """
        # Ensure all writes are complete
        await self.flush_pending_writes()
        
        total_duration = (datetime.now() - self.start_time).total_seconds() * 1000
        
        # Calculate statistics
        agents = set(entry.agent for entry in self.entries)
        actions = set(entry.action for entry in self.entries)
        error_count = len(self.get_error_entries())
        
        audit_trail = {
            'session_id': self.session_id,
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_entries': len(self.entries),
                'total_duration_ms': int(total_duration),
                'unique_agents': len(agents),
                'unique_actions': len(actions),
                'error_count': error_count,
                'file_operations': len([e for e in self.entries if e.action.startswith('file_')]),
                'agents': list(agents),
                'actions': list(actions)
            },
            'entries': [entry.model_dump() for entry in self.entries],
            'file_lineage': {path: lineage.model_dump() for path, lineage in self.file_lineage.items()},
            'performance_metrics': {
                'avg_operation_time_ms': sum(
                    e.duration_ms for e in self.entries if e.duration_ms
                ) / len([e for e in self.entries if e.duration_ms]) if any(e.duration_ms for e in self.entries) else 0,
                'operations_per_second': self.operation_count / (total_duration / 1000) if total_duration > 0 else 0
            }
        }
        
        return audit_trail
    
    async def export_to_file(self, file_path: Optional[str] = None) -> str:
        """
        Export complete audit trail to JSON file
        
        Args:
            file_path: Optional custom file path
            
        Returns:
            Path to the exported file
        """
        if not file_path:
            file_path = self.log_dir / f"audit_trail_{self.session_id}.json"
        
        audit_trail = await self.generate_audit_trail()
        
        with open(file_path, 'w') as f:
            json.dump(audit_trail, f, indent=2, default=str)
        
        return str(file_path)
    
    def __del__(self):
        """Cleanup executor on deletion"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False)


class AuditManager:
    """
    Global manager for audit loggers across sessions
    """
    
    def __init__(self, log_dir: Optional[str] = None):
        self.log_dir = log_dir
        self._loggers: Dict[str, AuditLogger] = {}
    
    def get_logger(self, session_id: str) -> AuditLogger:
        """
        Get or create audit logger for a session
        
        Args:
            session_id: Session identifier
            
        Returns:
            AuditLogger instance for the session
        """
        if session_id not in self._loggers:
            self._loggers[session_id] = AuditLogger(session_id, self.log_dir)
        return self._loggers[session_id]
    
    async def finalize_session(self, session_id: str) -> Optional[str]:
        """
        Finalize audit logging for a session and export trail
        
        Args:
            session_id: Session to finalize
            
        Returns:
            Path to exported audit trail file or None if session not found
        """
        if session_id in self._loggers:
            logger = self._loggers[session_id]
            file_path = await logger.export_to_file()
            del self._loggers[session_id]
            return file_path
        return None
    
    def get_active_sessions(self) -> List[str]:
        """
        Get list of active session IDs with audit loggers
        
        Returns:
            List of session IDs
        """
        return list(self._loggers.keys())


# Global audit manager instance
audit_manager = AuditManager()