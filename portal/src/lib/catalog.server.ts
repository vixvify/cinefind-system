import "server-only";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parseMovieDataset } from "./dataset";
import type { Movie } from "./movies";

let cached: { path: string; modified: number; size: number; movies: Movie[] } | undefined;
export async function getDataset(): Promise<Movie[]> {
  const filename = path.resolve(process.env.MOVIE_DATASET_PATH || path.join(process.cwd(), "..", "ai", "data", "raw", "tmdb_5000_movies.csv"));
  try {
    const info = await stat(filename);
    if (cached?.path === filename && cached.modified === info.mtimeMs && cached.size === info.size) return cached.movies;
    const movies = parseMovieDataset(await readFile(filename, "utf8"));
    cached = { path: filename, modified: info.mtimeMs, size: info.size, movies };
    return movies;
  } catch {
    throw new Error("Cannot load movie dataset. Check MOVIE_DATASET_PATH and the tmdb_5000_movies.csv file or Docker data mount.");
  }
}

export async function getCatalog(): Promise<Movie[]> {
  const movies = await getDataset();
  const postersEnabled = Boolean(process.env.TMDB_READ_ACCESS_TOKEN?.trim() || process.env.TMDB_API_KEY?.trim());
  return movies.map(movie => ({ ...movie, poster: postersEnabled ? `/api/posters/${movie.id}` : null }));
}
