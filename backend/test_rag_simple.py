"""
Simple RAG test to verify the knowledge base is working
"""
from services.rag_retriever import RAGPipeline

print("Loading RAG pipeline...")
rag = RAGPipeline()
rag.load('amar_knowledge_base.pkl')

print(f"Total chunks in knowledge base: {len(rag.retriever.chunks)}")
print(f"Total documents: {len(rag.retriever.doc_metadata)}")

if len(rag.retriever.chunks) > 0:
    print("\nSample chunk:")
    print(rag.retriever.chunks[0]['text'][:200])
    
    print("\n\nTesting retrieval...")
    results = rag.retrieve('deployment production', top_k=3)
    print(f"Found {len(results)} results")
    
    for i, (chunk, score) in enumerate(results, 1):
        print(f"\n{i}. Score: {score:.3f}")
        print(f"   Source: {chunk.get('source', 'unknown')}")
        print(f"   Text: {chunk['text'][:150]}...")
else:
    print("\n⚠️ Knowledge base is empty! Run ingest_knowledge_base.py first.")
