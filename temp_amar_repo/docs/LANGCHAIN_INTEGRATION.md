# AMAR Phase 1 → Langchain Integration Guide

## For Rishab: Integrating AMAR with Langchain

This guide explains how to integrate the AMAR Phase 1 RAG pipeline with Langchain for enhanced agent capabilities.

## Overview

AMAR Phase 1 provides:
- Pre-indexed web development documentation
- FAISS vector store with HNSW indexing
- 384-dimensional embeddings (SentenceTransformer)
- Retrieval pipeline with source attribution

Langchain will add:
- Agent orchestration
- Tool integration
- Memory management
- Chain composition

## Export Format

AMAR exports data in this format:

```json
{
  "total_chunks": 150,
  "embedding_dimension": 384,
  "index_type": "HNSW",
  "sample_chunks": [
    {
      "chunk_id": "uuid",
      "text": "chunk content",
      "source": "file.txt",
      "domain": "web_development"
    }
  ],
  "evaluation_results": {
    "average_relevance": 0.85,
    "target_met": true
  }
}
```

## Integration Steps

### Step 1: Load AMAR Pipeline

```python
from rag_retriever import RAGPipeline

# Load pre-trained AMAR pipeline
amar = RAGPipeline(llm_type="gemini")
amar.load("amar_rag_pipeline.pkl")
```

### Step 2: Create Langchain Retriever

```python
from langchain.schema import Document
from langchain.vectorstores import FAISS as LangchainFAISS
from langchain.embeddings import HuggingFaceEmbeddings

# Use same embedding model as AMAR
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Convert AMAR chunks to Langchain documents
documents = [
    Document(
        page_content=chunk["text"],
        metadata={
            "source": chunk.get("source", "unknown"),
            "chunk_id": chunk["chunk_id"],
            "domain": chunk.get("domain", "web_development")
        }
    )
    for chunk in amar.retriever.chunks
]

# Create Langchain FAISS store
vectorstore = LangchainFAISS.from_documents(
    documents=documents,
    embedding=embeddings
)
```

### Step 3: Create Retriever Tool

```python
from langchain.tools import Tool
from langchain.chains import RetrievalQA
from langchain.llms import GoogleGenerativeAI

# Create LLM
llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp")

# Create retrieval chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
)

# Create tool
amar_tool = Tool(
    name="AMAR_WebDev_Knowledge",
    func=qa_chain.run,
    description="Useful for answering questions about web development, "
                "security best practices, migration strategies, and "
                "full-stack development. Input should be a question."
)
```

### Step 4: Create Agent with AMAR Tool

```python
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory

# Initialize memory
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# Create agent with AMAR tool
tools = [amar_tool]  # Add more tools as needed

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Use the agent
response = agent.run("How do I prevent SQL injection in Node.js?")
print(response)
```

### Step 5: Advanced - Custom Retriever

```python
from langchain.schema import BaseRetriever
from typing import List

class AMARRetriever(BaseRetriever):
    """Custom retriever that uses AMAR's native retrieval"""
    
    def __init__(self, amar_pipeline):
        self.amar = amar_pipeline
    
    def get_relevant_documents(self, query: str) -> List[Document]:
        # Use AMAR's native retrieval
        results = self.amar.retrieve(query, top_k=5)
        
        # Convert to Langchain documents
        documents = [
            Document(
                page_content=chunk["text"],
                metadata={
                    "source": chunk.get("source", "unknown"),
                    "relevance": float(score)
                }
            )
            for chunk, score in results
        ]
        
        return documents
    
    async def aget_relevant_documents(self, query: str) -> List[Document]:
        return self.get_relevant_documents(query)

# Use custom retriever
amar_retriever = AMARRetriever(amar)
```

## Multi-Agent Architecture

### Agent 1: Code Analyzer
```python
code_analyzer = Tool(
    name="Code_Analyzer",
    func=lambda x: amar.query(f"Analyze this code for issues: {x}"),
    description="Analyzes code for security vulnerabilities and best practices"
)
```

### Agent 2: Migration Planner
```python
migration_planner = Tool(
    name="Migration_Planner",
    func=lambda x: amar.query(f"Create migration plan for: {x}"),
    description="Creates step-by-step migration plans for legacy applications"
)
```

