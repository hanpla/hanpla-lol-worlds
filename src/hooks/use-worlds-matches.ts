"use client";

import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { get2026WorldsMatches } from "@/lib/api/pandascore-api";
import type { Match } from "@/types/pandascore";

/**
 * 롤드컵 경기 목록 SWR 전역 캐시 키 상수
 */
export const WORLDS_MATCHES_CACHE_KEY = "worlds-2026-matches" as const;

export type UseWorldsMatchesOptions = {
  /**
   * SSR 또는 서버 컴포넌트에서 사전에 페치된 초기 경기 목록 (SWR fallbackData)
   */
  initialMatches?: readonly Match[];
  /**
   * 백그라운드 자동 갱신 주기 (ms 단위, 기본값: 진행 중 경기 있을 시 30초, 없을 시 60초)
   */
  refreshInterval?: number;
};

export type UseWorldsMatchesReturn = {
  /**
   * 최신 롤드컵 경기 목록 (SWR 캐시 및 백그라운드 재검증 결과 반영)
   */
  matches: Match[];
  /**
   * 백그라운드에서 데이터를 재검증(페치) 중인지 여부
   */
  isValidating: boolean;
  /**
   * 데이터 초기 로딩 중인지 여부 (fallbackData가 주어지면 false 유지)
   */
  isLoading: boolean;
  /**
   * 에러 객체 (에러 발생 시)
   */
  error: Error | null;
  /**
   * 현재 진행 중(running)인 경기가 존재하는지 여부
   */
  hasRunningMatch: boolean;
  /**
   * 수동 데이터 갱신 및 캐시 재검증 트리거
   */
  refresh: () => Promise<Match[] | undefined>;
};

/**
 * Next.js 16 Server Action("use server" + "use cache")과 SWR을 결합한 하이브리드 동기화 훅입니다.
 *
 * 1. REST API 라우트(/api/matches) 없이 Server Action(get2026WorldsMatches)을 직접 호출합니다.
 * 2. 서버는 cacheLife({ stale: 30 / 300 })로 라이브 경기 유무에 맞춰 동적으로 캐시를 관리합니다.
 * 3. 클라이언트는 SWR을 통해 탭 복귀(revalidateOnFocus), 네트워크 복구(revalidateOnReconnect),
 *    탭 비활성화 시 자동 절전 폴링(refreshInterval)을 수행합니다.
 */
export const useWorldsMatches = ({
  initialMatches = [],
  refreshInterval,
}: UseWorldsMatchesOptions = {}): UseWorldsMatchesReturn => {
  const fallbackList = useMemo(() => [...initialMatches], [initialMatches]);

  const { data, error, isLoading, isValidating, mutate } = useSWR<Match[]>(
    WORLDS_MATCHES_CACHE_KEY,
    () => get2026WorldsMatches(),
    {
      fallbackData: fallbackList.length > 0 ? fallbackList : undefined,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
      refreshInterval: (latestData) => {
        if (refreshInterval !== undefined) {
          return refreshInterval;
        }
        const current = latestData ?? fallbackList;
        const isRunning = current.some((m) => m.status === "running");
        return isRunning ? 30000 : 60000;
      },
    },
  );

  const currentMatches = data ?? fallbackList;
  const hasRunningMatch = useMemo(
    () => currentMatches.some((match) => match.status === "running"),
    [currentMatches],
  );

  const refresh = useCallback(async (): Promise<Match[] | undefined> => {
    return mutate();
  }, [mutate]);

  return {
    matches: currentMatches,
    isValidating,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    hasRunningMatch,
    refresh,
  };
};
