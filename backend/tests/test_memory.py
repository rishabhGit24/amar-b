"""
Tests for EpisodicMemory system
Validates: Requirements 2.3, 11.1
"""

import pytest
from datetime import datetime
from hypothesis import given, strategies as st, settings
from backend.services.memory import EpisodicMemory, MemoryManager, MemoryEntry


class TestEpisodicMemory:
    """Test EpisodicMemory class functionality"""
    
    def test_memory_initialization(self):
        """Test memory initializes correctly with session ID"""
        session_id = "test_session_123"
        memory = EpisodicMemory(session_id)
        
        assert memory.session_id == session_id
        assert len(memory.entries) == 0
        assert memory.created_at is not None
    
    def test_add_entry_basic(self):
        """Test adding basic entries to memory"""
        memory = EpisodicMemory("test_session")
        
        entry_id = memory.add_entry(
            agent="planner",
            action="generate_plan",
            data={"pages": 3, "complexity": "medium"}
        )
        
        assert len(memory.entries) == 1
        assert entry_id is not None
        
        entry = memory.entries[0]
        assert entry.agent == "planner"
        assert entry.action == "generate_plan"
        assert entry.data["pages"] == 3
        assert entry.session_id == "test_session"
    
    def test_add_entry_with_tags_and_importance(self):
        """Test adding entries with tags and importance"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry(
            agent="builder",
            action="generate_code",
            data={"files": ["App.tsx", "index.tsx"]},
            tags=["code_generation", "react"],
            importance=0.8
        )
        
        entry = memory.entries[0]
        assert entry.tags == ["code_generation", "react"]
        assert entry.importance == 0.8
    
    def test_get_entries_by_agent(self):
        """Test retrieving entries by agent"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("planner", "plan", {"data": "plan1"})
        memory.add_entry("builder", "build", {"data": "build1"})
        memory.add_entry("planner", "revise", {"data": "plan2"})
        
        planner_entries = memory.get_entries_by_agent("planner")
        assert len(planner_entries) == 2
        assert all(e.agent == "planner" for e in planner_entries)
        
        builder_entries = memory.get_entries_by_agent("builder")
        assert len(builder_entries) == 1
        assert builder_entries[0].agent == "builder"
    
    def test_get_entries_by_action(self):
        """Test retrieving entries by action"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("planner", "plan", {"data": "1"})
        memory.add_entry("builder", "plan", {"data": "2"})
        memory.add_entry("deployer", "deploy", {"data": "3"})
        
        plan_entries = memory.get_entries_by_action("plan")
        assert len(plan_entries) == 2
        assert all(e.action == "plan" for e in plan_entries)
    
    def test_get_recent_entries(self):
        """Test getting recent entries with limit"""
        memory = EpisodicMemory("test_session")
        
        # Add multiple entries
        for i in range(5):
            memory.add_entry("agent", f"action_{i}", {"index": i})
        
        recent = memory.get_recent_entries(limit=3)
        assert len(recent) == 3
        # Should be newest first
        assert recent[0].data["index"] == 4
        assert recent[1].data["index"] == 3
        assert recent[2].data["index"] == 2
    
    def test_get_entries_by_importance(self):
        """Test filtering entries by importance threshold"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("agent", "low", {"data": "1"}, importance=0.3)
        memory.add_entry("agent", "medium", {"data": "2"}, importance=0.6)
        memory.add_entry("agent", "high", {"data": "3"}, importance=0.9)
        
        important = memory.get_entries_by_importance(min_importance=0.5)
        assert len(important) == 2
        # Should be sorted by importance descending
        assert important[0].importance == 0.9
        assert important[1].importance == 0.6
    
    def test_search_by_tags(self):
        """Test searching entries by tags"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("agent", "action1", {"data": "1"}, tags=["react", "frontend"])
        memory.add_entry("agent", "action2", {"data": "2"}, tags=["python", "backend"])
        memory.add_entry("agent", "action3", {"data": "3"}, tags=["react", "testing"])
        
        react_entries = memory.search_by_tags(["react"])
        assert len(react_entries) == 2
        
        backend_entries = memory.search_by_tags(["backend"])
        assert len(backend_entries) == 1
    
    def test_get_context_for_agent(self):
        """Test getting context for agent prompts"""
        memory = EpisodicMemory("test_session")
        
        # Add entries from different agents
        memory.add_entry("planner", "plan", {"pages": 3}, importance=0.8)
        memory.add_entry("builder", "build", {"files": 5}, importance=0.9)
        memory.add_entry("planner", "revise", {"changes": 2}, importance=0.6)
        
        context = memory.get_context_for_agent("planner")
        
        assert context["session_id"] == "test_session"
        assert len(context["agent_history"]) == 2  # planner entries
        assert len(context["relevant_context"]) == 1  # high-importance from other agents
    
    def test_export_for_rag(self):
        """Test exporting data for RAG integration"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("planner", "plan", {"pages": 3})
        memory.add_entry("builder", "build", {"files": 2})
        
        rag_data = memory.export_for_rag()
        
        assert len(rag_data) == 2
        assert all("text" in item for item in rag_data)
        assert all("metadata" in item for item in rag_data)
        assert all("embedding_placeholder" in item for item in rag_data)
    
    def test_get_summary(self):
        """Test getting memory summary statistics"""
        memory = EpisodicMemory("test_session")
        
        memory.add_entry("planner", "plan", {"data": "1"}, importance=0.8)
        memory.add_entry("builder", "build", {"data": "2"}, importance=0.6)
        
        summary = memory.get_summary()
        
        assert summary["session_id"] == "test_session"
        assert summary["total_entries"] == 2
        assert summary["unique_agents"] == 2
        assert summary["unique_actions"] == 2
        assert "planner" in summary["agents"]
        assert "builder" in summary["agents"]
        assert summary["avg_importance"] == 0.7


