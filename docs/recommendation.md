# Recommendation System

## Overview

CineFind uses Content-Based Filtering to recommend
movies based on their metadata.

## Features

- Genres
- Keywords
- Cast
- Director
- Overview

## Algorithm

1. Load TMDB movie metadata.
2. Clean and preprocess movie features.
3. Combine selected text features.
4. Convert text into vectors using TF-IDF.
5. Calculate similarity using Cosine Similarity.
6. Return the Top-K most similar movies.

## Evaluation

- Recommendation relevance
- Precision@K (if evaluation labels are available)
- Diversity
- Response latency
