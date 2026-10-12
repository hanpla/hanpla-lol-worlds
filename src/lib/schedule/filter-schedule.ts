import { DEFAULT_WORLDS_MONTHS, type WorldsMonth } from "@/components/filter/month-tabs";
import { isLckMatch } from "@/constants/teams";
import { formatToKstDate, getDateKeyKst, getMonthKst } from "@/lib/date/kst-date";
import type { GroupedSchedule, Match } from "@/types/pandascore";

export type FilterScheduleOptions = {
  month: number;
  isLckOnly: boolean;
};

/**
 * 쿼리 파라미터로 전달된 month 문자열을 유효한 대회 월 숫자로 파싱합니다.
 * 값이 없거나 지원하지 않는 월인 경우 기본 대체 월(fallbackMonth)을 반환합니다.
 */
export const parseMonthQuery = (
  monthParam: string | null | undefined,
  fallbackMonth: number,
): number => {
  if (!monthParam) {
    return fallbackMonth;
  }

  const parsed = Number.parseInt(monthParam, 10);
  if (Number.isNaN(parsed)) {
    return fallbackMonth;
  }

  const isSupportedMonth = (DEFAULT_WORLDS_MONTHS as readonly number[]).includes(parsed);
  return isSupportedMonth ? parsed : fallbackMonth;
};

/**
 * 쿼리 파라미터로 전달된 lck 문자열을 불리언 값으로 파싱합니다.
 * 'true' 또는 '1'인 경우에만 true로 인식합니다.
 */
export const parseLckQuery = (lckParam: string | null | undefined): boolean => {
  if (!lckParam) {
    return false;
  }

  const normalized = lckParam.trim().toLowerCase();
  return normalized === "true" || normalized === "1";
};

/**
 * 2026 롤드컵 경기 목록 중 자동 스크롤 및 포커스 대상이 될 타깃 경기(Target Match)를 계산합니다.
 *
 * 타깃 선정 우선순위:
 * 1. 현재 라이브 진행 중인 경기 (`status === 'running'`)
 * 2. 가장 빠른 미래 예정 경기 (`status === 'not_started'` 중 현재 시각 이후 가장 가까운 경기)
 * 3. 상태와 무관하게 현재 시각 이후에 예정된 가장 가까운 미래 경기
 * 4. 예정 시각이 다소 지났으나 아직 시작되지 않은 잔여 `not_started` 경기
 * 5. 모든 경기가 종료된 경우 마지막 결승전 매치
 *
 * @param matches 롤드컵 전체 또는 필터링된 경기 목록
 * @param referenceTime 기준 시각 (기본값: new Date())
 * @returns 포커스 대상 Match 객체 또는 경기가 없을 시 null
 */
export const getTargetMatch = (
  matches: readonly Match[],
  referenceTime: Date = new Date(),
): Match | null => {
  if (!matches || matches.length === 0) {
    return null;
  }

  // 1. 현재 진행 중인 경기 (running 우선)
  const runningMatch = matches.find((match) => match.status === "running");
  if (runningMatch) {
    return runningMatch;
  }

  const refTimestamp = referenceTime.getTime();

  // 2. 가장 빠른 미래 not_started 경기
  const futureNotStartedMatches = matches
    .filter((match) => {
      if (match.status !== "not_started") {
        return false;
      }
      const dateStr = match.scheduled_at ?? match.begin_at;
      if (!dateStr) {
        return false;
      }
      return new Date(dateStr).getTime() >= refTimestamp;
    })
    .sort((a, b) => {
      const timeA = new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
      const timeB = new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime();
      return timeA - timeB;
    });

  if (futureNotStartedMatches.length > 0) {
    return futureNotStartedMatches[0];
  }

  // 3. 상태와 무관하게 현재 시각 이후에 예정된 가장 가까운 미래 경기
  const futureMatches = matches
    .filter((match) => {
      const dateStr = match.scheduled_at ?? match.begin_at;
      if (!dateStr) {
        return false;
      }
      return new Date(dateStr).getTime() >= refTimestamp;
    })
    .sort((a, b) => {
      const timeA = new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
      const timeB = new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime();
      return timeA - timeB;
    });

  if (futureMatches.length > 0) {
    return futureMatches[0];
  }

  // 4. 예정 시각이 다소 지났으나 아직 시작되지 않은 not_started 경기
  const remainingNotStarted = matches
    .filter((match) => match.status === "not_started")
    .sort((a, b) => {
      const timeA = new Date(a.scheduled_at ?? a.begin_at ?? 0).getTime();
      const timeB = new Date(b.scheduled_at ?? b.begin_at ?? 0).getTime();
      return timeA - timeB;
    });

  if (remainingNotStarted.length > 0) {
    return remainingNotStarted[0];
  }

  // 5. 모든 경기가 종료된 경우 마지막 경기 (결승전)
  return matches[matches.length - 1];
};

