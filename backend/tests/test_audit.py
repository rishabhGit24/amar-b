"""
Tests for AuditLogger system
Validates: Requirements 8.1, 8.2, 8.3, 8.5
"""

import pytest
import asyncio
import json
import tempfile
from pathlib import Path
from datetime import datetime
from hypothesis import given, strategies as st, settings
from backend.services.audit import AuditLogger, AuditManager
from backend.models.core import AuditLogEntry, FileLineage


class TestAuditLogger:
    """Test AuditLogger class functionality"""
    
    @pytest.fixture
    def temp_log_dir(self):
        """Create temporary directory for test logs"""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    @pytest.fixture
    def audit_logger(self, temp_log_dir):
        """Create audit logger for testing"""
        return AuditLogger("test_session", temp_log_dir)
    
    @pytest.mark.asyncio
    async def test_logger_initialization(self, temp_log_dir):
        """Test audit logger initializes correctly"""
        logger = AuditLogger("test_session_123", temp_log_dir)
        
        assert logger.session_id == "test_session_123"
        assert logger.log_dir == Path(temp_log_dir)
        assert len(logger.entries) == 0
        assert len(logger.file_lineage) == 0
        assert logger.operation_count == 0
    
    @pytest.mark.asyncio
    async def test_log_agent_decision(self, audit_logger):
        """Test logging agent decisions"""
        entry_id = await audit_logger.log_agent_decision(
            agent="planner",
            action="generate_plan",
            details={"pages": 3, "complexity": "medium"},
            duration_ms=1500
        )
        
        assert entry_id is not None
        assert len(audit_logger.entries) == 1
        
        entry = audit_logger.entries[0]
        assert entry.agent == "planner"
        assert entry.action == "generate_plan"
        assert entry.details["pages"] == 3
        assert entry.duration_ms == 1500
        assert entry.session_id == "test_session"
    
    @pytest.mark.asyncio
    async def test_log_file_operation_create(self, audit_logger):
        """Test logging file creation with lineage tracking"""
        entry_id = await audit_logger.log_file_operation(
            agent="builder",
            operation="create",
            file_path="src/App.tsx",
            reason="Generate main React component",
            content_preview="import React from 'react'...",
            duration_ms=800
        )
        
        assert entry_id is not None
        assert len(audit_logger.entries) == 1
        
        # Check audit entry
        entry = audit_logger.entries[0]
        assert entry.agent == "builder"
        assert entry.action == "file_create"
        assert entry.details["operation"] == "create"
        assert entry.details["file_path"] == "src/App.tsx"
        
        # Check lineage tracking
        lineage = audit_logger.get_file_lineage("src/App.tsx")
        assert lineage is not None
        assert lineage.created_by == "builder"
        assert lineage.reason == "Generate main React component"
        assert len(lineage.modified_by) == 0
    
    @pytest.mark.asyncio
    async def test_log_file_operation_modify(self, audit_logger):
        """Test logging file modification updates lineage"""
        # First create a file
        await audit_logger.log_file_operation(
            agent="builder",
            operation="create",
            file_path="src/App.tsx",
            reason="Initial creation"
        )
        
        # Then modify it
        await audit_logger.log_file_operation(
            agent="builder",
            operation="modify",
            file_path="src/App.tsx",
            reason="Add error handling"
        )
        
        # Check lineage was updated
        lineage = audit_logger.get_file_lineage("src/App.tsx")
        assert lineage.created_by == "builder"
        assert "builder" in lineage.modified_by
        assert len(audit_logger.entries) == 2
    
    @pytest.mark.asyncio
    async def test_log_error_with_exception(self, audit_logger):
        """Test logging errors with exception objects"""
        try:
            raise ValueError("Test error message")
        except Exception as e:
            entry_id = await audit_logger.log_error(
                agent="builder",
                error=e,
                context={"retry_count": 2, "agent_state": {"files_generated": 3}},
                duration_ms=200
            )
        
        assert entry_id is not None
        assert len(audit_logger.entries) == 1
        
        entry = audit_logger.entries[0]
        assert entry.agent == "builder"
        assert entry.action == "error"
        assert entry.details["error_type"] == "ValueError"
        assert entry.details["error_message"] == "Test error message"
        assert entry.details["context"]["retry_count"] == 2
        assert "Traceback" in entry.details["stack_trace"]
    
    @pytest.mark.asyncio
    async def test_log_error_with_string(self, audit_logger):
        """Test logging errors with string messages"""
        entry_id = await audit_logger.log_error(
            agent="deployer",
            error="Deployment failed: API timeout",
            context={"platform": "vercel", "attempt": 1}
        )
        
        assert entry_id is not None
        entry = audit_logger.entries[0]
        assert entry.details["error_type"] == "GenericError"
        assert entry.details["error_message"] == "Deployment failed: API timeout"
        assert entry.details["context"]["platform"] == "vercel"
    
    @pytest.mark.asyncio
    async def test_log_workflow_transition(self, audit_logger):
        """Test logging workflow transitions between agents"""
        state_data = {
            "retry_count": 1,
            "errors": ["Previous error"],
            "workflow_status": "running"
        }
        
        entry_id = await audit_logger.log_workflow_transition(
            from_agent="planner",
            to_agent="builder",
            reason="Plan completed successfully",
            state_data=state_data,
            duration_ms=50
        )
        
        assert entry_id is not None
        entry = audit_logger.entries[0]
        assert entry.agent == "orchestrator"
        assert entry.action == "workflow_transition"
        assert entry.details["from_agent"] == "planner"
        assert entry.details["to_agent"] == "builder"
        assert entry.details["state_summary"]["retry_count"] == 1
        assert entry.details["state_summary"]["errors_count"] == 1
    
    @pytest.mark.asyncio
    async def test_get_entries_by_agent(self, audit_logger):
        """Test filtering entries by agent"""
        await audit_logger.log_agent_decision("planner", "plan", {"data": "1"})
        await audit_logger.log_agent_decision("builder", "build", {"data": "2"})
        await audit_logger.log_agent_decision("planner", "revise", {"data": "3"})
        
        planner_entries = audit_logger.get_entries_by_agent("planner")
        assert len(planner_entries) == 2
        assert all(e.agent == "planner" for e in planner_entries)
        
        builder_entries = audit_logger.get_entries_by_agent("builder")
        assert len(builder_entries) == 1
        assert builder_entries[0].agent == "builder"
    
    @pytest.mark.asyncio
    async def test_get_entries_by_action(self, audit_logger):
        """Test filtering entries by action"""
        await audit_logger.log_agent_decision("planner", "plan", {"data": "1"})
        await audit_logger.log_agent_decision("builder", "plan", {"data": "2"})
        await audit_logger.log_agent_decision("deployer", "deploy", {"data": "3"})
        
        plan_entries = audit_logger.get_entries_by_action("plan")
        assert len(plan_entries) == 2
        assert all(e.action == "plan" for e in plan_entries)
    
    @pytest.mark.asyncio
    async def test_get_error_entries(self, audit_logger):
        """Test getting all error entries"""
        await audit_logger.log_agent_decision("planner", "plan", {"data": "1"})
        await audit_logger.log_error("builder", "Build failed", {"context": "test"})
        await audit_logger.log_error("deployer", "Deploy failed", {"context": "test"})
        
        error_entries = audit_logger.get_error_entries()
        assert len(error_entries) == 2
        assert all(e.action == "error" for e in error_entries)
    
    @pytest.mark.asyncio
    async def test_get_all_file_lineage(self, audit_logger):
        """Test getting all file lineage information"""
        await audit_logger.log_file_operation("builder", "create", "file1.tsx", "reason1")
        await audit_logger.log_file_operation("builder", "create", "file2.tsx", "reason2")
        
        all_lineage = audit_logger.get_all_file_lineage()
        assert len(all_lineage) == 2
        assert "file1.tsx" in all_lineage
        assert "file2.tsx" in all_lineage
    
    @pytest.mark.asyncio
    async def test_generate_audit_trail(self, audit_logger):
        """Test generating complete audit trail"""
        # Add various types of entries
        await audit_logger.log_agent_decision("planner", "plan", {"pages": 3})
        await audit_logger.log_file_operation("builder", "create", "App.tsx", "Main component")
        await audit_logger.log_error("builder", "Test error", {"context": "test"})
        
        audit_trail = await audit_logger.generate_audit_trail()
        
        assert audit_trail["session_id"] == "test_session"
        assert audit_trail["summary"]["total_entries"] == 3
        assert audit_trail["summary"]["error_count"] == 1
        assert audit_trail["summary"]["file_operations"] == 1
        assert len(audit_trail["entries"]) == 3
        assert "file_lineage" in audit_trail
        assert "performance_metrics" in audit_trail
    
    @pytest.mark.asyncio
    async def test_export_to_file(self, audit_logger, temp_log_dir):
        """Test exporting audit trail to JSON file"""
        await audit_logger.log_agent_decision("planner", "plan", {"pages": 2})
        
        file_path = await audit_logger.export_to_file()
        
        assert Path(file_path).exists()
        
        # Verify file contents
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        assert data["session_id"] == "test_session"
        assert data["summary"]["total_entries"] == 1
        assert len(data["entries"]) == 1
    
    @pytest.mark.asyncio
    async def test_async_logging_performance(self, audit_logger):
        """Test that async logging doesn't block execution"""
        import time
        
        start_time = time.time()
        
        # Log multiple entries quickly
        for i in range(10):
            await audit_logger.log_agent_decision(f"agent_{i}", "action", {"index": i})
        
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Convert to ms
        
        # Should complete quickly even with async writes
        assert execution_time < 1000  # Less than 1 second
        assert len(audit_logger.entries) == 10
        
        # Ensure all async writes complete
        await audit_logger.flush_pending_writes()


