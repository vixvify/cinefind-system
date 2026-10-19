"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Movie } from "@/core/domain/movie";
import { RecommendationProvider } from "./recommendations/recommendation-provider";

interface CatalogProviderProps {
  movies: Movie[];
  children: ReactNode;
}

const CatalogContext = createContext<Movie[] | null>(null);

export function CatalogProvider({ movies, children }: CatalogProviderProps) {
  return (
    <CatalogContext.Provider value={movies}>
      <RecommendationProvider>{children}</RecommendationProvider>
    </CatalogContext.Provider>
  );
}

export function useMovies(): Movie[] {
  const movies = useContext(CatalogContext);
  if (!movies) {
    throw new Error("useMovies must be used within a CatalogProvider.");
  }
  return movies;
}
