"""
RAG-FAISS Service for Knowledge Base Retrieval
This service provides an integration point for the RAG-FAISS system
that retrieves relevant context from the knowledge base before passing
user input to the LangGraph workflow.

Currently uses a placeholder implementation that can be replaced with
the actual RAG-FAISS system once it's developed.

Validates: Requirements 11.1, 11.2, 11.3
"""

from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)


class RAGService:
    """
    Service for retrieving relevant context from knowledge base using RAG-FAISS.
    
    This is a placeholder implementation that can be replaced with the actual
    RAG-FAISS system. The interface is designed to be plug-and-play.
    """
    
    def __init__(self, knowledge_base_path: Optional[str] = None):
        """
        Initialize RAG service.
        
        Args:
            knowledge_base_path: Path to the knowledge base (without .index extension)
        """
        import os
        from pathlib import Path
        
        # Default to backend directory
        if knowledge_base_path is None:
            backend_dir = Path(__file__).parent.parent
            self.knowledge_base_path = str(backend_dir / "amar_knowledge_base.pkl")
        else:
            self.knowledge_base_path = knowledge_base_path
        
        self.is_enabled = False
        self.rag_pipeline = None
        
        # Try to load RAG pipeline
        try:
            index_file = f"{self.knowledge_base_path}.index"
            if os.path.exists(self.knowledge_base_path) and os.path.exists(index_file):
                from services.rag_retriever import RAGPipeline
                self.rag_pipeline = RAGPipeline()
                self.rag_pipeline.load(self.knowledge_base_path)
                self.is_enabled = True
                logger.info(f"RAG Service initialized with {len(self.rag_pipeline.retriever.chunks)} chunks")
            else:
                logger.info(f"RAG Service: No index found at {self.knowledge_base_path} (or {index_file})")
        except Exception as e:
            logger.error(f"RAG Service initialization failed: {e}", exc_info=True)
        
        if not self.is_enabled:
            logger.info("RAG Service initialized (enabled: False)")
    
    async def retrieve_context(
        self,
        user_query: str,
        top_k: int = 3,  # Reduced from 5 to 3 to limit context size
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Retrieve relevant context from knowledge base for user query.
        
        This method will be called before passing user input to LangGraph workflow.
        It enriches the user query with relevant context from the knowledge base.
        
        Args:
            user_query: The user's application description
            top_k: Number of top relevant documents to retrieve
            filters: Optional filters for retrieval (e.g., domain, technology)
            
        Returns:
            Dictionary containing:
                - enriched_query: Original query + retrieved context
                - retrieved_docs: List of retrieved document snippets
                - metadata: Metadata about retrieval (scores, sources, etc.)
        """
        if not self.is_enabled or not self.rag_pipeline:
            logger.info("RAG-FAISS not enabled, passing through original query")
            return {
                "enriched_query": user_query,
                "retrieved_docs": [],
                "metadata": {
                    "rag_enabled": False,
                    "message": "RAG-FAISS not available"
                }
            }
        
        try:
            logger.info(f"Retrieving context for query: {user_query[:100]}...")
            
            # Use RAG pipeline to retrieve relevant context
            retrieved = self.rag_pipeline.retrieve(user_query, top_k=top_k)
            
            # Format retrieved docs
            retrieved_docs = [
                {
                    "content": chunk["text"],
                    "source": chunk.get("source", "unknown"),
                    "relevance": float(score),
                    "category": chunk.get("category", "unknown")
                }
                for chunk, score in retrieved
            ]
            
            # Enrich query with retrieved context
            enriched_query = self._enrich_query(user_query, retrieved_docs)
            
            return {
                "enriched_query": enriched_query,
                "retrieved_docs": retrieved_docs,
                "metadata": {
                    "rag_enabled": True,
                    "num_docs_retrieved": len(retrieved_docs),
                    "top_k": top_k,
                    "filters": filters
                }
            }
            
        except Exception as e:
            logger.error(f"Error in RAG retrieval: {str(e)}")
            # Fallback to original query on error
            return {
                "enriched_query": user_query,
                "retrieved_docs": [],
                "metadata": {
                    "rag_enabled": False,
                    "error": str(e)
                }
            }
    
    def _enrich_query(self, original_query: str, retrieved_docs: List[Dict]) -> str:
        """
        Enrich user query with retrieved context - optimized to reduce token usage.
        
        Args:
            original_query: Original user input
            retrieved_docs: Retrieved documents from knowledge base
            
        Returns:
            Enriched query string
        """
        if not retrieved_docs:
            return original_query
        
        # Limit to top 2 most relevant chunks and truncate long content
        MAX_CHUNK_LENGTH = 500  # Limit each chunk to ~500 chars
        MAX_CHUNKS = 2  # Only use top 2 most relevant
        
        context_parts = []
        for i, doc in enumerate(retrieved_docs[:MAX_CHUNKS], 1):
            content = doc.get('content', '')
            # Truncate if too long
            if len(content) > MAX_CHUNK_LENGTH:
                content = content[:MAX_CHUNK_LENGTH] + "..."
            relevance = doc.get('relevance', 0.0)
            context_parts.append(f"[Context {i} - Relevance: {relevance:.2f}]: {content}")
        
        context_str = "\n".join(context_parts)
        
        # Shorter, more concise enriched query
        enriched = f"""User Request: {original_query}

Relevant Context:
{context_str}

Use this context to inform your planning."""
        
        return enriched
    
    async def _search_faiss_index(
        self,
        query: str,
        top_k: int,
        filters: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Search FAISS index for relevant documents.
        
        TODO: Implement actual FAISS search logic here.
        This is the main integration point for your friend's RAG-FAISS system.
        
        Args:
            query: Search query
            top_k: Number of results to return
            filters: Optional filters
            
        Returns:
            List of retrieved documents with metadata
        """
        # Placeholder - will be replaced with actual FAISS search
        return []
    
    def enable_rag(self, knowledge_base_path: str):
        """
        Enable RAG-FAISS system with specified knowledge base.
        
        Call this method once the RAG-FAISS system is ready to be integrated.
        
        Args:
            knowledge_base_path: Path to the knowledge base (without .index extension)
        """
        import os
        self.knowledge_base_path = knowledge_base_path
        
        # Try to load the index
        try:
            index_file = f"{knowledge_base_path}.index"
            if os.path.exists(knowledge_base_path) and os.path.exists(index_file):
                from services.rag_retriever import RAGPipeline
                if self.rag_pipeline is None:
                    self.rag_pipeline = RAGPipeline()
                self.rag_pipeline.load(knowledge_base_path)
                self.is_enabled = True
                logger.info(f"RAG-FAISS enabled with {len(self.rag_pipeline.retriever.chunks)} chunks from: {knowledge_base_path}")
            else:
                logger.warning(f"RAG-FAISS index not found at {knowledge_base_path} or {index_file}")
                self.is_enabled = False
        except Exception as e:
            logger.error(f"Failed to enable RAG-FAISS: {e}", exc_info=True)
            self.is_enabled = False
    
    def disable_rag(self):
        """Disable RAG-FAISS system (fallback to direct query processing)"""
        self.is_enabled = False
        logger.info("RAG-FAISS disabled")


# Global RAG service instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    """
    Get or create global RAG service instance.
    
    Returns:
        RAGService instance
    """
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


def initialize_rag_service(knowledge_base_path: Optional[str] = None, enabled: bool = False):
    """
    Initialize RAG service with configuration.
    
    Args:
        knowledge_base_path: Path to knowledge base
        enabled: Whether to enable RAG immediately
    """
    global _rag_service
    _rag_service = RAGService(knowledge_base_path)
    if enabled:
        _rag_service.enable_rag(knowledge_base_path)