class TestAuditManager:
    """Test AuditManager class functionality"""
    
    @pytest.fixture
    def temp_log_dir(self):
        """Create temporary directory for test logs"""
        with tempfile.TemporaryDirectory() as temp_dir:
            yield temp_dir
    
    def test_get_logger_creates_new_session(self, temp_log_dir):
        """Test that getting logger creates new session if not exists"""
        manager = AuditManager(temp_log_dir)
        
        logger = manager.get_logger("new_session")
        
        assert logger.session_id == "new_session"
        assert len(logger.entries) == 0
    
    def test_get_logger_returns_existing_session(self, temp_log_dir):
        """Test that getting logger returns existing session"""
        manager = AuditManager(temp_log_dir)
        
        # Get logger and add entry
        logger1 = manager.get_logger("existing_session")
        asyncio.run(logger1.log_agent_decision("agent", "action", {"data": "test"}))
        
        # Get same session again
        logger2 = manager.get_logger("existing_session")
        
        assert logger1 is logger2
        assert len(logger2.entries) == 1
    
    @pytest.mark.asyncio
    async def test_finalize_session(self, temp_log_dir):
        """Test finalizing a session and exporting audit trail"""
        manager = AuditManager(temp_log_dir)
        
        logger = manager.get_logger("temp_session")
        await logger.log_agent_decision("agent", "action", {"data": "test"})
        
        file_path = await manager.finalize_session("temp_session")
        
        assert file_path is not None
        assert Path(file_path).exists()
        assert "temp_session" not in manager.get_active_sessions()
        
        # Try finalizing non-existent session
        result = await manager.finalize_session("non_existent")
        assert result is None
    
    def test_get_active_sessions(self, temp_log_dir):
        """Test getting list of active sessions"""
        manager = AuditManager(temp_log_dir)
        
        manager.get_logger("session1")
        manager.get_logger("session2")
        
        active = manager.get_active_sessions()
        assert len(active) == 2
        assert "session1" in active
        assert "session2" in active


