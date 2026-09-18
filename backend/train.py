import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# =========================
# LOAD DATASETS
# =========================

fake_news = pd.read_csv("../dataset/Fake.csv")
real_news = pd.read_csv("../dataset/True.csv")

# =========================
# CREATE LABELS
# =========================

fake_news["label"] = 0  # Fake
real_news["label"] = 1  # Real

# =========================
# COMBINE DATASETS
# =========================

data = pd.concat(
    [fake_news, real_news],
    ignore_index=True
)

# =========================
# CREATE CONTENT COLUMN
# Combines headline + article
# =========================

data["content"] = (
    data["title"].fillna("") + " " +
    data["title"].fillna("") + " " +
    data["text"].fillna("")
)

# Keep only required columns
data = data[["content", "label"]]

# Remove empty rows
data = data.dropna()

# Shuffle dataset
data = data.sample(
    frac=1,
    random_state=42
)

# =========================
# FEATURES & LABELS
# =========================

X = data["content"]
y = data["label"]

# =========================
# TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================
# TF-IDF VECTORIZATION
# =========================

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=100000,
    lowercase=True,
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.95,
    sublinear_tf=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# =========================
# MODEL TRAINING
# =========================

model = LogisticRegression(
    max_iter=2000,
    random_state=42,
    C=1.2
)

model.fit(
    X_train_tfidf,
    y_train
)

# =========================
# PREDICTIONS
# =========================

predictions = model.predict(
    X_test_tfidf
)

# =========================
# EVALUATION
# =========================

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n========== MODEL RESULTS ==========")
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        predictions
    )
)

# =========================
# SAVE MODEL
# =========================

joblib.dump(
    model,
    "model/fake_news_model.pkl"
)

joblib.dump(
    vectorizer,
    "model/vectorizer.pkl"
)

# =========================
# TRAINING INFO
# =========================

print("\n========== TRAINING INFO ==========")
print("Training Shape:", X_train_tfidf.shape)
print("Testing Shape:", X_test_tfidf.shape)
print("Vocabulary Size:", len(vectorizer.vocabulary_))

print("\nModel Saved Successfully")
print("fake_news_model.pkl")
print("vectorizer.pkl")