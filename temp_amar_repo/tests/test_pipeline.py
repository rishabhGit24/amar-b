"""
Test script to verify AMAR Phase 1 components
Run this to ensure everything is working correctly
"""
import sys

def test_imports():
    """Test if all modules can be imported"""
    print("Testing imports...")
    try:
        import faiss
        print("✓ FAISS imported")
    except ImportError as e:
        print(f"✗ FAISS import failed: {e}")
        return False
    
    try:
        from sentence_transformers import SentenceTransformer
        print("✓ SentenceTransformers imported")
    except ImportError as e:
        print(f"✗ SentenceTransformers import failed: {e}")
        return False
    
    try:
        import tiktoken
        print("✓ Tiktoken imported")
    except ImportError as e:
        print(f"✗ Tiktoken import failed: {e}")
        return False
    
    try:
        import google.generativeai as genai
        print("✓ Google Generative AI imported")
    except ImportError as e:
        print(f"✗ Google Generative AI import failed: {e}")
        return False
    
    return True


def test_modules():
    """Test if custom modules can be imported"""
    print("\nTesting custom modules...")
    try:
        from rag_retriever import RAGPipeline, DocumentChunker, FAISSRetriever
        print("✓ rag_retriever module imported")
    except ImportError as e:
        print(f"✗ rag_retriever import failed: {e}")
        return False
    
    try:
        from ingestion_pipeline import IngestionPipeline, DocumentLoader
        print("✓ ingestion_pipeline module imported")
    except ImportError as e:
        print(f"✗ ingestion_pipeline import failed: {e}")
        return False
    
    try:
        from evaluation import RAGEvaluator, run_evaluation_suite
        print("✓ evaluation module imported")
    except ImportError as e:
        print(f"✗ evaluation import failed: {e}")
        return False
    
    return True


def test_chunker():
    """Test document chunker"""
    print("\nTesting DocumentChunker...")
    try:
        from rag_retriever import DocumentChunker
        
        chunker = DocumentChunker(chunk_size=100, overlap=10)
        test_text = "This is a test document. " * 50
        
        doc_metadata = {
            "doc_id": "test-123",
            "source": "test.txt",
            "domain": "web_development"
        }
        
        chunks = chunker.chunk_text(test_text, doc_metadata)
        
        print(f"✓ Created {len(chunks)} chunks")
        print(f"  First chunk: {len(chunks[0]['text'])} chars")
        print(f"  Chunk metadata keys: {list(chunks[0].keys())}")
        
        return True
    except Exception as e:
        print(f"✗ Chunker test failed: {e}")
        return False


def test_embeddings():
    """Test embedding generation"""
    print("\nTesting embeddings...")
    try:
        from sentence_transformers import SentenceTransformer
        
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        test_text = "This is a test sentence for embedding."
        
        embedding = model.encode(test_text)
        
        print(f"✓ Generated embedding")
        print(f"  Dimension: {len(embedding)}")
        print(f"  Type: {type(embedding)}")
        
        return True
    except Exception as e:
        print(f"✗ Embedding test failed: {e}")
        return False


def test_faiss_index():
    """Test FAISS indexing"""
    print("\nTesting FAISS index...")
    try:
        import faiss
        import numpy as np
        
        dimension = 384
        index = faiss.IndexHNSWFlat(dimension, 32)
        
        # Add some random vectors
        vectors = np.random.random((10, dimension)).astype('float32')
        index.add(vectors)
        
        # Search
        query = np.random.random((1, dimension)).astype('float32')
        distances, indices = index.search(query, 5)
        
        print(f"✓ FAISS index created and searched")
        print(f"  Index size: {index.ntotal} vectors")
        print(f"  Top-5 indices: {indices[0]}")
        
        return True
    except Exception as e:
        print(f"✗ FAISS test failed: {e}")
        return False


def test_config():
    """Test configuration"""
    print("\nTesting configuration...")
    try:
        import config
        
        print(f"✓ Config loaded")
        print(f"  Embedding model: {config.EMBEDDING_MODEL}")
        print(f"  Chunk size: {config.CHUNK_SIZE}")
        print(f"  Top-K: {config.TOP_K_RESULTS}")
        print(f"  Domain: {config.DOMAIN}")
        
        return True
    except Exception as e:
        print(f"✗ Config test failed: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("="*70)
    print("AMAR Phase 1 - Component Tests")
    print("="*70)
    
    tests = [
        ("Imports", test_imports),
        ("Custom Modules", test_modules),
        ("Configuration", test_config),
        ("Document Chunker", test_chunker),
        ("Embeddings", test_embeddings),
        ("FAISS Index", test_faiss_index)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ {name} test crashed: {e}")
            results.append((name, False))
    
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! System is ready.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix issues.")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
