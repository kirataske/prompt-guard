from pydantic import BaseModel
from enum import Enum

class VerdictEnum(str, Enum):
    CLEAN = "clean"
    SUSPICIOUS = "suspicious"
    BLOCKED = "blocked"

class AttackTypeEnum(str, Enum):
    NONE = "none"
    PROMPT_INJECTION = "prompt_injection"
    JAILBREAK = "jailbreak"
    INDIRECT = "indirect_injection"
    OBFUSCATION = "obfuscation"
    ROLE_PLAY = "role_play"
    UNKNOWN = "unknown"

class DetectionSourceEnum(str, Enum):
    NONE = "none"
    LEVEL_1_HEURISTIC = "level_1_heuristic"
    LEVEL_2_ML = "level_2_ml"
    LEVEL_3_LLM = "level_3_llm"

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    verdict: VerdictEnum
    risk_level: str
    attack_type: AttackTypeEnum
    confidence: float
    detected_by: DetectionSourceEnum