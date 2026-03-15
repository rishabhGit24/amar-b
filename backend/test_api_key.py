#!/usr/bin/env python3
"""
Simple test to check if the Gemini API key is working
"""

import os
import sys
import google.generativeai as genai

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import get_settings


def test_api_key():
    """Test if the API key works with direct Google AI SDK"""
    
    print("=== Testing Gemini API Key ===\n")
    
    settings = get_settings()
    
    if not settings.gemini_api_key:
        print("❌ No API key found in environment variables")
        return
    
    print(f"API Key found: {settings.gemini_api_key[:10]}...{settings.gemini_api_key[-4:]}")
    
    try:
        # Configure the API key
        genai.configure(api_key=settings.gemini_api_key)
        
        # List available models
        print("\n🔍 Checking available models...")
        models = genai.list_models()
        
        available_models = []
        for model in models:
            if 'generateContent' in model.supported_generation_methods:
                available_models.append(model.name)
                print(f"  ✅ {model.name}")
        
        if not available_models:
            print("❌ No models available for content generation")
            return
        
        # Test with the first available model
        model_name = available_models[0]
        print(f"\n Testing with model: {model_name}")
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello in JSON format")
        
        print("✅ API call successful!")
        print(f"Response: {response.text[:100]}...")
        
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        if "API_KEY" in str(e):
            print("💡 This looks like an API key issue")
        elif "quota" in str(e).lower():
            print("💡 This looks like a quota/billing issue")


if __name__ == "__main__":
    test_api_key()