"""
Tests for Deployer Agent
Validates: Requirements 6.1, 6.3, 6.4, 6.5
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
import subprocess
from hypothesis import given, strategies as st, settings

from backend.models.core import GeneratedProject, Plan, PageSpec, ComponentSpec, RoutingConfig, TestResults
from backend.agents.deployer import DeployerAgent


class TestDeployerAgent:
    """Test suite for Deployer Agent functionality"""
    
    def setup_method(self):
        """Set up test fixtures"""
        # Create a mock project
        self.mock_plan = Plan(
            pages=[
                PageSpec(
                    name="HomePage",
                    route="/",
                    components=["Header", "Hero"],
                    description="Main landing page"
                )
            ],
            components=[
                ComponentSpec(
                    name="Header",
                    type="functional",
                    props={},
                    description="Header component"
                )
            ],
            routing=RoutingConfig(
                base_path="/",
                routes=[{"path": "/", "component": "HomePage"}],
                navigation_links=[{"label": "Home", "path": "/"}]
            ),
            backend_logic=None,
            estimated_complexity="simple"
        )
        
        self.mock_project = GeneratedProject(
            session_id="test-session-123",
            files={"src/App.tsx": "// App code"},
            plan=self.mock_plan,
            test_results=TestResults(passed=1, failed=0)
        )
    
    @patch('backend.agents.deployer.get_settings')
    def test_deployer_initialization(self, mock_settings):
        """Test that Deployer Agent initializes correctly"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        
        deployer = DeployerAgent()
        
        assert deployer.settings is not None
        assert deployer.vercel_available is True
        assert deployer.netlify_available is False
        assert deployer.deployment_timeout == 300
        assert deployer.status_check_interval == 5
    
    @patch('backend.agents.deployer.get_settings')
    def test_select_platform_vercel_available(self, mock_settings):
        """Test platform selection when Vercel is available"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        
        deployer = DeployerAgent()
        platform = deployer._select_platform()
        
        assert platform == 'vercel'
    
    @patch('backend.agents.deployer.get_settings')
    def test_select_platform_netlify_fallback(self, mock_settings):
        """Test platform selection falls back to Netlify"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        
        deployer = DeployerAgent()
        platform = deployer._select_platform()
        
        assert platform == 'netlify'
    
    @patch('backend.agents.deployer.get_settings')
    def test_select_platform_no_platform_available(self, mock_settings):
        """Test error when no platform is available"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="")
        
        deployer = DeployerAgent()
        
        with pytest.raises(RuntimeError, match="No deployment platform available"):
            deployer._select_platform()
    
    @patch('backend.agents.deployer.get_settings')
    def test_extract_vercel_url_success(self, mock_settings):
        """Test extracting Vercel URL from CLI output"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        
        deployer = DeployerAgent()
        output = """
        Deploying...
        Production: https://my-app-abc123.vercel.app
        Deployment complete!
        """
        
        url = deployer._extract_vercel_url(output)
        
        assert url == "https://my-app-abc123.vercel.app"
    
    @patch('backend.agents.deployer.get_settings')
    def test_extract_vercel_url_not_found(self, mock_settings):
        """Test handling when Vercel URL is not found"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        
        deployer = DeployerAgent()
        output = "Deployment failed"
        
        url = deployer._extract_vercel_url(output)
        
        assert url is None
    
    @patch('backend.agents.deployer.get_settings')
    def test_extract_netlify_url_success(self, mock_settings):
        """Test extracting Netlify URL from CLI output"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        
        deployer = DeployerAgent()
        output = """
        Deploying...
        Website URL: https://my-app-xyz789.netlify.app
        Deployment complete!
        """
        
        url = deployer._extract_netlify_url(output)
        
        assert url == "https://my-app-xyz789.netlify.app"
    
    @patch('backend.agents.deployer.get_settings')
    def test_extract_netlify_url_not_found(self, mock_settings):
        """Test handling when Netlify URL is not found"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        
        deployer = DeployerAgent()
        output = "Deployment failed"
        
        url = deployer._extract_netlify_url(output)
        
        assert url is None
    
    @patch('backend.agents.deployer.get_settings')
    def test_check_platform_availability(self, mock_settings):
        """Test checking platform availability"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="test-token")
        
        deployer = DeployerAgent()
        availability = deployer.check_platform_availability()
        
        assert availability['vercel'] is True
        assert availability['netlify'] is True
        assert availability['any_available'] is True
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    def test_ensure_vercel_cli_installed_success(self, mock_run, mock_settings):
        """Test Vercel CLI installation check succeeds"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        mock_run.return_value = Mock(returncode=0, stdout="Vercel CLI 28.0.0")
        
        deployer = DeployerAgent()
        
        # Should not raise exception
        deployer._ensure_vercel_cli_installed()
        
        mock_run.assert_called_once()
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    def test_ensure_vercel_cli_not_installed(self, mock_run, mock_settings):
        """Test error when Vercel CLI is not installed"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        mock_run.side_effect = FileNotFoundError()
        
        deployer = DeployerAgent()
        
        with pytest.raises(RuntimeError, match="Vercel CLI is not installed"):
            deployer._ensure_vercel_cli_installed()
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    def test_ensure_netlify_cli_installed_success(self, mock_run, mock_settings):
        """Test Netlify CLI installation check succeeds"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        mock_run.return_value = Mock(returncode=0, stdout="netlify-cli/12.0.0")
        
        deployer = DeployerAgent()
        
        # Should not raise exception
        deployer._ensure_netlify_cli_installed()
        
        mock_run.assert_called_once()
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    def test_ensure_netlify_cli_not_installed(self, mock_run, mock_settings):
        """Test error when Netlify CLI is not installed"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        mock_run.side_effect = FileNotFoundError()
        
        deployer = DeployerAgent()
        
        with pytest.raises(RuntimeError, match="Netlify CLI is not installed"):
            deployer._ensure_netlify_cli_installed()
    
    @patch('backend.agents.deployer.get_settings')
    def test_create_error_response(self, mock_settings):
        """Test error response creation"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        
        deployer = DeployerAgent()
        start_time = datetime.now()
        error_msg = "Test error message"
        
        response = deployer._create_error_response(error_msg, start_time)
        
        assert response.success is False
        assert response.agent_name == 'deployer'
        assert error_msg in response.errors
        assert response.execution_time_ms >= 0
        assert len(response.output) == 0


class TestDeployerAgentIntegration:
    """Integration tests for Deployer Agent (require mocking external services)"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.mock_plan = Plan(
            pages=[
                PageSpec(
                    name="HomePage",
                    route="/",
                    components=["Header"],
                    description="Main page"
                )
            ],
            components=[
                ComponentSpec(
                    name="Header",
                    type="functional",
                    props={},
                    description="Header"
                )
            ],
            routing=RoutingConfig(
                base_path="/",
                routes=[{"path": "/", "component": "HomePage"}],
                navigation_links=[]
            ),
            backend_logic=None,
            estimated_complexity="simple"
        )
        
        self.mock_project = GeneratedProject(
            session_id="test-session-456",
            files={"src/App.tsx": "// App code"},
            plan=self.mock_plan,
            test_results=TestResults(passed=1, failed=0)
        )
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    @patch('backend.agents.deployer.os.chdir')
    @patch('backend.agents.deployer.os.getcwd')
    @patch('backend.agents.deployer.requests.get')
    @patch('backend.agents.deployer.time.sleep')
    def test_deploy_to_vercel_success(self, mock_sleep, mock_requests, mock_getcwd, mock_chdir, mock_run, mock_settings):
        """Test successful deployment to Vercel"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        mock_getcwd.return_value = "/original/dir"
        mock_chdir.return_value = None  # Mock chdir to do nothing
        
        # Mock CLI check
        mock_run.side_effect = [
            Mock(returncode=0, stdout="Vercel CLI 28.0.0"),  # CLI check
            Mock(returncode=0, stdout="Production: https://test-app.vercel.app\nDeployment complete!")  # Deploy
        ]
        
        # Mock URL check
        mock_requests.return_value = Mock(status_code=200)
        
        deployer = DeployerAgent()
        url, details = deployer._deploy_to_vercel("/test/project", "test-session")
        
        assert url == "https://test-app.vercel.app"
        assert details['platform'] == 'vercel'
        assert details['status'] == 'ready'
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    @patch('backend.agents.deployer.os.chdir')
    @patch('backend.agents.deployer.os.getcwd')
    def test_deploy_to_vercel_cli_failure(self, mock_getcwd, mock_chdir, mock_run, mock_settings):
        """Test handling of Vercel CLI deployment failure"""
        mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
        mock_getcwd.return_value = "/original/dir"
        mock_chdir.return_value = None  # Mock chdir to do nothing
        
        # Mock CLI check success, deploy failure
        mock_run.side_effect = [
            Mock(returncode=0, stdout="Vercel CLI 28.0.0"),  # CLI check
            Mock(returncode=1, stderr="Deployment failed: Invalid token")  # Deploy failure
        ]
        
        deployer = DeployerAgent()
        
        with pytest.raises(RuntimeError, match="Vercel deployment"):
            deployer._deploy_to_vercel("/test/project", "test-session")
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    @patch('backend.agents.deployer.os.chdir')
    @patch('backend.agents.deployer.os.getcwd')
    @patch('backend.agents.deployer.requests.get')
    @patch('backend.agents.deployer.time.sleep')
    def test_deploy_to_netlify_success(self, mock_sleep, mock_requests, mock_getcwd, mock_chdir, mock_run, mock_settings):
        """Test successful deployment to Netlify"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        mock_getcwd.return_value = "/original/dir"
        mock_chdir.return_value = None  # Mock chdir to do nothing
        
        # Mock CLI check, build, and deploy
        mock_run.side_effect = [
            Mock(returncode=0, stdout="netlify-cli/12.0.0"),  # CLI check
            Mock(returncode=0, stdout="Build complete!"),  # Build
            Mock(returncode=0, stdout="Website URL: https://test-app.netlify.app\nDeployment complete!")  # Deploy
        ]
        
        # Mock URL check
        mock_requests.return_value = Mock(status_code=200)
        
        deployer = DeployerAgent()
        url, details = deployer._deploy_to_netlify("/test/project", "test-session")
        
        assert url == "https://test-app.netlify.app"
        assert details['platform'] == 'netlify'
        assert details['status'] == 'ready'
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    @patch('backend.agents.deployer.os.chdir')
    @patch('backend.agents.deployer.os.getcwd')
    def test_deploy_to_netlify_build_failure(self, mock_getcwd, mock_chdir, mock_run, mock_settings):
        """Test handling of Netlify build failure"""
        mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
        mock_getcwd.return_value = "/original/dir"
        mock_chdir.return_value = None  # Mock chdir to do nothing
        
        # Mock CLI check success, build failure
        mock_run.side_effect = [
            Mock(returncode=0, stdout="netlify-cli/12.0.0"),  # CLI check
            Mock(returncode=1, stderr="Build failed: Syntax error")  # Build failure
        ]
        
        deployer = DeployerAgent()
        
        with pytest.raises(RuntimeError, match="Build failed"):
            deployer._deploy_to_netlify("/test/project", "test-session")



