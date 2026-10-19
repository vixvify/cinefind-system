"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { RecommendedMovie } from "@/core/domain/movie";

interface CachedRecommendations {
  key: string;
  movies: RecommendedMovie[];
}

interface RecommendationContextValue {
  result: CachedRecommendations | null;
  saveResult: (result: CachedRecommendations) => void;
}

const RecommendationContext = createContext<RecommendationContextValue | null>(null);

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [result, saveResult] = useState<CachedRecommendations | null>(null);
  const value = useMemo(() => ({ result, saveResult }), [result]);

  return <RecommendationContext.Provider value={value}>{children}</RecommendationContext.Provider>;
}

export function useRecommendationCache() {
  const context = useContext(RecommendationContext);
  if (!context) throw new Error("RecommendationProvider is missing.");
  return context;
}
