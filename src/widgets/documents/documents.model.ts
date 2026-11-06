import type { ComponentType } from "react";
import type { SheetProps } from "@/shared/ui";
import {
  type CertificateDocument,
  type CertificateTemplate,
  type DocumentType,
  DocumentTypeSchema,
  type ExtractionResult,
} from "@/entities/certificate";
import { BASIC_SAMPLE, BASIC_TEMPLATE, BasicSheet } from "@/features/basic";
import { FAMILY_SAMPLE, FAMILY_TEMPLATE, FamilySheet } from "@/features/family";
import {
  MARITAL_SAMPLE,
  MARITAL_TEMPLATE,
  MaritalSheet,
} from "@/features/marital";
import {
  MARRIAGE_SAMPLE,
  MARRIAGE_TEMPLATE,
  MarriageSheet,
} from "@/features/marriage";

/** 메뉴(서류) 하나 = 템플릿 + 양식 시트 + 샘플. 각 feature 가 제공한다 */
export type DocumentEntry = {
  template: CertificateTemplate;
  Sheet: ComponentType<SheetProps<CertificateDocument>>;
  sample: ExtractionResult;
};

/** 서류 종류 → 메뉴. 홈 메뉴 순서이기도 하다. 서류 feature 를 추가하면 여기에 등록 */
export const DOCUMENTS: Record<DocumentType, DocumentEntry> = {
  basic: { template: BASIC_TEMPLATE, Sheet: BasicSheet, sample: BASIC_SAMPLE },
  family: {
    template: FAMILY_TEMPLATE,
    Sheet: FamilySheet,
    sample: FAMILY_SAMPLE,
  },
  marital: {
    template: MARITAL_TEMPLATE,
    Sheet: MaritalSheet,
    sample: MARITAL_SAMPLE,
  },
  marriage: {
    template: MARRIAGE_TEMPLATE,
    Sheet: MarriageSheet,
    sample: MARRIAGE_SAMPLE,
  },
};

/** 홈 메뉴 순서 = 위 등록 순서 */
export const DOCUMENT_TYPES = Object.keys(DOCUMENTS) as DocumentType[];

export const documentOf = (type: DocumentType): DocumentEntry =>
  DOCUMENTS[type];

/** 문자열(URL 파라미터)을 서류 종류로. 모르면 null */
export function parseDocumentType(value: unknown): DocumentType | null {
  const parsed = DocumentTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
