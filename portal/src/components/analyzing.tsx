"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { parseSelection, SELECTION_LIMIT } from "@/lib/movies";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";
import { SelectionRequired } from "./selection-required";

const stages = ["กำลังดูแนวหนังที่คุณชอบ", "กำลังจับคู่หนัง", "ลิสต์ของคุณพร้อมแล้ว"];
export function Analyzing() {
  const params = useSearchParams();
  const router = useRouter();
  const selected = parseSelection(params.get("favorites"));
  const key = selected.map(movie => movie.id).join(",");
  const valid = selected.length === SELECTION_LIMIT;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!valid) return;
    const destination = `/results?favorites=${key}`;
    router.prefetch(destination);
    const started = Date.now();
    const interval = window.setInterval(() => {
      const next = Math.min(100, Math.round((Date.now() - started) / 40));
      setProgress(next);
      if (next === 100) { window.clearInterval(interval); router.replace(destination); }
    }, 100);
    return () => window.clearInterval(interval);
  }, [key, valid, router]);
  return <><Header /><main className="page">{!valid ? <SelectionRequired /> : <section className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center py-10 text-center">
    <div className="analysis-universe" aria-hidden="true"><div className="orbit-ring orbit-ring-outer" /><div className="orbit-ring orbit-ring-inner" /><div className="analysis-core"><Sparkles size={35} strokeWidth={1.3} /></div>{selected.map((movie, index) => <div className={`orbit-movie orbit-movie-${index}`} key={movie.id}><Poster movie={movie} eager /></div>)}</div>
    <h1 className="text-2xl font-semibold tracking-tight">กำลังหาหนังที่<span className="text-lime">ใช่สำหรับคุณ</span></h1>
    <p className="mt-3 text-xs text-muted" aria-live="polite">{stages[Math.min(2, Math.floor(progress / 34))]}</p>
    <div className="mt-7 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line" role="progressbar" aria-label="ความคืบหน้าการจับคู่หนังจำลอง" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-lime transition-[width] duration-100" style={{ width: `${progress}%` }} /></div>
    <Link className="mt-8 inline-flex items-center gap-2 text-xs text-muted hover:text-paper" href={`/?favorites=${key}`}><ArrowLeft size={13} /> กลับไปเลือกใหม่</Link>
  </section>}<Footer /></main></>;
}
