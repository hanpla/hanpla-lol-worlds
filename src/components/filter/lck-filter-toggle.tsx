"use client";

import { cn } from "@/lib/utils";

export type LckFilterToggleProps = {
  /**
   * LCK 팀 경기만 필터링 활성화 여부
   */
  isLckOnly: boolean;
  /**
   * 필터 토글 이벤트 핸들러
   */
  onToggle: (active: boolean) => void;
  /**
   * 필터링 대상 경기 수 (선택 사항)
   */
  count?: number;
  /**
   * 비활성화 여부
   */
  disabled?: boolean;
  /**
   * 컨테이너 추가 클래스명
   */
  className?: string;
};

type LckBadgeProps = {
  isActive: boolean;
  className?: string;
};

/**
 * LCK 공식 리그 브랜드 배지 서브 컴포넌트
 */
const LckBadge = ({ isActive, className }: LckBadgeProps) => {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black tracking-wider transition-colors duration-200",
        isActive
          ? "shadow-xs bg-primary text-primary-foreground"
          : "bg-muted-foreground/15 text-muted-foreground",
        className,
      )}
      aria-hidden="true"
    >
      KR
    </span>
  );
};

type LckToggleTrackProps = {
  isChecked: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * 스위치 트랙 및 슬라이딩 썸 서브 컴포넌트
 */
const LckToggleTrack = ({ isChecked, disabled, className }: LckToggleTrackProps) => {
  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out",
        isChecked ? "bg-primary" : "bg-muted-foreground/25 dark:bg-muted-foreground/30",
        disabled && "opacity-50",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "shadow-xs pointer-events-none inline-block size-4 transform rounded-full bg-background ring-0 transition-transform duration-200 ease-in-out",
          isChecked ? "translate-x-[18px] bg-primary-foreground shadow-sm" : "translate-x-0.5",
        )}
      />
    </span>
  );
};

/**
 * 2026 롤드컵 LCK 소속 팀들의 경기만 선별하여 볼 수 있는 필터 토글 버튼 컴포넌트입니다.
 * 모바일 최소 터치 타깃(44px)과 WAI-ARIA Switch 접근성을 준수합니다.
 */
export const LckFilterToggle = ({
  isLckOnly,
  onToggle,
  count,
  disabled = false,
  className,
}: LckFilterToggleProps) => {
  const handleClick = () => {
    if (!disabled) {
      onToggle(!isLckOnly);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLckOnly}
      aria-label="LCK 팀 경기만 필터링"
      title={isLckOnly ? "모든 경기 보기로 전환" : "LCK 출전 경기만 필터링"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "focus-visible:outline-hidden group relative inline-flex min-h-[44px] min-w-[44px] items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] sm:px-4 sm:text-sm",
        isLckOnly
          ? "shadow-xs border-primary/40 bg-primary/10 text-primary ring-1 ring-primary/20 dark:border-primary/50 dark:bg-primary/15"
          : "border-border/80 bg-background/80 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50 active:scale-100",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <LckBadge isActive={isLckOnly} />
        <span className="font-semibold tracking-tight">LCK 경기만</span>
        {count !== undefined ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums transition-colors duration-200",
              isLckOnly ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {count}
          </span>
        ) : null}
      </div>

      <LckToggleTrack isChecked={isLckOnly} disabled={disabled} />
    </button>
  );
};
