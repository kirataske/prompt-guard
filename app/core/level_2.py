import joblib
from sentence_transformers import SentenceTransformer
import os


class MLDetector:
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        model_path = os.path.join("models", "level_2_classifier.pkl")
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
            self.is_ready = True
        else:
            self.is_ready = False
            print(f"Модель не знайдено. Спочатку запустіть scripts/train_model.py")

    def analyze(self, text: str) -> dict:
        if not self.is_ready:
            return {"verdict": "clean", "confidence": 0.0, "error": "Model not loaded"}
        embedding = self.embedder.encode([text])
        prediction = self.model.predict(embedding)[0]
        probabilities = self.model.predict_proba(embedding)[0]
        confidence = round(max(probabilities) * 100, 2)

        if prediction == 1:
            return {
                "verdict": "blocked",
                "risk_level": "high",
                "attack_type": "ml_detected_injection",
                "confidence": confidence
            }
        else:
            return {
                "verdict": "clean",
                "risk_level": "low",
                "attack_type": "none",
                "confidence": confidence
            }