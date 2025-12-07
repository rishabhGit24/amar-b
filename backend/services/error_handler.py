"""
Error Handling Service for AMAR MVP
Provides comprehensive error handling, validation, and graceful failure modes
Validates: Requirements 1.2, 5.1, 6.5, 8.3
"""

import logging
import traceback
from datetime import datetime
from typing import Dict, Any, Optional, List, Tuple
from enum import Enum
import psutil
import os


class ErrorCategory(Enum):
    """Categories of errors for proper handling and routing"""
    USER_INPUT = "user_input"
    LLM_API = "llm_api"
    CODE_GENERATION = "code_generation"
    DEPLOYMENT = "deployment"
    SYSTEM = "system"
    VALIDATION = "validation"
    RATE_LIMIT = "rate_limit"


class ErrorSeverity(Enum):
    """Severity levels for errors"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AmarError(Exception):
    """Base exception class for AMAR system errors"""
    
    def __init__(
        self,
        message: str,
        category: ErrorCategory,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        details: Optional[Dict[str, Any]] = None,
        recoverable: bool = True
    ):
        super().__init__(message)
        self.message = message
        self.category = category
        self.severity = severity
        self.details = details or {}
        self.recoverable = recoverable
        self.timestamp = datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert error to dictionary for logging and API responses"""
        return {
            'message': self.message,
            'category': self.category.value,
            'severity': self.severity.value,
            'details': self.details,
            'recoverable': self.recoverable,
            'timestamp': self.timestamp,
            'type': self.__class__.__name__
        }


class UserInputError(AmarError):
    """Error related to user input validation"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            category=ErrorCategory.USER_INPUT,
            severity=ErrorSeverity.LOW,
            details=details,
            recoverable=False  # User must fix input
        )


class LLMAPIError(AmarError):
    """Error related to LLM API calls"""
    
    def __init__(
        self,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        recoverable: bool = True
    ):
        super().__init__(
            message=message,
            category=ErrorCategory.LLM_API,
            severity=ErrorSeverity.MEDIUM,
            details=details,
            recoverable=recoverable
        )


class CodeGenerationError(AmarError):
    """Error related to code generation"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            category=ErrorCategory.CODE_GENERATION,
            severity=ErrorSeverity.MEDIUM,
            details=details,
            recoverable=True  # Can retry with self-healing
        )


class DeploymentError(AmarError):
    """Error related to deployment"""
    
    def __init__(
        self,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        recoverable: bool = True
    ):
        super().__init__(
            message=message,
            category=ErrorCategory.DEPLOYMENT,
            severity=ErrorSeverity.HIGH,
            details=details,
            recoverable=recoverable
        )


class SystemError(AmarError):
    """Error related to system resources or infrastructure"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            category=ErrorCategory.SYSTEM,
            severity=ErrorSeverity.CRITICAL,
            details=details,
            recoverable=False
        )


class ValidationError(AmarError):
    """Error related to data validation"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            category=ErrorCategory.VALIDATION,
            severity=ErrorSeverity.MEDIUM,
            details=details,
            recoverable=False
        )


