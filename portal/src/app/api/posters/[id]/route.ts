import { getDataset } from "@/lib/catalog.server";
import { resolvePosterUrl } from "@/lib/tmdb";

export const runtime = "nodejs";

const CACHE_MAX_AGE_SECONDS = 86400;

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

  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (!token && !apiKey) {
    return createUnavailableResponse();
  }

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
