"""
Direct Gemini API Test using google-generativeai
"""
import os
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("GEMINI API DIRECT TEST")
print("="*60)

api_key = os.getenv("GEMINI_API_KEY")
print(f"\n✓ API Key: {api_key[:20]}...{api_key[-10:]}")

try:
    import google.generativeai as genai
    
    print("\n✓ Configuring Gemini...")
    genai.configure(api_key=api_key)
    
    print("✓ Listing available models...")
    models = genai.list_models()
    
    print("\nAvailable models:")
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"  - {model.name}")
    
    print("\n✓ Testing with gemini-1.5-flash-latest...")
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
    prompt = "Say 'Hello from Gemini!' in exactly 5 words."
    response = model.generate_content(prompt)
    
    print("\n" + "="*60)
    print("✅ SUCCESS!")
    print("="*60)
    print(f"\nPrompt: {prompt}")
    print(f"Response: {response.text}")
    print("\n✅ Gemini API is working!")
    print("="*60)
    
except Exception as e:
    print("\n" + "="*60)
    print("❌ FAILED")
    print("="*60)
    print(f"\nError: {str(e)}")
    print("="*60)
