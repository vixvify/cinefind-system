import type { RecommendedMovie } from "./movie.ts";

export interface SimilarMovie {
  movieId: number;
  title: string;
  score: number;
}

export interface RecommendationResult {
  recommendations: RecommendedMovie[];
}
