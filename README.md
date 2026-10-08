# 🏆 2026 롤드컵(Worlds) 경기 일정 확인 서비스

2026 League of Legends World Championship의 전체 경기 일정을 실시간에 가깝게 빠르고 쾌적하게 확인할 수 있는 웹 애플리케이션입니다.  
최신 **Next.js 15 App Router**의 **PPR(Partial Prerendering)**과 **5분 ISR 데이터 캐시**를 기반으로 수많은 팬이 동시 접속해도 안정적이고 압도적인 로딩 속도를 보장합니다.

---

## 🌟 주요 기능

- ⚡ **Next.js PPR (Partial Prerendering) 초고속 로딩**: 정적 쉘(Static Shell)이 0ms에 먼저 렌더링되고, 일정 데이터는 Suspense를 통해 백그라운드에서 매끄럽게 스트리밍 결합됩니다.
- 🛡️ **5분 스마트 캐싱**: PandaScore API를 5분(`revalidate: 300`) 단위로 캐시하여 API 과부하 및 레이트 리밋을 원천 차단하고 서버 자원을 절약합니다.
- 🎯 **오늘/다음 예정 경기 자동 포커스**: 첫 페이지 진입 시 오늘 진행 중이거나 가장 가까운 다음 예정 경기 카드로 부드럽게 스무스 스크롤되며 하이라이트 애니메이션이 점멸합니다.
- 🗓️ **월별 네비게이션 탭 (10월 / 11월)**: 대회 진행 기간에 맞춰 월별로 빠르게 일정을 전환하며 볼 수 있습니다.
- 🇰🇷 **LCK 팀 전용 필터링**: LCK 소속 팀들의 경기만 한눈에 모아볼 수 있는 필터 탭을 제공합니다. (TBD 매치는 대진 확정 시 자동 반영)
- 🔗 **URL 쿼리 동기화**: 월 선택 및 LCK 필터 상태가 URL(`?month=10&lck=true`)에 실시간 반영되어 일정 공유가 간편합니다.
- ⚔️ **아코디언 세트별 승패 조회**: 각 대진 카드를 클릭하면 펼쳐져 세트별 승리팀, 경기 상태, 소요 시간을 한눈에 확인할 수 있습니다 (다중 펼침 지원).
- 🌙 **완벽한 다크 모드 (Default Dark)**: LoL e스포츠 감성에 맞춘 고급스러운 다크 테마를 기본 제공하며, 헤더의 토글 버튼을 통해 라이트 테마로 전환할 수 있습니다.
- 🧭 **스크롤 상단/하단 이동 플로팅 버튼**: 방대한 46경기의 타임라인을 자유롭게 오갈 수 있도록 화면 우측 하단에 스무스 스크롤 이동 버튼을 지원합니다.
- 🕒 **한국 표준시 (KST) 일관 렌더링**: 모든 날짜와 시간은 KST(UTC+9)로 고정 계산되어 SSR과 클라이언트 간 수화(Hydration) 불일치가 발생하지 않습니다.

