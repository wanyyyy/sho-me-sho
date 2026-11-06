import type { ReactNode } from "react";
import type { TemplateDocument, TemplateField } from "@/shared/lib/template";

/** 칸 하나를 그린다. 편집 화면은 input, 인쇄는 텍스트 */
export type CellRenderer = (field: TemplateField) => ReactNode;

/** 양식 시트 공통 props (서류 종류마다 시트 컴포넌트가 하나씩) */
export type SheetProps<TDoc extends TemplateDocument = TemplateDocument> = {
  doc: TDoc;
  cell: CellRenderer;
  /** 칸의 현재 값 (고정 문구에 값을 끼워 넣거나 행을 묶을 때) */
  value: (key: string) => string;
  /** 양식 맨 아래 (번역자 확인서 등) */
  footer?: ReactNode;
  className?: string;
};
