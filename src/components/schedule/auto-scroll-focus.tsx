"use client";

import { useEffect, useRef } from "react";
import { smoothScrollToElement } from "@/lib/scroll/smooth-scroll";
import { getTargetMatchId } from "@/lib/schedule/filter-schedule";
import type { Match } from "@/types/pandascore";

export type AutoScrollFocusProps = {
  /**
   * 롤드컵 전체 또는 필터링된 경기 목록 (타깃 경기 자동 계산 시 사용)
   */
  matches?: readonly Match[];
  /**
   * 포커스할 특정 경기 ID (제공되지 않을 경우 matches 기반 자동 계산)
   */
  targetMatchId?: number | null;
  /**
   * 컴포넌트 마운트 후 스크롤 동작 시작 전 지연 시간 (ms, 기본값: 150ms)
   */
  delayMs?: number;
  /**
   * 스크롤 애니메이션 지속 시간 (ms, 미지정 시 거리에 따라 450~800ms 자동 계산)
   */
  scrollDurationMs?: number;
  /**
   * 펄스 하이라이트 애니메이션 유지 시간 (ms, 기본값: 1500ms)
   */
  highlightDurationMs?: number;
  /**
   * 스크롤 및 하이라이트 실행 완료 후 호출되는 콜백 (선택)
   */
  onScrolled?: (matchId: number) => void;
};

/**
 * 펄스 하이라이트 적용 시 카드 외곽선에 부여할 Tailwind CSS 클래스 목록
 */
const HIGHLIGHT_CLASSES = [
  "ring-2",
  "ring-primary",
  "ring-offset-2",
  "ring-offset-background",
  "animate-pulse",
] as const;

/**
 * 2026 롤드컵 일정 화면 진입 시 오늘 진행 중이거나 가장 가까운 다음 경기로
 * 부드럽게 스크롤(Smooth Scroll)하고 외곽선 펄스 애니메이션으로 강조하는 컨트롤러 컴포넌트입니다.
 * 공통 스크롤 엔진(requestAnimationFrame + easeInOutCubic)을 사용하여 브라우저 제약 없이 부드러운 이동을 보장합니다.
 */
export const AutoScrollFocus = ({
  matches = [],
  targetMatchId: explicitTargetMatchId,
  delayMs = 200,
  scrollDurationMs = 700,
  highlightDurationMs = 1500,
  onScrolled,
}: AutoScrollFocusProps) => {
  // 중복 스크롤 방지를 위한 단일 실행 플래그
  const hasScrolledRef = useRef(false);
  const cancelScrollRef = useRef<(() => void) | null>(null);

  // onScrolled 콜백 최신 참조 유지 (의존성 배열에서 제외하여 불필요한 이펙트 재실행 방지)
  const onScrolledRef = useRef(onScrolled);
  useEffect(() => {
    onScrolledRef.current = onScrolled;
  }, [onScrolled]);

  // 타깃 매치 ID 계산 (명시적 prop 우선 -> matches 기반 자동 계산)
  const resolvedTargetMatchId = explicitTargetMatchId ?? getTargetMatchId(matches);

  useEffect(() => {
    // 이미 첫 진입 시 스크롤을 수행했거나 유효한 타깃 매치가 없으면 중복 실행 방지
    if (hasScrolledRef.current || resolvedTargetMatchId == null) {
      return;
    }

    let highlightTimer: ReturnType<typeof setTimeout> | null = null;
    let targetElementRef: HTMLElement | null = null;

    const triggerScrollAndHighlight = (element: HTMLElement) => {
      hasScrolledRef.current = true;
      targetElementRef = element;

      // 1. 공통 스무스 스크롤 엔진(requestAnimationFrame + easeInOutCubic)으로 화면 중앙 정밀 이동
      cancelScrollRef.current?.();
      cancelScrollRef.current = smoothScrollToElement(element, {
        block: "center",
        duration: scrollDurationMs,
      });

      // 2. 1.5초간 ring 및 animate-pulse 하이라이트 클래스 일시 부여
      element.classList.add(...HIGHLIGHT_CLASSES);

      highlightTimer = setTimeout(() => {
        element.classList.remove(...HIGHLIGHT_CLASSES);
      }, highlightDurationMs);

      onScrolledRef.current?.(resolvedTargetMatchId);
    };

    // DOM 렌더링 및 폰트 레이아웃 안정화 대기 후 타깃 엘리먼트 탐색
    const scrollTimer = setTimeout(() => {
      const element = document.getElementById(`match-${resolvedTargetMatchId}`);
      if (element) {
        triggerScrollAndHighlight(element);
      } else {
        // 첫 프레임에 아직 DOM 노드가 완전히 마운트되지 않은 경우 1회 추가 재시도
        const retryTimer = setTimeout(() => {
          const retryElement = document.getElementById(`match-${resolvedTargetMatchId}`);
          if (retryElement) {
            triggerScrollAndHighlight(retryElement);
          }
        }, 200);

        return () => clearTimeout(retryTimer);
      }
    }, delayMs);

    return () => {
      clearTimeout(scrollTimer);
      cancelScrollRef.current?.();
      if (highlightTimer) {
        clearTimeout(highlightTimer);
      }
      if (targetElementRef) {
        targetElementRef.classList.remove(...HIGHLIGHT_CLASSES);
      }
    };
  }, [resolvedTargetMatchId, delayMs, scrollDurationMs, highlightDurationMs]);

  return null;
};