class TestAuditLogEntry:
    """Test AuditLogEntry model validation"""
    
    def test_audit_log_entry_creation(self):
        """Test creating audit log entry with required fields"""
        entry = AuditLogEntry(
            timestamp="2024-01-01T12:00:00",
            session_id="test_session",
            agent="planner",
            action="plan",
            details={"pages": 3}
        )
        
        assert entry.timestamp == "2024-01-01T12:00:00"
        assert entry.session_id == "test_session"
        assert entry.agent == "planner"
        assert entry.action == "plan"
        assert entry.details == {"pages": 3}
        assert entry.duration_ms is None
    
    def test_audit_log_entry_with_duration(self):
        """Test creating audit log entry with duration"""
        entry = AuditLogEntry(
            timestamp="2024-01-01T12:00:00",
            session_id="test_session",
            agent="builder",
            action="build",
            details={"files": 2},
            duration_ms=1500
        )
        
        assert entry.duration_ms == 1500


class TestFileLineage:
    """Test FileLineage model validation"""
    
    def test_file_lineage_creation(self):
        """Test creating file lineage with required fields"""
        lineage = FileLineage(
            file_path="src/App.tsx",
            created_by="builder",
            created_at="2024-01-01T12:00:00",
            reason="Generate main component"
        )
        
        assert lineage.file_path == "src/App.tsx"
        assert lineage.created_by == "builder"
        assert lineage.created_at == "2024-01-01T12:00:00"
        assert lineage.reason == "Generate main component"
        assert lineage.modified_by == []
    
    def test_file_lineage_with_modifications(self):
        """Test file lineage with modification history"""
        lineage = FileLineage(
            file_path="src/App.tsx",
            created_by="builder",
            created_at="2024-01-01T12:00:00",
            modified_by=["builder", "tester"],
            reason="Generate and test component"
        )
        
        assert lineage.modified_by == ["builder", "tester"]


