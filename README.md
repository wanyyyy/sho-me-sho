# 증명서 번역 (sho-me-sho)

한일 혼인신고에 쓰는 증명서 사진이나 PDF 를 올리면 내용을 읽어 제출용 양식에 채우고, 틀린 칸은 직접 고쳐 인쇄·PDF 로 저장하는 웹 앱.

| 서류                    | 방향            | 양식                                                        |
| ----------------------- | --------------- | ----------------------------------------------------------- |
| 수리증명서 (受理証明書) | 일본어 → 한국어 | 한국 구청 제출용, 가로 A4 1장                               |
| 기본증명서(상세)        | 한국어 → 일본어 | 일본 시약소 제출용, 세로 A4 2장 (2쪽 발급 정보는 직접 입력) |
| 가족관계증명서(상세)    | 한국어 → 일본어 | 일본 시약소 제출용, 세로 A4 1장                             |

홈에서 서류를 고르면 그 서류의 업로드 화면으로 갑니다. 서류를 더 늘리려면 아래 "양식 추가하기"를 참고.

- 업로드: JPG · PNG · WEBP · HEIC(아이폰) · PDF, 20MB 이하. 여러 쪽 서류는 사진 여러 장이나 PDF 로 한 번에 (최대 3쪽, 쪽 순서대로 모델에 전달)
- 읽기·번역: 이미지를 서버 함수(`/api/extract`)로 보내 Gemini 가 항목별 값(원문·번역·신뢰도)을 JSON 으로 돌려주면 양식 칸에 채움. 실제 증명서 1장 기준 약 13초, 입력 2.8K · 출력 1.8K 토큰
- 편집: 원본과 양식을 나란히 놓고 칸 단위로 수정. 신뢰도가 낮거나 인명인 칸은 "확인 필요" 표시. 서류마다 행 수가 다른 표(기본증명서의 상세내용 등)는 모델이 읽은 만큼 행이 생김
- 출력: 원본 표 구조를 그대로 따른 한국어 양식 + 번역 확인서(번역일·번역자·관계)를 가로 A4 로 인쇄·PDF 저장
- 모바일: 좁은 화면에서는 표 대신 세로 목록으로 편집, 미리보기는 화면 폭에 맞게 축소
- 개인정보: 파일과 번역 내용을 서버·브라우저 어디에도 저장하지 않음. 서버에는 IP·시각·사용량만 한 줄 기록
- 접근 코드: 해시만 설정해 두면 코드를 아는 사람만 들어올 수 있고, 서버도 같은 코드를 검사 (선택)
- 비용 방어: IP 당 하루 호출 한도

## 기술

- 패키지 매니저: **pnpm 12** / Node **22**
- 번들러: **Vite 8** + `@vitejs/plugin-react`
- UI: **React 19** + **Tailwind CSS v4**
- 라우팅: **react-router-dom v7** (data router, lazy route)
- 상태: **@tanstack/react-query v5**(비동기), **zustand**(작업 중 문서·번역자 정보)
- 계약: **zod**
- PDF 미리보기: **pdfjs-dist** (PDF 올릴 때만 로드), HEIC 변환: **heic2any** (HEIC 올릴 때만 로드)
- 서버: Vercel 서버리스 함수(`api/`, Web 표준 `Request`/`Response`). 로컬은 Vite 플러그인(`vite.api-routes.ts`)이 같은 핸들러를 `pnpm dev` 에 붙여 줌
- 테스트: **Vitest 4** + happy-dom + Testing Library
- 품질: ESLint 9 (flat) + Prettier + husky/lint-staged

## 시작하기

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

홈에서 파일을 올리거나 "샘플로 체험하기"를 누르면 편집 화면으로 이동합니다.

`pnpm dev` 는 기본으로 브라우저 안 mock 엔진을 씁니다. 서버 함수까지 같이 돌려 보려면 `.env.local` 에 `VITE_EXTRACTOR=remote` 를 두면 `/api/extract` 가 Vite dev 서버에 붙습니다. 환경변수 목록은 `.env.example` 참고.

## 사용 흐름

