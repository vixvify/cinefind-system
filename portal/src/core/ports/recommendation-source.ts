import type { SimilarMovie } from "../domain/recommendation.ts";

export interface RecommendationSource {
  recommend(movieIds: number[], limit: number, signal: AbortSignal): Promise<SimilarMovie[]>;
}
