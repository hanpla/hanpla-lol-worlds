import { Match, Team } from "@/types/pandascore";

/**
 * LCK 공식 10개 팀 약칭 목록 (SCREAMING_SNAKE_CASE)
 */
export const LCK_TEAM_IDENTIFIERS = [
  "T1",
  "GEN",
  "HLE",
  "DK",
  "KT",
  "FOX",
  "DRX",
  "KDF",
  "BRO",
  "NS",
] as const;

export type LckTeamIdentifier = (typeof LCK_TEAM_IDENTIFIERS)[number];

/**
 * LCK 팀 식별자 alias
 */
export const LCK_TEAM_ACRONYMS = LCK_TEAM_IDENTIFIERS;

/**
 * LCK 팀 메타데이터 인터페이스
 */
export type LckTeamMeta = {
  acronym: LckTeamIdentifier;
  name: string;
  koreanName: string;
  slugs: readonly string[];
};

/**
 * LCK 팀 상세 메타데이터 매핑
 */
export const LCK_TEAM_METADATA: Record<LckTeamIdentifier, LckTeamMeta> = {
  T1: {
    acronym: "T1",
    name: "T1",
    koreanName: "T1",
    slugs: ["t1", "sk-telecom-t1", "t1-lol"],
  },
  GEN: {
    acronym: "GEN",
    name: "Gen.G",
    koreanName: "젠지",
    slugs: ["gen-g", "geng", "gen"],
  },
  HLE: {
    acronym: "HLE",
    name: "Hanwha Life Esports",
    koreanName: "한화생명e스포츠",
    slugs: ["hanwha-life-esports", "hle"],
  },
  DK: {
    acronym: "DK",
    name: "Dplus KIA",
    koreanName: "디플러스 기아",
    slugs: ["dplus-kia", "dk", "damwon-gaming", "dwg-kia"],
  },
  KT: {
    acronym: "KT",
    name: "KT Rolster",
    koreanName: "kt 롤스터",
    slugs: ["kt-rolster", "kt"],
  },
  FOX: {
    acronym: "FOX",
    name: "BNK FEARX",
    koreanName: "BNK 피어엑스",
    slugs: ["fearx", "bnk-fearx", "fox", "liiv-sandbox"],
  },
  DRX: {
    acronym: "DRX",
    name: "DRX",
    koreanName: "DRX",
    slugs: ["drx", "kingzone-dragonx"],
  },
  KDF: {
    acronym: "KDF",
    name: "Kwangdong Freecs",
    koreanName: "광동 프릭스",
    slugs: ["kwangdong-freecs", "kdf", "afreeca-freecs"],
  },
  BRO: {
    acronym: "BRO",
    name: "OK BRION",
    koreanName: "OK저축은행 브리온",
    slugs: ["ok-brion", "brion", "bro", "fredit-brion"],
  },
  NS: {
    acronym: "NS",
    name: "Nongshim RedForce",
    koreanName: "농심 레드포스",
    slugs: ["nongshim-redforce", "ns", "team-dynamics"],
  },
} as const;

/**
 * 단일 팀(Team)이 LCK 소속 팀인지 판별하는 헬퍼 함수
 */
export const isLckTeam = (team: Team | null | undefined): boolean => {
  if (!team) {
    return false;
  }

  // 1. 약칭(acronym) 대소문자 무관 매칭
  const acronymUpper = team.acronym?.trim().toUpperCase();
  if (acronymUpper && LCK_TEAM_IDENTIFIERS.includes(acronymUpper as LckTeamIdentifier)) {
    return true;
  }

  // 2. 슬러그(slug) 매칭
  const slugLower = team.slug?.trim().toLowerCase();
  if (slugLower) {
    const isAcronymSlugMatch = LCK_TEAM_IDENTIFIERS.some((id) => id.toLowerCase() === slugLower);
    if (isAcronymSlugMatch) {
      return true;
    }

    const isKnownSlugMatch = Object.values(LCK_TEAM_METADATA).some((meta) =>
      meta.slugs.includes(slugLower),
    );
    if (isKnownSlugMatch) {
      return true;
    }
  }

  // 3. 팀 이름(name) 매칭
  const nameUpper = team.name?.trim().toUpperCase();
  if (nameUpper && LCK_TEAM_IDENTIFIERS.includes(nameUpper as LckTeamIdentifier)) {
    return true;
  }

  return false;
};

/**
 * 특정 경기(Match)가 LCK 팀의 경기인지 판별하는 헬퍼 함수
 *
 * 규칙:
 * - opponents가 비어있는 TBD 경기는 false를 반환
 * - 양 팀 중 하나라도 LCK 팀 식별자를 포함하면 true를 반환
 */
export const isLckMatch = (match: Match): boolean => {
  if (!match.opponents || match.opponents.length === 0) {
    return false;
  }

  return match.opponents.some((opponentWrapper) => isLckTeam(opponentWrapper.opponent));
};
