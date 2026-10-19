"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, RotateCcw } from "lucide-react";
import {
  SELECTION_LIMIT,
} from "@/core/constants/movie.constant";
import { parseSelection } from "@/lib/movies";
import { buildHomeWithFavoritesUrl } from "@/routes/routes";
import { Header, Footer } from "./shell";
import { FeaturedMovieBanner, RecommendedCard } from "./recommendations/recommendation-cards";
import { RecommendationStatus } from "./recommendations/recommendation-status";
import { useRecommendations } from "./recommendations/use-recommendations";
import { PageShell } from "./page-shell";
import { SelectionRequired } from "./selection-required";
import { useMovies } from "./catalog-provider";

export function Results() {
  const movies = useMovies();
  const searchParams = useSearchParams();

  const selectedMovies = useMemo(() => {
    return parseSelection(searchParams.get("favorites"), movies);
  }, [searchParams, movies]);

  const result = useRecommendations(selectedMovies);
  const recommendations = result.movies;

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

  if (selectedMovies.length !== SELECTION_LIMIT) {
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

  if (result.status !== "success" || !featuredMovie) {
    return (
      <PageShell>
        <RecommendationStatus selected={selectedMovies} error={result.error} empty={result.status === "success"} onRetry={result.retry} />
      </PageShell>
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