1. **업로드** — 드래그 앤 드롭 또는 파일 선택(여러 장 가능). HEIC 는 브라우저 안에서 JPEG 로 변환, PDF 는 쪽마다 JPEG 로 렌더. 서버에는 긴 변 1,568px 로 줄인 JPEG 를 쪽 순서대로 보냄 (모델 토큰 절약)
2. **읽기·번역** — `Extractor` 인터페이스로 `/api/extract` 를 호출해 `{ documentType, fields: { [key]: { ja, ko, confidence } } }` 를 받고 zod 로 검증. 날짜 칸은 엔진 결과와 무관하게 원문 연호(令和·平成·昭和, 전각 숫자 포함)를 서기로 다시 계산
3. **검토·수정** — 왼쪽 원본, 오른쪽 양식. 칸 상태는 확인됨 / 확인 필요 / 수정됨 / 읽지 못함. 수정값은 모델값과 따로 보관해 "다시 읽기"가 수정을 지우지 않는 구조
4. **인쇄·PDF 저장** — 미리보기에서 가로 A4 시트를 확인하고 브라우저 인쇄창에서 PDF 로 저장. 발행자 옆에는 붉은 "직인" 표시, 용지 맨 아래에 번역 확인서

## 양식

원본 서식의 표를 1:1 로 옮긴 구조입니다. 머릿글·항목명·고정 문구는 코드에 고정하고 값만 채웁니다. 메뉴(서류) 하나는 자기 feature(`src/features/<서류>/`)에 model(`DocumentTemplate` 선언: 번역 방향 `source`/`target`, 고정 칸, 가변 행 그룹, 모델 지시 규칙, 모바일 목록 묶음, 파일명), 양식 시트 ui, 샘플 mock 세 가지를 가집니다. 서류와 무관한 양식 엔진(타입·가변 행 키 헬퍼·시트 공통 스타일)은 `shared/lib/template`, `shared/ui/sheet` 에 있고, 서류 feature 들을 묶는 등록표와 메뉴는 `widgets/documents` 에 있습니다.

### 수리증명서 (marriage)

| 구역        | 칸                                                                          |
| ----------- | --------------------------------------------------------------------------- |
| 신고        | 신고 종류, 신고일                                                           |
| 신고인 ×2   | 성명, 괄호 안 표기                                                          |
| 사건본인 ×4 | 읽기(ふりがな), 성명, 관계(처/부), 본적 또는 국적·지역, 생년월일            |
| 신고의 요지 | 【항목】 내용 ×2 (신고 후 본적, 호적의 변동 등)                             |
| 발행        | 발행번호, 수리일(증명 문구에 치환), 발행일, 발행자 직함·성명 + 직인 표시    |
| 번역 확인서 | 번역일(기본 오늘), 번역자 성명, 본인과의 관계 [V] 본인 / 가족 / 번역 대행자 |

### 기본증명서(상세) (basic)

| 구역                   | 칸                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 등록기준지             | 등록기준지                                                                                                                   |
| 상세내용 (가변 행)     | 구분 · [항목] · 내용 — 작성/정정 등, 대괄호 줄 하나가 행 하나                                                                |
| 본인                   | 성명(가타카나+한자), 출생연월일, 주민등록번호, 성별, 본                                                                      |
| 일반등록사항 (가변 행) | 구분 · [항목] · 내용 — 출생 등                                                                                               |
| 증명                   | 증명일, 발급기관장 직함·성명, 발행번호                                                                                       |
| 2쪽 발급 정보          | 발급시각, 담당자, 전화, 신청인, 수입증지(번호·관서·금액·날짜·코드·발행시각), 직인 2행 — 1쪽만 올리면 비어 있으므로 직접 입력 |
| 翻訳証明書             | 翻訳年月日(기본 오늘), 翻訳者氏名, 本人との関係 [V] 本人 / 家族 / 翻訳代行者                                                 |

칸 키는 `person.0.name`, `history.2.value` 처럼 행 번호가 들어간 평면 키라서, 엔진에 같은 키로 JSON 을 요청하면 그대로 꽂힙니다. 가변 행은 모델이 배열로 돌려주고 서버가 평면 키로 펴서(`flattenResponse`) 브라우저와 같은 계약을 유지합니다. 날짜는 엔진 번역과 무관하게 원문에서 다시 계산합니다 (연호 → 서기, 년월일 → 年月日).

### 가족관계증명서(상세) (family)

| 구역               | 칸                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------- |
| 등록기준지         | 등록기준지                                                                               |
| 본인               | 성명(가타카나+한자), 출생연월일, 주민등록번호, 성별, 본                                  |
| 가족사항 (가변 행) | 구분(父·母·配偶者·子) · 성명 · 출생연월일 · 주민등록번호 · 성별 · 본 — 한 사람이 행 하나 |
| 증명               | 증명일, 발급기관장 직함·성명, 발행번호                                                   |
| 발급 정보          | 발급시각, 담당자, 전화, 신청인, 수입증지(번호·관서·금액·날짜·코드·발행시각), 직인        |
| 翻訳証明書         | 翻訳年月日(기본 오늘), 翻訳者氏名, 本人との関係 [V] 本人 / 家族 / 翻訳代行者             |

