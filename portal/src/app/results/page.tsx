import { Suspense } from "react";
import { Results } from "@/components/results";
export default function ResultsPage() {
  return <Suspense fallback={<main className="page loading-page">กำลังเตรียมลิสต์หนังของคุณ…</main>}><Results /></Suspense>;
}
