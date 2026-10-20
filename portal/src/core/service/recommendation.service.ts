import {
  RECOMMENDATION_LIMIT,
} from "../constants/movie.constant.ts";
import type { Movie, RecommendedMovie } from "../domain/movie.ts";
import type { RecommendationSource } from "../ports/recommendation-source.ts";
import { RecommendationError } from "../errors/recommendation.error.ts";
import { parseRecommendationInput } from "../schema/recommendation.schema.ts";

interface Dependencies {
  loadCatalog(): Promise<Movie[]>;
  source: RecommendationSource;
}

export function createRecommendationService({
  loadCatalog,
  source,
}: Dependencies) {
  return {
    async recommend(
      movieIds: number[],
      signal: AbortSignal,
    ): Promise<RecommendedMovie[]> {
      const ids = parseRecommendationInput({ movieIds });
      const catalog = new Map(
        (await loadCatalog()).map((movie) => [movie.id, movie]),
      );
      const selected = ids.map((id) => catalog.get(id));
      if (selected.some((movie) => !movie))
        throw new RecommendationError("INVALID_SELECTION");

      const candidates = await source.recommend(ids, RECOMMENDATION_LIMIT, signal);
      const selectedIds = new Set(ids);
      const results: RecommendedMovie[] = [];
      const seen = new Set<number>();
      for (const candidate of candidates) {
        const movie = catalog.get(candidate.movieId);
        if (!movie || selectedIds.has(movie.id) || seen.has(movie.id)) continue;
        seen.add(movie.id);
        results.push({
          ...movie,
          score: candidate.score,
          reason: "จากหนัง 5 เรื่องที่คุณเลือก",
        });
      }
      return results;
    },
  };
}
