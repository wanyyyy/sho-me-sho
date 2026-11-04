export type ExtractorName = "mock" | "remote";

/**
 * 읽기·번역 엔진 선택. remote = /api/extract 호출, mock = 브라우저 안 샘플.
 * VITE_EXTRACTOR 가 없으면 배포 빌드는 remote, 개발은 mock
 */
export const EXTRACTOR_NAME: ExtractorName = resolve(
  import.meta.env.VITE_EXTRACTOR,
  import.meta.env.PROD,
);

function resolve(raw: string | undefined, prod: boolean): ExtractorName {
  if (raw === "mock" || raw === "remote") return raw;
  return prod ? "remote" : "mock";
}
