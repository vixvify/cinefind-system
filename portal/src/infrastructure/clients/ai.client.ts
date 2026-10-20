import type { RecommendationSource } from "../../core/ports/recommendation-source.ts";
import { RecommendationError } from "../../core/errors/recommendation.error.ts";
import { parseAiRecommendations } from "../../core/schema/recommendation.schema.ts";

interface AiClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export function createAiClient(options: AiClientOptions, request: typeof fetch = fetch): RecommendationSource {
  return {
    async recommend(movieIds, limit, signal) {
      const timeout = AbortSignal.timeout(options.timeoutMs ?? 10_000);
      const url = new URL(`${options.baseUrl.replace(/\/$/, "")}/recommendations`);

      try {
        const response = await request(url, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ movie_ids: movieIds, limit }),
          cache: "no-store",
          signal: AbortSignal.any([signal, timeout]),
        });
        if (response.status === 404 || response.status === 422) throw new RecommendationError("MOVIE_NOT_SUPPORTED");
        if (!response.ok) throw new RecommendationError("AI_UNAVAILABLE");
        const payload: unknown = await response.json().catch(() => {
          throw new RecommendationError("INVALID_AI_RESPONSE");
        });
        return parseAiRecommendations(payload, limit);
      } catch (error) {
        if (signal.aborted) throw error;
        if (timeout.aborted) throw new RecommendationError("AI_TIMEOUT");
        if (error instanceof RecommendationError) throw error;
        throw new RecommendationError("AI_UNAVAILABLE");
      }
    },
  };
}
