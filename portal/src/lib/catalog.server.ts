import "server-only";
import { readFile, stat } from "node:fs/promises";
import { serverConfig } from "./config.ts";
import { parseMovieDataset } from "./dataset.ts";
import { API_ROUTES } from "../routes/routes.ts";
import type { Movie } from "../core/domain/movie.ts";

interface CachedDataset {
  filePath: string;
  mtimeMs: number;
  size: number;
  movies: Movie[];
}

let datasetCache: CachedDataset | null = null;

export async function getDataset(): Promise<Movie[]> {
  const filePath = serverConfig.datasetPath;

  try {
    const fileStat = await stat(filePath);

    if (
      datasetCache &&
      datasetCache.filePath === filePath &&
      datasetCache.mtimeMs === fileStat.mtimeMs &&
      datasetCache.size === fileStat.size
    ) {
      return datasetCache.movies;
    }

    const fileContent = await readFile(filePath, "utf8");
    const movies = parseMovieDataset(fileContent);

    datasetCache = {
      filePath,
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
      movies,
    };

    return movies;
  } catch (error) {
    throw new Error(
      "Cannot load movie dataset. Check MOVIE_DATASET_PATH and the tmdb_5000_movies.csv file or Docker data mount.",
      { cause: error },
    );
  }
}

export async function getCatalog(): Promise<Movie[]> {
  const movies = await getDataset();
  const hasPosters = serverConfig.hasTmdbCredentials;

  return movies.map((movie) => ({
    ...movie,
    poster: hasPosters ? API_ROUTES.POSTER(movie.id) : null,
  }));
}
