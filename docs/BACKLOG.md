# 📋 백로그 티켓 목록 (BACKLOG.md)

이 문서는 2026 롤드컵 일정 서비스의 기능 구현을 위한 페이즈별 상세 작업 티켓 모음입니다.  
본 프로젝트는 **백로그 풀링(Backlog Pulling)** 방식으로 진행되며, [RULE.md](./RULE.md)의 프론트엔드 개발 컨벤션(`kebab-case` 파일명, `const` 화살표 함수, Named Export, `any` 금지, `type` 별칭 우선, 4단계 검증 파이프라인, Atomic Commits)을 100% 준수합니다.

---

## 📌 상태 범례 및 진행 규칙

- `[ ] TODO`: 작업 대기 중 (선행 의존성이 완료되면 풀링 가능)
- `[-] IN_PROGRESS`: 현재 작업 진행 중 (작업자가 풀링함)
- `[x] DONE`: 구현 완료 및 Acceptance Criteria 검증 통과

> **풀링 및 커밋 규칙**:
>
> 1. 이전 티켓의 선행 조건이 충족되었는지 확인 후 한 번에 하나의 티켓만 `[-] IN_PROGRESS`로 변경합니다.
> 2. 코드 작성 시 `function` 키워드 대신 `const` 화살표 함수, Named Export, `kebab-case` 파일명을 엄격히 사용합니다.
> 3. 해당 티켓의 Acceptance Criteria를 모두 검증한 후 `[x] DONE`으로 변경합니다.
> 4. **Git 커밋은 임의로 자동 수행하지 않으며, 반드시 사용자가 명시적으로 커밋을 요청했을 때만 진행합니다.** 커밋 시 `git add .` 일괄 커밋을 지양하고 작업 단위별로 분할 커밋(Atomic Commits)합니다.

---

## 🏗️ Phase 0: 기반 환경 및 프로젝트 설정 (Foundation & Setup)

### [x] TICKET-001: Next.js 15 프로젝트 초기화 및 도구 설치

- **우선순위**: P0
- **선행 의존성**: 없음
- **목표**: Next.js 15 App Router 기반 프로젝트 뼈대 생성 및 TypeScript, Tailwind CSS, Zod, server-only 등 필수 의존성 설치
- **상세 작업**:
  1. `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` 생성
  2. 최신 `next@15`, `react@19`, `typescript`, `tailwindcss`, `clsx`, `tailwind-merge` 설치
  3. `zod`, `server-only`, `lucide-react` 패키지 설치
  4. Tailwind 유틸리티 함수 `src/lib/utils.ts` 생성 (`cn` 헬퍼 - `const` 화살표 함수 및 Named Export)
- **Acceptance Criteria**:
  - [x] `npm run dev` 실행 시 로컬 개발 서버가 정상 구동된다.
  - [x] `npx tsc --noEmit` 실행 시 타입 에러 없이 통과한다.
  - [x] 모든 파일명이 `kebab-case`를 준수한다.

---

### [x] TICKET-002: 다크 모드(next-themes) 셋업 및 전역 테마 스타일 정의

- **우선순위**: P0
- **선행 의존성**: TICKET-001
- **목표**: 기본 다크 모드 지원을 위한 ThemeProvider 및 e스포츠 LoL 전용 컬러 테마 구성
- **상세 작업**:
  1. `next-themes` 패키지 설치
  2. `src/components/common/theme-provider.tsx` 생성 (`'use client'`, `const ThemeProvider = ...`, Named Export)
  3. `src/app/globals.css`에 다크/라이트 모드 CSS 변수 및 배경색(`bg-background`), 텍스트색(`text-foreground`), 골드/시안 액센트 컬러 정의
  4. 기본 테마를 `dark`로 설정하여 초기 로딩 시 화면 깜빡임(FOUC) 없이 다크 테마 적용
- **Acceptance Criteria**:
  - [x] 첫 화면 접속 시 다크 모드가 기본으로 렌더링된다.
  - [x] Tailwind `dark:` 변형 클래스가 정상 동작한다.

---

