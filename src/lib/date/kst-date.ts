const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const KST_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

type KstDateParts = {
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * ISO-8601 날짜 문자열을 한국 표준시(KST, UTC+9) 기준 연/월/일/시/분/초/요일로 분해합니다.
 * 순수 UTC 오프셋 연산을 사용하여 브라우저와 서버의 로케일/타임존 차이로 인한 Hydration Mismatch를 원천 차단합니다.
 */
const getKstDateParts = (isoString: string): KstDateParts => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date string: ${isoString}`);
  }

  const kstTime = new Date(date.getTime() + KST_OFFSET_MS);

  return {
    year: kstTime.getUTCFullYear(),
    month: kstTime.getUTCMonth() + 1,
    day: kstTime.getUTCDate(),
    dayOfWeek: kstTime.getUTCDay(),
    hours: kstTime.getUTCHours(),
    minutes: kstTime.getUTCMinutes(),
    seconds: kstTime.getUTCSeconds(),
  };
};

/**
 * ISO-8601 날짜 문자열을 KST 기준 "M월 D일 (요일)" 형식으로 변환합니다.
 * 예: "2026-10-15T18:00:00Z" -> "10월 16일 (금)"
 */
export const formatToKstDate = (isoString: string): string => {
  const { month, day, dayOfWeek } = getKstDateParts(isoString);
  const dayName = KST_DAY_NAMES[dayOfWeek];

  return `${month}월 ${day}일 (${dayName})`;
};

/**
 * ISO-8601 날짜 문자열을 KST 기준 "HH:mm" (24시간 형식)으로 변환합니다.
 * 예: "2026-10-15T18:00:00Z" -> "03:00"
 */
export const formatToKstTime = (isoString: string): string => {
  const { hours, minutes } = getKstDateParts(isoString);
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

/**
 * 일자별 그룹화 및 키 식별을 위한 KST 기준 "YYYY-MM-DD" 문자열을 반환합니다.
 * 예: "2026-10-15T18:00:00Z" -> "2026-10-16"
 */
export const getDateKeyKst = (isoString: string): string => {
  const { year, month, day } = getKstDateParts(isoString);
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
};

/**
 * ISO-8601 날짜 문자열의 KST 기준 월(Month: 1~12)을 반환합니다.
 * 월별 네비게이션 탭 필터링 등에 활용됩니다.
 * 예: "2026-10-15T18:00:00Z" -> 10
 */
export const getMonthKst = (isoString: string): number => {
  const { month } = getKstDateParts(isoString);
  return month;
};
