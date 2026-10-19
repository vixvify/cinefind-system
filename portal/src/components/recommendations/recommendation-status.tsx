import Link from "next/link";
import { ArrowLeft, RotateCcw, SearchX, Sparkles } from "lucide-react";
import type { Movie } from "@/core/domain/movie";
import { buildHomeWithFavoritesUrl } from "@/routes/routes";
import { Poster } from "../poster";

interface RecommendationStatusProps {
  selected: Movie[];
  error?: string | null;
  empty?: boolean;
  onRetry?: () => void;
}

export function RecommendationStatus({ selected, error, empty, onRetry }: RecommendationStatusProps) {
  const isLoading = !error && !empty;

  return (
    <section className="mx-auto flex min-h-[75vh] max-w-lg flex-col items-center justify-center py-10 text-center">
      {isLoading ? (
        <div className="analysis-universe" aria-hidden="true">
          <div className="orbit-ring orbit-ring-outer" />
          <div className="orbit-ring orbit-ring-inner" />
          <div className="analysis-core"><Sparkles size={35} strokeWidth={1.3} /></div>
          {selected.map((movie, index) => (
            <div key={movie.id} className={`orbit-movie orbit-movie-${index}`}><Poster movie={movie} eager /></div>
          ))}
        </div>
      ) : <SearchX className="mb-6 text-lime" size={36} />}

      <div role={error ? "alert" : "status"} aria-live="polite">
        <h1 className="text-2xl font-semibold tracking-tight">
          {error ? "ยังหาหนังให้ไม่ได้" : empty ? "ยังไม่มีเรื่องที่ตรงใจ" : "กำลังหาหนังที่ใช่สำหรับคุณ"}
        </h1>
        <p className="mt-3 text-xs leading-6 text-muted">
          {error ?? (empty ? "ลองเปลี่ยนหนังที่เลือก แล้วค้นหาอีกครั้ง" : "AI กำลังดูหนังทั้ง 5 เรื่องที่คุณเลือก")}
        </p>
      </div>

      {isLoading && <div className="mt-7 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line" aria-hidden="true"><div className="h-full w-1/3 animate-pulse rounded-full bg-lime" /></div>}
      {error && onRetry && <button type="button" className="primary-button mt-6" onClick={onRetry}><RotateCcw size={15} /> ลองอีกครั้ง</button>}
      <Link href={buildHomeWithFavoritesUrl(selected.map(movie => movie.id))} className="mt-8 inline-flex items-center gap-2 text-xs text-muted hover:text-paper"><ArrowLeft size={13} /> กลับไปเลือกใหม่</Link>
    </section>
  );
}
