import joblib
from sentence_transformers import SentenceTransformer
import os


class MLDetector:
    def __init__(self, confidence_threshold: float = 95.0):
        self.threshold = confidence_threshold
        self.embedder = SentenceTransformer('intfloat/multilingual-e5-base')
        model_path = os.path.join('models', 'level_2_classifier.pkl')

        if os.path.exists(model_path):
            models_pack = joblib.load(model_path)
            self.clf_attack = models_pack['clf_attack']
            self.clf_severity = models_pack['clf_severity']
            self.is_ready = True
            self.none_index = list(self.clf_attack.classes_).index('none')
        else:
            self.is_ready = False
            print('Model not found')

    def analyze(self, text: str) -> dict:
        if not self.is_ready:
            return {
                'verdict': 'clean',
                'severity': 'low',
                'attackType': 'none',
                'segment': '',
                'confidence': 0.0,
                'error': 'Model not loaded'
            }

        formatted_text = 'query: ' + str(text).strip()
        embedding = self.embedder.encode([formatted_text], convert_to_numpy=True)

        pred_attack = self.clf_attack.predict(embedding)[0]
        probabilities = self.clf_attack.predict_proba(embedding)[0]

        prob_none = probabilities[self.none_index] * 100
        prob_attack = (1.0 - probabilities[self.none_index]) * 100
        confidence = round(prob_attack if pred_attack != 'none' else prob_none, 2)

        pred_severity = self.clf_severity.predict(embedding)[0]

        if pred_attack == 'none' or pred_severity == 'none':
            final_severity = 'low'
        else:
            final_severity = pred_severity

        print(f"Level 2 : Confidence {confidence}% | Type: {pred_attack}")

        if pred_attack != 'none':
            if confidence < self.threshold:
                return {
                    'verdict': 'clean',
                    'severity': 'low',
                    'attackType': 'none',
                    'segment': '',
                    'confidence': confidence
                }

            return {
                'verdict': 'blocked',
                'severity': final_severity,
                'attackType': pred_attack,
                'segment': '',
                'confidence': confidence
            }
        else:
            return {
                'verdict': 'clean',
                'severity': 'low',
                'attackType': 'none',
                'segment': '',
                'confidence': confidence
            }