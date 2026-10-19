"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { parseSelection, SELECTION_LIMIT } from "@/lib/movies";
import { Header, Footer } from "./shell";
import { Poster } from "./poster";
import { SelectionRequired } from "./selection-required";
import { useMovies } from "./catalog-provider";

const ANALYSIS_STAGES = [
  "กำลังดูแนวหนังที่คุณชอบ",
  "กำลังจับคู่หนัง",
  "ลิสต์ของคุณพร้อมแล้ว",
] as const;

const TOTAL_DURATION_MS = 4000;
const TICK_INTERVAL_MS = 100;

export function Analyzing() {
  const movies = useMovies();
  const params = useSearchParams();
  const router = useRouter();

  const selected = parseSelection(params.get("favorites"), movies);
  const favoritesKey = selected.map((movie) => movie.id).join(",");
  const isValidSelection = selected.length === SELECTION_LIMIT;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isValidSelection) return;

    const destinationUrl = `/results?favorites=${favoritesKey}`;
    router.prefetch(destinationUrl);

    const startTime = Date.now();
    const timerId = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / TOTAL_DURATION_MS) * 100));

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        window.clearInterval(timerId);
        router.replace(destinationUrl);
      }
    }, TICK_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, [favoritesKey, isValidSelection, router]);

  if (!isValidSelection) {
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

  const stageIndex = Math.min(
    ANALYSIS_STAGES.length - 1,
    Math.floor((progress / 100) * ANALYSIS_STAGES.length),
  );

  return (
    <>
      <Header />
      <main className="page">
        <section className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center py-10 text-center">
          <div className="analysis-universe" aria-hidden="true">
            <div className="orbit-ring orbit-ring-outer" />
            <div className="orbit-ring orbit-ring-inner" />
            <div className="analysis-core">
              <Sparkles size={35} strokeWidth={1.3} />
            </div>
            {selected.map((movie, index) => (
              <div
                key={movie.id}
                className={`orbit-movie orbit-movie-${index}`}
              >
                <Poster movie={movie} eager />
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            กำลังหาหนังที่<span className="text-lime">ใช่สำหรับคุณ</span>
          </h1>

          <p className="mt-3 text-xs text-muted" aria-live="polite">
            {ANALYSIS_STAGES[stageIndex]}
          </p>

          <div
            className="mt-7 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="ความคืบหน้าการจับคู่หนังจำลอง"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-lime transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Link
            href={`/?favorites=${favoritesKey}`}
            className="mt-8 inline-flex items-center gap-2 text-xs text-muted hover:text-paper"
          >
            <ArrowLeft size={13} /> กลับไปเลือกใหม่
          </Link>
        </section>
        <Footer />
      </main>
    </>
  );
}
