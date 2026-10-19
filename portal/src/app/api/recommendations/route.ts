import { getRecommendationService } from "@/infrastructure/container";
import { createRecommendationHandler } from "@/infrastructure/http/recommendation.handler";

export const runtime = "nodejs";
export const POST = createRecommendationHandler(getRecommendationService);
