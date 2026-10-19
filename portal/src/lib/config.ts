import path from "node:path";

export interface ServerConfig {
  datasetPath: string;
  tmdbReadAccessToken: string | undefined;
  tmdbApiKey: string | undefined;
  aiServiceUrl: string;
  hasTmdbCredentials: boolean;
}

function resolveDatasetPath(): string {
  if (process.env.MOVIE_DATASET_PATH) {
    return path.resolve(process.env.MOVIE_DATASET_PATH);
  }
  return path.resolve(process.cwd(), "..", "ai", "data", "raw", "tmdb_5000_movies.csv");
}

export const serverConfig: ServerConfig = {
  get datasetPath(): string {
    return resolveDatasetPath();
  },
  get tmdbReadAccessToken(): string | undefined {
    return process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  },
  get tmdbApiKey(): string | undefined {
    return process.env.TMDB_API_KEY?.trim();
  },
  get aiServiceUrl(): string {
    return process.env.AI_SERVICE_URL?.trim() || "http://ai:8000";
  },
  get hasTmdbCredentials(): boolean {
    return Boolean(
      process.env.TMDB_READ_ACCESS_TOKEN?.trim() ||
      process.env.TMDB_API_KEY?.trim(),
    );
  },
};
