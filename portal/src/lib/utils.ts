export function formatMovieYear(year: number | null): string {
  if (year === null || !Number.isFinite(year)) {
    return "";
  }
  return String(year);
}

export function formatRatingScore(rating: string | number): string {
  const num = typeof rating === "string" ? Number(rating) : rating;
  if (!Number.isFinite(num) || num < 0 || num > 10) {
    return "—";
  }
  return num.toFixed(1);
}
