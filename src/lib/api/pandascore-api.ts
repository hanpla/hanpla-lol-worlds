"use server";

import { cacheLife } from "next/cache";
import { WORLDS_2026_SERIE_ID } from "@/constants/tournament";
import { matchesResponseSchema, type Match } from "@/types/pandascore";

const PANDASCORE_MATCHES_API_URL = `https://api.pandascore.co/lol/matches?filter[serie_id]=${WORLDS_2026_SERIE_ID}&sort=scheduled_at`;

/**
 * 2026 롤드컵(Worlds) 전체 경기 일정을 PandaScore API로부터 페치합니다.
 * Next.js 16의 Cache Components("use cache" 및 cacheLife)를 적용하여:
 * - 진행 중(running)인 라이브 경기가 있을 경우: 30초 stale, 60초 revalidate, 5분 expire 단기 캐시 적용
 * - 그 외(예정/종료): 5분(300초) stale, 최대 10분 expire 캐시 적용
 *
 * "use server"가 선언되어 있어 서버 컴포넌트뿐만 아니라 클라이언트 SWR 훅에서도 Server Action으로 직접 호출 가능합니다.
 *
 * @throws {Error} 환경변수 PANDASCORE_API_TOKEN이 설정되지 않았거나 API 응답 또는 Zod 파싱 오류 시 예외 발생
 */
export const get2026WorldsMatches = async (): Promise<Match[]> => {
  "use cache";

  const token = process.env.PANDASCORE_API_TOKEN;
  if (!token) {
    throw new Error("PANDASCORE_API_TOKEN is not configured in environment variables");
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[PandaScore API] Upstream fetch triggered: ${PANDASCORE_MATCHES_API_URL}`);
  }

  const response = await fetch(PANDASCORE_MATCHES_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
  }

  const rawData: unknown = await response.json();
  const parsed = matchesResponseSchema.safeParse(rawData);

  if (!parsed.success) {
    console.error("Zod Validation Error:", parsed.error.format());
    throw new Error("Invalid match data format received from PandaScore API");
  }

  const matches = parsed.data;

  // 진행 중인 라이브 경기 존재 여부에 따라 서버 캐시 수명(cacheLife) 동적 제어
  const hasRunningMatch = matches.some((m) => m.status === "running");
  if (hasRunningMatch) {
    cacheLife({
      stale: 30, // 30초
      revalidate: 60, // 60초
      expire: 300, // 5분
    });
  } else {
    cacheLife({
      stale: 300, // 5분
      expire: 600, // 최대 10분
    });
  }

  return matches;
};
