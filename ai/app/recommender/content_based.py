import joblib
import pandas as pd
import numpy as np

from sklearn.metrics.pairwise import cosine_similarity


class ContentBasedRecommender:
    def __init__(
        self,
        data_path: str,
        vectorizer_path: str,
        vectors_path: str
    ):
        self.movies = pd.read_csv(data_path)

        self.tfidf = joblib.load(vectorizer_path)
        self.vectors = joblib.load(vectors_path)

    def recommend_from_movies(
        self,
        movie_ids: list[int],
        top_k: int = 6
    ):
        selected_indices = self.movies.index[
            self.movies["movie_id"].isin(movie_ids)
        ].tolist()

        if len(selected_indices) != len(movie_ids):
            return []

        selected_vectors = self.vectors[selected_indices]

        preference_vector = np.asarray(
            selected_vectors.mean(axis=0)
        )

        scores = cosine_similarity(
            preference_vector,
            self.vectors
        ).flatten()

        ranked_indices = scores.argsort()[::-1]

        selected_ids = set(movie_ids)
        recommendations = []

        for index in ranked_indices:
            movie = self.movies.iloc[index]
            movie_id = int(movie["movie_id"])

            if movie_id in selected_ids:
                continue

            recommendations.append({
                "movie_id": movie_id,
                "title": movie["title"],
                "score": round(float(scores[index]), 3)
            })

            if len(recommendations) == top_k:
                break

        return recommendations