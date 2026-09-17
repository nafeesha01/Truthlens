import joblib

# Load saved model and vectorizer
model = joblib.load("model/fake_news_model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

LABELS = {
    0: "Fake News",
    1: "Real News"
}

print("TruthLens Prediction Engine")
print("-" * 40)

while True:

    article = input(
        "\nEnter article text (type 'exit' to quit): "
    )

    if article.lower() == "exit":
        print("Goodbye.")
        break

    if not article.strip():
        print("Please enter some text.")
        continue

    article_vector = vectorizer.transform(
        [article]
    )

    prediction = model.predict(
        article_vector
    )

    probabilities = model.predict_proba(
        article_vector
    )

    confidence = max(probabilities[0]) * 100

    result = LABELS[prediction[0]]

    print("\n========== RESULT ==========")
    print(f"Prediction: {result}")
    print(f"Confidence: {confidence:.2f}%")

    print("\nProbability Breakdown")
    print(
        f"Fake News: {probabilities[0][0] * 100:.2f}%"
    )
    print(
        f"Real News: {probabilities[0][1] * 100:.2f}%"
    )

    print("\nArticle Statistics")
    print(
        f"Word Count: {len(article.split())}"
    )
    print(
        f"Character Count: {len(article)}"
    )