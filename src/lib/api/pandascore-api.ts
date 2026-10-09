import "server-only";

import { WORLDS_2026_SERIE_ID } from "@/constants/tournament";
import { formatToKstDate, getDateKeyKst } from "@/lib/date/kst-date";
import { matchesResponseSchema, type GroupedSchedule, type Match } from "@/types/pandascore";

const PANDASCORE_MATCHES_API_URL = `https://api.pandascore.co/lol/matches?filter[serie_id]=${WORLDS_2026_SERIE_ID}&sort=scheduled_at`;

/**
 * 2026 롤드컵(Worlds) 전체 경기 일정을 PandaScore API로부터 페치합니다.
 * Next.js Data Cache를 적용하여 5분(300초) 동안 캐시하며, 태그 기반 재검증을 위해 'worlds-matches-2026' 태그를 바인딩합니다.
 *
 * @throws {Error} 환경변수 PANDASCORE_API_TOKEN이 설정되지 않았거나 API 응답 또는 Zod 파싱 오류 시 예외 발생
 */
export const get2026WorldsMatches = async (): Promise<Match[]> => {
  const token = process.env.PANDASCORE_API_TOKEN;
  if (!token) {
    throw new Error("PANDASCORE_API_TOKEN is not configured in environment variables");
  }

  const response = await fetch(PANDASCORE_MATCHES_API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
      tags: ["worlds-matches-2026"],
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

  return parsed.data;
};

/**
 * 경기 목록(Match[])을 한국 표준시(KST, UTC+9) 일자별로 그룹화 및 정렬합니다.
 *
 * - 각 일자 그룹은 dateKey("YYYY-MM-DD") 기준으로 오름차순 정렬됩니다.
 * - 각 그룹 내 경기 목록(matches) 또한 scheduled_at(또는 begin_at) 기준 시간순 오름차순으로 정렬됩니다.
 *
 * @param matches 롤드컵 경기 목록
 * @returns KST 일자별로 그룹화된 일정 목록(GroupedSchedule[])
 */
export const groupMatchesByKstDate = (matches: Match[]): GroupedSchedule[] => {
  const groupsMap = new Map<string, GroupedSchedule>();

  for (const match of matches) {
    const dateString = match.scheduled_at ?? match.begin_at;
    if (!dateString) {
      continue;
    }

    const dateKey = getDateKeyKst(dateString);
    const existingGroup = groupsMap.get(dateKey);

    if (existingGroup) {
      existingGroup.matches.push(match);
    } else {
      groupsMap.set(dateKey, {
        dateKey,
        formattedDate: formatToKstDate(dateString),
        matches: [match],
      });
    }
  }

  const sortedGroups = Array.from(groupsMap.values()).sort((a, b) =>
    a.dateKey.localeCompare(b.dateKey),
  );

  for (const group of sortedGroups) {
    group.matches.sort((a, b) => {
      const timeA = new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
      const timeB = new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime();
      return timeA - timeB;
    });
  }

  return sortedGroups;
};
