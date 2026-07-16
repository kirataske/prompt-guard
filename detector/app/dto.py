from pydantic import BaseModel
from enum import Enum

class Verdict(str, Enum):
    clean = 'clean'
    suspicious = 'suspicious'
    blocked = 'blocked'

class AttackType(str, Enum):
    none = 'none'
    direct_injection = 'direct_injection'
    indirect_injection = 'indirect_injection'
    system_prompt_leak = 'system_prompt_leak'
    role_play = 'role_play'
    obfuscation = 'obfuscation'
    payload_splitting = 'payload_splitting'

class Severity(str, Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    verdict: Verdict
    severity: Severity
    attackType: AttackType
    segment: str = ""