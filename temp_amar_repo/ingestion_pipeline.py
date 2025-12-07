"""
Document Ingestion Pipeline
Handles loading documents from various sources (PDF, TXT, MD, HTML)
"""
import os
from typing import List, Dict, Tuple
from pathlib import Path

try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None


class DocumentLoader:
    """Load documents from various file formats"""
    
    @staticmethod
    def load_txt(filepath: str) -> str:
        """Load plain text file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    
    @staticmethod
    def load_pdf(filepath: str) -> str:
        """Load PDF file"""
        if PdfReader is None:
            raise ImportError("PyPDF2 not installed. Run: pip install PyPDF2")
        
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    
    @staticmethod
    def load_markdown(filepath: str) -> str:
        """Load Markdown file"""
        return DocumentLoader.load_txt(filepath)
    
    @staticmethod
    def load_document(filepath: str) -> Tuple[str, Dict]:
        """Load document and extract metadata"""
        path = Path(filepath)
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")
        
        # Determine file type and load
        ext = path.suffix.lower()
        if ext == '.pdf':
            text = DocumentLoader.load_pdf(filepath)
        elif ext in ['.txt', '.md', '.markdown']:
            text = DocumentLoader.load_txt(filepath)
        else:
            text = DocumentLoader.load_txt(filepath)
        
        # Extract metadata
        metadata = {
            "title": path.stem,
            "source": str(path),
            "doc_type": ext[1:],
            "domain": "web_development"
        }
        
        return text, metadata


class IngestionPipeline:
    """Batch document ingestion"""
    
    def __init__(self, rag_pipeline):
        self.rag_pipeline = rag_pipeline
        self.loader = DocumentLoader()
    
    def ingest_file(self, filepath: str, metadata_override: Dict = None) -> None:
        """Ingest a single file"""
        text, metadata = self.loader.load_document(filepath)
        
        if metadata_override:
            metadata.update(metadata_override)
        
        self.rag_pipeline.ingest_document(text, metadata)
        print(f"Ingested: {filepath}")
    
    def ingest_directory(self, directory: str, pattern: str = "*.txt") -> None:
        """Ingest all files matching pattern in directory"""
        path = Path(directory)
        files = list(path.glob(pattern))
        
        print(f"Found {len(files)} files to ingest")
        
        for file in files:
            try:
                self.ingest_file(str(file))
            except Exception as e:
                print(f"Error ingesting {file}: {e}")
    
    def ingest_sample_docs(self) -> None:
        """Ingest sample web development documentation"""
        sample_docs = [
            {
                "text": """
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
                
                Good Example (Python with SQLite):
                cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
                
                This prevents SQL injection attacks by treating user input as data, not executable code.
                """,
                "metadata": {
                    "title": "SQL Injection Prevention",
                    "source": "security_best_practices.txt",
                    "domain": "web_development",
                    "tags": ["security", "sql", "backend"]
                }
            },
            {
                "text": """
                Modern Web Stack Migration Guide
                
                Migrating from Legacy Stack to Modern Framework:
                
                1. Assessment Phase:
                   - Analyze current codebase
                   - Identify dependencies
                   - Map routes and endpoints
                
                2. Choose Target Stack:
                   - Frontend: React, Vue, or Angular
                   - Backend: Node.js (Express), Python (FastAPI), or Go
                   - Database: PostgreSQL, MongoDB, or MySQL
                
                3. Migration Strategy:
                   - Incremental migration (recommended)
                   - Big bang migration (risky)
                   - Strangler pattern (gradual replacement)
                
                4. Testing:
                   - Unit tests for each component
                   - Integration tests for APIs
                   - End-to-end tests for critical flows
                """,
                "metadata": {
                    "title": "Web Stack Migration",
                    "source": "migration_guide.txt",
                    "domain": "web_development",
                    "tags": ["migration", "modernization", "full_stack"]
                }
            },
            {
                "text": """
                Microservices Architecture Patterns
                
                Migrating Monolith to Microservices:
                
                Step 1: Identify Bounded Contexts
                - User management
                - Authentication/Authorization
                - Business logic domains
                - Data access layers
                
                Step 2: Extract Services Incrementally
                - Start with least coupled modules
                - Create API contracts
                - Implement service communication (REST, gRPC, message queues)
                
                Step 3: Database Per Service
                - Separate databases for each microservice
                - Use event sourcing for data consistency
                - Implement saga pattern for distributed transactions
                
                Step 4: Infrastructure
                - Containerization (Docker)
                - Orchestration (Kubernetes)
                - Service mesh (Istio, Linkerd)
                - API Gateway (Kong, Ambassador)
                
                Best Practices:
                - Start small, iterate
                - Monitor everything
                - Implement circuit breakers
                - Use distributed tracing
                """,
                "metadata": {
                    "title": "Microservices Migration",
                    "source": "microservices_guide.txt",
                    "domain": "web_development",
                    "tags": ["microservices", "architecture", "migration"]
                }
            }
        ]
        
        for doc in sample_docs:
            self.rag_pipeline.ingest_document(doc["text"], doc["metadata"])
        
        print(f"Ingested {len(sample_docs)} sample documents")
