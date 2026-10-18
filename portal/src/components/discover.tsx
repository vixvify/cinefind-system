"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Plus,
  Search,
  X,
} from "lucide-react";
import {
  movies,
  genreLabels,
  parseSelection,
  SELECTION_LIMIT,
  type Genre,
} from "@/lib/movies";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";

export function Discover() {
  const router = useRouter();
  const params = useSearchParams();
  const [selected, setSelected] = useState<number[]>(() =>
    parseSelection(params.get("favorites")).map((movie) => movie.id),
  );
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(12);
  const selectedMovies = selected.map(
    (id) => movies.find((movie) => movie.id === id)!,
  );
  const filtered = movies.filter(
    (movie) =>
      (genre === "all" || movie.genres.includes(genre)) &&
      `${movie.title} ${movie.year} ${movie.genres.map((g) => genreLabels[g]).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const ready = selected.length === SELECTION_LIMIT;
  function toggle(id: number) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < SELECTION_LIMIT
          ? [...current, id]
          : current,
    );
  }
  return (
    <>
      <Header />
      <main className="page discover-page">
        <section className="hero">
          <div className="hero-copy">
            <h1>คืนนี้ <em>ดูอะไรดี?</em></h1>
            <p>เลือกหนังที่ชอบ 5 เรื่อง แล้วเจอเรื่องใหม่ที่ใช่</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-glow" />
            <div className="film-strip">
              {[movies[3], movies[0], movies[5]].map((movie, index) => (
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
              className={`selection-count ${ready ? "ready" : ""}`}
              aria-live="polite"
            >
              <strong>{selected.length} / 5</strong>
            </span>
          </div>
          <div className="catalog-tools">
            <div className="genre-tabs" aria-label="กรองตามแนวหนัง">
              <button
                aria-pressed={genre === "all"}
                className={genre === "all" ? "active" : ""}
                onClick={() => {
                  setGenre("all");
                  setVisible(12);
                }}
              >
                ทั้งหมด
              </button>
              {(Object.keys(genreLabels) as Genre[]).map((item) => (
                <button
                  key={item}
                  aria-pressed={genre === item}
                  className={genre === item ? "active" : ""}
                  onClick={() => {
                    setGenre(item);
                    setVisible(12);
                  }}
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
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(12);
                }}
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="ล้างคำค้น">
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          <div className="movie-grid mt-6">
            {filtered.slice(0, visible).map((movie, index) => {
              const isSelected = selected.includes(movie.id);
              return (
                <button
                  key={movie.id}
                  className={`movie-card ${isSelected ? "selected" : ""}`}
                  aria-label={`${isSelected ? "นำออก" : "เลือก"} ${movie.title}`}
                  aria-pressed={isSelected}
                  disabled={ready && !isSelected}
                  onClick={() => toggle(movie.id)}
                >
                  <div className="movie-image">
                    <Poster movie={movie} eager={index < 6} />
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
                    <span>{movie.year}</span>
                    <span>·</span>
                    <span>{genreLabels[movie.genres[0]]}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              <Search size={30} />
              <h3>ยังไม่เจอหนังที่ค้นหา</h3>
              <button
                className="text-button"
                onClick={() => {
                  setQuery("");
                  setGenre("all");
                }}
              >
                ดูหนังทั้งหมด <ArrowRight size={16} />
              </button>
            </div>
          )}
          {filtered.length > visible && (
            <button
              className="load-more"
              onClick={() => setVisible((count) => count + 12)}
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
            <h3 aria-live="polite">{ready ? "ครบ 5 เรื่องแล้ว" : `เลือกอีก ${5 - selected.length} เรื่อง`}</h3>
          </div>
          <div className="selected-slots">
            {Array.from({ length: 5 }, (_, index) => {
              const movie = selectedMovies[index];
              return movie ? (
                <button
                  key={movie.id}
                  className="selected-slot filled"
                  onClick={() => toggle(movie.id)}
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
            className="primary-button discover-button"
            disabled={!ready}
            onClick={() =>
              router.push(`/analyzing?favorites=${selected.join(",")}`)
            }
          >
            ถัดไป <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </>
  );
}
