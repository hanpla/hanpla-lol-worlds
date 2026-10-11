"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Clock, Swords, Trophy } from "lucide-react";
import { MatchCard } from "@/components/schedule/match-card";
import { cn } from "@/lib/utils";
import type { Game, Match, Opponent } from "@/types/pandascore";

export type MatchAccordionProps = {
  match: Match;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * 게임 진행 시간(초)을 "분:초" 및 "분 초" 형식으로 포맷팅합니다.
 *
 * @param seconds 소요 시간 (초)
 * @returns 포맷팅된 소요 시간 문자열 (예: "35분 42초" 또는 "-")
 */
export const formatGameDuration = (seconds?: number | null): string => {
  if (seconds == null || seconds <= 0) {
    return "-";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}분 ${remainingSeconds.toString().padStart(2, "0")}초`;
};

type GameStatusBadgeProps = {
  status: string;
};

const GameStatusBadge = ({ status }: GameStatusBadgeProps) => {
  switch (status) {
    case "running":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-500 dark:text-rose-400">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
          </span>
          LIVE
        </span>
      );
    case "finished":
      return (
        <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          종료
        </span>
      );
    case "not_started":
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          예정
        </span>
      );
  }
};

type GameSetRowProps = {
  game: Game;
  opponents: Opponent[];
};

const GameSetRow = ({ game, opponents }: GameSetRowProps) => {
  const winnerTeamId = game.winner?.id;
  const winningOpponent =
    winnerTeamId != null ? opponents.find((opp) => opp.opponent.id === winnerTeamId) : undefined;
  const winningTeam = winningOpponent?.opponent;

  const isFinished = game.status === "finished";
  const isRunning = game.status === "running";
  const hasDuration = Boolean(game.length && game.length > 0);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-2.5 transition-colors hover:bg-background/90 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-3">
      {/* 좌측: 세트 번호 및 상태 배지 */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-bold tracking-tight text-foreground">
          SET {game.position}
        </span>
        <GameStatusBadge status={game.status} />
      </div>

      {/* 중앙: 승리팀 또는 대진 상태 */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:justify-center">
        {isFinished && winningTeam ? (
          <div className="flex items-center gap-1.5 truncate">
            {winningTeam.image_url ? (
              <Image
                src={winningTeam.image_url}
                alt={`${winningTeam.name} 팀 로고`}
                width={20}
                height={20}
                className="size-5 shrink-0 object-contain"
              />
            ) : null}
            <span className="truncate text-xs font-bold text-gold sm:text-sm">
              {winningTeam.name}
            </span>
            <span className="flex items-center gap-0.5 rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-extrabold text-gold">
              <Trophy className="size-3" aria-hidden="true" />
              승리
            </span>
          </div>
        ) : isRunning ? (
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">
            실시간 경기 진행 중
          </span>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Swords className="size-3.5 text-muted-foreground/70" aria-hidden="true" />
            <span>대진 진행 예정</span>
          </div>
        )}
      </div>

      {/* 우측: 경기 소요 시간 */}
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground sm:w-28">
        <Clock className="size-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
        <span className="font-medium tabular-nums">
          {hasDuration ? formatGameDuration(game.length) : isRunning ? "진행 중" : "-"}
        </span>
      </div>
    </div>
  );
};

type EmptyGamesNoticeProps = {
  numberOfGames: number;
};

const EmptyGamesNotice = ({ numberOfGames }: EmptyGamesNoticeProps) => {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-5 text-center text-xs text-muted-foreground">
      <p>등록된 세트별 상세 경기 데이터가 없습니다.</p>
      <p className="mt-1 text-[11px] text-muted-foreground/75">
        (Bo{numberOfGames} 방식으로 진행 예정)
      </p>
    </div>
  );
};

export const MatchAccordion = ({ match, defaultOpen = false, className }: MatchAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const sortedGames = [...match.games].sort((a, b) => a.position - b.position);
  const totalGamesCount = match.games.length;

  return (
    <MatchCard match={match} className={className} onClick={handleToggle} isInteractive={true}>
      <div className="flex flex-col gap-2 pt-1">
        {/* 아코디언 토글 버튼 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          aria-expanded={isOpen}
          aria-controls={`match-${match.id}-games-content`}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground",
            isOpen && "border-border/70 bg-muted/50 text-foreground",
          )}
        >
          <span className="flex items-center gap-1.5">
            <span>세트별 상세 결과</span>
            <span className="text-[11px] font-medium text-muted-foreground/80">
              {totalGamesCount > 0 ? `(${totalGamesCount}세트)` : `(Bo${match.number_of_games})`}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180 text-foreground",
            )}
            aria-hidden="true"
          />
        </button>

        {/* 펼쳐지는 세트 상세 목록 패널 */}
        <div
          id={`match-${match.id}-games-content`}
          role="region"
          aria-label={`${match.name} 세트별 상세 결과`}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-1">
              {sortedGames.length > 0 ? (
                sortedGames.map((game) => (
                  <GameSetRow key={game.id} game={game} opponents={match.opponents} />
                ))
              ) : (
                <EmptyGamesNotice numberOfGames={match.number_of_games} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MatchCard>
  );
};
