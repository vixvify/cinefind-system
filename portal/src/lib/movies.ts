export type Genre = "Sci-Fi" | "Drama" | "Thriller" | "Adventure" | "Animation" | "Romance" | "Comedy";
export type Movie = { id: number; title: string; year: number; rating: string; genres: Genre[]; poster: string; description: string };
const poster = (path: string) => `https://image.tmdb.org/t/p/w500/${path}.jpg`;

export const movies: Movie[] = [
  { id: 1, title: "Interstellar", year: 2014, rating: "8.7", genres: ["Sci-Fi", "Adventure", "Drama"], poster: poster("gEU2QniE6E77NI6lCU6MxlNBvIx"), description: "การเดินทางข้ามจักรวาล ที่พาเรากลับมาพบความหมายของคำว่าบ้าน" },
  { id: 2, title: "Inception", year: 2010, rating: "8.8", genres: ["Sci-Fi", "Thriller"], poster: poster("oYuLEt3zVCKq57qu2F8dT7NIa6f"), description: "ดำดิ่งสู่โลกแห่งความฝัน ที่ความจริงอาจไม่ใช่สิ่งที่คุณคิด" },
  { id: 3, title: "The Grand Budapest Hotel", year: 2014, rating: "8.1", genres: ["Comedy", "Adventure"], poster: poster("eWdyYQreja6JGCzqHWXpWHDrrPo"), description: "เรื่องวุ่นวายในโรงแรมสีชมพู ผ่านสายตาของพนักงานต้อนรับผู้ไม่เหมือนใคร" },
  { id: 4, title: "La La Land", year: 2016, rating: "8.0", genres: ["Romance", "Drama"], poster: poster("uDO8zWDhfWwoFdKS4fzkUJt0Rf0"), description: "ความฝัน ความรัก และเสียงเพลงใต้แสงไฟของลอสแอนเจลิส" },
  { id: 5, title: "Parasite", year: 2019, rating: "8.5", genres: ["Thriller", "Drama"], poster: poster("7IiTTgloJzvGI1TAYymCfbfl3vT"), description: "สองครอบครัว สองโลก และเส้นแบ่งที่บางกว่าที่คิด" },
  { id: 6, title: "Spirited Away", year: 2001, rating: "8.6", genres: ["Animation", "Adventure"], poster: poster("39wmItIWsg5sZMyRUHLkWBcuVCM"), description: "เด็กหญิงหลงทางในโลกวิญญาณ กับการเติบโตที่แสนมหัศจรรย์" },
  { id: 7, title: "Dune: Part Two", year: 2024, rating: "8.5", genres: ["Sci-Fi", "Adventure"], poster: poster("1pdfLvkbY9ohJlCjQH2CZjjYVvJ"), description: "โชคชะตาของนักรบหนุ่ม บนดาวทะเลทรายที่เต็มไปด้วยความลับ" },
  { id: 8, title: "The Dark Knight", year: 2008, rating: "9.0", genres: ["Thriller", "Drama"], poster: poster("qJ2tW6WMUDux911r6m7haRef0WH"), description: "เมื่อความโกลาหลท้าทายเส้นแบ่งระหว่างฮีโร่กับวายร้าย" },
  { id: 9, title: "Everything Everywhere All at Once", year: 2022, rating: "7.8", genres: ["Sci-Fi", "Comedy", "Drama"], poster: poster("w3LxiVYdWWRvEVdn5RYq6jIqkb1"), description: "ทุกความเป็นไปได้ในพหุจักรวาล เริ่มต้นจากครอบครัวเล็ก ๆ ครอบครัวหนึ่ง" },
  { id: 10, title: "Whiplash", year: 2014, rating: "8.5", genres: ["Drama", "Thriller"], poster: poster("7fn624j5lj3xTme2SgiLCeuedmO"), description: "จังหวะกลอง ความทะเยอทะยาน และราคาของการเป็นที่สุด" },
  { id: 11, title: "Your Name", year: 2016, rating: "8.4", genres: ["Animation", "Romance"], poster: poster("q719jXXEzOoYaps6babgKnONONX"), description: "คนแปลกหน้าสองคน เชื่อมถึงกันด้วยความฝันและเส้นด้ายแห่งโชคชะตา" },
  { id: 12, title: "The Truman Show", year: 1998, rating: "8.2", genres: ["Drama", "Comedy"], poster: poster("vuza0WqY239yBXOadKlGwJsZJFE"), description: "จะเกิดอะไรขึ้น ถ้าทั้งชีวิตของคุณคือรายการโทรทัศน์" },
  { id: 13, title: "Arrival", year: 2016, rating: "7.9", genres: ["Sci-Fi", "Drama"], poster: poster("x2FJsf1ElAgr63Y3PNPtJrcmpoe"), description: "ภาษาใหม่จากผู้มาเยือน ที่อาจเปลี่ยนวิธีที่เรามองเวลาและชีวิต" },
  { id: 14, title: "Blade Runner 2049", year: 2017, rating: "8.0", genres: ["Sci-Fi", "Thriller"], poster: poster("gajva2L0rPYkEWjzgFlBXCAVBE5"), description: "การตามหาความทรงจำและตัวตน ท่ามกลางโลกอนาคตที่เงียบเหงา" },
  { id: 15, title: "Her", year: 2013, rating: "8.0", genres: ["Sci-Fi", "Romance", "Drama"], poster: poster("eCOtqtfvn7mxGl6nfmq4b1exJRc"), description: "ความสัมพันธ์ที่คาดไม่ถึง ในโลกที่เทคโนโลยีเข้าใจหัวใจเรา" },
  { id: 16, title: "Soul", year: 2020, rating: "8.0", genres: ["Animation", "Comedy", "Drama"], poster: poster("hm58Jw4Lw8OIeECIq5qyPYhAeRJ"), description: "ออกตามหาความหมายของชีวิต ผ่านดนตรีแจ๊สและช่วงเวลาธรรมดา" },
  { id: 17, title: "The Martian", year: 2015, rating: "8.0", genres: ["Sci-Fi", "Adventure"], poster: poster("5BHuvQ6p9kfc091Z8RiFNhCwL4b"), description: "นักบินอวกาศผู้ต้องเอาชีวิตรอดบนดาวอังคาร ด้วยวิทยาศาสตร์และความหวัง" },
  { id: 18, title: "WALL·E", year: 2008, rating: "8.4", genres: ["Animation", "Sci-Fi", "Romance"], poster: poster("hbhFnRzzg6ZDmm8YAmxBnQpQIPh"), description: "หุ่นยนต์ตัวเล็ก หัวใจดวงใหญ่ กับภารกิจพามนุษย์กลับบ้าน" },
  { id: 19, title: "Knives Out", year: 2019, rating: "7.9", genres: ["Thriller", "Comedy"], poster: poster("pThyQovXQrw2m0s9x82twj48Jq4"), description: "คดีฆาตกรรมในคฤหาสน์ ที่ทุกคนมีความลับซ่อนอยู่" },
  { id: 20, title: "The Secret Life of Walter Mitty", year: 2013, rating: "7.3", genres: ["Adventure", "Comedy", "Drama"], poster: poster("tY6ypjKOOtujhxiSwTmvA4OZ5IE"), description: "ก้าวออกจากชีวิตประจำวัน สู่การผจญภัยที่เคยมีแค่ในฝัน" },
  { id: 21, title: "Coco", year: 2017, rating: "8.4", genres: ["Animation", "Adventure"], poster: poster("gGEsBPAijhVUFoiNpgZXqRVWJt2"), description: "เสียงเพลงที่พาเด็กชายข้ามโลก ไปพบความทรงจำของครอบครัว" },
  { id: 22, title: "Pride & Prejudice", year: 2005, rating: "7.8", genres: ["Romance", "Drama"], poster: poster("sGjIvtVvTlWnia2zfJfHz81pZ9Q"), description: "ความรักที่ค่อย ๆ ผลิบาน ท่ามกลางอคติและความเข้าใจผิด" },
  { id: 23, title: "The Prestige", year: 2006, rating: "8.5", genres: ["Thriller", "Drama"], poster: poster("bdN3gXuIZYaJP7ftKK2sU0nPtEA"), description: "มายากล ความลับ และการแข่งขันที่ต้องแลกทุกอย่าง" },
  { id: 24, title: "Moonrise Kingdom", year: 2012, rating: "7.8", genres: ["Adventure", "Romance", "Comedy"], poster: poster("wOgmhrSUwOuZJsQXf2GsI923N0f"), description: "การหนีเที่ยวของเด็กสองคน ที่ทำให้ทั้งเกาะต้องออกตามหา" },
];

