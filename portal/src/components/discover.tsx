"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowRight, Check, Plus, Search, X } from "lucide-react";
import {
  browseGenres,
  genreLabels,
  SELECTION_LIMIT,
  DEFAULT_PAGE_SIZE,
} from "@/core/constants/movie.constant";
import type { Genre } from "@/core/domain/genre";
import type { Movie } from "@/core/domain/movie";
import { parseSelection } from "@/lib/movies";
import { buildAnalyzingUrl } from "@/routes/routes";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";
import { useMovies } from "./catalog-provider";

interface MovieCardProps {
  movie: Movie;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (id: number) => void;
  eagerPoster: boolean;
}

function MovieCard({
  movie,
  isSelected,
  isDisabled,
  onToggle,
  eagerPoster,
}: MovieCardProps) {
  return (
    <button
      type="button"
      className={`movie-card ${isSelected ? "selected" : ""}`}
      aria-label={`${isSelected ? "นำออก" : "เลือก"} ${movie.title}`}
      aria-pressed={isSelected}
      disabled={isDisabled}
      onClick={() => onToggle(movie.id)}
    >
      <div className="movie-image">
        <Poster movie={movie} eager={eagerPoster} />
        <span className="select-mark">
          {isSelected ? (
            <Check size={18} strokeWidth={3} />
          ) : (
            <Plus size={19} />
          )}
        </span>
      </div>
      <h3>{movie.title}</h3>
      <div className="movie-meta">
        {movie.year && <span>{movie.year}</span>}
        {movie.year && movie.genres.length > 0 && <span>·</span>}
        {movie.genres.length > 0 && <span>{genreLabels[movie.genres[0]]}</span>}
      </div>
    </button>
  );
}

