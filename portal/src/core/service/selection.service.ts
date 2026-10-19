import { SELECTION_LIMIT } from "../constants/movie.constant.ts";
import type { Movie } from "../domain/movie.ts";

export function parseSelection(value: string | null, movies: Movie[]): Movie[] {
  if (!value) return [];

  const rawIds = value
    .split(",")
    .map((s) => s.trim())
    .filter((id) => /^\d+$/.test(id))
    .map(Number);

  const uniqueIds = Array.from(new Set(rawIds));
  const movieMap = new Map(movies.map((movie) => [movie.id, movie]));

  const result: Movie[] = [];
  for (const id of uniqueIds) {
    const movie = movieMap.get(id);
    if (movie) {
      result.push(movie);
      if (result.length >= SELECTION_LIMIT) break;
    }
  }

  return result;
}