class TestAuditLogPropertyTests:
    """Property-based tests for audit logging system"""
    
    @pytest.mark.asyncio
    @given(
        agent_name=st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip() and x.isalnum()),
        file_path=st.builds(
            lambda dir_name, file_name: f"{dir_name}/{file_name}",
            dir_name=st.text(min_size=1, max_size=10, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip() and x.isalnum()),
            file_name=st.text(min_size=1, max_size=15, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip() and x.isalnum())
        ),
        operation=st.sampled_from(['create', 'modify', 'delete']),
        reason=st.text(min_size=1, max_size=50, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd', 'Zs'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip())
    )
    @settings(max_examples=50, deadline=None)
    async def test_property_audit_log_entry_creation(self, agent_name, file_path, operation, reason):
        """
        Feature: amar-mvp, Property 5: Audit log entry creation
        Validates: Requirements 8.2
        
        For any file created or modified by any agent, an audit log entry should be 
        created with timestamp, agent name, and file path.
        """
        temp_dir = tempfile.mkdtemp()
        try:
            # Create audit logger
            logger = AuditLogger("property_test_session", temp_dir)
            
            # Record initial entry count
            initial_count = len(logger.entries)
            
            # Perform file operation
            entry_id = await logger.log_file_operation(
                agent=agent_name,
                operation=operation,
                file_path=file_path,
                reason=reason
            )
            
            # Verify audit log entry was created
            assert len(logger.entries) == initial_count + 1, "Audit log entry should be created for file operation"
            
            # Get the created entry
            created_entry = logger.entries[-1]
            
            # Verify required fields are present and correct
            assert created_entry.agent == agent_name, f"Agent name should be {agent_name}"
            assert created_entry.action == f"file_{operation}", f"Action should be file_{operation}"
            assert created_entry.session_id == "property_test_session", "Session ID should match"
            
            # Verify timestamp is present and valid ISO format
            assert created_entry.timestamp is not None, "Timestamp should be present"
            try:
                datetime.fromisoformat(created_entry.timestamp)
            except ValueError:
                pytest.fail("Timestamp should be valid ISO format")
            
            # Verify file path is in details
            assert created_entry.details is not None, "Details should be present"
            assert created_entry.details.get('file_path') == file_path, f"File path should be {file_path}"
            assert created_entry.details.get('operation') == operation, f"Operation should be {operation}"
            assert created_entry.details.get('reason') == reason, f"Reason should be {reason}"
            
            # Verify entry ID was returned
            assert entry_id is not None, "Entry ID should be returned"
            assert isinstance(entry_id, str), "Entry ID should be a string"
            
            # For create operations, verify lineage tracking
            if operation == 'create':
                lineage = logger.get_file_lineage(file_path)
                assert lineage is not None, "Lineage should be created for file creation"
                assert lineage.created_by == agent_name, f"Created by should be {agent_name}"
                assert lineage.file_path == file_path, f"File path should be {file_path}"
                assert lineage.reason == reason, f"Reason should be {reason}"
            
            # For modify operations on existing files, verify lineage update
            elif operation == 'modify':
                # First create the file if it doesn't exist in lineage
                if file_path not in logger.file_lineage:
                    await logger.log_file_operation(agent_name, 'create', file_path, 'Initial creation')
                
                # Now perform the modify operation again to test lineage update
                await logger.log_file_operation(agent_name, 'modify', file_path, reason)
                
                lineage = logger.get_file_lineage(file_path)
                assert lineage is not None, "Lineage should exist for modified file"
                assert agent_name in lineage.modified_by, f"Agent {agent_name} should be in modified_by list"
            
            # Ensure all async writes complete before cleanup
            await logger.flush_pending_writes()
            
        finally:
            # Manual cleanup to avoid Windows file handle issues
            import shutil
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception:
                pass  # Ignore cleanup errors

    @pytest.mark.asyncio
    @given(
        operation_count=st.integers(min_value=1, max_value=20),
        agent_names=st.lists(
            st.text(min_size=1, max_size=15, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip() and x.isalnum()),
            min_size=1, max_size=5
        ),
        actions=st.lists(
            st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd', 'Pc'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip() and x.replace('_', '').isalnum()),
            min_size=1, max_size=5
        ),
        details_size=st.integers(min_value=1, max_value=1000)  # Size of details dict to simulate different logging loads
    )
    @settings(max_examples=30, deadline=None)
    async def test_property_asynchronous_logging_performance(self, operation_count, agent_names, actions, details_size):
        """
        Feature: amar-mvp, Property 15: Asynchronous logging performance
        Validates: Requirements 8.5
        
        For any logging operation that takes longer than 100ms, the operation should be 
        performed asynchronously without blocking agent execution.
        """
        import time
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Create audit logger
            logger = AuditLogger("async_perf_test_session", temp_dir)
            
            # Create large details to simulate potentially slow logging operations
            large_details = {f"key_{i}": f"value_{i}" * details_size for i in range(min(details_size, 100))}
            
            # Measure time for multiple logging operations
            start_time = time.perf_counter()
            
            # Perform multiple logging operations that could potentially be slow
            tasks = []
            for i in range(operation_count):
                agent = agent_names[i % len(agent_names)]
                action = actions[i % len(actions)]
                
                # Add some variation to the details to simulate real-world scenarios
                operation_details = {
                    **large_details,
                    "operation_index": i,
                    "timestamp": time.time(),
                    "large_data": "x" * min(details_size * 10, 10000)  # Simulate large log data
                }
                
                # Create logging task
                task = logger.log_agent_decision(
                    agent=agent,
                    action=action,
                    details=operation_details,
                    duration_ms=100 + i  # Simulate operations that take time
                )
                tasks.append(task)
            
            # Wait for all logging operations to complete
            await asyncio.gather(*tasks)
            
            end_time = time.perf_counter()
            total_execution_time_ms = (end_time - start_time) * 1000
            
            # Property: Logging operations should not block execution significantly
            # Even with potentially large data, the async nature should keep execution time reasonable
            
            # Calculate expected maximum time if operations were synchronous
            # Each operation should take much less time due to async processing
            max_reasonable_time_ms = operation_count * 50  # 50ms per operation is reasonable for async
            
            assert total_execution_time_ms < max_reasonable_time_ms, (
                f"Async logging took {total_execution_time_ms:.2f}ms for {operation_count} operations, "
                f"which exceeds reasonable async performance of {max_reasonable_time_ms}ms. "
                f"This suggests logging is blocking execution instead of being truly asynchronous."
            )
            
            # Verify all entries were logged correctly
            assert len(logger.entries) == operation_count, (
                f"Expected {operation_count} log entries, but got {len(logger.entries)}"
            )
            
            # Verify that async writes are actually happening
            # There should be pending writes or they should complete quickly
            pending_count_before_flush = len(logger.pending_writes)
            
            # Flush all pending writes and measure time
            flush_start = time.perf_counter()
            await logger.flush_pending_writes()
            flush_end = time.perf_counter()
            flush_time_ms = (flush_end - flush_start) * 1000
            
            # Property: Async writes should either be already completed or complete quickly during flush
            # This verifies that the async mechanism is working properly
            assert flush_time_ms < 5000, (  # 5 seconds is generous for flushing
                f"Flushing pending writes took {flush_time_ms:.2f}ms, which is too long. "
                f"This suggests async logging is not working efficiently."
            )
            
            # Additional verification: Check that logging didn't block by testing responsiveness
            # Perform a quick operation after logging to ensure system is responsive
            quick_start = time.perf_counter()
            await logger.log_agent_decision("test_agent", "quick_test", {"test": "responsiveness"})
            quick_end = time.perf_counter()
            quick_time_ms = (quick_end - quick_start) * 1000
            
            assert quick_time_ms < 100, (
                f"Quick logging operation took {quick_time_ms:.2f}ms after bulk operations, "
                f"suggesting the system is still blocked by previous async operations."
            )
            
            # Verify the audit trail can be generated efficiently even with many entries
            trail_start = time.perf_counter()
            audit_trail = await logger.generate_audit_trail()
            trail_end = time.perf_counter()
            trail_time_ms = (trail_end - trail_start) * 1000
            
            assert trail_time_ms < 1000, (  # 1 second for audit trail generation
                f"Audit trail generation took {trail_time_ms:.2f}ms, which is too slow."
            )
            
            # Verify audit trail contains all expected entries
            assert audit_trail["summary"]["total_entries"] == operation_count + 1, (  # +1 for the quick test
                f"Audit trail should contain {operation_count + 1} entries"
            )
            
        finally:
            # Ensure cleanup
            if 'logger' in locals():
                await logger.flush_pending_writes()
            
            # Manual cleanup to avoid Windows file handle issues
            import shutil
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception:
                pass  # Ignore cleanup errors