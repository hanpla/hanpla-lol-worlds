import Image from "next/image";
import { Clock, Trophy } from "lucide-react";
import { isLckTeam } from "@/constants/teams";
import { getTournamentStageLabelKo } from "@/constants/tournament";
import { formatToKstTime } from "@/lib/date/kst-date";
import { cn } from "@/lib/utils";
import type { Match, MatchStatus, Team } from "@/types/pandascore";

export type MatchCardProps = {
  match: Match;
  children?: React.ReactNode;
  className?: string;
};

type MatchStatusBadgeProps = {
  status: MatchStatus;
};

const MatchStatusBadge = ({ status }: MatchStatusBadgeProps) => {
  switch (status) {
    case "running":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-500 dark:text-rose-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
          </span>
          LIVE
        </span>
      );
    case "finished":
      return (
        <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          종료
        </span>
      );
    case "canceled":
      return (
        <span className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
          취소
        </span>
      );
    case "postponed":
      return (
        <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
          연기
        </span>
      );
    case "not_started":
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
          예정
        </span>
      );
  }
};

type TeamSlotProps = {
  team: Team | null | undefined;
  isWinner?: boolean;
  isLoser?: boolean;
  isReversed?: boolean;
};

const TeamSlot = ({
  team,
  isWinner = false,
  isLoser = false,
  isReversed = false,
}: TeamSlotProps) => {
  const isLck = isLckTeam(team);
  const teamName = team?.name ?? "TBD";
  const acronym = team?.acronym;
  const hasImage = Boolean(team?.image_url && team.image_url.trim().length > 0);

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2.5 transition-opacity sm:gap-3.5",
        isReversed && "flex-row-reverse text-right",
        isLoser && "opacity-60",
      )}
    >
      {/* 팀 로고 또는 TBD 플레이스홀더 */}
      <div className="shadow-2xs relative flex size-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/90 p-1 sm:size-12">
        {hasImage && team?.image_url ? (
          <Image
            src={team.image_url}
            alt={`${teamName} 팀 로고`}
            width={44}
            height={44}
            className="size-8 object-contain transition-transform duration-200 group-hover:scale-105 sm:size-9"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-muted/60 text-[11px] font-black tracking-wider text-muted-foreground sm:text-xs">
            {acronym ? acronym.slice(0, 3) : "TBD"}
          </div>
        )}
      </div>

      {/* 팀 정보 (이름, 약칭, LCK 배지, 승리 트로피) */}
      <div className={cn("flex min-w-0 flex-col gap-0.5 sm:gap-1", isReversed && "items-end")}>
        <div
          className={cn("flex max-w-full items-center gap-1.5", isReversed && "flex-row-reverse")}
        >
          <span
            className={cn(
              "truncate text-sm font-bold tracking-tight text-foreground sm:text-base",
              isWinner && "font-extrabold text-gold",
            )}
            title={teamName}
          >
            {teamName}
          </span>
          {isWinner ? (
            <Trophy className="size-3.5 shrink-0 fill-gold/20 text-gold" aria-label="승리" />
          ) : null}
        </div>

        {Boolean(acronym || isLck) ? (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground",
              isReversed && "flex-row-reverse",
            )}
          >
            {acronym ? <span className="font-medium tracking-wide">{acronym}</span> : null}
            {isLck ? (
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-black leading-none text-primary">
                LCK
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

type CenterScoreDisplayProps = {
  status: MatchStatus;
  score1?: number;
  score2?: number;
  isWinner1?: boolean;
  isWinner2?: boolean;
  numberOfGames: number;
};

const CenterScoreDisplay = ({
  status,
  score1,
  score2,
  isWinner1,
  isWinner2,
  numberOfGames,
}: CenterScoreDisplayProps) => {
  const isFinished = status === "finished";
  const isRunning = status === "running";
  const showScores = (isFinished || isRunning) && score1 !== undefined && score2 !== undefined;

  return (
    <div className="flex shrink-0 flex-col items-center justify-center px-2 sm:px-5">
      {showScores ? (
        <div className="flex items-center gap-1.5 text-xl font-black tabular-nums tracking-tight sm:gap-2 sm:text-2xl">
          <span className="sr-only">
            세트 스코어 {score1} 대 {score2}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "transition-colors",
              isWinner1 ? "text-gold" : isFinished ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {score1}
          </span>
          <span aria-hidden="true" className="text-base text-muted-foreground/60 sm:text-lg">
            :
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "transition-colors",
              isWinner2 ? "text-gold" : isFinished ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {score2}
          </span>
        </div>
      ) : (
        <div className="flex h-7 items-center justify-center rounded-full bg-muted/80 px-2.5 text-xs font-black tracking-wider text-muted-foreground sm:h-8 sm:px-3">
          VS
        </div>
      )}

      <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground sm:text-[11px]">
        Bo{numberOfGames}
      </span>
    </div>
  );
};

export const MatchCard = ({ match, children, className }: MatchCardProps) => {
  const opponent1 = match.opponents[0]?.opponent;
  const opponent2 = match.opponents[1]?.opponent;

  // 경기 시작 시간 계산 (KST 기준)
  const timeString = match.scheduled_at ?? match.begin_at;
  let formattedTime = "시간 미정";
  if (timeString) {
    try {
      formattedTime = formatToKstTime(timeString);
    } catch {
      formattedTime = "시간 미정";
    }
  }

  // 스테이지 및 라운드 라벨
  const stageLabel = getTournamentStageLabelKo(match.tournament.id);
  const roundTitle = match.name.includes(":") ? match.name.split(":")[0].trim() : "";

  // 스코어 및 승리팀 판별
  const isFinished = match.status === "finished";
  const isRunning = match.status === "running";

  const getTeamScore = (
    teamId: number | null | undefined,
    fallbackIndex: number,
  ): number | undefined => {
    if (teamId != null) {
      const matchResult = match.results.find((result) => result.team_id === teamId);
      if (matchResult?.score !== undefined) {
        return matchResult.score;
      }
    }
    return match.results[fallbackIndex]?.score;
  };

  const score1 = isFinished || isRunning ? getTeamScore(opponent1?.id, 0) : undefined;
  const score2 = isFinished || isRunning ? getTeamScore(opponent2?.id, 1) : undefined;

  const isWinner1 =
    isFinished &&
    ((match.winner_id != null && opponent1?.id != null && match.winner_id === opponent1.id) ||
      (score1 !== undefined && score2 !== undefined && score1 > score2));

  const isWinner2 =
    isFinished &&
    ((match.winner_id != null && opponent2?.id != null && match.winner_id === opponent2.id) ||
      (score1 !== undefined && score2 !== undefined && score2 > score1));

  const isLoser1 = isFinished && !isWinner1 && isWinner2;
  const isLoser2 = isFinished && !isWinner2 && isWinner1;

  return (
    <article
      id={`match-${match.id}`}
      className={cn(
        "shadow-xs group relative overflow-hidden rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/80 hover:shadow-md sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {/* 상단 메타 바 (경기 시작 시간, 스테이지/라운드 정보, 상태 배지) */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3 text-xs">
          <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Clock className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{formattedTime}</span>
            </div>

            <div className="h-3 w-px shrink-0 bg-border/80" aria-hidden="true" />

            <div className="flex items-center gap-1.5 truncate">
              <span className="shrink-0 font-semibold text-foreground/90">{stageLabel}</span>
              {roundTitle && roundTitle !== stageLabel ? (
                <>
                  <span className="shrink-0 text-muted-foreground/60">·</span>
                  <span className="truncate text-muted-foreground" title={roundTitle}>
                    {roundTitle}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 pl-2">
            <MatchStatusBadge status={match.status} />
          </div>
        </div>

        {/* 대진 영역 (팀 1 vs 팀 2) */}
        <div className="flex items-center justify-between py-1">
          <TeamSlot team={opponent1} isWinner={isWinner1} isLoser={isLoser1} isReversed={false} />
          <CenterScoreDisplay
            status={match.status}
            score1={score1}
            score2={score2}
            isWinner1={isWinner1}
            isWinner2={isWinner2}
            numberOfGames={match.number_of_games}
          />
          <TeamSlot team={opponent2} isWinner={isWinner2} isLoser={isLoser2} isReversed={true} />
        </div>

        {/* 하단 확장 슬롯 (세트별 아코디언 등) */}
        {children}
      </div>
    </article>
  );
};
