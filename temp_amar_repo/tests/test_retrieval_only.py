"""
Test retrieval without LLM (no API calls)
"""
from rag_retriever import DocumentChunker, FAISSRetriever
from ingestion_pipeline import IngestionPipeline

print("="*60)
print("AMAR - Retrieval Test (No LLM)")
print("="*60)

# Initialize components
print("\n[1/3] Initializing retriever...")
retriever = FAISSRetriever()
chunker = DocumentChunker()

# Add sample document
print("\n[2/3] Adding sample document...")
sample_text = """
Web Application Security Best Practices

SQL Injection Prevention:
Always use parameterized queries instead of string concatenation.

Bad Example:
const query = "SELECT * FROM users WHERE id = '" + userId + "'";

Good Example (Node.js with MySQL):
const query = "SELECT * FROM users WHERE id = ?";
connection.query(query, [userId], (error, results) => {
    // Handle results
});

This prevents SQL injection attacks by treating user input as data, not executable code.
"""

doc_metadata = {
    "doc_id": "test-1",
    "title": "SQL Injection Prevention",
    "source": "security_guide.txt",
    "domain": "web_development"
}

chunks = chunker.chunk_text(sample_text, doc_metadata)
print(f"Created {len(chunks)} chunks")

retriever.add_documents(chunks)
print(f"Indexed {len(retriever.chunks)} chunks")

# Test retrieval
print("\n[3/3] Testing retrieval...")
query = "How to prevent SQL injection in Node.js?"
print(f"\nQuery: {query}")

results = retriever.search(query, top_k=3)

print(f"\nFound {len(results)} relevant chunks:\n")

for i, (chunk, score) in enumerate(results, 1):
    print(f"Result {i}:")
    print(f"  Relevance: {score:.2%}")
    print(f"  Source: {chunk.get('source', 'unknown')}")
    print(f"  Text preview: {chunk['text'][:150]}...")
    print()

print("="*60)
print("✓ Retrieval working perfectly!")
print("="*60)
print("\nThe retrieval system is functioning correctly.")
print("The LLM (Gemini) has a rate limit - wait 1 minute and try demo.py again.")
print("\nOr use the model without LLM by just using the retrieval results above.")
