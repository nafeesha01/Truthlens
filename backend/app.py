from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load model and vectorizer once when server starts
model = joblib.load("model/fake_news_model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

LABELS = {
    0: "Fake News",
    1: "Real News"
}


@app.route("/")
def home():
    return jsonify({
        "message": "TruthLens API Running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No JSON data received"
            }), 400

        article = data.get("article", "").strip()

        if not article:
            return jsonify({
                "error": "Article text is required"
            }), 400

        # Prevent unreliable headline-only predictions
        if len(article.split()) < 20:
            return jsonify({
                "error": (
                    "Please provide a longer article. "
                    "Headlines alone are often insufficient "
                    "for reliable analysis."
                )
            }), 400

        # Convert text into TF-IDF features
        article_vector = vectorizer.transform([article])

        # Prediction
        prediction = model.predict(article_vector)

        # Probabilities
        probabilities = model.predict_proba(article_vector)

        confidence = max(probabilities[0]) * 100

        result = LABELS[prediction[0]]

        return jsonify({
            "prediction": result,
            "confidence": round(confidence, 2),
            "fake_probability": round(
                probabilities[0][0] * 100,
                2
            ),
            "real_probability": round(
                probabilities[0][1] * 100,
                2
            ),
            "word_count": len(article.split()),
            "character_count": len(article)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port
    )