class TestMemoryManager:
    """Test MemoryManager class functionality"""
    
    def test_get_memory_creates_new_session(self):
        """Test that getting memory creates new session if not exists"""
        manager = MemoryManager()
        
        memory = manager.get_memory("new_session")
        
        assert memory.session_id == "new_session"
        assert len(memory.entries) == 0
    
    def test_get_memory_returns_existing_session(self):
        """Test that getting memory returns existing session"""
        manager = MemoryManager()
        
        # Get memory and add entry
        memory1 = manager.get_memory("existing_session")
        memory1.add_entry("agent", "action", {"data": "test"})
        
        # Get same session again
        memory2 = manager.get_memory("existing_session")
        
        assert memory1 is memory2
        assert len(memory2.entries) == 1
    
    def test_remove_session(self):
        """Test removing a session"""
        manager = MemoryManager()
        
        manager.get_memory("temp_session")
        assert "temp_session" in manager.get_active_sessions()
        
        removed = manager.remove_session("temp_session")
        assert removed is True
        assert "temp_session" not in manager.get_active_sessions()
        
        # Try removing non-existent session
        removed = manager.remove_session("non_existent")
        assert removed is False
    
    def test_get_active_sessions(self):
        """Test getting list of active sessions"""
        manager = MemoryManager()
        
        manager.get_memory("session1")
        manager.get_memory("session2")
        
        active = manager.get_active_sessions()
        assert len(active) == 2
        assert "session1" in active
        assert "session2" in active
    
    def test_get_total_entries(self):
        """Test getting total entries across all sessions"""
        manager = MemoryManager()
        
        memory1 = manager.get_memory("session1")
        memory2 = manager.get_memory("session2")
        
        memory1.add_entry("agent", "action", {"data": "1"})
        memory1.add_entry("agent", "action", {"data": "2"})
        memory2.add_entry("agent", "action", {"data": "3"})
        
        total = manager.get_total_entries()
        assert total == 3


class TestMemoryEntry:
    """Test MemoryEntry model validation"""
    
    def test_memory_entry_creation(self):
        """Test creating memory entry with required fields"""
        entry = MemoryEntry(
            session_id="test_session",
            agent="planner",
            action="plan",
            data={"pages": 3}
        )
        
        assert entry.session_id == "test_session"
        assert entry.agent == "planner"
        assert entry.action == "plan"
        assert entry.data == {"pages": 3}
        assert entry.id is not None
        assert entry.timestamp is not None
        assert entry.embedding is None
        assert entry.tags == []
        assert entry.importance == 1.0
    
    def test_memory_entry_with_optional_fields(self):
        """Test creating memory entry with optional fields"""
        entry = MemoryEntry(
            session_id="test_session",
            agent="builder",
            action="build",
            data={"files": 2},
            tags=["react", "frontend"],
            importance=0.8,
            embedding=[0.1, 0.2, 0.3]
        )
        
        assert entry.tags == ["react", "frontend"]
        assert entry.importance == 0.8
        assert entry.embedding == [0.1, 0.2, 0.3]
    
    def test_importance_validation(self):
        """Test importance field validation (0.0-1.0)"""
        # Valid importance
        entry = MemoryEntry(
            session_id="test",
            agent="agent",
            action="action",
            data={},
            importance=0.5
        )
        assert entry.importance == 0.5
        
        # Test boundary values
        entry_min = MemoryEntry(
            session_id="test",
            agent="agent", 
            action="action",
            data={},
            importance=0.0
        )
        assert entry_min.importance == 0.0
        
        entry_max = MemoryEntry(
            session_id="test",
            agent="agent",
            action="action", 
            data={},
            importance=1.0
        )
        assert entry_max.importance == 1.0
        
        # Invalid importance should raise validation error
        with pytest.raises(ValueError):
            MemoryEntry(
                session_id="test",
                agent="agent",
                action="action",
                data={},
                importance=1.5
            )
        
        with pytest.raises(ValueError):
            MemoryEntry(
                session_id="test",
                agent="agent", 
                action="action",
                data={},
                importance=-0.1
            )


