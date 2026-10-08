import { z } from "zod";

/**
 * PandaScore LoL e스포츠 팀(Team) Zod 스키마
 */
export const teamSchema = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  dark_mode_image_url: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  modified_at: z.string().nullable().optional(),
});

export type Team = z.infer<typeof teamSchema>;

/**
 * PandaScore LoL 대진 상대(Opponent) 래퍼 스키마
 */
export const opponentSchema = z.object({
  type: z.string().nullable().optional(),
  opponent: teamSchema,
});

export type Opponent = z.infer<typeof opponentSchema>;

/**
 * PandaScore LoL 토너먼트(Tournament: Play-In, Group Stage, Playoffs) 스키마
 */
export const tournamentSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  serie_id: z.number().nullable().optional(),
  begin_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  tier: z.string().nullable().optional(),
  has_bracket: z.boolean().nullable().optional(),
  live_supported: z.boolean().nullable().optional(),
});

export type Tournament = z.infer<typeof tournamentSchema>;

/**
 * 게임(세트) 승리 정보 스키마
 */
export const gameWinnerSchema = z.object({
  id: z.number().nullable().optional(),
  type: z.string().nullable().optional(),
});

export type GameWinner = z.infer<typeof gameWinnerSchema>;

/**
 * PandaScore LoL 개별 세트(Game) 스키마
 */
export const gameSchema = z.object({
  id: z.number(),
  position: z.number(),
  status: z.string(),
  length: z.number().nullable().optional(),
  finished: z.boolean().nullable().optional(),
  complete: z.boolean().nullable().optional(),
  forfeit: z.boolean().nullable().optional(),
  match_id: z.number().nullable().optional(),
  begin_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  winner: gameWinnerSchema.nullable().optional(),
  winner_type: z.string().nullable().optional(),
  detailed_stats: z.boolean().nullable().optional(),
});

export type Game = z.infer<typeof gameSchema>;

/**
 * 경기 팀별 스코어 결과(Result) 스키마
 */
export const matchResultSchema = z.object({
  team_id: z.number().nullable().optional(),
  score: z.number(),
});

export type MatchResult = z.infer<typeof matchResultSchema>;

/**
 * 경기 상태(Status) 스키마
 */
export const matchStatusSchema = z
  .enum(["not_started", "running", "finished", "canceled", "postponed"])
  .or(z.string());

export type MatchStatus = z.infer<typeof matchStatusSchema>;

/**
 * PandaScore LoL 단일 경기(Match) 스키마
 */
export const matchSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: matchStatusSchema,
  scheduled_at: z.string().nullable(),
  original_scheduled_at: z.string().nullable().optional(),
  begin_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  number_of_games: z.number(),
  match_type: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  rescheduled: z.boolean().nullable().optional(),
  draw: z.boolean().nullable().optional(),
  forfeit: z.boolean().nullable().optional(),
  tournament_id: z.number().nullable().optional(),
  serie_id: z.number().nullable().optional(),
  winner_id: z.number().nullable().optional(),
  winner_type: z.string().nullable().optional(),
  tournament: tournamentSchema,
  opponents: z.array(opponentSchema).default([]),
  games: z.array(gameSchema).default([]),
  results: z.array(matchResultSchema).default([]),
});

export type Match = z.infer<typeof matchSchema>;

/**
 * PandaScore 경기 목록 API 응답 스키마
 */
export const matchesResponseSchema = z.array(matchSchema);

export type MatchesResponse = z.infer<typeof matchesResponseSchema>;

/**
 * KST 일자별로 그룹화된 롤드컵 일정 도메인 모델
 */
export type GroupedSchedule = {
  dateKey: string; // 예: "2026-10-16"
  formattedDate: string; // 예: "10월 16일 (금)"
  matches: Match[]; // 해당 일자의 경기 목록
};
