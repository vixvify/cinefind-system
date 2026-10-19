import type { Genre } from "./genre.ts";

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