### 양식 추가하기

1. `src/features/<이름>/` 을 만들고 `<이름>.model.ts`(`DocumentTemplate<"<이름>">` 선언), `<이름>-sheet.ui.tsx`(양식 시트, 고정 문구는 여기·값은 `cell()`), `<이름>.mock.ts`(샘플), `index.ts` 를 둔다. 이 feature 는 `@/shared` 만 의존한다 (feature 간 import 금지).
2. `src/entities/certificate/certificate.contracts.ts` 의 `DocumentTypeSchema` 에 종류 추가
3. `src/widgets/documents/documents.model.ts` 의 `DOCUMENTS` 에 템플릿·시트·샘플 등록 (브라우저), `api/_lib/documents.ts` 에 템플릿·샘플 등록 (서버)

홈 메뉴, 업로드 화면, 편집 화면, 모바일 목록, 인쇄, 서버의 Gemini 지시문·응답 스키마는 모두 템플릿 선언에서 자동으로 따라옵니다.

## 접근 코드 (선택)

코드 원문은 어디에도 두지 않고 SHA-256 해시만 환경변수로 둡니다.

```sh
pnpm access:hash 원하는코드
echo "VITE_ACCESS_CODE_HASH=<출력된 해시>" > .env.local   # gitignore 대상
```

해시가 비어 있으면 게이트가 꺼지고 서버도 검사하지 않습니다. 통과한 코드는 탭 단위(sessionStorage)로만 기억했다가 `/api/extract` 호출 때 `x-access-code` 헤더로 같이 보내고, 서버가 같은 해시로 다시 검사합니다. 브라우저 게이트는 안내용이고 비용이 드는 호출을 막는 잠금은 서버 쪽 검사입니다. 서버에만 다른 해시를 두고 싶으면 `ACCESS_CODE_HASH` 가 우선합니다.

## 개인정보

- 올린 이미지는 읽기·번역을 위해 서버 함수를 거치지만 서버나 데이터베이스에 저장하지 않습니다. 서버 로그에는 호출 1건당 `{ at, ip, engine, status, ms, usage }` 한 줄만 남고 이미지·결과·접근 코드는 기록하지 않습니다 (`api/_lib/log.ts`).
- localStorage · IndexedDB 를 쓰지 않습니다. 탭을 닫거나 새로고침하면 파일·수정 내용·번역자 정보가 모두 사라집니다.
- 모델을 정하면 "이미지가 어느 AI 서비스로 전송되는지"와 그쪽 데이터 보관 정책을 안내문(`privacy-notice.ui.tsx`)에 추가해야 합니다.

## 서버 (api/)

```
api/
  extract.ts        POST /api/extract — 접근 코드 → IP 한도 → 업로드 검사 → 엔진 호출
  _lib/
    access.ts       접근 코드 해시 비교 (상수 시간)
    rate-limit.ts   IP 당 하루 한도 (인스턴스 메모리; 정확히 막으려면 같은 인터페이스로 KV 구현)
    http.ts         JSON 응답 · 클라이언트 IP · multipart 업로드 검사 (JPG/PNG/WEBP, 20MB, 최대 3쪽, documentType)
    log.ts          호출 로그 한 줄 (내용은 남기지 않음)
    documents.ts    서버용 서류 등록표 (템플릿·샘플, 시트 제외)
    engine.ts       ServerExtractor 인터페이스 · EXTRACT_ENGINE 으로 엔진 선택
    engines/
      sample.ts     샘플 데이터 엔진 (키 없이 개발할 때)
      gemini.ts     Gemini 엔진 (@google/genai · JSON 스키마 강제 응답 · 생각 수준 low)
      gemini.prompt.ts  템플릿 선언에서 지시문·응답 스키마(가변 행은 배열) 생성, 응답을 평면 키로 펴기
```

`api/` 와 거기서 가져오는 src 파일의 상대 import 는 `.ts` 확장자를 붙입니다 (`api/tsconfig.json` 의 `rewriteRelativeImportExtensions`). Vercel 빌더가 파일 단위로 변환만 하고 경로는 안 고치기 때문에, 확장자가 없으면 Node ESM 런타임에서 모듈을 찾지 못해 500 이 납니다.

