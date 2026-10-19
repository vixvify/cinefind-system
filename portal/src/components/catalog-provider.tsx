"use client";
import { createContext, useContext } from "react";
import type { Movie } from "@/lib/movies";
const CatalogContext = createContext<Movie[] | null>(null);
export function CatalogProvider({ movies, children }: { movies: Movie[]; children: React.ReactNode }) {
  return <CatalogContext.Provider value={movies}>{children}</CatalogContext.Provider>;
}
export function useMovies() {
  const movies = useContext(CatalogContext);
  if (!movies) throw new Error("Movie catalog is not available.");
  return movies;
}
