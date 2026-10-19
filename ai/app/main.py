from fastapi import FastAPI, HTTPException

from app.recommender.content_based import ContentBasedRecommender


app = FastAPI(
    title="CineFind AI",
    version="1.0.0"
)

recommender = ContentBasedRecommender(
    "data/processed/movies.csv"
)


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/recommendations")
def recommendations(
    title: str,
    limit: int = 10
):
    results = recommender.recommend(
        title,
        top_k=limit
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail="Movie not found"
        )

    return {
        "movie": title,
        "recommendations": results
    }