"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const DEFAULT_WORLDS_MONTHS = [10, 11] as const;
export type WorldsMonth = (typeof DEFAULT_WORLDS_MONTHS)[number];

export type MonthTabsProps = {
  /**
   * 현재 선택된 월 (예: 10, 11)
   */
  selectedMonth: number;
  /**
   * 월 변경 이벤트 핸들러
   */
  onMonthChange: (month: number) => void;
  /**
   * 탭으로 표시할 월 목록 (기본값: [10, 11])
   */
  months?: readonly number[];
  /**
   * 컨테이너 추가 클래스명
   */
  className?: string;
};

type MonthTabButtonProps = {
  month: number;
  isSelected: boolean;
  onClick: (month: number) => void;
  className?: string;
};

/**
 * 개별 월 탭 버튼 서브 컴포넌트 (DRY 원칙 준수)
 */
const MonthTabButton = ({ month, isSelected, onClick, className }: MonthTabButtonProps) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-label={`${month}월 경기 일정 보기`}
      onClick={() => onClick(month)}
      className={cn(
        "focus-visible:outline-hidden relative flex min-h-[44px] min-w-[72px] items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] sm:min-w-[88px]",
        isSelected
          ? "shadow-xs border border-primary/25 bg-background font-bold text-primary dark:border-primary/30 dark:bg-card dark:text-primary"
          : "border border-transparent font-medium text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className,
      )}
    >
      <Calendar
        className={cn(
          "size-4 shrink-0 transition-colors duration-200",
          isSelected ? "text-primary" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
      <span>{month}월</span>
      {isSelected ? (
        <span
          className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
};

/**
 * 2026 롤드컵 대회의 10월 및 11월 일정을 전환하는 탭 네비게이션 컴포넌트입니다.
 * 모바일 최소 터치 타깃(44px)과 WAI-ARIA 탭 접근성을 완벽히 지원합니다.
 */
export const MonthTabs = ({
  selectedMonth,
  onMonthChange,
  months = DEFAULT_WORLDS_MONTHS,
  className,
}: MonthTabsProps) => {
  return (
    <div
      role="tablist"
      aria-label="월별 경기 일정 선택"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border/80 bg-muted/60 p-1 backdrop-blur-sm",
        className,
      )}
    >
      {months.map((month) => (
        <MonthTabButton
          key={month}
          month={month}
          isSelected={selectedMonth === month}
          onClick={onMonthChange}
        />
      ))}
    </div>
  );
};
