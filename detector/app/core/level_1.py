import re

SIGNATURES = {
    r'(?i)ignore\s+(all\s+)?previous\s+instructions': 'direct_injection',
    r'(?i)forget\s+previous': 'direct_injection',
    r'(?i)system\s+prompt': 'system_prompt_leak',
    r'(?i)print\s+your\s+initial\s+instructions': 'system_prompt_leak',
    r'(?i)bypass\s+(your\s+)?rules': 'role_play',
    r'(?i)decode\s+(this\s+)?base64': 'obfuscation',
    r'(?i)act\s+as|pretend\s+to\s+be': 'role_play'
}

def check_level_1(text: str) -> dict | None:
    for pattern, attack_type in SIGNATURES.items():
        match = re.search(pattern, text)
        if match:
            return {
                'verdict': 'blocked',
                'severity': 'high',
                'attackType': attack_type,
                'segment': match.group(0)
            }
    return None