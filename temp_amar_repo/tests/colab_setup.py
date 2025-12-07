"""
Google Colab Setup Script
Run this first in Colab to install dependencies and set up environment
"""

def setup_colab():
    """Setup script for Google Colab"""
    
    print("Installing dependencies...")
    
    # Install packages
    install_commands = [
        "pip install -q faiss-cpu==1.7.4",
        "pip install -q sentence-transformers==2.2.2",
        "pip install -q transformers==4.35.0",
        "pip install -q torch==2.1.0",
        "pip install -q tiktoken==0.5.1",
        "pip install -q google-generativeai",
        "pip install -q PyPDF2"
    ]
    
    for cmd in install_commands:
        print(f"Running: {cmd}")
        import subprocess
        subprocess.run(cmd.split(), check=True)
    
    print("\n✓ All dependencies installed!")
    
    # Setup API keys
    print("\n" + "="*60)
    print("API Key Setup")
    print("="*60)
    print("\nTo use Gemini 2.5 Flash, you need a Google AI API key.")
    print("Get one at: https://makersuite.google.com/app/apikey")
    print("\nRun the following in a Colab cell:")
    print("```python")
    print("import os")
    print("from google.colab import userdata")
    print("os.environ['GEMINI_API_KEY'] = userdata.get('GEMINI_API_KEY')")
    print("# Or directly:")
    print("# os.environ['GEMINI_API_KEY'] = 'your-api-key-here'")
    print("```")
    
    print("\n✓ Setup complete! You can now run demo.py")


if __name__ == "__main__":
    setup_colab()
