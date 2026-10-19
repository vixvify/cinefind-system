from app.recommender.content_based import ContentBasedRecommender


recommender = ContentBasedRecommender(
    "data/processed/movies.csv"
)

results = recommender.recommend(
    "Interstellar",
    top_k=5
)

for movie in results:
    print(movie)