class ErrorHandler:
    """
    Centralized error handler for AMAR system
    
    Provides comprehensive error handling, logging, and recovery strategies
    Validates: Requirements 1.2, 5.1, 6.5, 8.3
    """
    
    def __init__(self):
        """Initialize error handler with logging"""
        self.logger = logging.getLogger(__name__)
        
        # Error statistics for monitoring
        self.error_counts: Dict[str, int] = {}
        self.last_errors: List[Dict[str, Any]] = []
        self.max_last_errors = 100
    
    def handle_error(
        self,
        error: Exception,
        context: Optional[Dict[str, Any]] = None
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Handle an error with appropriate logging and recovery strategy
        
        Args:
            error: The exception that occurred
            context: Additional context about where the error occurred
            
        Returns:
            Tuple of (user_friendly_message, error_details)
            
        Validates: Requirements 5.1, 6.5, 8.3
        """
        context = context or {}
        
        # Convert to AmarError if it's not already
        if isinstance(error, AmarError):
            amar_error = error
        else:
            amar_error = self._convert_to_amar_error(error, context)
        
        # Log the error
        self._log_error(amar_error, context)
        
        # Track error statistics
        self._track_error(amar_error)
        
        # Generate user-friendly message
        user_message = self._generate_user_message(amar_error)
        
        # Get error details for API response
        error_details = amar_error.to_dict()
        error_details['context'] = context
        error_details['stack_trace'] = traceback.format_exc() if not isinstance(error, AmarError) else None
        
        return user_message, error_details
    
    def _convert_to_amar_error(
        self,
        error: Exception,
        context: Dict[str, Any]
    ) -> AmarError:
        """
        Convert a generic exception to an AmarError
        
        Args:
            error: The original exception
            context: Context about where the error occurred
            
        Returns:
            AmarError instance
        """
        error_msg = str(error)
        error_type = type(error).__name__
        
        # Determine category based on error type and context
        agent = context.get('agent', '')
        
        # Check for specific error patterns
        if 'rate limit' in error_msg.lower() or '429' in error_msg:
            return LLMAPIError(
                message=f"Rate limit exceeded: {error_msg}",
                details={'original_error': error_type, 'agent': agent},
                recoverable=True
            )
        
        elif 'api' in error_msg.lower() or 'timeout' in error_msg.lower():
            return LLMAPIError(
                message=f"API error: {error_msg}",
                details={'original_error': error_type, 'agent': agent},
                recoverable=True
            )
        
        elif agent == 'deployer' or 'deploy' in error_msg.lower():
            return DeploymentError(
                message=f"Deployment failed: {error_msg}",
                details={'original_error': error_type},
                recoverable=True
            )
        
        elif 'memory' in error_msg.lower() or 'disk' in error_msg.lower():
            return SystemError(
                message=f"System resource error: {error_msg}",
                details={'original_error': error_type}
            )
        
        elif 'validation' in error_msg.lower() or 'invalid' in error_msg.lower():
            return ValidationError(
                message=f"Validation error: {error_msg}",
                details={'original_error': error_type}
            )
        
        else:
            # Generic error
            return AmarError(
                message=f"Unexpected error: {error_msg}",
                category=ErrorCategory.SYSTEM,
                severity=ErrorSeverity.MEDIUM,
                details={'original_error': error_type, 'agent': agent},
                recoverable=False
            )
    
    def _log_error(self, error: AmarError, context: Dict[str, Any]):
        """
        Log error with appropriate level based on severity
        
        Args:
            error: The AmarError to log
            context: Additional context
            
        Validates: Requirements 8.3
        """
        # Convert error to dict and rename 'message' to avoid LogRecord conflict
        error_dict = error.to_dict()
        if 'message' in error_dict:
            error_dict['error_message'] = error_dict.pop('message')
        
        log_data = {
            **error_dict,
            'context': context
        }
        
        # Log with appropriate level
        if error.severity == ErrorSeverity.CRITICAL:
            self.logger.critical(f"CRITICAL ERROR: {error.message}", extra=log_data)
        elif error.severity == ErrorSeverity.HIGH:
            self.logger.error(f"ERROR: {error.message}", extra=log_data)
        elif error.severity == ErrorSeverity.MEDIUM:
            self.logger.warning(f"WARNING: {error.message}", extra=log_data)
        else:
            self.logger.info(f"INFO: {error.message}", extra=log_data)
    
    def _track_error(self, error: AmarError):
        """
        Track error statistics for monitoring
        
        Args:
            error: The AmarError to track
        """
        # Increment error count by category
        category_key = error.category.value
        self.error_counts[category_key] = self.error_counts.get(category_key, 0) + 1
        
        # Store in recent errors list
        self.last_errors.append(error.to_dict())
        
        # Keep only last N errors
        if len(self.last_errors) > self.max_last_errors:
            self.last_errors = self.last_errors[-self.max_last_errors:]
    
    def _generate_user_message(self, error: AmarError) -> str:
        """
        Generate user-friendly error message
        
        Args:
            error: The AmarError
            
        Returns:
            User-friendly error message
            
        Validates: Requirements 6.5
        """
        # Base message
        message = error.message
        
        # Add recovery suggestions based on category
        if error.category == ErrorCategory.USER_INPUT:
            message += " Please check your input and try again."
        
        elif error.category == ErrorCategory.LLM_API:
            if error.recoverable:
                message += " The system will automatically retry this operation."
            else:
                message += " Please try again later or contact support if the issue persists."
        
        elif error.category == ErrorCategory.CODE_GENERATION:
            message += " The system will attempt to regenerate the code."
        
        elif error.category == ErrorCategory.DEPLOYMENT:
            if error.recoverable:
                message += " The system will try an alternative deployment platform."
            else:
                message += " Please check your deployment configuration and try again."
        
        elif error.category == ErrorCategory.SYSTEM:
            message += " This is a system-level issue. Please contact support."
        
        elif error.category == ErrorCategory.RATE_LIMIT:
            message += " Please wait a moment and try again."
        
        return message
    
    def check_system_resources(self) -> Tuple[bool, Optional[str]]:
        """
        Check system resources (memory, disk space) and return status
        
        Returns:
            Tuple of (is_healthy, error_message)
            
        Validates: Requirements 6.5, 8.3
        """
        try:
            # Check memory usage
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            if memory_percent > 95:
                return False, f"Critical memory usage: {memory_percent}%. System may be unstable."
            elif memory_percent > 85:
                self.logger.warning(f"High memory usage: {memory_percent}%")
            
            # Check disk space
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            if disk_percent > 95:
                return False, f"Critical disk space: {disk_percent}% used. Cannot continue operations."
            elif disk_percent > 85:
                self.logger.warning(f"High disk usage: {disk_percent}%")
            
            return True, None
            
        except Exception as e:
            self.logger.error(f"Error checking system resources: {str(e)}")
            # Don't fail the check if we can't get metrics
            return True, None
    
    def validate_user_input(self, description: str) -> Tuple[bool, Optional[str]]:
        """
        Validate user input before processing
        
        Args:
            description: User's application description
            
        Returns:
            Tuple of (is_valid, error_message)
            
        Validates: Requirements 1.2
        """
        # Check if empty
        if not description or not description.strip():
            return False, "Description cannot be empty"
        
        # Check minimum length
        if len(description.strip()) < 10:
            return False, "Description is too short. Please provide more details (at least 10 characters)."
        
        # Check maximum length (prevent abuse)
        if len(description) > 5000:
            return False, "Description is too long. Please limit to 5000 characters."
        
        # Check for suspicious patterns (basic security)
        suspicious_patterns = ['<script>', 'javascript:', 'eval(', 'exec(']
        description_lower = description.lower()
        
        for pattern in suspicious_patterns:
            if pattern in description_lower:
                return False, "Description contains invalid content. Please remove any code or scripts."
        
        return True, None
    
    def get_error_statistics(self) -> Dict[str, Any]:
        """
        Get error statistics for monitoring
        
        Returns:
            Dictionary with error statistics
        """
        return {
            'error_counts_by_category': self.error_counts,
            'total_errors': sum(self.error_counts.values()),
            'recent_errors': self.last_errors[-10:],  # Last 10 errors
            'timestamp': datetime.now().isoformat()
        }
    
    def clear_statistics(self):
        """Clear error statistics (for testing or reset)"""
        self.error_counts = {}
        self.last_errors = []


# Global error handler instance
_error_handler_instance = None


def get_error_handler() -> ErrorHandler:
    """
    Get or create global error handler instance
    
    Returns:
        ErrorHandler instance
    """
    global _error_handler_instance
    
    if _error_handler_instance is None:
        _error_handler_instance = ErrorHandler()
    
    return _error_handler_instance
