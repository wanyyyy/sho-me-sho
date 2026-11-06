import { z } from "zod";
import { CONFIDENCES } from "@/shared/lib/template";

export const ConfidenceSchema = z.enum(CONFIDENCES);

/** 지원하는 증명서 종류. 서류 feature(features/<이름>)를 추가할 때 함께 늘린다 */
export const DocumentTypeSchema = z.enum(["marriage", "basic", "family"]);

/** 모델이 뽑아낸 항목 하나. ja/ko 중 하나는 원문, 다른 하나는 번역 (방향은 템플릿이 정한다) */
export const ExtractedFieldSchema = z.object({
  ja: z.string(),
  ko: z.string(),
  confidence: ConfidenceSchema,
});

/** 읽기·번역 단계의 출력 (모델 응답 계약). 가변 행은 `group.0.sub` 같은 평면 키로 들어온다 */
export const ExtractionResultSchema = z.object({
  documentType: DocumentTypeSchema,
  fields: z.record(z.string(), ExtractedFieldSchema),
});
