import {
  type DocumentType,
  MAX_PAGES,
} from "../../src/entities/certificate/certificate.types.ts";
import { MAX_FILE_BYTES } from "../../src/shared/lib/file/file-kind.lib.ts";
import type { DocumentTemplate } from "../../src/shared/lib/template/template.types.ts";
import { parseDocumentType, templateOf } from "./documents.ts";
import type { ImageInput } from "./engine.ts";

/** 클라이언트가 보내는 형식. HEIC·PDF 는 브라우저에서 이미 JPEG 로 바꿔 보낸다 */
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

export const ACCESS_CODE_HEADER = "x-access-code";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** 프록시 뒤에서 실제 접속 IP. 로그·횟수 제한 키로만 쓴다 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

/** 헤더는 ASCII 만 허용되므로 클라이언트가 encodeURIComponent 로 보낸다 */
export function accessCodeOf(request: Request): string | null {
  const raw = request.headers.get(ACCESS_CODE_HEADER);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

export type Upload = {
  images: ImageInput[];
  template: DocumentTemplate<DocumentType>;
};

async function toImage(file: File): Promise<ImageInput> {
  if (!ALLOWED_MIME.includes(file.type)) {
    throw new HttpError(415, "JPG, PNG, WEBP 이미지만 받을 수 있습니다.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new HttpError(413, "파일이 너무 큽니다.");
  }
  return {
    bytes: new Uint8Array(await file.arrayBuffer()),
    mimeType: file.type,
    name: file.name,
  };
}

/** multipart 의 file(쪽 순서, 1~MAX_PAGES)과 documentType 을 꺼내 형식·크기·서류 종류를 검사한다 */
export async function readUpload(request: Request): Promise<Upload> {
  const form = await request.formData().catch(() => null);
  const documentType = parseDocumentType(form?.get("documentType"));
  if (!documentType) throw new HttpError(400, "지원하지 않는 서류 종류입니다.");
  const files = (form?.getAll("file") ?? []).filter(
    (f): f is File => f instanceof File && f.size > 0,
  );
  if (files.length === 0) throw new HttpError(400, "파일이 없습니다.");
  if (files.length > MAX_PAGES) {
    throw new HttpError(400, `한 번에 ${MAX_PAGES}쪽까지만 보낼 수 있습니다.`);
  }
  return {
    images: await Promise.all(files.map(toImage)),
    template: templateOf(documentType),
  };
}
