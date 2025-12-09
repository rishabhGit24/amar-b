"""
API-Based Deployer Agent for AMAR MVP
Deploys generated React applications using Vercel/Netlify REST APIs (no CLI needed)
Validates: Requirements 6.1, 6.3, 6.4, 6.5
"""

import asyncio
import json
import os
import tarfile
import zipfile
import io
import time
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple

from models.core import GeneratedProject, AgentResponse
from services.memory import memory_manager
from services.error_handler import get_error_handler, DeploymentError
from services.graceful_failure import get_graceful_failure_handler
from config import get_settings


class DeployerAgentAPI:
    """
    API-Based Deployer Agent - No CLI tools required
    
    Uses Vercel and Netlify REST APIs directly to deploy projects.
    This eliminates the need for npm, Node.js, or CLI tools.
    
    Validates: Requirements 6.1, 6.3, 6.4, 6.5
    """
    
    def __init__(self):
        """Initialize API-Based Deployer Agent"""
        import logging
        self.logger = logging.getLogger(__name__)
        
        self.settings = get_settings()
        self.error_handler = get_error_handler()
        self.graceful_failure = get_graceful_failure_handler()
        
        # Platform availability (only requires API tokens)
        self.vercel_available = bool(self.settings.vercel_token)
        self.netlify_available = bool(self.settings.netlify_token)
        
        # API endpoints
        self.vercel_api_base = "https://api.vercel.com"
        self.netlify_api_base = "https://api.netlify.com/api/v1"
        
        # Deployment timeout (10 minutes for API-based deployment)
        self.deployment_timeout = 600
        
        # Status check interval (10 seconds)
        self.status_check_interval = 10
        
        # Track attempted platforms and errors
        self.attempted_platforms: List[str] = []
        self.platform_errors: Dict[str, str] = {}
    
    def deploy_project(self, project: GeneratedProject, project_dir: str) -> AgentResponse:
        """
        Deploy generated project to hosting platform using REST APIs
        
        Args:
            project: GeneratedProject object with all files and metadata
            project_dir: Path to directory containing project files
            
        Returns:
            AgentResponse with success status and deployment URL
        """
        start_time = datetime.now()
        
        try:
            # Get memory context for this session
            memory = memory_manager.get_memory(project.session_id)
            
            deployment_url = None
            deployment_details = None
            platform = None
            
            # Try Vercel first (simpler API)
            if self.vercel_available:
                try:
                    platform = 'vercel'
                    self.attempted_platforms.append(platform)
                    
                    self.logger.info(f"🚀 Attempting Vercel deployment via API...")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_selected',
                        data={'platform': platform, 'method': 'REST API'},
                        tags=['deployment', 'platform_selection', 'api'],
                        importance=0.8
                    )
                    
                    deployment_url, deployment_details = self._deploy_to_vercel_api(
                        project_dir, 
                        project.session_id,
                        project.files
                    )
                    
                    self.logger.info(f"✓ Vercel deployment successful: {deployment_url}")
                    
                except DeploymentError as e:
                    self.platform_errors['vercel'] = str(e)
                    self.logger.warning(f"Vercel API deployment failed: {str(e)}")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_failed',
                        data={'platform': 'vercel', 'error': str(e), 'method': 'REST API'},
                        tags=['deployment', 'failure', 'vercel'],
                        importance=0.7
                    )
            
            # Try Netlify if Vercel failed or wasn't available
            if not deployment_url and self.netlify_available:
                try:
                    platform = 'netlify'
                    self.attempted_platforms.append(platform)
                    
                    self.logger.info(f"🚀 Attempting Netlify deployment via API...")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_selected',
                        data={'platform': platform, 'method': 'REST API'},
                        tags=['deployment', 'platform_selection', 'api'],
                        importance=0.8
                    )
                    
                    deployment_url, deployment_details = self._deploy_to_netlify_api(
                        project_dir,
                        project.session_id,
                        project.files
                    )
                    
                    self.logger.info(f"✓ Netlify deployment successful: {deployment_url}")
                    
                except DeploymentError as e:
                    self.platform_errors['netlify'] = str(e)
                    self.logger.error(f"Netlify API deployment failed: {str(e)}")
                    
                    memory.add_entry(
                        agent='deployer',
                        action='platform_failed',
                        data={'platform': 'netlify', 'error': str(e), 'method': 'REST API'},
                        tags=['deployment', 'failure', 'netlify'],
                        importance=0.7
                    )
            
            # If no platform succeeded, provide helpful error
            if not deployment_url:
                error_message = self._generate_deployment_error_message()
                
                raise DeploymentError(
                    error_message,
                    details={
                        'attempted_platforms': self.attempted_platforms,
                        'platform_errors': self.platform_errors,
                        'vercel_token_set': self.vercel_available,
                        'netlify_token_set': self.netlify_available,
                        'deployment_method': 'REST API (no CLI required)'
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
                    'method': 'REST API',
                    'project_summary': {
                        'page_count': len(project.plan.pages),
                        'component_count': len(project.plan.components),
                        'has_backend': project.plan.backend_logic is not None
                    }
                },
                tags=['deployment', 'success', platform, 'api'],
                importance=1.0
            )
            
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return AgentResponse(
                agent_name='deployer',
                success=True,
                output={
                    'deployment_url': deployment_url,
                    'platform': platform,
                    'deployment_details': deployment_details,
                    'project_location': project_dir,
                    'deployment_method': 'REST API'
                },
                errors=[],
                execution_time_ms=execution_time
            )
            
        except DeploymentError as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'deployer', 'session_id': project.session_id}
            )
            return self._create_error_response(user_message, start_time)
        
        except Exception as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'deployer', 'session_id': project.session_id}
            )
            return self._create_error_response(user_message, start_time)
    
    def _deploy_to_vercel_api(
        self, 
        project_dir: str, 
        session_id: str,
        files: Dict[str, str]
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Deploy to Vercel using REST API
        
        Vercel API Documentation: https://vercel.com/docs/rest-api
        """
        try:
            # Prepare files for deployment
            file_dict = self._prepare_vercel_files(project_dir, files)
            
            # Create deployment payload using Vercel v13 API format
            payload = {
                "name": f"amar-app-{session_id[:8]}",
                "files": file_dict,
                "projectSettings": {
                    "framework": "create-react-app",
                    "buildCommand": "npm run build",
                    "outputDirectory": "build"
                }
            }
            
            # Make API request to create deployment
            headers = {
                "Authorization": f"Bearer {self.settings.vercel_token}",
                "Content-Type": "application/json"
            }
            
            self.logger.info(f"📤 Uploading {len(file_dict)} files to Vercel...")
            
            response = requests.post(
                f"{self.vercel_api_base}/v13/deployments",
                headers=headers,
                json=payload,
                timeout=120
            )
            
            if response.status_code not in [200, 201]:
                error_msg = response.json().get('error', {}).get('message', response.text)
                raise DeploymentError(
                    f"Vercel API error: {error_msg}",
                    details={'status_code': response.status_code, 'response': response.text[:500]},
                    recoverable=True
                )
            
            deployment_data = response.json()
            deployment_url = f"https://{deployment_data.get('url', deployment_data.get('alias', [''])[0])}"
            
            # Monitor deployment status
            deployment_id = deployment_data.get('id')
            if deployment_id:
                self.logger.info(f"⏳ Monitoring deployment status...")
                status = self._monitor_vercel_deployment_api(deployment_id, session_id)
            else:
                status = 'deployed'
            
            deployment_details = {
                'platform': 'vercel',
                'status': status,
                'deployed_at': datetime.now().isoformat(),
                'deployment_id': deployment_id,
                'method': 'REST API'
            }
            
            return deployment_url, deployment_details
            
        except requests.RequestException as e:
            raise DeploymentError(
                f"Vercel API request failed: {str(e)}",
                details={'error_type': type(e).__name__},
                recoverable=True
            )
    
    def _deploy_to_netlify_api(
        self,
        project_dir: str,
        session_id: str,
        files: Dict[str, str]
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Deploy to Netlify using REST API
        
        Netlify API Documentation: https://docs.netlify.com/api/get-started/
        """
        try:
            # Create a zip file of the project
            zip_buffer = self._create_netlify_zip(project_dir, files)
            
            # Create a new site
            headers = {
                "Authorization": f"Bearer {self.settings.netlify_token}",
                "Content-Type": "application/json"
            }
            
            site_payload = {
                "name": f"amar-app-{session_id[:8]}",
                "custom_domain": None
            }
            
            self.logger.info(f"📤 Creating Netlify site...")
            
            site_response = requests.post(
                f"{self.netlify_api_base}/sites",
                headers=headers,
                json=site_payload,
                timeout=30
            )
            
            if site_response.status_code not in [200, 201]:
                error_msg = site_response.json().get('message', site_response.text)
                raise DeploymentError(
                    f"Netlify site creation error: {error_msg}",
                    details={'status_code': site_response.status_code},
                    recoverable=True
                )
            
            site_data = site_response.json()
            site_id = site_data.get('id')
            
            # Deploy the zip file
            self.logger.info(f"📤 Uploading project files to Netlify...")
            
            deploy_headers = {
                "Authorization": f"Bearer {self.settings.netlify_token}",
                "Content-Type": "application/zip"
            }
            
            deploy_response = requests.post(
                f"{self.netlify_api_base}/sites/{site_id}/deploys",
                headers=deploy_headers,
                data=zip_buffer.getvalue(),
                timeout=300
            )
            
            if deploy_response.status_code not in [200, 201]:
                error_msg = deploy_response.json().get('message', deploy_response.text)
                raise DeploymentError(
                    f"Netlify deployment error: {error_msg}",
                    details={'status_code': deploy_response.status_code},
                    recoverable=True
                )
            
            deploy_data = deploy_response.json()
            deployment_url = deploy_data.get('ssl_url') or deploy_data.get('url')
            
            # Monitor deployment
            deploy_id = deploy_data.get('id')
            if deploy_id:
                self.logger.info(f"⏳ Monitoring deployment status...")
                status = self._monitor_netlify_deployment_api(site_id, deploy_id, session_id)
            else:
                status = 'deployed'
            
            deployment_details = {
                'platform': 'netlify',
                'status': status,
                'deployed_at': datetime.now().isoformat(),
                'site_id': site_id,
                'deploy_id': deploy_id,
                'method': 'REST API'
            }
            
            return deployment_url, deployment_details
            
        except requests.RequestException as e:
            raise DeploymentError(
                f"Netlify API request failed: {str(e)}",
                details={'error_type': type(e).__name__},
                recoverable=True
            )
    
    def _prepare_vercel_files(self, project_dir: str, files: Dict[str, str]) -> Dict[str, Dict[str, str]]:
        """
        Prepare files in Vercel API format
        
        Vercel v13 API expects: {"path/to/file": {"file": "content"}}
        """
        file_dict = {}
        
        # Files to skip (Vercel auto-generates these)
        skip_files = ['vercel.json', 'netlify.toml']
        
        for file_path, content in files.items():
            # Skip deployment config files
            if file_path in skip_files:
                self.logger.info(f"Skipping {file_path} (not needed for API deployment)")
                continue
            
            # Vercel v13 API format: plain text content, not base64
            file_dict[file_path] = {
                "file": content
            }
        
        return file_dict
    
    def _create_netlify_zip(self, project_dir: str, files: Dict[str, str]) -> io.BytesIO:
        """
        Create a zip file of the project for Netlify deployment
        """
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_path, content in files.items():
                zip_file.writestr(file_path, content)
        
        zip_buffer.seek(0)
        return zip_buffer
    
    def _monitor_vercel_deployment_api(self, deployment_id: str, session_id: str) -> str:
        """
        Monitor Vercel deployment status using API
        """
        headers = {
            "Authorization": f"Bearer {self.settings.vercel_token}"
        }
        
        max_attempts = self.deployment_timeout // self.status_check_interval
        
        for attempt in range(max_attempts):
            try:
                response = requests.get(
                    f"{self.vercel_api_base}/v13/deployments/{deployment_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    state = data.get('readyState', data.get('state', 'UNKNOWN'))
                    
                    if state in ['READY', 'DEPLOYED']:
                        self.logger.info(f"✓ Deployment ready!")
                        return 'ready'
                    elif state in ['ERROR', 'FAILED']:
                        self.logger.error(f"✗ Deployment failed")
                        return 'error'
                    
                    # Still building
                    self.logger.info(f"⏳ Building... (attempt {attempt + 1}/{max_attempts})")
                
            except requests.RequestException:
                pass
            
            time.sleep(self.status_check_interval)
        
        return 'processing'
    
    def _monitor_netlify_deployment_api(self, site_id: str, deploy_id: str, session_id: str) -> str:
        """
        Monitor Netlify deployment status using API
        """
        headers = {
            "Authorization": f"Bearer {self.settings.netlify_token}"
        }
        
        max_attempts = self.deployment_timeout // self.status_check_interval
        
        for attempt in range(max_attempts):
            try:
                response = requests.get(
                    f"{self.netlify_api_base}/sites/{site_id}/deploys/{deploy_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    state = data.get('state', 'unknown')
                    
                    if state == 'ready':
                        self.logger.info(f"✓ Deployment ready!")
                        return 'ready'
                    elif state in ['error', 'failed']:
                        self.logger.error(f"✗ Deployment failed")
                        return 'error'
                    
                    # Still building
                    self.logger.info(f"⏳ Building... (attempt {attempt + 1}/{max_attempts})")
                
            except requests.RequestException:
                pass
            
            time.sleep(self.status_check_interval)
        
        return 'processing'
    
    def _generate_deployment_error_message(self) -> str:
        """Generate helpful error message for deployment failures"""
        if not self.vercel_available and not self.netlify_available:
            return (
                "❌ No deployment platform configured.\n\n"
                "Please set at least one API token in your .env file:\n"
                "- VERCEL_TOKEN=your_vercel_token_here\n"
                "- NETLIFY_TOKEN=your_netlify_token_here\n\n"
                "Get your tokens:\n"
                "- Vercel: https://vercel.com/account/tokens\n"
                "- Netlify: https://app.netlify.com/user/applications#personal-access-tokens"
            )
        else:
            error_details = "\n".join([
                f"- {platform}: {error}" 
                for platform, error in self.platform_errors.items()
            ])
            return (
                f"❌ Deployment failed on all attempted platforms:\n\n{error_details}\n\n"
                "Please check your API tokens and try again."
            )
    
    def _create_error_response(self, error_msg: str, start_time: datetime) -> AgentResponse:
        """Create standardized error response"""
        execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return AgentResponse(
            agent_name='deployer',
            success=False,
            output={},
            errors=[error_msg],
            execution_time_ms=execution_time
        )
    
    def check_platform_availability(self) -> Dict[str, bool]:
        """Check which deployment platforms are available"""
        return {
            'vercel': self.vercel_available,
            'netlify': self.netlify_available,
            'any_available': self.vercel_available or self.netlify_available,
            'deployment_method': 'REST API (no CLI required)'
        }
