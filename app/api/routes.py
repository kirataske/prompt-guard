from fastapi import APIRouter, HTTPException
from app.dto import AnalyzeRequest, AnalyzeResponse
from app.core.ML import run_detection_pipeline

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_prompt(payload: AnalyzeRequest):
    try:
        result = run_detection_pipeline(payload.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))