import { Suspense } from "react";
import { ScheduleSkeleton } from "@/components/schedule/schedule-skeleton";
import { ScheduleView } from "@/components/schedule/schedule-view";
import { get2026WorldsMatches } from "@/lib/api/pandascore-api";

export const experimental_ppr = true;

/**
 * 2026 롤드컵 경기 데이터를 비동기 페치하여 ScheduleView로 스트리밍 전달하는 비동기 서버 컴포넌트입니다.
 */
const ScheduleStream = async () => {
  const matches = await get2026WorldsMatches();
  return <ScheduleView matches={matches} />;
};

/**
 * 2026 롤드컵 경기 일정 메인 페이지입니다.
 * Next.js 15의 PPR(Partial Prerendering)을 활용하여 정적 쉘을 즉시 제공하고,
 * Suspense 경계를 통해 일정 데이터를 부드럽게 스트리밍 결합합니다.
 */
const HomePage = () => {
  return (
    <div className="w-full">
      <Suspense fallback={<ScheduleSkeleton />}>
        <ScheduleStream />
      </Suspense>
    </div>
  );
};

export default HomePage;
