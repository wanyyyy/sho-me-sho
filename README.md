# 증명서 번역 (sho-me-sho)

한일 혼인신고용 증명서 사진이나 PDF 를 올리면 AI(Gemini)가 내용을 읽어 제출용 번역 양식에 채워 주는 웹 앱입니다. 틀린 칸은 원본을 보며 직접 고친 뒤 인쇄하거나 PDF 로 저장합니다.

| 서류                    | 번역 방향       | 제출처      | 출력        |
| ----------------------- | --------------- | ----------- | ----------- |
| 수리증명서 (受理証明書) | 일본어 → 한국어 | 한국 구청   | 가로 A4 1장 |
| 기본증명서(상세)        | 한국어 → 일본어 | 일본 시약소 | 세로 A4 2장 |
| 가족관계증명서(상세)    | 한국어 → 일본어 | 일본 시약소 | 세로 A4 1장 |
| 혼인관계증명서(상세)    | 한국어 → 일본어 | 일본 시약소 | 세로 A4 1장 |

## 기능

- **업로드:** JPG · PNG · WEBP · HEIC(아이폰) · PDF, 20MB 이하, 최대 3쪽. HEIC·PDF 는 브라우저에서 JPEG 로 바꾸고, 긴 변 1,568px 로 줄여 보냅니다.
- **읽기·번역:** 서버 함수(`/api/extract`)가 Gemini 에 칸별 원문·번역·신뢰도를 JSON 으로 받아 양식에 채웁니다. 실제 증명서 1장 기준 약 13초. 날짜는 모델 결과와 무관하게 원문(연호 포함)에서 다시 계산합니다.
- **검토·수정:** 원본과 양식을 나란히 놓고 칸 단위로 고칩니다. 신뢰도가 낮거나 인명인 칸은 "확인 필요"로 표시합니다. 고친 값은 따로 보관해서 "다시 읽기"를 해도 지워지지 않습니다.
- **출력:** 원본 서식의 표 구조를 그대로 따른 번역 양식과 번역 확인서(번역일·번역자·관계)를 인쇄하거나 PDF 로 저장합니다.
- **모바일:** 좁은 화면에서는 표 대신 세로 목록으로 편집합니다.
- **접근 코드(선택):** 코드를 아는 사람만 쓸 수 있게 막습니다. 서버도 같은 코드를 검사합니다.

## 시작하기

```sh
pnpm install
pnpm dev            # http://localhost:5173
```

Node 22.12 이상, pnpm 12 가 필요합니다. `pnpm dev` 는 기본으로 브라우저 안의 샘플 엔진을 써서 키 없이 바로 돌아갑니다. "샘플로 체험하기"를 누르면 편집 화면으로 갑니다.

### 환경변수

`.env.example` 을 `.env.local` 로 복사해서 필요한 것만 채웁니다. `.env.local` 은 커밋되지 않습니다.

