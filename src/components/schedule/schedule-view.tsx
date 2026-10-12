"use client";

import { AutoScrollFocus } from "@/components/schedule/auto-scroll-focus";
import { EmptyState } from "@/components/schedule/empty-state";
import { ScheduleFilterBar } from "@/components/schedule/schedule-filter-bar";
import { ScheduleTimeline } from "@/components/schedule/schedule-timeline";
import { useScheduleFilter } from "@/hooks/use-schedule-filter";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/pandascore";

export type ScheduleViewProps = {
  /**
   * 전체 롤드컵 경기 목록
   */
  matches: readonly Match[];
  /**
   * 컨테이너 추가 클래스명
   */
  className?: string;
};

/**
 * 2026 롤드컵 전체 일정 조회 화면의 메인 뷰 클라이언트 컴포넌트입니다.
 * 필터 툴바 조작과 URL 쿼리 파라미터 동기화, 일정 타임라인 렌더링을 유기적으로 결합합니다.
 */
export const ScheduleView = ({ matches, className }: ScheduleViewProps) => {
  const {
    selectedMonth,
    handleMonthChange,
    isLckOnly,
    handleLckToggle,
    handleResetFilters,
    lckCount,
    groupedSchedules,
    isPending,
  } = useScheduleFilter({ matches });

  // 빈 상태 커스텀 메시지 구성
  const emptyTitle = isLckOnly
    ? `${selectedMonth}월에 확정된 LCK 팀의 경기가 없습니다.`
    : `${selectedMonth}월에 예정된 경기 일정이 없습니다.`;

  const emptyDescription = isLckOnly
    ? "상위 라운드 대진이 확정되거나 필터를 초기화하면 전체 일정을 확인할 수 있습니다."
    : "해당 월의 경기 일정이 아직 발표되지 않았거나 종료되었습니다.";

  return (
    <section aria-label="2026 롤드컵 경기 일정" className={cn("w-full", className)}>
      {/* 0. 오늘/다음 경기 자동 스무스 스크롤 포커스 컨트롤러 */}
      <AutoScrollFocus matches={matches} />

      {/* 1. 상단 월별 탭 & LCK 필터 툴바 (헤더 아래 고정 스티키 바) */}
      <ScheduleFilterBar
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        isLckOnly={isLckOnly}
        onLckToggle={handleLckToggle}
        lckCount={lckCount}
      />

      {/* 2. 일정 타임라인 섹션 목록 (경기 없을 시 EmptyState 노출) */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className={cn("transition-opacity duration-200", isPending && "opacity-60")}>
          <ScheduleTimeline
            groupedSchedules={groupedSchedules}
            emptySlot={
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                onReset={handleResetFilters}
                resetButtonText="전체 경기 보기"
              />
            }
          />
        </div>
      </div>
    </section>
  );
};
