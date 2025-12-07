"""
Graceful Failure Handler for AMAR MVP
Manages graceful degradation and failure modes for system issues
Validates: Requirements 6.5, 8.3
"""

import logging
import os
import shutil
import tempfile
from typing import Dict, Any, Optional, Tuple, List
from datetime import datetime
import psutil

from .error_handler import get_error_handler, SystemError as AmarSystemError, DeploymentError


class GracefulFailureHandler:
    """
    Handler for graceful failure modes
    
    Manages system resource issues, deployment platform unavailability,
    and provides clear error messages to users.
    
    Validates: Requirements 6.5, 8.3
    """
    
    def __init__(self):
        """Initialize graceful failure handler"""
        self.logger = logging.getLogger(__name__)
        self.error_handler = get_error_handler()
        
        # Resource thresholds
        self.memory_warning_threshold = 85  # Percent
        self.memory_critical_threshold = 95  # Percent
        self.disk_warning_threshold = 85  # Percent
        self.disk_critical_threshold = 95  # Percent
        
        # Cleanup tracking
        self.temp_directories: List[str] = []
        self.cleanup_enabled = True
    
    def check_and_handle_resources(self) -> Tuple[bool, Optional[str]]:
        """
        Check system resources and handle issues gracefully
        
        Returns:
            Tuple of (can_continue, error_message)
            
        Validates: Requirements 6.5, 8.3
        """
        try:
            # Check memory
            memory_ok, memory_msg = self._check_memory()
            if not memory_ok:
                # Try to free up memory
                self._attempt_memory_cleanup()
                
                # Check again
                memory_ok, memory_msg = self._check_memory()
                if not memory_ok:
                    return False, memory_msg
            
            # Check disk space
            disk_ok, disk_msg = self._check_disk_space()
            if not disk_ok:
                # Try to free up disk space
                self._attempt_disk_cleanup()
                
                # Check again
                disk_ok, disk_msg = self._check_disk_space()
                if not disk_ok:
                    return False, disk_msg
            
            return True, None
            
        except Exception as e:
            self.logger.error(f"Error checking system resources: {str(e)}")
            # Don't fail if we can't check resources
            return True, None
    
    def _check_memory(self) -> Tuple[bool, Optional[str]]:
        """
        Check memory usage
        
        Returns:
            Tuple of (is_ok, error_message)
        """
        try:
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            if memory_percent >= self.memory_critical_threshold:
                return False, (
                    f"Critical memory usage: {memory_percent:.1f}%. "
                    f"Available: {memory.available / (1024**3):.2f} GB. "
                    "System cannot continue safely. Please free up memory and try again."
                )
            
            if memory_percent >= self.memory_warning_threshold:
                self.logger.warning(
                    f"High memory usage: {memory_percent:.1f}%. "
                    f"Available: {memory.available / (1024**3):.2f} GB"
                )
            
            return True, None
            
        except Exception as e:
            self.logger.error(f"Error checking memory: {str(e)}")
            return True, None  # Don't fail if we can't check
    
    def _check_disk_space(self) -> Tuple[bool, Optional[str]]:
        """
        Check disk space
        
        Returns:
            Tuple of (is_ok, error_message)
        """
        try:
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            if disk_percent >= self.disk_critical_threshold:
                return False, (
                    f"Critical disk space: {disk_percent:.1f}% used. "
                    f"Free: {disk.free / (1024**3):.2f} GB. "
                    "System cannot continue safely. Please free up disk space and try again."
                )
            
            if disk_percent >= self.disk_warning_threshold:
                self.logger.warning(
                    f"High disk usage: {disk_percent:.1f}%. "
                    f"Free: {disk.free / (1024**3):.2f} GB"
                )
            
            return True, None
            
        except Exception as e:
            self.logger.error(f"Error checking disk space: {str(e)}")
            return True, None  # Don't fail if we can't check
    
    def _attempt_memory_cleanup(self):
        """
        Attempt to free up memory
        
        Validates: Requirements 6.5
        """
        try:
            self.logger.info("Attempting memory cleanup...")
            
            # Clean up temporary directories
            self._cleanup_temp_directories()
            
            # Force garbage collection
            import gc
            gc.collect()
            
            self.logger.info("Memory cleanup completed")
            
        except Exception as e:
            self.logger.error(f"Error during memory cleanup: {str(e)}")
    
    def _attempt_disk_cleanup(self):
        """
        Attempt to free up disk space
        
        Validates: Requirements 6.5
        """
        try:
            self.logger.info("Attempting disk cleanup...")
            
            # Clean up temporary directories
            self._cleanup_temp_directories()
            
            # Clean up old temp files in system temp directory
            self._cleanup_system_temp()
            
            self.logger.info("Disk cleanup completed")
            
        except Exception as e:
            self.logger.error(f"Error during disk cleanup: {str(e)}")
    
    def _cleanup_temp_directories(self):
        """Clean up tracked temporary directories"""
        if not self.cleanup_enabled:
            return
        
        for temp_dir in self.temp_directories[:]:  # Copy list to avoid modification during iteration
            try:
                if os.path.exists(temp_dir):
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    self.logger.info(f"Cleaned up temp directory: {temp_dir}")
                
                self.temp_directories.remove(temp_dir)
                
            except Exception as e:
                self.logger.error(f"Error cleaning up {temp_dir}: {str(e)}")
    
    def _cleanup_system_temp(self):
        """Clean up old files in system temp directory"""
        try:
            temp_dir = tempfile.gettempdir()
            current_time = datetime.now().timestamp()
            
            # Remove files older than 1 hour
            max_age = 3600  # 1 hour in seconds
            
            for item in os.listdir(temp_dir):
                item_path = os.path.join(temp_dir, item)
                
                try:
                    # Check if it's an AMAR-related temp file
                    if 'amar' in item.lower() or 'generated' in item.lower():
                        # Check age
                        mtime = os.path.getmtime(item_path)
                        age = current_time - mtime
                        
                        if age > max_age:
                            if os.path.isdir(item_path):
                                shutil.rmtree(item_path, ignore_errors=True)
                            else:
                                os.remove(item_path)
                            
                            self.logger.info(f"Cleaned up old temp file: {item_path}")
                
                except Exception as e:
                    # Ignore errors for individual files
                    pass
                    
        except Exception as e:
            self.logger.error(f"Error cleaning system temp: {str(e)}")
    
    def register_temp_directory(self, directory: str):
        """
        Register a temporary directory for cleanup
        
        Args:
            directory: Path to temporary directory
        """
        if directory and directory not in self.temp_directories:
            self.temp_directories.append(directory)
    
    def handle_deployment_platform_unavailable(
        self,
        attempted_platforms: List[str],
        errors: Dict[str, str]
    ) -> str:
        """
        Handle deployment platform unavailability gracefully
        
        Args:
            attempted_platforms: List of platforms that were attempted
            errors: Dictionary mapping platform names to error messages
            
        Returns:
            User-friendly error message with guidance
            
        Validates: Requirements 6.5
        """
        message_parts = [
            "Unable to deploy application. All deployment platforms are unavailable:",
            ""
        ]
        
        # Add details for each platform
        for platform in attempted_platforms:
            error = errors.get(platform, "Unknown error")
            message_parts.append(f"- {platform.capitalize()}: {error}")
        
        message_parts.extend([
            "",
            "Possible solutions:",
            "1. Check your deployment platform credentials (VERCEL_TOKEN or NETLIFY_TOKEN)",
            "2. Verify the deployment platform services are operational",
            "3. Ensure the CLI tools are installed (vercel or netlify-cli)",
            "4. Check your network connection",
            "5. Try again in a few minutes if this is a temporary issue"
        ])
        
        return "\n".join(message_parts)
    
    def create_user_friendly_error_message(
        self,
        error_category: str,
        error_details: Dict[str, Any]
    ) -> str:
        """
        Create user-friendly error message with actionable guidance
        
        Args:
            error_category: Category of the error
            error_details: Details about the error
            
        Returns:
            User-friendly error message
            
        Validates: Requirements 6.5
        """
        base_message = error_details.get('message', 'An error occurred')
        
        # Add category-specific guidance
        if error_category == 'user_input':
            return f"{base_message}\n\nPlease review your input and ensure it meets the requirements."
        
        elif error_category == 'llm_api':
            return (
                f"{base_message}\n\n"
                "This is typically a temporary issue. The system will automatically retry. "
                "If the problem persists, please try again later."
            )
        
        elif error_category == 'code_generation':
            return (
                f"{base_message}\n\n"
                "The system will attempt to regenerate the code. "
                "If this continues to fail, please try simplifying your request."
            )
        
        elif error_category == 'deployment':
            platform = error_details.get('details', {}).get('platform', 'deployment platform')
            return (
                f"{base_message}\n\n"
                f"Deployment to {platform} failed. "
                "Please check your deployment configuration and credentials. "
                "The system may try an alternative platform if available."
            )
        
        elif error_category == 'system':
            return (
                f"{base_message}\n\n"
                "This is a system-level issue that requires attention. "
                "Please contact support if the problem persists."
            )
        
        elif error_category == 'rate_limit':
            return (
                f"{base_message}\n\n"
                "You've reached the rate limit for API requests. "
                "Please wait a moment before trying again."
            )
        
        else:
            return f"{base_message}\n\nPlease try again or contact support if the issue persists."
    
    def get_resource_status(self) -> Dict[str, Any]:
        """
        Get current resource status
        
        Returns:
            Dictionary with resource status information
        """
        try:
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                'memory': {
                    'percent_used': memory.percent,
                    'available_gb': memory.available / (1024**3),
                    'total_gb': memory.total / (1024**3),
                    'status': self._get_status_level(memory.percent, 'memory')
                },
                'disk': {
                    'percent_used': disk.percent,
                    'free_gb': disk.free / (1024**3),
                    'total_gb': disk.total / (1024**3),
                    'status': self._get_status_level(disk.percent, 'disk')
                },
                'temp_directories_tracked': len(self.temp_directories),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error getting resource status: {str(e)}")
            return {
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _get_status_level(self, percent: float, resource_type: str) -> str:
        """
        Get status level for a resource
        
        Args:
            percent: Percentage used
            resource_type: Type of resource ('memory' or 'disk')
            
        Returns:
            Status level string
        """
        if resource_type == 'memory':
            if percent >= self.memory_critical_threshold:
                return 'critical'
            elif percent >= self.memory_warning_threshold:
                return 'warning'
            else:
                return 'ok'
        
        elif resource_type == 'disk':
            if percent >= self.disk_critical_threshold:
                return 'critical'
            elif percent >= self.disk_warning_threshold:
                return 'warning'
            else:
                return 'ok'
        
        return 'unknown'
    
    def cleanup_all(self):
        """Clean up all tracked resources"""
        self._cleanup_temp_directories()


# Global graceful failure handler instance
_graceful_failure_handler_instance = None


def get_graceful_failure_handler() -> GracefulFailureHandler:
    """
    Get or create global graceful failure handler instance
    
    Returns:
        GracefulFailureHandler instance
    """
    global _graceful_failure_handler_instance
    
    if _graceful_failure_handler_instance is None:
        _graceful_failure_handler_instance = GracefulFailureHandler()
    
    return _graceful_failure_handler_instance
