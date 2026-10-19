import "server-only";
import { getCatalog } from "../lib/catalog.server";
import { serverConfig } from "../lib/config";
import { createAiClient } from "./clients/ai.client";
import { createRecommendationService } from "../core/service/recommendation.service";

export function getRecommendationService() {
  return createRecommendationService({
    loadCatalog: getCatalog,
    source: createAiClient({ baseUrl: serverConfig.aiServiceUrl }),
  });
}
