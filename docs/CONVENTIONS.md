# 📐 웹 프론트엔드 개발 컨벤션 (CONVENTIONS.md)

본 문서는 **Next.js 15 (App Router) + TypeScript + Tailwind CSS** 환경에서 코드 품질과 일관성을 유지하기 위한 상세 개발 규정입니다.

---

## 1. 아키텍처 및 컴포넌트 선언 규칙

### 1.1 서버 컴포넌트(RSC) 및 잎새(Leaf) 클라이언트 컴포넌트

- 모든 컴포넌트는 기본적으로 **React Server Component (RSC)**로 작성합니다.
- 이벤트 리스너(`onClick`), React Hook(`useState`, `useEffect`, `useSearchParams`), 브라우저 DOM 접근(`window`, `scrollIntoView`)이 필요한 UI만 **최말단 잎새(Leaf) 컴포넌트**로 분리하여 최상단에 `'use client';`를 선언합니다.
- 합성(Composition) 패턴을 적극 활용하여 RSC를 Client Component의 `children`이나 `props`로 전달함으로써 클라이언트 번들을 최소화합니다.

### 1.2 `const` 화살표 함수 필수 (`function` 키워드 금지)

- 모든 컴포넌트, 유틸리티, 헬퍼 함수는 예외 없이 `const` 화살표 함수로 일관되게 작성합니다.

```tsx
// ❌ Bad
function MatchCard({ match }: MatchCardProps) {
  return <div>{match.name}</div>;
}

// ✅ Good
export const MatchCard = ({ match }: MatchCardProps) => {
  return <div>{match.name}</div>;
};
```

### 1.3 Export 규칙

- **일반 컴포넌트 및 유틸리티**: **Named Export** (`export const ComponentName = ...`)를 필수로 사용합니다.
- **Next.js 특수 라우팅 파일**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` 등 프레임워크 규약 파일만 `export default`를 사용합니다.

### 1.4 반복되는 UI 패턴의 서브 컴포넌트 분리 (DRY 원칙)

- 동일하거나 유사한 마크업 구조, 긴 Tailwind 클래스 묶음, 아이콘/접근성 속성을 가진 UI 블록(버튼, 배지, 카드 조각 등)이 **2회 이상 중복될 경우 인라인 복사 작성을 엄격히 지양**합니다.
- **분리 가이드라인**:
  - **파일 로컬 서브 컴포넌트**: 해당 파일 내에서만 소비되는 UI는 컴포넌트 상단/하단에 `const SubButton = ({ ... }: SubButtonProps) => ...` 형태로 선언하여 JSX 가독성을 높이고 유지보수성을 확보합니다.
  - **데이터 주도 렌더링**: 반복되는 UI가 고정된 액션/버튼 목록인 경우, 설정 배열(`const actions = [...] as const`)을 정의하고 `.map()`으로 렌더링하거나 전용 서브 컴포넌트에 Props를 넘깁니다.
  - **전역 공통 컴포넌트**: 여러 페이지 또는 컴포넌트에 걸쳐 재사용되는 UI는 `@/components/common/` 또는 `@/components/ui/`로 승격하여 분리합니다.

---

## 2. 파일 및 식별자 네이밍 컨벤션

### 2.1 파일명 및 디렉터리 (File & Directory Names)

- 모든 파일 및 디렉터리 이름은 **케밥 케이스(`kebab-case`)**를 사용합니다.
  - _예시_: `match-card.tsx`, `match-accordion.tsx`, `pandascore-api.ts`, `kst-date.ts`, `scroll-floating-buttons.tsx`
  - _(단, Next.js 예약 파일인 `page.tsx`, `layout.tsx` 등은 프레임워크 규약 준수)_

### 2.2 식별자 명명 규칙

- **컴포넌트 및 타입**: 파스칼 케이스 (`PascalCase`) - `MatchCard`, `GroupedSchedule`
- **함수 및 변수**: 카멜 케이스 (`camelCase`) - `get2026WorldsMatches`, `formatToKstDate`
- **커스텀 훅**: `use` 접두사 필수 - `useAutoScroll`, `useScheduleFilter`
- **불리언(Boolean) 변수/Props**: `is`, `has`, `should`, `can` 접두사 - `isLoading`, `isLckMatch`, `isOpen`
- **상수 및 환경변수**: 대문자 스네이크 케이스 (`SCREAMING_SNAKE_CASE`) - `LCK_TEAM_IDENTIFIERS`, `PANDASCORE_API_TOKEN`

---

## 3. TypeScript 및 타입 관리 규칙

### 3.1 `any` 타입 사용 엄격 금지

- `any`는 사용할 수 없습니다. 동적 데이터는 `unknown`을 사용하고, 타입 가드 또는 Zod 스키마를 통해 안전하게 좁힙니다.

### 3.2 `type` 별칭 우선

- 선언 병합이 필요한 특수 상황을 제외하고는 기본적으로 `type` 키워드를 우선 사용합니다.

### 3.3 타입 배치 및 Zod 런타임 검증

- **공통 도메인 타입**: `@/types/` 디렉터리 내 도메인 파일에 분리 선언합니다.
- **컴포넌트 Props**: 컴포넌트 파일 상단에 `type [ComponentName]Props = { ... }`로 정의합니다.
- **외부 API 및 환경변수**: Zod 스키마(`z.object(...)`)로 런타임 검증을 수행하고, `z.infer<typeof schema>`로 정적 타입을 도출합니다.

---

## 4. UI, 스타일링 및 에셋 관리

### 4.1 Tailwind CSS 및 조건부 클래스

- 인라인 스타일(`style={{ ... }}`)을 지양하고 Tailwind 유틸리티 클래스를 우선합니다.
- 조건부 클래스 합성은 반드시 `cn()` 유틸리티 함수(`clsx` + `tailwind-merge`)를 사용합니다.

```tsx
import { cn } from "@/lib/utils";

