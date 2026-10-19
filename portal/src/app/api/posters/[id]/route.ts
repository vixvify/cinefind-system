import { getDataset } from "@/lib/catalog.server";
import { resolvePosterUrl } from "@/lib/tmdb";

export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const movieId = Number(id);
  const unavailable = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(movieId) || movieId <= 0) return unavailable();
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!token?.trim() && !apiKey?.trim()) return unavailable();
  const movies = await getDataset();
  if (!movies.some(movie => movie.id === movieId)) return unavailable();
  const poster = await resolvePosterUrl(movieId, { token, apiKey }, (url, init) => fetch(url, {
    ...init, cache: "force-cache", next: { revalidate: 86400 },
  }));
  if (!poster) return unavailable();
  return new Response(null, { status: 302, headers: { Location: poster, "Cache-Control": "public, max-age=86400" } });
}
