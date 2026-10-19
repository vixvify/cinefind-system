import {
  genreLabels,
  RECOMMENDATION_LIMIT,
  type Genre,
} from "../constants/movie.constant.ts";
import type { Movie, RecommendedMovie } from "../domain/movie.ts";

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