<div className={cn("rounded-lg p-4", isActive && "ring-2 ring-primary", className)} />;
```

### 4.2 아이콘 및 이미지 최적화

- **인라인 SVG 작성 금지**: 컴포넌트 본문에 긴 `<svg>...</svg>` 코드를 직접 작성하지 않습니다.
- **아이콘 라이브러리**: `lucide-react`를 표준 아이콘으로 사용합니다.
- **커스텀 SVG**: `@/components/icons/` 내에 개별 컴포넌트(`kebab-case.tsx`)로 생성하여 `className`을 전달받도록 구현합니다.
- **이미지 최적화**: 일반 `<img>` 대신 `next/image`의 `Image` 컴포넌트를 필수 사용하며, PandaScore CDN(`cdn-api.pandascore.co`)을 `next.config.ts`에 등록합니다.

---

## 5. 데이터 페칭 및 보안 규칙

- **비밀키 격리**: `PANDASCORE_API_TOKEN`은 서버 전용 환경변수로만 관리하며 절대 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.
- **Server-Only 선언**: 서버 사이드 전용 로직 파일 최상단에 `import "server-only";`를 선언합니다.
- **단일 진실 공급원(SSOT)으로서의 URL**: 탭, 필터, 검색 등 공유 가능한 상태는 `useSearchParams`를 통한 URL Query Parameter와 동기화합니다.

---

## 6. Import 규칙 및 경로 별칭

- **경로 별칭 필수**: 상대 경로 대신 `@/*` 절대 경로 별칭을 일관되게 사용합니다.
- **배럴 파일(Barrel File) 생성 및 사용 일체 금지**:
  - 디렉터리 내에 `index.ts`를 두고 하위 모듈을 재수출(`export * from ...`)하는 배럴 패턴을 작성하지 않습니다.
  - Vercel 성능 모범 규약(`bundle-barrel-imports`)에 따라, 트리 쉐이킹(Tree-shaking) 저해, HMR/빌드 시간 지연, 순환 참조를 방지하기 위해 반드시 원본 파일 경로(`@/constants/teams`, `@/lib/date/kst-date` 등)로 직접 명시적 임포트합니다.
- **Import 순서**:
  1. React 및 Next.js 패키지 (`react`, `next/...`)
  2. 서드파티 라이브러리 (`lucide-react`, `zod`, `next-themes` 등)
  3. 내부 비즈니스 로직, 훅, 유틸리티 (`@/lib/...`, `@/constants/...`)
  4. 컴포넌트 및 아이콘 (`@/components/...`)
  5. 타입 및 스타일 (`@/types/...`, `@/app/globals.css`)

---

## 7. 4단계 코드 품질 검증 파이프라인 (Verification Pipeline)

모든 작업 완료 후에는 다음 4단계를 순서대로 실행하여 에러가 없음을 확인합니다:

1. **포맷팅 (Formatting)**: `npm run format` (or `npx prettier --write .`)
2. **린트 (Linting)**: `npm run lint`
3. **타입 검사 (Type Checking)**: `npx tsc --noEmit`
4. **빌드 검증 (Build Verification)**: `npm run build`

---

## 8. Git 커밋 컨벤션 (Atomic Commits)

- **커밋 실행 원칙**: 임의로 자동 커밋하지 않으며, **반드시 사용자의 명시적인 커밋 요청/승인이 있을 때만** 커밋을 진행합니다.
- 일괄 커밋(`git add .`)을 금지하고 관심사별로 분할 커밋합니다:
  1. 타입/스키마 $\rightarrow$ 2. 로직/유틸 $\rightarrow$ 3. UI 컴포넌트 $\rightarrow$ 4. 문서/설정
- 형식: `<type>(<scope>): <subject>` (`feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`)
