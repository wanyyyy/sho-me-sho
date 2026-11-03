# 수리증명서 번역 (sho-me-sho)

일본 관공서에서 발급한 수리증명서(受理証明書) 사진이나 PDF 를 올리면 내용을 읽어 한국어 양식에 채우고, 틀린 칸은 직접 고쳐 인쇄·PDF 로 저장하는 웹 앱.

- 업로드: JPG · PNG · WEBP · HEIC(아이폰) · PDF, 20MB 이하
- 읽기·번역: 항목별 값(원문·번역·신뢰도)을 JSON 으로 받아 양식 칸에 채움 (현재는 mock 엔진, 실제 모델 연동은 예정)
- 편집: 원본과 양식을 나란히 놓고 칸 단위로 수정. 신뢰도가 낮거나 인명인 칸은 "확인 필요" 표시
- 출력: 원본 표 구조를 그대로 따른 한국어 양식 + 번역 확인서(번역일·번역자·관계)를 가로 A4 로 인쇄·PDF 저장
- 모바일: 좁은 화면에서는 표 대신 세로 목록으로 편집, 미리보기는 화면 폭에 맞게 축소
- 개인정보: 파일과 번역 내용을 서버·브라우저 어디에도 저장하지 않음. 탭을 닫으면 사라짐
- 접근 코드: 해시만 설정해 두면 코드를 아는 사람만 들어올 수 있음 (선택)

## 기술

- 패키지 매니저: **pnpm 12** / Node **22**
- 번들러: **Vite 8** + `@vitejs/plugin-react`
- UI: **React 19** + **Tailwind CSS v4**
- 라우팅: **react-router-dom v7** (data router, lazy route)
- 상태: **@tanstack/react-query v5**(비동기), **zustand**(작업 중 문서·번역자 정보)
- 계약: **zod**
- PDF 미리보기: **pdfjs-dist** (PDF 올릴 때만 로드), HEIC 변환: **heic2any** (HEIC 올릴 때만 로드)
- 테스트: **Vitest 4** + happy-dom + Testing Library
- 품질: ESLint 9 (flat) + Prettier + husky/lint-staged

## 시작하기

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

홈에서 파일을 올리거나 "샘플로 체험하기"를 누르면 편집 화면으로 이동합니다.

## 사용 흐름

1. **업로드** — 드래그 앤 드롭 또는 파일 선택. HEIC 는 브라우저 안에서 JPEG 로 변환, PDF 는 첫 페이지를 이미지로 렌더해 원본 패널에 표시
2. **읽기·번역** — `Extractor` 인터페이스로 엔진을 호출해 `{ documentType, fields: { [key]: { ja, ko, confidence } } }` 를 받음. 날짜 칸은 엔진 결과와 무관하게 원문 연호(令和·平成·昭和, 전각 숫자 포함)를 서기로 다시 계산
3. **검토·수정** — 왼쪽 원본, 오른쪽 양식. 칸 상태는 확인됨 / 확인 필요 / 수정됨 / 읽지 못함. 수정값은 모델값과 따로 보관해 "다시 읽기"가 수정을 지우지 않는 구조
4. **인쇄·PDF 저장** — 미리보기에서 가로 A4 시트를 확인하고 브라우저 인쇄창에서 PDF 로 저장. 발행자 옆에는 붉은 "직인" 표시, 용지 맨 아래에 번역 확인서

## 양식 (수리증명서)

원본 서식의 표를 1:1 로 옮긴 구조입니다. 머릿글·항목명·고정 문구는 코드에 고정하고 값만 채웁니다.

| 구역        | 칸                                                                          |
| ----------- | --------------------------------------------------------------------------- |
| 신고        | 신고 종류, 신고일                                                           |
| 신고인 ×2   | 성명, 괄호 안 표기                                                          |
| 사건본인 ×4 | 읽기(ふりがな), 성명, 관계(처/부), 본적 또는 국적·지역, 생년월일            |
| 신고의 요지 | 【항목】 내용 ×2 (신고 후 본적, 호적의 변동 등)                             |
| 발행        | 발행번호, 수리일(증명 문구에 치환), 발행일, 발행자 직함·성명 + 직인 표시    |
| 번역 확인서 | 번역일(기본 오늘), 번역자 성명, 본인과의 관계 [V] 본인 / 가족 / 번역 대행자 |