export const genreLabels: Record<Genre, string> = { "Sci-Fi": "ไซไฟ", Drama: "ดราม่า", Thriller: "ระทึกขวัญ", Adventure: "ผจญภัย", Animation: "แอนิเมชัน", Romance: "โรแมนติก", Comedy: "คอมเมดี้" };
export const SELECTION_LIMIT = 5;

export function parseSelection(value: string | null): Movie[] {
  if (!value) return [];
  const ids = [...new Set(value.split(",").map(Number))];
  return ids.flatMap(id => { const movie = movies.find(m => m.id === id); return movie ? [movie] : []; }).slice(0, SELECTION_LIMIT);
}

/** Local, deterministic genre matching for the UI demo. No AI or network requests. */
export function recommend(selected: Movie[]) {
  const weights = new Map<Genre, number>();
  selected.forEach(movie => movie.genres.forEach(genre => weights.set(genre, (weights.get(genre) ?? 0) + 1)));
  return movies.filter(movie => !selected.some(item => item.id === movie.id)).map(movie => {
    const shared = movie.genres.filter(genre => weights.has(genre)).sort((a, b) => weights.get(b)! - weights.get(a)!);
    const score = shared.reduce((sum, genre) => sum + weights.get(genre)!, 0);
    return { ...movie, score, reason: shared.length ? `เพราะคุณชอบหนัง${shared.slice(0, 2).map(genre => genreLabels[genre]).join("และ")}` : "ลองเปิดประสบการณ์กับหนังแนวใหม่" };
  }).sort((a, b) => b.score - a.score || Number(b.rating) - Number(a.rating)).slice(0, 6);
}
