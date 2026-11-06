import { toJapaneseDate, toKoreanDate } from "@/shared/lib/date-jp";
import {
  documentKeys,
  type ExtractedField,
  fieldOf,
  type TemplateField,
} from "@/shared/lib/template";
import {
  CertificateDocument,
  CertificateTemplate,
  ExtractionResult,
} from "./certificate.types";

/** 화면에 보이는 값 = 사용자 수정값 ?? 모델 번역값 (번역 언어는 템플릿이 정한다) */
export function fieldValue(doc: CertificateDocument, key: string): string {
  return doc.edits[key] ?? doc.extracted[key]?.[doc.template.target] ?? "";
}

/** 모델이 읽은 원문 (툴팁·대조용) */
export function sourceValue(doc: CertificateDocument, key: string): string {
  return doc.extracted[key]?.[doc.template.source] ?? "";
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

/** 문서의 모든 칸(고정 + 가변 행) 상태를 한 번에 (렌더마다 칸별로 다시 계산하지 않도록) */
export function fieldStatuses(
  doc: CertificateDocument,
): Record<string, FieldStatus> {
  return Object.fromEntries(
    documentKeys(doc.template, doc).map((key) => [
      key,
      fieldStatus(doc, fieldOf(doc.template, key)),
    ]),
  );
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

/** date 칸의 번역을 원문에서 다시 계산한다 (연호→서기, 년월일→年月日). 모델 번역보다 우선 */
function normalizeDate(
  field: ExtractedField,
  target: "ja" | "ko",
): ExtractedField {
  if (target === "ko" && field.ja)
    return { ...field, ko: toKoreanDate(field.ja) };
  if (target === "ja" && field.ko)
    return { ...field, ja: toJapaneseDate(field.ko) };
  return field;
}

/** 엔진 출력 후처리. 어떤 Extractor 구현이든 거친다 */
export function normalizeExtraction(
  result: ExtractionResult,
  template: CertificateTemplate,
): ExtractionResult {
  const fields = Object.fromEntries(
    Object.entries(result.fields).map(([key, f]) => [
      key,
      fieldOf(template, key).kind === "date"
        ? normalizeDate(f, template.target)
        : f,
    ]),
  );
  return { ...result, fields };
}
