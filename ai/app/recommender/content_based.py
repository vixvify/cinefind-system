import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class ContentBasedRecommender:
    def __init__(self, data_path: str):
        self.movies = pd.read_csv(data_path)

        self.tfidf = TfidfVectorizer(
            max_features=5000,
            stop_words="english"
        )

        self.vectors = self.tfidf.fit_transform(
            self.movies["tags"]
        )

    def recommend(self, title: str, top_k: int = 10):
        matches = self.movies[
            self.movies["title"].str.lower() == title.lower()
        ]

        if matches.empty:
            return []

        movie_index = matches.index[0]

        scores = cosine_similarity(
            self.vectors[movie_index],
            self.vectors
        ).flatten()

        ranked_indices = scores.argsort()[::-1]

        recommendations = []

        for index in ranked_indices:
            if index == movie_index:
                continue

            recommendations.append({
                "movie_id": int(
                    self.movies.iloc[index]["movie_id"]
                ),
                "title": self.movies.iloc[index]["title"],
                "score": round(float(scores[index]), 3)
            })

            if len(recommendations) == top_k:
                break

        return recommendations