칸 키는 `person.0.name` 처럼 행 번호가 들어간 평면 키라서, 실제 엔진에 같은 키로 JSON 을 요청하면 그대로 꽂힙니다. 선언은 `src/entities/certificate/marriage.template.ts`.

## 접근 코드 (선택)

코드 원문은 어디에도 두지 않고 SHA-256 해시만 환경변수로 둡니다.

```sh
pnpm access:hash 원하는코드
echo "VITE_ACCESS_CODE_HASH=<출력된 해시>" > .env.local   # gitignore 대상
```

해시가 비어 있으면 게이트가 꺼져 누구나 들어옵니다. 통과 여부는 탭 단위(sessionStorage)로만 기억합니다.
브라우저만으로 검사하는 "가벼운 문"이라 개발자 도구로 우회할 수 있습니다. 비용이 드는 API 호출을 막는 진짜 잠금은 서버(프록시)에서 같은 코드를 검사해야 합니다.

## 개인정보

- 올린 파일과 번역 내용은 서버나 데이터베이스에 저장하지 않습니다. 모든 처리는 브라우저 안에서만 이루어집니다.
- localStorage · IndexedDB 를 쓰지 않습니다. 탭을 닫거나 새로고침하면 파일·수정 내용·번역자 정보가 모두 사라집니다.
- 실제 엔진을 붙이면 "이미지가 AI 서비스로 전송되며 저장되지 않는다"는 안내와 프록시 접속 기록(IP·시각) 보관 기간을 안내문에 추가해야 합니다.

## Scripts

| key           | description                    |
| ------------- | ------------------------------ |
| dev           | 로컬 개발 서버 구동            |
| build         | 타입체크 + 프로젝트 빌드       |
| preview       | 빌드결과 미리보기              |
| lint          | ESLint                         |
| typecheck     | `tsc --noEmit`                 |
| format        | Prettier                       |
| test          | Vitest 실행                    |
| test:ui       | Vitest UI                      |
| test:coverage | 커버리지 리포트 (`./coverage`) |
| access:hash   | 접근 코드 → SHA-256 해시       |

## Architecture — Feature-Sliced Design

> https://feature-sliced.design/kr/

```
src/
  app/          진입점, providers(router, react-query), 글로벌 CSS(@theme 토큰), 접근 게이트 적용
  pages/        home(업로드) · editor(편집) · error(404)
  features/
    access-gate/          접근 코드 입력·검증 (해시 비교, 탭 단위 기억)
    upload/               드롭존·파일 검증 · 업로드→변환→엔진→문서 열기 · 개인정보 안내
    translation-editor/   원본 패널 · 양식 편집(표/세로 목록) · 상태 칩 · 툴바(모바일 하단 바) · 번역자 입력
    export/               인쇄 미리보기 버튼
  entities/
    certificate/          추출 결과 계약(zod) · 양식 선언 · 시트 컴포넌트(편집·인쇄 공용) · 문서 스토어 · 번역자 스토어 · mock 엔진 · 엔진 선택 지점(extractor.lib.ts)
  shared/
    env/        환경변수 (접근 코드 해시)
    lib/        crypto(sha256) · date-jp(연호→서기) · file(파일 종류 표) · image(HEIC→JPEG) · pdf(첫 페이지 렌더) · react-query · react-router · test · utils
    ui/         button · error-fallback · fallback-loading · layout · print(A4 시트 · 인쇄 미리보기 · iframe 인쇄)
```

- 레이어 import 는 `@/shared`, `@/entities`, `@/features`, `@/widgets`, `@/pages` alias 만 사용하며, 슬라이스 내부 경로 직접 import 와 feature 간 import 는 ESLint 로 금지됩니다. 각 슬라이스는 `index.ts` 로 public API 를 노출합니다.
- 라우트 경로는 `@/shared/lib/react-router` 의 `ROUTE_PATHS` / `routePaths` 로만 참조합니다.
- 상세 컨벤션: `.claude/skills/sho-me-sho-conventions/SKILL.md`

## 다음 단계 (미정)

- 실제 읽기·번역 엔진 연결과 API 키를 보관할 서버리스 함수(접근 코드 검사, IP·일일 한도, IP·시각·토큰 수만 기록)
- 호스팅 선택 후 배포
