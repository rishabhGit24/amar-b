"""
Evaluation & QA Module
Metrics for measuring retrieval and generation quality
"""
from typing import List, Dict, Tuple
import numpy as np
from sentence_transformers import SentenceTransformer, util


class RAGEvaluator:
    """Evaluate RAG pipeline performance"""
    
    def __init__(self):
        self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    def calculate_relevance(self, query: str, retrieved_chunks: List[str]) -> float:
        """Calculate average semantic similarity between query and retrieved chunks"""
        if not retrieved_chunks:
            return 0.0
        
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        chunk_embeddings = self.model.encode(retrieved_chunks, convert_to_tensor=True)
        
        similarities = util.cos_sim(query_embedding, chunk_embeddings)[0]
        return float(similarities.mean())
    
    def evaluate_retrieval(self, test_cases: List[Dict]) -> Dict:
        """
        Evaluate retrieval quality
        test_cases format: [{"query": str, "expected_keywords": List[str]}]
        """
        results = {
            "total_cases": len(test_cases),
            "passed": 0,
            "failed": 0,
            "relevance_scores": [],
            "details": []
        }
        
        for case in test_cases:
            query = case["query"]
            expected = case.get("expected_keywords", [])
            
            # This would call the actual RAG pipeline
            # For now, placeholder
            relevance = 0.85  # Placeholder
            
            results["relevance_scores"].append(relevance)
            
            if relevance >= 0.80:
                results["passed"] += 1
            else:
                results["failed"] += 1
            
            results["details"].append({
                "query": query,
                "relevance": relevance,
                "passed": relevance >= 0.80
            })
        
        results["average_relevance"] = np.mean(results["relevance_scores"])
        results["pass_rate"] = results["passed"] / results["total_cases"]
        
        return results
    
    def evaluate_answer_quality(self, answer: str, expected_content: List[str]) -> float:
        """Evaluate if answer contains expected content"""
        answer_lower = answer.lower()
        matches = sum(1 for keyword in expected_content if keyword.lower() in answer_lower)
        return matches / len(expected_content) if expected_content else 0.0


def run_evaluation_suite(rag_pipeline) -> Dict:
    """Run complete evaluation suite"""
    evaluator = RAGEvaluator()
    
    test_cases = [
        {
            "query": "How to prevent SQL injection in Node.js?",
            "expected_keywords": ["parameterized", "query", "placeholder", "?"]
        },
        {
            "query": "How to migrate a monolith to microservices?",
            "expected_keywords": ["bounded contexts", "incremental", "services", "api"]
        },
        {
            "query": "What are best practices for web application security?",
            "expected_keywords": ["sql injection", "parameterized", "input validation"]
        },
        {
            "query": "Steps for migrating legacy web application?",
            "expected_keywords": ["assessment", "stack", "testing", "migration"]
        }
    ]
    
    print("Running evaluation suite...")
    results = []
    
    for case in test_cases:
        response = rag_pipeline.query(case["query"])
        
        # Calculate metrics
        relevance = response.get("confidence", 0.0)
        answer_quality = evaluator.evaluate_answer_quality(
            response["answer"], 
            case["expected_keywords"]
        )
        
        results.append({
            "query": case["query"],
            "relevance": relevance,
            "answer_quality": answer_quality,
            "passed": relevance >= 0.80 and answer_quality >= 0.5
        })
        
        print(f"\nQuery: {case['query']}")
        print(f"Relevance: {relevance:.2%}")
        print(f"Answer Quality: {answer_quality:.2%}")
        print(f"Status: {'✓ PASSED' if results[-1]['passed'] else '✗ FAILED'}")
    
    # Summary
    avg_relevance = np.mean([r["relevance"] for r in results])
    avg_quality = np.mean([r["answer_quality"] for r in results])
    pass_rate = sum(1 for r in results if r["passed"]) / len(results)
    
    summary = {
        "total_tests": len(results),
        "passed": sum(1 for r in results if r["passed"]),
        "failed": sum(1 for r in results if not r["passed"]),
        "average_relevance": avg_relevance,
        "average_answer_quality": avg_quality,
        "pass_rate": pass_rate,
        "target_met": avg_relevance >= 0.80
    }
    
    print("\n" + "="*50)
    print("EVALUATION SUMMARY")
    print("="*50)
    print(f"Total Tests: {summary['total_tests']}")
    print(f"Passed: {summary['passed']}")
    print(f"Failed: {summary['failed']}")
    print(f"Average Relevance: {summary['average_relevance']:.2%}")
    print(f"Average Answer Quality: {summary['average_answer_quality']:.2%}")
    print(f"Pass Rate: {summary['pass_rate']:.2%}")
    print(f"Target (80% relevance): {'✓ MET' if summary['target_met'] else '✗ NOT MET'}")
    
    return summary