class TestMemoryRAGCompatibility:
    """
    Property-based tests for memory structure RAG compatibility
    Feature: amar-mvp, Property 14: Memory structure RAG compatibility
    Validates: Requirements 11.1
    """
    
    @given(
        session_id=st.text(min_size=1, max_size=50),
        agent=st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip()),
        action=st.text(min_size=1, max_size=30, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip()),
        data=st.dictionaries(
            keys=st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll', 'Nd'), min_codepoint=32, max_codepoint=126)).filter(lambda x: x.strip()),
            values=st.one_of(
                st.text(max_size=100),
                st.integers(),
                st.floats(allow_nan=False, allow_infinity=False),
                st.booleans(),
                st.lists(st.text(max_size=20), max_size=5)
            ),
            min_size=0,
            max_size=10
        ),
        tags=st.lists(st.text(min_size=1, max_size=15), max_size=5),
        importance=st.floats(min_value=0.0, max_value=1.0, allow_nan=False, allow_infinity=False)
    )
    @settings(max_examples=100)
    def test_memory_entry_rag_compatibility(self, session_id, agent, action, data, tags, importance):
        """
        Feature: amar-mvp, Property 14: Memory structure RAG compatibility
        
        For any entry stored in Episodic Memory, the data structure should include 
        fields compatible with future vector embedding (timestamp, agent, action, data, embedding placeholder).
        
        Validates: Requirements 11.1
        """
        # Create memory entry
        memory = EpisodicMemory(session_id)
        entry_id = memory.add_entry(
            agent=agent,
            action=action,
            data=data,
            tags=tags,
            importance=importance
        )
        
        # Verify entry was created
        assert len(memory.entries) == 1
        entry = memory.entries[0]
        
        # Property: Entry must have all required RAG-compatible fields
        # These are the essential fields for vector embedding and retrieval
        
        # 1. Unique identifier for referencing
        assert hasattr(entry, 'id')
        assert entry.id is not None
        assert isinstance(entry.id, str)
        assert len(entry.id) > 0
        
        # 2. Timestamp for temporal ordering
        assert hasattr(entry, 'timestamp')
        assert entry.timestamp is not None
        assert isinstance(entry.timestamp, str)
        # Verify it's a valid ISO format timestamp
        datetime.fromisoformat(entry.timestamp.replace('Z', '+00:00'))
        
        # 3. Session ID for context grouping
        assert hasattr(entry, 'session_id')
        assert entry.session_id == session_id
        assert isinstance(entry.session_id, str)
        
        # 4. Agent name for source attribution
        assert hasattr(entry, 'agent')
        assert entry.agent == agent
        assert isinstance(entry.agent, str)
        
        # 5. Action type for categorization
        assert hasattr(entry, 'action')
        assert entry.action == action
        assert isinstance(entry.action, str)
        
        # 6. Structured data payload
        assert hasattr(entry, 'data')
        assert entry.data == data
        assert isinstance(entry.data, dict)
        
        # 7. Embedding placeholder for future RAG integration
        assert hasattr(entry, 'embedding')
        # Should be None initially, but field must exist
        assert entry.embedding is None or isinstance(entry.embedding, list)
        
        # 8. Tags for categorization and filtering
        assert hasattr(entry, 'tags')
        assert entry.tags == tags
        assert isinstance(entry.tags, list)
        
        # 9. Importance score for retrieval ranking
        assert hasattr(entry, 'importance')
        assert entry.importance == importance
        assert isinstance(entry.importance, float)
        assert 0.0 <= entry.importance <= 1.0
    
    @given(
        session_id=st.text(min_size=1, max_size=50),
        num_entries=st.integers(min_value=1, max_value=20)
    )
    @settings(max_examples=50)
    def test_export_for_rag_structure(self, session_id, num_entries):
        """
        Feature: amar-mvp, Property 14: Memory structure RAG compatibility
        
        For any memory with entries, the export_for_rag method should return 
        data in the correct format for vector embedding systems.
        
        Validates: Requirements 11.1
        """
        memory = EpisodicMemory(session_id)
        
        # Add multiple entries
        for i in range(num_entries):
            memory.add_entry(
                agent=f"agent_{i}",
                action=f"action_{i}",
                data={"index": i, "value": f"data_{i}"},
                tags=[f"tag_{i}"],
                importance=min(1.0, 0.1 * (i + 1))
            )
        
        # Export for RAG
        rag_data = memory.export_for_rag()
        
        # Property: RAG export must have correct structure for all entries
        assert len(rag_data) == num_entries
        
        for i, item in enumerate(rag_data):
            # Each item must be a dictionary with required RAG fields
            assert isinstance(item, dict)
            
            # Must have unique ID
            assert 'id' in item
            assert isinstance(item['id'], str)
            assert len(item['id']) > 0
            
            # Must have text representation for embedding
            assert 'text' in item
            assert isinstance(item['text'], str)
            assert len(item['text']) > 0
            # Text should contain agent, action, and data info
            assert f"agent_{i}" in item['text']
            assert f"action_{i}" in item['text']
            
            # Must have metadata for filtering and context
            assert 'metadata' in item
            assert isinstance(item['metadata'], dict)
            
            metadata = item['metadata']
            # Metadata must contain all essential fields
            assert 'session_id' in metadata
            assert metadata['session_id'] == session_id
            assert 'agent' in metadata
            assert metadata['agent'] == f"agent_{i}"
            assert 'action' in metadata
            assert metadata['action'] == f"action_{i}"
            assert 'timestamp' in metadata
            assert isinstance(metadata['timestamp'], str)
            assert 'tags' in metadata
            assert isinstance(metadata['tags'], list)
            assert 'importance' in metadata
            assert isinstance(metadata['importance'], float)
            
            # Must have embedding placeholder
            assert 'embedding_placeholder' in item
            # Should be None initially but field must exist
            assert item['embedding_placeholder'] is None or isinstance(item['embedding_placeholder'], list)
    
    @given(
        session_id=st.text(min_size=1, max_size=50)
    )
    @settings(max_examples=50)
    def test_memory_indices_rag_compatibility(self, session_id):
        """
        Feature: amar-mvp, Property 14: Memory structure RAG compatibility
        
        For any memory instance, the indexing structures should support 
        efficient retrieval patterns needed for RAG systems.
        
        Validates: Requirements 11.1
        """
        memory = EpisodicMemory(session_id)
        
        # Add entries with different agents and actions
        agents = ["planner", "builder", "deployer"]
        actions = ["plan", "generate", "deploy", "test"]
        
        for i, agent in enumerate(agents):
            for j, action in enumerate(actions):
                memory.add_entry(
                    agent=agent,
                    action=action,
                    data={"agent_index": i, "action_index": j},
                    importance=0.1 * (i + j + 1)
                )
        
        # Property: Memory must support efficient retrieval by agent
        for agent in agents:
            agent_entries = memory.get_entries_by_agent(agent)
            assert len(agent_entries) == len(actions)
            assert all(entry.agent == agent for entry in agent_entries)
        
        # Property: Memory must support efficient retrieval by action
        for action in actions:
            action_entries = memory.get_entries_by_action(action)
            assert len(action_entries) == len(agents)
            assert all(entry.action == action for entry in action_entries)
        
        # Property: Memory must support importance-based retrieval (for RAG ranking)
        important_entries = memory.get_entries_by_importance(min_importance=0.5)
        assert all(entry.importance >= 0.5 for entry in important_entries)
        # Should be sorted by importance descending
        importances = [entry.importance for entry in important_entries]
        assert importances == sorted(importances, reverse=True)
        
        # Property: Memory must support context retrieval for agents
        for agent in agents:
            context = memory.get_context_for_agent(agent)
            assert isinstance(context, dict)
            assert 'session_id' in context
            assert context['session_id'] == session_id
            assert 'agent_history' in context
            assert isinstance(context['agent_history'], list)
            assert 'relevant_context' in context
            assert isinstance(context['relevant_context'], list)