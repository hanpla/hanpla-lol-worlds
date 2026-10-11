"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isLckMatch } from "@/constants/teams";
import { getMonthKst } from "@/lib/date/kst-date";
import {
  getDefaultWorldsMonth,
  groupMatchesByKstDate,
  parseLckQuery,
  parseMonthQuery,
} from "@/lib/schedule/filter-schedule";
import type { GroupedSchedule, Match } from "@/types/pandascore";

export type UseScheduleFilterOptions = {
  /**
   * 전체 2026 롤드컵 경기 목록
   */
  matches: readonly Match[];
};

export type UseScheduleFilterReturn = {
  /**
   * 현재 선택된 월 (예: 10, 11)
   */
  selectedMonth: number;
  /**
   * 월 변경 핸들러
   */
  handleMonthChange: (month: number) => void;
  /**
   * LCK 전용 필터 활성화 여부
   */
  isLckOnly: boolean;
  /**
   * LCK 필터 토글 핸들러
   */
  handleLckToggle: (active: boolean) => void;
  /**
   * 모든 필터를 기본 상태로 초기화하는 핸들러
   */
  handleResetFilters: () => void;
  /**
   * 현재 월의 LCK 경기 수
   */
  lckCount: number;
  /**
   * 현재 필터 조건이 적용된 KST 일자별 그룹화 일정 목록
   */
  groupedSchedules: GroupedSchedule[];
  /**
   * 현재 필터 조건이 적용된 순수 경기 목록
   */
  filteredMatches: Match[];
  /**
   * React Transition 진행 여부
   */
  isPending: boolean;
};

/**
 * 롤드컵 경기 일정 필터링 및 URL Query Parameter(?month=10&lck=true) 양방향 동기화를 관리하는 커스텀 훅입니다.
 * React 19의 useTransition과 Vercel Best Practices(단일 루프 통합, shallow replace)를 적용하여 최적의 성능을 제공합니다.
 */
export const useScheduleFilter = ({
  matches,
}: UseScheduleFilterOptions): UseScheduleFilterReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. 첫 진입 기본 월 계산 (진행 중 > 가장 가까운 예정 > 마지막 경기)
  const defaultMonth = useMemo(() => getDefaultWorldsMonth(matches), [matches]);

  // 2. URL 쿼리 파라미터로부터 현재 선택된 월 및 LCK 필터 상태 추출
  const monthParam = searchParams.get("month");
  const selectedMonth = useMemo(
    () => parseMonthQuery(monthParam, defaultMonth),
    [monthParam, defaultMonth],
  );

  const lckParam = searchParams.get("lck");
  const isLckOnly = useMemo(() => parseLckQuery(lckParam), [lckParam]);

  // 3. URL 쿼리 파라미터 업데이트 함수 (startTransition으로 UI 블로킹 방지 및 shallow update)
  const updateQueryParams = useCallback(
    (newMonth: number, nextLck: boolean) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        // 월 파라미터 설정
        params.set("month", String(newMonth));

        // LCK 필터 파라미터 설정 (활성화 시 true, 비활성화 시 제거)
        if (nextLck) {
          params.set("lck", "true");
        } else {
          params.delete("lck");
        }

        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(targetUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  // 4. 월 변경 이벤트 핸들러
  const handleMonthChange = useCallback(
    (newMonth: number) => {
      if (newMonth === selectedMonth) {
        return;
      }
      updateQueryParams(newMonth, isLckOnly);
    },
    [selectedMonth, isLckOnly, updateQueryParams],
  );

  // 5. LCK 필터 토글 이벤트 핸들러
  const handleLckToggle = useCallback(
    (active: boolean) => {
      updateQueryParams(selectedMonth, active);
    },
    [selectedMonth, updateQueryParams],
  );

  // 6. 필터 초기화 핸들러 (모든 쿼리 파라미터 제거)
  const handleResetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  // 7. 현재 선택된 월 내 LCK 경기 수 및 조건에 맞는 경기 필터링 (단일 순회 최적화: js-combine-iterations)
  const { filteredMatches, lckCount } = useMemo(() => {
    let count = 0;
    const filtered: Match[] = [];

    for (const match of matches) {
      const dateStr = match.scheduled_at ?? match.begin_at;
      if (!dateStr) {
        continue;
      }

      const matchMonth = getMonthKst(dateStr);
      if (matchMonth !== selectedMonth) {
        continue;
      }

      const isLck = isLckMatch(match);
      if (isLck) {
        count += 1;
      }

      if (!isLckOnly || isLck) {
        filtered.push(match);
      }
    }

    return { filteredMatches: filtered, lckCount: count };
  }, [matches, selectedMonth, isLckOnly]);

  // 8. KST 일자별 그룹화
  const groupedSchedules = useMemo(() => groupMatchesByKstDate(filteredMatches), [filteredMatches]);

  return {
    selectedMonth,
    handleMonthChange,
    isLckOnly,
    handleLckToggle,
    handleResetFilters,
    lckCount,
    groupedSchedules,
    filteredMatches,
    isPending,
  };
};
