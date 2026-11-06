import { type ComponentType, useMemo } from "react";
import type { SheetProps } from "@/shared/ui";
import {
  CertificateDocument,
  countStatuses,
  fieldStatuses,
  fieldValue,
  sourceValue,
  useCertificateDocument,
  useCertificateStore,
} from "@/entities/certificate";
import { EditableCell } from "./editable-cell.ui";
import { FieldList } from "./field-list.ui";
import { PanelHeader } from "./panel-header.ui";
import { StatusChip } from "./status-chip.ui";
import { TranslatorEditor } from "./translator-editor.ui";

const SOURCE_LANG_LABEL = { ja: "일본어", ko: "한국어" } as const;

type TemplatePanelProps = {
  /** 문서 종류에 맞는 양식 시트 (widgets/documents 가 고른다) */
  Sheet: ComponentType<SheetProps<CertificateDocument>>;
};

/** 오른쪽: 번역 양식을 그대로 그리고, 칸마다 input 을 넣는다 */
export function TemplatePanel({ Sheet }: TemplatePanelProps) {
  const doc = useCertificateDocument();
  const edit = useCertificateStore((s) => s.edit);
  const statuses = useMemo(() => (doc ? fieldStatuses(doc) : {}), [doc]);
  if (!doc) return null;

  const { template } = doc;
  const counts = countStatuses(statuses);
  const minWidth =
    template.orientation === "landscape" ? "min-w-[560px]" : "min-w-[520px]";

  return (
    <section aria-label="번역 양식" className="flex min-w-0 flex-col gap-3">
      <PanelHeader
        title="번역 양식"
        aside={
          <span className="flex gap-1.5">
            <StatusChip status="review" count={counts.review} />
            <StatusChip status="edited" count={counts.edited} />
            <StatusChip status="ok" count={counts.ok} />
          </span>
        }
      />
      {/* 좁은 화면: 세로 목록 */}
      <div className="border-paper-200 rounded-lg border bg-white p-4 md:hidden">
        <FieldList doc={doc} statuses={statuses} onChange={edit} />
        <div className="border-paper-200 mt-5 border-t pt-4">
          <TranslatorEditor lang={template.target} />
        </div>
      </div>
      {/* 넓은 화면: 양식 표 그대로 */}
      <div className="border-paper-200 hidden overflow-x-auto rounded-lg border bg-white p-4 md:block">
        <Sheet
          className={minWidth}
          doc={doc}
          cell={(field) => (
            <EditableCell
              field={field}
              value={fieldValue(doc, field.key)}
              source={sourceValue(doc, field.key)}
              status={statuses[field.key] ?? "missing"}
              onChange={edit}
            />
          )}
          value={(key) => fieldValue(doc, key)}
          footer={<TranslatorEditor lang={template.target} />}
        />
      </div>
      <p className="text-ink-400 hidden text-xs md:block">
        칸 위에 마우스를 올리면 {SOURCE_LANG_LABEL[template.source]} 원문이
        보입니다. 노란 칸은 신뢰도가 낮거나 인명이라 확인이 필요한 곳입니다.
      </p>
    </section>
  );
}
