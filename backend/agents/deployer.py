"""
Deployer Agent for AMAR MVP
Deploys generated React applications to free hosting platforms (Vercel/Netlify)
Validates: Requirements 6.1, 6.3, 6.4, 6.5
"""

import asyncio
import json
import os
import subprocess
import time
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple

from models.core import GeneratedProject, AgentResponse
from services.memory import memory_manager
from services.error_handler import get_error_handler, DeploymentError
from services.graceful_failure import get_graceful_failure_handler
from config import get_settings


class DeployerAgent:
    """
    Deployer Agent responsible for deploying generated projects to hosting platforms
    
    Selects available deployment platform (Vercel or Netlify), uploads project files,
    monitors deployment status, and retrieves deployment URL.
    
    Validates: Requirements 6.1, 6.3, 6.4, 6.5
    """
    
    def __init__(self):
        """Initialize Deployer Agent with platform configurations"""
        import logging
        self.logger = logging.getLogger(__name__)
        
        self.settings = get_settings()
        self.error_handler = get_error_handler()
        self.graceful_failure = get_graceful_failure_handler()
        
        # Check CLI tool availability and install if needed
        self.vercel_cli_available = self._ensure_cli_installed('vercel', 'npm install -g vercel')
        self.netlify_cli_available = self._ensure_cli_installed('netlify', 'npm install -g netlify-cli')
        
        # Platform availability flags (require token - CLI will be installed if needed)
        self.vercel_available = bool(self.settings.vercel_token)
        self.netlify_available = bool(self.settings.netlify_token)
        
        # Deployment timeout (5 minutes)
        self.deployment_timeout = 300
        
        # Status check interval (5 seconds)
        self.status_check_interval = 5
        
        # Track attempted platforms and errors for graceful failure handling
        self.attempted_platforms: List[str] = []
        self.platform_errors: Dict[str, str] = {}
    
    def _check_cli_available(self, tool_name: str) -> bool:
        """Check if a CLI tool is available"""
        try:
            result = subprocess.run(
                [tool_name, '--version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
    
    def _check_npm_available(self) -> bool:
        """Check if npm is available"""
        try:
            result = subprocess.run(
                ['npm', '--version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False
    
    def _ensure_cli_installed(self, tool_name: str, install_command: str) -> bool:
        """Check if CLI tool is available, install if not"""
        if self._check_cli_available(tool_name):
            self.logger.info(f"{tool_name} CLI is already installed")
            return True
        
        # Check if npm is available first
        if not self._check_npm_available():
            self.logger.error(f"Cannot install {tool_name} CLI: npm is not available. Please install Node.js and npm first.")
            return False
        
        # Try to install the CLI tool
        self.logger.info(f"{tool_name} CLI not found. Attempting to install via npm...")
        try:
            # Split install command into parts
            install_parts = install_command.split()
            result = subprocess.run(
                install_parts,
                capture_output=True,
                text=True,
                timeout=120  # 2 minute timeout for installation
            )
            
            if result.returncode == 0:
                self.logger.info(f"Successfully installed {tool_name} CLI")
                # Verify installation
                if self._check_cli_available(tool_name):
                    return True
                else:
                    self.logger.warning(f"{tool_name} CLI installed but not accessible. You may need to restart the server.")
                    return False
            else:
                self.logger.error(f"Failed to install {tool_name} CLI: {result.stderr}")
                if result.stdout:
                    self.logger.error(f"Install output: {result.stdout}")
                return False
                
        except subprocess.TimeoutExpired:
            self.logger.error(f"Installation of {tool_name} CLI timed out")
            return False
        except Exception as e:
            self.logger.error(f"Error installing {tool_name} CLI: {str(e)}")
            return False
    
    def deploy_project(self, project: GeneratedProject, project_dir: str) -> AgentResponse:
        """
        Deploy generated project to hosting platform
        
        Args:
            project: GeneratedProject object with all files and metadata
            project_dir: Path to directory containing project files
            
        Returns:
            AgentResponse with success status and deployment URL
            
        Validates: Requirements 6.1, 6.3, 6.4, 6.5
        """
        start_time = datetime.now()
        
        try:
            # Get memory context for this session
            memory = memory_manager.get_memory(project.session_id)
            
            # Try to deploy to available platforms with fallback
            deployment_url = None
            deployment_details = None
            platform = None
            
            # Try Vercel first
            if self.vercel_available:
                try:
                    platform = 'vercel'
                    self.attempted_platforms.append(platform)
                    
                    # Log platform selection
                    memory.add_entry(
                        agent='deployer',
                        action='platform_selected',
                        data={'platform': platform},
                        tags=['deployment', 'platform_selection'],
                        importance=0.8
                    )
                    
                    deployment_url, deployment_details = self._deploy_to_vercel(project_dir, project.session_id)
                    
                except DeploymentError as e:
                    # Log Vercel failure and try Netlify
                    self.platform_errors['vercel'] = str(e)
                    self.logger.warning(f"Vercel deployment failed: {str(e)}")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_failed',
                        data={'platform': 'vercel', 'error': str(e)},
                        tags=['deployment', 'failure', 'vercel'],
                        importance=0.7
                    )
            
            # Try Netlify if Vercel failed or wasn't available
            if not deployment_url and self.netlify_available:
                try:
                    platform = 'netlify'
                    self.attempted_platforms.append(platform)
                    
                    # Log platform selection
                    memory.add_entry(
                        agent='deployer',
                        action='platform_selected',
                        data={'platform': platform},
                        tags=['deployment', 'platform_selection'],
                        importance=0.8
                    )
                    
                    deployment_url, deployment_details = self._deploy_to_netlify(project_dir, project.session_id)
                    
                except DeploymentError as e:
                    # Log Netlify failure
                    self.platform_errors['netlify'] = str(e)
                    self.logger.error(f"Netlify deployment failed: {str(e)}")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_failed',
                        data={'platform': 'netlify', 'error': str(e)},
                        tags=['deployment', 'failure', 'netlify'],
                        importance=0.7
                    )
            
            # If no platform succeeded, raise error with helpful message
            if not deployment_url:
                error_message = "Deployment failed: No deployment platforms available.\n\n"
                
                if not self.settings.vercel_token and not self.settings.netlify_token:
                    error_message += "Please configure at least one deployment token:\n"
                    error_message += "- Set VERCEL_TOKEN environment variable for Vercel deployment\n"
                    error_message += "- Set NETLIFY_TOKEN environment variable for Netlify deployment\n"
                elif not self.vercel_cli_available and not self.netlify_cli_available:
                    error_message += "CLI tools installation failed. Please install manually:\n"
                    error_message += "- npm install -g vercel (for Vercel)\n"
                    error_message += "- npm install -g netlify-cli (for Netlify)\n"
                else:
                    error_message += self.graceful_failure.handle_deployment_platform_unavailable(
                        self.attempted_platforms,
                        self.platform_errors
                    )
                
                raise DeploymentError(
                    error_message,
                    details={
                        'attempted_platforms': self.attempted_platforms,
                        'platform_errors': self.platform_errors,
                        'vercel_token_set': bool(self.settings.vercel_token),
                        'netlify_token_set': bool(self.settings.netlify_token),
                        'vercel_cli_available': self.vercel_cli_available,
                        'netlify_cli_available': self.netlify_cli_available
                    },
                    recoverable=False
                )
            
            # Store deployment information in memory
            memory.add_entry(
                agent='deployer',
                action='deployment_completed',
                data={
                    'platform': platform,
                    'deployment_url': deployment_url,
                    'deployment_details': deployment_details,
                    'project_summary': {
                        'page_count': len(project.plan.pages),
                        'component_count': len(project.plan.components),
                        'has_backend': project.plan.backend_logic is not None
                    }
                },
                tags=['deployment', 'success', platform],
                importance=1.0
            )
            
            # Log deployment to audit trail
            from services.audit import audit_manager
            audit_logger = audit_manager.get_logger(project.session_id)
            
            asyncio.create_task(audit_logger.log_agent_decision(
                agent='deployer',
                action='deployment_success',
                details={
                    'platform': platform,
                    'url': deployment_url,
                    'deployment_details': deployment_details
                }
            ))
            
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return AgentResponse(
                agent_name='deployer',
                success=True,
                output={
                    'deployment_url': deployment_url,
                    'platform': platform,
                    'deployment_details': deployment_details,
                    'project_location': project_dir
                },
                errors=[],
                execution_time_ms=execution_time
            )
            
        except DeploymentError as e:
            # Handle deployment-specific errors
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'deployer', 'session_id': project.session_id}
            )
            
            # Log deployment failure
            memory = memory_manager.get_memory(project.session_id)
            memory.add_entry(
                agent='deployer',
                action='deployment_failed',
                data={
                    'error': user_message,
                    'error_details': error_details
                },
                tags=['deployment', 'failure', 'error'],
                importance=0.9
            )
            
            return self._create_error_response(user_message, start_time)
        
        except Exception as e:
            # Handle unexpected errors
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'deployer', 'session_id': project.session_id}
            )
            
            # Log deployment failure
            memory = memory_manager.get_memory(project.session_id)
            memory.add_entry(
                agent='deployer',
                action='deployment_failed',
                data={
                    'error': user_message,
                    'error_details': error_details
                },
                tags=['deployment', 'failure', 'error'],
                importance=0.9
            )
            
            return self._create_error_response(user_message, start_time)
    
    def _select_platform(self) -> str:
        """
        Select available deployment platform
        
        Tries Vercel first (no credit card required), falls back to Netlify
        
        Returns:
            Platform name ('vercel' or 'netlify')
            
        Raises:
            DeploymentError: If no platform is available
            
        Validates: Requirements 6.1, 6.5
        """
        # Try Vercel first (no credit card required for free tier)
        if self.vercel_available:
            return 'vercel'
        
        # Fallback to Netlify
        if self.netlify_available:
            return 'netlify'
        
        # No platform available - provide clear error message
        raise DeploymentError(
            "No deployment platform available. Please configure VERCEL_TOKEN or NETLIFY_TOKEN in environment variables.",
            details={
                'vercel_configured': self.vercel_available,
                'netlify_configured': self.netlify_available
            },
            recoverable=False
        )
    
    def _deploy_to_vercel(self, project_dir: str, session_id: str) -> Tuple[str, Dict[str, Any]]:
        """
        Deploy project to Vercel using Vercel CLI
        
        Args:
            project_dir: Path to project directory
            session_id: Session identifier for logging
            
        Returns:
            Tuple of (deployment_url, deployment_details)
            
        Raises:
            RuntimeError: If deployment fails
            
        Validates: Requirements 6.2, 6.3, 6.4
        """
        try:
            # Check if Vercel CLI is installed
            self._ensure_vercel_cli_installed()
            
            # Change to project directory
            original_cwd = os.getcwd()
            os.chdir(project_dir)
            
            try:
                # Ensure dependencies are installed before deployment
                self.logger.info("Installing npm dependencies before deployment...")
                install_result = subprocess.run(
                    ['npm', 'install'],
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minute timeout
                )
                
                if install_result.returncode != 0:
                    self.logger.warning(f"npm install had warnings: {install_result.stderr}")
                    # Continue anyway as Vercel will install dependencies during build
                
                # Deploy using Vercel CLI with token authentication
                # --yes flag skips prompts
                # --prod flag deploys to production
                # --token flag provides authentication
                deploy_command = [
                    'vercel',
                    '--yes',
                    '--prod',
                    '--token', self.settings.vercel_token
                ]
                
                # Log deployment initiation
                memory = memory_manager.get_memory(session_id)
                memory.add_entry(
                    agent='deployer',
                    action='vercel_deployment_initiated',
                    data={
                        'project_dir': project_dir,
                        'command': ' '.join(['vercel', '--yes', '--prod', '--token', '[REDACTED]'])
                    },
                    tags=['deployment', 'vercel', 'initiated'],
                    importance=0.7
                )
                
                # Execute deployment command
                result = subprocess.run(
                    deploy_command,
                    capture_output=True,
                    text=True,
                    timeout=self.deployment_timeout
                )
                
                if result.returncode != 0:
                    raise RuntimeError(f"Vercel deployment failed: {result.stderr}")
                
                # Extract deployment URL from output
                deployment_url = self._extract_vercel_url(result.stdout)
                
                if not deployment_url:
                    raise RuntimeError("Failed to extract deployment URL from Vercel output")
                
                # Monitor deployment status
                deployment_status = self._monitor_vercel_deployment(deployment_url, session_id)
                
                deployment_details = {
                    'platform': 'vercel',
                    'status': deployment_status,
                    'deployed_at': datetime.now().isoformat(),
                    'cli_output': result.stdout[:500]  # First 500 chars for logging
                }
                
                return deployment_url, deployment_details
                
            finally:
                # Always restore original directory
                os.chdir(original_cwd)
                
        except subprocess.TimeoutExpired:
            raise DeploymentError(
                "Vercel deployment timed out after 5 minutes",
                details={'platform': 'vercel', 'timeout': self.deployment_timeout},
                recoverable=True
            )
        except DeploymentError:
            raise
        except Exception as e:
            raise DeploymentError(
                f"Vercel deployment error: {str(e)}",
                details={'platform': 'vercel', 'error_type': type(e).__name__},
                recoverable=True
            )
    
    def _deploy_to_netlify(self, project_dir: str, session_id: str) -> Tuple[str, Dict[str, Any]]:
        """
        Deploy project to Netlify using Netlify CLI
        
        Args:
            project_dir: Path to project directory
            session_id: Session identifier for logging
            
        Returns:
            Tuple of (deployment_url, deployment_details)
            
        Raises:
            RuntimeError: If deployment fails
            
        Validates: Requirements 6.2, 6.3, 6.4
        """
        try:
            # Check if Netlify CLI is installed
            self._ensure_netlify_cli_installed()
            
            # Change to project directory
            original_cwd = os.getcwd()
            os.chdir(project_dir)
            
            try:
                # Ensure dependencies are installed before building
                self.logger.info("Installing npm dependencies before build...")
                install_result = subprocess.run(
                    ['npm', 'install'],
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minute timeout
                )
                
                if install_result.returncode != 0:
                    raise RuntimeError(f"npm install failed: {install_result.stderr}")
                
                # Build the project
                build_command = ['npm', 'run', 'build']
                
                build_result = subprocess.run(
                    build_command,
                    capture_output=True,
                    text=True,
                    timeout=300  # 5 minute timeout for build
                )
                
                if build_result.returncode != 0:
                    raise RuntimeError(f"Build failed: {build_result.stderr}")
                
                # Deploy using Netlify CLI with token authentication
                # Set token as environment variable for Netlify CLI
                env = os.environ.copy()
                env['NETLIFY_AUTH_TOKEN'] = self.settings.netlify_token
                
                # --prod flag deploys to production
                # --dir flag specifies build directory
                deploy_command = [
                    'netlify',
                    'deploy',
                    '--prod',
                    '--dir=build'
                ]
                
                # Log deployment initiation
                memory = memory_manager.get_memory(session_id)
                memory.add_entry(
                    agent='deployer',
                    action='netlify_deployment_initiated',
                    data={
                        'project_dir': project_dir,
                        'command': ' '.join(['netlify', 'deploy', '--prod', '--dir=build', '--auth=[REDACTED]'])
                    },
                    tags=['deployment', 'netlify', 'initiated'],
                    importance=0.7
                )
                
                # Execute deployment command with environment variables
                result = subprocess.run(
                    deploy_command,
                    capture_output=True,
                    text=True,
                    timeout=self.deployment_timeout,
                    env=env
                )
                
                if result.returncode != 0:
                    raise RuntimeError(f"Netlify deployment failed: {result.stderr}")
                
                # Extract deployment URL from output
                deployment_url = self._extract_netlify_url(result.stdout)
                
                if not deployment_url:
                    raise RuntimeError("Failed to extract deployment URL from Netlify output")
                
                # Monitor deployment status
                deployment_status = self._monitor_netlify_deployment(deployment_url, session_id)
                
                deployment_details = {
                    'platform': 'netlify',
                    'status': deployment_status,
                    'deployed_at': datetime.now().isoformat(),
                    'cli_output': result.stdout[:500]  # First 500 chars for logging
                }
                
                return deployment_url, deployment_details
                
            finally:
                # Always restore original directory
                os.chdir(original_cwd)
                
        except subprocess.TimeoutExpired:
            raise DeploymentError(
                "Netlify deployment timed out after 5 minutes",
                details={'platform': 'netlify', 'timeout': self.deployment_timeout},
                recoverable=True
            )
        except DeploymentError:
            raise
        except Exception as e:
            raise DeploymentError(
                f"Netlify deployment error: {str(e)}",
                details={'platform': 'netlify', 'error_type': type(e).__name__},
                recoverable=True
            )
    
    def _ensure_vercel_cli_installed(self) -> None:
        """
        Ensure Vercel CLI is installed
        
        Raises:
            DeploymentError: If Vercel CLI cannot be installed or accessed
        """
        if not self.vercel_cli_available:
            # Try to install it now
            if not self._ensure_cli_installed('vercel', 'npm install -g vercel'):
                raise DeploymentError(
                    "Vercel CLI is not installed and could not be installed automatically. "
                    "Please install manually: npm install -g vercel",
                    details={'platform': 'vercel', 'issue': 'cli_not_installed'},
                    recoverable=False
                )
        
        # Verify CLI is accessible
        if not self._check_cli_available('vercel'):
            raise DeploymentError(
                "Vercel CLI is not accessible. Please verify installation: npm install -g vercel",
                details={'platform': 'vercel', 'issue': 'cli_not_accessible'},
                recoverable=False
            )
    
    def _ensure_netlify_cli_installed(self) -> None:
        """
        Ensure Netlify CLI is installed
        
        Raises:
            DeploymentError: If Netlify CLI cannot be installed or accessed
        """
        if not self.netlify_cli_available:
            # Try to install it now
            if not self._ensure_cli_installed('netlify', 'npm install -g netlify-cli'):
                raise DeploymentError(
                    "Netlify CLI is not installed and could not be installed automatically. "
                    "Please install manually: npm install -g netlify-cli",
                    details={'platform': 'netlify', 'issue': 'cli_not_installed'},
                    recoverable=False
                )
        
        # Verify CLI is accessible
        if not self._check_cli_available('netlify'):
            raise DeploymentError(
                "Netlify CLI is not accessible. Please verify installation: npm install -g netlify-cli",
                details={'platform': 'netlify', 'issue': 'cli_not_accessible'},
                recoverable=False
            )
    
    def _extract_vercel_url(self, output: str) -> Optional[str]:
        """
        Extract deployment URL from Vercel CLI output
        
        Args:
            output: Standard output from Vercel CLI
            
        Returns:
            Deployment URL or None if not found
            
        Validates: Requirements 6.4
        """
        # Vercel CLI outputs the URL in various formats
        # Look for lines containing vercel.app domain
        lines = output.split('\n')
        
        for line in lines:
            # Look for production URL
            if 'https://' in line and 'vercel.app' in line:
                # Extract URL from line
                import re
                url_match = re.search(r'https://[^\s]+\.vercel\.app', line)
                if url_match:
                    return url_match.group(0)
        
        # Fallback: look for any https URL in output
        import re
        url_match = re.search(r'https://[^\s]+', output)
        if url_match:
            return url_match.group(0)
        
        return None
    
    def _extract_netlify_url(self, output: str) -> Optional[str]:
        """
        Extract deployment URL from Netlify CLI output
        
        Args:
            output: Standard output from Netlify CLI
            
        Returns:
            Deployment URL or None if not found
            
        Validates: Requirements 6.4
        """
        # Netlify CLI outputs the URL with labels
        # Look for "Website URL:" or "Live URL:" or similar
        lines = output.split('\n')
        
        for line in lines:
            # Look for URL labels
            if any(label in line for label in ['Website URL:', 'Live URL:', 'URL:', 'Website Draft URL:']):
                # Extract URL from line
                import re
                url_match = re.search(r'https://[^\s]+', line)
                if url_match:
                    return url_match.group(0)
            
            # Also look for netlify.app domain
            if 'https://' in line and 'netlify.app' in line:
                import re
                url_match = re.search(r'https://[^\s]+\.netlify\.app', line)
                if url_match:
                    return url_match.group(0)
        
        # Fallback: look for any https URL in output
        import re
        url_match = re.search(r'https://[^\s]+', output)
        if url_match:
            return url_match.group(0)
        
        return None
    
    def _monitor_vercel_deployment(self, deployment_url: str, session_id: str) -> str:
        """
        Monitor Vercel deployment status until completion
        
        Args:
            deployment_url: URL of the deployment
            session_id: Session identifier for logging
            
        Returns:
            Final deployment status ('ready' or 'error')
            
        Validates: Requirements 6.3
        """
        # For Vercel, we can check if the URL is accessible
        # This is a simple check - in production, you'd use Vercel API
        
        import requests
        
        max_attempts = self.deployment_timeout // self.status_check_interval
        
        for attempt in range(max_attempts):
            try:
                response = requests.get(deployment_url, timeout=10)
                
                if response.status_code == 200:
                    # Deployment is ready
                    memory = memory_manager.get_memory(session_id)
                    memory.add_entry(
                        agent='deployer',
                        action='deployment_ready',
                        data={
                            'platform': 'vercel',
                            'url': deployment_url,
                            'attempts': attempt + 1,
                            'status_code': response.status_code
                        },
                        tags=['deployment', 'vercel', 'ready'],
                        importance=0.8
                    )
                    return 'ready'
                
            except requests.RequestException:
                # Deployment not ready yet, wait and retry
                pass
            
            # Wait before next check
            time.sleep(self.status_check_interval)
        
        # Timeout reached, but deployment might still be processing
        # Return 'processing' status
        return 'processing'
    
    def _monitor_netlify_deployment(self, deployment_url: str, session_id: str) -> str:
        """
        Monitor Netlify deployment status until completion
        
        Args:
            deployment_url: URL of the deployment
            session_id: Session identifier for logging
            
        Returns:
            Final deployment status ('ready' or 'error')
            
        Validates: Requirements 6.3
        """
        # For Netlify, we can check if the URL is accessible
        # This is a simple check - in production, you'd use Netlify API
        
        import requests
        
        max_attempts = self.deployment_timeout // self.status_check_interval
        
        for attempt in range(max_attempts):
            try:
                response = requests.get(deployment_url, timeout=10)
                
                if response.status_code == 200:
                    # Deployment is ready
                    memory = memory_manager.get_memory(session_id)
                    memory.add_entry(
                        agent='deployer',
                        action='deployment_ready',
                        data={
                            'platform': 'netlify',
                            'url': deployment_url,
                            'attempts': attempt + 1,
                            'status_code': response.status_code
                        },
                        tags=['deployment', 'netlify', 'ready'],
                        importance=0.8
                    )
                    return 'ready'
                
            except requests.RequestException:
                # Deployment not ready yet, wait and retry
                pass
            
            # Wait before next check
            time.sleep(self.status_check_interval)
        
        # Timeout reached, but deployment might still be processing
        # Return 'processing' status
        return 'processing'
    
    def _create_error_response(self, error_msg: str, start_time: datetime) -> AgentResponse:
        """
        Create standardized error response
        
        Args:
            error_msg: Error message to include
            start_time: When the operation started
            
        Returns:
            AgentResponse with error details
            
        Validates: Requirements 6.5
        """
        execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return AgentResponse(
            agent_name='deployer',
            success=False,
            output={},
            errors=[error_msg],
            execution_time_ms=execution_time
        )
    
    def check_platform_availability(self) -> Dict[str, bool]:
        """
        Check which deployment platforms are available
        
        Returns:
            Dictionary with platform availability status
        """
        return {
            'vercel': self.vercel_available,
            'netlify': self.netlify_available,
            'vercel_cli': self.vercel_cli_available,
            'netlify_cli': self.netlify_cli_available,
            'any_available': self.vercel_available or self.netlify_available
        }
