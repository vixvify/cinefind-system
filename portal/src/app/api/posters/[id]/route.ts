import { getDataset } from "@/infrastructure/dataset/catalog.server";
import { resolvePosterUrl } from "@/infrastructure/tmdb/tmdb.client";
import { serverConfig } from "@/lib/config";
import { CACHE_MAX_AGE_SECONDS } from "@/core/constants/tmdb.constant";

export const runtime = "nodejs";

function createUnavailableResponse(): Response {
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

function createRedirectResponse(locationUrl: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: locationUrl,
      "Cache-Control": `public, max-age=${CACHE_MAX_AGE_SECONDS}`,
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return createUnavailableResponse();
  }

  const movieId = Number(id);
  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    return createUnavailableResponse();
  }

  if (!serverConfig.hasTmdbCredentials) {
    return createUnavailableResponse();
  }

  const token = serverConfig.tmdbReadAccessToken;
  const apiKey = serverConfig.tmdbApiKey;

  const movies = await getDataset();
  const existsInDataset = movies.some((movie) => movie.id === movieId);
  if (!existsInDataset) {
    return createUnavailableResponse();
  }

  const posterUrl = await resolvePosterUrl(
    movieId,
    { token, apiKey },
    (url, init) =>
      fetch(url, {
        ...init,
        cache: "force-cache",
        next: { revalidate: CACHE_MAX_AGE_SECONDS },
      }),
  );

  if (!posterUrl) {
    return createUnavailableResponse();
  }

  return createRedirectResponse(posterUrl);
}
