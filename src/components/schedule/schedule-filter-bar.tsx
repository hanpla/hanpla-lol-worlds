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
 * 월별 네비게이션 탭과 LCK 전용 필터 스위치를 조화롭게 묶어주는 반응형 필터 바 컴포넌트입니다.
 * 모바일 화면(320px~)과 데스크톱 화면에서 일관된 터치 영역과 정렬을 보장합니다.
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
        "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/50 p-2.5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-3",
        className,
      )}
    >
      <div className="flex items-center justify-start">
        <MonthTabs selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
      </div>

      <div className="flex items-center justify-end">
        <LckFilterToggle isLckOnly={isLckOnly} onToggle={onLckToggle} count={lckCount} />
      </div>
    </div>
  );
};
