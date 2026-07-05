import re

SIGNATURES = [
    r"(?i)ignore\s+(all\s+)?previous\s+instructions",
    r"(?i)system\s+prompt",
    r"(?i)forget\s+previous",
    r"(?i)bypass\s+(your\s+)?rules",
    r"(?i)decode\s+(this\s+)?base64",
    r"(?i)print\s+your\s+initial\s+instructions"
]


def check_level_1(text: str) -> dict | None:
    for pattern in SIGNATURES:
        if re.search(pattern, text):
            return {
                "verdict": "blocked",
                "risk_level": "high",
                "attack_type": "heuristic_signature"
            }

    return None