### Agent 3: Test Generator
```python
test_generator = Tool(
    name="Test_Generator",
    func=lambda x: amar.query(f"Generate tests for: {x}"),
    description="Generates unit and integration tests"
)
```

### Orchestrator Agent
```python
tools = [code_analyzer, migration_planner, test_generator, amar_tool]

orchestrator = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Complex task
task = """
Analyze the SQL injection vulnerability in src/db/user.js,
create a fix, generate tests, and provide a migration plan.
"""

result = orchestrator.run(task)
```

## Chain Composition

### Sequential Chain
```python
from langchain.chains import SequentialChain, LLMChain
from langchain.prompts import PromptTemplate

# Chain 1: Retrieve context
retrieve_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["query"],
        template="Retrieve relevant information about: {query}"
    )
)

# Chain 2: Analyze
analyze_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["context"],
        template="Analyze this information: {context}"
    )
)

# Chain 3: Generate solution
solution_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["analysis"],
        template="Generate solution based on: {analysis}"
    )
)

# Combine
full_chain = SequentialChain(
    chains=[retrieve_chain, analyze_chain, solution_chain],
    input_variables=["query"],
    verbose=True
)
```

## Memory Integration

### Conversation Memory
```python
from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(
    k=5,  # Keep last 5 interactions
    memory_key="chat_history",
    return_messages=True
)
```

### Vector Store Memory
```python
from langchain.memory import VectorStoreRetrieverMemory

# Use AMAR's vector store for memory
memory = VectorStoreRetrieverMemory(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3})
)
```

## Production Deployment

### FastAPI Integration
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/query")
async def query_amar(query: Query):
    result = agent.run(query.question)
    return {"answer": result}

@app.get("/health")
async def health():
    return {"status": "healthy", "chunks": len(amar.retriever.chunks)}
```

### Async Support
```python
from langchain.callbacks import AsyncCallbackHandler

class StreamingHandler(AsyncCallbackHandler):
    async def on_llm_new_token(self, token: str, **kwargs):
        print(token, end="", flush=True)

# Use with agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    callbacks=[StreamingHandler()],
    verbose=True
)
```

## Testing Integration

```python
def test_amar_langchain_integration():
    # Load AMAR
    amar = RAGPipeline(llm_type="gemini")
    amar.load("amar_rag_pipeline.pkl")
    
    # Create retriever
    amar_retriever = AMARRetriever(amar)
    
    # Test retrieval
    docs = amar_retriever.get_relevant_documents(
        "How to prevent SQL injection?"
    )
    
    assert len(docs) > 0
    assert "parameterized" in docs[0].page_content.lower()
    
    print("✓ Integration test passed")

if __name__ == "__main__":
    test_amar_langchain_integration()
```

## Performance Optimization

### Caching
```python
from langchain.cache import InMemoryCache
import langchain

langchain.llm_cache = InMemoryCache()
```

### Batch Processing
```python
queries = [
    "How to prevent SQL injection?",
    "Best practices for API security?",
    "Microservices migration steps?"
]

results = [agent.run(q) for q in queries]
```

## Monitoring

```python
from langchain.callbacks import StdOutCallbackHandler

handler = StdOutCallbackHandler()

agent = initialize_agent(
    tools=tools,
    llm=llm,
    callbacks=[handler],
    verbose=True
)
```

## Next Steps for Rishab

1. **Load AMAR pipeline**: Use exported pickle file
2. **Create Langchain retriever**: Convert AMAR chunks
3. **Build agent tools**: Wrap AMAR functionality
4. **Test integration**: Run sample queries
5. **Add custom chains**: Compose complex workflows
6. **Deploy**: FastAPI or similar framework

## Resources

- Langchain Docs: https://python.langchain.com/docs/
- AMAR Architecture: See ARCHITECTURE.md
- Example Code: See demo.py and mvp_example.py

## Contact

For questions about AMAR integration:
- Review ARCHITECTURE.md for system details
- Check QUICKSTART.md for basic usage
- Run test_pipeline.py to verify setup
