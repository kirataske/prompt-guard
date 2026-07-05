import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sentence_transformers import SentenceTransformer
import joblib
import os


def train_level_2():
    try:
        df = pd.read_csv("data/prompt_guard_dataset.csv")
    except FileNotFoundError:
        print("Dataset file not found.")
        return

    X_texts = df['text'].astype(str).tolist()
    y = df['label'].tolist()
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
    X_embeddings = embedder.encode(X_texts, show_progress_bar=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X_embeddings, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    clf.fit(X_train, y_train)
    os.makedirs("models", exist_ok=True)
    joblib.dump(clf, "models/level_2_classifier.pkl")
    print("Model saved to models/level_2_classifier.pkl")


if __name__ == "__main__":
    train_level_2()