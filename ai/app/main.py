from typing import Annotated

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

from app.recommender.content_based import ContentBasedRecommender


class RecommendationRequest(BaseModel):
    movie_ids: list[
        Annotated[int, Field(strict=True, gt=0)]
    ] = Field(
        min_length=5,
        max_length=5
    )

    limit: int = Field(
        default=6,
        ge=1,
        le=20
    )

    @field_validator("movie_ids")
    @classmethod
    def require_unique_movies(
        cls,
        movie_ids: list[int]
    ) -> list[int]:
        if len(set(movie_ids)) != len(movie_ids):
            raise ValueError(
                "Choose five different movies"
            )

        return movie_ids


app = FastAPI(
    title="CineFind AI",
    version="1.1.0"
)


recommender = ContentBasedRecommender(
    data_path="data/processed/movies.csv",
    vectorizer_path="models/tfidf_vectorizer.pkl",
    vectors_path="models/movie_vectors.pkl",
)


movie_titles = dict(
    zip(
        recommender.movies["movie_id"],
        recommender.movies["title"]
    )
)


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/recommendations")
def recommendations(
    request: RecommendationRequest
):
    if any(
        movie_id not in movie_titles
        for movie_id in request.movie_ids
    ):
        raise HTTPException(
            status_code=422,
            detail="Movie not found"
        )

    results = recommender.recommend_from_movies(
        movie_ids=request.movie_ids,
        top_k=request.limit
    )

    return {
        "recommendations": results
    }