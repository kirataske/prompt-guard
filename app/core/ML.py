from app.dto import AnalyzeResponse, VerdictEnum, AttackTypeEnum, DetectionSourceEnum
from app.core.level_1 import check_level_1
from app.core.level_2 import MLDetector
from app.core.level_3 import LLMJudge

ml_detector = MLDetector()
llm_judge = LLMJudge()


def run_detection_pipeline(text: str) -> AnalyzeResponse:
    l1_result = check_level_1(text)

    if l1_result is not None:
        return AnalyzeResponse(
            verdict=VerdictEnum.BLOCKED,
            risk_level=l1_result["risk_level"],
            attack_type=AttackTypeEnum.HEURISTIC_SIGNATURE,
            confidence=100.0,
            detected_by=DetectionSourceEnum.LEVEL_1_HEURISTIC
        )

    l2_raw = ml_detector.analyze(text)
    if l2_raw["verdict"] == "blocked":
        return AnalyzeResponse(
            verdict=VerdictEnum.BLOCKED,
            risk_level=l2_raw["risk_level"],
            attack_type=AttackTypeEnum.UNKNOWN,
            confidence=l2_raw["confidence"],
            detected_by=DetectionSourceEnum.LEVEL_2_ML
        )
    if l2_raw["verdict"] == "clean" and l2_raw["confidence"] < 90.0:
        l3_raw = llm_judge.analyze(text)

        if l3_raw["verdict"] == "blocked":
            try:
                attack_enum = AttackTypeEnum(l3_raw["attack_type"])
            except ValueError:
                attack_enum = AttackTypeEnum.UNKNOWN

            return AnalyzeResponse(
                verdict=VerdictEnum.BLOCKED,
                risk_level="high",
                attack_type=attack_enum,
                confidence=l3_raw["confidence"],
                detected_by=DetectionSourceEnum.LEVEL_3_LLM
            )

    return AnalyzeResponse(
        verdict=VerdictEnum.CLEAN,
        risk_level=l2_raw["risk_level"],
        attack_type=AttackTypeEnum.NONE,
        confidence=l2_raw["confidence"],
        detected_by=DetectionSourceEnum.NONE
    )