import { toKoreanDate } from "@/shared/lib/date-jp";
import {
  CertificateDocument,
  ExtractionResult,
  TemplateField,
} from "./certificate.types";
import { MARRIAGE_FIELD_MAP } from "./marriage.template";

/** 화면에 보이는 값 = 사용자 수정값 ?? 모델 번역값 */
export function fieldValue(doc: CertificateDocument, key: string): string {
  return doc.edits[key] ?? doc.extracted[key]?.ko ?? "";
}

export type FieldStatus = "edited" | "review" | "ok" | "missing";

export const FIELD_STATUS_LABELS: Record<FieldStatus, string> = {
  ok: "확인됨",
  review: "확인 필요",
  edited: "수정됨",
  missing: "읽지 못함",
};

/** 신뢰도와 무관하게 항상 사람이 확인해야 하는 종류 (인명 표기) */
const REVIEW_KINDS: ReadonlySet<TemplateField["kind"]> = new Set(["name"]);

/** 칸 상태. 수정됨 > 확인 필요(신뢰도 낮음·인명) > 확인됨. 원문·번역 모두 빈 칸은 missing */
export function fieldStatus(
  doc: CertificateDocument,
  field: TemplateField,
): FieldStatus {
  if (field.key in doc.edits) return "edited";
  const extracted = doc.extracted[field.key];
  if (!extracted || (!extracted.ja && !extracted.ko)) return "missing";
  if (REVIEW_KINDS.has(field.kind) || extracted.confidence !== "high")
    return "review";
  return "ok";
}

/** 모든 칸의 상태를 한 번에 (렌더마다 칸별로 다시 계산하지 않도록) */
export function fieldStatuses(
  doc: CertificateDocument,
  fields: TemplateField[],
): Record<string, FieldStatus> {
  return Object.fromEntries(fields.map((f) => [f.key, fieldStatus(doc, f)]));
}

/** 상태별 칸 수 (편집 화면 범례용) */
export function countStatuses(
  statuses: Record<string, FieldStatus>,
): Record<FieldStatus, number> {
  const counts: Record<FieldStatus, number> = {
    edited: 0,
    review: 0,
    ok: 0,
    missing: 0,
  };
  for (const status of Object.values(statuses)) counts[status] += 1;
  return counts;
}

/**
 * 엔진 출력 후처리. 어떤 Extractor 구현이든 거친다:
 * date 칸은 원문 연호를 서기로 다시 계산해 모델 번역보다 우선한다
 */
export function normalizeExtraction(
  result: ExtractionResult,
): ExtractionResult {
  const fields = Object.fromEntries(
    Object.entries(result.fields).map(([key, f]) => [
      key,
      MARRIAGE_FIELD_MAP[key]?.kind === "date" && f.ja
        ? { ...f, ko: toKoreanDate(f.ja) }
        : f,
    ]),
  );
  return { ...result, fields };
}
