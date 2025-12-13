"""
Quick Gemini API Test
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("GEMINI API QUICK TEST")
print("="*60)

# Get API key
api_key = os.getenv("GEMINI_API_KEY")
print(f"\n✓ API Key: {api_key[:20]}...{api_key[-10:]}")

# Test with Gemini
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    
    print("\n✓ Initializing Gemini client...")
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-live",
        google_api_key=api_key,
        temperature=0.3
    )
    
    print("✓ Sending test prompt...")
    prompt = "Say 'Hello from Gemini!' in exactly 5 words."
    
    response = llm.invoke(prompt)
    
    print("\n" + "="*60)
    print("✅ SUCCESS!")
    print("="*60)
    print(f"\nPrompt: {prompt}")
    print(f"Response: {response.content}")
    print("\n✅ Gemini API is working!")
    print("="*60)
    
except Exception as e:
    print("\n" + "="*60)
    print("❌ FAILED")
    print("="*60)
    print(f"\nError: {str(e)}")
    print("\nThis could mean:")
    print("  - API key is invalid")
    print("  - API quota exhausted")
    print("  - Network issue")
    print("="*60)