export function Discover() {
  const movies = useMovies();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    const initialFavorites = searchParams.get("favorites");
    return parseSelection(initialFavorites, movies).map((movie) => movie.id);
  });

  const [selectedGenre, setSelectedGenre] = useState<Genre | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(DEFAULT_PAGE_SIZE);

  const isSelectionReady = selectedIds.length === SELECTION_LIMIT;

  const movieMap = useMemo(() => {
    return new Map(movies.map((movie) => [movie.id, movie]));
  }, [movies]);

  const selectedMovies = useMemo(() => {
    return selectedIds
      .map((id) => movieMap.get(id))
      .filter((movie): movie is Movie => movie !== undefined);
  }, [selectedIds, movieMap]);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return movies.filter((movie) => {
      const matchesGenre =
        selectedGenre === "all" || movie.genres.includes(selectedGenre);

      if (!matchesGenre) return false;
      if (!normalizedQuery) return true;

      const titleMatch = movie.title.toLowerCase().includes(normalizedQuery);
      if (titleMatch) return true;

      const yearMatch =
        movie.year !== null && String(movie.year).includes(normalizedQuery);
      if (yearMatch) return true;

      return movie.genres.some((genre) =>
        genreLabels[genre].toLowerCase().includes(normalizedQuery),
      );
    });
  }, [movies, selectedGenre, searchQuery]);

  const toggleMovie = useCallback((id: number) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length < SELECTION_LIMIT) {
        return [...current, id];
      }
      return current;
    });
  }, []);

  const handleGenreChange = useCallback((genre: Genre | "all") => {
    setSelectedGenre(genre);
    setVisibleCount(DEFAULT_PAGE_SIZE);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(DEFAULT_PAGE_SIZE);
  }, []);

  const handleClearQuery = useCallback(() => {
    setSearchQuery("");
    setVisibleCount(DEFAULT_PAGE_SIZE);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedGenre("all");
    setVisibleCount(DEFAULT_PAGE_SIZE);
  }, []);

  const handleProceed = useCallback(() => {
    router.push(buildAnalyzingUrl(selectedIds));
  }, [router, selectedIds]);

  const heroMovies = useMemo(() => {
    return [movies[3], movies[0], movies[5]].filter(Boolean);
  }, [movies]);

  return (
    <>
      <Header />
      <main className="page discover-page">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              คืนนี้ <em>ดูอะไรดี?</em>
            </h1>
            <p>เลือกหนังที่ชอบ 5 เรื่อง แล้วเจอเรื่องใหม่ที่ใช่</p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-glow" />
            <div className="film-strip">
              {heroMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className={`hero-poster hero-poster-${index}`}
                >
                  <Poster movie={movie} eager />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="discover" className="catalog">
          <div className="section-heading">
            <div>
              <h2>เลือกหนังที่ชอบ</h2>
            </div>
            <span
              className={`selection-count ${isSelectionReady ? "ready" : ""}`}
              aria-live="polite"
            >
              <strong>
                {selectedIds.length} / {SELECTION_LIMIT}
              </strong>
            </span>
          </div>

          <div className="catalog-tools">
            <div className="genre-tabs" aria-label="กรองตามแนวหนัง">
              <button
                type="button"
                aria-pressed={selectedGenre === "all"}
                className={selectedGenre === "all" ? "active" : ""}
                onClick={() => handleGenreChange("all")}
              >
                ทั้งหมด
              </button>
              {browseGenres.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={selectedGenre === item}
                  className={selectedGenre === item ? "active" : ""}
                  onClick={() => handleGenreChange(item)}
                >
                  {genreLabels[item]}
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={17} />
              <input
                aria-label="ค้นหาชื่อหนัง"
                placeholder="ค้นหาชื่อหนัง..."
                value={searchQuery}
                onChange={(event) => handleQueryChange(event.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  aria-label="ล้างคำค้น"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>

          <div className="movie-grid mt-6">
            {filteredMovies.slice(0, visibleCount).map((movie, index) => {
              const isSelected = selectedIds.includes(movie.id);
              const isDisabled = isSelectionReady && !isSelected;

              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onToggle={toggleMovie}
                  eagerPoster={index < 6}
                />
              );
            })}
          </div>

          {filteredMovies.length === 0 && (
            <div className="empty-state">
              <Search size={30} />
              <h3>ยังไม่เจอหนังที่ค้นหา</h3>
              <button
                type="button"
                className="text-button"
                onClick={handleResetFilters}
              >
                ดูหนังทั้งหมด <ArrowRight size={16} />
              </button>
            </div>
          )}

          {filteredMovies.length > visibleCount && (
            <button
              type="button"
              className="load-more"
              onClick={() =>
                setVisibleCount((prev) => prev + DEFAULT_PAGE_SIZE)
              }
            >
              ดูหนังเพิ่มเติม <ArrowDown size={16} />
            </button>
          )}
        </section>

        <Footer />
      </main>

      <section className="selection-dock" aria-label="หนังที่เลือก">
        <div className="dock-inner">
          <div className="dock-intro">
            <h3 aria-live="polite">
              {isSelectionReady
                ? "ครบ 5 เรื่องแล้ว"
                : `เลือกอีก ${SELECTION_LIMIT - selectedIds.length} เรื่อง`}
            </h3>
          </div>

          <div className="selected-slots">
            {Array.from({ length: SELECTION_LIMIT }, (_, index) => {
              const movie = selectedMovies[index];
              return movie ? (
                <button
                  type="button"
                  key={movie.id}
                  className="selected-slot filled"
                  onClick={() => toggleMovie(movie.id)}
                  aria-label={`นำ ${movie.title} ออกจากรายการ`}
                  title={`นำ ${movie.title} ออก`}
                >
                  <Poster movie={movie} />
                  <span className="slot-remove">
                    <X size={12} />
                  </span>
                </button>
              ) : (
                <div key={`empty-${index}`} className="selected-slot">
                  <Plus size={16} />
                  <span>0{index + 1}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="primary-button discover-button"
            disabled={!isSelectionReady}
            onClick={handleProceed}
          >
            ถัดไป <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </>
  );
}
