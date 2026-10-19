import type { SimilarMovie } from "../domain/recommendation.ts";

export interface RecommendationSource {
  findSimilar(title: string, limit: number, signal: AbortSignal): Promise<SimilarMovie[]>;
}