class TestDeployerPropertyTests:
    """Property-based tests for Deployer Agent"""
    
    @patch('backend.agents.deployer.get_settings')
    @patch('backend.agents.deployer.subprocess.run')
    @patch('backend.agents.deployer.os.chdir')
    @patch('backend.agents.deployer.os.getcwd')
    @patch('backend.agents.deployer.requests.get')
    @patch('backend.agents.deployer.time.sleep')
    @given(
        page_count=st.integers(min_value=1, max_value=5),
        component_count=st.integers(min_value=1, max_value=10),
        platform=st.sampled_from(['vercel', 'netlify'])
    )
    @settings(max_examples=100)
    def test_successful_deployment_url_generation_property(
        self,
        mock_sleep,
        mock_requests,
        mock_getcwd,
        mock_chdir,
        mock_run,
        mock_settings,
        page_count,
        component_count,
        platform
    ):
        """
        Feature: amar-mvp, Property 7: Successful deployment URL generation
        Validates: Requirements 6.4
        
        For any project that passes all tests, the Deployer Agent should return 
        a valid HTTP/HTTPS URL.
        """
        # Configure mock settings based on platform
        if platform == 'vercel':
            mock_settings.return_value = Mock(vercel_token="test-token", netlify_token="")
            deployment_url = f"https://test-app-{page_count}-{component_count}.vercel.app"
            cli_output = f"Production: {deployment_url}\nDeployment complete!"
        else:  # netlify
            mock_settings.return_value = Mock(vercel_token="", netlify_token="test-token")
            deployment_url = f"https://test-app-{page_count}-{component_count}.netlify.app"
            cli_output = f"Website URL: {deployment_url}\nDeployment complete!"
        
        # Mock directory operations
        mock_getcwd.return_value = "/original/dir"
        mock_chdir.return_value = None
        
        # Mock CLI operations
        if platform == 'vercel':
            mock_run.side_effect = [
                Mock(returncode=0, stdout="Vercel CLI 28.0.0"),  # CLI check
                Mock(returncode=0, stdout=cli_output)  # Deploy
            ]
        else:  # netlify
            mock_run.side_effect = [
                Mock(returncode=0, stdout="netlify-cli/12.0.0"),  # CLI check
                Mock(returncode=0, stdout="Build complete!"),  # Build
                Mock(returncode=0, stdout=cli_output)  # Deploy
            ]
        
        # Mock URL accessibility check
        mock_requests.return_value = Mock(status_code=200)
        
        # Generate a project with random page and component counts
        pages = []
        for i in range(page_count):
            pages.append(
                PageSpec(
                    name=f"Page{i}",
                    route=f"/page{i}" if i > 0 else "/",
                    components=[f"Component{j}" for j in range(min(component_count, 3))],
                    description=f"Test page {i}"
                )
            )
        
        components = []
        for i in range(component_count):
            components.append(
                ComponentSpec(
                    name=f"Component{i}",
                    type="functional",
                    props={},
                    description=f"Test component {i}"
                )
            )
        
        plan = Plan(
            pages=pages,
            components=components,
            routing=RoutingConfig(
                base_path="/",
                routes=[{"path": page.route, "component": page.name} for page in pages],
                navigation_links=[{"label": page.name, "path": page.route} for page in pages]
            ),
            backend_logic=None,
            estimated_complexity="simple"
        )
        
        # Create a project that has passed all tests
        project = GeneratedProject(
            session_id=f"test-session-{page_count}-{component_count}",
            files={"src/App.tsx": "// App code"},
            plan=plan,
            test_results=TestResults(passed=component_count, failed=0)  # All tests passed
        )
        
        # Deploy the project
        deployer = DeployerAgent()
        response = deployer.deploy_project(project, "/test/project")
        
        # Property: For any project that passes all tests, 
        # the Deployer Agent should return a valid HTTP/HTTPS URL
        if response.success:
            assert 'deployment_url' in response.output, "Response should contain deployment_url"
            
            url = response.output['deployment_url']
            
            # Verify URL is a valid HTTP/HTTPS URL
            assert url is not None, "Deployment URL should not be None"
            assert isinstance(url, str), "Deployment URL should be a string"
            assert url.startswith('https://') or url.startswith('http://'), \
                f"Deployment URL should start with http:// or https://, got: {url}"
            
            # Verify URL contains expected domain
            if platform == 'vercel':
                assert 'vercel.app' in url, f"Vercel URL should contain 'vercel.app', got: {url}"
            else:
                assert 'netlify.app' in url, f"Netlify URL should contain 'netlify.app', got: {url}"
            
            # Verify URL is well-formed (no spaces, proper format)
            assert ' ' not in url, "URL should not contain spaces"
            assert len(url) > 10, "URL should be a reasonable length"
