export const genreLabels = {
  Action: "แอ็กชัน", Adventure: "ผจญภัย", Animation: "แอนิเมชัน", Comedy: "คอมเมดี้",
  Crime: "อาชญากรรม", Documentary: "สารคดี", Drama: "ดราม่า", Family: "ครอบครัว",
  Fantasy: "แฟนตาซี", History: "ประวัติศาสตร์", Horror: "สยองขวัญ", Music: "ดนตรี",
  Mystery: "ลึกลับ", Romance: "โรแมนติก", "Sci-Fi": "ไซไฟ", "TV Movie": "ภาพยนตร์โทรทัศน์",
  Thriller: "ระทึกขวัญ", War: "สงคราม", Western: "คาวบอย", Unknown: "อื่น ๆ",
} as const;
export type Genre = keyof typeof genreLabels;
export type Movie = { id: number; title: string; year: number | null; rating: string; genres: Genre[]; poster: string | null };
export const browseGenres: Genre[] = ["Action", "Sci-Fi", "Drama", "Thriller", "Animation", "Romance", "Comedy"];
export const SELECTION_LIMIT = 5;

export function parseSelection(value: string | null, movies: Movie[]): Movie[] {
  if (!value) return [];
  const ids = [...new Set(value.split(",").filter(id => /^\d+$/.test(id)).map(Number))];
  const byId = new Map(movies.map(movie => [movie.id, movie]));
  return ids.flatMap(id => { const movie = byId.get(id); return movie ? [movie] : []; }).slice(0, SELECTION_LIMIT);
}

/** UI demonstration only: deterministic genre matching, not the AI service. */
export function recommend(selected: Movie[], movies: Movie[]) {
  const weights = new Map<Genre, number>();
  selected.forEach(movie => movie.genres.filter(genre => genre !== "Unknown").forEach(genre => weights.set(genre, (weights.get(genre) ?? 0) + 1)));
  const selectedIds = new Set(selected.map(movie => movie.id));
  return movies.filter(movie => !selectedIds.has(movie.id)).map(movie => {
    const shared = movie.genres.filter(genre => weights.has(genre)).sort((a, b) => weights.get(b)! - weights.get(a)!);
    const score = shared.reduce((sum, genre) => sum + weights.get(genre)!, 0);
    return { ...movie, score, reason: shared.length ? `เพราะคุณชอบหนัง${shared.slice(0, 2).map(genre => genreLabels[genre]).join("และ")}` : "ลองเปิดประสบการณ์กับหนังแนวใหม่" };
  }).sort((a, b) => b.score - a.score || Number(b.rating) - Number(a.rating) || a.id - b.id).slice(0, 6);
}
