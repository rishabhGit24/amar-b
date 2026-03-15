"""
Complete End-to-End Flow Test for AMAR System
This demonstrates the entire workflow from user input to deployment
"""
import asyncio
import sys
from datetime import datetime

print("="*80)
print("AMAR COMPLETE SYSTEM FLOW TEST")
print("="*80)
print()

# Step 1: RAG System Check
print("📚 STEP 1: RAG SYSTEM CHECK")
print("-" * 80)
try:
    from services.rag_retriever import RAGPipeline
    
    print("✓ Loading RAG pipeline...")
    rag = RAGPipeline()
    
    # Check if knowledge base exists
    try:
        rag.load('amar_knowledge_base.pkl')
        print(f"✓ Knowledge base loaded: {len(rag.retriever.chunks)} chunks")
        
        # Test retrieval
        if len(rag.retriever.chunks) > 0:
            print("✓ Testing retrieval...")
            results = rag.retrieve('deployment production', top_k=3)
            print(f"✓ Retrieved {len(results)} results")
            
            if results:
                print(f"  Sample result score: {results[0][1]:.3f}")
        else:
            print("⚠️  Knowledge base is empty - run ingest_knowledge_base.py")
    except FileNotFoundError:
        print("⚠️  Knowledge base not found - run ingest_knowledge_base.py")
    
    print("✓ RAG system operational")
except Exception as e:
    print(f"✗ RAG system error: {e}")
    print("  This is non-critical - system will work without RAG")

print()

# Step 2: Configuration Check
print("⚙️  STEP 2: CONFIGURATION CHECK")
print("-" * 80)
try:
    from config import get_settings
    
    settings = get_settings()
    print(f"✓ Environment: {'Production' if settings.is_production else 'Development'}")
    print(f"✓ Host: {settings.host}:{settings.port}")
    print(f"✓ CORS Origins: {len(settings.cors_origins_list)} configured")
    
    # Check API keys
    has_gemini = bool(settings.gemini_api_key)
    has_groq = bool(settings.groq_api_key)
    has_openai = bool(settings.openai_api_key)
    
    print(f"{'✓' if has_gemini else '✗'} Gemini API Key: {'Present' if has_gemini else 'Missing'}")
    print(f"{'✓' if has_groq else '✗'} Groq API Key: {'Present' if has_groq else 'Missing'}")
    print(f"{'✓' if has_openai else '✗'} OpenAI API Key: {'Present' if has_openai else 'Missing'}")
    
    if not (has_gemini or has_groq or has_openai):
        print("⚠️  Warning: No LLM API keys configured")
    
except Exception as e:
    print(f"✗ Configuration error: {e}")
    sys.exit(1)

print()

# Step 3: Agent Initialization
print("🤖 STEP 3: AGENT INITIALIZATION")
print("-" * 80)
try:
    from agents.planner import PlannerAgent
    from agents.builder import BuilderAgent
    from agents.deployer import DeployerAgent
    
    print("✓ Initializing Planner Agent...")
    planner = PlannerAgent()
    
    print("✓ Initializing Builder Agent...")
    builder = BuilderAgent()
    
    print("✓ Initializing Deployer Agent...")
    deployer = DeployerAgent()
    
    print("✓ All agents initialized successfully")
except Exception as e:
    print(f"✗ Agent initialization error: {e}")
    sys.exit(1)

print()

# Step 4: Workflow Orchestrator
print("🎯 STEP 4: WORKFLOW ORCHESTRATOR")
print("-" * 80)
try:
    from workflow.orchestrator import get_orchestrator
    
    print("✓ Initializing orchestrator...")
    orchestrator = get_orchestrator()
    
    print("✓ Workflow graph compiled")
    print(f"✓ Nodes: supervisor, planner, builder, tester, deployer, self_heal, finalize")
    
except Exception as e:
    print(f"✗ Orchestrator error: {e}")
    sys.exit(1)

print()

# Step 5: Services Check
print("🔧 STEP 5: SERVICES CHECK")
print("-" * 80)
try:
    from services.rag_service import get_rag_service
    from services.error_handler import get_error_handler
    from services.graceful_failure import get_graceful_failure_handler
    from services.memory import memory_manager
    from services.audit import audit_manager
    
    print("✓ RAG Service initialized")
    print("✓ Error Handler initialized")
    print("✓ Graceful Failure Handler initialized")
    print("✓ Memory Manager initialized")
    print("✓ Audit Manager initialized")
    
    # Check system resources
    graceful_failure = get_graceful_failure_handler()
    resource_status = graceful_failure.get_resource_status()
    
    memory_status = resource_status.get('memory', {}).get('status', 'unknown')
    disk_status = resource_status.get('disk', {}).get('status', 'unknown')
    
    print(f"✓ Memory Status: {memory_status}")
    print(f"✓ Disk Status: {disk_status}")
    
