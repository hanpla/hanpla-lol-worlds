export type SmoothScrollOptions = {
  /**
   * 스크롤 애니메이션 지속 시간 (ms, 미지정 시 거리에 따라 600~950ms 자동 계산)
   */
  duration?: number;
  /**
   * 스크롤 완료 시 실행할 콜백 함수
   */
  onComplete?: () => void;
  /**
   * 커스텀 가감속 이징 함수 (기본값: easeInOutCubic)
   */
  easing?: (progress: number) => number;
  /**
   * OS '모션 감소(prefers-reduced-motion)' 설정 시 애니메이션 생략 여부 (기본값: false, TICKET-203 명세에 따라 OS/브라우저 설정과 무관하게 스무스 스크롤 보장)
   */
  respectReducedMotion?: boolean;
};

export type SmoothScrollElementOptions = SmoothScrollOptions & {
  /**
   * 뷰포트 내 정렬 위치 (기본값: 'center')
   */
  block?: "start" | "center" | "end";
  /**
   * 추가 Y축 오프셋 (픽셀 단위, 양수는 아래로, 음수는 위로 이동)
   */
  offset?: number;
};

/**
 * 부드러운 가감속을 위한 easeInOutCubic 베지어 이징 함수
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * 지정한 절대 Y 좌표로 requestAnimationFrame 기반의 부드러운 가감속 스크롤을 수행합니다.
 * TICKET-203 명세에 따라 OS/브라우저 설정과 무관하게 600~950ms 동안 시각적으로 확실히 체감되는 부드러운 가감속 스크롤을 보장합니다.
 *
 * @param targetY 이동할 목표 문서 Y 좌표 (픽셀)
 * @param options 스크롤 옵션 (지속 시간, 완료 콜백, 이징 함수 등)
 * @returns 진행 중인 애니메이션을 중단할 수 있는 cancel 함수
 */
export const smoothScrollTo = (targetY: number, options?: SmoothScrollOptions): (() => void) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const clientHeight = window.innerHeight || document.documentElement.clientHeight;
  const maxScrollTop = Math.max(0, scrollHeight - clientHeight);
  const clampedTargetY = Math.max(0, Math.min(Math.round(targetY), maxScrollTop));

  // 명시적으로 respectReducedMotion: true가 지정된 경우에만 모션 감소 적용
  if (options?.respectReducedMotion) {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, clampedTargetY);
      if (document.documentElement.scrollTop !== clampedTargetY) {
        document.documentElement.scrollTop = clampedTargetY;
      }
      options?.onComplete?.();
      return () => {};
    }
  }

  const startY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const distance = clampedTargetY - startY;

  // 이동 거리가 극히 미미한 경우 즉시 이동 완료
  if (Math.abs(distance) < 2) {
    window.scrollTo(0, clampedTargetY);
    if (document.documentElement.scrollTop !== clampedTargetY) {
      document.documentElement.scrollTop = clampedTargetY;
    }
    options?.onComplete?.();
    return () => {};
  }

  // 시각적으로 확실히 체감되는 부드러운 가감속 시간 (기본 600ms ~ 950ms)
  const duration = options?.duration ?? Math.min(Math.max(Math.abs(distance) * 0.6, 600), 950);
  const easing = options?.easing ?? easeInOutCubic;

  let animationFrameId: number | null = null;
  let startTime: number | null = null;

  const step = (currentTime: number) => {
    // 첫 프레임 진입 시 정확한 시작 시각 동기화 (초기 점프 방지)
    if (startTime === null) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easing(progress);

    const nextY = Math.round(startY + distance * ease);

    // 모든 브라우저 및 루트 엘리먼트 스크롤 동기화
    window.scrollTo(0, nextY);
    if (document.documentElement.scrollTop !== nextY) {
      document.documentElement.scrollTop = nextY;
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      animationFrameId = null;
      window.scrollTo(0, clampedTargetY);
      if (document.documentElement.scrollTop !== clampedTargetY) {
        document.documentElement.scrollTop = clampedTargetY;
      }
      options?.onComplete?.();
    }
  };

  animationFrameId = requestAnimationFrame(step);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
};

/**
 * 특정 DOM 요소를 뷰포트 정중앙(또는 상단/하단)에 부드럽게 안착시키는 스크롤을 수행합니다.
 *
 * @param element 포커스할 대상 HTML 엘리먼트
 * @param options 스크롤 옵션 (정렬 위치 block, 지속 시간, 완료 콜백 등)
 * @returns 진행 중인 애니메이션을 중단할 수 있는 cancel 함수
 */
export const smoothScrollToElement = (
  element: HTMLElement,
  options?: SmoothScrollElementOptions,
): (() => void) => {
  if (typeof window === "undefined" || !element) {
    return () => {};
  }

  const rect = element.getBoundingClientRect();
  const currentScrollY =
    window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  const elementAbsoluteTop = currentScrollY + rect.top;

  const block = options?.block ?? "center";
  let targetY = elementAbsoluteTop;

  if (block === "center") {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    targetY = elementAbsoluteTop - windowHeight / 2 + rect.height / 2;
  } else if (block === "end") {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    targetY = elementAbsoluteTop - windowHeight + rect.height;
  }

  if (options?.offset) {
    targetY += options.offset;
  }

  return smoothScrollTo(targetY, options);
};
