export const APP_ROUTES = {
  HOME: "/",
  ANALYZING: "/analyzing",
  RESULTS: "/results",
} as const;

export const API_ROUTES = {
  RECOMMENDATIONS: "/api/recommendations",
  POSTER: (id: number | string) => `/api/posters/${id}`,
} as const;

export function buildAnalyzingUrl(favoriteIds: number[]): string {
  return `${APP_ROUTES.ANALYZING}?favorites=${favoriteIds.join(",")}`;
}

export function buildResultsUrl(favoriteIds: number[]): string {
  return `${APP_ROUTES.RESULTS}?favorites=${favoriteIds.join(",")}`;
}

export function buildHomeWithFavoritesUrl(favoriteIds: number[] | string): string {
  const ids = Array.isArray(favoriteIds) ? favoriteIds.join(",") : favoriteIds;
  return `${APP_ROUTES.HOME}?favorites=${ids}`;
}
