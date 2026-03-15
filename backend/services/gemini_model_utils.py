"""
Gemini model normalization and fallback helpers.
"""

from __future__ import annotations

from typing import List


MODEL_ALIASES = {
    # Common typos / variants
    "gemini02.5-pro": "gemini-2.5-pro",
    "gemini2.5-pro": "gemini-2.5-pro",
    "gemini_2.5_pro": "gemini-2.5-pro",
    "gemini02.5-flash": "gemini-2.5-flash",
    "gemini2.5-flash": "gemini-2.5-flash",
    "gemini_2.5_flash": "gemini-2.5-flash",
    # Legacy aliases in repo history
    "gemini-2.0-flash": "gemini-2.5-flash",
}


def normalize_gemini_model_name(model_name: str) -> str:
    raw = (model_name or "").strip()
    if not raw:
        return "gemini-2.5-pro"
    lower = raw.lower()
    return MODEL_ALIASES.get(lower, lower)


def build_gemini_model_candidates(configured_model: str) -> List[str]:
    """
    Build ordered candidates:
    - Use configured model first.
    - Then include stable fallback models.
    """
    primary = normalize_gemini_model_name(configured_model)
    fallbacks = [primary, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
    seen = set()
    ordered: List[str] = []
    for model in fallbacks:
        if model and model not in seen:
            ordered.append(model)
            seen.add(model)
    return ordered


def should_fallback_to_next_model(error_text: str) -> bool:
    msg = (error_text or "").lower()

    # Model unavailable
    model_not_found = (
        ("404" in msg and "model" in msg and "not found" in msg)
        or ("models/" in msg and "not found" in msg)
    )
    if model_not_found:
        return True

    # Quota / rate-limit / free-tier exhaustion
    quota_exhausted_markers = [
        "resource_exhausted",
        "quota",
        "free_tier",
        "generatecontentinputtokenspermodelperday-freetier",
        "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",
        "429",
        "rate limit",
    ]
    return any(marker in msg for marker in quota_exhausted_markers)