/**
 * 타깃 경기(Target Match)의 고유 식별자(ID)를 반환합니다.
 *
 * @param matches 롤드컵 전체 또는 필터링된 경기 목록
 * @param referenceTime 기준 시각 (기본값: new Date())
 * @returns 포커스 대상 매치의 ID 또는 null
 */
export const getTargetMatchId = (
  matches: readonly Match[],
  referenceTime: Date = new Date(),
): number | null => {
  const target = getTargetMatch(matches, referenceTime);
  return target ? target.id : null;
};

/**
 * 경기 목록을 바탕으로 첫 화면 접속 시 기본으로 노출할 월(Month)을 계산합니다.
 * 타깃 경기(`getTargetMatch`)가 속한 한국 시간(KST) 월을 우선 선택합니다.
 *
 * @param matches 롤드컵 전체 경기 목록
 * @param referenceTime 기준 시각 (기본값: new Date())
 * @returns 기본 노출 월 (10 또는 11)
 */
export const getDefaultWorldsMonth = (
  matches: readonly Match[],
  referenceTime: Date = new Date(),
): number => {
  if (!matches || matches.length === 0) {
    return DEFAULT_WORLDS_MONTHS[0];
  }

  const targetMatch = getTargetMatch(matches, referenceTime);
  if (targetMatch) {
    const dateStr = targetMatch.scheduled_at ?? targetMatch.begin_at;
    if (dateStr) {
      const month = getMonthKst(dateStr);
      if ((DEFAULT_WORLDS_MONTHS as readonly number[]).includes(month)) {
        return month;
      }
    }
  }

  return DEFAULT_WORLDS_MONTHS[0];
};

/**
 * 특정 월(Month)에 배정된 경기 중 LCK 팀이 출전하는 경기 수를 계산합니다.
 */
export const countLckMatchesInMonth = (matches: readonly Match[], month: number): number => {
  return matches.filter((match) => {
    const dateStr = match.scheduled_at ?? match.begin_at;
    if (!dateStr) {
      return false;
    }
    return getMonthKst(dateStr) === month && isLckMatch(match);
  }).length;
};

/**
 * 월 선택 및 LCK 필터 조건에 따라 경기 목록을 필터링합니다.
 */
export const filterMatches = (
  matches: readonly Match[],
  options: FilterScheduleOptions,
): Match[] => {
  const { month, isLckOnly } = options;

  return matches.filter((match) => {
    const dateStr = match.scheduled_at ?? match.begin_at;
    if (!dateStr) {
      return false;
    }

    // 1. 월 필터링
    if (getMonthKst(dateStr) !== month) {
      return false;
    }

    // 2. LCK 전용 필터링
    if (isLckOnly && !isLckMatch(match)) {
      return false;
    }

    return true;
  });
};

/**
 * 경기 목록(Match[])을 한국 표준시(KST, UTC+9) 일자별로 그룹화 및 정렬합니다.
 * 클라이언트 및 서버 환경 모두에서 사용 가능한 순수 함수입니다.
 */
export const groupMatchesByKstDate = (matches: readonly Match[]): GroupedSchedule[] => {
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
