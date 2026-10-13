"use client";

import { LckFilterToggle } from "@/components/filter/lck-filter-toggle";
import { MonthTabs } from "@/components/filter/month-tabs";
import { cn } from "@/lib/utils";

export type ScheduleFilterBarProps = {
  /**
   * 현재 선택된 대회 월 (예: 10, 11)
   */
  selectedMonth: number;
  /**
   * 월 변경 이벤트 핸들러
   */
  onMonthChange: (month: number) => void;
  /**
   * LCK 전용 필터 활성화 여부
   */
  isLckOnly: boolean;
  /**
   * LCK 필터 토글 이벤트 핸들러
   */
  onLckToggle: (active: boolean) => void;
  /**
   * 현재 선택된 월의 LCK 경기 수
   */
  lckCount?: number;
  /**
   * 컨테이너 추가 클래스명
   */
  className?: string;
};

/**
 * 월별 네비게이션 탭과 LCK 전용 필터 스위치를 헤더 바로 아래 고정(sticky top-14) 배치하는 필터 바 컴포넌트입니다.
 * 스크롤 시 헤더와 함께 고정되어 내려오며 모바일 화면(320px~)과 데스크톱 화면에서 일관된 터치 영역과 정렬을 보장합니다.
 */
export const ScheduleFilterBar = ({
  selectedMonth,
  onMonthChange,
  isLckOnly,
  onLckToggle,
  lckCount,
  className,
}: ScheduleFilterBarProps) => {
  return (
    <div
      aria-label="경기 일정 필터 옵션"
      className={cn(
        "sticky top-14 z-30 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors",
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 px-2.5 py-2 min-[360px]:gap-1.5 min-[360px]:px-3 sm:gap-4 sm:px-6 sm:py-2.5 lg:px-8">
        <div className="flex items-center justify-start">
          <MonthTabs selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
        </div>

        <div className="flex items-center justify-end">
          <LckFilterToggle isLckOnly={isLckOnly} onToggle={onLckToggle} count={lckCount} />
        </div>
      </div>
    </div>
  );
};
