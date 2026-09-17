import { useState, useEffect } from "react";
import API from "./services/api";


function App() {
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const savedHistory =
    localStorage.getItem("truthlens-history");

  if (savedHistory) {
    setHistory(
      JSON.parse(savedHistory)
    );
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "truthlens-history",
    JSON.stringify(history)
  );
}, [history]);

  const analyzeArticle = async () => {
    if (!article.trim()) return;

    try {
      setLoading(true);

      setError("");

      const response = await API.post(
        "http://127.0.0.1:5000/predict",
        {
          article,
        }
      );

      setResult(response.data);
      setHistory((previous) => {

  const updated = [
    {
      id: Date.now(),
      prediction: response.data.prediction,
      confidence: response.data.confidence,
      preview: article.slice(0, 120),
      timestamp: new Date().toLocaleTimeString()
    },
    ...previous
  ];

  return updated.slice(0, 10);
});
    } catch (error) {
      console.error(error);
      setError(
  "Unable to analyze article. Please try again."
);
      alert("Failed to analyze article.");
    } finally {
      setLoading(false);
    }
  };

 const clearArticle = () => {
  setArticle("");
  setResult(null);
};

const getRiskLevel = (confidence) => {

  if (confidence >= 85)
    return "Low Risk";

  if (confidence >= 65)
    return "Medium Risk";

  return "High Risk";
};

const getInsights = (result) => {

  const insights = [];

  if (result.confidence >= 90) {
    insights.push(
      "The model produced a high-confidence prediction."
    );
  } else if (result.confidence >= 70) {
    insights.push(
      "The model produced a moderate-confidence prediction."
    );
  } else {
    insights.push(
      "The model confidence is relatively low."
    );
  }

  if (result.word_count >= 200) {
    insights.push(
      "The article length was sufficient for analysis."
    );
  } else {
    insights.push(
      "Short articles may reduce prediction reliability."
    );
  }

  insights.push(
    "Classification is based on textual patterns learned during training."
  );

  insights.push(
    "This result should be considered an assessment rather than a factual verification."
  );

  return insights;
};

