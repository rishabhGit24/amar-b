import re

# Read the file
with open('agents/builder.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences
content = content.replace(
    'response = self.llm.invoke(prompt)\n                return self._extract_code_from_response(response.content)',
    'response_text = self._call_llm(prompt)\n                return self._extract_code_from_response(response_text)'
)

# Write back
with open('agents/builder.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed all LLM calls in builder.py")
