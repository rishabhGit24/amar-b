"""
Test High Relevance (95%+ target) with upgraded system
"""
from rag_retriever import DocumentChunker, FAISSRetriever
import numpy as np

print("="*70)
print("AMAR Phase 1 - High Relevance Test (95%+ Target)")
print("="*70)

# Initialize with upgraded components
print("\n[1/4] Initializing upgraded retriever...")
print("  - Better embedding model: all-mpnet-base-v2 (768-dim)")
print("  - HNSW indexing: M=64, efConstruction=400")
print("  - Cross-encoder reranking enabled")
retriever = FAISSRetriever()
chunker = DocumentChunker(chunk_size=300, overlap=100)

# Add comprehensive sample documents
print("\n[2/4] Adding comprehensive sample documents...")

documents = [
    {
        "text": """
        SQL Injection Prevention in Node.js
        
        SQL injection is a critical security vulnerability. Here's how to prevent it:
        
        WRONG WAY (Vulnerable):
        const query = "SELECT * FROM users WHERE id = '" + userId + "'";
        connection.query(query);
        
        RIGHT WAY (Secure):
        const query = "SELECT * FROM users WHERE id = ?";
        connection.query(query, [userId], (error, results) => {
            if (error) throw error;
            console.log(results);
        });
        
        Key Points:
        1. Always use parameterized queries (prepared statements)
        2. Never concatenate user input into SQL strings
        3. Use placeholders (?) for all dynamic values
        4. The database driver handles escaping automatically
        5. Works with MySQL, PostgreSQL, SQLite, etc.
        
        Additional Security:
        - Validate and sanitize all user inputs
        - Use ORM libraries (Sequelize, TypeORM) which use parameterized queries by default
        - Implement input validation with libraries like Joi or Yup
        - Use least privilege principle for database users
        - Enable query logging for security audits
        """,
        "metadata": {
            "doc_id": "sql-injection-nodejs",
            "title": "SQL Injection Prevention in Node.js",
            "source": "security_best_practices.md",
            "domain": "web_development",
            "tags": ["security", "sql", "nodejs", "backend"]
        }
    },
    {
        "text": """
        Microservices Migration Strategy
        
        Migrating from Monolith to Microservices: A Step-by-Step Guide
        
        Phase 1: Assessment
        - Analyze current monolithic architecture
        - Identify bounded contexts and domain boundaries
        - Map dependencies between components
        - Assess team readiness and skills
        
        Phase 2: Planning
        - Choose microservices that are least coupled
        - Define service boundaries using Domain-Driven Design
        - Plan API contracts and communication protocols
        - Design data management strategy (database per service)
        
        Phase 3: Implementation
        - Start with a pilot microservice (low risk)
        - Implement API Gateway for routing
        - Set up service discovery (Consul, Eureka)
        - Implement circuit breakers (Hystrix, Resilience4j)
        - Use message queues for async communication (RabbitMQ, Kafka)
        
        Phase 4: Data Migration
        - Separate databases for each microservice
        - Use event sourcing for data consistency
        - Implement saga pattern for distributed transactions
        - Plan for eventual consistency
        
        Phase 5: Deployment
        - Containerize services with Docker
        - Orchestrate with Kubernetes
        - Implement CI/CD pipelines
        - Set up monitoring and logging (ELK, Prometheus, Grafana)
        
        Best Practices:
        - Start small and iterate
        - Maintain backward compatibility
        - Implement comprehensive testing
        - Use distributed tracing
        - Plan for failure scenarios
        """,
        "metadata": {
            "doc_id": "microservices-migration",
            "title": "Microservices Migration Strategy",
            "source": "architecture_guide.md",
            "domain": "web_development",
            "tags": ["microservices", "architecture", "migration"]
        }
    },
    {
        "text": """
        Web Application Security Checklist
        
        Authentication & Authorization:
        - Use bcrypt or Argon2 for password hashing
        - Implement JWT tokens with proper expiration
        - Use OAuth2 for third-party authentication
        - Implement rate limiting on login endpoints
        - Use HTTPS everywhere
        
        Input Validation:
        - Validate all user inputs on server-side
        - Use parameterized queries to prevent SQL injection
        - Sanitize HTML to prevent XSS attacks
        - Implement CSRF tokens for state-changing operations
        - Validate file uploads (type, size, content)
        
        API Security:
        - Use API keys or OAuth tokens
        - Implement rate limiting
        - Validate request origins (CORS)
        - Use API versioning
        - Log all API access
        
        Data Protection:
        - Encrypt sensitive data at rest
        - Use TLS 1.3 for data in transit
        - Implement proper session management
        - Set secure cookie flags (HttpOnly, Secure, SameSite)
        - Regular security audits and penetration testing
        """,
        "metadata": {
            "doc_id": "security-checklist",
            "title": "Web Application Security Checklist",
            "source": "security_guide.md",
            "domain": "web_development",
            "tags": ["security", "checklist", "best-practices"]
        }
    }
]

