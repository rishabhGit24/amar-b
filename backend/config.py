"""
Configuration management for AMAR MVP Backend
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Keys
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"  # Use gemini-2.5-flash which is stable and widely available
    groq_api_key: str = ""
    openai_api_key: str = ""
    use_groq: bool = False
    use_openai: bool = False
    vercel_token: str = ""
    netlify_token: str = ""
    
    # Application Configuration
    port: int = 8000
    environment: str = "development"
    host: str = "0.0.0.0"
    
    # CORS Configuration
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    # Rate Limiting
    max_requests_per_session: int = 50
    max_retry_attempts: int = 3
    
    # Logging
    log_level: str = "INFO"
    
    # Deployment Configuration
    railway_environment: Optional[str] = None
    heroku_app_name: Optional[str] = None
    mock_deployment: bool = False
    
    # RAG Configuration
    disable_rag: bool = False
    
    model_config = {"env_file": ".env", "case_sensitive": False}
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.environment.lower() == "production"
    
    @property
    def cors_origins_list(self) -> list:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings"""
    return settings