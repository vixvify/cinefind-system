export type RecommendationErrorCode =
  | "INVALID_SELECTION"
  | "MOVIE_NOT_SUPPORTED"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "INVALID_AI_RESPONSE";

const errorDetails: Record<RecommendationErrorCode, { status: number; message: string }> = {
  INVALID_SELECTION: { status: 400, message: "กรุณาเลือกหนังที่แตกต่างกันให้ครบ 5 เรื่อง" },
  MOVIE_NOT_SUPPORTED: { status: 422, message: "AI ยังไม่รู้จักหนังบางเรื่องที่เลือก ลองเปลี่ยนรายการหนัง" },
  AI_UNAVAILABLE: { status: 503, message: "ยังเชื่อมต่อระบบแนะนำหนังไม่ได้ กรุณาลองอีกครั้ง" },
  AI_TIMEOUT: { status: 504, message: "ระบบแนะนำหนังใช้เวลานานกว่าปกติ กรุณาลองอีกครั้ง" },
  INVALID_AI_RESPONSE: { status: 502, message: "ยังอ่านผลแนะนำไม่ได้ กรุณาลองอีกครั้ง" },
};

export class RecommendationError extends Error {
  readonly code: RecommendationErrorCode;
  readonly status: number;

  constructor(code: RecommendationErrorCode) {
    super(errorDetails[code].message);
    this.name = "RecommendationError";
    this.code = code;
    this.status = errorDetails[code].status;
  }
}
