import sys
import subprocess
import os

def regenerate():
    print('Regenerating knowledge base with updated prompts...')
    
    # Set environment variables to handle Unicode properly
    env = os.environ.copy()
    env['PYTHONIOENCODING'] = 'utf-8'
    
    # Run the existing ingest_knowledge_base.py script
    try:
        result = subprocess.run([
            sys.executable, 'ingest_knowledge_base.py'
        ], capture_output=True, text=True, cwd=os.getcwd(), env=env)
        
        if result.returncode == 0:
            print('Knowledge base regenerated successfully!')
            if result.stdout:
                print(result.stdout)
        else:
            print(f'Error regenerating knowledge base:')
            if result.stderr:
                print(result.stderr)
            if result.stdout:
                print('Output:', result.stdout)
            print(f'Return code: {result.returncode}')
    except Exception as e:
        print(f'Failed to run ingest_knowledge_base.py: {e}')

if __name__ == "__main__":
    regenerate()