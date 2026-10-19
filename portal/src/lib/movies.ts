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

export function recommend(
  selected: Movie[],
  movies: Movie[],
): RecommendedMovie[] {
  const genreWeights = new Map<Genre, number>();

  for (const movie of selected) {
    for (const genre of movie.genres) {
      if (genre !== "Unknown") {
        genreWeights.set(genre, (genreWeights.get(genre) ?? 0) + 1);
      }
    }
  }

  const selectedIdSet = new Set(selected.map((movie) => movie.id));
  const scoredMovies: RecommendedMovie[] = [];

  for (const movie of movies) {
    if (selectedIdSet.has(movie.id)) continue;

    const matchedGenres = movie.genres
      .filter((genre) => genreWeights.has(genre))
      .sort((a, b) => (genreWeights.get(b) ?? 0) - (genreWeights.get(a) ?? 0));

    const score = matchedGenres.reduce(
      (sum, genre) => sum + (genreWeights.get(genre) ?? 0),
      0,
    );

    const reason =
      matchedGenres.length > 0
        ? `เพราะคุณชอบหนัง${matchedGenres
            .slice(0, 2)
            .map((genre) => genreLabels[genre])
            .join("และ")}`
        : "ลองเปิดประสบการณ์กับหนังแนวใหม่";

    scoredMovies.push({
      ...movie,
      score,
      reason,
    });
  }

  return scoredMovies
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;

      const ratingDiff = Number(b.rating) - Number(a.rating);
      if (ratingDiff !== 0) return ratingDiff;

      return a.id - b.id;
    })
    .slice(0, RECOMMENDATION_LIMIT);
}
