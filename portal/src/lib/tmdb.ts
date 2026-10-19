export interface TmdbCredentials {
  token?: string;
  apiKey?: string;
}

const TMDB_API_BASE = "https://api.themoviedb.org/3/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const POSTER_PATH_REGEX = /^\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;
const REQUEST_TIMEOUT_MS = 5000;

export async function resolvePosterUrl(
  id: number,
  credentials: TmdbCredentials,
  customFetch: typeof fetch = fetch,
): Promise<string | null> {
  const token = credentials.token?.trim();
  const apiKey = credentials.apiKey?.trim();

  if (!Number.isSafeInteger(id) || id <= 0 || (!token && !apiKey)) {
    return null;
  }

  const url = new URL(`${TMDB_API_BASE}/${id}`);
  const headers: Record<string, string> = { Accept: "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  try {
    const response = await customFetch(url, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("poster_path" in data)) {
      return null;
    }

    const posterPath = (data as { poster_path?: unknown }).poster_path;
    if (typeof posterPath !== "string" || !POSTER_PATH_REGEX.test(posterPath)) {
      return null;
    }

    return `${TMDB_IMAGE_BASE}${posterPath}`;
  } catch {
    return null;
  }
}
