import {
  genreLabels,
  SELECTION_LIMIT,
  RECOMMENDATION_LIMIT,
  DEFAULT_PAGE_SIZE,
  browseGenres,
  ANALYSIS_STAGES,
  ANALYSIS_DURATION_MS,
  ANALYSIS_TICK_MS,
  type Genre,
} from "../core/constants/movie.constant.ts";
import type { Movie, RecommendedMovie } from "../core/domain/movie.ts";

export {
  genreLabels,
  browseGenres,
  SELECTION_LIMIT,
  RECOMMENDATION_LIMIT,
  DEFAULT_PAGE_SIZE,
  ANALYSIS_STAGES,
  ANALYSIS_DURATION_MS,
  ANALYSIS_TICK_MS,
};

export type { Genre, Movie, RecommendedMovie };

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

