"""
OpenAI API Client for AMAR MVP
Uses OpenAI's GPT models
"""

from openai import OpenAI
from config import get_settings


class OpenAIClient:
    """OpenAI API client wrapper"""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key)
        self.model = "gpt-oss"  # GPT OSS model
    
    def generate_content(self, prompt: str, system_instruction: str = None, temperature: float = 0.3, max_tokens: int = 4000) -> str:
        """
        Generate content using OpenAI API
        
        Args:
            prompt: The user prompt
            system_instruction: Optional system instruction
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text content
            
        Raises:
            Exception: If API call fails
        """
        try:
            messages = []
            
            if system_instruction:
                messages.append({
                    "role": "system",
                    "content": system_instruction
                })
            
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1,
                stream=False
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")


# Global instance
_openai_client = None


def get_openai_client() -> OpenAIClient:
    """Get or create global OpenAI client instance"""
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAIClient()
    return _openai_client
