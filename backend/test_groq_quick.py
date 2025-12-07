"""
Quick Groq API Test
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("GROQ API QUICK TEST")
print("="*60)

api_key = os.getenv("GROQ_API_KEY")
print(f"\n✓ API Key: {api_key[:20]}...{api_key[-10:]}")

try:
    from services.groq_client import get_groq_client
    
    print("\n✓ Initializing Groq client...")
    client = get_groq_client()
    
    print(f"✓ Using model: {client.model}")
    print("✓ Sending test prompt...")
    
    prompt = "Say 'Hello from Groq!' in exactly 5 words."
    response = client.generate_content(prompt)
    
    print("\n" + "="*60)
    print("✅ SUCCESS!")
    print("="*60)
    print(f"\nPrompt: {prompt}")
    print(f"Response: {response}")
    print("\n✅ Groq API is working perfectly!")
    print("="*60)
    
except Exception as e:
    print("\n" + "="*60)
    print("❌ FAILED")
    print("="*60)
    print(f"\nError: {str(e)}")
    print("="*60)
