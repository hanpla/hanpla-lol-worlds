import { Suspense } from "react";
import { ScheduleSkeleton } from "@/components/schedule/schedule-skeleton";
import { ScheduleView } from "@/components/schedule/schedule-view";
import { get2026WorldsMatches } from "@/lib/api/pandascore-api";

/**
 * 2026 롤드컵 경기 데이터를 비동기 페치하여 ScheduleView로 스트리밍 전달하는 비동기 서버 컴포넌트입니다.
 * 가져온 경기 데이터는 SWR의 fallbackData(initialMatches)로 주입되어 클라이언트에서 초기 로딩 없이 즉시 렌더링됩니다.
 */
const ScheduleStream = async () => {
  const matches = await get2026WorldsMatches();
  return <ScheduleView initialMatches={matches} />;
};

/**
 * 2026 롤드컵 경기 일정 메인 페이지입니다.
 * Next.js 16의 정적 쉘을 즉시 제공하고, Suspense 경계를 통해 초기 일정 데이터를 스트리밍 결합하며,
 * 클라이언트에서는 SWR(Stale-While-Revalidate)을 통해 백그라운드에서 실시간 변경 사항을 UI에 동기화합니다.
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
