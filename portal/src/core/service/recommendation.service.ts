import { RECOMMENDATION_LIMIT, SELECTION_LIMIT } from "../constants/movie.constant.ts";
import type { Movie, RecommendedMovie } from "../domain/movie.ts";
import type { RecommendationSource } from "../ports/recommendation-source.ts";
import { RecommendationError } from "../errors/recommendation.error.ts";
import { parseRecommendationInput } from "../schema/recommendation.schema.ts";

interface Dependencies {
  loadCatalog(): Promise<Movie[]>;
  source: RecommendationSource;
}

export function createRecommendationService({ loadCatalog, source }: Dependencies) {
  return {
    async recommend(movieIds: number[], signal: AbortSignal): Promise<RecommendedMovie[]> {
      const ids = parseRecommendationInput({ movieIds });
      const catalog = new Map((await loadCatalog()).map(movie => [movie.id, movie]));
      const selected = ids.map(id => catalog.get(id));
      if (selected.some(movie => !movie)) throw new RecommendationError("INVALID_SELECTION");

      const controller = new AbortController();
      const requestSignal = AbortSignal.any([signal, controller.signal]);
      // Fetch extra candidates because the other selected films may also be returned.
      const candidateLimit = RECOMMENDATION_LIMIT + SELECTION_LIMIT;
      try {
        const batches = await Promise.all(selected.map(async movie => {
          if (!movie) throw new RecommendationError("INVALID_SELECTION");
          const candidates = await source.findSimilar(movie.title, candidateLimit, requestSignal);
          return { seed: movie, candidates };
        }));
        const selectedIds = new Set(ids);
        const byId = new Map<number, RecommendedMovie>();

        for (const { seed, candidates } of batches) {
          for (const candidate of candidates) {
            const movie = catalog.get(candidate.movieId);
            if (!movie || selectedIds.has(movie.id)) continue;
            const previous = byId.get(movie.id);
            // Keep the strongest AI-provided match; never compute a local similarity score.
            if (!previous || candidate.score > previous.score) {
              byId.set(movie.id, {
                ...movie,
                score: candidate.score,
                reason: `ใกล้เคียงกับ ${seed.title}`,
              });
            }
          }
        }
        return [...byId.values()].sort((a, b) => b.score - a.score || a.id - b.id).slice(0, RECOMMENDATION_LIMIT);
      } catch (error) {
        controller.abort();
        throw error;
      }
    },
  };
}
