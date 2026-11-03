import { z } from "zod";

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);

/** 지원하는 증명서 종류. 양식을 추가할 때 함께 늘린다 */
export const DocumentTypeSchema = z.enum(["marriage"]);

/** 모델이 뽑아낸 항목 하나. ja = 원문 그대로, ko = 번역 */
export const ExtractedFieldSchema = z.object({
  ja: z.string(),
  ko: z.string(),
  confidence: ConfidenceSchema,
});

/** 읽기·번역 단계의 출력 (모델 응답 계약) */
export const ExtractionResultSchema = z.object({
  documentType: DocumentTypeSchema,
  fields: z.record(z.string(), ExtractedFieldSchema),
});
