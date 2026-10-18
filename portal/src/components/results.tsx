"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, Check, RotateCcw, Star } from "lucide-react";
import { genreLabels, parseSelection, recommend, SELECTION_LIMIT } from "@/lib/movies";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";
import { SelectionRequired } from "./selection-required";

export function Results() {
  const params = useSearchParams();
  const selected = parseSelection(params.get("favorites"));
  const recommendations = recommend(selected);
  const [saved, setSaved] = useState<number[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const key = selected.map(movie => movie.id).join(",");
  const featured = recommendations[0];
  const display = showSaved ? recommendations.filter(movie => saved.includes(movie.id)) : recommendations.slice(1);
  function toggleSaved(id: number) { setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }
  return <><Header /><main className="page">{selected.length !== SELECTION_LIMIT ? <SelectionRequired /> : <>
    <div className="flex flex-wrap items-center justify-between gap-3 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">หนังที่คุณน่าจะชอบ<span className="text-lime">.</span></h1>
      <Link href={`/?favorites=${key}`} className="flex items-center gap-2 text-xs text-muted hover:text-paper"><RotateCcw size={14} /> เลือกใหม่</Link>
    </div>
    <section className="relative isolate overflow-hidden rounded-xl border border-line bg-surface" aria-label="หนังแนะนำอันดับหนึ่ง">
      <div className="pointer-events-none absolute inset-0 -z-1 opacity-15 blur-3xl" aria-hidden="true"><Poster movie={featured} eager /></div>
      <div className="grid grid-cols-[1fr_110px] items-center gap-5 p-5 sm:grid-cols-[1fr_200px] sm:gap-10 sm:p-9 lg:px-12">
        <div><span className="text-[10px] text-lime">แนะนำสำหรับคุณ</span><h2 className="mt-3 text-2xl leading-tight font-medium sm:text-4xl">{featured.title}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted"><span className="flex items-center gap-1 text-[#e5d594]"><Star size={12} fill="currentColor" /> {featured.rating}</span><span>·</span><span>{featured.year}</span><span>·</span><span>{genreLabels[featured.genres[0]]}</span></div>
          <p className="mt-4 max-w-md text-xs leading-6 text-paper/75">{featured.reason}</p>
          <button className="primary-button mt-5 px-4 py-2.5 text-xs" aria-pressed={saved.includes(featured.id)} onClick={() => toggleSaved(featured.id)}>{saved.includes(featured.id) ? <Check size={14} /> : <Bookmark size={14} />}{saved.includes(featured.id) ? "เก็บแล้ว" : "เก็บไว้ดู"}</button>
        </div><div className="rotate-3 overflow-hidden rounded-md border-2 border-white/10 shadow-2xl"><Poster movie={featured} eager /></div>
      </div>
    </section>
    <section className="py-8"><div className="genre-tabs mb-6"><button className={!showSaved ? "active" : ""} aria-pressed={!showSaved} onClick={() => setShowSaved(false)}>แนะนำเพิ่มเติม</button><button className={showSaved ? "active" : ""} aria-pressed={showSaved} onClick={() => setShowSaved(true)}>เก็บไว้ดู ({saved.length})</button></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">{display.map(movie => <article key={movie.id} className="min-w-0"><div className="movie-image"><Poster movie={movie} /><button className={`absolute top-2 right-2 z-2 grid size-8 place-items-center rounded-full border ${saved.includes(movie.id) ? "border-lime bg-lime text-cinema" : "border-white/30 bg-cinema/80 text-paper"}`} aria-label={`${saved.includes(movie.id) ? "เลิกเก็บ" : "เก็บไว้ดู"} ${movie.title}`} aria-pressed={saved.includes(movie.id)} onClick={() => toggleSaved(movie.id)}><Bookmark size={14} fill={saved.includes(movie.id) ? "currentColor" : "none"} /></button></div><h3 className="mt-3 text-sm leading-6 font-medium">{movie.title}</h3><p className="mt-1 text-[11px] text-muted">{movie.year} · {genreLabels[movie.genres[0]]}</p></article>)}</div>
      {showSaved && display.length === 0 && <div className="empty-state"><Bookmark size={28} /><h3>ยังไม่มีหนังที่เก็บไว้</h3><button className="text-button text-xs" onClick={() => setShowSaved(false)}>กลับไปดูหนังแนะนำ</button></div>}
      {showSaved && <p className="mt-5 text-[10px] text-muted">เก็บไว้เฉพาะการเปิดหน้านี้</p>}
    </section>
    <Link href={`/?favorites=${key}`} className="mb-8 inline-flex items-center gap-2 text-xs text-muted hover:text-paper"><ArrowLeft size={14} /> กลับไปแก้ไข 5 เรื่องที่เลือก</Link>
    </>}<Footer /></main></>;
}
