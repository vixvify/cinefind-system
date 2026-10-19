import ast
import pandas as pd


def extract_names(text):
    return [
        item["name"]
        for item in ast.literal_eval(text)
    ]


def extract_cast(text):
    return [
        item["name"]
        for item in ast.literal_eval(text)[:3]
    ]


def extract_director(text):
    for item in ast.literal_eval(text):
        if item["job"] == "Director":
            return [item["name"]]

    return []


def remove_spaces(items):
    return [
        item.replace(" ", "")
        for item in items
    ]


def preprocess_movies(
    movies_path: str,
    credits_path: str
):
    movies = pd.read_csv(movies_path)
    credits = pd.read_csv(credits_path)

    movies = movies.merge(
        credits,
        left_on="id",
        right_on="movie_id"
    )

    movies = movies[
        [
            "movie_id",
            "title_x",
            "overview",
            "genres",
            "keywords",
            "cast",
            "crew"
        ]
    ]

    movies = movies.rename(
        columns={"title_x": "title"}
    )

    movies = movies.dropna()

    movies["genres"] = movies["genres"].apply(extract_names)
    movies["keywords"] = movies["keywords"].apply(extract_names)
    movies["cast"] = movies["cast"].apply(extract_cast)
    movies["crew"] = movies["crew"].apply(extract_director)

    movies["overview"] = movies["overview"].apply(
        lambda x: x.split()
    )

    for column in ["genres", "keywords", "cast", "crew"]:
        movies[column] = movies[column].apply(remove_spaces)

    movies["tags"] = (
        movies["overview"]
        + movies["genres"]
        + movies["keywords"]
        + movies["cast"]
        + movies["crew"]
    )

    movies["tags"] = movies["tags"].apply(
        lambda x: " ".join(x).lower()
    )

    return movies[
        ["movie_id", "title", "tags"]
    ]