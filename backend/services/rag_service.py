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
            knowledge_base_path: Path to the knowledge base
        """
        self.knowledge_base_path = knowledge_base_path or "amar_knowledge_base.pkl"
        self.is_enabled = False
        self.rag_pipeline = None
        
        # Try to load RAG pipeline
        try:
            import os
            if os.path.exists(self.knowledge_base_path):
                from services.rag_retriever import RAGPipeline
                self.rag_pipeline = RAGPipeline()
                self.rag_pipeline.load(self.knowledge_base_path)
                self.is_enabled = True
                logger.info(f"RAG Service initialized with {len(self.rag_pipeline.retriever.chunks)} chunks")
            else:
                logger.info(f"RAG Service: No index found at {self.knowledge_base_path}")
        except Exception as e:
            logger.error(f"RAG Service initialization failed: {e}")
        
        if not self.is_enabled:
            logger.info("RAG Service initialized (enabled: False)")
    
    async def retrieve_context(
        self,
        user_query: str,
        top_k: int = 5,
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
        Enrich user query with retrieved context.
        
        Args:
            original_query: Original user input
            retrieved_docs: Retrieved documents from knowledge base
            
        Returns:
            Enriched query string
        """
        if not retrieved_docs:
            return original_query
        
        # Format retrieved context
        context_parts = []
        for i, doc in enumerate(retrieved_docs, 1):
            context_parts.append(f"[Context {i}]: {doc.get('content', '')}")
        
        context_str = "\n".join(context_parts)
        
        # Combine original query with context
        enriched = f"""User Request: {original_query}

Relevant Context from Knowledge Base:
{context_str}

Please use the above context to better understand the user's requirements and generate an appropriate application plan."""
        
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
            knowledge_base_path: Path to the knowledge base
        """
        self.knowledge_base_path = knowledge_base_path
        self.is_enabled = True
        logger.info(f"RAG-FAISS enabled with knowledge base: {knowledge_base_path}")
    
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
