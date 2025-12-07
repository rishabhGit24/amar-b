"""
AMAR RAG Retriever Module - Integrated Version
Core functionality for document ingestion, embedding, indexing, and retrieval
Based on temp_amar_repo implementation with FAISS HNSW and reranking
"""
import os
import pickle
import uuid
from typing import List, Dict, Tuple, Optional
from datetime import datetime

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import tiktoken

# Configuration - Matching temp_amar_repo settings
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"  # 768-dim, higher quality
CHUNK_SIZE = 300  # Smaller chunks for better precision
CHUNK_OVERLAP = 100  # More overlap for context preservation
TOP_K_RESULTS = 10  # More candidates for reranking
SIMILARITY_THRESHOLD = 0.5  # Higher threshold for quality
HNSW_M = 64  # More connections = better accuracy
HNSW_EF_CONSTRUCTION = 400  # Higher = better index quality
HNSW_EF_SEARCH = 200  # Search-time parameter
USE_RERANKING = True  # Enable cross-encoder reranking


class DocumentChunker:
    """Handles text chunking and normalization"""
    
    def __init__(self, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
    
    def normalize_text(self, text: str) -> str:
        """Normalize text: remove extra whitespace, standardize line breaks"""
        text = " ".join(text.split())
        return text.strip()
    
    def chunk_text(self, text: str, doc_metadata: Dict) -> List[Dict]:
        """Chunk text into overlapping segments with metadata"""
        normalized = self.normalize_text(text)
        tokens = self.tokenizer.encode(normalized)
        
        chunks = []
        start_idx = 0
        
        while start_idx < len(tokens):
            end_idx = min(start_idx + self.chunk_size, len(tokens))
            chunk_tokens = tokens[start_idx:end_idx]
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            chunk_metadata = {
                "chunk_id": str(uuid.uuid4()),
                "doc_id": doc_metadata.get("doc_id"),
                "chunk_index": len(chunks),
                "text": chunk_text,
                "token_count": len(chunk_tokens),
                "start_char": start_idx,
                "end_char": end_idx,
                "source": doc_metadata.get("source"),
                "domain": doc_metadata.get("domain", "web_development")
            }
            chunks.append(chunk_metadata)
            
            start_idx += self.chunk_size - self.overlap
        
        return chunks


class FAISSRetriever:
    """FAISS-based vector retrieval with HNSW indexing and reranking"""
    
    def __init__(self, embedding_model: str = EMBEDDING_MODEL, use_hnsw: bool = True):
        import os
        import torch
        # Disable multiprocessing to avoid segmentation faults on macOS
        os.environ['TOKENIZERS_PARALLELISM'] = 'false'
        os.environ['OMP_NUM_THREADS'] = '1'
        os.environ['MKL_NUM_THREADS'] = '1'
        # Disable torch multiprocessing
        torch.set_num_threads(1)
        
        print(f"Loading embedding model: {embedding_model}")
        # Load model with single-threaded settings
        self.model = SentenceTransformer(
            embedding_model,
            device='cpu',
            model_kwargs={'dtype': 'float32'}
        )
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.use_hnsw = use_hnsw
        
        # Initialize FAISS index with HNSW
        if use_hnsw:
            self.index = faiss.IndexHNSWFlat(self.dimension, HNSW_M)
            self.index.hnsw.efConstruction = HNSW_EF_CONSTRUCTION
            self.index.hnsw.efSearch = HNSW_EF_SEARCH
            print(f"FAISS HNSW Index: M={HNSW_M}, efConstruction={HNSW_EF_CONSTRUCTION}, efSearch={HNSW_EF_SEARCH}")
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
        
        # Initialize reranker for higher precision
        if USE_RERANKING:
            try:
                from sentence_transformers import CrossEncoder
                self.reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
                print("Reranker loaded: cross-encoder/ms-marco-MiniLM-L-6-v2")
            except Exception as e:
                self.reranker = None
                print(f"Reranker not available, using embeddings only: {e}")
        else:
            self.reranker = None
        
        self.chunks = []  # Store chunk metadata
        self.doc_metadata = {}  # Store document metadata
    
    def embed_text(self, text: str) -> np.ndarray:
        """Generate embedding for text"""
        return self.model.encode(text, convert_to_numpy=True)
    
    def add_documents(self, chunks: List[Dict]) -> None:
        """Add document chunks to the index - processes one at a time to avoid multiprocessing crashes"""
        import os
        # Ensure multiprocessing is disabled
        os.environ['TOKENIZERS_PARALLELISM'] = 'false'
        
        # Process chunks one at a time to avoid segmentation faults on macOS
        for i, chunk in enumerate(chunks):
            try:
                text = chunk["text"]
                # Encode single text at a time with no multiprocessing
                embedding = self.model.encode(
                    text,
                    convert_to_numpy=True,
                    show_progress_bar=False,
                    batch_size=1,
                    device='cpu',
                    normalize_embeddings=False
                )
                
                # Reshape to 2D array
                embedding = embedding.reshape(1, -1).astype('float32')
                
                # Add to FAISS index
                self.index.add(embedding)
                
                # Store chunk metadata
                self.chunks.append(chunk)
                
                if (i + 1) % 10 == 0:
                    print(f"  Processed {i + 1}/{len(chunks)} chunks...")
                    
            except Exception as e:
                print(f"  Error processing chunk {i}: {e}")
                continue
        
        print(f"Added {len(chunks)} chunks. Total chunks: {len(self.chunks)}")
    
    def search(self, query: str, top_k: int = TOP_K_RESULTS) -> List[Tuple[Dict, float]]:
        """Search for relevant chunks with optional reranking"""
        if len(self.chunks) == 0:
            return []
        
        # Step 1: Initial retrieval with FAISS (get more candidates for reranking)
        initial_k = top_k * 3 if self.reranker else top_k
        query_embedding = self.embed_text(query).reshape(1, -1).astype('float32')
        
        distances, indices = self.index.search(query_embedding, min(initial_k, len(self.chunks)))
        
        # Step 2: Filter by similarity threshold
        candidates = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx >= 0 and idx < len(self.chunks):
                similarity = 1 / (1 + distance)  # Convert L2 distance to similarity
                if similarity >= SIMILARITY_THRESHOLD:
                    candidates.append((self.chunks[idx], similarity))
        
        # Step 3: Rerank with cross-encoder for higher precision
        if self.reranker and candidates:
            # Prepare pairs for reranking
            pairs = [(query, chunk['text']) for chunk, _ in candidates]
            
            # Get reranking scores
            rerank_scores = self.reranker.predict(pairs)
            
            # Combine with original scores (weighted average)
            results = []
            for i, (chunk, embed_score) in enumerate(candidates):
                rerank_score = float(rerank_scores[i])
                # Normalize rerank score to 0-1 range
                rerank_score_norm = (rerank_score + 10) / 20  # Typical range is -10 to 10
                # Weighted combination: 40% embedding, 60% reranking
                final_score = 0.4 * embed_score + 0.6 * rerank_score_norm
                results.append((chunk, final_score))
            
            # Sort by final score and take top_k
            results.sort(key=lambda x: x[1], reverse=True)
            return results[:top_k]
        
        return candidates[:top_k]
    
    def save_index(self, filepath: str = "faiss_index.pkl") -> None:
        """Save FAISS index and metadata"""
        faiss.write_index(self.index, f"{filepath}.index")
        
        with open(filepath, "wb") as f:
            pickle.dump({
                "chunks": self.chunks,
                "doc_metadata": self.doc_metadata,
                "dimension": self.dimension
            }, f)
        
        print(f"Index saved to {filepath}")
    
    def load_index(self, filepath: str = "faiss_index.pkl") -> None:
        """Load FAISS index and metadata"""
        import os
        
        index_file = f"{filepath}.index"
        if not os.path.exists(index_file):
            raise FileNotFoundError(f"FAISS index file not found: {index_file}")
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Metadata file not found: {filepath}")
        
        self.index = faiss.read_index(index_file)
        
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.chunks = data["chunks"]
            self.doc_metadata = data["doc_metadata"]
            self.dimension = data["dimension"]
        
        print(f"Index loaded from {filepath}. Total chunks: {len(self.chunks)}")


class RAGPipeline:
    """Complete RAG pipeline with retrieval and generation"""
    
    def __init__(self, llm_type: Optional[str] = None):
        """
        Initialize RAG pipeline.
        
        Args:
            llm_type: Optional LLM type (not used in backend, kept for compatibility)
        """
        self.chunker = DocumentChunker()
        self.retriever = FAISSRetriever()
        self.llm_type = llm_type
    
    def ingest_document(self, text: str, metadata: Dict) -> None:
        """Ingest a document: chunk, embed, and index"""
        if "doc_id" not in metadata:
            metadata["doc_id"] = str(uuid.uuid4())
        
        metadata["created_at"] = datetime.now().isoformat()
        
        chunks = self.chunker.chunk_text(text, metadata)
        self.retriever.add_documents(chunks)
        self.retriever.doc_metadata[metadata["doc_id"]] = metadata
    
    def retrieve(self, query: str, top_k: int = TOP_K_RESULTS) -> List[Tuple[Dict, float]]:
        """Retrieve relevant chunks for a query"""
        return self.retriever.search(query, top_k)
    
    def enrich_query(self, query: str, top_k: int = 5) -> str:
        """Enrich user query with RAG context"""
        retrieved = self.retrieve(query, top_k=top_k)
        
        if not retrieved:
            return query
        
        # Build context from top chunks
        context = "\n\n".join([
            f"[Relevant Context - Score: {score:.2f}]\n{chunk['text']}"
            for chunk, score in retrieved[:3]  # Top 3 most relevant
        ])
        
        # Create enriched query
        enriched = f"""Based on the following relevant documentation:

{context}

User Request: {query}

Please use the above context to inform your planning and implementation."""

        return enriched
    
    def save(self, filepath: str = "rag_pipeline.pkl") -> None:
        """Save the entire pipeline"""
        self.retriever.save_index(filepath)
    
    def load(self, filepath: str = "rag_pipeline.pkl") -> None:
        """Load the entire pipeline"""
        self.retriever.load_index(filepath)
