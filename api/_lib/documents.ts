import { DocumentTypeSchema } from "../../src/entities/certificate/certificate.contracts.ts";
import type {
  DocumentType,
  ExtractionResult,
} from "../../src/entities/certificate/certificate.types.ts";
import { BASIC_SAMPLE } from "../../src/features/basic/basic.mock.ts";
import { BASIC_TEMPLATE } from "../../src/features/basic/basic.model.ts";
import { FAMILY_SAMPLE } from "../../src/features/family/family.mock.ts";
import { FAMILY_TEMPLATE } from "../../src/features/family/family.model.ts";
import { MARITAL_SAMPLE } from "../../src/features/marital/marital.mock.ts";
import { MARITAL_TEMPLATE } from "../../src/features/marital/marital.model.ts";
import { MARRIAGE_SAMPLE } from "../../src/features/marriage/marriage.mock.ts";
import { MARRIAGE_TEMPLATE } from "../../src/features/marriage/marriage.model.ts";
import type { DocumentTemplate } from "../../src/shared/lib/template/template.types.ts";

/**
 * 서버용 서류 등록표. 브라우저의 widgets/documents 와 같은 목록이지만
 * 시트(React)는 빼고 템플릿·샘플만 가져온다 (서버 번들에 React 가 들어가지 않게)
 */
export const TEMPLATES: Record<DocumentType, DocumentTemplate<DocumentType>> = {
  marriage: MARRIAGE_TEMPLATE,
  basic: BASIC_TEMPLATE,
  family: FAMILY_TEMPLATE,
  marital: MARITAL_TEMPLATE,
};

export const SAMPLES: Record<DocumentType, ExtractionResult> = {
  marriage: MARRIAGE_SAMPLE,
  basic: BASIC_SAMPLE,
  family: FAMILY_SAMPLE,
  marital: MARITAL_SAMPLE,
};

export const templateOf = (type: DocumentType) => TEMPLATES[type];

export function parseDocumentType(value: unknown): DocumentType | null {
  const parsed = DocumentTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
