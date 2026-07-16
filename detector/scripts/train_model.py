import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sentence_transformers import SentenceTransformer
from sklearn.metrics import classification_report
import joblib
import os
from app.core.level_1 import check_level_1


def train_level_2():
    try:
        df = pd.read_csv('data/prompt_guard_dataset.csv')
    except FileNotFoundError:
        print('Error: Dataset not found. Please run build_dataset.py first.')
        return
    raw_texts = df['text'].tolist()
    X_texts = ['query: ' + str(text) for text in df['text'].tolist()]
    y_attack = df['attack_type'].tolist()
    y_severity = df['severity'].tolist()

    embedder = SentenceTransformer('intfloat/multilingual-e5-base')
    X_embeddings = embedder.encode(X_texts, show_progress_bar=True, batch_size=8, convert_to_numpy=True)

    X_train, X_test, y_train_atk, y_test_atk, y_train_sev, y_test_sev, _, test_texts = train_test_split(
        X_embeddings, y_attack, y_severity, raw_texts, test_size=0.2, random_state=42, stratify=y_attack
    )

    clf_attack = LogisticRegression(max_iter=1000, class_weight='balanced')
    clf_attack.fit(X_train, y_train_atk)

    clf_severity = LogisticRegression(max_iter=1000, class_weight='balanced')
    clf_severity.fit(X_train, y_train_sev)

    os.makedirs('models', exist_ok=True)
    joblib.dump({
        'clf_attack': clf_attack,
        'clf_severity': clf_severity
    }, 'models/level_2_classifier.pkl')

    print('models are saved successfully.')

    y_test_verdict = ['clean' if atk == 'none' else 'blocked' for atk in y_test_atk]
    y_pred_atk = clf_attack.predict(X_test)
    y_pred_l1 = ['blocked' if check_level_1(text) else 'clean' for text in test_texts]
    y_pred_l2 = ['clean' if p == 'none' else 'blocked' for p in y_pred_atk]

    print("Метрики для 1 рівня")
    print(classification_report(y_test_verdict, y_pred_l1, zero_division=0))
    print('Метрики для 2 рівня:')
    print(classification_report(y_test_verdict, y_pred_l2, zero_division=0))


if __name__ == '__main__':
    train_level_2()