import {
  TMDB_API_BASE,
  TMDB_IMAGE_BASE,
  POSTER_PATH_REGEX,
  REQUEST_TIMEOUT_MS,
} from "../core/constants/tmdb.constant.ts";
import type { TmdbCredentials } from "../core/domain/tmdb.ts";

export type { TmdbCredentials };

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
