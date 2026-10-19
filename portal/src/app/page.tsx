import { Suspense } from "react";
import { Discover } from "@/components/discover";

export default function Home() {
  return (
    <Suspense
      fallback={<main className="page loading-page">กำลังเปิดโรงหนัง…</main>}
    >
      <Discover />
    </Suspense>
  );
}