### [x] TICKET-003: 환경변수 설정 및 보안 가이드 구축

- **우선순위**: P0
- **선행 의존성**: TICKET-001
- **목표**: PandaScore API 토큰을 안전하게 관리하기 위한 환경변수 파일 및 Git 무시 규칙 정비
- **상세 작업**:
  1. `.env.local`에 `PANDASCORE_API_TOKEN` 주입
  2. `.env.example` 템플릿 생성
  3. `.gitignore`에 `.env*.local` 및 빌드 아티팩트 등록 확인
- **Acceptance Criteria**:
  - [x] `.env.local`의 환경변수가 Next.js 서버 런타임에서 로드된다.
  - [x] API 토큰에 `NEXT_PUBLIC_`이 붙지 않아 클라이언트 번들에 노출되지 않는다.

---

### [x] TICKET-004: Pretendard 폰트 최적화(next/font/local) 적용 및 타이포그래피 시스템 구축

- **우선순위**: P1
- **선행 의존성**: TICKET-001, TICKET-002
- **목표**: Next.js 15의 `next/font/local`을 활용하여 Pretendard Variable 웹폰트를 자체 호스팅 및 최적화(Zero CLS, WOFF2 프리로드, `display: 'swap'`)하고 전역 타이포그래피 시스템으로 통합
- **상세 작업**:
  1. `public/fonts/` 또는 에셋 디렉터리에 경량화된 `PretendardVariable.woff2` 폰트 파일 배치
  2. `src/lib/fonts.ts` (또는 `src/app/layout.tsx`)에 `next/font/local` 기반 `pretendard` 폰트 인스턴스 정의 (`variable: '--font-pretendard'`, `display: 'swap'`)
  3. `tailwind.config.ts`의 `theme.extend.fontFamily`에 `sans: ['var(--font-pretendard)', 'sans-serif']` 설정
  4. `src/app/layout.tsx`의 `<html>` 또는 `<body>` 태그에 폰트 변수 클래스(`pretendard.variable font-sans`) 바인딩
- **Acceptance Criteria**:
  - [x] `next/font/local`을 통해 Pretendard 폰트가 자체 호스팅되어 빌드 타임에 최적화된다.
  - [x] 폰트 로딩 시 레이아웃 이동(CLS: Cumulative Layout Shift)이 발생하지 않고 깜빡임이 최소화된다.
  - [x] Tailwind CSS의 기본 `font-sans` 및 전역 텍스트에 Pretendard가 올바르게 적용된다.
  - [x] `npx tsc --noEmit` 및 `npm run build` 검증을 통과한다.

---

## 📊 Phase 1: 데이터 모델 및 PandaScore API 계층 (Data & API Layer)

### [x] TICKET-101: PandaScore API Zod 스키마 및 TypeScript 타입 정의

- **우선순위**: P0
- **선행 의존성**: TICKET-001
- **목표**: Zod 런타임 스키마 및 `type` 별칭 기반 도메인 타입 정의 (`any` 사용 엄격 금지)
- **상세 작업**:
  1. `src/types/pandascore.ts` 생성
  2. `matchSchema`, `tournamentSchema`, `gameSchema`, `opponentSchema` Zod 스키마 선언
  3. `z.infer`를 활용하여 `Match`, `Tournament`, `Game`, `Opponent`, `Team` 타입 도출 (`type` 별칭 사용)
  4. 일자별 그룹화된 데이터 모델 `GroupedSchedule` 타입 선언
- **Acceptance Criteria**:
  - [x] opponents가 비어있는 케이스(`[]`) 및 TBD 케이스를 안전하게 수용한다.
  - [x] `any` 타입이 전혀 사용되지 않고 엄격한 타입 안정성을 제공한다.

---

### [x] TICKET-102: LCK 팀 식별 상수 및 토너먼트 메타데이터 정의

