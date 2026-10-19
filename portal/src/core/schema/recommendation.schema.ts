import { SELECTION_LIMIT } from "../constants/movie.constant.ts";
import type { SimilarMovie } from "../domain/recommendation.ts";
import { RecommendationError } from "../errors/recommendation.error.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseRecommendationInput(value: unknown): number[] {
  const ids = isRecord(value) ? value.movieIds : undefined;
  if (
    !Array.isArray(ids) || ids.length !== SELECTION_LIMIT ||
    !ids.every(id => typeof id === "number" && Number.isSafeInteger(id) && id > 0) ||
    new Set(ids).size !== SELECTION_LIMIT
  ) {
    throw new RecommendationError("INVALID_SELECTION");
  }
  return ids;
}

export function parseAiRecommendations(value: unknown, title: string, limit: number): SimilarMovie[] {
  if (
    !isRecord(value) || value.movie !== title ||
    !Array.isArray(value.recommendations) || value.recommendations.length > limit
  ) {
    throw new RecommendationError("INVALID_AI_RESPONSE");
  }

  return value.recommendations.map(item => {
    if (
      !isRecord(item) || typeof item.movie_id !== "number" ||
      !Number.isSafeInteger(item.movie_id) || item.movie_id <= 0 ||
      typeof item.title !== "string" || !item.title.trim() || item.title.length > 1000 ||
      typeof item.score !== "number" || !Number.isFinite(item.score) || item.score < 0 || item.score > 1
    ) {
      throw new RecommendationError("INVALID_AI_RESPONSE");
    }
    return { movieId: item.movie_id, title: item.title, score: item.score };
  });
}
