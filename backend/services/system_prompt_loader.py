"""
Utilities for loading curated system prompts from the local knowledge base.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Optional


@lru_cache(maxsize=16)
def load_system_prompt(filename: str) -> Optional[str]:
    """
    Load a system prompt file from backend/knowledge_base/system_prompts.

    Returns None when the file is missing or empty.
    """
    prompts_dir = Path(__file__).resolve().parent.parent / "knowledge_base" / "system_prompts"
    prompt_path = prompts_dir / filename

    if not prompt_path.exists():
        return None

    content = prompt_path.read_text(encoding="utf-8").strip()
    return content or None

