import { accessCodeHeader } from "@/shared/lib/access-code";
import { ExtractionResultSchema } from "./certificate.contracts";
import { DocumentType, Extractor } from "./certificate.types";

export const EXTRACT_ENDPOINT = "/api/extract";

const FALLBACK_MESSAGE: Record<number, string> = {
  401: "접근 코드가 맞지 않습니다. 새로고침 후 다시 입력해 주세요.",
  429: "오늘 사용할 수 있는 횟수를 넘었습니다.",
};

function errorMessage(data: unknown, status: number): string {
  const fromServer =
    typeof data === "object" && data !== null && "error" in data
      ? (data as { error?: unknown }).error
      : undefined;
  if (typeof fromServer === "string" && fromServer) return fromServer;
  return FALLBACK_MESSAGE[status] ?? `서버 오류 (${status})`;
}

/** 서버 함수(/api/extract)에 이미지를 보내고 계약(ExtractionResultSchema)대로 검증해 받는다 */
export const remoteExtractor: Extractor = {
  async extract(files: File[], documentType: DocumentType) {
    const body = new FormData();
    for (const file of files) body.append("file", file, file.name);
    body.append("documentType", documentType);
    const response = await fetch(EXTRACT_ENDPOINT, {
      method: "POST",
      headers: { "x-access-code": accessCodeHeader() },
      body,
    });
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error(errorMessage(data, response.status));
    return ExtractionResultSchema.parse(data);
  },
};
