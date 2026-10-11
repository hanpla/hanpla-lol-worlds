"use client";

import { useRouter, usePathname } from "next/navigation";
import { CalendarX2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyStateProps = {
  /**
   * 상단에 표시할 주요 타이틀 안내 문구입니다.
   * @default "아직 확정된 LCK 팀의 경기가 없습니다."
   */
  title?: string;
  /**
   * 상세 설명 보조 문구입니다.
   * @default "선택하신 필터 조건에 해당하는 경기 일정이 없습니다. 대진이 확정되거나 필터를 변경하면 일정이 표시됩니다."
   */
  description?: string;
  /**
   * 필터 초기화 버튼 클릭 시 호출할 커스텀 콜백 함수입니다.
   * 전달되지 않은 경우 현재 경로로 쿼리 스트링을 초기화합니다.
   */
  onReset?: () => void;
  /**
   * 필터 초기화 버튼 텍스트입니다.
   * @default "필터 초기화"
   */
  resetButtonText?: string;
  /**
   * 필터 초기화 버튼 노출 여부입니다.
   * @default true
   */
  showResetButton?: boolean;
  /**
   * 컨테이너 추가 클래스명입니다.
   */
  className?: string;
};

type EmptyIconBadgeProps = {
  className?: string;
};

const EmptyIconBadge = ({ className }: EmptyIconBadgeProps) => {
  return (
    <div
      className={cn(
        "shadow-xs relative flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary ring-4 ring-primary/5 sm:size-20",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
      <CalendarX2 className="relative size-8 text-primary sm:size-10" />
    </div>
  );
};

type ResetActionButtonProps = {
  onClick: () => void;
  label: string;
  className?: string;
};

const ResetActionButton = ({ onClick, label, className }: ResetActionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shadow-xs focus-visible:outline-hidden group inline-flex items-center justify-center gap-2 rounded-lg border border-border/80 bg-background/90 px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] sm:text-sm",
        className,
      )}
    >
      <RotateCcw
        className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-rotate-45"
        aria-hidden="true"
      />
      <span>{label}</span>
    </button>
  );
};

/**
 * LCK 필터 선택 시 조건에 맞는 경기가 없거나 일정이 비어있을 때 노출하는 빈 상태 안내 UI 컴포넌트입니다.
 */
export const EmptyState = ({
  title = "아직 확정된 LCK 팀의 경기가 없습니다.",
  description = "선택하신 필터 조건에 해당하는 경기 일정이 없습니다. 대진이 확정되거나 필터를 변경하면 일정이 표시됩니다.",
  onReset,
  resetButtonText = "필터 초기화",
  showResetButton = true,
  className,
}: EmptyStateProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }
    // 기본 동작: 현재 경로로 이동하여 쿼리 파라미터 초기화
    router.push(pathname);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center backdrop-blur-sm sm:px-10 sm:py-16",
        className,
      )}
    >
      {/* 상태 아이콘 */}
      <EmptyIconBadge className="mb-4 sm:mb-5" />

      {/* 안내 문구 영역 */}
      <div className="max-w-md space-y-1.5 sm:space-y-2">
        <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg">{title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p>
      </div>

      {/* 필터 초기화 버튼 영역 */}
      {showResetButton ? (
        <div className="mt-6 sm:mt-7">
          <ResetActionButton onClick={handleReset} label={resetButtonText} />
        </div>
      ) : null}
    </div>
  );
};
