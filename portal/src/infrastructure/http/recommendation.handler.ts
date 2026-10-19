import type { RecommendedMovie } from "../../core/domain/movie.ts";
import { RecommendationError } from "../../core/errors/recommendation.error.ts";
import { parseRecommendationInput } from "../../core/schema/recommendation.schema.ts";

interface RecommendationService {
  recommend(ids: number[], signal: AbortSignal): Promise<RecommendedMovie[]>;
}

export function createRecommendationHandler(
  getService: () => RecommendationService,
) {
  return async (request: Request): Promise<Response> => {
    const headers = { "Cache-Control": "no-store" };
    try {
      const payload: unknown = await request.json().catch(() => {
        throw new RecommendationError("INVALID_SELECTION");
      });
      const movieIds = parseRecommendationInput(payload);
      const recommendations = await getService().recommend(
        movieIds,
        request.signal,
      );
      return Response.json({ recommendations }, { headers });
    } catch (error) {
      const failure =
        error instanceof RecommendationError
          ? error
          : new RecommendationError("AI_UNAVAILABLE");
      return Response.json(
        { error: { code: failure.code, message: failure.message } },
        { status: failure.status, headers },
      );
    }
  };
}