- **우선순위**: P1
- **선행 의존성**: TICKET-101
- **목표**: LCK 소속 팀 필터링을 위한 식별자 목록 및 스테이지 정보 상수화
- **상세 작업**:
  1. `src/constants/teams.ts` 생성: LCK 팀 약칭(`T1`, `GEN`, `HLE`, `DK`, `KT`, `FOX`, `DRX`, `KDF`, `BRO`, `NS`) 상수 정의
  2. `src/constants/tournament.ts` 생성: 2026 Worlds 토너먼트 ID(Play-In `22046`, Group Stage `22047`, Playoffs `22048`) 매핑 상수 정의
  3. 특정 경기(`Match`)가 LCK 팀의 경기인지 판별하는 헬퍼 함수 `isLckMatch = (match: Match): boolean` 구현 (`const` 화살표 함수 & Named Export)
- **Acceptance Criteria**:
  - [x] `isLckMatch` 함수가 양 팀 중 하나라도 LCK 팀 식별자를 포함하면 `true`를 반환한다.
  - [x] opponents가 비어있는 TBD 경기는 `false`를 반환한다.

---

### [x] TICKET-103: 한국 표준시(KST, UTC+9) 날짜/시간 변환 유틸리티 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-101
- **목표**: SSR과 클라이언트 간 타임존 차이로 인한 Hydration Mismatch를 원천 차단하는 KST 전용 포맷터 구축
- **상세 작업**:
  1. `src/lib/date/kst-date.ts` 생성
  2. `formatToKstDate = (isoString: string): string => ...` 구현 (`"10월 16일 (금)"` 형식)
  3. `formatToKstTime = (isoString: string): string => ...` 구현 (`"18:00"` 형식)
  4. `getDateKeyKst = (isoString: string): string => ...` 구현 (`"2026-10-16"` 형식)
  5. `getMonthKst = (isoString: string): number => ...` 구현 (`10` 또는 `11`)
- **Acceptance Criteria**:
  - [x] UTC 타임스탬프(`2026-10-15T18:00:00Z`)를 넘겼을 때 한국 시간 기준(`2026-10-16T03:00:00+09:00`)으로 정확하게 계산된다.
  - [x] 로케일 독립적으로 동작하여 수화 에러가 발생하지 않는다.

---

### [x] TICKET-104: PandaScore API 페처 및 5분 Next.js 캐싱 모듈 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-003, TICKET-101, TICKET-103
- **목표**: `server-only` 격리, Zod 런타임 검증, 5분(300초) Next.js Data Cache 적용
- **상세 작업**:
  1. `src/lib/api/pandascore-api.ts` 생성 및 파일 최상단에 `import "server-only";` 선언
  2. `get2026WorldsMatches = async (): Promise<Match[]> => ...` 구현
     - `fetch('https://api.pandascore.co/lol/matches?filter[serie_id]=11014&sort=scheduled_at', { next: { revalidate: 300, tags: ['worlds-matches-2026'] } })`
  3. Zod 스키마 파싱으로 응답 무결성 검증
  4. 가져온 매치 목록을 KST 일자별로 그룹화하는 `groupMatchesByKstDate = (matches: Match[]): GroupedSchedule[] => ...` 구현
- **Acceptance Criteria**:
  - [x] 실제 PandaScore API로부터 46개 경기 데이터를 성공적으로 가져온다.
  - [x] 5분간 외부 API 재호출이 발생하지 않고 캐시가 유지된다.
  - [x] KST 기준 일자별로 순서대로 정렬 및 그룹화된다.

---

## 🏛️ Phase 2: PPR 쉘 및 기본 레이아웃 (PPR Shell & Layout)

### [x] TICKET-201: Next.js 15 PPR 및 remotePatterns 설정, Root Shell 구성

- **우선순위**: P0
- **선행 의존성**: TICKET-002
- **목표**: PPR `incremental` 모드 및 이미지 최적화 도메인 활성화, 기본 쉘 레이아웃 완성
- **상세 작업**:
  1. `next.config.ts`에 `experimental: { ppr: 'incremental' }` 및 `images.remotePatterns`(`cdn-api.pandascore.co`) 설정
  2. `src/app/layout.tsx`에 `ThemeProvider`, 기본 메타데이터(OG 태그, Title, Description), 반응형 컨테이너 세팅
  3. 메인 콘텐츠 래퍼의 최대 너비(`max-w-5xl mx-auto`) 및 기본 패딩 정의
