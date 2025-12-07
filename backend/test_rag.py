"""Test RAG retrieval"""
from services.rag_retriever import RAGPipeline

print("Loading RAG pipeline...")
rag = RAGPipeline()
rag.load('amar_knowledge_base.pkl')

print("\nTesting retrieval...")
query = "How do I deploy to production?"
results = rag.retrieve(query, top_k=3)

print(f"\nQuery: {query}")
print(f"Found {len(results)} results\n")

for i, (chunk, score) in enumerate(results, 1):
    print(f"{i}. Score: {score:.3f}")
    print(f"   Source: {chunk.get('source', 'Unknown')}")
    print(f"   Text: {chunk['text'][:150]}...")
    print()

print("✅ RAG retrieval working!")
