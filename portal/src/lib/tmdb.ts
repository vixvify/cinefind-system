type Credentials = { token?: string; apiKey?: string };
export async function resolvePosterUrl(
  id: number,
  credentials: Credentials,
  request: typeof fetch = fetch,
): Promise<string | null> {
  const token = credentials.token?.trim();
  const apiKey = credentials.apiKey?.trim();
  if (!Number.isSafeInteger(id) || id <= 0 || (!token && !apiKey)) return null;
  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  else url.searchParams.set("api_key", apiKey!);
  try {
    const response = await request(url, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const movie: unknown = await response.json();
    const posterPath =
      typeof movie === "object" && movie !== null && "poster_path" in movie
        ? movie.poster_path
        : null;
    if (
      typeof posterPath !== "string" ||
      !/^\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(posterPath)
    )
      return null;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  } catch {
    return null;
  }
}
