import { fieldOf } from "@/shared/lib/template";
import {
  CertificateDocument,
  FieldStatus,
  fieldValue,
  sourceValue,
} from "@/entities/certificate";
import { EditableCell } from "./editable-cell.ui";
import { StatusChip } from "./status-chip.ui";

type FieldListProps = {
  doc: CertificateDocument;
  statuses: Record<string, FieldStatus>;
  onChange: (key: string, value: string) => void;
};

/** 좁은 화면용: 표 대신 묶음별 세로 목록. 칸마다 라벨·입력·원문·상태 */
export function FieldList({ doc, statuses, onChange }: FieldListProps) {
  const { template } = doc;
  return (
    <div className="flex flex-col gap-9">
      {template.sections(doc).map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h3 className="text-ink-900 border-ink-900 mb-3 border-b-2 pb-1.5 text-base font-semibold tracking-wide">
            {section.title}
          </h3>
          <div className="flex flex-col gap-4">
            {section.keys.map((key) => {
              const field = fieldOf(template, key);
              const source = sourceValue(doc, key);
              const status = statuses[key] ?? "missing";
              return (
                <div key={key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink-600 text-sm">
                      {field.labelKo.replace(`${section.title} `, "")}
                      <span className="text-ink-400 ml-1 text-xs">
                        {field.labelJa}
                      </span>
                    </span>
                    <StatusChip status={status} />
                  </div>
                  <EditableCell
                    field={field}
                    value={fieldValue(doc, key)}
                    source={source}
                    status={status}
                    onChange={onChange}
                    className="h-11 text-base"
                  />
                  {source && (
                    <span className="text-ink-400 text-xs">{source}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
