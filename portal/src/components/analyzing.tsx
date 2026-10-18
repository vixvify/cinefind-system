"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { parseSelection, SELECTION_LIMIT } from "@/lib/movies";
import { Header, Footer, Steps } from "./shell";
import { Poster } from "./poster";
import { SelectionRequired } from "./selection-required";

const stages = ["ทำความรู้จักหนังที่คุณรัก", "เชื่อมต่อแนวหนังและอารมณ์ที่ใช่", "จัดลิสต์เรื่องโปรดเรื่องถัดไป"];
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
      const next = Math.min(100, Math.round((Date.now() - started) / 60));
      setProgress(next);
      if (next === 100) { window.clearInterval(interval); router.replace(destination); }
    }, 100);
    return () => window.clearInterval(interval);
  }, [key, valid, router]);
  const phase = Math.min(2, Math.floor(progress / 34));
  return <><Header /><main className="page"><div className="pt-8"><Steps current={2} /></div>{!valid ? <SelectionRequired /> : <section className="mx-auto flex min-h-[710px] max-w-2xl flex-col items-center py-12 text-center sm:py-16"><span className="eyebrow text-lime">CONNECTING YOUR CINEMATIC UNIVERSE</span><div className="analysis-universe" aria-hidden="true"><div className="orbit-ring orbit-ring-outer" /><div className="orbit-ring orbit-ring-inner" /><div className="analysis-core"><Sparkles size={35} strokeWidth={1.3} /></div>{selected.map((movie, index) => <div className={`orbit-movie orbit-movie-${index}`} key={movie.id}><Poster movie={movie} eager /></div>)}</div><h1 className="text-[27px] leading-relaxed font-semibold tracking-tight sm:text-3xl">กำลังค้นหาเรื่องที่ <span className="text-lime">ใช่สำหรับคุณ</span></h1><p className="mt-3 text-xs leading-7 text-muted sm:text-sm">หนังทั้ง 5 เรื่องกำลังบอกเล่ารสนิยมของคุณ<br />อีกนิดเดียว การค้นพบครั้งใหม่ก็จะเริ่มต้น</p><div className="mt-9 w-full max-w-sm"><div className="mb-3 flex justify-between text-[11px]"><span aria-live="polite" className="text-muted">{stages[phase]}</span><span className="font-mono text-lime">{progress}%</span></div><div className="h-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="ความคืบหน้าการจับคู่หนังจำลอง" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-lime transition-[width] duration-100" style={{ width: `${progress}%` }} /></div></div><div className="mt-6 flex flex-wrap justify-center gap-4">{stages.map((stage, index) => <span key={stage} className={`flex items-center gap-1.5 text-[9px] ${index <= phase ? "text-lime" : "text-muted/60"}`}>{index < phase ? <Check size={12} /> : <span className={`size-1.5 rounded-full ${index === phase ? "animate-pulse bg-lime" : "bg-line"}`} />}{stage}</span>)}</div><Link className="mt-9 inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-paper" href={`/?favorites=${key}`}><ArrowLeft size={13} /> กลับไปแก้ไขหนังที่เลือก</Link><p className="mt-6 text-[10px] text-muted/70">DEMO EXPERIENCE · การจับคู่ข้อมูลจำลอง ยังไม่มีระบบ AI</p></section>}<Footer /></main></>;
}