total_chunks = 0
for doc in documents:
    chunks = chunker.chunk_text(doc["text"], doc["metadata"])
    retriever.add_documents(chunks)
    total_chunks += len(chunks)
    print(f"  ✓ {doc['metadata']['title']}: {len(chunks)} chunks")

print(f"\nTotal indexed: {total_chunks} chunks")

# Test queries with expected high relevance
print("\n[3/4] Testing queries for 95%+ relevance...")

test_cases = [
    {
        "query": "How to prevent SQL injection in Node.js?",
        "expected_keywords": ["parameterized", "query", "placeholder", "?", "userId"],
        "expected_doc": "sql-injection-nodejs"
    },
    {
        "query": "What are the steps to migrate from monolith to microservices?",
        "expected_keywords": ["assessment", "bounded contexts", "api gateway", "docker", "kubernetes"],
        "expected_doc": "microservices-migration"
    },
    {
        "query": "How do I use parameterized queries to prevent SQL injection?",
        "expected_keywords": ["parameterized", "prepared statements", "placeholder", "concatenate"],
        "expected_doc": "sql-injection-nodejs"
    },
    {
        "query": "Best practices for microservices data management",
        "expected_keywords": ["database per service", "event sourcing", "saga pattern", "eventual consistency"],
        "expected_doc": "microservices-migration"
    }
]

results_summary = []

for i, test in enumerate(test_cases, 1):
    print(f"\n{'='*70}")
    print(f"Test {i}: {test['query']}")
    print(f"{'='*70}")
    
    results = retriever.search(test['query'], top_k=3)
    
    if results:
        top_chunk, top_score = results[0]
        
        # Check if correct document
        correct_doc = top_chunk.get('doc_id') == test['expected_doc']
        
        # Check keyword presence
        text_lower = top_chunk['text'].lower()
        keywords_found = sum(1 for kw in test['expected_keywords'] if kw.lower() in text_lower)
        keyword_score = keywords_found / len(test['expected_keywords'])
        
        # Combined relevance score
        relevance = (top_score * 0.7) + (keyword_score * 0.3)
        
        print(f"✓ Top Result:")
        print(f"  Similarity Score: {top_score:.2%}")
        print(f"  Keywords Found: {keywords_found}/{len(test['expected_keywords'])} ({keyword_score:.2%})")
        print(f"  Combined Relevance: {relevance:.2%}")
        print(f"  Correct Document: {'✓ YES' if correct_doc else '✗ NO'}")
        print(f"  Source: {top_chunk.get('source', 'unknown')}")
        
        results_summary.append({
            "query": test['query'],
            "relevance": relevance,
            "correct_doc": correct_doc
        })
    else:
        print("✗ No results found")
        results_summary.append({
            "query": test['query'],
            "relevance": 0.0,
            "correct_doc": False
        })

# Calculate overall metrics
print(f"\n{'='*70}")
print("[4/4] FINAL RESULTS")
print(f"{'='*70}")

avg_relevance = np.mean([r['relevance'] for r in results_summary])
correct_docs = sum(1 for r in results_summary if r['correct_doc'])
accuracy = correct_docs / len(results_summary)

print(f"\nOverall Metrics:")
print(f"  Average Relevance: {avg_relevance:.2%}")
print(f"  Document Accuracy: {accuracy:.2%} ({correct_docs}/{len(results_summary)})")
print(f"  Target: 95%+")

if avg_relevance >= 0.95:
    print(f"\n🎉 SUCCESS! Achieved {avg_relevance:.2%} relevance (target: 95%+)")
    print("✓ System ready for production")
elif avg_relevance >= 0.90:
    print(f"\n✓ GOOD! Achieved {avg_relevance:.2%} relevance")
    print("  Close to target, minor tuning needed")
elif avg_relevance >= 0.80:
    print(f"\n⚠ ACCEPTABLE: {avg_relevance:.2%} relevance")
    print("  Needs improvement to reach 95% target")
else:
    print(f"\n✗ NEEDS WORK: {avg_relevance:.2%} relevance")
    print("  Significant improvements needed")

print(f"\n{'='*70}")
print("Improvements Applied:")
print("  ✓ Better embedding model (768-dim vs 384-dim)")
print("  ✓ HNSW indexing (M=64, efConstruction=400)")
print("  ✓ Cross-encoder reranking")
print("  ✓ Optimized chunking (300 tokens, 100 overlap)")
print("  ✓ Higher similarity threshold (0.5)")
print(f"{'='*70}")
