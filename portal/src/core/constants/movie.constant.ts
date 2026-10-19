export const genreLabels = {
  Action: "แอ็กชัน",
  Adventure: "ผจญภัย",
  Animation: "แอนิเมชัน",
  Comedy: "คอมเมดี้",
  Crime: "อาชญากรรม",
  Documentary: "สารคดี",
  Drama: "ดราม่า",
  Family: "ครอบครัว",
  Fantasy: "แฟนตาซี",
  History: "ประวัติศาสตร์",
  Horror: "สยองขวัญ",
  Music: "ดนตรี",
  Mystery: "ลึกลับ",
  Romance: "โรแมนติก",
  "Sci-Fi": "ไซไฟ",
  "TV Movie": "ภาพยนตร์โทรทัศน์",
  Thriller: "ระทึกขวัญ",
  War: "สงคราม",
  Western: "คาวบอย",
  Unknown: "อื่น ๆ",
} as const;

export type Genre = keyof typeof genreLabels;

export const browseGenres: Genre[] = [
  "Action",
  "Sci-Fi",
  "Drama",
  "Thriller",
  "Animation",
  "Romance",
  "Comedy",
];

export const SELECTION_LIMIT = 5;
export const RECOMMENDATION_LIMIT = 6;
export const DEFAULT_PAGE_SIZE = 12;

export const ANALYSIS_STAGES = [
  "กำลังดูแนวหนังที่คุณชอบ",
  "กำลังจับคู่หนัง",
  "ลิสต์ของคุณพร้อมแล้ว",
] as const;

export const ANALYSIS_DURATION_MS = 4000;
export const ANALYSIS_TICK_MS = 100;

export const REQUIRED_DATASET_COLUMNS = [
  "id",
  "title",
  "genres",
  "release_date",
  "vote_average",
] as const;

export const MINIMUM_DATASET_SIZE = 11;
