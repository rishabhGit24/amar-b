"""
Direct Gemini API Client
Uses direct HTTP requests instead of LangChain to avoid aggressive retries
"""

import requests
import json
from typing import Dict, Any, Optional
from config import get_settings


class GeminiDirectClient:
    """Direct Gemini API client with simple retry logic"""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.gemini_api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-1.5-flash-latest"
    
    def generate_content(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Generate content using Gemini API
        
        Args:
            prompt: The user prompt
            system_instruction: Optional system instruction
            
        Returns:
            Generated text content
            
        Raises:
            Exception: If API call fails
        """
        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        
        # Build the request payload
        parts = []
        if system_instruction:
            parts.append({"text": system_instruction})
        parts.append({"text": prompt})
        
        payload = {
            "contents": [{
                "parts": parts
            }],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 4000,
            }
        }
        
        headers = {"Content-Type": "application/json"}
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            response.raise_for_status()
            
            response_data = response.json()
            
            # Extract text from response
            if "candidates" in response_data and len(response_data["candidates"]) > 0:
                candidate = response_data["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if len(parts) > 0 and "text" in parts[0]:
                        return parts[0]["text"]
            
            raise Exception("No valid content in API response")
            
        except requests.exceptions.HTTPError as http_err:
            if response.status_code == 429:
                raise Exception(f"Rate limit exceeded. Please wait before trying again.")
            raise Exception(f"HTTP error occurred: {str(http_err)}")
        except requests.exceptions.Timeout:
            raise Exception("Request timed out")
        except json.JSONDecodeError:
            raise Exception("Failed to parse API response as JSON")
        except Exception as e:
            raise Exception(f"An error occurred: {str(e)}")


# Global instance
_gemini_client = None


def get_gemini_client() -> GeminiDirectClient:
    """Get or create global Gemini client instance"""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiDirectClient()
    return _gemini_client
