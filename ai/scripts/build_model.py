import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from app.recommender.preprocess import preprocess_movies


DATA_PATH = "data/processed/movies.csv"

VECTORIZER_PATH = "models/tfidf_vectorizer.pkl"
VECTORS_PATH = "models/movie_vectors.pkl"


def main():
    print("Loading movies...")

    movies = preprocess_movies(
        "data/raw/tmdb_5000_movies.csv",
        "data/raw/tmdb_5000_credits.csv"
    )

    movies.to_csv(
        "data/processed/movies.csv",
        index=False
    )

    print("Building TF-IDF...")

    tfidf = TfidfVectorizer(
        max_features=5000,
        stop_words="english"
    )

    vectors = tfidf.fit_transform(
        movies["tags"]
    )

    print(f"Movies: {len(movies)}")
    print(f"Vector shape: {vectors.shape}")

    print("Saving model artifacts...")

    joblib.dump(
        tfidf,
        VECTORIZER_PATH
    )

    joblib.dump(
        vectors,
        VECTORS_PATH
    )

    print("Done!")


if __name__ == "__main__":
    main()