- **Acceptance Criteria**:
  - [x] `next build` 시 PPR incremental 기능이 정상 활성화된다.
  - [x] PandaScore CDN 이미지를 `next/image`로 불러올 때 도메인 에러가 발생하지 않는다.

---

### [x] TICKET-202: 브랜드 헤더 및 테마 토글(Dark/Light) 컴포넌트 구현

- **우선순위**: P1
- **선행 의존성**: TICKET-201
- **목표**: 2026 롤드컵 타이틀이 포함된 상단 고정 헤더와 원클릭 다크모드 스위처 제작
- **상세 작업**:
  1. `src/components/common/header.tsx` 구현 (`const` 화살표 함수, Named Export)
  2. `src/components/common/theme-toggle.tsx` 구현 (`'use client'`, Lucide `Sun`/`Moon` 아이콘, Named Export)
  3. 헤더 상단 고정(`sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b`) 스타일링
- **Acceptance Criteria**:
  - [x] 토글 버튼 클릭 시 부드럽게 다크/라이트 테마가 전환된다.
  - [x] 인라인 SVG 없이 `lucide-react` 아이콘으로 구현된다.

---

### [ ] TICKET-203: 상하단 이동 플로팅 스크롤 버튼 구현

- **우선순위**: P1
- **선행 의존성**: TICKET-201
- **목표**: 화면 우측 하단 플로팅 액션 버튼(FAB)을 통한 스무스 상하단 이동 제공
- **상세 작업**:
  1. `src/components/common/scroll-floating-buttons.tsx` 구현 (`'use client'`, Named Export)
  2. Top 버튼 클릭 시 최상단으로 `window.scrollTo({ top: 0, behavior: 'smooth' })`
  3. Bottom 버튼 클릭 시 최하단으로 `window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })`
  4. 화면 우측 하단(`fixed bottom-6 right-6 z-50`) 배치 및 블러 백그라운드 적용
- **Acceptance Criteria**:
  - [ ] 화면 우측 하단에 플로팅되며 클릭 시 매끄러운 스무스 스크롤로 상단/하단 끝까지 이동한다.

---

### [ ] TICKET-204: Suspense fallback용 타임라인 스켈레톤 UI 구현

- **우선순위**: P1
- **선행 의존성**: TICKET-201
- **목표**: PPR Static Shell이 렌더링되는 동안 일정 영역을 채워줄 스켈레톤 UI 제작
- **상세 작업**:
  1. `src/components/schedule/schedule-skeleton.tsx` 구현 (`const` 화살표 함수, Named Export)
  2. 일자 헤더 스켈레톤 바 및 대진 카드 형태의 펄스 애니메이션 박스 4~6개 배치
  3. `bg-muted animate-pulse` 스타일 적용
- **Acceptance Criteria**:
  - [ ] 데이터 스트리밍 중 레이아웃 시프트(CLS) 없이 자연스러운 플레이스홀더를 제공한다.

---

## ⚔️ Phase 3: 경기 일정 카드 및 타임라인 컴포넌트 (Schedule Components)

### [ ] TICKET-301: 대진 카드 기본 컴포넌트 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-101, TICKET-103
- **목표**: 매치 기본 정보(시작 시간, 스테이지명, 양 팀 로고/이름/스코어, 상태) 렌더링
- **상세 작업**:
  1. `src/components/schedule/match-card.tsx` 구현 (`const` 화살표 함수, Named Export)
  2. `next/image`를 사용하여 팀 로고 렌더링
  3. 팀 미확정 시 `TBD` 텍스트 표시
  4. 상태별 배지(예정, 진행 중 라이브 펄스, 종료) 표시
  5. 고유 DOM ID 부여: `id={`match-${match.id}`}`
- **Acceptance Criteria**:
  - [ ] TBD 상태의 매치와 실제 팀 매치가 모두 유려하게 렌더링된다.
  - [ ] `<img>` 대신 `next/image`의 `Image` 컴포넌트가 사용된다.

---

