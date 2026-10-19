import type { RecommendationSource } from "../../core/ports/recommendation-source.ts";
import { RecommendationError } from "../../core/errors/recommendation.error.ts";
import { parseAiRecommendations } from "../../core/schema/recommendation.schema.ts";

interface AiClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export function createAiClient(options: AiClientOptions, request: typeof fetch = fetch): RecommendationSource {
  return {
    async findSimilar(title, limit, signal) {
      const timeout = AbortSignal.timeout(options.timeoutMs ?? 10_000);
      const url = new URL(`${options.baseUrl.replace(/\/$/, "")}/recommendations`);
      url.searchParams.set("title", title);
      url.searchParams.set("limit", String(limit));

      try {
        const response = await request(url, {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.any([signal, timeout]),
        });
        if (response.status === 404) throw new RecommendationError("MOVIE_NOT_SUPPORTED");
        if (!response.ok) throw new RecommendationError("AI_UNAVAILABLE");
        const payload: unknown = await response.json().catch(() => {
          throw new RecommendationError("INVALID_AI_RESPONSE");
        });
        return parseAiRecommendations(payload, title, limit);
      } catch (error) {
        if (signal.aborted) throw error;
        if (timeout.aborted) throw new RecommendationError("AI_TIMEOUT");
        if (error instanceof RecommendationError) throw error;
        throw new RecommendationError("AI_UNAVAILABLE");
      }
    },
  };
}
