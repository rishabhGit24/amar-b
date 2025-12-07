"""
Episodic Memory System for AMAR MVP
Provides session-scoped storage with structured format for future RAG integration
Validates: Requirements 2.3, 11.1
"""

import json
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from uuid import uuid4

from pydantic import BaseModel, Field


class MemoryEntry(BaseModel):
    """
    Single entry in episodic memory with RAG-compatible structure
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    session_id: str
    agent: str
    action: str
    data: Dict[str, Any]
    # Future RAG integration field
    embedding: Optional[List[float]] = None
    # Metadata for retrieval
    tags: List[str] = Field(default_factory=list)
    importance: float = Field(default=1.0, ge=0.0, le=1.0)


class EpisodicMemory:
    """
    Session-scoped episodic memory storage with structured format for future RAG integration
    
    Provides methods for storing and retrieving agent decisions, maintaining context
    across agent transitions, and preparing data for future vector embedding.
    
    Validates: Requirements 2.3, 11.1
    """
    
    def __init__(self, session_id: str):
        """
        Initialize episodic memory for a specific session
        
        Args:
            session_id: Unique identifier for the session
        """
        self.session_id = session_id
        self.entries: List[MemoryEntry] = []
        self.created_at = datetime.now().isoformat()
        self._index_by_agent: Dict[str, List[MemoryEntry]] = {}
        self._index_by_action: Dict[str, List[MemoryEntry]] = {}
    
    def add_entry(
        self, 
        agent: str, 
        action: str, 
        data: Dict[str, Any],
        tags: Optional[List[str]] = None,
        importance: float = 1.0
    ) -> str:
        """
        Add a new entry to episodic memory
        
        Args:
            agent: Name of the agent making the entry
            action: Type of action being recorded
            data: Structured data about the action
            tags: Optional tags for categorization
            importance: Importance score for future retrieval (0.0-1.0)
            
        Returns:
            Entry ID for future reference
        """
        entry = MemoryEntry(
            session_id=self.session_id,
            agent=agent,
            action=action,
            data=data,
            tags=tags or [],
            importance=importance
        )
        
        self.entries.append(entry)
        
        # Update indices for fast retrieval
        if agent not in self._index_by_agent:
            self._index_by_agent[agent] = []
        self._index_by_agent[agent].append(entry)
        
        if action not in self._index_by_action:
            self._index_by_action[action] = []
        self._index_by_action[action].append(entry)
        
        return entry.id
    
    def get_entries_by_agent(self, agent: str) -> List[MemoryEntry]:
        """
        Retrieve all entries for a specific agent
        
        Args:
            agent: Agent name to filter by
            
        Returns:
            List of memory entries for the agent
        """
        return self._index_by_agent.get(agent, [])
    
    def get_entries_by_action(self, action: str) -> List[MemoryEntry]:
        """
        Retrieve all entries for a specific action type
        
        Args:
            action: Action type to filter by
            
        Returns:
            List of memory entries for the action
        """
        return self._index_by_action.get(action, [])
    
    def get_recent_entries(self, limit: int = 10) -> List[MemoryEntry]:
        """
        Get the most recent entries
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of recent memory entries, newest first
        """
        # Get the last 'limit' entries and reverse them so newest is first
        recent = self.entries[-limit:] if len(self.entries) >= limit else self.entries[:]
        return list(reversed(recent))
    
    def get_entries_by_importance(self, min_importance: float = 0.5) -> List[MemoryEntry]:
        """
        Get entries above a certain importance threshold
        
        Args:
            min_importance: Minimum importance score
            
        Returns:
            List of important memory entries, sorted by importance descending
        """
        filtered = [e for e in self.entries if e.importance >= min_importance]
        return sorted(filtered, key=lambda x: x.importance, reverse=True)
    
    def search_by_tags(self, tags: List[str]) -> List[MemoryEntry]:
        """
        Search entries by tags
        
        Args:
            tags: List of tags to search for
            
        Returns:
            List of entries that contain any of the specified tags
        """
        results = []
        for entry in self.entries:
            if any(tag in entry.tags for tag in tags):
                results.append(entry)
        return results
    
    def get_context_for_agent(self, agent: str, max_entries: int = 5) -> Dict[str, Any]:
        """
        Get relevant context for an agent to include in prompts
        
        Args:
            agent: Agent name requesting context
            max_entries: Maximum number of context entries
            
        Returns:
            Dictionary with structured context for the agent
        """
        # Get recent entries from this agent
        agent_entries = self.get_entries_by_agent(agent)[-max_entries:]
        
        # Get recent high-importance entries from other agents
        other_entries = [
            e for e in self.get_entries_by_importance(min_importance=0.7)
            if e.agent != agent
        ][:max_entries]
        
        return {
            'session_id': self.session_id,
            'agent_history': [
                {
                    'timestamp': e.timestamp,
                    'action': e.action,
                    'data': e.data
                }
                for e in agent_entries
            ],
            'relevant_context': [
                {
                    'agent': e.agent,
                    'timestamp': e.timestamp,
                    'action': e.action,
                    'data': e.data,
                    'importance': e.importance
                }
                for e in other_entries
            ]
        }
    
    def export_for_rag(self) -> List[Dict[str, Any]]:
        """
        Export memory entries in format suitable for RAG vector embedding
        
        Returns:
            List of dictionaries ready for embedding generation
        """
        return [
            {
                'id': entry.id,
                'text': f"{entry.agent} performed {entry.action}: {json.dumps(entry.data)}",
                'metadata': {
                    'session_id': entry.session_id,
                    'agent': entry.agent,
                    'action': entry.action,
                    'timestamp': entry.timestamp,
                    'tags': entry.tags,
                    'importance': entry.importance
                },
                'embedding_placeholder': entry.embedding
            }
            for entry in self.entries
        ]
    
    def get_summary(self) -> Dict[str, Any]:
        """
        Get a summary of the memory contents
        
        Returns:
            Dictionary with memory statistics and summary
        """
        agents = set(entry.agent for entry in self.entries)
        actions = set(entry.action for entry in self.entries)
        
        return {
            'session_id': self.session_id,
            'created_at': self.created_at,
            'total_entries': len(self.entries),
            'unique_agents': len(agents),
            'unique_actions': len(actions),
            'agents': list(agents),
            'actions': list(actions),
            'avg_importance': sum(e.importance for e in self.entries) / len(self.entries) if self.entries else 0.0,
            'time_span': {
                'first_entry': self.entries[0].timestamp if self.entries else None,
                'last_entry': self.entries[-1].timestamp if self.entries else None
            }
        }
    
    def clear(self):
        """
        Clear all entries from memory (useful for testing)
        """
        self.entries.clear()
        self._index_by_agent.clear()
        self._index_by_action.clear()


class MemoryManager:
    """
    Global manager for episodic memory sessions
    Handles creation and retrieval of session-specific memory instances
    """
    
    def __init__(self):
        self._sessions: Dict[str, EpisodicMemory] = {}
    
    def get_memory(self, session_id: str) -> EpisodicMemory:
        """
        Get or create episodic memory for a session
        
        Args:
            session_id: Session identifier
            
        Returns:
            EpisodicMemory instance for the session
        """
        if session_id not in self._sessions:
            self._sessions[session_id] = EpisodicMemory(session_id)
        return self._sessions[session_id]
    
    def remove_session(self, session_id: str) -> bool:
        """
        Remove a session's memory (cleanup)
        
        Args:
            session_id: Session to remove
            
        Returns:
            True if session was removed, False if not found
        """
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False
    
    def get_active_sessions(self) -> List[str]:
        """
        Get list of active session IDs
        
        Returns:
            List of session IDs with active memory
        """
        return list(self._sessions.keys())
    
    def get_total_entries(self) -> int:
        """
        Get total number of entries across all sessions
        
        Returns:
            Total entry count
        """
        return sum(len(memory.entries) for memory in self._sessions.values())


# Global memory manager instance
memory_manager = MemoryManager()