모델을 정하면 `api/_lib/engines/<이름>.ts` 에 `ServerExtractor` 구현 하나를 추가하고 `engine.ts` 의 `ENGINES` 에 등록한 뒤 `EXTRACT_ENGINE=<이름>` 으로 고릅니다. API 키는 서버 환경변수에만 둡니다. 응답 계약(`ExtractionResultSchema`)과 샘플은 `src/entities/certificate` 의 것을 상대 경로로 그대로 가져다 써서 브라우저와 서버가 같은 형태를 검증합니다.

## 배포 (Vercel)

1. Vercel 에서 GitHub 저장소를 import 합니다. Vite 프로젝트로 자동 인식되고 `api/` 는 서버리스 함수로 올라갑니다 (`vercel.json`: SPA rewrite, 함수 60초).
2. 환경변수를 넣습니다: `VITE_ACCESS_CODE_HASH`(접근 코드 해시, Config 유형), `EXTRACT_ENGINE=gemini`, `GEMINI_API_KEY`(Secret), `DAILY_LIMIT_PER_IP`. 모델을 바꾸려면 `GEMINI_MODEL`.
3. `git push` 하면 빌드·배포됩니다. 로그는 Vercel 대시보드의 함수 로그에서 봅니다.

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
api/            서버리스 함수 (FSD 바깥, 위 "서버" 참고)
src/
  app/          진입점, providers(router, react-query), 글로벌 CSS(@theme 토큰), 접근 게이트 적용
  pages/        home(서류 메뉴) · upload(서류별 업로드) · editor(편집) · error(404)
  widgets/
    documents/            서류 feature 들을 묶는 등록표(종류 → 템플릿·시트·샘플)와 홈 메뉴. feature 끼리는 서로 모르므로 조합은 여기서
  features/
    marriage/             메뉴 "수리증명서": 템플릿 model · 한국어 양식 시트 ui · 샘플 mock
    basic/                메뉴 "기본증명서(상세)": 템플릿 model · 일본어 양식 시트 ui(2쪽) · 샘플 mock
    family/               메뉴 "가족관계증명서(상세)": 템플릿 model · 일본어 양식 시트 ui(1쪽) · 샘플 mock
    access-gate/          접근 코드 입력·검증 (해시 비교, 통과한 코드를 탭 단위 기억)
    upload/               드롭존·파일 검증 · 업로드→변환·축소→엔진→문서 열기 · 샘플 체험 · 개인정보 안내 (템플릿·샘플은 props)
    translation-editor/   원본 패널 · 양식 편집(표/세로 목록) · 상태 칩 · 툴바(모바일 하단 바) · 번역자 입력 (시트는 props)
    export/               인쇄 미리보기 버튼 (시트는 props)
  entities/
    certificate/          서류와 무관한 문서 모델: 추출 결과 계약(zod) · 문서(템플릿을 들고 있음) 스토어 · 칸 값/상태/정규화 · 번역자 스토어·확인서(ko/ja) · remote 엔진(/api/extract)
  shared/
    env/        환경변수 (접근 코드 해시 · 엔진 선택)
    lib/        access-code(탭 저장·헤더 인코딩) · crypto(sha256) · date-jp(연호→서기 · 년월일→年月日) · file(파일 종류 표) · image(HEIC→JPEG · 축소 · canvas→JPEG) · pdf(쪽 렌더) · template(양식 엔진: 템플릿 타입 · 가변 행 키 헬퍼 · 샘플 헬퍼) · react-query · react-router · test · utils
    ui/         button · error-fallback · fallback-loading · layout · print(A4 시트 · 인쇄 미리보기 · iframe 인쇄) · sheet(양식 시트 공통 스타일·props)
```

- 레이어 import 는 `@/shared`, `@/entities`, `@/features`, `@/widgets`, `@/pages` alias 만 사용하며, 슬라이스 내부 경로 직접 import 와 feature 간 import 는 ESLint 로 금지됩니다. 각 슬라이스는 `index.ts` 로 public API 를 노출합니다.
- 라우트 경로는 `@/shared/lib/react-router` 의 `ROUTE_PATHS` / `routePaths` 로만 참조합니다.
- 상세 컨벤션: `.claude/skills/sho-me-sho-conventions/SKILL.md`

## 다음 단계 (미정)

- 혼인관계증명서(기본증명서와 같은 틀) · 여권 양식 추가
- 가변 행 직접 추가·삭제 (지금은 모델이 읽은 행만 수정 가능)
- 다른 모델(Claude · GPT)도 같은 `ServerExtractor` 로 붙여 같은 증명서로 비교
- IP 한도를 KV(Upstash Redis 등)로 옮겨 인스턴스와 무관하게 정확히 세기
- 모델 제공사 콘솔의 월 지출 상한 설정
