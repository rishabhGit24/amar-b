"""
AMAR RAG Retriever Module - Integrated Version
Core functionality for document ingestion, embedding, indexing, and retrieval
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

# Configuration
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 100
TOP_K_RESULTS = 10
SIMILARITY_THRESHOLD = 0.5
HNSW_M = 64
HNSW_EF_CONSTRUCTION = 400
HNSW_EF_SEARCH = 200
USE_RERANKING = True


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
        print(f"Loading embedding model: {embedding_model}")
        self.model = SentenceTransformer(embedding_model)
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.use_hnsw = use_hnsw
        
        # Initialize FAISS index with HNSW
        if use_hnsw:
            self.index = faiss.IndexHNSWFlat(self.dimension, HNSW_M)
            self.index.hnsw.efConstruction = HNSW_EF_CONSTRUCTION
            self.index.hnsw.efSearch = HNSW_EF_SEARCH
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
        
        # Initialize reranker for higher precision
        if USE_RERANKING:
            try:
                from sentence_transformers import CrossEncoder
                self.reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
            except:
                self.reranker = None
        else:
            self.reranker = None
        
        self.chunks = []
        self.doc_metadata = {}
    
    def embed_text(self, text: str) -> np.ndarray:
        """Generate embedding for text"""
        return self.model.encode(text, convert_to_numpy=True)
    
    def add_documents(self, chunks: List[Dict]) -> None:
        """Add document chunks to the index"""
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
        
        self.index.add(embeddings.astype('float32'))
        self.chunks.extend(chunks)
    
    def search(self, query: str, top_k: int = TOP_K_RESULTS) -> List[Tuple[Dict, float]]:
        """Search for relevant chunks with optional reranking"""
        initial_k = top_k * 3 if self.reranker else top_k
        query_embedding = self.embed_text(query).reshape(1, -1).astype('float32')
        
        distances, indices = self.index.search(query_embedding, min(initial_k, len(self.chunks)))
        
        candidates = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx >= 0 and idx < len(self.chunks):
                similarity = 1 / (1 + distance)
                if similarity >= SIMILARITY_THRESHOLD:
                    candidates.append((self.chunks[idx], similarity))
        
        if self.reranker and candidates:
            pairs = [(query, chunk['text']) for chunk, _ in candidates]
            rerank_scores = self.reranker.predict(pairs)
            
            results = []
            for i, (chunk, embed_score) in enumerate(candidates):
                rerank_score = float(rerank_scores[i])
                rerank_score_norm = (rerank_score + 10) / 20
                final_score = 0.4 * embed_score + 0.6 * rerank_score_norm
                results.append((chunk, final_score))
            
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
    
    def load_index(self, filepath: str = "faiss_index.pkl") -> None:
        """Load FAISS index and metadata"""
        self.index = faiss.read_index(f"{filepath}.index")
        
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.chunks = data["chunks"]
            self.doc_metadata = data["doc_metadata"]
            self.dimension = data["dimension"]


class RAGPipeline:
    """Complete RAG pipeline with retrieval"""
    
    def __init__(self):
        self.chunker = DocumentChunker()
        self.retriever = FAISSRetriever()
    
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
    
    def enrich_query(self, query: str) -> str:
        """Enrich user query with RAG context"""
        retrieved = self.retrieve(query, top_k=5)
        
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
