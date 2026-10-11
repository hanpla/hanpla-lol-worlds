import { TimelineSection } from "@/components/schedule/timeline-section";
import { cn } from "@/lib/utils";
import type { GroupedSchedule } from "@/types/pandascore";

export type ScheduleTimelineProps = {
  groupedSchedules: GroupedSchedule[];
  className?: string;
  emptySlot?: React.ReactNode;
};

/**
 * 일자별로 그룹화된 롤드컵 전체 일정을 순서대로 렌더링하는 타임라인 컨테이너 컴포넌트입니다.
 */
export const ScheduleTimeline = ({
  groupedSchedules,
  className,
  emptySlot,
}: ScheduleTimelineProps) => {
  // dateKey("YYYY-MM-DD") 기준으로 날짜 섹션 오름차순 정렬
  const sortedSchedules = [...groupedSchedules].sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  // 일정이 존재하지 않는 경우 빈 상태 슬롯 또는 fallback 렌더링
  if (sortedSchedules.length === 0) {
    if (emptySlot) {
      return <>{emptySlot}</>;
    }

    return (
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-12 text-center text-muted-foreground">
        <p className="text-sm font-medium">표시할 경기 일정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      aria-label="2026 롤드컵 경기 타임라인"
      className={cn("w-full space-y-8 sm:space-y-10", className)}
    >
      {sortedSchedules.map((schedule) => (
        <TimelineSection key={schedule.dateKey} schedule={schedule} />
      ))}
    </div>
  );
};
