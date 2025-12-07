"""
Tests for LangGraph workflow orchestrator
Validates workflow state management and agent routing
"""

import pytest
from datetime import datetime
from uuid import uuid4

from backend.models.workflow import (
    WorkflowState,
    create_initial_workflow_state,
    update_workflow_state,
    add_error_to_state,
    increment_retry_count,
    finalize_workflow_state,
    validate_workflow_state,
    get_workflow_summary,
    is_terminal_state,
    has_errors,
    can_retry,
    preserve_context_across_transition
)
from backend.workflow.orchestrator import WorkflowOrchestrator, get_orchestrator


class TestWorkflowStateManagement:
    """Test workflow state creation and management"""
    
    def test_create_initial_workflow_state(self):
        """Test initial state creation with proper defaults"""
        user_input = "Build a simple landing page"
        session_id = str(uuid4())
        
        state = create_initial_workflow_state(user_input, session_id)
        
        # Verify all required fields are present
        assert state['user_input'] == user_input
        assert state['session_id'] == session_id
        assert state['plan'] is None
        assert state['generated_files'] is None
        assert state['test_results'] is None
        assert state['deployment_url'] is None
        assert state['errors'] == []
        assert state['retry_count'] == 0
        assert state['current_agent'] == 'supervisor'
        assert state['workflow_status'] == 'running'
        assert state['started_at'] is not None
        assert state['last_updated'] is not None
        assert state['execution_time_ms'] is None
        assert state['agent_context'] == {}
        
        # Verify state is valid
        assert validate_workflow_state(state) is True
    
    def test_update_workflow_state_preserves_context(self):
        """Test that state updates preserve existing context"""
        # Create initial state
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # Add some initial context
        state['plan'] = {'pages': [{'name': 'Home'}]}
        state['agent_context'] = {'key1': 'value1'}
        
        # Update state with new data
        updated_state = update_workflow_state(
            state,
            'planner',
            {
                'current_agent': 'planner',
                'agent_context': {'key2': 'value2'}
            }
        )
        
        # Verify context is preserved
        assert updated_state['plan'] == {'pages': [{'name': 'Home'}]}
        assert updated_state['agent_context']['key1'] == 'value1'
        assert updated_state['agent_context']['key2'] == 'value2'
        assert updated_state['current_agent'] == 'planner'
    
    def test_add_error_to_state(self):
        """Test error addition to state"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        error_msg = "Test error message"
        updated_state = add_error_to_state(state, error_msg, 'planner')
        
        assert len(updated_state['errors']) == 1
        assert error_msg in str(updated_state['errors'][0])
        assert 'planner' in str(updated_state['errors'][0])
    
    def test_increment_retry_count(self):
        """Test retry count increment"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        assert state['retry_count'] == 0
        
        updated_state = increment_retry_count(state)
        assert updated_state['retry_count'] == 1
        
        updated_state = increment_retry_count(updated_state)
        assert updated_state['retry_count'] == 2
    
    def test_finalize_workflow_state(self):
        """Test workflow state finalization"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        execution_time = 5000
        final_state = finalize_workflow_state(state, 'completed', execution_time)
        
        assert final_state['workflow_status'] == 'completed'
        assert final_state['execution_time_ms'] == execution_time
    
    def test_is_terminal_state(self):
        """Test terminal state detection"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # Running state is not terminal
        assert is_terminal_state(state) is False
        
        # Completed state is terminal
        completed_state = finalize_workflow_state(state, 'completed', 1000)
        assert is_terminal_state(completed_state) is True
        
        # Failed state is terminal
        failed_state = finalize_workflow_state(state, 'failed', 1000)
        assert is_terminal_state(failed_state) is True
    
    def test_has_errors(self):
        """Test error detection"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # No errors initially
        assert has_errors(state) is False
        
        # Add error
        state_with_error = add_error_to_state(state, "Test error", 'planner')
        assert has_errors(state_with_error) is True
    
    def test_can_retry(self):
        """Test retry capability check"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # Can retry initially
        assert can_retry(state) is True
        
        # Can retry after 1 attempt
        state = increment_retry_count(state)
        assert can_retry(state) is True
        
        # Can retry after 2 attempts
        state = increment_retry_count(state)
        assert can_retry(state) is True
        
        # Cannot retry after 3 attempts
        state = increment_retry_count(state)
        assert can_retry(state) is False
    
    def test_preserve_context_across_transition(self):
        """Test context preservation during state transitions"""
        # Create initial state with data
        from_state = create_initial_workflow_state("Test input", str(uuid4()))
        from_state['plan'] = {'pages': [{'name': 'Home'}]}
        from_state['agent_context'] = {'key1': 'value1'}
        from_state['errors'] = ['error1']
        
        # Create new state that might have lost some context
        to_state = from_state.copy()
        to_state['plan'] = None  # Simulate context loss
        to_state['errors'] = []  # Simulate error loss
        
        # Preserve context
        preserved_state = preserve_context_across_transition(from_state, to_state)
        
        # Verify context was restored
        assert preserved_state['plan'] == {'pages': [{'name': 'Home'}]}
        assert preserved_state['agent_context'] == {'key1': 'value1'}
        assert len(preserved_state['errors']) == 1
    
    def test_get_workflow_summary(self):
        """Test workflow summary generation"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['plan'] = {'pages': []}
        state['generated_files'] = {'file1.txt': 'content'}
        
        summary = get_workflow_summary(state)
        
        assert summary['session_id'] == state['session_id']
        assert summary['current_agent'] == 'supervisor'
        assert summary['workflow_status'] == 'running'
        assert summary['retry_count'] == 0
        assert summary['has_plan'] is True
        assert summary['has_generated_files'] is True
        assert summary['has_test_results'] is False
        assert summary['has_deployment_url'] is False
        assert summary['error_count'] == 0


class TestWorkflowOrchestrator:
    """Test workflow orchestrator functionality"""
    
    def test_orchestrator_initialization(self):
        """Test orchestrator can be initialized"""
        orchestrator = WorkflowOrchestrator()
        
        assert orchestrator.planner is not None
        assert orchestrator.builder is not None
        assert orchestrator.deployer is not None
        assert orchestrator.workflow is not None
        assert orchestrator.app is not None
    
    def test_get_orchestrator_singleton(self):
        """Test global orchestrator instance"""
        orchestrator1 = get_orchestrator()
        orchestrator2 = get_orchestrator()
        
        # Should return same instance
        assert orchestrator1 is orchestrator2
    
    def test_workflow_graph_structure(self):
        """Test workflow graph has all required nodes"""
        orchestrator = WorkflowOrchestrator()
        
        # Verify workflow was built
        assert orchestrator.workflow is not None
        assert orchestrator.app is not None
    
    def test_routing_after_planner_success(self):
        """Test routing logic after successful planner"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with successful plan
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['plan'] = {'pages': [{'name': 'Home'}]}
        
        route = orchestrator._route_after_planner(state)
        assert route == "builder"
    
    def test_routing_after_planner_failure(self):
        """Test routing logic after planner failure"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with error
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state = add_error_to_state(state, "Planner error", 'planner')
        
        route = orchestrator._route_after_planner(state)
        assert route == "fail"
    
    def test_routing_after_tester_success(self):
        """Test routing logic after successful tests"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with passing tests
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['test_results'] = {'passed': 5, 'failed': 0}
        
        route = orchestrator._route_after_tester(state)
        assert route == "deployer"
    
    def test_routing_after_tester_failure_can_retry(self):
        """Test routing logic after test failure with retries available"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with failing tests and retries available
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['test_results'] = {'passed': 0, 'failed': 2}
        state['retry_count'] = 1
        
        route = orchestrator._route_after_tester(state)
        assert route == "self_heal"
    
    def test_routing_after_tester_failure_max_retries(self):
        """Test routing logic after test failure with max retries reached"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with failing tests and max retries
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['test_results'] = {'passed': 0, 'failed': 2}
        state['retry_count'] = 3
        
        route = orchestrator._route_after_tester(state)
        assert route == "fail"
    
    def test_routing_after_self_heal_can_retry(self):
        """Test routing logic after self-heal with retries available"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with retries available
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['retry_count'] = 2
        
        route = orchestrator._route_after_self_heal(state)
        assert route == "builder"
    
    def test_routing_after_self_heal_max_retries(self):
        """Test routing logic after self-heal with max retries"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with max retries
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['retry_count'] = 3
        
        route = orchestrator._route_after_self_heal(state)
        assert route == "fail"
    
    def test_routing_after_deployer_success(self):
        """Test routing logic after successful deployment"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state with deployment URL
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['deployment_url'] = 'https://example.vercel.app'
        
        route = orchestrator._route_after_deployer(state)
        assert route == "finalize"
    
    def test_routing_after_deployer_failure(self):
        """Test routing logic after deployment failure"""
        orchestrator = WorkflowOrchestrator()
        
        # Create state without deployment URL
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        route = orchestrator._route_after_deployer(state)
        assert route == "fail"


class TestWorkflowStatePreservationProperty:
    """
    Property-based tests for workflow state preservation
    Feature: amar-mvp, Property 8: State preservation across agents
    Validates: Requirements 14.5
    """
    
    def test_state_preservation_across_agent_transitions(self):
        """
        Property Test: For any agent transition in the LangGraph workflow,
        all previous agent outputs and context should be preserved in the workflow state.
        
        Feature: amar-mvp, Property 8: State preservation across agents
        Validates: Requirements 14.5
        """
        from hypothesis import given, strategies as st
        from hypothesis import settings
        
        # Define strategies for generating test data
        agent_names = st.sampled_from(['supervisor', 'planner', 'builder', 'tester', 'deployer', 'self_heal'])
        
        # Strategy for generating plan data
        plan_strategy = st.fixed_dictionaries({
            'pages': st.lists(
                st.fixed_dictionaries({
                    'name': st.text(min_size=1, max_size=20),
                    'route': st.text(min_size=1, max_size=20)
                }),
                min_size=1,
                max_size=5
            )
        })
        
        # Strategy for generating file data
        files_strategy = st.dictionaries(
            keys=st.text(min_size=1, max_size=50),
            values=st.text(min_size=0, max_size=100),
            min_size=1,
            max_size=10
        )
        
        # Strategy for generating test results
        test_results_strategy = st.fixed_dictionaries({
            'passed': st.integers(min_value=0, max_value=10),
            'failed': st.integers(min_value=0, max_value=10),
            'errors': st.lists(st.text(min_size=0, max_size=50), max_size=5)
        })
        
        # Strategy for generating agent context
        agent_context_strategy = st.dictionaries(
            keys=st.text(min_size=1, max_size=20),
            values=st.one_of(
                st.text(max_size=50),
                st.integers(),
                st.booleans(),
                st.none()
            ),
            min_size=0,
            max_size=5
        )
        
        @given(
            agent1=agent_names,
            agent2=agent_names,
            plan=st.one_of(plan_strategy, st.none()),
            files=st.one_of(files_strategy, st.none()),
            test_results=st.one_of(test_results_strategy, st.none()),
            deployment_url=st.one_of(st.text(min_size=10, max_size=100), st.none()),
            agent_context=agent_context_strategy,
            errors=st.lists(st.text(min_size=1, max_size=100), max_size=5)
        )
        @settings(max_examples=100, deadline=None)
        def property_test(agent1, agent2, plan, files, test_results, deployment_url, agent_context, errors):
            """
            Property: State preservation across agent transitions
            
            For any workflow state with data from previous agents, when we transition
            to a new agent, all previous agent outputs and context must be preserved.
            """
            # Create initial state
            initial_state = create_initial_workflow_state("Test input", str(uuid4()))
            
            # Populate state with data from "previous agents"
            if plan is not None:
                initial_state['plan'] = plan
            if files is not None:
                initial_state['generated_files'] = files
            if test_results is not None:
                initial_state['test_results'] = test_results
            if deployment_url is not None:
                initial_state['deployment_url'] = deployment_url
            if agent_context:
                initial_state['agent_context'] = agent_context
            if errors:
                initial_state['errors'] = errors
            
            # Store original values for comparison
            original_plan = initial_state.get('plan')
            original_files = initial_state.get('generated_files')
            original_test_results = initial_state.get('test_results')
            original_deployment_url = initial_state.get('deployment_url')
            original_agent_context = initial_state.get('agent_context', {}).copy()
            original_errors = initial_state.get('errors', []).copy()
            original_user_input = initial_state['user_input']
            original_session_id = initial_state['session_id']
            
            # Simulate agent transition: agent1 -> agent2
            # First transition to agent1
            state_after_agent1 = update_workflow_state(
                initial_state,
                agent1,
                {'current_agent': agent1}
            )
            
            # Then transition to agent2 with some new data
            state_after_agent2 = update_workflow_state(
                state_after_agent1,
                agent2,
                {
                    'current_agent': agent2,
                    'agent_context': {'new_key': 'new_value'}
                }
            )
            
            # PROPERTY: All previous context must be preserved
            
            # 1. Core immutable fields must be preserved
            assert state_after_agent2['user_input'] == original_user_input, \
                "user_input must be preserved across agent transitions"
            assert state_after_agent2['session_id'] == original_session_id, \
                "session_id must be preserved across agent transitions"
            
            # 2. Agent outputs must be preserved
            if original_plan is not None:
                assert state_after_agent2.get('plan') == original_plan, \
                    "plan must be preserved across agent transitions"
            
            if original_files is not None:
                assert state_after_agent2.get('generated_files') == original_files, \
                    "generated_files must be preserved across agent transitions"
            
            if original_test_results is not None:
                assert state_after_agent2.get('test_results') == original_test_results, \
                    "test_results must be preserved across agent transitions"
            
            if original_deployment_url is not None:
                assert state_after_agent2.get('deployment_url') == original_deployment_url, \
                    "deployment_url must be preserved across agent transitions"
            
            # 3. Agent context must be merged, not replaced
            final_agent_context = state_after_agent2.get('agent_context', {})
            for key, value in original_agent_context.items():
                assert key in final_agent_context, \
                    f"agent_context key '{key}' must be preserved across agent transitions"
                assert final_agent_context[key] == value, \
                    f"agent_context value for '{key}' must be preserved across agent transitions"
            
            # New context should also be present
            assert 'new_key' in final_agent_context, \
                "new agent_context should be added during transition"
            
            # 4. Errors must be accumulated, not lost
            final_errors = state_after_agent2.get('errors', [])
            assert len(final_errors) >= len(original_errors), \
                "errors must be accumulated, not lost during agent transitions"
            
            # 5. Current agent should be updated
            assert state_after_agent2['current_agent'] == agent2, \
                "current_agent should be updated to the new agent"
        
        # Run the property test
        property_test()


class TestWorkflowValidation:
    """Test workflow state validation"""
    
    def test_validate_valid_state(self):
        """Test validation of valid state"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # Should not raise exception
        assert validate_workflow_state(state) is True
    
    def test_validate_missing_required_field(self):
        """Test validation fails for missing required field"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        
        # Remove required field
        del state['user_input']
        
        # Should raise ValueError
        with pytest.raises(ValueError, match="Missing required field"):
            validate_workflow_state(state)
    
    def test_validate_invalid_user_input(self):
        """Test validation fails for empty user input"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['user_input'] = ""
        
        # Should raise ValueError
        with pytest.raises(ValueError, match="user_input must be a non-empty string"):
            validate_workflow_state(state)
    
    def test_validate_invalid_retry_count(self):
        """Test validation fails for negative retry count"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['retry_count'] = -1
        
        # Should raise ValueError
        with pytest.raises(ValueError, match="retry_count must be a non-negative integer"):
            validate_workflow_state(state)
    
    def test_validate_invalid_workflow_status(self):
        """Test validation fails for invalid workflow status"""
        state = create_initial_workflow_state("Test input", str(uuid4()))
        state['workflow_status'] = 'invalid_status'
        
        # Should raise ValueError
        with pytest.raises(ValueError, match="workflow_status must be"):
            validate_workflow_state(state)
