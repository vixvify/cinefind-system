import { parse } from "csv-parse/sync";
import {
  genreLabels,
  REQUIRED_DATASET_COLUMNS,
  MINIMUM_DATASET_SIZE,
  type Genre,
} from "../constants/movie.constant.ts";
import type { Movie } from "../domain/movie.ts";

interface RawMovieRecord {
  id?: string;
  title?: string;
  genres?: string;
  release_date?: string;
  vote_average?: string;
  popularity?: string;
  [key: string]: string | undefined;
}

interface ParsedMovieEntry {
  movie: Movie;
  popularity: number;
}

function parseGenres(rawJson: string | undefined): Genre[] {
  if (!rawJson) return ["Unknown"];

  try {
    const parsed: unknown = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) return ["Unknown"];

    const extracted: Genre[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const rawName = (item as { name?: unknown }).name;
      const normalizedName = rawName === "Science Fiction" ? "Sci-Fi" : rawName;

      if (
        typeof normalizedName === "string" &&
        Object.hasOwn(genreLabels, normalizedName)
      ) {
        extracted.push(normalizedName as Genre);
      }
    }

    return extracted.length > 0 ? Array.from(new Set(extracted)) : ["Unknown"];
  } catch {
    return ["Unknown"];
  }
}

function parseReleaseYear(releaseDate: string | undefined): number | null {
  if (!releaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return null;
  }
  const year = Number(releaseDate.slice(0, 4));
  return Number.isSafeInteger(year) ? year : null;
}

function formatRating(rawVoteAverage: string | undefined): string {
  const rating = Number(rawVoteAverage);
  if (Number.isFinite(rating) && rating >= 0 && rating <= 10) {
    return rating.toFixed(1);
  }
  return "—";
}

export function parseMovieDataset(csvContent: string): Movie[] {
  const records: RawMovieRecord[] = parse(csvContent, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  });

  if (!records.length) {
    throw new Error(
      `Movie dataset requires ${REQUIRED_DATASET_COLUMNS.join(", ")} columns.`,
    );
  }

  const firstRecord = records[0];
  const hasAllRequiredColumns = REQUIRED_DATASET_COLUMNS.every(
    (col) => col in firstRecord,
  );
  if (!hasAllRequiredColumns) {
    throw new Error(
      `Movie dataset requires ${REQUIRED_DATASET_COLUMNS.join(", ")} columns.`,
    );
  }

  const seenIds = new Set<number>();
  const parsedEntries: ParsedMovieEntry[] = [];

  for (const record of records) {
    const id = Number(record.id);
    const title = record.title?.trim() ?? "";

    if (!Number.isSafeInteger(id) || id <= 0 || !title || seenIds.has(id)) {
      continue;
    }

    seenIds.add(id);

    const popularity = Number(record.popularity);

    parsedEntries.push({
      movie: {
        id,
        title,
        year: parseReleaseYear(record.release_date),
        rating: formatRating(record.vote_average),
        genres: parseGenres(record.genres),
        poster: null,
      },
      popularity: Number.isFinite(popularity) ? popularity : 0,
    });
  }

  if (parsedEntries.length < MINIMUM_DATASET_SIZE) {
    throw new Error(
      `Movie dataset needs at least ${MINIMUM_DATASET_SIZE} valid movies for five selections and six recommendations.`,
    );
  }

  return parsedEntries
    .sort((a, b) => b.popularity - a.popularity || a.movie.id - b.movie.id)
    .map((entry) => entry.movie);
}
