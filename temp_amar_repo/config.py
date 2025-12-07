"""
AMAR Phase 1 Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Model Configuration - UPGRADED FOR 95%+ RELEVANCE
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"  # Better model (768-dim, higher quality)
LLM_MODEL = "gemini-2.5-flash"  # Stable model with better quota

# Chunking Configuration - OPTIMIZED
CHUNK_SIZE = 300  # Smaller chunks for better precision
CHUNK_OVERLAP = 100  # More overlap for context preservation

# Retrieval Configuration - TUNED FOR HIGH RELEVANCE
TOP_K_RESULTS = 10  # More candidates for reranking
SIMILARITY_THRESHOLD = 0.5  # Higher threshold for quality
USE_RERANKING = True  # Enable cross-encoder reranking

# FAISS Configuration - HNSW FOR SPEED + ACCURACY
FAISS_INDEX_TYPE = "IndexHNSWFlat"  # HNSW for better recall
HNSW_M = 64  # More connections = better accuracy
HNSW_EF_CONSTRUCTION = 400  # Higher = better index quality
HNSW_EF_SEARCH = 200  # Search-time parameter

# Pinecone Configuration (optional)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_ENV = os.getenv("PINECONE_ENV", "")
PINECONE_INDEX_NAME = "amar-web-dev"

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Domain Focus
DOMAIN = "web_development"
SUPPORTED_DOMAINS = ["web_development", "full_stack"]

# Evaluation Metrics
TARGET_RELEVANCE = 0.80  # 80% relevance target