return (
  <div className="page">

    <nav className="navbar">

  <div className="logo">
    TruthLens
  </div>

  <div className="nav-links">
    <a href="#analyze">Analyze</a>
    <a href="#about">About</a>
    <a href="#how-it-works">How It Works</a>
  </div>

</nav>

    <header className="hero">

  <div className="hero-content">

    <p className="hero-kicker">
      NEWS CREDIBILITY PLATFORM
    </p>

    <h1>
      Evaluate News With
      Context, Not Noise.
    </h1>

    <p className="hero-description">
      TruthLens uses machine learning to analyze
      news content and provide a credibility
      assessment based on textual patterns,
      helping readers make more informed decisions.
    </p>

    <a
      href="#analyze"
      className="hero-button"
    >
      Start Analysis
    </a>

  </div>

</header>



    <main className="container">

      <section className="intro">

        <p>
          Paste a news article below to receive a
          machine-learning-based credibility assessment.
        </p>

      </section>

      <section className="trust-strip">

  <div>
    Machine Learning
  </div>

  <div>
    TF-IDF Analysis
  </div>

  <div>
    Logistic Regression
  </div>

  <div>
    Credibility Scoring
  </div>

</section>

      <section
  id="analyze"
  className="analyze-section"
>

  <h2>
    Analyze An Article
  </h2>

  <p className="section-subtitle">
    Paste a complete article below for the
    most accurate assessment.
  </p>

</section>

      <textarea
       placeholder="Paste a complete news article here for analysis. Full articles generally produce more accurate assessments than headlines alone."
        value={article}
        onChange={(e) => setArticle(e.target.value)}
      />

     <div className="button-group">

  {
  error && (
    <div className="error-box">
      {error}
    </div>
  )
};

  <button
    className="analyze-btn"
    onClick={analyzeArticle}
    disabled={loading}
  >
    {loading ? "Analyzing..." : "Analyze Article"}
  </button>

  <button
    className="clear-btn"
    onClick={clearArticle}
  >
    Clear
  </button>

</div>

{!result && (
  <div className="empty-state">

    <h2>Ready for Analysis</h2>

    <p>
      Paste a news article above and click
      Analyze Article to receive a
      credibility assessment.
    </p>

  </div>
)}

      {result && (
        <div className="result-card">

          <div className="badge">
            Credibility Assessment
          </div>

         <div
  className={
    result.prediction === "Real News"
      ? "prediction real"
      : "prediction fake"
  }
>
  {result.prediction}
  <div className="risk-badge">

  {getRiskLevel(
    result.confidence
  )}

</div>
</div>

<section className="history-section">

  <h2>
    Recent Analyses
  </h2>

  <button
  className="clear-history-btn"
  onClick={() => {
    setHistory([]);
    localStorage.removeItem(
      "truthlens-history"
    );
  }}
>
  Clear History
</button>

  {history.length === 0 ? (

    <p className="history-empty">
      No analyses yet.
    </p>

  ) : (

    <div className="history-list">

      {history.map((item) => (

        <div
          key={item.id}
          className="history-item"
        >

          <div
            className={
              item.prediction === "Real News"
                ? "history-status real"
                : "history-status fake"
            }
          >
            {item.prediction}
          </div>
          <p className="history-preview">
  {item.preview}...
</p>
          <div className="history-confidence">
            {item.confidence}%
          </div>

          <div className="history-time">
            {item.timestamp}
          </div>

        </div>

      ))}

    </div>

  )}

</section>

          <div className="score-section">

  <p className="score-label">
    Credibility Score
  </p>

  <div className="score-bar">

    <div
      className="score-fill"
      style={{
        width: `${result.confidence}%`
      }}
    ></div>

  </div>

  <div className="confidence">
    {result.confidence}%
  </div>

<div className="summary-box">

  {result.prediction === "Real News"
    ? "This article shares characteristics commonly found in reliable news reporting."
    : "This article contains patterns commonly associated with misleading or unreliable content."
  }

</div>

</div>

          <hr />

          <h3>Statistics</h3>

          <p>
            Word Count: {result.word_count}
          </p>

          <p>
            Characters: {result.character_count}
          </p>

          <hr />

          <h3>Probability Breakdown</h3>

<div className="probability-grid">

  <div className="probability-card real-card">

    <div className="card-label">
      Real News
    </div>

    <div className="card-value">
      {result.real_probability}%
    </div>

  </div>

  <div className="probability-card fake-card">

    <div className="card-label">
      Fake News
    </div>

    <div className="card-value">
      {result.fake_probability}%
    </div>

  </div>

</div>

<hr />

<h3>
  Analysis Insights
</h3>

<ul className="insights-list">

  {getInsights(result).map(
    (item, index) => (
      <li key={index}>
        {item}
      </li>
    )
  )}

</ul>

<button
  className="copy-btn"
  onClick={() =>
    navigator.clipboard.writeText(
      `
Prediction: ${result.prediction}
Confidence: ${result.confidence}%
Fake Probability: ${result.fake_probability}%
Real Probability: ${result.real_probability}%
`
    )
  }
>
  Copy Analysis
</button>

        </div>
      )}

    </main>

    <section
  id="about"
  className="info-section"
>

  <h2>About TruthLens</h2>

  <p>
    TruthLens is a machine-learning-powered
    news credibility assessment platform.
    It analyzes textual patterns from news
    content and estimates whether an article
    resembles real or fake news examples.
  </p>

</section>

<section
  id="how-it-works"
  className="info-section"
>

  <h2>How It Works</h2>

  <p>
    News articles are converted into
    numerical features using TF-IDF
    vectorization. A Logistic Regression
    machine learning model then evaluates
    these features and estimates the
    likelihood of the content being real
    or fake.
  </p>

</section>

<section
  className="info-section"
>

  <h2>
    Model Information
  </h2>

  <p>
    TruthLens uses TF-IDF vectorization to
    convert article text into numerical
    features. A Logistic Regression model
    trained on thousands of news articles
    then estimates whether the content
    resembles real or fake news examples.
  </p>

</section>

<section
  className="info-section"
>

  <h2>
    Project Metrics
  </h2>

  <div className="metrics-grid">

    <div className="metric-card">
      <h3>98.88%</h3>
      <p>Model Accuracy</p>
    </div>

    <div className="metric-card">
      <h3>44,000+</h3>
      <p>Articles Trained</p>
    </div>

    <div className="metric-card">
      <h3>50,000</h3>
      <p>Vocabulary Size</p>
    </div>

  </div>

</section>

<section className="disclaimer">

  <p>
    TruthLens provides machine-learning-based
    credibility assessments and should not be
    considered a substitute for professional
    fact-checking or independent verification.
  </p>

</section>

   <footer>

  <div className="footer-title">
    TruthLens
  </div>

  <p>
    Helping readers evaluate news credibility
    through machine learning and transparent analysis.
  </p>

  <div className="footer-copy">
    © 2026 TruthLens. All rights reserved.
  </div>

</footer>

  </div>
);
}

export default App;