### [ ] TICKET-302: 세트별 승패 아코디언 컴포넌트 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-301
- **목표**: 대진 카드 클릭 시 하단으로 펼쳐져 세트별 상세 결과를 표시하는 아코디언 구현
- **상세 작업**:
  1. `src/components/schedule/match-accordion.tsx` 구현 (`'use client'`, Named Export)
  2. 카드 클릭 시 펼침/접힘 토글 (다중 펼침 지원)
  3. `games` 배열 순회: 세트 번호, 승리팀, 소요 시간(분:초 변환), 게임 상태 표시
  4. Lucide `ChevronDown` 회전 트랜지션 애니메이션 적용
- **Acceptance Criteria**:
  - [ ] 카드를 클릭하면 부드럽게 세트 목록이 열리고 닫힌다.
  - [ ] 여러 카드를 동시에 열어둘 수 있다.

---

### [ ] TICKET-303: 일자별 섹션 헤더 및 타임라인 렌더러 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-104, TICKET-301, TICKET-302
- **목표**: KST 날짜별로 그룹화된 섹션 헤더와 매치 카드들을 타임라인 리스트로 렌더링
- **상세 작업**:
  1. `src/components/schedule/timeline-section.tsx`: 일자 헤더(예: `10월 16일 (금)`) 및 하위 매치 리스트 렌더링
  2. `src/components/schedule/schedule-timeline.tsx`: 필터링된 전체 일정을 받아 순서대로 섹션 렌더링
- **Acceptance Criteria**:
  - [ ] 날짜별로 그룹이 나뉘고 헤더가 명확하게 구분된다.
  - [ ] 시간순으로 매치 카드들이 정렬된다.

---

### [ ] TICKET-304: 경기 없음 안내 빈 상태(Empty State) 컴포넌트 구현

- **우선순위**: P1
- **선행 의존성**: TICKET-303
- **목표**: LCK 필터 선택 시 조건에 맞는 경기가 없을 때 노출할 안내 UI 제작
- **상세 작업**:
  1. `src/components/schedule/empty-state.tsx` 구현 (Named Export)
  2. Lucide 아이콘과 함께 "아직 확정된 LCK 팀의 경기가 없습니다." 친절한 안내 메시지 표시
  3. 필터 초기화 버튼 제공
- **Acceptance Criteria**:
  - [ ] 필터링 결과가 0개일 때 직관적인 아이콘과 안내 문구가 표시된다.

---

## 🧭 Phase 4: 네비게이션 탭, 필터링 및 포커스 인터랙션 (Navigation & Interactions)

### [ ] TICKET-401: 월별 탭(10월/11월) 및 LCK 필터 토글 컴포넌트 구현

- **우선순위**: P0
- **선행 의존성**: TICKET-102, TICKET-201
- **목표**: 10월/11월 전환 탭과 LCK 팀 경기 전용 필터 토글 버튼 UI 구축
- **상세 작업**:
  1. `src/components/filter/month-tabs.tsx`: 10월, 11월 탭 버튼 (`const` 화살표 함수, Named Export)
  2. `src/components/filter/lck-filter-toggle.tsx`: LCK 전용 필터 버튼 (`const` 화살표 함수, Named Export)
  3. `cn()` 유틸리티를 활용한 조건부 활성화 스타일 적용
- **Acceptance Criteria**:
  - [ ] 탭 및 필터 버튼 클릭 시 활성 스타일이 즉시 전환된다.
  - [ ] 모바일 환경 터치 타깃 크기(최소 44px)를 만족한다.

---

### [ ] TICKET-402: URL Query Params 동기화 및 일정 필터링 파이프라인

- **우선순위**: P0
- **선행 의존성**: TICKET-401, TICKET-303
- **목표**: 선택된 탭과 필터를 URL 파라미터(`?month=10&lck=true`)에 반영하고 일정을 실시간 필터링
- **상세 작업**:
  1. `useSearchParams`, `useRouter`, `usePathname`을 활용한 필터 파라미터 업데이트 로직 작성
  2. URL 파라미터 변경 시 해당 조건의 경기만 타임라인에 필터링 전달
  3. 첫 진입 시 URL에 `month`가 없으면 가장 가까운 다음 경기가 속한 월을 자동 기본값 설정