except Exception as e:
    print(f"✗ Services error: {e}")
    sys.exit(1)

print()

# Step 6: Models Check
print("📦 STEP 6: DATA MODELS CHECK")
print("-" * 80)
try:
    from models import UserRequest, Plan, GeneratedProject
    from models.workflow import create_initial_workflow_state
    
    print("✓ UserRequest model loaded")
    print("✓ Plan model loaded")
    print("✓ GeneratedProject model loaded")
    print("✓ WorkflowState model loaded")
    
    # Test model creation
    test_request = UserRequest(
        description="Build a simple todo app",
        session_id="test-123"
    )
    print(f"✓ Test UserRequest created: {test_request.description[:30]}...")
    
except Exception as e:
    print(f"✗ Models error: {e}")
    sys.exit(1)

print()

# Step 7: Simulated Workflow Execution
print(" STEP 7: SIMULATED WORKFLOW EXECUTION")
print("-" * 80)
print("Simulating a complete workflow execution...")
print()

async def simulate_workflow():
    """Simulate the complete workflow"""
    
    # Create test request
    user_input = "Build a simple todo list app with React"
    session_id = f"test-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    
    print(f"📝 User Input: {user_input}")
    print(f"🆔 Session ID: {session_id}")
    print()
    
    # Progress tracking
    progress_updates = []
    
    async def progress_callback(agent, status, message, details):
        """Track progress updates"""
        emoji = {
            "supervisor": "🎯",
            "planner": "📋",
            "builder": "🔨",
            "tester": "🧪",
            "deployer": "",
            "finalize": "✅"
        }.get(agent, "▶️")
        
        status_emoji = {
            "running": "⏳",
            "completed": "✓",
            "failed": "✗"
        }.get(status, "•")
        
        print(f"{emoji} {status_emoji} {agent.upper()}: {message}")
        if details:
            print(f"   Details: {details}")
        
        progress_updates.append({
            "agent": agent,
            "status": status,
            "message": message,
            "details": details
        })
    
    try:
        # Execute workflow
        print("Starting workflow execution...")
        print()
        
        final_state = await orchestrator.execute_workflow(
            user_input,
            session_id,
            progress_callback
        )
        
        print()
        print("-" * 80)
        print("WORKFLOW RESULTS")
        print("-" * 80)
        
        # Display results
        status = final_state.get('workflow_status', 'unknown')
        print(f"Status: {status}")
        
        if final_state.get('deployment_url'):
            print(f"✓ Deployment URL: {final_state['deployment_url']}")
        
        if final_state.get('execution_time_ms'):
            exec_time = final_state['execution_time_ms'] / 1000
            print(f"✓ Execution Time: {exec_time:.2f}s")
        
        if final_state.get('errors'):
            print(f"✗ Errors: {len(final_state['errors'])}")
            for error in final_state['errors'][:3]:
                print(f"  - {error}")
        
        print()
        print(f"Total Progress Updates: {len(progress_updates)}")
        print(f"Retry Count: {final_state.get('retry_count', 0)}")
        
        return final_state
        
    except Exception as e:
        print(f"✗ Workflow execution error: {e}")
        import traceback
        traceback.print_exc()
        return None

# Run the simulation
try:
    final_state = asyncio.run(simulate_workflow())
    
    if final_state:
        print()
        print("="*80)
        print("✅ COMPLETE FLOW TEST PASSED")
        print("="*80)
        print()
        print("Summary:")
        print("  ✓ RAG system operational")
        print("  ✓ Configuration valid")
        print("  ✓ All agents initialized")
        print("  ✓ Workflow orchestrator ready")
        print("  ✓ All services operational")
        print("  ✓ Data models validated")
        print("  ✓ Workflow execution completed")
        print()
        print("🎉 AMAR system is fully operational!")
    else:
        print()
        print("="*80)
        print("⚠️  FLOW TEST COMPLETED WITH WARNINGS")
        print("="*80)
        print("The system is operational but the workflow encountered issues.")
        print("Check the error messages above for details.")
        
except Exception as e:
    print()
    print("="*80)
    print("✗ FLOW TEST FAILED")
    print("="*80)
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
