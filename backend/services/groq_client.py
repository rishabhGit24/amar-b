"""
Groq API Client for AMAR MVP
Uses Groq's fast inference with higher rate limits
"""

from groq import Groq
from config import get_settings


class GroqClient:
    """Groq API client wrapper"""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = Groq(api_key=self.settings.groq_api_key)
        # Using Llama model via Groq (fast and reliable)
        self.model = "llama-3.3-70b-versatile"  # Llama 3.3 70B on Groq
    
    def generate_content(self, prompt: str, system_instruction: str = None, temperature: float = 0.3, max_tokens: int = 4000) -> str:
        """
        Generate content using Groq API
        
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
            raise Exception(f"Groq API error: {str(e)}")


# Global instance
_groq_client = None


def get_groq_client() -> GroqClient:
    """Get or create global Groq client instance"""
    global _groq_client
    if _groq_client is None:
        _groq_client = GroqClient()
    return _groq_client
