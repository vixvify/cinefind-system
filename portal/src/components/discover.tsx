"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCheck,
  Heart,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  movies,
  genreLabels,
  parseSelection,
  SELECTION_LIMIT,
  type Genre,
} from "@/lib/movies";
import { Header, Footer, Steps } from "./shell";
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
            <span className="eyebrow">
              <span className="tiny-line" /> YOUR NEXT FAVORITE FILM
            </span>
            <h1>
              หนังมีเป็นพันเรื่อง
              <br />
              แต่เรื่องที่ <em>“ใช่”</em> มีไว้ให้คุณ
            </h1>
            <p>
              บอกเราว่าคุณรักหนังเรื่องไหน
              <br className="mobile-break" /> แล้วให้ cinefind
              พาคุณไปเจอเรื่องโปรดเรื่องถัดไป
            </p>
            <a href="#discover" className="hero-link">
              เริ่มจากหนังที่คุณรัก 5 เรื่อง <ArrowDown size={16} />
            </a>
            <div className="hero-proof">
              <span className="mini-avatars">
                <span>🎬</span>
                <span>🍿</span>
                <span>✦</span>
              </span>
              <span>
                สำหรับทุกคนที่เคยถามว่า <strong>“คืนนี้ดูอะไรดี?”</strong>
              </span>
            </div>
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
            <span className="floating-note">
              <Sparkles size={16} /> A little more you.
            </span>
            <span className="art-caption">GOOD FILMS. GREAT FEELINGS.</span>
            <span className="orbit-star">✳</span>
          </div>
        </section>
        <Steps current={1} />
        <section id="discover" className="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE ONES YOU LOVE</span>
              <h2>
                เลือก 5 เรื่องที่เป็นคุณ<span className="heading-dot">.</span>
              </h2>
              <p>เรื่องที่ดูซ้ำได้ไม่เบื่อ หรือเรื่องที่ยังอยู่ในใจคุณเสมอ</p>
            </div>
            <span
              className={`selection-count ${ready ? "ready" : ""}`}
              aria-live="polite"
            >
              <Heart size={16} /> เลือกแล้ว{" "}
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
          <div className="catalog-meta">
            <span>
              <SlidersHorizontal size={13} />{" "}
              {genre === "all"
                ? "คัดมาให้ หลากหลายแนว"
                : `หนัง${genreLabels[genre]}`}{" "}
              <span className="meta-dot">·</span> {filtered.length} เรื่อง
            </span>
            <small>เลือกตามใจ ไม่มีคำตอบที่ผิด</small>
          </div>
          <div className="movie-grid">
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
                    <span className="rating">
                      <Star size={11} fill="currentColor" />
                      {movie.rating}
                    </span>
                    <span className="select-mark">
                      {isSelected ? (
                        <Check size={18} strokeWidth={3} />
                      ) : (
                        <Plus size={19} />
                      )}
                    </span>
                    {isSelected && (
                      <span className="selected-label">
                        <Check size={13} /> อยู่ในลิสต์ของคุณ
                      </span>
                    )}
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
              <p>ลองชื่อภาษาอังกฤษ หรือเลือกดูจากแนวหนัง</p>
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
          <p className="catalog-footnote">
            หนังดีไม่จำเป็นต้องเหมือนกัน แค่เป็นเรื่องที่คุณชอบก็พอ{" "}
            <Heart size={12} />
          </p>
        </section>
        <Footer />
      </main>
      <section className="selection-dock" aria-label="หนังที่เลือก">
        <div className="dock-inner">
          <div className="dock-intro">
            <span className="eyebrow">YOUR STARTING FIVE</span>
            <h3>
              {ready
                ? "พร้อมเจอเรื่องโปรดใหม่แล้ว?"
                : "รสนิยมของคุณ เริ่มตรงนี้"}
            </h3>
            <p aria-live="polite">
              {ready
                ? "เลือกครบแล้ว ไปค้นพบหนังที่ใช่กัน"
                : `เลือกอีก ${5 - selected.length} เรื่อง แล้วออกเดินทางกัน`}
            </p>
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
            {ready ? <Sparkles size={17} /> : <CheckCheck size={17} />}{" "}
            ค้นหาหนังที่ใช่ <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </>
  );
}
