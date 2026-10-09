/**
 * 2026 League of Legends World Championship 토너먼트 메타데이터 상수
 */

/**
 * 2026 Worlds PandaScore Serie ID
 */
export const WORLDS_2026_SERIE_ID = 11014;

/**
 * 2026 Worlds 단계별 PandaScore 토너먼트 ID 매핑
 * - Play-In Stage: 22046
 * - Group Stage (Swiss Stage): 22047
 * - Playoffs (Knockout Stage): 22048
 */
export const WORLDS_TOURNAMENT_IDS = {
  PLAY_IN: 22046,
  GROUP_STAGE: 22047,
  PLAYOFFS: 22048,
} as const;

export type WorldsTournamentStageKey = keyof typeof WORLDS_TOURNAMENT_IDS;
export type WorldsTournamentId = (typeof WORLDS_TOURNAMENT_IDS)[WorldsTournamentStageKey];

/**
 * 2026 Worlds 토너먼트 ID 배열
 */
export const ALL_WORLDS_TOURNAMENT_IDS: readonly number[] = [
  WORLDS_TOURNAMENT_IDS.PLAY_IN,
  WORLDS_TOURNAMENT_IDS.GROUP_STAGE,
  WORLDS_TOURNAMENT_IDS.PLAYOFFS,
] as const;

/**
 * 토너먼트 ID별 공식 영문 스테이지명 매핑
 */
export const TOURNAMENT_STAGE_NAMES: Record<number, string> = {
  [WORLDS_TOURNAMENT_IDS.PLAY_IN]: "Play-In",
  [WORLDS_TOURNAMENT_IDS.GROUP_STAGE]: "Group Stage",
  [WORLDS_TOURNAMENT_IDS.PLAYOFFS]: "Playoffs",
} as const;

/**
 * 토너먼트 ID별 한국어 스테이지 라벨 매핑
 */
export const TOURNAMENT_STAGE_LABELS_KO: Record<number, string> = {
  [WORLDS_TOURNAMENT_IDS.PLAY_IN]: "플레이인",
  [WORLDS_TOURNAMENT_IDS.GROUP_STAGE]: "그룹 스테이지",
  [WORLDS_TOURNAMENT_IDS.PLAYOFFS]: "플레이오프",
} as const;

/**
 * 토너먼트 ID로 영문 스테이지명을 조회하는 헬퍼 함수
 */
export const getTournamentStageName = (tournamentId: number): string => {
  return TOURNAMENT_STAGE_NAMES[tournamentId] ?? "Worlds 2026";
};

/**
 * 토너먼트 ID로 한국어 스테이지 라벨을 조회하는 헬퍼 함수
 */
export const getTournamentStageLabelKo = (tournamentId: number): string => {
  return TOURNAMENT_STAGE_LABELS_KO[tournamentId] ?? "롤드컵 2026";
};
