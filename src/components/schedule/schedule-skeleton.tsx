import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// 날짜 그룹별 스켈레톤 카드 배치 수 (일자 1: 2경기, 일자 2: 2경기, 일자 3: 1경기)
const SKELETON_SECTION_COUNTS = [2, 2, 1] as const;

export type DateHeaderSkeletonProps = {
  className?: string;
};

export const DateHeaderSkeleton = ({ className }: DateHeaderSkeletonProps) => {
  return (
    <div
      className={cn(
        "mb-3 flex items-center justify-between border-b border-border/60 py-2",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-5 rounded-md" />
        <Skeleton className="h-6 w-32 sm:w-40" />
      </div>
      <Skeleton className="h-4 w-14 opacity-70" />
    </div>
  );
};

type TeamSkeletonProps = {
  isReversed?: boolean;
};

const TeamSkeleton = ({ isReversed = false }: TeamSkeletonProps) => {
  return (
    <div
      className={cn("flex flex-1 items-center gap-3", isReversed && "flex-row-reverse text-right")}
    >
      <Skeleton className="size-10 shrink-0 rounded-full sm:size-12" />
      <div className={cn("flex flex-col gap-1.5", isReversed && "items-end")}>
        <Skeleton className="h-5 w-20 sm:w-28" />
        <Skeleton className="h-3.5 w-12 opacity-70" />
      </div>
    </div>
  );
};

export type MatchCardSkeletonProps = {
  className?: string;
};

export const MatchCardSkeleton = ({ className }: MatchCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "shadow-xs relative overflow-hidden rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {/* 상단 메타 바 (경기 시작 시간, 스테이지 정보, 상태 배지) */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <div className="h-3 w-1 rounded-full bg-border" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* 대진 영역 (팀 1 vs 팀 2) */}
        <div className="flex items-center justify-between py-1">
          <TeamSkeleton />
          <div className="flex shrink-0 flex-col items-center justify-center px-3 sm:px-6">
            <Skeleton className="h-6 w-14 sm:w-16" />
            <Skeleton className="mt-1 h-3 w-8" />
          </div>
          <TeamSkeleton isReversed />
        </div>

        {/* 하단 아코디언 토글 힌트 바 */}
        <div className="flex items-center justify-center border-t border-border/30 pt-1">
          <Skeleton className="h-3 w-24 opacity-60" />
        </div>
      </div>
    </div>
  );
};

export type ScheduleSkeletonProps = {
  className?: string;
};

export const ScheduleSkeleton = ({ className }: ScheduleSkeletonProps) => {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="경기 일정을 불러오는 중입니다"
      className={cn("w-full space-y-8", className)}
    >
      <span className="sr-only">경기 일정 데이터를 불러오는 중입니다...</span>

      {SKELETON_SECTION_COUNTS.map((matchCount, groupIndex) => (
        <div key={`skeleton-group-${groupIndex}`} className="space-y-4">
          <DateHeaderSkeleton />
          <div className="grid gap-3.5 sm:gap-4">
            {Array.from({ length: matchCount }, (_, i) => (
              <MatchCardSkeleton key={`skeleton-card-${groupIndex}-${i}`} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
