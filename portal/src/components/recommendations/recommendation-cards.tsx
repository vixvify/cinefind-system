"use client";

import { Bookmark, Check, Star } from "lucide-react";
import { genreLabels } from "@/core/constants/movie.constant";
import type { RecommendedMovie } from "@/core/domain/movie";
import { Poster } from "../poster";

interface FeaturedMovieProps {
  movie: RecommendedMovie;
  isSaved: boolean;
  onToggleSaved: (id: number) => void;
}

export function FeaturedMovieBanner({
  movie,
  isSaved,
  onToggleSaved,
}: FeaturedMovieProps) {
  return (
    <section
      className="relative isolate overflow-hidden rounded-xl border border-line bg-surface"
      aria-label="หนังแนะนำอันดับหนึ่ง"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-1 opacity-15 blur-3xl"
        aria-hidden="true"
      >
        <Poster movie={movie} eager />
      </div>

      <div className="grid grid-cols-[1fr_110px] items-center gap-5 p-5 sm:grid-cols-[1fr_200px] sm:gap-10 sm:p-9 lg:px-12">
        <div>
          <span className="text-[10px] text-lime font-medium">แนะนำสำหรับคุณ</span>
          <h2 className="mt-3 text-2xl leading-tight font-medium sm:text-4xl">
            {movie.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <span className="flex items-center gap-1 text-[#e5d594]">
              <Star size={12} fill="currentColor" /> {movie.rating}
            </span>
            {movie.year && (
              <>
                <span>·</span>
                <span>{movie.year}</span>
              </>
            )}
            {movie.genres.length > 0 && (
              <>
                <span>·</span>
                <span>{genreLabels[movie.genres[0]]}</span>
              </>
            )}
          </div>

          <p className="mt-4 max-w-md text-xs leading-6 text-paper/75">
            {movie.reason}
          </p>

          <button
            type="button"
            className="primary-button mt-5 px-4 py-2.5 text-xs"
            aria-pressed={isSaved}
            onClick={() => onToggleSaved(movie.id)}
          >
            {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
            {isSaved ? "เก็บแล้ว" : "เก็บไว้ดู"}
          </button>
        </div>

        <div className="rotate-3 overflow-hidden rounded-md border-2 border-white/10 shadow-2xl">
          <Poster movie={movie} eager />
        </div>
      </div>
    </section>
  );
}

interface RecommendedCardProps {
  movie: RecommendedMovie;
  isSaved: boolean;
  onToggleSaved: (id: number) => void;
}

export function RecommendedCard({
  movie,
  isSaved,
  onToggleSaved,
}: RecommendedCardProps) {
  return (
    <article className="min-w-0">
      <div className="movie-image">
        <Poster movie={movie} />
        <button
          type="button"
          className={`absolute top-2 right-2 z-2 grid size-8 place-items-center rounded-full border transition-colors ${
            isSaved
              ? "border-lime bg-lime text-cinema"
              : "border-white/30 bg-cinema/80 text-paper hover:border-white/60"
          }`}
          aria-label={`${isSaved ? "เลิกเก็บ" : "เก็บไว้ดู"} ${movie.title}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSaved(movie.id)}
        >
          <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="mt-3 text-sm leading-6 font-medium truncate">
        {movie.title}
      </h3>

      <p className="mt-1 text-[11px] text-muted">
        {movie.year && <span>{movie.year}</span>}
        {movie.year && movie.genres.length > 0 && <span> · </span>}
        {movie.genres.length > 0 && <span>{genreLabels[movie.genres[0]]}</span>}
      </p>
    </article>
  );
}

