"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, Check, RotateCcw, Star } from "lucide-react";
import {
  genreLabels,
  SELECTION_LIMIT,
} from "@/core/constants/movie.constant";
import type { RecommendedMovie } from "@/core/domain/movie";
import { parseSelection, recommend } from "@/lib/movies";
import { buildHomeWithFavoritesUrl } from "@/routes/routes";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";
import { SelectionRequired } from "./selection-required";
import { useMovies } from "./catalog-provider";

interface FeaturedMovieProps {
  movie: RecommendedMovie;
  isSaved: boolean;
  onToggleSaved: (id: number) => void;
}

function FeaturedMovieBanner({
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

function RecommendedCard({
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

export function Results() {
  const movies = useMovies();
  const searchParams = useSearchParams();

  const selectedMovies = useMemo(() => {
    return parseSelection(searchParams.get("favorites"), movies);
  }, [searchParams, movies]);

  const recommendations = useMemo(() => {
    if (selectedMovies.length !== SELECTION_LIMIT) return [];
    return recommend(selectedMovies, movies);
  }, [selectedMovies, movies]);

  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const selectedIds = useMemo(() => {
    return selectedMovies.map((movie) => movie.id);
  }, [selectedMovies]);

  const featuredMovie = recommendations[0];

  const displayedList = useMemo(() => {
    if (showSavedOnly) {
      return recommendations.filter((movie) => savedIds.includes(movie.id));
    }
    return recommendations.slice(1);
  }, [showSavedOnly, recommendations, savedIds]);

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  if (selectedMovies.length !== SELECTION_LIMIT || !featuredMovie) {
    return (
      <>
        <Header />
        <main className="page">
          <SelectionRequired />
          <Footer />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page">
        <div className="flex flex-wrap items-center justify-between gap-3 py-8 sm:py-10">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            หนังที่คุณน่าจะชอบ<span className="text-lime">.</span>
          </h1>

          <Link
            href={buildHomeWithFavoritesUrl(selectedIds)}
            className="flex items-center gap-2 text-xs text-muted hover:text-paper"
          >
            <RotateCcw size={14} /> เลือกใหม่
          </Link>
        </div>

        <FeaturedMovieBanner
          movie={featuredMovie}
          isSaved={savedIds.includes(featuredMovie.id)}
          onToggleSaved={toggleSaved}
        />

        <section className="py-8">
          <div className="genre-tabs mb-6">
            <button
              type="button"
              className={!showSavedOnly ? "active" : ""}
              aria-pressed={!showSavedOnly}
              onClick={() => setShowSavedOnly(false)}
            >
              แนะนำเพิ่มเติม
            </button>
            <button
              type="button"
              className={showSavedOnly ? "active" : ""}
              aria-pressed={showSavedOnly}
              onClick={() => setShowSavedOnly(true)}
            >
              เก็บไว้ดู ({savedIds.length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
            {displayedList.map((movie) => (
              <RecommendedCard
                key={movie.id}
                movie={movie}
                isSaved={savedIds.includes(movie.id)}
                onToggleSaved={toggleSaved}
              />
            ))}
          </div>

          {showSavedOnly && displayedList.length === 0 && (
            <div className="empty-state">
              <Bookmark size={28} />
              <h3>ยังไม่มีหนังที่เก็บไว้</h3>
              <button
                type="button"
                className="text-button text-xs"
                onClick={() => setShowSavedOnly(false)}
              >
                กลับไปดูหนังแนะนำ
              </button>
            </div>
          )}

          {showSavedOnly && (
            <p className="mt-5 text-[10px] text-muted">
              เก็บไว้เฉพาะการเปิดหน้านี้
            </p>
          )}
        </section>

        <Link
          href={buildHomeWithFavoritesUrl(selectedIds)}
          className="mb-8 inline-flex items-center gap-2 text-xs text-muted hover:text-paper"
        >
          <ArrowLeft size={14} /> กลับไปแก้ไข 5 เรื่องที่เลือก
        </Link>

        <Footer />
      </main>
    </>
  );
}
