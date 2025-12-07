"""
Quick test to verify LLM connection is working
"""

from config import get_settings
from langchain_google_genai import ChatGoogleGenerativeAI

def test_gemini_connection():
    """Test Gemini API connection"""
    settings = get_settings()
    
    print(f"Testing Gemini API...")
    print(f"API Key configured: {bool(settings.gemini_api_key)}")
    print(f"Use OpenAI: {settings.use_openai}")
    print(f"Use Groq: {settings.use_groq}")
    
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=settings.gemini_api_key,
            temperature=0.3,
            max_tokens=100,
            timeout=30
        )
        
        response = llm.invoke("Say 'Hello, AMAR is working!' in one sentence.")
        print(f"\n✓ SUCCESS: {response.content}")
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_gemini_connection()
    exit(0 if success else 1)
