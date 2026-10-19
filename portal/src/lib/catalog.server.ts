import "server-only";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parseMovieDataset } from "./dataset";
import type { Movie } from "./movies";

interface CachedDataset {
  filePath: string;
  mtimeMs: number;
  size: number;
  movies: Movie[];
}

let datasetCache: CachedDataset | null = null;

function resolveDatasetPath(): string {
  if (process.env.MOVIE_DATASET_PATH) {
    return path.resolve(process.env.MOVIE_DATASET_PATH);
  }
  return path.resolve(process.cwd(), "..", "ai", "data", "raw", "tmdb_5000_movies.csv");
}

export async function getDataset(): Promise<Movie[]> {
  const filePath = resolveDatasetPath();

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
  const hasTmdbCredentials = Boolean(
    process.env.TMDB_READ_ACCESS_TOKEN?.trim() ||
    process.env.TMDB_API_KEY?.trim(),
  );

  return movies.map((movie) => ({
    ...movie,
    poster: hasTmdbCredentials ? `/api/posters/${movie.id}` : null,
  }));
}