---

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15+ (App Router, React 19)
- **렌더링 전략**: Partial Prerendering (PPR `incremental`) + React Server Components (RSC)
- **언어**: TypeScript (Strict Mode)
- **스타일링**: Tailwind CSS
- **컴포넌트 라이브러리**: shadcn/ui, Radix UI
- **아이콘**: Lucide React
- **테마 관리**: next-themes
- **외부 API**: [PandaScore LoL API](https://pandascore.co/)

---

## 🌐 PandaScore API 연동 정보

본 서비스는 PandaScore의 공식 LoL e스포츠 엔드포인트를 사용합니다.

| 분류               | 메서드 / 엔드포인트                                                                  | 비고                                                      |
| :----------------- | :----------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **시리즈 정보**    | `GET https://api.pandascore.co/lol/series?filter[id]=11014`                          | 2026 Worlds 시리즈 메타데이터                             |
| **토너먼트 정보**  | `GET https://api.pandascore.co/lol/tournaments?filter[serie_id]=11014`               | Play-In(`22046`), Group Stage(`22047`), Playoffs(`22048`) |
| **전체 경기 일정** | `GET https://api.pandascore.co/lol/matches?filter[serie_id]=11014&sort=scheduled_at` | 총 46경기 스케줄 목록                                     |

---

## 🚀 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래와 같이 PandaScore API 토큰을 입력합니다.

```env
# PandaScore API Token (서버 사이드에서만 안전하게 사용됨)
PANDASCORE_API_TOKEN="wCTex0V0g1EghHjxRRcmzW84DD94GBdpU-Ew5VYHcMKtDN2AUXA"
```

> ⚠️ **주의**: 보안을 위해 `NEXT_PUBLIC_` 접두사를 붙이지 마십시오. 토큰은 서버 컴포넌트 내부에서만 소비되어 클라이언트로 유출되지 않습니다.

### 2. 패키지 설치

```bash
npm install
# 또는
pnpm install
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인합니다.

### 4. 프로덕션 빌드 및 실행

Next.js PPR이 정상 동작하는지 빌드하여 검증합니다.

```bash
npm run build
npm run start
```

---

## 📚 프로젝트 문서 (Docs)

프로젝트 설계 및 협업 가이드는 [`docs/`](./docs/) 디렉터리에서 체계적으로 관리됩니다.

- 🌟 **[RULE.md](./docs/RULE.md)**: AI 에이전트 및 개발자를 위한 최상위 마스터 진입점 (5대 핵심 헌장 및 라우팅 맵)
- 📐 **[CONVENTIONS.md](./docs/CONVENTIONS.md)**: 프론트엔드 상세 개발 규정 (화살표 함수, 네이밍, TS/Zod, 검증, Git 커밋)
- 🏗️ **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Next.js 15 PPR 렌더링 파이프라인, 5분 캐시 계층 및 시스템 설계
- 📋 **[BACKLOG.md](./docs/BACKLOG.md)**: 백로그 풀링 방식 협업을 위한 페이즈별 상세 구현 티켓 목록

---

## 📂 프로젝트 구조

```text
├── docs/                  # 프로젝트 가이드 및 설계 문서
│   ├── ARCHITECTURE.md    # 시스템 아키텍처 및 데이터 흐름 다이어그램
│   ├── BACKLOG.md         # 풀링 방식 협업을 위한 페이즈별 구현 티켓 목록
│   ├── CONVENTIONS.md     # 프론트엔드 상세 개발 컨벤션
│   └── RULE.md            # AI 마스터 진입점 및 5대 핵심 헌장
├── README.md              # 프로젝트 안내 문서
├── public/                # 파비콘 및 정적 에셋
└── src/
    ├── app/               # Next.js App Router (PPR 쉘 & 스트리밍 경계)
    ├── components/
    │   ├── common/        # header.tsx, theme-toggle.tsx, scroll-floating-buttons.tsx
    │   ├── filter/        # month-tabs.tsx, lck-filter-toggle.tsx
    │   ├── schedule/      # match-card.tsx, match-accordion.tsx, timeline-section.tsx, auto-scroll-focus.tsx
    │   ├── icons/         # 커스텀 SVG 아이콘 컴포넌트
    │   └── ui/            # shadcn/ui 기반 원자 컴포넌트
    ├── constants/         # teams.ts, tournament.ts
    ├── lib/
    │   ├── api/           # pandascore-api.ts (server-only, 5분 캐시)
    │   └── date/          # kst-date.ts (KST 포맷터 및 날짜 계산 유틸)
    └── types/             # pandascore.ts (Zod 스키마 및 TypeScript 타입)
```

---

## 🤝 협업 방식 (Backlog Pulling)

본 프로젝트는 AI와 개발자가 효율적으로 역할을 분담하여 작업할 수 있도록 **[BACKLOG.md](./docs/BACKLOG.md)**의 티켓 풀링 방식을 채택하고 있습니다.  
자세한 티켓 진행 규칙은 **[RULE.md](./docs/RULE.md)**를 참조하세요.
