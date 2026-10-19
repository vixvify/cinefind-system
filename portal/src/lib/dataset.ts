import { parse } from "csv-parse/sync";
import { genreLabels, type Genre, type Movie } from "./movies.ts";

export function parseMovieDataset(csv: string): Movie[] {
  const rows: Record<string, string>[] = parse(csv, { bom: true, columns: true, skip_empty_lines: true });
  if (!rows.length || !["id", "title", "genres", "release_date", "vote_average"].every(column => column in rows[0])) {
    throw new Error("Movie dataset requires id, title, genres, release_date and vote_average columns.");
  }
  const seen = new Set<number>();
  const normalized = rows.flatMap(row => {
    const id = Number(row.id);
    const title = row.title.trim();
    if (!Number.isSafeInteger(id) || id <= 0 || !title || seen.has(id)) return [];
    let rawGenres: unknown;
    try { rawGenres = JSON.parse(row.genres || "[]"); } catch { rawGenres = []; }
    const genres: Genre[] = Array.isArray(rawGenres) ? rawGenres.flatMap(item => {
      const name = item?.name === "Science Fiction" ? "Sci-Fi" : item?.name;
      return typeof name === "string" && Object.hasOwn(genreLabels, name) ? [name as Genre] : [];
    }) : [];
    const year = /^\d{4}-\d{2}-\d{2}$/.test(row.release_date) ? Number(row.release_date.slice(0, 4)) : null;
    const rating = Number(row.vote_average);
    const popularity = Number(row.popularity);
    seen.add(id);
    return [{ movie: { id, title, year, rating: Number.isFinite(rating) && rating >= 0 && rating <= 10 ? rating.toFixed(1) : "—", genres: genres.length ? [...new Set(genres)] : ["Unknown"] as Genre[], poster: null } satisfies Movie, popularity: Number.isFinite(popularity) ? popularity : 0 }];
  });
  const movies = normalized.sort((a, b) => b.popularity - a.popularity || a.movie.id - b.movie.id).map(item => item.movie);
  if (movies.length < 11) throw new Error("Movie dataset needs at least 11 valid movies for five selections and six recommendations.");
  return movies;
}
