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
    const value = process.env.AI_SERVICE_URL?.trim() || "http://127.0.0.1:8000";
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error("AI_SERVICE_URL must be an HTTP(S) base URL without credentials, query or fragment.");
    }
    return url.toString().replace(/\/$/, "");
  },
  get hasTmdbCredentials(): boolean {
    return Boolean(
      process.env.TMDB_READ_ACCESS_TOKEN?.trim() ||
      process.env.TMDB_API_KEY?.trim(),
    );
  },
};
