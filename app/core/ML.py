from app.dto import AnalyzeResponse, AttackType, Severity, Verdict
from app.core.level_1 import check_level_1
from app.core.level_2 import MLDetector
from app.core.level_3 import LLMJudge

ml_detector = MLDetector()
llm_judge = LLMJudge()


def run_detection_pipeline(text: str) -> AnalyzeResponse:
    print(f"Analyzing: {text}")

    l1_result = check_level_1(text)
    if l1_result:
        print("Blocked by Level 1")
        return AnalyzeResponse(
            verdict=Verdict(l1_result['verdict']),
            severity=Severity(l1_result['severity']),
            attackType=AttackType(l1_result['attackType']),
            segment=l1_result.get('segment', '')
        )

    l2_raw = ml_detector.analyze(text)

    if l2_raw['verdict'] == 'blocked':
        print(f"Blocked by Level 2: {l2_raw['attackType']}")
        return AnalyzeResponse(
            verdict=Verdict(l2_raw['verdict']),
            severity=Severity(l2_raw['severity']),
            attackType=AttackType(l2_raw['attackType']),
            segment=l2_raw.get('segment', '')
        )

    print("Level 2 passed, Level 3")
    l3_raw = llm_judge.analyze(text)

    if l3_raw.get('verdict') == 'error':
        print("Level 3 error")
        return AnalyzeResponse(
            verdict=Verdict.blocked,
            severity=Severity.high,
            attackType=AttackType.none,
            segment='Level 3 API error'
        )

    llm_severity = l3_raw.get('severity', 'high' if l3_raw.get('verdict') == 'blocked' else 'low')

    try:
        severity_enum = Severity(llm_severity)
    except ValueError:
        severity_enum = Severity.high if l3_raw.get('verdict') == 'blocked' else Severity.low

    if l3_raw['verdict'] == 'blocked':
        print(f"Blocked by Level 3: {l3_raw.get('attackType')}")
        try:
            attack_enum = AttackType(l3_raw['attackType'])
        except ValueError:
            attack_enum = AttackType.direct_injection

        return AnalyzeResponse(
            verdict=Verdict.blocked,
            severity=severity_enum,
            attackType=attack_enum,
            segment=l3_raw.get('segment', '')
        )

    if l3_raw['verdict'] == 'suspicious':
        print(f"Suspicious by Level 3: {l3_raw.get('attackType')}")
        try:
            attack_enum = AttackType(l3_raw['attackType'])
        except ValueError:
            attack_enum = AttackType.none

        return AnalyzeResponse(
            verdict=Verdict.suspicious,
            severity=severity_enum,
            attackType=attack_enum,
            segment=l3_raw.get('segment', '')
        )

    print(f"Analysis finished: clean ")
    return AnalyzeResponse(
        verdict=Verdict.clean,
        severity=severity_enum,
        attackType=AttackType.none,
        segment=''
    )