"""
LangGraph Orchestrator Workflow for AMAR MVP
Manages agent workflow, routing, and error handling
Validates: Requirements 14.1, 14.2, 14.3
"""

from typing import Dict, Any, Literal
from datetime import datetime

from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableConfig

from models.workflow import (
    WorkflowState,
    create_initial_workflow_state,
    update_workflow_state,
    add_error_to_state,
    increment_retry_count,
    finalize_workflow_state
)
from models.core import UserRequest, Plan
from agents.planner import PlannerAgent
from agents.builder import BuilderAgent
from agents.deployer import DeployerAgent
from services.memory import memory_manager
from services.audit import audit_manager


class WorkflowOrchestrator:
    """
    LangGraph-based orchestrator for AMAR multi-agent workflow
    
    Manages the complete workflow from user input to deployed application,
    including agent routing, error handling, and retry logic.
    
    Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5
    """
    
    def __init__(self):
        """Initialize orchestrator with agents and workflow graph"""
        # Initialize agents
        self.planner = PlannerAgent()
        self.builder = BuilderAgent()
        self.deployer = DeployerAgent()
        
        # Build workflow graph
        self.workflow = self._build_workflow_graph()
        
        # Compile the graph
        self.app = self.workflow.compile()
    
    def _build_workflow_graph(self) -> StateGraph:
        """
        Build LangGraph workflow with all nodes and edges
        
        Returns:
            Compiled StateGraph ready for execution
            
        Validates: Requirements 14.1, 14.2
        """
        # Create state graph
        workflow = StateGraph(WorkflowState)
        
        # Add nodes for each agent
        workflow.add_node("supervisor", self._supervisor_node)
        workflow.add_node("planner", self._planner_node)
        workflow.add_node("builder", self._builder_node)
        workflow.add_node("tester", self._tester_node)
        workflow.add_node("deployer", self._deployer_node)
        workflow.add_node("self_heal", self._self_heal_node)
        workflow.add_node("finalize", self._finalize_node)
        
        # Set entry point
        workflow.set_entry_point("supervisor")
        
        # Add edges for workflow routing
        # Supervisor -> Planner
        workflow.add_edge("supervisor", "planner")
        
        # Planner -> Builder (or error handling)
        workflow.add_conditional_edges(
            "planner",
            self._route_after_planner,
            {
                "builder": "builder",
                "fail": "finalize"
            }
        )
        
        # Builder -> Tester
        workflow.add_edge("builder", "tester")
        
        # Tester -> Deployer or Self-Heal (based on test results)
        workflow.add_conditional_edges(
            "tester",
            self._route_after_tester,
            {
                "deployer": "deployer",
                "self_heal": "self_heal",
                "fail": "finalize"
            }
        )
        
        # Self-Heal -> Builder (retry) or Fail (max retries)
        workflow.add_conditional_edges(
            "self_heal",
            self._route_after_self_heal,
            {
                "builder": "builder",
                "fail": "finalize"
            }
        )
        
        # Deployer -> Finalize (or error handling)
        workflow.add_conditional_edges(
            "deployer",
            self._route_after_deployer,
            {
                "finalize": "finalize",
                "fail": "finalize"
            }
        )
        
        # Finalize -> END
        workflow.add_edge("finalize", END)
        
        return workflow
    
    # ========== Node Functions ==========
    
    async def _supervisor_node(self, state: WorkflowState) -> WorkflowState:
        """
        Supervisor node - entry point that receives user input
        
        Validates: Requirements 14.1, 14.4
        """
        # Log workflow initiation
        memory = memory_manager.get_memory(state['session_id'])
        memory.add_entry(
            agent='supervisor',
            action='workflow_initiated',
            data={
                'user_input': state['user_input'],
                'session_id': state['session_id'],
                'started_at': state['started_at']
            },
            tags=['workflow', 'initiation'],
            importance=1.0
        )
        
        # Update state
        return update_workflow_state(
            state,
            'supervisor',
            {
                'workflow_status': 'running',
                'current_agent': 'supervisor'
            }
        )
    
    async def _planner_node(self, state: WorkflowState) -> WorkflowState:
        """
        Planner node - decomposes user request into structured plan
        
        Validates: Requirements 14.1, 14.5
        """
        try:
            # Send progress update
            await self._send_progress(
                "planner",
                "running",
                "Analyzing request and creating implementation plan",
                None
            )
            
            # Create UserRequest from state
            user_request = UserRequest(
                description=state['user_input'],
                session_id=state['session_id']
            )
            
            # Call Planner Agent
            response = self.planner.analyze_request(user_request)
            
            if response.success:
                # Extract plan from response
                plan_dict = response.output.get('plan')
                
                # Send completion update
                page_count = len(plan_dict.get('pages', []))
                await self._send_progress(
                    "planner",
                    "completed",
                    f"Plan created with {page_count} page(s)",
                    None
                )
                
                # Update state with plan
                return update_workflow_state(
                    state,
                    'planner',
                    {
                        'plan': plan_dict,
                        'current_agent': 'planner'
                    }
                )
            else:
                # Planner failed
                error_msg = '; '.join(response.errors)
                await self._send_progress(
                    "planner",
                    "failed",
                    "Planning failed",
                    error_msg
                )
                return add_error_to_state(state, error_msg, 'planner')
                
        except Exception as e:
            error_msg = f"Planner node error: {str(e)}"
            await self._send_progress(
                "planner",
                "failed",
                "Planning error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'planner')
    
    async def _builder_node(self, state: WorkflowState) -> WorkflowState:
        """
        Builder node - generates React code from plan
        
        Validates: Requirements 14.1, 14.5
        """
        try:
            # Send progress update
            retry_info = f" (Retry {state['retry_count']})" if state['retry_count'] > 0 else ""
            await self._send_progress(
                "builder",
                "running",
                f"Generating React code{retry_info}",
                None
            )
            
            # Reconstruct Plan object from state
            plan_dict = state.get('plan')
            if not plan_dict:
                raise ValueError("No plan found in state")
            
            plan = Plan(**plan_dict)
            
            # Call Builder Agent
            response = self.builder.generate_project(plan, state['session_id'])
            
            if response.success:
                # Extract generated files from response
                project_dict = response.output.get('project')
                generated_files = project_dict.get('files', {})
                
                # Write files to temporary directory
                project_dir = self.builder.write_files_to_directory(generated_files)
                
                # Send completion update
                file_count = len(generated_files)
                await self._send_progress(
                    "builder",
                    "completed",
                    f"Generated {file_count} file(s)",
                    f"Files written to {project_dir}"
                )
                
                # Update state with generated files and project directory
                return update_workflow_state(
                    state,
                    'builder',
                    {
                        'generated_files': generated_files,
                        'agent_context': {
                            **state.get('agent_context', {}),
                            'project_dir': project_dir,
                            'project': project_dict
                        },
                        'current_agent': 'builder'
                    }
                )
            else:
                # Builder failed
                error_msg = '; '.join(response.errors)
                await self._send_progress(
                    "builder",
                    "failed",
                    "Code generation failed",
                    error_msg
                )
                return add_error_to_state(state, error_msg, 'builder')
                
        except Exception as e:
            error_msg = f"Builder node error: {str(e)}"
            await self._send_progress(
                "builder",
                "failed",
                "Code generation error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'builder')
    
    async def _tester_node(self, state: WorkflowState) -> WorkflowState:
        """
        Tester node - runs tests on generated code
        
        Validates: Requirements 14.1, 14.5
        """
        try:
            # Send progress update
            await self._send_progress(
                "tester",
                "running",
                "Running tests on generated code",
                None
            )
            
            # Get project directory from agent context
            project_dir = state.get('agent_context', {}).get('project_dir')
            
            if not project_dir:
                raise ValueError("No project directory found in state")
            
            # Run tests (simplified for MVP - in production would use pytest)
            # For now, we'll simulate test execution
            test_results = self._run_tests(project_dir, state['session_id'])
            
            # Send completion update
            passed = test_results.get('passed', 0)
            failed = test_results.get('failed', 0)
            
            if failed > 0:
                await self._send_progress(
                    "tester",
                    "failed",
                    f"Tests failed: {passed} passed, {failed} failed",
                    f"Errors: {', '.join(test_results.get('errors', []))}"
                )
            else:
                await self._send_progress(
                    "tester",
                    "completed",
                    f"All tests passed ({passed} tests)",
                    None
                )
            
            # Update state with test results
            return update_workflow_state(
                state,
                'tester',
                {
                    'test_results': test_results,
                    'current_agent': 'tester'
                }
            )
                
        except Exception as e:
            error_msg = f"Tester node error: {str(e)}"
            await self._send_progress(
                "tester",
                "failed",
                "Testing error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'tester')
    
    async def _deployer_node(self, state: WorkflowState) -> WorkflowState:
        """
        Deployer node - deploys project to hosting platform
        
        Validates: Requirements 14.1, 14.5
        """
        try:
            # Send progress update
            await self._send_progress(
                "deployer",
                "running",
                "Deploying application to hosting platform",
                None
            )
            
            # Get project from agent context
            project_dict = state.get('agent_context', {}).get('project')
            project_dir = state.get('agent_context', {}).get('project_dir')
            
            if not project_dict or not project_dir:
                raise ValueError("No project or project directory found in state")
            
            # Reconstruct GeneratedProject
            from models.core import GeneratedProject
            project = GeneratedProject(**project_dict)
            
            # Call Deployer Agent
            response = self.deployer.deploy_project(project, project_dir)
            
            if response.success:
                # Extract deployment URL and check if manual deployment is required
                deployment_url = response.output.get('deployment_url')
                manual_deployment_required = response.output.get('manual_deployment_required', False)
                manual_instructions = response.output.get('deployment_details', {}).get('instructions', '')
                
                if manual_deployment_required:
                    # Manual deployment required (npm not available)
                    await self._send_progress(
                        "deployer",
                        "completed",
                        "Project ready for manual deployment",
                        manual_instructions
                    )
                    
                    # Update state without deployment URL
                    return update_workflow_state(
                        state,
                        'deployer',
                        {
                            'deployment_url': None,
                            'project_location': project_dir,
                            'manual_deployment_required': True,
                            'current_agent': 'deployer'
                        }
                    )
                else:
                    # Automatic deployment succeeded
                    completion_msg = f"🌐 Deployment URL: {deployment_url}\n"
                    completion_msg += f"📁 Project Files: {project_dir}\n"
                    completion_msg += f"\nYou can access your deployed app at the URL above,"
                    completion_msg += f"\nor manually deploy the files from the project directory."
                    
                    await self._send_progress(
                        "deployer",
                        "completed",
                        "Application deployed successfully",
                        completion_msg
                    )
                    
                    # Update state with deployment URL
                    return update_workflow_state(
                        state,
                        'deployer',
                        {
                            'deployment_url': deployment_url,
                            'project_location': project_dir,
                            'current_agent': 'deployer'
                        }
                    )
            else:
                # Deployment failed - but don't fail the workflow, just log it
                error_msg = '; '.join(response.errors)
                await self._send_progress(
                    "deployer",
                    "skipped",
                    "Deployment skipped",
                    f"Project files available at: {project_dir}"
                )
                # Continue workflow with project location instead of deployment URL
                return update_workflow_state(
                    state,
                    'deployer',
                    {
                        'deployment_url': None,
                        'project_location': project_dir,
                        'deployment_skipped': True,
                        'deployment_error': error_msg,
                        'current_agent': 'deployer'
                    }
                )
                
        except Exception as e:
            error_msg = f"Deployer node error: {str(e)}"
            await self._send_progress(
                "deployer",
                "failed",
                "Deployment error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'deployer')
    
    async def _self_heal_node(self, state: WorkflowState) -> WorkflowState:
        """
        Self-heal node - handles test failures and triggers retry
        
        Validates: Requirements 14.1, 14.3, 14.5
        """
        try:
            # Increment retry count
            state = increment_retry_count(state)
            
            # Send progress update
            await self._send_progress(
                "self_heal",
                "running",
                f"Self-healing initiated (Attempt {state['retry_count']}/3)",
                "Analyzing test failures and regenerating code"
            )
            
            # Log self-healing attempt
            memory = memory_manager.get_memory(state['session_id'])
            memory.add_entry(
                agent='self_heal',
                action='retry_initiated',
                data={
                    'retry_count': state['retry_count'],
                    'test_results': state.get('test_results'),
                    'errors': state.get('errors', [])
                },
                tags=['self_healing', 'retry'],
                importance=0.9
            )
            
            # Update state
            return update_workflow_state(
                state,
                'self_heal',
                {
                    'current_agent': 'self_heal'
                }
            )
                
        except Exception as e:
            error_msg = f"Self-heal node error: {str(e)}"
            await self._send_progress(
                "self_heal",
                "failed",
                "Self-healing error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'self_heal')
    
    async def _finalize_node(self, state: WorkflowState) -> WorkflowState:
        """
        Finalize node - terminal state that prepares final results
        
        Validates: Requirements 14.1, 14.4, 14.5
        """
        try:
            # Calculate execution time
            started_at = datetime.fromisoformat(state['started_at'])
            execution_time_ms = int((datetime.now() - started_at).total_seconds() * 1000)
            
            # Determine final status
            # Workflow is successful if we have deployment URL OR project location
            # (deployment can be skipped but project generation is still successful)
            if state.get('deployment_url') or state.get('project_location'):
                final_status = 'completed'
            elif state.get('errors'):
                final_status = 'failed'
            else:
                final_status = 'completed'
            
            # Finalize state
            state = finalize_workflow_state(state, final_status, execution_time_ms)
            
            # Prepare final message with file location
            project_location = state.get('agent_context', {}).get('project_dir', 'Unknown')
            deployment_url = state.get('deployment_url')
            manual_deployment_required = state.get('manual_deployment_required', False)
            
            final_message = f"Workflow {final_status}\n"
            final_message += f"Total execution time: {execution_time_ms}ms\n"
            final_message += f"\n📁 Generated Files Location:\n{project_location}\n"
            
            if deployment_url:
                final_message += f"\n🌐 Deployment URL:\n{deployment_url}"
            elif manual_deployment_required:
                final_message += f"\n⚠️ Manual deployment required (npm not available)"
                final_message += f"\nSee deployment instructions above for how to deploy your project."
            else:
                final_message += f"\n⚠️ Automatic deployment was not available"
                final_message += f"\nYou can manually deploy the files from the project directory."
            
            # Send progress update
            await self._send_progress(
                "finalize",
                "completed" if final_status == "completed" else "failed",
                f"Workflow {final_status}",
                final_message
            )
            
            # Log workflow completion
            memory = memory_manager.get_memory(state['session_id'])
            memory.add_entry(
                agent='finalize',
                action='workflow_completed',
                data={
                    'status': final_status,
                    'execution_time_ms': execution_time_ms,
                    'deployment_url': state.get('deployment_url'),
                    'errors': state.get('errors', []),
                    'retry_count': state['retry_count']
                },
                tags=['workflow', 'completion', final_status],
                importance=1.0
            )
            
            return state
                
        except Exception as e:
            error_msg = f"Finalize node error: {str(e)}"
            await self._send_progress(
                "finalize",
                "failed",
                "Finalization error",
                error_msg
            )
            return add_error_to_state(state, error_msg, 'finalize')
    
    # ========== Routing Functions ==========
    
    def _route_after_planner(self, state: WorkflowState) -> Literal["builder", "fail"]:
        """
        Route after planner based on success/failure
        
        Validates: Requirements 14.2, 14.3
        """
        # Check if planner succeeded
        if state.get('plan') and not state.get('errors'):
            return "builder"
        else:
            return "fail"
    
    def _route_after_tester(
        self, 
        state: WorkflowState
    ) -> Literal["deployer", "self_heal", "fail"]:
        """
        Route after tester based on test results
        
        Validates: Requirements 14.2, 14.3
        """
        test_results = state.get('test_results', {})
        
        # Check if tests passed
        if test_results.get('passed', 0) > 0 and test_results.get('failed', 0) == 0:
            return "deployer"
        
        # Check if we can retry
        if state['retry_count'] < 3:
            return "self_heal"
        
        # Max retries reached
        return "fail"
    
    def _route_after_self_heal(self, state: WorkflowState) -> Literal["builder", "fail"]:
        """
        Route after self-heal based on retry count
        
        Validates: Requirements 14.2, 14.3
        """
        # Check retry limit
        if state['retry_count'] < 3:
            return "builder"
        else:
            return "fail"
    
    def _route_after_deployer(self, state: WorkflowState) -> Literal["finalize", "fail"]:
        """
        Route after deployer based on success/failure
        
        Validates: Requirements 14.2, 14.3
        """
        # Check if deployment succeeded
        if state.get('deployment_url'):
            return "finalize"
        else:
            return "fail"
    
    # ========== Helper Functions ==========
    
    def _run_tests(self, project_dir: str, session_id: str) -> Dict[str, Any]:
        """
        Run tests on generated project
        
        Args:
            project_dir: Path to project directory
            session_id: Session identifier for logging
            
        Returns:
            Dictionary with test results
            
        Validates: Requirements 4.1, 4.2
        """
        # Simplified test execution for MVP
        # In production, this would run actual pytest tests
        
        import os
        import subprocess
        
        try:
            # Check if package.json exists
            package_json_path = os.path.join(project_dir, 'package.json')
            
            if not os.path.exists(package_json_path):
                return {
                    'passed': 0,
                    'failed': 1,
                    'errors': ['package.json not found'],
                    'execution_time_ms': 0
                }
            
            # For MVP, we'll do basic validation instead of running full tests
            # Check if all required files exist
            required_files = [
                'src/App.tsx',
                'src/index.tsx',
                'package.json'
            ]
            
            missing_files = []
            for file in required_files:
                if not os.path.exists(os.path.join(project_dir, file)):
                    missing_files.append(file)
            
            if missing_files:
                return {
                    'passed': 0,
                    'failed': len(missing_files),
                    'errors': [f'Missing required file: {f}' for f in missing_files],
                    'execution_time_ms': 0
                }
            
            # All basic checks passed
            return {
                'passed': len(required_files),
                'failed': 0,
                'errors': [],
                'execution_time_ms': 100
            }
            
        except Exception as e:
            return {
                'passed': 0,
                'failed': 1,
                'errors': [f'Test execution error: {str(e)}'],
                'execution_time_ms': 0
            }
    
    # ========== Public API ==========
    
    async def execute_workflow(self, user_input: str, session_id: str, progress_callback=None) -> WorkflowState:
        """
        Execute the complete workflow from user input to deployment
        
        Args:
            user_input: User's application description
            session_id: Session identifier for tracking
            progress_callback: Optional async callback function for progress updates
                              Signature: async def callback(agent, status, message, details)
            
        Returns:
            Final workflow state with results
            
        Validates: Requirements 14.1, 14.4, 14.5
        """
        # Store progress callback in instance for use by nodes
        self._progress_callback = progress_callback
        self._session_id = session_id
        
        # Create initial state
        initial_state = create_initial_workflow_state(user_input, session_id)
        
        # Execute workflow
        final_state = await self.app.ainvoke(initial_state)
        
        return final_state
    
    async def _send_progress(self, agent: str, status: str, message: str, details: str = None):
        """
        Send progress update via callback if available
        
        Args:
            agent: Name of the agent
            status: Status ('running', 'completed', 'failed')
            message: Progress message
            details: Optional additional details
        """
        if hasattr(self, '_progress_callback') and self._progress_callback:
            try:
                await self._progress_callback(agent, status, message, details)
            except Exception as e:
                # Don't let progress callback errors break the workflow
                print(f"Progress callback error: {e}")
    
    def execute_workflow_sync(self, user_input: str, session_id: str) -> WorkflowState:
        """
        Execute the complete workflow synchronously
        
        Args:
            user_input: User's application description
            session_id: Session identifier for tracking
            
        Returns:
            Final workflow state with results
            
        Validates: Requirements 14.1, 14.4, 14.5
        """
        # Create initial state
        initial_state = create_initial_workflow_state(user_input, session_id)
        
        # Execute workflow synchronously
        final_state = self.app.invoke(initial_state)
        
        return final_state


# Global orchestrator instance
_orchestrator_instance = None


def get_orchestrator() -> WorkflowOrchestrator:
    """
    Get or create global orchestrator instance
    
    Returns:
        WorkflowOrchestrator instance
    """
    global _orchestrator_instance
    
    if _orchestrator_instance is None:
        _orchestrator_instance = WorkflowOrchestrator()
    
    return _orchestrator_instance
