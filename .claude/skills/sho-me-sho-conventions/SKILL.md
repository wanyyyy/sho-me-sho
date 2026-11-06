---
name: sho-me-sho-conventions
description: >
  sho-me-sho(증명서 번역) 프로젝트의 구조 컨벤션(FSD 레이어·파일 네이밍·import 규칙·Tailwind 토큰·테스트·커밋)을 제공한다.
  이 저장소에서 파일을 생성/이동/리팩토링하거나 컴포넌트·훅·스키마·테스트를 작성할 때 먼저 참조한다.
  트리거: FSD, 레이어, 슬라이스, 파일명, 네이밍, *.ui.tsx, *.lib.ts, index.ts, public API, import 규칙, 폴더 구조, 리팩토링, 컨벤션, 커밋.
---

# sho-me-sho 구조 컨벤션

## FSD 레이어

`app -> pages -> widgets -> features -> entities -> shared`

- 상위 → 하위 방향 import만 허용. 같은 레이어의 다른 슬라이스는 import하지 않는다 (feature → feature 금지).
- `shared`는 다른 레이어에 의존하지 않는다.
- 외부 레이어는 슬라이스의 `index.ts`(Public API)만 import한다. 내부 파일 직접 접근은 ESLint `no-restricted-imports`가 막는다.
- 슬라이스 내부 참조는 상대경로(`./foo.lib`).
- import 순서: 외부 패키지 → `@/shared` → `@/entities` → `@/features` → `@/widgets` → `@/pages` → 상대경로. CSS import는 맨 마지막.

| 레이어     | 역할                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`      | 진입점, providers(router, react-query), 글로벌 CSS                                                                                            |
| `pages`    | 라우트 단위 조합자. UI 로직을 직접 구현하지 않는다                                                                                            |
| `widgets`  | 여러 feature를 조합하는 블록 (예: documents = 서류 feature 등록표 + 메뉴)                                                                     |
| `features` | 메뉴(주소)별 ui + model (예: marriage, basic, family) 과 화면 섹션 (upload, translation-editor, export). feature 끼리 모르므로 조합은 widgets |
| `entities` | 도메인 모델, 계약, 스토어, 순수 변환 (서류 종류를 모른다)                                                                                     |
| `shared`   | lib(react-query, react-router, utils, test), ui(+layout)                                                                                      |

## 파일 네이밍

세그먼트는 **폴더가 아닌 파일 접미사**로 표현한다: `{kebab-접두어}.{세그먼트}.ts(x)`. 슬라이스 루트에는 `index.ts`만 둔다.

| 접미사            | 용도                                           |
| ----------------- | ---------------------------------------------- |
| `*.ui.tsx`        | React 컴포넌트                                 |
| `*.lib.ts`        | 순수 로직, 훅, 헬퍼                            |
| `*.utils.ts`      | 범용 유틸 (`shared/lib/utils` 전용)            |
| `*.contracts.ts`  | 스키마/계약                                    |
| `*.types.ts`      | 타입, 인터페이스, 에러 클래스                  |
| `*.queries.ts`    | `queryOptions`, queryKey 팩토리                |
| `*.mutation.ts`   | `useMutation` 훅 (features)                    |
| `*.repository.ts` | 저장소 구현/선택                               |
| `*.store.ts`      | 전역 상태 스토어                               |
| `*.model.ts`      | 화면 상태/비즈니스 흐름                        |
| `*.mock.ts`       | 샘플 데이터                                    |
| `*.route.tsx`     | react-router `RouteObject`                     |
| `*.loader.ts`     | react-router loader                            |
| `*.test.ts(x)`    | 테스트 (대상 파일명 + `.test`)                 |
| `*.d.ts`          | 전역/SDK 타입 선언 (같은 basename 금지)        |
| `*.css`           | 컴포넌트 전용 스타일, 같은 접두어로 콜로케이션 |

예외(접미사 없음): `app/main.tsx`, `app/app-providers.tsx`, `app/providers/*-provider.tsx`, `app/index.css`,
`shared/lib/react-query/query-client.ts`, `shared/lib/react-router/react-router.paths.ts`, `shared/lib/test/setup.ts`, `vite-env.d.ts`.

- pages: `{화면}-page.ui.tsx` / `.route.tsx` / `.loader.ts`
- features: `{슬라이스}-section.ui.tsx`, 하위 파트는 행위-대상 (`upload-dropzone.ui.tsx`)
- 라우트 경로는 `@/shared/lib/react-router`의 `ROUTE_PATHS` / `routePaths`로만 참조한다.

검증: `cd src && find . -type f | sort | grep -vE "/index\.ts$|\.(ui|route|loader|model|lib|utils|contracts|types|queries|mutation|repository|store|mock|test|d)\.(ts|tsx)$|\.css$|\.gitkeep$"` 결과가 예외 목록만 나와야 한다.

## 데이터

- `queryOptions`는 entities `*.queries.ts`, `use` 접두어 금지. 컴포넌트는 `useSuspenseQuery(xxxQueryOptions())`, 로더는 `queryClient.ensureQueryData()`.
- queryClient 기본값: 조회 `throwOnError: true`(ErrorBoundary), mutation은 각 폼에서 `isError`.
- 환경변수는 `.env.*` → `src/vite-env.d.ts` → `src/shared/env/{x}.lib.ts` 3곳 동시 수정.

## Tailwind v4

- 색·폰트는 `src/app/index.css` `@theme` 토큰만 (`paper-*`, `ink-*`, `accent-*`, `success-500`, `danger-500`). 임의 hex 금지.
- 클래스 결합은 `cn()`. 공통 프레임은 `shared/ui/layout`의 `AppLayout`.
- feature 전용 CSS는 feature 폴더에 콜로케이션. 글로벌 `index.css`에는 리셋·토큰·body만.

## 테스트

- 대상 파일 옆 `{파일명}.test.ts(x)`, `describe/it` 설명은 한글. `vitest/globals` 활성.
- 테스트 대상: `*.lib.ts`, `*.utils.ts`, 섹션/폼 컴포넌트. 제외: `contracts/types/queries/index.ts`, `app/**`, `pages/**`.

## Git

- 커밋: `{type}: {한글 요약}` (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`). AI 트레일러(`Co-Authored-By`)를 넣지 않는다.
- 기본 브랜치 `main`, 원격 `origin` = github.com/wanyyyy/sho-me-sho (public). 회사 프로젝트명·내부 URL을 남기지 않는다.
- 커밋 전 `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
