import { Calendar } from "lucide-react";
import { MatchAccordion } from "@/components/schedule/match-accordion";
import { cn } from "@/lib/utils";
import type { GroupedSchedule, Match } from "@/types/pandascore";

export type TimelineSectionProps = {
  schedule: GroupedSchedule;
  className?: string;
};

type TimelineHeaderProps = {
  dateKey: string;
  formattedDate: string;
  matchCount: number;
};

const TimelineHeader = ({ dateKey, formattedDate, matchCount }: TimelineHeaderProps) => {
  return (
    <div className="mb-3.5 flex items-center justify-between border-b border-border/60 pb-2.5 pt-1">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <div
          className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Calendar className="size-4" />
        </div>
        <h2
          id={`date-heading-${dateKey}`}
          className="text-base font-bold tracking-tight text-foreground sm:text-lg"
        >
          {formattedDate}
        </h2>
      </div>

      <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
        총 {matchCount}경기
      </span>
    </div>
  );
};

/**
 * 특정 KST 일자에 배정된 경기들을 일자 헤더와 함께 시간순으로 렌더링하는 섹션 컴포넌트입니다.
 */
export const TimelineSection = ({ schedule, className }: TimelineSectionProps) => {
  // 경기 목록을 시작 시간(scheduled_at 또는 begin_at) 기준 오름차순으로 정렬 (ISO 문자열 직접 비교로 GC 부하 최적화)
  const sortedMatches = [...schedule.matches].sort((a: Match, b: Match) => {
    const timeA = a.scheduled_at ?? a.begin_at ?? "";
    const timeB = b.scheduled_at ?? b.begin_at ?? "";
    return timeA.localeCompare(timeB);
  });

  return (
    <section
      id={`date-section-${schedule.dateKey}`}
      aria-labelledby={`date-heading-${schedule.dateKey}`}
      className={cn("w-full scroll-mt-20", className)}
    >
      <TimelineHeader
        dateKey={schedule.dateKey}
        formattedDate={schedule.formattedDate}
        matchCount={sortedMatches.length}
      />

      <div className="grid gap-3.5 sm:gap-4">
        {sortedMatches.map((match) => (
          <MatchAccordion key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};
