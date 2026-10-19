export const genreLabels = {
  Action: "แอ็กชัน",
  Adventure: "ผจญภัย",
  Animation: "แอนิเมชัน",
  Comedy: "คอมเมดี้",
  Crime: "อาชญากรรม",
  Documentary: "สารคดี",
  Drama: "ดราม่า",
  Family: "ครอบครัว",
  Fantasy: "แฟนตาซี",
  History: "ประวัติศาสตร์",
  Horror: "สยองขวัญ",
  Music: "ดนตรี",
  Mystery: "ลึกลับ",
  Romance: "โรแมนติก",
  "Sci-Fi": "ไซไฟ",
  "TV Movie": "ภาพยนตร์โทรทัศน์",
  Thriller: "ระทึกขวัญ",
  War: "สงคราม",
  Western: "คาวบอย",
  Unknown: "อื่น ๆ",
} as const;

export type Genre = keyof typeof genreLabels;

export interface Movie {
  id: number;
  title: string;
  year: number | null;
  rating: string;
  genres: Genre[];
  poster: string | null;
}

export interface RecommendedMovie extends Movie {
  score: number;
  reason: string;
}

export const browseGenres: Genre[] = [
  "Action",
  "Sci-Fi",
  "Drama",
  "Thriller",
  "Animation",
  "Romance",
  "Comedy",
];

export const SELECTION_LIMIT = 5;
export const RECOMMENDATION_LIMIT = 6;
export const DEFAULT_PAGE_SIZE = 12;

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

export function recommend(selected: Movie[], movies: Movie[]): RecommendedMovie[] {
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

    const reason = matchedGenres.length > 0
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
