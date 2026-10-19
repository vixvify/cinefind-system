"use client";

import { useEffect, useState } from "react";
import { SELECTION_LIMIT } from "@/core/constants/movie.constant";
import type { Movie } from "@/core/domain/movie";
import type { RecommendationResult } from "@/core/domain/recommendation";
import { API_ROUTES } from "@/routes/routes";
import { useRecommendationCache } from "./recommendation-provider";

interface RequestState {
  key: string;
  error: string | null;
}

export function useRecommendations(selected: Movie[]) {
  const { result, saveResult } = useRecommendationCache();
  const [attempt, setAttempt] = useState(0);
  const [requestState, setRequestState] = useState<RequestState>({ key: "", error: null });
  const key = selected.map(movie => movie.id).join(",");
  const valid = selected.length === SELECTION_LIMIT;
  const cached = result?.key === key ? result.movies : null;

  useEffect(() => {
    if (!valid || cached) return;
    const controller = new AbortController();
    setRequestState({ key, error: null });

    async function load() {
      try {
        const response = await fetch(API_ROUTES.RECOMMENDATIONS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieIds: key.split(",").map(Number) }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const messages: Record<number, string> = {
            400: "กรุณาเลือกหนังให้ครบ 5 เรื่อง",
            422: "AI ยังไม่รู้จักหนังบางเรื่อง ลองเปลี่ยนรายการหนัง",
            504: "ระบบใช้เวลานานกว่าปกติ ลองอีกครั้งได้เลย",
          };
          throw new Error(messages[response.status] ?? "ยังเชื่อมต่อระบบแนะนำหนังไม่ได้ ลองอีกครั้งได้เลย");
        }
        const data: RecommendationResult = await response.json();
        if (!Array.isArray(data.recommendations)) throw new Error("ยังอ่านผลแนะนำไม่ได้ กรุณาลองอีกครั้ง");
        if (!controller.signal.aborted) saveResult({ key, movies: data.recommendations });
      } catch (error) {
        if (!controller.signal.aborted) {
          setRequestState({ key, error: error instanceof Error ? error.message : "เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง" });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [key, valid, cached, saveResult, attempt]);

  return {
    movies: cached ?? [],
    status: cached ? "success" as const : requestState.key === key && requestState.error ? "error" as const : "loading" as const,
    error: requestState.key === key ? requestState.error : null,
    retry: () => {
      setRequestState({ key, error: null });
      setAttempt(current => current + 1);
    },
  };
}
