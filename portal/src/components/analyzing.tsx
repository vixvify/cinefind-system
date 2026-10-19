"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SELECTION_LIMIT } from "@/core/constants/movie.constant";
import { parseSelection } from "@/lib/movies";
import { buildResultsUrl } from "@/routes/routes";
import { useMovies } from "./catalog-provider";
import { PageShell } from "./page-shell";
import { SelectionRequired } from "./selection-required";
import { RecommendationStatus } from "./recommendations/recommendation-status";
import { useRecommendations } from "./recommendations/use-recommendations";

export function Analyzing() {
  const movies = useMovies();
  const params = useSearchParams();
  const router = useRouter();
  const selected = parseSelection(params.get("favorites"), movies);
  const result = useRecommendations(selected);
  const destination = buildResultsUrl(selected.map(movie => movie.id));

  useEffect(() => {
    if (result.status === "success") router.replace(destination);
  }, [result.status, destination, router]);

  return (
    <PageShell>
      {selected.length !== SELECTION_LIMIT ? <SelectionRequired /> : (
        <RecommendationStatus
          selected={selected}
          error={result.error}
          onRetry={result.retry}
        />
      )}
    </PageShell>
  );
}