- **Acceptance Criteria**:
  - [ ] 탭 전환 시 주소창의 쿼리 스트링이 동기화된다.
  - [ ] 링크를 복사하여 열었을 때 동일한 탭과 필터가 유지된다.

---

### [ ] TICKET-403: 오늘/다음 경기 자동 스무스 스크롤 포커스 및 펄스 하이라이트

- **우선순위**: P0
- **선행 의존성**: TICKET-301, TICKET-402
- **목표**: 첫 진입 시 오늘 진행 중이거나 가장 가까운 다음 경기로 스무스 스크롤 이동 및 시각적 강조
- **상세 작업**:
  1. `src/components/schedule/auto-scroll-focus.tsx` 구현 (`'use client'`, Named Export)
  2. 타깃 매치 ID 계산 (`running` 우선 -> 가장 빠른 미래 `not_started` -> 마지막 결승 매치)
  3. 해당 카드 엘리먼트로 `scrollIntoView({ behavior: 'smooth', block: 'center' })` 실행
  4. 1.5초간 `ring-2 ring-primary ring-offset-2 animate-pulse` 클래스 일시 부여
- **Acceptance Criteria**:
  - [ ] 사이트 첫 진입 시 즉시 타깃 경기로 부드럽게 화면이 이동한다.
  - [ ] 포커스된 카드에 하이라이트 애니메이션이 점멸한다.

---

## 🚀 Phase 5: 4단계 품질 검증 및 프로덕션 빌드 (Verification Pipeline & QA)

### [ ] TICKET-501: 4단계 검증 파이프라인 실행 및 프로덕션 빌드 통과

- **우선순위**: P0
- **선행 의존성**: Phase 0~4 모든 티켓
- **목표**: [RULE.md](./RULE.md)의 4단계 검증 파이프라인 전수 통과 확인
- **상세 작업**:
  1. 1단계: 코드 포맷팅 확인 (`npm run format` or Prettier)
  2. 2단계: 린트 정적 분석 통과 (`npm run lint`)
  3. 3단계: TypeScript 정적 타입 검사 통과 (`npx tsc --noEmit`)
  4. 4단계: 프로덕션 빌드 성공 (`npm run build`) - PPR static/dynamic 분할 로그 확인
- **Acceptance Criteria**:
  - [ ] 4단계 검증에서 에러 및 경고가 0개이다.
  - [ ] Next.js 15 PPR 번들이 성공적으로 빌드된다.

---

### [ ] TICKET-502: 5분 Data Cache 및 외부 API 부하 방어 검증

- **우선순위**: P0
- **선행 의존성**: TICKET-501
- **목표**: PandaScore API 호출 빈도가 최대 5분에 1회로 엄격하게 제어되는지 검증
- **상세 작업**:
  1. 페이지 연속 새로고침 시 네트워크 요청 로그 모니터링
  2. 외부 PandaScore API 호출이 300초 동안 1회만 발생함을 확인
- **Acceptance Criteria**:
  - [ ] 연속 요청 시에도 Data Cache가 유지되어 외부 API 호출이 중복 발생하지 않는다.

---

### [ ] TICKET-503: 크로스 브라우징, 모바일 반응형 및 웹 접근성 점검

- **우선순위**: P1
- **선행 의존성**: TICKET-501
- **목표**: 모바일 뷰포트 및 데스크톱 브라우저 환경에서 완성도 점검
- **상세 작업**:
  1. 모바일 화면 폭(320px ~ 428px)에서 카드 레이아웃, 아코디언, 플로팅 버튼 터치 영역 점검
  2. 다크 모드와 라이트 모드 간 명암비 및 가독성 확인
  3. 키보드 네비게이션 및 aria 속성 점검
- **Acceptance Criteria**:
  - [ ] 모바일 환경에서 레이아웃 깨짐 현상이 일절 없다.
  - [ ] 상하단 플로팅 스크롤 버튼이 모바일 내비게이션과 간섭되지 않는다.
