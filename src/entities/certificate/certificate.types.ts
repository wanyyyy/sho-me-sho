import type { z } from "zod";
import type { DocumentTemplate, ExtractedField } from "@/shared/lib/template";
import type {
  DocumentTypeSchema,
  ExtractionResultSchema,
} from "./certificate.contracts.ts";

export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

/** 서류 하나의 템플릿 선언. 선언 자체는 메뉴별 feature(features/marriage 등)에 있다 */
export type CertificateTemplate = DocumentTemplate<DocumentType>;

export type SourceFile = {
  name: string;
  /** 쪽별 미리보기 이미지 object URL (사진은 원본, PDF 는 쪽 렌더). 샘플은 빈 배열 */
  previewUrls: string[];
};

/** 한 번에 보낼 수 있는 최대 쪽수 (사진 여러 장 또는 PDF 쪽) */
export const MAX_PAGES = 3;

/**
 * 작업 중인 증명서 1건. extracted 는 모델 결과(불변), edits 는 사용자가 고친 값만.
 * 문서가 자기 템플릿을 들고 있어 번역 방향·칸 목록을 어디서든 알 수 있다
 */
export type CertificateDocument = {
  id: string;
  template: CertificateTemplate;
  source: SourceFile;
  extracted: Record<string, ExtractedField>;
  edits: Record<string, string>;
};

/** 읽기·번역 엔진 인터페이스 (서버 /api/extract). files 는 쪽 순서대로 */
export interface Extractor {
  extract(files: File[], documentType: DocumentType): Promise<ExtractionResult>;
}
