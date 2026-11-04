import type { z } from "zod";
import type {
  ConfidenceSchema,
  DocumentTypeSchema,
  ExtractedFieldSchema,
  ExtractionResultSchema,
} from "./certificate.contracts.ts";

export type Confidence = z.infer<typeof ConfidenceSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type ExtractedField = z.infer<typeof ExtractedFieldSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

export type SourceFile = {
  name: string;
  /** 미리보기 이미지 object URL (사진은 원본, PDF 는 첫 페이지 렌더) */
  previewUrl: string;
};

/** 작업 중인 증명서 1건. extracted 는 모델 결과(불변), edits 는 사용자가 고친 값만 */
export type CertificateDocument = {
  id: string;
  documentType: DocumentType;
  source: SourceFile;
  extracted: Record<string, ExtractedField>;
  edits: Record<string, string>;
};

/**
 * 양식 칸 선언 (코드로 고정). key 는 추출 결과의 키와 1:1.
 * kind 가 동작을 정한다: date 는 연호→서기 정규화, name 은 항상 확인 필요
 */
export type TemplateField = {
  key: string;
  labelKo: string;
  /** 원본 항목명. 모델 프롬프트·툴팁용 */
  labelJa: string;
  kind: "text" | "date" | "name" | "number";
};

/** 읽기·번역 엔진 인터페이스. 구현은 mock → 실제 모델 호출로 교체 */
export interface Extractor {
  extract(file: File): Promise<ExtractionResult>;
}
