import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sentence_transformers import SentenceTransformer
import joblib
import os


def train_level_2():
    try:
        df = pd.read_csv('data/prompt_guard_dataset.csv')
    except FileNotFoundError:
        print('Error: Dataset not found. Please run build_dataset.py first.')
        return

    X_texts = ['query: ' + str(text) for text in df['text'].tolist()]
    y_attack = df['attack_type'].tolist()
    y_severity = df['severity'].tolist()

    embedder = SentenceTransformer('intfloat/multilingual-e5-base')
    X_embeddings = embedder.encode(X_texts, show_progress_bar=True, batch_size=8, convert_to_numpy=True)

    X_train, X_test, y_train_atk, y_test_atk, y_train_sev, y_test_sev = train_test_split(
        X_embeddings, y_attack, y_severity, test_size=0.2, random_state=42, stratify=y_attack
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


if __name__ == '__main__':
    train_level_2()