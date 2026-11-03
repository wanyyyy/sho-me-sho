import { useMemo } from "react";
import {
  CertificateSheet,
  countStatuses,
  fieldStatuses,
  fieldValue,
  MARRIAGE_FIELDS,
  useCertificateDocument,
  useCertificateStore,
} from "@/entities/certificate";
import { EditableCell } from "./editable-cell.ui";
import { FieldList } from "./field-list.ui";
import { PanelHeader } from "./panel-header.ui";
import { StatusChip } from "./status-chip.ui";
import { TranslatorEditor } from "./translator-editor.ui";

/** 오른쪽: 한국어 양식을 그대로 그리고, 칸마다 input 을 넣는다 */
export function TemplatePanel() {
  const doc = useCertificateDocument();
  const edit = useCertificateStore((s) => s.edit);
  const statuses = useMemo(
    () => (doc ? fieldStatuses(doc, MARRIAGE_FIELDS) : {}),
    [doc],
  );
  if (!doc) return null;

  const counts = countStatuses(statuses);

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
          <TranslatorEditor />
        </div>
      </div>
      {/* 넓은 화면: 양식 표 그대로 */}
      <div className="border-paper-200 hidden overflow-x-auto rounded-lg border bg-white p-4 md:block">
        <CertificateSheet
          className="min-w-[560px]"
          doc={doc}
          cell={(field) => (
            <EditableCell
              field={field}
              value={fieldValue(doc, field.key)}
              source={doc.extracted[field.key]?.ja}
              status={statuses[field.key]}
              onChange={edit}
            />
          )}
          footer={<TranslatorEditor />}
        />
      </div>
      <p className="text-ink-400 hidden text-xs md:block">
        칸 위에 마우스를 올리면 일본어 원문이 보입니다. 노란 칸은 신뢰도가
        낮거나 인명이라 확인이 필요한 곳입니다.
      </p>
    </section>
  );
}