| 이름                    | 쓰는 곳  | 설명                                                                                             |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `VITE_EXTRACTOR`        | 브라우저 | `remote` 면 `/api/extract` 호출, `mock` 이면 브라우저 안 샘플. 비우면 배포는 remote, 로컬은 mock |
| `VITE_ACCESS_CODE_HASH` | 둘 다    | 접근 코드의 SHA-256 해시 (`pnpm access:hash <코드>`). 비우면 게이트 꺼짐                         |
| `ACCESS_CODE_HASH`      | 서버     | 서버만 다른 해시를 쓰고 싶을 때. 있으면 위 값보다 우선                                           |
| `EXTRACT_ENGINE`        | 서버     | `sample`(샘플 데이터) 또는 `gemini`                                                              |
| `GEMINI_API_KEY`        | 서버     | Gemini API 키 (https://aistudio.google.com/apikey)                                               |
| `GEMINI_MODEL`          | 서버     | 비우면 `api/_lib/engines/gemini.ts` 의 기본 모델                                                 |
| `DATABASE_URL`          | 서버     | 호출 로그를 쌓을 Neon Postgres 주소. 비우면 콘솔에만 기록                                        |

로컬에서 서버 함수까지 돌려 보려면 `VITE_EXTRACTOR=remote` 를 넣습니다. `pnpm dev` 가 `api/` 의 핸들러를 같은 주소에 붙여 줍니다 (`vite.api-routes.ts`).

## 구조

[Feature-Sliced Design](https://feature-sliced.design/kr/) 을 따릅니다.

```
api/                   Vercel 서버리스 함수 (FSD 바깥)
  extract.ts           POST /api/extract: 접근 코드 → 업로드 검사 → 엔진 호출 → 로그
  _lib/                접근 코드 · 업로드 검사 · 서류 등록표 · 엔진(sample, gemini) · 로그 · DB
db/schema.sql          로그 테이블
src/
  app/                 진입점, providers, 글로벌 CSS(@theme 토큰), 접근 게이트
  pages/               home(서류 메뉴) · upload · editor · error
  widgets/documents/   서류 feature 등록표와 홈 메뉴 (feature 조합은 여기서)
  features/
    marriage/ basic/ family/ marital/   서류 하나 = 템플릿 model · 양식 시트 ui · 샘플 mock
    upload/            드롭존 · 변환 · 엔진 호출 · 개인정보 안내
    translation-editor/  원본 패널 · 양식 편집 · 상태 칩 · 번역자 입력
    export/            인쇄 미리보기
    access-gate/       접근 코드 입력
  entities/certificate/  추출 결과 계약(zod) · 문서·번역자 스토어 · 칸 값 정규화 · remote 엔진
  shared/              env · lib(template 양식 엔진, date-jp, image, pdf …) · ui(print, sheet …)
```

**import 규칙**

- 레이어 간에는 `@/shared` 같은 별칭과 슬라이스의 `index.ts` 만 씁니다. 슬라이스 내부 경로 직접 import 와 feature 끼리의 import 는 ESLint 가 막습니다.
- **예외: `api/` 와 `api/` 가 가져오는 `src` 파일**(서류 `*.model.ts`·`*.mock.ts`, `certificate.contracts/types.ts`, `shared/lib/template`)은 별칭 없이 상대 경로에 `.ts` 확장자를 붙입니다 (`../../shared/lib/template/index.ts`). Vercel 함수는 번들 없이 Node ESM 그대로 돌아서 별칭을 못 풀고 500 이 납니다. ESLint(`apiReachableConfig`)와 `api/extract.test.ts` 의 순수 Node import 테스트가 검사합니다.
- 상세 컨벤션: `.claude/skills/sho-me-sho-conventions/SKILL.md`

## 양식 추가하기

서류 하나는 `src/features/<이름>/` 의 템플릿 선언(`DocumentTemplate`)으로 정해집니다. 번역 방향, 칸 목록, 가변 행, 모델 지시 규칙, 모바일 목록 묶음, 파일명이 모두 여기 들어 있고, 홈 메뉴 · 업로드 · 편집 · 인쇄 · Gemini 지시문과 응답 스키마가 이 선언에서 자동으로 따라옵니다.

1. `src/features/<이름>/` 에 `<이름>.model.ts`(템플릿), `<이름>-sheet.ui.tsx`(양식 시트), `<이름>.mock.ts`(샘플), `index.ts` 를 만듭니다. model·mock 은 위 import 예외 규칙을 따릅니다.
2. `src/entities/certificate/certificate.contracts.ts` 의 `DocumentTypeSchema` 에 종류를 추가합니다.
3. 브라우저용 `src/widgets/documents/documents.model.ts`, 서버용 `api/_lib/documents.ts` 두 등록표에 등록합니다.

칸 키는 `person.0.name` 처럼 행 번호가 들어간 평면 키입니다. 가변 행은 모델이 배열로 돌려주고 서버가 평면 키로 펴서 브라우저와 같은 계약을 유지합니다.

<details>
<summary>지금 양식들의 칸 구성</summary>

**수리증명서 (marriage)**: 신고(종류·신고일) · 신고인 ×2 · 사건본인 ×4(읽기·성명·관계·본적 또는 국적·생년월일) · 신고의 요지 ×2 · 발행(발행번호·수리일·발행일·발행자 + 직인) · 번역 확인서

**기본증명서(상세) (basic)**: 등록기준지 · 상세내용(가변 행) · 본인(성명·출생연월일·주민등록번호·성별·본) · 일반등록사항(가변 행) · 증명 · 2쪽 발급 정보(발급시각·담당자·전화·신청인·수입증지·직인, 1쪽만 올리면 직접 입력) · 翻訳証明書

**가족관계증명서(상세) (family)**: 등록기준지 · 본인 · 가족사항(가변 행, 父·母·配偶者·子) · 증명 · 발급 정보 · 翻訳証明書

**혼인관계증명서(상세) (marital)**: 등록기준지 · 본인 · 혼인사항(가변 행) · 상세내용(가변 행, 婚姻·離婚) · 증명 · 발급 정보 · 翻訳証明書. 기록이 없으면 "記録する事項がありません。"

</details>

## 배포 (Vercel)

1. GitHub 저장소를 Vercel 에 연결합니다. Vite 프로젝트로 인식되고 `api/` 는 서버리스 함수로 올라갑니다 (`vercel.json`: SPA rewrite, 함수 60초).
2. 환경변수 `EXTRACT_ENGINE=gemini`, `GEMINI_API_KEY`, 필요하면 `VITE_ACCESS_CODE_HASH` 를 넣습니다.
3. Storage 에서 Neon 을 연결하면 `DATABASE_URL` 이 자동으로 들어갑니다. 지역은 함수와 같은 미국 동부(`us-east-1`)로 둡니다. 테이블은 로컬 `.env.local` 에 같은 주소를 넣고 `pnpm db:setup` 으로 한 번 만듭니다.
4. `main` 에 push 하면 자동으로 배포됩니다.

### 로그 보기

호출 1건마다 Vercel 함수 로그에 한 줄, `DATABASE_URL` 이 있으면 `request_logs` 테이블에도 한 행이 남습니다. 저장은 응답을 보낸 뒤에 끝나고, 실패해도 업로드에는 영향이 없습니다. 조회는 Neon 콘솔의 SQL Editor 에서 합니다.

```sql
-- 날짜별 호출 수·토큰
select date(at at time zone 'Asia/Seoul') as day, count(*), sum(input_tokens + output_tokens) as tokens
from request_logs where env = 'production' group by 1 order by 1 desc;

-- 최근 서버 에러
select at, document_type, engine, error from request_logs where status = 500 order by at desc limit 20;
```

## 개인정보

- 올린 이미지와 번역 결과는 서버나 DB 에 저장하지 않습니다. 이미지는 읽기를 위해 Gemini 로 전송됩니다.
- 로그에는 시각 · 환경 · 요청 ID · IP · 서류 종류 · 쪽수 · 파일 크기 · 엔진 · 상태 · 걸린 시간 · 토큰 수 · 500 에러 메시지만 남습니다 (`api/_lib/log.ts`).
- 접근 코드는 원문을 어디에도 두지 않고 해시만 비교합니다. 통과한 코드는 탭 단위(sessionStorage)로만 기억합니다.
- 브라우저 저장소(localStorage · IndexedDB)를 쓰지 않아서, 탭을 닫으면 파일과 수정 내용이 모두 사라집니다.

## Scripts

| 명령               | 설명                                |
| ------------------ | ----------------------------------- |
| `pnpm dev`         | 로컬 개발 서버                      |
| `pnpm build`       | 타입체크 + 빌드                     |
| `pnpm preview`     | 빌드 결과 미리보기                  |
| `pnpm lint`        | ESLint                              |
| `pnpm typecheck`   | `tsc --noEmit`                      |
| `pnpm format`      | Prettier                            |
| `pnpm test`        | Vitest (`test:ui`, `test:coverage`) |
| `pnpm access:hash` | 접근 코드 → SHA-256 해시            |
| `pnpm db:setup`    | 로그 테이블 생성 (`.env.local`)     |

## 다음 단계

- 개인정보 안내문(`privacy-notice.ui.tsx`)에 이미지가 Gemini 로 전송된다는 내용 추가
- 여권 양식 추가
- 가변 행 직접 추가·삭제 (지금은 모델이 읽은 행만 수정 가능)
- 다른 모델(Claude · GPT)을 같은 `ServerExtractor` 로 붙여 비교
- Gemini 월 지출 상한 설정
