import { Suspense } from "react";
import { Analyzing } from "@/components/analyzing";
export default function AnalyzingPage() {
  return <Suspense fallback={<main className="page loading-page">กำลังเตรียมการค้นพบ…</main>}><Analyzing /></Suspense>;
}
